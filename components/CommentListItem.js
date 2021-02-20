import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';

const CommentListItem = ({singleComment}) => {
  return (
    <RNEListItem bottomDivider>
      <RNEListItem.Content>
        <RNEListItem.Title h4>A comment</RNEListItem.Title>
        <RNEListItem.Subtitle>{singleComment.comment}</RNEListItem.Subtitle>
      </RNEListItem.Content>
    </RNEListItem>
  );
};

CommentListItem.propTypes = {
  singleComment: PropTypes.object,
};

export default CommentListItem;
