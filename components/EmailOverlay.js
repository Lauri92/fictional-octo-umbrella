import React, {useContext} from 'react';
import {StyleSheet, Button, View, Alert} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card, Input} from 'react-native-elements';
import {useUser} from '../hooks/ApiHooks';
import useEmailForm from '../hooks/UpdateEmailHooks';

const EmailOverlay = ({navigation, toggleEmailOverlay}) => {
  const {setUser} = useContext(MainContext);
  const {updateUserUsername, checkToken} = useUser();
  const {handleEmailInputChange, emailInputs, emailErrors} = useEmailForm();

  const doEmailUpdate = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const newEmailInfo = {email: emailInputs.email};
    const resp = await updateUserUsername(userToken, newEmailInfo);
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
    toggleEmailOverlay();
  };

  return (
    <>
      <Card.Title h4>Update a new email address</Card.Title>
      <View>
        <Input
          maxLength={25}
          placeholder={'New email'}
          onChangeText={(txt) => handleEmailInputChange('email', txt)}
          errorMessage={emailErrors.email}
          leftIcon={{type: 'Fontisto', name: 'email'}}
        />
      </View>
      <View style={styles.container}>
        <Button color="#fcba03" onPress={toggleEmailOverlay} title="Cancel" />
        <Button
          title="Submit"
          onPress={doEmailUpdate}
          disabled={emailErrors.email !== null}
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

EmailOverlay.propTypes = {
  navigation: PropTypes.object,
  toggleEmailOverlay: PropTypes.func,
};

export default EmailOverlay;
