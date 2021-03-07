import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Button,
  View,
  TextInput,
  Alert,
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
  Icon,
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
  const [userOverlayVisible, setUserOverlayVisible] = useState(false);
  const [emailOverlayVisible, setEmailOverlayVisible] = useState(false);
  const {setUser} = useContext(MainContext);
  const {updateUserUsername, checkToken} = useUser();
  const {
    handleInputChange,
    inputs,
    usernameErrors,
    checkUserAvailable,
  } = useUsernameForm();

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
    Alert.alert(
      'Update',
      resp.message,
      [
        {
          text: 'Ok',
        },
      ],
      {cancelable: false}
    );
    toggleUsernameOverlay();
  };

  const toggleUsernameOverlay = () => {
    setUserOverlayVisible(!userOverlayVisible);
  };

  const toggleEmailOverlay = () => {
    console.log('here');
    setEmailOverlayVisible(!emailOverlayVisible);
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
        <ListItem>
          <Text h1>{user.username}</Text>
          <Avatar
            icon={{type: 'antdesign', name: 'edit', color: 'black'}}
            onPress={toggleUsernameOverlay}
          />
        </ListItem>
        {/* <Card.Image
          source={{uri: avatar}}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator />}
        /> */}
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
          style={styles.overlay}
          isVisible={userOverlayVisible}
          onBackdropPress={toggleUsernameOverlay}
        >
          <Card.Title h4>Update a new profile name</Card.Title>
          <View>
            <Input
              maxLength={15}
              placeholder={'New username'}
              onChangeText={(txt) => handleInputChange('username', txt)}
              onEndEditing={(event) => {
                checkUserAvailable(event);
              }}
              errorMessage={usernameErrors.username}
              leftIcon={{type: 'font-awesome', name: 'user'}}
            />
          </View>
          <View style={styles.container}>
            <Button
              color="#fcba03"
              onPress={toggleUsernameOverlay}
              title="Cancel"
            />
            <Button
              title="Submit"
              onPress={doUsernameUpdate}
              disabled={usernameErrors.username !== null}
            />
          </View>
        </Overlay>
      )}
      {emailOverlayVisible && (
        <Overlay
          style={styles.overlay}
          isVisible={emailOverlayVisible}
          onBackdropPress={toggleEmailOverlay}
        >
          <Card.Title h4>Update a new email address</Card.Title>
          <View>
            <Input
              maxLength={25}
              placeholder={'New email'}
              onChangeText={(txt) => handleInputChange('email', txt)}
              errorMessage={usernameErrors.username}
              leftIcon={{type: 'Fontisto', name: 'email'}}
            />
          </View>
          <View style={styles.container}>
            <Button
              color="#fcba03"
              onPress={toggleEmailOverlay}
              title="Cancel"
            />
            <Button
              title="Submit"
              /* onPress={doUsernameUpdate} */
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
