import React, { useEffect } from 'react';
import { Button, Form, Input, message, Spin } from 'antd';
import AppNotificationContainer from "../components/AppNotificationContainer";
import { useAuth } from "../authentication";

const SignInReports = (props) => {
  const { loadingReports, errorReports, reportsLogin } = useAuth();

  const onFinishFailed = (errorInfo) => {};

  const onFinish = (values) => {
    reportsLogin(values);
  };

  useEffect(() => {
    if (errorReports) message.error(errorReports);
  }, [errorReports]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin tip="Iniciando sesión" size="large" spinning={loadingReports}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="gx-app-login-main-content">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <h1 style={{ color: "#323332" }}>Iniciar sesión</h1>
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
                    rules={[
                      { required: true, message: "El usuario requerido" },
                    ]}
                    name="usuario"
                  >
                    <Input type="text" placeholder="Usuario" />
                  </Form.Item>

                  <Form.Item
                    rules={[
                      { required: true, message: "La clave es requerida" },
                    ]}
                    name="clave"
                  >
                    <Input type="password" placeholder="Clave" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      className="gx-mb-0"
                      htmlType="submit"
                      style={{ width: "100%" }}
                    >
                      Ingresar
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
            {/*<AppNotificationContainer loading={loadingReports} error={errorReports} />*/}
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default SignInReports;
