import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Icon, Avatar, ListItem as RNEListItem} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Alert} from 'react-native';

const ListItem = ({navigation, singleMedia, isMyFile}) => {
  const {
    description: {category, description, location, price},
  } = singleMedia;

  const {deleteFile} = useMedia();
  const {setUpdate, update} = useContext(MainContext);

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
        navigation.navigate('Single', {file: singleMedia}, navigation);
      }}
    >
      <Avatar
        size="large"
        rounded
        source={{uri: uploadsUrl + singleMedia.thumbnails.w160}}
      ></Avatar>

      <RNEListItem.Content>
        {isMyFile && (
          <>
            <View style={styles.iconsView}>
              <Icon
                style={styles.modifyBtton}
                size={30}
                name="edit"
                type="antdesign"
                color="#517fa4"
                onPress={() => navigation.push('Modify', {file: singleMedia})}
              ></Icon>
              <Icon
                style={styles.deleteButton}
                size={30}
                name="delete"
                type="material"
                color="#a10505"
                onPress={doDelete}
              />
            </View>
          </>
        )}
        <RNEListItem.Title h4>{singleMedia.title}</RNEListItem.Title>
        <RNEListItem.Subtitle numberOfLines={3}>
          {description}
        </RNEListItem.Subtitle>
        <RNEListItem.Subtitle>Price: {price}€</RNEListItem.Subtitle>
        <RNEListItem.Subtitle>Location: {location}</RNEListItem.Subtitle>
        <RNEListItem.Subtitle>Category: {category}</RNEListItem.Subtitle>
      </RNEListItem.Content>
      <RNEListItem.Chevron />
    </RNEListItem>
  );
};

const styles = StyleSheet.create({
  iconsView: {
    right: 90,
    // top: 115,
    width: 325,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modifyButton: {},
  deleteButton: {},
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  isMyFile: PropTypes.bool,
};

export default ListItem;
