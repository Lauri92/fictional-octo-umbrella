import React, {useContext} from 'react';
import {StyleSheet, Button, View, Alert} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Input} from 'react-native-elements';
import {useUser} from '../hooks/ApiHooks';
import useUsernameForm from '../hooks/UpdateHooks';

const UsernameOverlay = ({navigation, toggleUsernameOverlay}) => {
  const {setUser} = useContext(MainContext);
  const {updateUserUsername, checkToken} = useUser();
  const {
    handleInputChange,
    inputs,
    usernameErrors,
    checkUserAvailable,
  } = useUsernameForm();

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

  return (
    <>
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

UsernameOverlay.propTypes = {
  navigation: PropTypes.object,
  toggleUsernameOverlay: PropTypes.func,
};

export default UsernameOverlay;
