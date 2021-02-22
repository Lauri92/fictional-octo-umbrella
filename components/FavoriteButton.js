import * as React from 'react';
import {StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';
import PropTypes from 'prop-types';

// FFFF00; -> Yellow
const FavoriteButton = ({toggleOverlay}) => (
  <FAB
    style={styles.fab}
    medium
    icon="star"
    color="#FFF"
    onPress={() => console.log('Do something with this button!')}
  />
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 65,
  },
});

FavoriteButton.propTypes = {
  toggleOverlay: PropTypes.func,
};

export default FavoriteButton;
