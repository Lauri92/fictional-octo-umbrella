import {useState} from 'react';
import {validator} from '../utils/validator';

const constraints = {
  userInput: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 3,
      message: 'min length is 3 characters',
    },
  },
};

const useSearchForm = (callback) => {
  const [inputs, setInputs] = useState({
    userInput: '',
  });
  const [userInputErrors, setuserInputErrors] = useState({});

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
    setuserInputErrors((userInputErrors) => {
      return {
        ...userInputErrors,
        [name]: error,
      };
    });
  };

  const handleInputEnd = (name, text) => {
    console.log(text);
    // console.log(name, text);
    // console.log('inputs state', inputs);
    setInputs((inputs) => {
      return {
        ...inputs,
        [name]: text,
      };
    });
    const error = validator(name, text, constraints);
    setuserInputErrors((userInputErrors) => {
      return {
        ...userInputErrors,
        [name]: error,
      };
    });
  };

  return {
    handleInputChange,
    inputs,
    setInputs,
    userInputErrors,
    handleInputEnd,
  };
};

export default useSearchForm;
