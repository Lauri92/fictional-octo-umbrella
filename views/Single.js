import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  TextInput,
  View,
  Button,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, Card, ListItem, Text, Overlay} from 'react-native-elements';
import moment from 'moment';
import {useTag, useUser, useComment} from '../hooks/ApiHooks';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import {ScrollView} from 'react-native-gesture-handler';
import CommentList from '../components/CommentList';
import FloatingActionButton from '../components/FloatingActionButton';
import FavoriteButton from '../components/FavoriteButton';
import useCommentForm from '../hooks/CommentHooks';
import {MainContext} from '../contexts/MainContext';

const Single = ({route}) => {
  const {file} = route.params;
  console.log(file);
  const allData = JSON.parse(file.description);
  const {description, price, location} = allData;
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const [owner, setOwner] = useState({username: 'somebody'});
  const {getFilesByTag} = useTag();
  const {getUser} = useUser();
  const {uploadComment} = useComment();
  const {update, setUpdate} = useContext(MainContext);
  const [videoRef, setVideoRef] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const {handleInputChange, inputs, commentErrors} = useCommentForm();

  const doCommentUpload = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const commentInfo = {comment: inputs.comment, file_id: file.file_id};
      const resp = await uploadComment(commentInfo, userToken);
      console.log('upload response', resp);
      setUpdate(update + 1);
      toggleOverlay();

      /* Alert.alert(
        'Comment',
        'Comment uploaded',
        [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              toggleOverlay();
              console.log(update);
            },
          },
        ],
        {cancelable: false}
      ); */
    } catch (error) {
      Alert.alert('Upload', 'Failed');
      console.error(error);
    } finally {
      // setIsUploading(false);
    }
  };

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  const fetchAvatar = async () => {
    try {
      const avatarList = await getFilesByTag('avatar_' + file.user_id);
      if (avatarList.length > 0) {
        setAvatar(uploadsUrl + avatarList.pop().filename);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchOwner = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await getUser(file.user_id, userToken);
      setOwner(userData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.error('unlock', error.message);
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      console.error('lock', error.message);
    }
  };

  const handleVideoRef = (component) => {
    setVideoRef(component);
  };

  const showVideoInFullscreen = async () => {
    try {
      if (videoRef) await videoRef.presentFullscreenPlayer();
    } catch (error) {
      console.error('fullscreen', error.message);
    }
  };

  useEffect(() => {
    unlock();
    fetchAvatar();
    fetchOwner();

    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      console.log('orientation', evt);
      if (evt.orientationInfo.orientation > 2) {
        // show video in fullscreen
        showVideoInFullscreen();
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, [videoRef]);

  return (
    <>
      <ScrollView>
        <Card>
          <Card.Title h4>{file.title}</Card.Title>
          <Card.Title>{moment(file.time_added).format('LLL')}</Card.Title>
          <Card.Divider />
          {file.media_type === 'image' ? (
            <Card.Image
              source={{uri: uploadsUrl + file.filename}}
              style={styles.image}
              PlaceholderContent={<ActivityIndicator />}
            />
          ) : (
            <Video
              ref={handleVideoRef}
              source={{uri: uploadsUrl + file.filename}}
              style={styles.image}
              useNativeControls={true}
              resizeMode="cover"
              onError={(err) => {
                console.error('video', err);
              }}
              posterSource={{uri: uploadsUrl + file.screenshot}}
            />
          )}
          <Card.Divider />
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.description}>{price}€</Text>
          <Text style={styles.description}>Location: {location}</Text>
          <ListItem>
            <Avatar source={{uri: avatar}} />
            <Text>
              Posted by: {owner.username}
              {'\n'}
              Contact info: {owner.email}
            </Text>
          </ListItem>
          <Card.Divider />
        </Card>
        <Card>
          <Card.Title h2>Comments</Card.Title>
          <CommentList file={file} />
        </Card>
      </ScrollView>
      <FloatingActionButton toggleOverlay={toggleOverlay} />
      <FavoriteButton />
      {overlayVisible && (
        <>
          <Overlay
            style={styles.overlay}
            isVisible={overlayVisible}
            onBackdropPress={toggleOverlay}
          >
            <Card.Title h4>Comment this sales ad</Card.Title>
            <TextInput
              multiline={true}
              numberOfLines={4}
              maxLength={255}
              style={styles.input}
              onChangeText={(txt) => handleInputChange('comment', txt)}
              errorMessage={commentErrors.comment}
            />
            <View style={styles.container}>
              <Button color="#fcba03" onPress={toggleOverlay} title="Cancel" />
              <Button
                title="Submit"
                onPress={doCommentUpload}
                disabled={commentErrors.comment !== null}
              />
            </View>
          </Overlay>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  description: {
    marginBottom: 10,
  },
  input: {
    height: 200,
    width: 250,
    borderColor: 'gray',
    borderWidth: 1,
    textAlignVertical: 'top',
    marginBottom: 25,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cancelButton: {
    color: '#841584',
  },
});

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
