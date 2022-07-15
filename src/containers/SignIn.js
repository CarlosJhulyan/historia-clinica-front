import React from 'react';
import { useAuth } from '../authentication';
import { Spin } from 'antd';
import { SignInScreen } from './SignInScreen';

const SignIn = () => {
	const { isLoading, error, userLogin, usuarioLogin } = useAuth();
	const onFinishFailed = errorInfo => {};

	const onFinish = values => {
		userLogin(values);
	};

	const onFinishUsuario = values => {
		usuarioLogin(values);
	};

	return (
		<div className="gx-app-login-wrap" /* style={{ backgroundImage: `url(${fondo})` }} */>
			{isLoading ? (
				<Spin tip="Iniciando Sesión..." size="large">
					<SignInScreen
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
						isLoading={isLoading}
						error={error}
						onFinishUsuario={onFinishUsuario}
					/>
				</Spin>
			) : (
				<SignInScreen
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					isLoading={isLoading}
					error={error}
					onFinishUsuario={onFinishUsuario}
				/>
			)}
		</div>
	);
};

export default SignIn;
