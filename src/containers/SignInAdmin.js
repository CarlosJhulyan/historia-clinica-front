import React from 'react';
import { useAuth } from '../authentication';
import logo2 from '../assets/images/biensalud-logo.ico';
import { useSelector } from 'react-redux';
import { SignInAdminScreen } from './SignInAdminScreen';
import { Spin } from 'antd';
import { useHistory } from 'react-router-dom';

const SignInAdmin = () => {
	const { loadingAdmin, errorAdmin, adminLogin } = useAuth();
	const settings = useSelector(state => state.settings);

	const onFinishFailed = errorInfo => {};

	const onFinish = values => {
		adminLogin(values);
	};

	return (
		<div className="gx-app-login-wrap">
			{settings.loadingAdmin ? (
				<Spin tip="Iniciando Sesión de Administrador..." size="large">
					<SignInAdminScreen
						logo2={logo2}
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
						isLoading={loadingAdmin}
						error={errorAdmin}
						// goBack={() => history.push('/')}
					/>
				</Spin>
			) : (
				<SignInAdminScreen
					logo2={logo2}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					isLoading={loadingAdmin}
					error={errorAdmin}
					// goBack={() => history.push('/')}
				/>
			)}
		</div>
	);
};

export default SignInAdmin;
