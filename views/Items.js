import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import List from '../components/List';
import GlobalStyles from '../utils/GlobalStyles';
import PropTypes from 'prop-types';

const Items = ({navigation}) => {
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <List navigation={navigation} myFilesOnly={false} onlyFavorites={false} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

Items.propTypes = {
  navigation: PropTypes.object,
};

export default Items;
