/* eslint-disable react/display-name */
import React, {useState, useContext} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import {Icon} from 'react-native-elements';
import List from '../components/List';
import GlobalStyles from '../utils/GlobalStyles';
import PropTypes from 'prop-types';
import DropDownPicker from 'react-native-dropdown-picker';
import {MainContext} from '../contexts/MainContext';
import useSearchForm from '../hooks/SearchHooks';

const Items = ({navigation}) => {
  const {
    handleInputChange,
    inputs,
    userInputErrors,
    handleInputEnd,
  } = useSearchForm();
  const [searchContent, setsearchContent] = useState('emptylist!');
  const {update, setUpdate} = useContext(MainContext);

  const userInputSearch = async () => {
    setsearchContent(inputs.userInput);
    setUpdate(update + 1);
  };

  return (
    <>
      <View style={styles.container}>
        <TextInput
          autoCapitalize="none"
          placeholder="Search for items..."
          maxLength={15}
          /* onChangeText={(txt) => handleInputChange('userInput', txt)} */
          onEndEditing={(event) => {
            // console.log('Items nativeEvent.text', event.nativeEvent.text);
            // console.log('here');
            handleInputEnd('userInput', event.nativeEvent.text);
          }}
          errorMessage={userInputErrors.userInput}
          style={styles.input}
        />
        <Button
          style={styles.searchButton}
          disabled={userInputErrors.userInput !== null}
          color={'#000000'}
          title="Search"
          onPress={userInputSearch}
        />
      </View>
      <DropDownPicker
        items={[
          {
            label: 'All',
            value: '',
            icon: () => (
              <Icon
                type="antdesign"
                name="checkcircleo"
                size={18}
                color="#000"
              />
            ),
          },
          {
            label: 'Electronics',
            value: 'electronics',
            icon: () => <Icon name="dns" size={18} color="#000" />,
          },
          {
            label: 'Vehicles and Machinery',
            value: 'vehicles and machinery',
            icon: () => (
              <Icon type="antdesign" name="car" size={18} color="#000" />
            ),
          },
          {
            label: 'Home and Living',
            value: 'home and living',
            icon: () => (
              <Icon type="antdesign" name="home" size={18} color="#000" />
            ),
          },
          {
            label: 'Leisure and Hobbies',
            value: 'leisure and hobbies',
            icon: () => (
              <Icon type="antdesign" name="rocket1" size={18} color="#000" />
            ),
          },
          {
            label: 'Miscellaneous',
            value: 'miscellaneous',
            icon: () => (
              <Icon type="antdesign" name="bars" size={18} color="#000" />
            ),
          },
        ]}
        style={styles.dropDown}
        placeholder="Select a category"
        containerStyle={{height: 60}}
        itemStyle={{
          justifyContent: 'center',
        }}
        onChangeItem={(item) => {
          setsearchContent(item.value);
          setUpdate(update + 1);
        }}
      />

      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <View style={styles.list}>
          <List
            navigation={navigation}
            myFilesOnly={false}
            onlyFavorites={false}
            searchContent={searchContent}
          />
          <StatusBar style="auto" />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    marginBottom: -25,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  list: {
    backgroundColor: '#FFFF00',
    marginTop: -25,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 15,
    marginBottom: 15,
  },
  input: {
    fontSize: 20,
    marginLeft: 17,
    marginRight: 0,
    width: 275,
  },
  allButton: {
    marginRight: 50,
  },
  searchButton: {
    marginLeft: 25,
  },
  dropDown: {
    backgroundColor: '#FFF',
    marginBottom: 0,
  },
});

Items.propTypes = {
  navigation: PropTypes.object,
};

export default Items;
