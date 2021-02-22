import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';
import {Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Alert} from 'react-native';

const ListItem = ({navigation, singleMedia, isMyFile}) => {
  const allData = JSON.parse(singleMedia.description);
  const {description, price, location} = allData;

  const {deleteFile} = useMedia();
  const {setUpdate, update} = useContext(MainContext);
  // console.log(singleMedia);

  const doDelete = () => {
    Alert.alert(
      'Delete',
      'this file permanently?',
      [
        {text: 'Cancel'},
        {
          title: 'Ok',
          onPress: async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            try {
              await deleteFile(singleMedia.file_id, userToken);
              setUpdate(update + 1);
            } catch (error) {
              // notify user here?
              console.error(error);
            }
          },
        },
      ],
      {cancelable: false}
    );
  };

  return (
    <RNEListItem
      bottomDivider
      onPress={() => {
        navigation.navigate('Single', {file: singleMedia});
      }}
    >
      <Avatar
        size="large"
        square
        source={{uri: uploadsUrl + singleMedia.thumbnails.w160}}
      ></Avatar>
      <RNEListItem.Content>
        <RNEListItem.Title h4>{singleMedia.title}</RNEListItem.Title>
        <RNEListItem.Subtitle numberOfLines={3}>
          {description}
        </RNEListItem.Subtitle>
        <RNEListItem.Subtitle>Price: {price}€</RNEListItem.Subtitle>
        <RNEListItem.Subtitle>Location: {location}</RNEListItem.Subtitle>
        {isMyFile && (
          <>
            {/* <Button
              title="Modify"
              onPress={() => navigation.push('Modify', {file: singleMedia})}
            ></Button> */}
            <Button title="Delete" color="red" onPress={doDelete}></Button>
          </>
        )}
      </RNEListItem.Content>
      <RNEListItem.Chevron />
    </RNEListItem>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  isMyFile: PropTypes.bool,
};

export default ListItem;