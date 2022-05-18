import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoginLoading } from '../../../appRedux/actions/Setting';
import { httpClient } from "../../../util/Api";

export const useProvideAuth = () => {
  const [authUser, setAuthUser] = useState(null);
  const [error, setError] = useState('');
  const [isLoadingUser, setLoadingUser] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();


  const fetchStart = () => {
    setLoading(true);
    setError('');
  };

  const fetchSuccess = () => {
    setLoading(false);
    setError('');
  };

  const fetchError = (error) => {
    setLoading(false);
    setError(error);
  };

  const userLogin = (user, callbackFun) => {
    dispatch(setLoginLoading(true));
    console.log("CARGanDOOOOO...",);
    fetchStart();
    /*  var login = 'http://192.168.123.1/api/login'; */
    httpClient
      .post(`/login`, user)
      .then(({ data }) => {
        if (data.success) {
          dispatch(setLoginLoading(false));
          fetchSuccess();
          // httpClient.defaults.headers.common['Authorization'] = 'Bearer ' + data.token.access_token;          
          localStorage.setItem('token', JSON.stringify(data.data));
          getAuthUser(data.data);
          if (callbackFun) callbackFun();
        } else {
          fetchError(data.message);
        }
      })
      .catch(function (error) {
        fetchError(error.message);
      });
  };

  const userSignup = (user, callbackFun) => {

    fetchStart();
    httpClient
      .post('auth/register', user)
      .then(({ data }) => {
        if (data.result) {
          fetchSuccess();
          localStorage.setItem('token', data.token.access_token);
          httpClient.defaults.headers.common['Authorization'] = 'Bearer ' + data.token.access_token;
          getAuthUser();
          if (callbackFun) callbackFun();
        } else {
          fetchError(data.error);
        }
      })
      .catch(function (error) {
        fetchError(error.message);
      });
  };

  const sendPasswordResetEmail = (email, callbackFun) => {
    fetchStart();

    setTimeout(() => {
      fetchSuccess();
      if (callbackFun) callbackFun();
    }, 300);
  };

  const confirmPasswordReset = (code, password, callbackFun) => {
    fetchStart();

    setTimeout(() => {
      fetchSuccess();
      if (callbackFun) callbackFun();
    }, 300);
  };

  const renderSocialMediaLogin = () => null;

  const userSignOut = (callbackFun) => {
    fetchStart();
    fetchSuccess();
    localStorage.removeItem('token');
    setAuthUser(false);
    // httpClient
    //   .post('auth/logout')
    //   .then(({ data }) => {
    //     if (data.result) {
    //       fetchSuccess();
    //       httpClient.defaults.headers.common['Authorization'] = '';
    //       localStorage.removeItem('token');
    //       setAuthUser(false);
    //       if (callbackFun) callbackFun();
    //     } else {
    //       fetchError(data.error);
    //     }
    //   })
    //   .catch(function (error) {
    //     fetchError(error.message);
    //   });
  };

  const getAuthUser = (data) => {
    fetchStart();
    fetchSuccess();
    setAuthUser(data);
    // httpClient
    //   .post('auth/me')
    //   .then(({ data }) => {
    //     if (data.user) {
    //       fetchSuccess();
    //       setAuthUser(data.user);
    //     } else {
    //       fetchError(data.error);
    //     }
    //   })
    //   .catch(function (error) {
    //     httpClient.defaults.headers.common['Authorization'] = '';
    //     fetchError(error.message);
    //   });
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.

  useEffect(() => {
    const token = localStorage.getItem('token');
    // if (token) {
    //   httpClient.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    // }
    setAuthUser(JSON.parse(token));
    setLoadingUser(false);
    // httpClient
    //   .post('auth/me')
    //   .then(({ data }) => {
    //     if (data.user) {
    //     }
    //     setLoadingUser(false);
    //   })
    //   .catch(function () {
    //     localStorage.removeItem('token');
    //     httpClient.defaults.headers.common['Authorization'] = '';
    //     setLoadingUser(false);
    //   });
  }, []);

  // Return the user object and auth methods
  return {
    isLoadingUser,
    isLoading,
    authUser,
    error,
    setError,
    setAuthUser,
    getAuthUser,
    userLogin,
    userSignup,
    userSignOut,
    renderSocialMediaLogin,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
};
