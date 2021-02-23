import * as React from 'react';
import {StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';
import PropTypes from 'prop-types';

const FloatingActionButton = ({buttonInteraction, icon}) => (
  <FAB
    style={styles.fab}
    medium
    icon={icon}
    onPress={() => buttonInteraction()}
  />
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

FloatingActionButton.propTypes = {
  buttonInteraction: PropTypes.func,
  icon: PropTypes.string,
};

export default FloatingActionButton;
