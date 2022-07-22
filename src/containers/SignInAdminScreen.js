import React from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { useSelector } from 'react-redux';

export const SignInAdminScreen = ({ onFinish, onFinishFailed }) => {
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);

	return (
		<div className="gx-app-login-container">
			<div className="gx-app-login-main-content">
				<div className="gx-app-logo-content">
					<div className="gx-app-logo-wid">
						<img
              src={`${process.env.PUBLIC_URL}/assets/images/${themeSettingsGlobal.LOGO}`}
              style={{ borderRadius: 50 }}
              alt="Neature"
              title={themeSettingsGlobal.COMPANIA}
            />
					</div>
				</div>
				<div className="gx-app-login-content">
					<div style={{ width: '100%', textAlign: 'center' }}>
						<h1 style={{ color: '#57494E' }}>Bienvenido Administrador</h1>
					</div>
					<div>
						<Form
							initialValues={{ remember: true }}
							name="form-admin"
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							className="gx-signin-form gx-form-row0"
						>
							<Form.Item
								label="Usuario"
								initialValue=""
								rules={[{ required: true, message: 'El usuario es requerido!' }]}
								name="usuario"
							>
								<Input placeholder="" />
							</Form.Item>

							<Form.Item
								label="Contras"
								initialValue=""
								rules={[{ required: true, message: 'La clave es requerido!' }]}
								name="clave"
							>
								<Input.Password placeholder="" />
							</Form.Item>
							<Form.Item>
								<Row>
									{/* <Col span={12}>
										<Button
											className="gx-mb-0"
											htmlType="button"
											style={{ width: '100%' }}
											onClick={() => goBack()}
										>
											Regresar
										</Button>
									</Col> */}
									<Col span={24}>
										<Button
											className="gx-mb-0"
											htmlType="submit"
											style={{ width: '100%', background: themeSettingsGlobal.COD_COLOR_1, color: '#fff' }}
										>
											Ingresar
										</Button>
									</Col>
								</Row>
							</Form.Item>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};
