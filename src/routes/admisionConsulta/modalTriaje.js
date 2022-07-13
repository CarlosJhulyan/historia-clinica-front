import React, {
  useEffect,
  useState
} from 'react';
import {
  Modal,
  Form,
  Input,
  Button
} from 'antd';
import { httpClient } from '../../util/Api';
import { openNotification } from '../../util/util';

function ModalTriaje({
  setAbrirModal,
  abrirModal,
  numAtencionMedica, traerListaEspera,
  usuario
}) {
  const [datosEnviar, setDatosEnviar] = useState({
    NUM_ATENCION: '',
    USU_CREA: usuario,
    PA1: '',
    PA2: '',
    FR: '',
    FC: '',
    TEMP: '',
    PESO: '',
    TALLA: '',
    SATURACION: ''
  });
  const [loading, setLoading] = useState(false);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const handleChangeInputs = e => {
    setDatosEnviar({ ...datosEnviar, [e.target.name]: e.target.value });
  }

  const insertarTriaje = async () => {
    setLoading(true);
    try {
      const { data: { success, message } } = await httpClient.post('atencionMedica/setTriaje', datosEnviar);
      if (success) {
        openNotification('Insertar Triaje', message);
        traerListaEspera();
        setAbrirModal(false);
        setDatosEnviar({
          NUM_ATENCION: '',
          USU_CREA: JSON.parse(localStorage.getItem('token')).usuario,
          PA1: '',
          PA2: '',
          FR: '',
          FC: '',
          TEMP: '',
          PESO: '',
          TALLA: '',
          SATURACION: ''
        })
      } else {
        openNotification('Insertar Triaje', message, 'Warning');
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    setDatosEnviar({
      ...datosEnviar,
      NUM_ATENCION: numAtencionMedica
    })
  }, [numAtencionMedica]);

  return (
    <>
      <Modal
        width="600px"
        closable={false}
        centered
        title='Insertar Triaje'
        footer={[
          <Button
            type='primary'
            style={{ margin: '0 8px' }}
            loading={loading}
            onClick={() => insertarTriaje()}>
            Insertar
          </Button>
        ]}
        onCancel={() => setAbrirModal(false)}
        visible={abrirModal}
        onOk={async () => {

        }}
      >
        <div style={{
          // minHeight: '200px',
          // paddingTop: '40px',
          textAlign: 'center',
          borderRadius: '2px' }}>
          <Form {...formItemLayout} style={{ width: '85%', margin: '0 auto' }}>
            <Form.Item label="P. Arterial" style={{ textAlign: 'left' }}>
              <Form.Item
                rules={[{ required: true }]}
                style={{ display: 'inline-block', marginBottom: 0 }}
                noStyle
              >
                <Input
                  type='number'
                  name="PA1"
                  value={datosEnviar.PA1}
                  onChange={handleChangeInputs}
                  min={0}
                  style={{ width: '95px' }} placeholder="" />
              </Form.Item>
              <span style={{ marginTop: 10, margin: '0 10px', padding: 0, display: 'inline-block' }} className="ant-form-text">/</span>
              <Form.Item
                rules={[{ required: true }]}
                style={{ display: 'inline-block', marginBottom: 0 }}
                noStyle
              >
                <Input
                  type='number'
                  name="PA2"
                  value={datosEnviar.PA2}
                  onChange={handleChangeInputs}
                  min={0}
                  style={{ width: '90px' }} placeholder="" />
              </Form.Item>
              <span style={{ marginTop: 10, marginLeft: 10 }} className="ant-form-text">MMHG.</span>
            </Form.Item>
            <Form.Item label="F. Resporatoria" style={{ textAlign: 'left' }}>
              <Form.Item noStyle>
                <Input
                  type='number'
                  name="FR"
                  value={datosEnviar.FR}
                  onChange={handleChangeInputs}
                  min={0}
                  style={{ width: '95px' }} />
              </Form.Item>
              <span style={{ marginLeft: 10 }} className="ant-form-text"> X'.</span>
            </Form.Item>
            <Form.Item label="F. Cardiaca" style={{ textAlign: 'left' }}>
              <Form.Item noStyle>
                <Input
                  type='number'
                  name="FC"
                  value={datosEnviar.FC}
                  onChange={handleChangeInputs}
                  min={0}
                  style={{ width: '95px' }} />
              </Form.Item>
              <span style={{ marginLeft: 10 }} className="ant-form-text"> X'.</span>
            </Form.Item>
            <Form.Item label="Temperatura" style={{ textAlign: 'left' }}>
              <Form.Item noStyle>
                <Input
                  type='number'
                  name="TEMP"
                  value={datosEnviar.TEMP}
                  onChange={handleChangeInputs}
                  min={0}
                  style={{ width: '95px' }} />
              </Form.Item>
              <span style={{ marginLeft: 10 }} className="ant-form-text"> °C.</span>
            </Form.Item>
            <Form.Item label="Peso" style={{ textAlign: 'left' }}>
              <Form.Item noStyle>
                <Input
                  type='number'
                  name="PESO"
                  value={datosEnviar.PESO}
                  onChange={handleChangeInputs}
                  min={0}
                  style={{ width: '95px' }} />
              </Form.Item>
              <span style={{ marginLeft: 10 }} className="ant-form-text"> Kg.</span>
            </Form.Item>
            <Form.Item label="Talla" style={{ textAlign: 'left' }}>
              <Form.Item noStyle>
                <Input
                  type='number'
                  name="TALLA"
                  value={datosEnviar.TALLA}
                  onChange={handleChangeInputs}
                  min={0}
                  style={{ width: '95px' }} />
              </Form.Item>
              <span style={{ marginLeft: 10 }} className="ant-form-text"> cms.</span>
            </Form.Item>
            <Form.Item label="Saturación O2" style={{ textAlign: 'left' }}>
              <Form.Item noStyle>
                <Input
                  type='number'
                  name="SATURACION"
                  value={datosEnviar.SATURACION}
                  onChange={handleChangeInputs}
                  min={0}
                  style={{ width: '95px' }} />
              </Form.Item>
              <span style={{ marginLeft: 10 }} className="ant-form-text"> %</span>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  )
}

export default ModalTriaje;
