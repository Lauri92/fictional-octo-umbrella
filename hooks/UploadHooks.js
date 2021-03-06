import {useState} from 'react';
import {validator} from '../utils/validator';

const constraints = {
  title: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 3,
      message: 'min length is 3 characters',
    },
  },
  description: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 5,
      message: 'min length is 5 characters',
    },
  },
  price: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 1,
      message: 'min length is 1 characters',
    },
    numericality: {
      message: 'not allowed',
    },
  },
  location: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 3,
      message: 'min length is 3 characters',
    },
  },
  category: {
    presence: {
      message: 'cannot be empty',
    },
  },
};

const useUploadForm = (callback) => {
  const [inputs, setInputs] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: '',
  });
  const [uploadErrors, setUploadErrors] = useState({});

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
    setUploadErrors((uploadErrors) => {
      return {
        ...uploadErrors,
        [name]: error,
      };
    });
  };

  const reset = () => {
    setInputs({
      title: '',
      description: '',
      price: '',
      location: '',
    });
    setUploadErrors({});
  };

  return {
    handleInputChange,
    inputs,
    setInputs,
    uploadErrors,
    reset,
  };
};

export default useUploadForm;
