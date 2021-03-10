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

const useLoadMedia = (
  myFilesOnly,
  loggedUserId,
  onlyFavorites,
  searchContent = '',
  specificUser = '',
  commentedItems
) => {
  const [mediaArray, setMediaArray] = useState([]);
  const {update} = useContext(MainContext);
  const loadMedia = async () => {
    if (
      !onlyFavorites &&
      searchContent === '' &&
      specificUser === '' &&
      commentedItems !== true
    ) {
      try {
        const listJson = await doFetch(baseUrl + 'tags/' + appIdentifier);
        let media = await Promise.all(
          listJson.map(async (item) => {
            const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
            return fileJson;
          })
        );
        if (myFilesOnly) {
          media = media.filter((item) => item.user_id === loggedUserId);
        }
        media = media.map((item) => {
          const parsed = JSON.parse(item.description);
          const objToPass = {
            category: parsed.category,
            description: parsed.description,
            location: parsed.location,
            price: parsed.price,
          };
          item.description = objToPass;
          return item;
        });
        setMediaArray(media);
      } catch (error) {
        console.error('loadMedia error', error.message);
      }
    } else if (onlyFavorites) {
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
        media = media.map((item) => {
          const parsed = JSON.parse(item.description);
          const objToPass = {
            category: parsed.category,
            description: parsed.description,
            location: parsed.location,
            price: parsed.price,
          };
          item.description = objToPass;
          return item;
        });
        setMediaArray(media);
      } catch (error) {
        console.error('loadMedia error', error.message);
      }
    } else if (searchContent !== '' && specificUser === '') {
      try {
        const listJson = await doFetch(baseUrl + 'tags/' + appIdentifier);
        let media = await Promise.all(
          listJson.map(async (item) => {
            const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
            return fileJson;
          })
        );

        media = media.map((item) => {
          const parsed = JSON.parse(item.description);
          const objToPass = {
            category: parsed.category,
            description: parsed.description,
            location: parsed.location,
            price: parsed.price,
          };
          item.description = objToPass;
          return item;
        });
        if (
          searchContent === 'electronics' ||
          searchContent === 'vehicles and machinery' ||
          searchContent === 'home and living' ||
          searchContent === 'leisure and hobbies' ||
          searchContent === 'miscellaneous'
        ) {
          media = media.filter((item) =>
            item.description.category
              .toLowerCase()
              .includes(searchContent.toLowerCase())
          );
          setMediaArray(media);
        } else {
          // Custom search
          media = media.filter((item) =>
            item.description.description
              .toLowerCase()
              .includes(searchContent.toLowerCase())
          );
          setMediaArray(media);
        }
      } catch (error) {
        console.error('loadMedia error', error.message);
      }
    } else if (specificUser !== '') {
      console.log('Handle specific user.');
      try {
        const listJson = await doFetch(baseUrl + 'tags/' + appIdentifier);
        let media = await Promise.all(
          listJson.map(async (item) => {
            const fileJson = await doFetch(baseUrl + 'media/' + item.file_id);
            return fileJson;
          })
        );
        media = media.filter((item) => {
          return item.user_id == specificUser;
        });

        media = media.map((item) => {
          const parsed = JSON.parse(item.description);
          const objToPass = {
            category: parsed.category,
            description: parsed.description,
            location: parsed.location,
            price: parsed.price,
          };
          item.description = objToPass;
          return item;
        });
        setMediaArray(media);
      } catch (error) {
        console.error('loadMedia error', error.message);
      }
    } else if (commentedItems === true) {
      console.log('Commented items is true');
      const userToken = await AsyncStorage.getItem('userToken');
      const options = {
        headers: {
          'x-access-token': userToken,
        },
      };
      try {
        const comments = await doFetch(baseUrl + 'comments/', options);
        const uniqueFiles = [
          ...new Set(comments.map((comment) => comment.file_id)),
        ];
        let media = await Promise.all(
          uniqueFiles.map(async (fileId) => {
            const fileJson = await doFetch(baseUrl + 'media/' + fileId);
            return fileJson;
          })
        );
        media = media.map((item) => {
          const parsed = JSON.parse(item.description);
          const objToPass = {
            category: parsed.category,
            description: parsed.description,
            location: parsed.location,
            price: parsed.price,
          };
          item.description = objToPass;
          return item;
        });
        setMediaArray(media);
      } catch (e) {
        throw new Error(e.message);
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
      console.log('Loading comments of file: ', fileId);
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

const useLoadFavourites = () => {
  const [favouriteArray, setFavouriteArray] = useState([]);
  const {update} = useContext(MainContext);
  const loadFavourites = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const options = {
        method: 'GET',
        headers: {'x-access-token': userToken},
      };
      const favourites = await doFetch(baseUrl + 'favourites', options);
      setFavouriteArray(favourites);
    } catch (error) {
      console.error('loadFavorites error', error.message);
    }
  };
  useEffect(() => {
    loadFavourites();
  }, [update]);
  return favouriteArray;
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

  const updateUserUsername = async (token, username) => {
    console.log('trying to update username');
    const options = {
      method: 'PUT',
      headers: {
        'x-access-token': token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(username),
    };
    console.log('apihooks updateUserUsername', options);
    try {
      const json = await doFetch(baseUrl + 'users', options);
      return json;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  // Requires admin permission
  const deleteUser = async (userId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      console.log('userId at deleteUser: ', userId);
      const result = await doFetch(baseUrl + 'users/' + userId, options);
      return result;
    } catch (error) {
      throw new Error('deleteUser error: ' + error.message);
    }
  };

  return {
    postRegister,
    checkToken,
    checkIsUserAvailable,
    getUser,
    updateUserUsername,
    deleteUser,
  };
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
    console.log('fileInfo: ', fileInfo);
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

  const getOwnItemsAmount = async (token) => {
    const options = {
      headers: {
        'x-access-token': token,
      },
    };
    try {
      const json = await doFetch(baseUrl + 'media/user', options);
      return json.length;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return {upload, updateFile, deleteFile, getOwnItemsAmount};
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

  const getCommentAmount = async (token) => {
    const options = {
      headers: {
        'x-access-token': token,
      },
    };
    try {
      const json = await doFetch(baseUrl + 'comments/', options);
      // console.log(json);
      return json.length;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return {uploadComment, deleteComment, getCommentAmount};
};

const useFavourites = () => {
  const createFavourite = async (fileId) => {
    console.log('Creating favorite', fileId);
    const userToken = await AsyncStorage.getItem('userToken');
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': userToken,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(fileId),
    };
    try {
      const json = await doFetch(baseUrl + 'favourites', options);
      return json;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const deleteFavourite = async (fileId) => {
    console.log('Creating favorite', fileId);
    const userToken = await AsyncStorage.getItem('userToken');
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': userToken,
      },
    };
    try {
      const json = await doFetch(
        baseUrl + 'favourites/file/' + fileId,
        options
      );
      return json;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const getFavoriteAmount = async (token) => {
    const options = {
      headers: {
        'x-access-token': token,
      },
    };
    try {
      const json = await doFetch(baseUrl + 'favourites', options);
      return json.length;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return {createFavourite, deleteFavourite, getFavoriteAmount};
};

export {
  useLoadMedia,
  useLoadComments,
  useLoadFavourites,
  useLogin,
  useUser,
  useTag,
  useMedia,
  useComment,
  useFavourites,
};
