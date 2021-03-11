import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import {Card, Text} from 'react-native-elements';
import {useComment} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useCommentForm from '../hooks/CommentHooks';
import {MainContext} from '../contexts/MainContext';

const CommentOverlay = ({
  toggleCommentOverlay,
  file_id,
  updateCommentAmount,
}) => {
  const {uploadComment} = useComment();
  const {handleInputChange, inputs, commentErrors} = useCommentForm();
  const {update, setUpdate} = useContext(MainContext);
  const [isUploading, setIsUploading] = useState(false);

  const doCommentUpload = async () => {
    try {
      setIsUploading(true);
      const userToken = await AsyncStorage.getItem('userToken');
      const commentInfo = {comment: inputs.comment, file_id: file_id};
      const resp = await uploadComment(commentInfo, userToken);
      console.log('upload response', resp);
      setUpdate(update + 1);
      // toggleCommentOverlay();

      Alert.alert(
        'Comment',
        'Comment uploaded',
        [
          {
            text: 'Ok',
            onPress: () => {
              toggleCommentOverlay();
              updateCommentAmount();
            },
          },
        ],
        {cancelable: false}
      );
    } catch (error) {
      Alert.alert('Upload', 'Failed');
      console.error(error);
    } finally {
      // setIsUploading(false);
    }
  };

  return (
    <>
      <Card.Title h4>Comment this sales ad</Card.Title>
      <Text>Min. 15 characters</Text>
      <TextInput
        multiline={true}
        numberOfLines={4}
        maxLength={255}
        style={styles.input}
        onChangeText={(txt) => handleInputChange('comment', txt)}
        errorMessage={commentErrors.comment}
      />
      {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
      {isUploading || (
        <View style={styles.container}>
          <Button
            color="#fcba03"
            onPress={toggleCommentOverlay}
            title="Cancel"
          />
          <Button
            title="Submit"
            onPress={doCommentUpload}
            disabled={commentErrors.comment !== null}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
});

CommentOverlay.propTypes = {
  file_id: PropTypes.number,
  toggleCommentOverlay: PropTypes.func,
  updateCommentAmount: PropTypes.func,
};

export default CommentOverlay;
