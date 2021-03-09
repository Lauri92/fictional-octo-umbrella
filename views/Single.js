import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, ActivityIndicator, Linking} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Card, Text, Overlay} from 'react-native-elements';
import moment from 'moment';
import {
  useTag,
  useUser,
  useFavourites,
  useLoadComments,
  useLoadFavourites,
} from '../hooks/ApiHooks';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import {ScrollView} from 'react-native-gesture-handler';
import CommentList from '../components/CommentList';
import FloatingActionButton from '../components/FloatingActionButton';
import FavoriteButton from '../components/FavoriteButton';
import {MainContext} from '../contexts/MainContext';
import CommentOverlay from '../components/CommentOverlay';

const Single = ({route, navigation}) => {
  const {file} = route.params;
  const commentArray = useLoadComments(file.file_id);
  const favouritesArray = useLoadFavourites();
  const checkFavourite = favouritesArray.filter(
    (item) => item.file_id === file.file_id
  );
  const isFavourite = checkFavourite.length > 0 ? true : false;
  const {
    description: {category, description, location, price},
  } = file;
  const [avatar, setAvatar] = useState('http://placekitten.com/100');
  const [owner, setOwner] = useState({username: 'somebody'});
  const [isLoggedUser, setIsLoggedUser] = useState(true);
  const {getFilesByTag} = useTag();
  const {getUser, checkToken} = useUser();
  const {createFavourite, deleteFavourite} = useFavourites();
  const {update, setUpdate} = useContext(MainContext);
  const [videoRef, setVideoRef] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  const postFavourite = () => {
    console.log('Create favorite here!');
    createFavourite({file_id: file.file_id});
    setUpdate(update + 1);
  };

  const removeFavourite = () => {
    console.log('Remove favorite here!');
    deleteFavourite(file.file_id);
    setUpdate(update + 1);
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

  const fetchLoggedUser = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await checkToken(userToken);
      const isUser = userData.user_id === file.user_id ? true : false;
      console.log(isUser);
      setIsLoggedUser(isUser);
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
    fetchLoggedUser();

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
          <Text style={styles.underline}>Product info {'\n'}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.description}>Price: {price}€</Text>
          <Text style={styles.description}>Location: {location}</Text>
          {/* <ListItem> */}
          {/* <Avatar source={{uri: avatar}} /> */}
          <Card.Divider />
          <Text style={styles.underline}>Contact info</Text>
          <Text
            style={styles.posterEmail}
            onPress={() => {
              navigation.navigate(
                'User items',
                {userId: file.user_id},
                navigation
              );
            }}
          >
            {'\n'}
            Posted by: {owner.username}
          </Text>
          <Text
            style={styles.posterEmail}
            onPress={() =>
              Linking.openURL(
                `mailto:${owner.email}?subject=${file.title}&body=`
              )
            }
          >
            {'\n'}
            Contact info: {owner.email}
          </Text>
          {/* </ListItem> */}
        </Card>
        <Card>
          <CommentList file={file} commentArray={commentArray} />
        </Card>
      </ScrollView>
      <FloatingActionButton
        buttonInteraction={toggleOverlay}
        icon={'comment'}
        bottom={0}
      />
      {isFavourite && !isLoggedUser && (
        <FavoriteButton
          buttonInteraction={removeFavourite}
          icon={'star'}
          color={'#ffff00'}
          bottom={65}
        />
      )}
      {!isFavourite && !isLoggedUser && (
        <FavoriteButton
          buttonInteraction={postFavourite}
          icon={'star'}
          color={'#fff'}
          bottom={65}
        />
      )}
      {overlayVisible && (
        <Overlay
          style={styles.overlay}
          isVisible={overlayVisible}
          onBackdropPress={toggleOverlay}
        >
          <CommentOverlay
            toggleCommentOverlay={toggleOverlay}
            file_id={file.file_id}
          />
        </Overlay>
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
  underline: {
    textDecorationLine: 'underline',
    fontSize: 20,
  },
  posterEmail: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
});

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Single;
