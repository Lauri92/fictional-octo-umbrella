import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import {useLoadMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

const List = ({
  navigation,
  myFilesOnly,
  onlyFavorites,
  searchContent,
  specificUser,
  commentedItems,
}) => {
  const {user} = useContext(MainContext);
  const mediaArray = useLoadMedia(
    myFilesOnly,
    user.user_id,
    onlyFavorites,
    searchContent,
    specificUser,
    commentedItems
  );

  return (
    <FlatList
      data={mediaArray.reverse()}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem
          navigation={navigation}
          singleMedia={item}
          isMyFile={item.user_id === user.user_id}
        />
      )}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  myFilesOnly: PropTypes.bool,
  onlyFavorites: PropTypes.bool,
  commentedItems: PropTypes.bool,
  searchContent: PropTypes.string,
  specificUser: PropTypes.number,
};

export default List;
