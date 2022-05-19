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
      httpClient
        .post('sistema/getVersion')
        .then(({ data: { data, success } }) => {
          if (success) localStorage.setItem('version', data.num_version);
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
      httpClient
        .post('sistema/getVersion')
        .then(({ data: { data, success } }) => {
          if (success) localStorage.setItem('version', data.num_version);
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
    localStorage.removeItem('version');
    setAuthUser(false);
  };

  const getAuthUser = (data) => {
    fetchStart();
    fetchSuccess();
    setAuthUser(data);
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.

  useEffect(() => {
    const token = localStorage.getItem('token');    
    setAuthUser(JSON.parse(token));
    setLoadingUser(false);
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
