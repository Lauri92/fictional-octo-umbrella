import {useState} from 'react';
import {validator} from '../utils/validator';

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

  return {
    handleInputChange,
    inputs,
    setInputs,
    usernameErrors,
  };
};

export default useUsernameForm;
