import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import List from '../components/List';
import GlobalStyles from '../utils/GlobalStyles';
import PropTypes from 'prop-types';

const CommentedItems = ({navigation}) => {
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <List
        navigation={navigation}
        myFilesOnly={false}
        onlyFavorites={false}
        commentedItems={true}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

CommentedItems.propTypes = {
  navigation: PropTypes.object,
};

export default CommentedItems;
