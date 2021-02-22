import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {appIdentifier, baseUrl} from '../utils/variables';

// general function for fetching (options default value is empty object)
const doFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const json = await response.json();
  if (json.error) {
    // if API response contains error message (use Postman to get further details)
    throw new Error(json.message + ': ' + json.error);
  } else if (!response.ok) {
    // if API response does not contain error message, but there is some other error
    throw new Error('doFetch failed');
  } else {
    // if all goes well
    return json;
  }
};

const useLoadMedia = (myFilesOnly, userId, onlyFavorites) => {
  const [mediaArray, setMediaArray] = useState([]);
  const {update} = useContext(MainContext);

  const loadMedia = async () => {
    if (!onlyFavorites) {
      try {
        const listJson = await doFetch(baseUrl + 'tags/' + appIdentifier);
        let media = await Promise.all(
          listJson.map(async (item) => {
            const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
            return fileJson;
          })
        );
        if (myFilesOnly) {
          media = media.filter((item) => item.user_id === userId);
        }
        setMediaArray(media);
      } catch (error) {
        console.error('loadMedia error', error.message);
      }
    } else {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const options = {
          method: 'GET',
          headers: {'x-access-token': userToken},
        };
        const listJson = await doFetch(baseUrl + 'favourites', options);
        let media = await Promise.all(
          listJson.map(async (item) => {
            const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
            return fileJson;
          })
        );
        setMediaArray(media);
      } catch (error) {
        console.error('loadMedia error', error.message);
      }
    }
  };
  useEffect(() => {
    loadMedia();
  }, [update]);
  return mediaArray;
};

const useLoadComments = (fileId) => {
  const [commentArray, setCommentArray] = useState([]);
  const {update} = useContext(MainContext);
  const loadComments = async () => {
    try {
      console.log('fileId: ', fileId);
      const comments = await doFetch(baseUrl + 'comments/file/' + fileId);
      setCommentArray(comments);
    } catch (error) {
      console.error('loadComments error', error.message);
    }
  };
  useEffect(() => {
    loadComments();
  }, [update]);
  return commentArray;
};

const useLogin = () => {
  const postLogin = async (userCredentials) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userCredentials),
    };
    try {
      const userData = await doFetch(baseUrl + 'login', options);
      return userData;
    } catch (error) {
      throw new Error('postLogin error: ' + error.message);
    }
  };

  return {postLogin};
};

const useUser = () => {
  const postRegister = async (inputs) => {
    console.log('trying to create user', inputs);
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    try {
      const json = await doFetch(baseUrl + 'users', fetchOptions);
      console.log('register resp', json);
      return json;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const checkToken = async (token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const userData = await doFetch(baseUrl + 'users/user', options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getUser = async (id, token) => {
    try {
      const options = {
        method: 'GET',
        headers: {'x-access-token': token},
      };
      const userData = await doFetch(baseUrl + 'users/' + id, options);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const checkIsUserAvailable = async (username) => {
    try {
      const result = await doFetch(baseUrl + 'users/username/' + username);
      return result.available;
    } catch (error) {
      throw new Error('apihooks checkIsUserAvailable', error.message);
    }
  };

  return {postRegister, checkToken, checkIsUserAvailable, getUser};
};

const useTag = () => {
  const getFilesByTag = async (tag) => {
    try {
      const tagList = await doFetch(baseUrl + 'tags/' + tag);
      return tagList;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const postTag = async (tag, token) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-access-token': token},
      body: JSON.stringify(tag),
    };
    try {
      const result = await doFetch(baseUrl + 'tags', options);
      return result;
    } catch (error) {
      throw new Error('postTag error: ' + error.message);
    }
  };

  return {getFilesByTag, postTag};
};

const useMedia = () => {
  const upload = async (fd, token) => {
    const options = {
      method: 'POST',
      headers: {'x-access-token': token},
      data: fd,
      url: baseUrl + 'media',
    };
    console.log('apihooks upload', options);
    try {
      const response = await axios(options);
      return response.data;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const updateFile = async (fileId, fileInfo, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'x-access-token': token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(fileInfo),
    };
    try {
      const result = await doFetch(baseUrl + 'media/' + fileId, options);
      return result;
    } catch (error) {
      throw new Error('updateFile error: ' + error.message);
    }
  };

  const deleteFile = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      const result = await doFetch(baseUrl + 'media/' + fileId, options);
      return result;
    } catch (error) {
      throw new Error('deleteFile error: ' + error.message);
    }
  };

  return {upload, updateFile, deleteFile};
};

const useComment = () => {
  const uploadComment = async (info, token) => {
    console.log('trying to comment', info);
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(info),
    };
    console.log('apihooks uploadComment', options);
    try {
      const json = await doFetch(baseUrl + 'comments', options);
      return json;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const deleteComment = async (commentId, token) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      const json = await doFetch(baseUrl + 'comments/' + commentId, options);
      return json;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return {uploadComment, deleteComment};
};

export {
  useLoadMedia,
  useLoadComments,
  useLogin,
  useUser,
  useTag,
  useMedia,
  useComment,
};
