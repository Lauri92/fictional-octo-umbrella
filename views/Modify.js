/* eslint-disable react/display-name */
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Text, Image, Button, Card, Icon} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import DropDownPicker from 'react-native-dropdown-picker';

const Modify = ({navigation, route}) => {
  const {file} = route.params;
  const [isUploading, setIsUploading] = useState(false);
  const {updateFile} = useMedia();
  const {update, setUpdate} = useContext(MainContext);

  const {
    handleInputChange,
    inputs,
    setInputs,
    uploadErrors,
    reset,
  } = useUploadForm();

  const doUpdate = async () => {
    try {
      setIsUploading(true);

      const extraData = {
        description: inputs.description,
        price: inputs.price,
        location: inputs.location,
        category: inputs.category,
      };

      const modifyInfo = {
        title: inputs.title,
        description: JSON.stringify(extraData),
      };

      const userToken = await AsyncStorage.getItem('userToken');
      const resp = await updateFile(file.file_id, modifyInfo, userToken);
      console.log('update response', resp);
      setUpdate(update + 1);
      navigation.pop();
    } catch (error) {
      Alert.alert('Update', 'Failed');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const doReset = () => {
    reset();
  };
  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" enabled>
        <Card>
          <Text h4>Update file info</Text>
          {/* TODO: add similar media view than Single.js */}
          <Input
            placeholder="Title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            errorMessage={uploadErrors.title}
          />
          <Input
            placeholder="Description"
            value={inputs.description}
            onChangeText={(txt) => handleInputChange('description', txt)}
            errorMessage={uploadErrors.description}
          />
          <Input
            placeholder="Price"
            value={inputs.price}
            onChangeText={(txt) => handleInputChange('price', txt)}
            errorMessage={uploadErrors.price}
          />
          <Input
            placeholder="Location"
            value={inputs.location}
            onChangeText={(txt) => handleInputChange('location', txt)}
            errorMessage={uploadErrors.location}
          />
          <DropDownPicker
            items={[
              {
                label: 'Electronics',
                value: 'electronics',
                icon: () => <Icon name="dns" size={18} color="#000" />,
              },
              {
                label: 'Vehicles and Machinery',
                value: 'vehicles and machinery',
                icon: () => (
                  <Icon type="antdesign" name="car" size={18} color="#000" />
                ),
              },
              {
                label: 'Home and Living',
                value: 'home and living',
                icon: () => (
                  <Icon type="antdesign" name="home" size={18} color="#000" />
                ),
              },
              {
                label: 'Leisure and Hobbies',
                value: 'leisure and hobbies',
                icon: () => (
                  <Icon
                    type="antdesign"
                    name="rocket1"
                    size={18}
                    color="#000"
                  />
                ),
              },
              {
                label: 'Miscellaneous',
                value: 'miscellaneous',
                icon: () => (
                  <Icon type="antdesign" name="bars" size={18} color="#000" />
                ),
              },
            ]}
            value={inputs.category}
            placeholder="Select a category"
            containerStyle={{height: 60}}
            style={{backgroundColor: '#FFF'}}
            itemStyle={{
              justifyContent: 'center',
            }}
            dropDownStyle={{backgroundColor: '#FFF'}}
            onChangeItem={(item) => {
              handleInputChange('category', item.label);
            }}
          />
          {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
          <Button
            title="Update"
            onPress={doUpdate}
            disabled={
              uploadErrors.title !== null ||
              uploadErrors.description !== null ||
              uploadErrors.price !== null ||
              uploadErrors.location !== null ||
              uploadErrors.category !== null
            }
          />
          <Button title="Reset" onPress={doReset} />
        </Card>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

Modify.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Modify;
