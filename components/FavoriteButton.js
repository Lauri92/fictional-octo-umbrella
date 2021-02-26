import * as React from 'react';
import {StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';
import PropTypes from 'prop-types';

// FFFF00; -> Yellow
const FavoriteButton = ({buttonInteraction, icon, color, bottom}) => (
  <FAB
    style={styles.fab}
    medium
    icon={icon}
    color={color}
    bottom={bottom}
    onPress={() => buttonInteraction()}
  />
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
  },
});

FavoriteButton.propTypes = {
  buttonInteraction: PropTypes.func,
  icon: PropTypes.string,
  color: PropTypes.string,
  bottom: PropTypes.number,
};

export default FavoriteButton;
