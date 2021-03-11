import React from 'react';
import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import CommentListItem from './CommentListItem';

const CommentList = ({file, commentArray, updateCommentAmount}) => {
  const fileId = file.file_id;
  // const commentArray = useLoadComments(fileId);

  return (
    <FlatList
      data={commentArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <CommentListItem
          singleComment={item}
          updateCommentAmount={updateCommentAmount}
        />
      )}
    />
  );
};

CommentList.propTypes = {
  file: PropTypes.object,
  commentArray: PropTypes.array,
  updateCommentAmount: PropTypes.func,
};

export default CommentList;
