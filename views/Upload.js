/* eslint-disable react/display-name */
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import {Input, Text, Image, Button, Card, Icon} from 'react-native-elements';
import useUploadForm from '../hooks/UploadHooks';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {appIdentifier} from '../utils/variables';
import {Video} from 'expo-av';
import DropDownPicker from 'react-native-dropdown-picker';

const Upload = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [filetype, setFiletype] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const {upload} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);

  const {handleInputChange, inputs, uploadErrors, reset} = useUploadForm();

  const doUpload = async () => {
    const formData = new FormData();
    // add text to formData
    formData.append('title', inputs.title);
    // formData.append('description', inputs.description);
    // add image to formData

    const extraData = {
      description: inputs.description,
      price: inputs.price,
      location: inputs.location,
      category: inputs.category,
    };

    formData.append('description', JSON.stringify(extraData));

    const filename = image.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    let type = match ? `${filetype}/${match[1]}` : filetype;
    if (type === 'image/jpg') type = 'image/jpeg';
    formData.append('file', {
      uri: image,
      name: filename,
      type: type,
    });
    try {
      console.log(formData);
      setIsUploading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const resp = await upload(formData, userToken);
      console.log('upload response', resp);
      const tagResponse = await postTag(
        {
          file_id: resp.file_id,
          tag: appIdentifier,
        },
        userToken
      );
      console.log('posting app identifier', tagResponse);
      Alert.alert(
        'Upload',
        'Item uploaded',
        [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              doReset();
              navigation.navigate('Items');
            },
          },
        ],
        {cancelable: false}
      );
    } catch (error) {
      Alert.alert('Upload', 'Failed');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert(
            'Sorry, we need camera roll and camera permissions to make this work!'
          );
        }
      }
    })();
  }, []);

  const pickImage = async (library) => {
    let result = null;
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    };
    if (library) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      result = await ImagePicker.launchCameraAsync(options);
    }

    console.log(result);

    if (!result.cancelled) {
      // console.log('pickImage result', result);
      setFiletype(result.type);
      setImage(result.uri);
    }
  };

  const doReset = () => {
    setImage(null);
    reset();
  };
  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" enabled>
        <Card>
          <Text h4>Upload item</Text>
          {image && (
            <>
              {filetype === 'image' ? (
                <Image
                  source={{uri: image}}
                  style={{width: '100%', height: undefined, aspectRatio: 1}}
                />
              ) : (
                <Video
                  source={{uri: image}}
                  style={{width: '100%', height: undefined, aspectRatio: 1}}
                  useNativeControls={true}
                />
              )}
            </>
          )}
          <Input
            placeholder="title"
            value={inputs.title}
            onChangeText={(txt) => handleInputChange('title', txt)}
            errorMessage={uploadErrors.title}
          />
          <Input
            placeholder="description"
            value={inputs.description}
            onChangeText={(txt) => handleInputChange('description', txt)}
            errorMessage={uploadErrors.description}
          />
          <Input
            placeholder="price"
            value={inputs.price}
            onChangeText={(txt) => handleInputChange('price', txt)}
            errorMessage={uploadErrors.price}
            keyboardType="number-pad"
          />
          <Input
            placeholder="location"
            value={inputs.location}
            onChangeText={(txt) => handleInputChange('location', txt)}
            errorMessage={uploadErrors.location}
          />
          <DropDownPicker
            style={styles.dropDown}
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
            /* style={{backgroundColor: '#FFF'}} */
            itemStyle={{
              justifyContent: 'center',
            }}
            dropDownStyle={{backgroundColor: '#FFF'}}
            onChangeItem={(item) => {
              handleInputChange('category', item.label);
            }}
          />
          <Button title="Choose from library" onPress={() => pickImage(true)} />
          <Button title="Use camera" onPress={() => pickImage(false)} />
          {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
          {isUploading || (
            <Button
              title="Upload file"
              onPress={doUpload}
              disabled={
                uploadErrors.title !== null ||
                uploadErrors.description !== null ||
                uploadErrors.price !== null ||
                uploadErrors.location !== null ||
                uploadErrors.category !== null ||
                image === null
              }
            />
          )}
          <Button title="Reset" onPress={doReset} />
        </Card>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dropDown: {
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
