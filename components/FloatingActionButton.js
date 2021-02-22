import * as React from 'react';
import {StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';
import PropTypes from 'prop-types';

const FloatingActionButton = ({toggleOverlay}) => (
  <FAB style={styles.fab} medium icon="plus" onPress={() => toggleOverlay()} />
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
  toggleOverlay: PropTypes.func,
};

export default FloatingActionButton;
