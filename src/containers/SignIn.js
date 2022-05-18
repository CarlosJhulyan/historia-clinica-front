import React from 'react';
import { Button, Form, Input } from 'antd';
import { useAuth } from '../authentication';
import AppNotificationContainer from '../components/AppNotificationContainer';
//import fondo from '../assets/fondo-login/dentist.jpg'
import logo from '../assets/images/logoP.jpeg';
import logo2 from '../assets/images/biensalud-logo.ico';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';
import { SignInScreen } from './SignInScreen';

const SignIn = () => {
	const { isLoading, error, userLogin } = useAuth();
	const settings = useSelector(state => state.settings);
	/* const token = JSON.parse(sessionStorage.getItem("token"));
	console.log("TOKEN:", token);

	if (token === null) {
	} */

	const onFinishFailed = errorInfo => {};

	const anexo = useSelector(state => state.anexo);

	const onFinish = values => {
		userLogin(values);
	};

	return (
		<div className="gx-app-login-wrap" /* style={{ backgroundImage: `url(${fondo})` }} */>
			{settings.loading ? (
				<Spin tip="Iniciando Sesión..." size="large">
					<SignInScreen
						anexo={anexo}
						logo={logo}
						logo2={logo2}
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
						isLoading={isLoading}
						error={error}
					/>
				</Spin>
			) : (
				<SignInScreen
					anexo={anexo}
					logo={logo}
					logo2={logo2}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					isLoading={isLoading}
					error={error}
				/>
			)}
		</div>
	);
};

export default SignIn;
