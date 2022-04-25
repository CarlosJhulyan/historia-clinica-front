import React from 'react';
import { Button, Form, Input } from 'antd';
import AppNotificationContainer from '../components/AppNotificationContainer';

import iconFavicon from '../assets/images/logo.png';
import iconFavicon2 from '../assets/images/biensalud-logo.ico';
import { useSelector } from 'react-redux';

export const SignInScreen = ({ anexo, logo, logo2, onFinish, onFinishFailed, isLoading, error }) => {
	const anexo1 = useSelector(state => state.anexo);

	if (anexo1.tipo === 'local') {
		// modificar favicon
		const favicon = document.querySelector('link[rel="shortcut icon"]');
		favicon.href = iconFavicon;
	} else {
		const favicon = document.querySelector('link[rel="shortcut icon"]');
		favicon.href = iconFavicon2;
	}

	return (
		<div className="gx-app-login-container">
			<div className="gx-app-login-main-content">
				<div className="gx-app-logo-content">
					{/*  <div className="gx-app-logo-content-bg">
                        <img src={logo} alt='Neature' />
                    </div> */}
					<div className="gx-app-logo-wid">
						<img src={anexo.tipo === 'local' ? logo : logo2} style={{ borderRadius: 50 }} alt="Neature" />
					</div>
					{/*   <div className="gx-app-logo">
                        <img alt="example" src="/assets/images/biensalud-logo.ico" />
                    </div> */}
				</div>
				<div className="gx-app-login-content">
					<div style={{ width: '100%', textAlign: 'center' }}>
						<h1 style={{ color: '#57494E' }}>Bienvenido</h1>
						{/*  <h5>Inicie sesión aquí con su N° de CMP y N° de DNI</h5> */}
					</div>
					<div>
						<Form
							initialValues={{ remember: true }}
							name="basic"
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							className="gx-signin-form gx-form-row0"
						>
							<Form.Item
								/* initialValue="demo@example.com" */
								label="CMP"
								// initialValue="45627"
								rules={[{ required: true, message: 'El N° Colegio es requerido!' }]}
								name="nroCMP"
							>
								<Input type="number" placeholder="CMP" />
							</Form.Item>

							<Form.Item
								/*  initialValue="demo#123" */
								label="DNI"
								// initialValue="40687356"
								rules={[{ required: true, message: 'El DNI es requerido!' }]}
								name="nroDoc"
							>
								<Input type="number" placeholder="DNI" />
							</Form.Item>
							{/* <Form.Item>
                            <Checkbox><IntlMessages id="appModule.iAccept" /></Checkbox>
                            <span className="gx-signup-form-forgot gx-link"><IntlMessages
                                id="appModule.termAndCondition" /></span>
                        </Form.Item> */}
							<Form.Item>
								<Button
									type="primary"
									className="gx-mb-0"
									style={{ width: '85%', marginLeft: '50px' }}
									htmlType="submit"
								>
									Ingresar
								</Button>
								{/* <span><IntlMessages id="app.userAuth.or" /></span> <Link to="/signup"><IntlMessages
                                id="app.userAuth.signUp" /></Link> */}
							</Form.Item>
							{/* <span
                            className="gx-text-light gx-fs-sm"> demo user email: 'demo@example.com' and password: 'demo#123'</span>*/}
						</Form>
					</div>
				</div>
				<AppNotificationContainer loading={isLoading} error={error} />
			</div>
		</div>
	);
};
