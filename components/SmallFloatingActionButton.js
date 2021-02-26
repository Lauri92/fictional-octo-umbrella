import * as React from 'react';
import {StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';
import PropTypes from 'prop-types';

const SmallFloatingActionButton = ({
  buttonInteraction,
  icon,
  bottom,
  top,
  left,
  right,
}) => (
  <FAB
    style={styles.fab}
    small
    icon={icon}
    bottom={bottom}
    top={top}
    left={left}
    right={right}
    onPress={() => buttonInteraction()}
  />
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
  },
});

SmallFloatingActionButton.propTypes = {
  buttonInteraction: PropTypes.func,
  icon: PropTypes.string,
  bottom: PropTypes.number,
  top: PropTypes.number,
  left: PropTypes.number,
  right: PropTypes.number,
};

export default SmallFloatingActionButton;
