import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import List from '../components/List';
import GlobalStyles from '../utils/GlobalStyles';
import PropTypes from 'prop-types';

const UserItems = ({navigation, route}) => {
  // console.log(props.route.params.userId);
  const userId = route.params.userId;
  console.log(userId);
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <List
        navigation={navigation}
        myFilesOnly={false}
        onlyFavorites={false}
        specificUser={userId}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

UserItems.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default UserItems;
