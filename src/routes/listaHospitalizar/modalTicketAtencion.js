import React, { 
  useState, 
  useCallback,
  useEffect,
  useRef
} from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Radio,
  Steps,
  InputNumber,
  notification,
  Alert
} from 'antd';
import {
  SearchOutlined
} from '@ant-design/icons'

import { httpClient } from '../../util/Api';
import ModalDetalles from '../registroPaciente/modalDetalles';
import moment from 'moment';

function ModalTicketAtencion({
  setAbrirModal,
  abrirModal,
  traerDatosTable
}) {
  const formTriaje = useRef();
  const { Step } = Steps;
  const [current, setCurrent] = React.useState(0);
  const [abrirModalNew, setAbrirModalNew] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState([]);
	const [tipoPariente, setTipoPariente] = useState([]);
	const [estadoCivil, setEstadoCivil] = useState([]);
  const [areaDesignada, setAreaDesignada] = useState('1');
  const [loadingData, setLoadingData] = useState(false);
  const [numDocumento, setNumDocumento] = useState('');
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [data, setData] = useState({});
  const [datosEnviar, setDatosEnviar] = useState({
    COD_PACIENTE: '',
    NUM_ATEN_MED: '',
    PA1: '',
    PA2: '',
    FR: '',
    FC: '',
    TEMP: '',
    PESO: '',
    TALLA: '',
    SATURACION: ''
  });

  const [message, setMessage] = useState({
    text: '',
    type: 'info',
    visible: false
  })

  const traerTipoDocumento = useCallback(async () => {
		const acomp = {
			codGrupoCia: '001',
		};
		const { data: { data = [] } } = await httpClient.post('/pacientes/getTipoDoc', acomp);
		setTipoDocumento(data);
	}, []);

	const traerTipoParientes = useCallback(async () => {
		const acomp = {
			codGrupoCia: '001',
		};
		const { data: { data = [] } } = await httpClient.post('/pacientes/getTipoAcomp', acomp);
		setTipoPariente(data);
	}, []);

	const traerEstadoCivil = useCallback(async () => {
		const acomp = {
			codGrupoCia: '001',
		};
		const { data: { data = [] } } = await httpClient.post('/pacientes/getEstadoCivil', acomp);
		setEstadoCivil(data);
	}, []);

  const handleChangeAreaDesignada = (e) => {
    setAreaDesignada(e.target.value);
  }

  const openNotification = (type, message, description) => {
		notification[type]({
			message,
			description,
		});
	};

  useEffect(() => {
    traerEstadoCivil();
    traerTipoDocumento();
    traerTipoParientes();
  }, [])

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

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

  const traerDatos = useCallback(async () => {
		setLoadingData(true);
    const datosSearch = {
      DOC_TIP_DOCUMENTO: '01',
      NUM_DOCUMENTO: numDocumento
    }

		try {
			const { data: { data = [], message } } = await httpClient.post(`/pacientes/searchPacientes`, datosSearch);
      if (data.length === 0) {
        setData({});
        setMessage({
          text: message,
          type: 'info',
          visible: true
        });
      } else {
        setData(data[0]);
        const dataPaciente = {
          codGrupoCia: "001",
          codPaciente: data[0].key
        }
        const response = await httpClient.post(`/pacientes/getPaciente`, dataPaciente);
        setDatosEnviar({
          ...datosEnviar,
          PACIENTE: `${data[0].APE_PATERNO.toUpperCase()} ${data[0].APE_MATERNO.toUpperCase()}, ${data[0].NOMBRE.toUpperCase()}`,
          USU_CREA: JSON.parse(localStorage.getItem('token')).usuario,
          COD_PACIENTE: response.data.data.COD_PACIENTE,
          NUM_HC: response.data.data.NRO_HC_ACTUAL,
          FECHA_NAC: moment(response.data.data.FEC_NAC_CLI, 'DD/MM/yyyy').format('yyyy/MM/DD'),
        });
        setMessage({
          text: `${data[0].APE_PATERNO.toUpperCase()} ${data[0].APE_MATERNO.toUpperCase()}, ${data[0].NOMBRE.toUpperCase()}`,
          type: 'success',
          visible: true
        });
      }
		} catch (e) {
			openNotification('error', 'Búsqueda', e.message);
      setMessage({ type: 'error', visible: false })
			setData([]);
		}
		setLoadingData(false);
	}, [numDocumento, datosEnviar]);

  const handleSearchPacientePorDNI = () => {
    traerDatos();
  }

  const handleChangeInputs = e => {
    setDatosEnviar({ ...datosEnviar, [e.target.name]: e.target.value });
  }

  const fetchData = async () => {
    setLoadingFetch(true);
    try {
      const dataFetch = {
        ...datosEnviar,
        ASIGNADO: areaDesignada,
      }
      const { data: { data = [], message, success } } = await httpClient.post(`triaje/upsertTriaje`, dataFetch);
      if (success) {
        openNotification('success', 'Triaje', message);
        setAbrirModal(false);
        traerDatosTable();
      } else {
        openNotification('warning', 'Triaje', message);
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingFetch(false);
  }

  const steps = [
    {
      title: 'Generar',
      content: (
        <Form style={{ width: '80%', margin: '0 auto' }}>
          <Form.Item style={{ textAlign: 'left' }} label='Ingreso Paciente'>
            <Input.Group compact>
              <Input
                value={numDocumento}
                placeholder='Buscar por DNI'
                type='number'
                style={{ maxWidth: 'calc(100% - 187px)' }}
                onChange={e => setNumDocumento(e.target.value)} />
              <Button htmlType='submit' loading={loadingData} disabled={numDocumento.length < 8} onClick={handleSearchPacientePorDNI}>
                <SearchOutlined />
              </Button>
              <Button
                onClick={() => setAbrirModalNew(true)}
                type="primary">
                  Crear Nuevo
              </Button>
            </Input.Group>
            {message.visible && <Alert message={message.text} type={message.type} showIcon />}
          </Form.Item>
          <Form.Item
            style={{ textAlign: 'right' }}
            label='Area Designada'>
              <Radio.Group 
                value={areaDesignada} 
                // size="small"
                onChange={handleChangeAreaDesignada}
                buttonStyle="solid">
                  <Radio.Button value="1">Hospitalización</Radio.Button>
                  <Radio.Button value="2">Emergencia</Radio.Button>
                  <Radio.Button value="3">UCI</Radio.Button>
                  <Radio.Button value="4">SOP</Radio.Button>
              </Radio.Group>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Triaje',
      content: (
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
            <span style={{ marginTop: 10 }} className="ant-form-text">MMHG.</span>
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
      ),
    }
  ];
  
  return (
    <>
      <Modal 
        width="600px"
        closable={false}
        centered
        title={
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: '1fr',
              gridColumnGap: '0px',
              gridRowGap: '0px',
              marginRight: '5%',
            }}
          >
            <div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px' }}>Generar Ticket de Atención</div>
            <div>
            <Steps current={current}>
              {steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            </div>
          </div>
        }
        footer={[
          current > 0 ? (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Anterior
            </Button>
          ) : (
            <Button style={{ margin: '0 8px' }} onClick={() => setAbrirModal(false)}>
              Cancelar
            </Button>
          ),
          current < steps.length - 1 && (
            <Button disabled={message.type !== 'success'} type="primary" onClick={() => next()}>
              Siguiente
            </Button>
          ),
          current === steps.length - 1 && (
            <Button type="primary" onClick={() => fetchData()} loading={loadingFetch}>
              Generar
            </Button>
          )
        ]}
        visible={abrirModal}
        onOk={async () => {
          
        }}
      >
        <div style={{ 
          // minHeight: '200px',
          // paddingTop: '40px',
          textAlign: 'center',
          borderRadius: '2px' }}>
            {steps[current].content}
        </div>
      </Modal>

      {abrirModalNew ? (
				<ModalDetalles
					abrirModal={abrirModalNew}
					setAbrirModal={setAbrirModalNew}
					isModalEdit={false}
          tipoDocumento={tipoDocumento}
					estadoCivil={estadoCivil}
					tipoPariente={tipoPariente}
				/>
			) : null}
    </>
  )
}

export default ModalTicketAtencion;