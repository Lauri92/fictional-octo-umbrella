import * as React from 'react';
import {StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';
import PropTypes from 'prop-types';

// FFFF00; -> Yellow
const FavoriteButton = ({buttonInteraction, icon, color}) => (
  <FAB
    style={styles.fab}
    medium
    icon={icon}
    color={color}
    onPress={() => buttonInteraction()}
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
  buttonInteraction: PropTypes.func,
  icon: PropTypes.string,
  color: PropTypes.string,
};

export default FavoriteButton;
