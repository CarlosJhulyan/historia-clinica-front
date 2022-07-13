import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
	setLoginLoading,
	setLoginAdminLoading,
	setLoginReportsLoading,
} from '../../../appRedux/actions/Setting';
import { httpClient, httpClientReports } from '../../../util/Api';

export const useProvideAuth = () => {
	const [authUser, setAuthUser] = useState(null);
	const [authAdmin, setAuthAdmin] = useState(null);
	const [authReports, setAuthReports] = useState(null);
	const [error, setError] = useState('');
	const [errorReports, setErrorReports] = useState('');
	const [isLoadingUser, setLoadingUser] = useState(true);
	const [isLoading, setLoading] = useState(false);
	const [loadingAdmin, setLoadingAdmin] = useState(false);
	const [loadingReports, setLoadingReports] = useState(false);
	const [errorAdmin, setErrorAdmin] = useState('');
	const dispatch = useDispatch();

	const fetchStart = () => {
		setLoading(true);
		setError('');
	};

	const fetchSuccess = () => {
		setLoading(false);
		setError('');
	};

	const fetchError = error => {
		setLoading(false);
		setError(error);
	};

	const fetchStartAdmin = () => {
		setLoadingAdmin(true);
		setErrorAdmin('');
	};

	const fetchSuccessAdmin = () => {
		setLoadingAdmin(false);
		setErrorAdmin('');
	};

	const fetchErrorAdmin = error => {
		setLoadingAdmin(false);
		setErrorAdmin(error);
	};

	const fetchStartReports = () => {
		setLoadingReports(true);
		setErrorReports('');
	};

	const fetchSuccessReports = () => {
		setLoadingReports(false);
		setErrorReports('');
	};

	const fetchErrorReports = error => {
		setLoadingReports(false);
		setErrorReports(error);
	};

	const userLogin = (user, callbackFun) => {
		dispatch(setLoginLoading(true));
		fetchStart();
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

	const usuarioLogin = (user, callbackFun) => {
		dispatch(setLoginLoading(true));
		fetchStart();
		httpClient
			.post(`/loginUsuLocal`, user)
			.then(({ data: dataLogin }) => {
				if (dataLogin.success) {
					httpClient
						.post('/login/getUsuario', user)
						.then(({ data }) => {
							dispatch(setLoginLoading(false));
							fetchSuccess();
							localStorage.setItem(
								'token',
								JSON.stringify({
									...dataLogin,
									data: data.data,
								})
							);
							getAuthUser({
								...dataLogin,
								data: data.data,
							});
							if (callbackFun) callbackFun();
						})
						.catch(function (error) {});
				} else {
					fetchError(dataLogin.message);
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

	const adminLogin = (admin, callbackFun) => {
		dispatch(setLoginAdminLoading(true));
		fetchStartAdmin();
		httpClient
			.post(`/login-admin`, admin)
			.then(({ data }) => {
				if (data.success) {
					dispatch(setLoginAdminLoading(false));
					fetchSuccessAdmin();
					localStorage.setItem('token-admin', JSON.stringify(data.data));
					getAuthAdmin(data.data);
					if (callbackFun) callbackFun();
				} else {
					dispatch(setLoginAdminLoading(false));
					fetchErrorAdmin(data.message);
				}
			})
			.catch(function (error) {
				fetchErrorAdmin(error.message);
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

	const reportsLogin = (user, callbackFun) => {
		dispatch(setLoginReportsLoading(true));
		fetchStartReports();
		httpClient
			.post(`/loginUsuLocal`, user)
			.then(({ data }) => {
				if (data.success) {
					fetchSuccessReports();
					data.modulos.sort();
					localStorage.setItem('token-reports', JSON.stringify(data));
					getAuthReports(data);
					if (callbackFun) callbackFun();
				} else {
					fetchErrorReports(data.message);
				}
			})
			.catch(function (error) {
				fetchErrorReports(error.message);
			});
		dispatch(setLoginReportsLoading(false));
	};

	const reportsSignOut = callbackFun => {
		fetchStartReports();
		fetchSuccessReports();
		localStorage.removeItem('token-reports');
		setAuthReports(null);
	};

	const renderSocialMediaLogin = () => null;

	const userSignOut = callbackFun => {
		fetchStart();
		fetchSuccess();
		localStorage.removeItem('token');
		localStorage.removeItem('version');
		setAuthUser(false);
	};

	const adminSignOut = callbackFun => {
		fetchStartAdmin();
		fetchSuccessAdmin();
		localStorage.removeItem('token-admin');
		setAuthAdmin(null);
		if (callbackFun) callbackFun();
	};

	const getAuthReports = data => {
		fetchStartReports();
		fetchSuccessReports();
		setAuthReports(data);
	};

	const getAuthUser = data => {
		fetchStart();
		fetchSuccess();
		setAuthUser(data);
	};

	const getAuthAdmin = data => {
		fetchStartAdmin();
		fetchSuccessAdmin();
		setAuthAdmin(data);
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

	useEffect(() => {
		const tokenAdmin = localStorage.getItem('token-admin');
		setAuthAdmin(JSON.parse(tokenAdmin));
		setLoadingAdmin(false);
	}, []);

	useEffect(() => {
		const tokenReports = localStorage.getItem('token-reports');
		setAuthReports(JSON.parse(tokenReports));
		setLoadingReports(false);
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
		getAuthAdmin,
		adminLogin,
		adminSignOut,
		loadingAdmin,
		errorAdmin,
		authAdmin,
		getAuthReports,
		reportsLogin,
		reportsSignOut,
		loadingReports,
		errorReports,
		authReports,
		usuarioLogin,
	};
};
