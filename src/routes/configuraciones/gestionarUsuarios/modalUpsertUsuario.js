import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Col, DatePicker, Divider,
  Form, Input, InputNumber,
  Modal, Row
} from 'antd';
import { httpClient } from '../../../util/Api';
import moment from 'moment';
import { useAuth } from '../../../authentication';
import { openNotification } from '../../../util/util';

const ModalUpsertUsuario = ({
                              visible,
                              setVisible,
                              currentUsuario,
                              dataFetchInit,
                              getUsers,
}) => {
  const formRef = useRef();
  const { authAdmin } = useAuth();
  const [loadingUpsert, setLoadingUpsert] = useState(false);

  const handleUpsertUsuario = async (values) => {
    setLoadingUpsert(true);
    const dataFormat = {
      ...dataFetchInit,
      ...values,
      codTrabRH: '',
      codTrab: '',
      fecNac: moment(values.fecNac._d).format('DD/MM/yyyy'),
      codUsu: authAdmin.login_usu
    }

    if (currentUsuario) {
      dataFormat.codSecUsu = currentUsuario.key;
      const {
        data: { success, message }
      } = await httpClient.post('admin/updateUsuario', dataFormat);

      if (success) {
        openNotification('Cliente actualiza', message);
        getUsers();
        setVisible(false);
      } else openNotification('Cliente actualiza', message, 'Warning');
    } else {
      const {
        data: { success, message }
      } = await httpClient.post('admin/createUsuario', dataFormat);

      if (success) {
        openNotification('Cliente registro', message);
        getUsers();
        setVisible(false);
      } else openNotification('Cliente regitro', message, 'Warning');
    }
    setLoadingUpsert(false);
  }

  useEffect(() => {
    if (currentUsuario) {
      formRef.current.setFieldsValue({
        nomUsu: currentUsuario.NOMBRE,
        apePat: currentUsuario.APE_PAT,
        apeMat: currentUsuario.APE_MAT,
        direccUsu: currentUsuario.DIRECCION,
        dni: currentUsuario.DNI,
        fecNac: moment(currentUsuario.FEC_NAC, 'DD/MM/yyyy'),
        telefUsu: currentUsuario.TELEFONO,
        loginUsu: currentUsuario.USUARIO,
      });
    }
  }, []);

  return (
    <>
      <Modal
        className='modal-posventa'
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button
            form='form-upsert-cliente'
            htmlType='submit'
            loading={loadingUpsert}
            style={{background: '#0169aa', color:'#fff'}}
          >
            {currentUsuario ? 'Actualizar' : 'Crear'}
          </Button>,
          <Button
            disabled={loadingUpsert}
            onClick={() => setVisible(false)}
          >
            Salir
          </Button>
        ]}
        width={800}
        title='Mantenimiento de Usuarios'
      >
        <Form
          ref={formRef}
          onFinish={handleUpsertUsuario}
          id='form-upsert-cliente'
          // size='small'
          labelCol={{
            span: 7
          }}
          wrapperCol={{
            span: 14
          }}
        >
          <Row justify='center'  style={{backgroundColor: '#0169aa'}} align='middle'>
            <Col style={{color: '#fff', marginTop:10}} span={24}>
              Num. Sec. Usuario
            </Col>
            <Col span={12}>
              <Form.Item
                label='Id'
                style={{margin:0, alignItems:'center'}}
                className='usuarios-activos'
                name='loginUsu'
                rules={[{
                  required:true,
                }]}
              >
                <Input
                  style={{marginTop:5,marginBottom:10}}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Clave Usuario'
                style={{margin:0, alignItems:'center'}}
                className='usuarios-activos'
                name='claveUsu'
                rules={[{
                  required: true,
                  type: 'number'
                }]}
              >
                <InputNumber
                  style={{marginTop:5,marginBottom:10,width:'100%'}}
                />
              </Form.Item>
            </Col>
          </Row>
          <Card style={{marginTop:10,marginBottom:0}}>
            <Row justify='center'>
              <Col span={24}>
                <Form.Item
                  label='Apellido Paterno'
                  name='apePat'
                  rules={[{
                    required:true
                  }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label='Apellido Materno'
                  name='apeMat'
                  rules={[{
                    required:true
                  }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label='Nombres'
                  name='nomUsu'
                  rules={[{
                    required:true
                  }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label='Dirección'
                  name='direccUsu'
                  rules={[{

                  }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label='Teléfono'
                  name='telefUsu'
                  rules={[{
                    len:9
                  }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label='DNI'
                  name='dni'
                  rules={[{
                    len:8,
                    required: true
                  }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label='Fecha Nacimiento'
                  name='fecNac'
                  rules={[{
                    required: true
                  }]}
                >
                  <DatePicker
                    format='DD/MM/yyyy'
                    placeholder='Seleccione fecha'
                    style={{width:'100%'}}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
      </Modal>
    </>
  );
}

export default ModalUpsertUsuario;
