import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Button,
  View,
  TextInput,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Card,
  Text,
  ListItem,
  Avatar,
  Overlay,
  Input,
} from 'react-native-elements';
import {useUser} from '../hooks/ApiHooks';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {ScrollView} from 'react-native-gesture-handler';
import useUsernameForm from '../hooks/UpdateHooks';

const Profile = ({navigation}) => {
  const {isLoggedIn, setIsLoggedIn, user} = useContext(MainContext);
  const [avatar, setAvatar] = useState('http://placekitten.com/640');
  const {getFilesByTag} = useTag();
  const [overlayVisible, setOverlayVisible] = useState(false);
  const {setUser} = useContext(MainContext);
  const {updateUserUsername, checkToken} = useUser();
  const {handleInputChange, inputs, usernameErrors} = useUsernameForm();

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    if (!isLoggedIn) {
      // this is to make sure isLoggedIn has changed, will be removed later
      navigation.navigate('Login');
    }
  };

  const doUsernameUpdate = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const newUsernameInfo = {username: inputs.username};
    const resp = await updateUserUsername(userToken, newUsernameInfo);
    console.log('upload response', resp);
    const userData = await checkToken(userToken);
    setUser(userData);
    toggleOverlay();
  };

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  useEffect(() => {
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
  }, []);

  return (
    <ScrollView>
      <Card>
        <Card.Title>
          <Text h1 onLongPress={toggleOverlay}>
            {user.username}
          </Text>
        </Card.Title>
        {/* <Card.Image
          source={{uri: avatar}}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator />}
        /> */}
        <ListItem>
          <Avatar
            icon={{type: 'antdesign', name: 'edit', color: 'black'}}
            onPress={() => console.log('Hello1')}
          />
          <Avatar icon={{name: 'email', color: 'black'}} />
          <Text>{user.email}</Text>
        </ListItem>
        <ListItem>
          <Avatar
            icon={{type: 'antdesign', name: 'edit', color: 'black'}}
            onPress={() => console.log('Hello2')}
          />
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
      {overlayVisible && (
        <Overlay
          style={styles.overlay}
          isVisible={overlayVisible}
          onBackdropPress={toggleOverlay}
        >
          <Card.Title h4>Update profile name</Card.Title>
          <TextInput
            maxLength={15}
            style={styles.input}
            placeholder={'New username'}
            onChangeText={(txt) => handleInputChange('username', txt)}
            errorMessage={usernameErrors.username}
          />
          <View style={styles.container}>
            <Button color="#fcba03" onPress={toggleOverlay} title="Cancel" />
            <Button
              title="Submit"
              onPress={doUsernameUpdate}
              disabled={usernameErrors.username !== null}
            />
          </View>
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
  input: {
    height: 30,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 25,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
