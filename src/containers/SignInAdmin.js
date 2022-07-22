import React, { useEffect } from 'react';
import { useAuth } from '../authentication';
import { SignInAdminScreen } from './SignInAdminScreen';
import { message, Spin } from 'antd';
import AppNotificationContainer from '../components/AppNotificationContainer';

const SignInAdmin = () => {
	const { loadingAdmin, errorAdmin, adminLogin } = useAuth();
	const onFinishFailed = errorInfo => {};
	const onFinish = values => {
		adminLogin(values);
	};

  useEffect(() => {
    if (errorAdmin) message.error(errorAdmin);
  }, [errorAdmin]);

	return (
		<div className="gx-app-login-wrap">
      <Spin tip="Iniciando Sesión" size="large" spinning={loadingAdmin}>
        <SignInAdminScreen
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        />
      </Spin>
      {/*<AppNotificationContainer loading={loadingAdmin} error={errorAdmin} />*/}
		</div>
	);
};

export default SignInAdmin;
