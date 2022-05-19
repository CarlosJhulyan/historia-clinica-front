import React, {
  useState,
  useEffect,
} from 'react';
import { 
  Modal,
  Form,
  Input,
  Button,
  Spin,
  notification
} from 'antd';
import moment from 'moment';

import { httpClient } from '../../util/Api';

function ModalTriaje({
  visibleModal,
  setVisibleModal,
  codPaciente
}) {
  const [loadingData, setLoadingData] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [editar, setEditar] = useState(true);
  const [datosEnviar, setDatosEnviar] = useState({
    PA1: '',
    PA2: '',
    FR: '',
    FC: '',
    TEMP: '',
    PESO: '',
    TALLA: '',
    SATURACION: '',
    COD_PACIENTE: codPaciente
  });

  const openNotification = (type, message, description) => {
		notification[type]({
			message,
			description,
		});
	};

  const handleChangeInputs = e => {
    setDatosEnviar({ ...datosEnviar, [e.target.name]: e.target.value });
  }

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

  const traerTriaje = async () => {
    setLoadingData(true);
    try {
      const { data: { data = [] } } = await httpClient.post(`triaje/getTriaje`, { COD_PACIENTE: codPaciente });
      if (data.length === 0) {
        const dataPaciente = {
          codGrupoCia: "001",
          codPaciente: codPaciente
        }
        const response = await httpClient.post(`/pacientes/getPaciente`, dataPaciente);
        setEditar(false);
        openNotification('warning', 'Triaje', 'Crear un pre triaje para el paciente');
        setDatosEnviar({
          ...datosEnviar,
          PACIENTE: `${response.data.data.APE_PATERNO.toUpperCase()} ${response.data.data.APE_MATERNO.toUpperCase()}, ${response.data.data.NOMBRE.toUpperCase()}`,
          USU_CREA: JSON.parse(localStorage.getItem('token')).usuario,
          COD_PACIENTE: response.data.data.COD_PACIENTE,
          NUM_HC: response.data.data.NRO_HC_ACTUAL,
          FECHA_NAC: moment(response.data.data.FEC_NAC_CLI, 'DD/MM/yyyy').format('yyyy/MM/DD')
        })
      } else {
        setEditar(true);
        setDatosEnviar({
          PA1: data.pa_1,
          PA2: data.pa_2,
          FR: data.fr,
          FC: data.fc,
          SATURACION: data.saturacion_oxigeno,
          TALLA: data.talla,
          PESO: data.peso,
          TEMP: data.temp,
          COD_PACIENTE: codPaciente,
          USU_CREA: JSON.parse(localStorage.getItem('token')).usuario
        });
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingData(false);
  }

  const actualizarTriaje = async () => {
    setLoadingFetch(true);
    try {
      const { data: { data = [], message, success } } = await httpClient.post(`triaje/upsertTriaje`, datosEnviar);
      if (success) {
        openNotification('success', 'Pre triaje', message);
        setVisibleModal(false);
        return;
      }
      openNotification('warning', 'Pre triaje', message);
    } catch (error) {
      console.log(error);
    }
    setLoadingFetch(false);
  }

  useEffect(() => {
    traerTriaje();
  }, [])
  

  return (
    <Modal
      width="500px"
      closable={false}
      title={
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gridTemplateRows: '1fr',
            gridColumnGap: '0px',
            gridRowGap: '0px',
            marginRight: '5%',
          }}
        >
          <div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px' }}>{editar ? 'Editar Pre triaje' : 'Generar Pre triaje'}</div>
        </div>
      }
      visible={visibleModal}
      footer={[
        <Button disabled={loadingData || loadingFetch} style={{ margin: '0 8px' }} onClick={() => setVisibleModal(false)}>
          Cancelar
        </Button>,
        <Button loading={loadingFetch} disabled={loadingData} type='primary' style={{ margin: '0 8px' }} onClick={() => actualizarTriaje()}>
          {editar ? 'Editar' : 'Crear'}
        </Button>
      ]}
      centered>
        {
          loadingData ? 
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Spin tip="Cargando" />
            </div> :
            <Form {...formItemLayout} style={{ width: '95%', margin: '0 auto' }}>
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
                <span style={{ marginTop: 10, marginLeft: '10px', padding: 0 }} className="ant-form-text">MMHG.</span>
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
        }
    </Modal>
  )
}

export default ModalTriaje;