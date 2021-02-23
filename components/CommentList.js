import React from 'react';
import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import CommentListItem from './CommentListItem';
import {useLoadComments} from '../hooks/ApiHooks';

const CommentList = ({file, commentArray}) => {
  const fileId = file.file_id;
  // const commentArray = useLoadComments(fileId);

  return (
    <FlatList
      data={commentArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => <CommentListItem singleComment={item} />}
    />
  );
};

CommentList.propTypes = {
  file: PropTypes.object,
  commentArray: PropTypes.array,
};

export default CommentList;
