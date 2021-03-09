import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Text, ListItem, Avatar, Overlay} from 'react-native-elements';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {ScrollView} from 'react-native-gesture-handler';
import UsernameOverlay from '../components/UsernameOverlay';
import EmailOverlay from '../components/EmailOverlay';

const Profile = ({navigation}) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(MainContext);
  /* const [avatar, setAvatar] = useState('http://placekitten.com/640'); */
  const {getFilesByTag} = useTag();
  const [userOverlayVisible, setUserOverlayVisible] = useState(false);
  const [emailOverlayVisible, setEmailOverlayVisible] = useState(false);

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    if (!isLoggedIn) {
      // this is to make sure isLoggedIn has changed, will be removed later
      navigation.navigate('Login');
    }
  };

  const toggleUsernameOverlay = () => {
    setUserOverlayVisible(!userOverlayVisible);
  };

  const toggleEmailOverlay = () => {
    setEmailOverlayVisible(!emailOverlayVisible);
  };

  /* useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const avatarList = await getFilesByTag('avatar_' + user.user_id);
        if (avatarList.length > 0) {
          setAvatar(uploadsUrl + avatarList.pop().filename);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchAvatar();
  }, []); */

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
        <ListItem>
          <Avatar icon={{name: 'user', type: 'font-awesome', color: 'black'}} />
          <Text>{user.full_name}</Text>
        </ListItem>
        <ListItem bottomDivider onPress={() => navigation.push('My Files')}>
          <Avatar icon={{name: 'perm-media', color: 'black'}} />
          <ListItem.Content>
            <ListItem.Title>My Files</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
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
