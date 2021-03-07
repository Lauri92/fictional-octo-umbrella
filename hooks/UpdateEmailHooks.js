import {useState} from 'react';
import {validator} from '../utils/validator';

const constraints = {
  email: {
    presence: {
      message: 'cannot be empty',
    },
    email: {
      message: 'is not valid',
    },
  },
};

const useEmailForm = (callback) => {
  const [emailInputs, setEmailinputs] = useState({
    email: '',
  });
  const [emailErrors, setEmailErrors] = useState({});

  const handleEmailInputChange = (name, text) => {
    console.log(name, text);
    // console.log('emailInputs state', emailInputs);
    setEmailinputs((emailInputs) => {
      return {
        ...emailInputs,
        [name]: text,
      };
    });
    const error = validator(name, text, constraints);
    setEmailErrors((emailErrors) => {
      return {
        ...emailErrors,
        [name]: error,
      };
    });
  };

  return {
    handleEmailInputChange,
    emailInputs,
    setEmailinputs,
    emailErrors,
  };
};

export default useEmailForm;
