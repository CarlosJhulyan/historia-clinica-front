import React from 'react';
// import { Button, Form, Input } from 'antd';
import { useAuth } from '../authentication';
// import AppNotificationContainer from '../components/AppNotificationContainer';
//import fondo from '../assets/fondo-login/dentist.jpg'
import logo from '../assets/images/logoP.jpeg';
import logo2 from '../assets/images/biensalud-logo.ico';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';
import { SignInScreen } from './SignInScreen';

const SignIn = () => {
	const { isLoading, error, userLogin, usuarioLogin } = useAuth();
	const settings = useSelector(state => state.settings);
	const onFinishFailed = errorInfo => {};
	const anexo = useSelector(state => state.anexo);

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
						anexo={anexo}
						logo={logo}
						logo2={logo2}
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
						isLoading={isLoading}
						error={error}
            onFinishUsuario={onFinishUsuario}
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
          onFinishUsuario={onFinishUsuario}
        />
			)}
		</div>
	);
};

export default SignIn;
