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
import List from '../components/List';
import GlobalStyles from '../utils/GlobalStyles';
import PropTypes from 'prop-types';
import FloatingActionButton from '../components/FloatingActionButton';
import {MainContext} from '../contexts/MainContext';
import useSearchForm from '../hooks/SearchHooks';

const Items = ({navigation}) => {
  const {handleInputChange, inputs, userInputErrors} = useSearchForm();
  const [searchContent, setsearchContent] = useState('');
  const {update, setUpdate} = useContext(MainContext);

  const userInputSearch = async () => {
    try {
      setsearchContent(inputs.userInput);
      console.log(searchContent);
      setUpdate(update + 1);
    } catch (error) {
      Alert.alert('Upload', 'Failed');
      console.error(error);
    }
  };
  return (
    <>
      <View style={styles.container}>
        <TextInput
          autoCapitalize="none"
          placeholder="Search for items..."
          maxLength={15}
          onChangeText={(txt) => handleInputChange('userInput', txt)}
          errorMessage={userInputErrors.userInput}
          style={styles.input}
        />

        <Button
          style={styles.searchButton}
          disabled={userInputErrors.userInput !== null}
          color={'#000000'}
          title="Search!"
          onPress={userInputSearch}
        />
      </View>

      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <List
          navigation={navigation}
          myFilesOnly={false}
          onlyFavorites={false}
          searchContent={searchContent}
        />
        <StatusBar style="auto" />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 15,
  },
  input: {
    fontSize: 20,
    marginLeft: 17,
    marginRight: 25,
    width: 250,
  },
  searchButton: {},
});

Items.propTypes = {
  navigation: PropTypes.object,
};

export default Items;
