import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Avatar, Icon, ListItem as RNEListItem} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser, useComment} from '../hooks/ApiHooks';
import moment from 'moment';
import {Alert, Button} from 'react-native';
import {MainContext} from '../contexts/MainContext';

const CommentListItem = ({singleComment}) => {
  const {getUser, checkToken} = useUser();
  const {deleteComment} = useComment();
  const [owner, setOwner] = useState({});
  const [loggedUser, setLoggedUser] = useState({});
  const {setUpdate, update} = useContext(MainContext);

  const fetchOwner = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await getUser(singleComment.user_id, userToken);
      const loggedUserData = await checkToken(userToken);
      setOwner(userData);
      setLoggedUser(loggedUserData);
    } catch (error) {
      console.error(error.message);
    }
  };

  const doCommentDelete = () => {
    Alert.alert(
      'Delete',
      'Delete this comment permanently?',
      [
        {text: 'Cancel'},
        {
          title: 'Ok',
          onPress: async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            try {
              await deleteComment(singleComment.comment_id, userToken);
              setUpdate(update + 1);
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

  useEffect(() => {
    fetchOwner();
  }, []);

  return (
    <RNEListItem bottomDivider>
      <RNEListItem.Content>
        <RNEListItem.Title h4>{owner.username}</RNEListItem.Title>
        <RNEListItem.Subtitle>{singleComment.comment}</RNEListItem.Subtitle>
        <RNEListItem.Subtitle>{owner.email}</RNEListItem.Subtitle>
        <RNEListItem.Subtitle>
          {moment(singleComment.time_added).format('LLLL')}
        </RNEListItem.Subtitle>
        {owner.user_id === loggedUser.user_id && (
          <Icon
            name="delete"
            type="material"
            color="#517fa4"
            onPress={doCommentDelete}
          />
        )}
      </RNEListItem.Content>
    </RNEListItem>
  );
};

CommentListItem.propTypes = {
  singleComment: PropTypes.object,
};

export default CommentListItem;
