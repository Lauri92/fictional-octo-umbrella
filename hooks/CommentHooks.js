import {useState} from 'react';
import {validator} from '../utils/validator';

const constraints = {
  comment: {
    presence: {
      message: 'cannot be empty',
    },
    length: {
      minimum: 15,
      message: 'min length is 15 characters',
    },
  },
};

const useCommentForm = (callback) => {
  const [inputs, setInputs] = useState({
    comment: '',
  });
  const [commentErrors, setCommentErrors] = useState({});

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
    setCommentErrors((commentErrors) => {
      return {
        ...commentErrors,
        [name]: error,
      };
    });
  };

  return {
    handleInputChange,
    inputs,
    setInputs,
    commentErrors,
  };
};

export default useCommentForm;
