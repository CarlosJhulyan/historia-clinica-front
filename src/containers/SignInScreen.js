import React from 'react';
import { Button, Form, Input, Tabs } from 'antd';
import AppNotificationContainer from '../components/AppNotificationContainer';

import { useSelector } from 'react-redux';

export const SignInScreen = ({
	onFinish,
	onFinishFailed,
	isLoading,
	error,
	onFinishUsuario,
}) => {
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const { TabPane } = Tabs;

	return (
		<div className="gx-app-login-container">
			<Tabs defaultActiveKey="1">
				<TabPane tab="Médico" key="1">
					<div className="gx-app-login-main-content">
						<div className="gx-app-logo-content">
							{/*  <div className="gx-app-logo-content-bg">
                        <img src={logo} alt='Neature' />
                    </div> */}
							<div className="gx-app-logo-wid">
								<img
									src={`${process.env.PUBLIC_URL}/assets/images/${themeSettingsGlobal.LOGO}`}
									style={{ borderRadius: 50 }}
                  alt={themeSettingsGlobal.COMPANIA}
                  title={themeSettingsGlobal.COMPANIA}
								/>
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
										initialValue=""
										rules={[{ required: true, message: 'El N° Colegio es requerido!' }]}
										name="nroCMP"
									>
										<Input type="number" placeholder="CMP" />
									</Form.Item>

									<Form.Item
										/*  initialValue="demo#123" */
										label="DNI"
										initialValue=""
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
											className="gx-mb-0"
											style={{ width: '85%', marginLeft: '50px', background: themeSettingsGlobal.COD_COLOR_1, color: '#fff' }}
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
				</TabPane>

				<TabPane tab="Personal" key="2">
					<div className="gx-app-login-main-content">
						<div className="gx-app-logo-content">
							<div className="gx-app-logo-wid">
								<img
									src={`${process.env.PUBLIC_URL}/assets/images/${themeSettingsGlobal.LOGO}`}
									style={{ borderRadius: 50 }}
									alt={themeSettingsGlobal.COMPANIA}
                  title={themeSettingsGlobal.COMPANIA}
								/>
							</div>
						</div>
						<div className="gx-app-login-content">
							<div style={{ width: '100%', textAlign: 'center' }}>
								<h1 style={{ color: '#57494E' }}>Bienvenido</h1>
							</div>
							<div>
								<Form
									initialValues={{ remember: true }}
									name="usuario-form"
									onFinish={onFinishUsuario}
									onFinishFailed={onFinishFailed}
									className="gx-signin-form gx-form-row0"
								>
									<Form.Item
										label="Usuario"
										initialValue=""
										rules={[{ required: true, message: 'El usuario es requerido!' }]}
										name="usuario"
									>
										<Input type="text" />
									</Form.Item>

									<Form.Item
										label="Contras"
										initialValue=""
										rules={[{ required: true, message: 'La contraseña es requerida!' }]}
										name="clave"
									>
										<Input.Password />
									</Form.Item>
									<Form.Item>
										<Button
											className="gx-mb-0"
											style={{ width: '85%', marginLeft: '50px', background: themeSettingsGlobal.COD_COLOR_1, color: '#fff' }}
											htmlType="submit"
										>
											Ingresar
										</Button>
									</Form.Item>
								</Form>
							</div>
						</div>
						<AppNotificationContainer loading={isLoading} error={error} />
					</div>
				</TabPane>
			</Tabs>
		</div>
	);
};
