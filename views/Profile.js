import React, {useContext, useEffect, useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Text, ListItem, Avatar, Overlay} from 'react-native-elements';
import {
  useTag,
  useUser,
  useComment,
  useFavourites,
  useMedia,
} from '../hooks/ApiHooks';
import {ScrollView} from 'react-native-gesture-handler';
import UsernameOverlay from '../components/UsernameOverlay';
import EmailOverlay from '../components/EmailOverlay';

const Profile = ({navigation}) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(MainContext);
  /* const [avatar, setAvatar] = useState('http://placekitten.com/640'); */
  const {update} = useContext(MainContext);
  const {getFilesByTag} = useTag();
  const {deleteUser} = useUser();
  const {getCommentAmount} = useComment();
  const {getFavoriteAmount} = useFavourites();
  const {getOwnItemsAmount} = useMedia();
  const [userOverlayVisible, setUserOverlayVisible] = useState(false);
  const [emailOverlayVisible, setEmailOverlayVisible] = useState(false);
  const [commentAmount, setCommentAmount] = useState('Loading');
  const [favouriteAmount, setFavouriteAmount] = useState('Loading');
  const [ownItemsAmount, setOwnItemsAmount] = useState('Loading');

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    if (!isLoggedIn) {
      // this is to make sure isLoggedIn has changed, will be removed later
      navigation.navigate('Login');
    }
  };

  // Requires admin permissions
  const doUserDelete = () => {
    Alert.alert(
      'Delete',
      'Do you really want to delete your account permanently?',
      [
        {text: 'Cancel'},
        {
          title: 'Ok',
          onPress: async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            try {
              await deleteUser(user.user_id, userToken);
              await logout();
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

  const toggleUsernameOverlay = () => {
    setUserOverlayVisible(!userOverlayVisible);
  };

  const toggleEmailOverlay = () => {
    setEmailOverlayVisible(!emailOverlayVisible);
  };

  const fetchCommentAmount = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const comments = await getCommentAmount(userToken);
    setCommentAmount(comments);
  };

  const fetchFavouriteAmount = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const favourites = await getFavoriteAmount(userToken);
    setFavouriteAmount(favourites);
  };

  const fetchOwnItemsAmount = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const items = await getOwnItemsAmount(userToken);
    setOwnItemsAmount(items);
  };

  useEffect(() => {
    fetchCommentAmount();
    fetchFavouriteAmount();
    fetchOwnItemsAmount();
    /* const fetchAvatar = async () => {
      try {
        const avatarList = await getFilesByTag('avatar_' + user.user_id);
        if (avatarList.length > 0) {
          setAvatar(uploadsUrl + avatarList.pop().filename);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchAvatar(); */
  }, [update]);

  return (
    <ScrollView>
      <Card>
        <ListItem>
          <Text h1>{user.username}</Text>
          <Avatar
            icon={{type: 'antdesign', name: 'edit', color: 'black'}}
            onPress={toggleUsernameOverlay}
          />
        </ListItem>
        <ListItem>
          <Avatar icon={{name: 'email', color: 'black'}} />
          <Text>{user.email}</Text>
          <Avatar
            icon={{type: 'antdesign', name: 'edit', color: 'black'}}
            onPress={toggleEmailOverlay}
          />
        </ListItem>
        {user.full_name !== null && (
          <ListItem>
            <Avatar
              icon={{name: 'user', type: 'font-awesome', color: 'black'}}
            />
            <Text>{user.full_name}</Text>
          </ListItem>
        )}
        <ListItem bottomDivider onPress={() => navigation.push('My Files')}>
          <Avatar icon={{name: 'perm-media', color: 'black'}} />
          <ListItem.Content>
            <ListItem.Title>My Files: {ownItemsAmount}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          bottomDivider
          onPress={() => navigation.push('Commented items')}
        >
          <Avatar icon={{name: 'chat-bubble', color: 'black'}} />
          <ListItem.Content>
            <ListItem.Title>Total comments: {commentAmount}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          bottomDivider
          onPress={() =>
            navigation.push('Bookmarks')
          } /* onPress={() => {
            navigation.navigate('Bookmarks');
          }} */
        >
          <Avatar icon={{name: 'star', color: 'black'}} />
          <ListItem.Content>
            <ListItem.Title>Total favorites: {favouriteAmount}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        {/* <ListItem bottomDivider onPress={doUserDelete}>
          <Avatar icon={{name: 'delete-forever', color: 'black'}} />
          <ListItem.Content>
            <ListItem.Title>Delete account</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem> */}
        <ListItem bottomDivider onPress={logout}>
          <Avatar icon={{name: 'logout', color: 'black'}} />
          <ListItem.Content>
            <ListItem.Title>Logout</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </Card>
      {userOverlayVisible && (
        <Overlay
          isVisible={userOverlayVisible}
          onBackdropPress={toggleUsernameOverlay}
        >
          <UsernameOverlay
            navigation={navigation}
            toggleUsernameOverlay={toggleUsernameOverlay}
          />
        </Overlay>
      )}
      {emailOverlayVisible && (
        <Overlay
          isVisible={emailOverlayVisible}
          onBackdropPress={toggleEmailOverlay}
        >
          <EmailOverlay
            navigation={navigation}
            toggleEmailOverlay={toggleEmailOverlay}
          />
        </Overlay>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
