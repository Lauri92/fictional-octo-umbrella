import React, {useContext, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import moment from 'moment';

const CommentListItem = ({singleComment}) => {
  const {getUser} = useUser();
  const [owner, setOwner] = useState({});
  console.log('singleComment: ', singleComment);

  const fetchOwner = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userData = await getUser(singleComment.user_id, userToken);
      setOwner(userData);
    } catch (error) {
      console.error(error.message);
    }
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
      </RNEListItem.Content>
    </RNEListItem>
  );
};

CommentListItem.propTypes = {
  singleComment: PropTypes.object,
};

export default CommentListItem;
