import React, { useEffect } from 'react';
import { useAuth } from '../authentication';
import { message, Spin } from 'antd';
import { SignInScreen } from './SignInScreen';
import AppNotificationContainer from '../components/AppNotificationContainer';

const SignIn = () => {
	const { isLoading, error, userLogin, usuarioLogin } = useAuth();
	const onFinishFailed = errorInfo => {};

	const onFinish = values => {
		userLogin(values);
	};

	const onFinishUsuario = values => {
		usuarioLogin(values);
	};

  useEffect(() => {
    if (error) message.error(error);
  }, [error]);

	return (
		<div className="gx-app-login-wrap">
      <Spin tip="Iniciando Sesión..." size="large" spinning={isLoading}>
        <SignInScreen
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onFinishUsuario={onFinishUsuario}
        />
      </Spin>
      {/*<AppNotificationContainer loading={isLoading} error={error} />*/}
		</div>
	);
};

export default SignIn;
