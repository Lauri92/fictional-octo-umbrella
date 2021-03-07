import {useState} from 'react';
import {validator} from '../utils/validator';
import {useUser} from './ApiHooks';

const constraints = {
  username: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 3,
      message: 'min length is 3 characters',
    },
  },
};

const useUsernameForm = (callback) => {
  const [inputs, setInputs] = useState({
    username: '',
  });
  const [usernameErrors, setUsernameErrors] = useState({});
  const {checkIsUserAvailable} = useUser();

  const handleInputChange = (name, text) => {
    // console.log(name, text);
    // console.log('inputs state', inputs);
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
    const error = validator(name, text, constraints);
    setUsernameErrors((usernameErrors) => {
      return {
        ...usernameErrors,
        [name]: error,
      };
    });
  };

  const checkUserAvailable = async (event) => {
    // console.log('username input', event.nativeEvent.text);
    try {
      const result = await checkIsUserAvailable(event.nativeEvent.text);
      if (!result) {
        setUsernameErrors((registerErrors) => {
          return {
            ...registerErrors,
            username: 'Username already exists',
          };
        });
      }
    } catch (error) {
      console.error('reg checkUserAvailable', error);
    }
  };

  return {
    handleInputChange,
    inputs,
    setInputs,
    usernameErrors,
    checkUserAvailable,
  };
};

export default useUsernameForm;
