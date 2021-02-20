import React from 'react';
import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import CommentListItem from './CommentListItem';

const CommentList = () => {
  const fakeComments = [
    {
      comment_id: 3,
      file_id: 336,
      user_id: 74,
      comment: 'Too expensive!',
      time_added: '2021-02-20T15:23:44.000Z',
    },
    {
      comment_id: 4,
      file_id: 336,
      user_id: 74,
      comment: 'Still expensive!',
      time_added: '2021-02-20T15:26:40.000Z',
    },
    {
      comment_id: 5,
      file_id: 336,
      user_id: 74,
      comment: 'Test 1',
      time_added: '2021-02-20T15:26:40.000Z',
    },
    {
      comment_id: 6,
      file_id: 336,
      user_id: 74,
      comment: 'Test 2',
      time_added: '2021-02-20T15:26:40.000Z',
    },
  ];

  return (
    <FlatList
      data={fakeComments}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => <CommentListItem singleComment={item} />}
    />
  );
};

CommentList.propTypes = {};

export default CommentList;
