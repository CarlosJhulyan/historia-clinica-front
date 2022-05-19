import React, {
  useState,
  useCallback
} from 'react';
import { 
  Card,
  Form,
  Input,
  notification,
  Col,
  Button,
  DatePicker,
  Row,
  TimePicker,
  Divider
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import moment from 'moment';

import { httpClient } from '../../util/Api';
import { openNotification } from '../../util/util';

function TomaPreTriaje() {
  const date = moment().locale('es');
  const [disableFetch, setDisableFetch] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [dateCurrent, setDateCurrent] = useState(moment());
  const [timeCurrent, setTimeCurrent] = useState(moment());
  const [disableEditDate, setDisableEditDate] = useState(true);
  const [dataFound, setDataFound] = useState({
    NUM_DOCUMENTO: '',
    APE_MATERNO: '',
    APE_PATERNO: '',
    NOMBRE: ''
  })
  const [searchDniText, setSearchDniText] = useState('');
  const [datosEnviar, setDatosEnviar] = useState({
    PA1: '',
    PA2: '',
    FR: '',
    FC: '',
    TEMP: '',
    PESO: '',
    TALLA: '',
    SATURACION: '',
    COD_PACIENTE: ''
  });

  const [dateTime, setDateTime] = useState({
		hours: date.format('H'),
		minutes: date.format('mm'),
		seconds: date.format('ss'),
		indicador: date.format('a'),
    date: moment()
	});

  const handleChangeDateCurrent = (e) => {
    setDateCurrent(e);
    if (e) {
      setDateTime({
        ...dateTime,
        date: e
      });
    } else {
      setDateTime({
        ...dateTime,
        date: moment()
      });
    }
  }

  const handleChangeTimeCurrent = (e) => {
    setTimeCurrent(e)
    if (e) {
      setDateTime({
        ...dateTime,
        hours: e.format('H'),
        minutes: e.format('mm'),
        seconds: e.format('ss'),
        indicador: e.format('a')
      });
    } else {
      setDateTime({
        ...dateTime,
        hours: date.format('H'),
        minutes: date.format('mm'),
        seconds: date.format('ss'),
        indicador: date.format('a')
      });
    }
  }

  const handleChangeEditDate = () => {
    setDisableEditDate(x => !x);
    setDateTime({
      hours: date.format('H'),
      minutes: date.format('mm'),
      seconds: date.format('ss'),
      indicador: date.format('a'),
      date: moment()
    });
    setDateCurrent(null);
    setTimeCurrent(null);
  }

  const traerDatos = useCallback(async () => {
		setLoadingData(true);
    const datosSearch = {
      DOC_TIP_DOCUMENTO: '01',
      NUM_DOCUMENTO: searchDniText
    }

		try {
			const { data: { data = [], message } } = await httpClient.post(`/pacientes/searchPacientes`, datosSearch);
      if (data.length !== 0) {
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
          COD_USU_CREA: JSON.parse(localStorage.getItem('token')).num_cmp,
        });
        setDataFound({
          ...response.data.data
        })
        openNotification('Pre triaje', message);
        setDisableFetch(false);
      } else {
        setDataFound({
          NUM_DOCUMENTO: '',
          APE_MATERNO: '',
          APE_PATERNO: '',
          NOMBRE: ''
        });
        setDisableFetch(true);
      }
		} catch (e) {
			openNotification('error', 'Búsqueda', e.message);
      setDisableFetch(true);
		}
		setLoadingData(false);
	}, [datosEnviar, searchDniText]);

  const handleSearchPacientePorDNI = () => {
    traerDatos();
  }

  const fetchData = async () => {
    const date = `${dateTime.date.format('yyyy-MM-DD')} ${dateTime.hours}:${dateTime.minutes}:${dateTime.seconds}`;
    setDatosEnviar({
      ...datosEnviar,
      FECHA_TOMA: date
    });
    setLoadingFetch(true);
    try {
      const { data: { message, success } } = await httpClient.post('preTriaje/setPreTriaje', datosEnviar);
      if (success) {
        openNotification('Pre triaje', message);
      } else {
        openNotification('Pre triaje', message, 'Warning');
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingFetch(false);
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 4 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const handleChangeDniText = (e) => {
    setSearchDniText(e.target.value);
  }

  const handleChangeInputs = e => {
    setDatosEnviar({ ...datosEnviar, [e.target.name]: e.target.value });
  }

  return (
    <Card
      title={
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '250px auto 200px',
            gridTemplateRows: '1fr',
            gridColumnGap: '0px',
            gridRowGap: '0px',
            marginRight: '5%',
          }}
        >
          <div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px', paddingTop: '30px' }}>Toma de Pre triaje</div>
          <div
            style={{
              gridArea: '1 / 2 / 2 / 3',
              display: 'flex',
              flexDirection: 'row-reverse',
              paddingTop: '15px',
            }}
          >
            <Form
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                gap: '40px',
              }}
            >
              <Form.Item style={{ width: '200px', margin: 0 }}>
                <Input
                  value={searchDniText}
                  onChange={handleChangeDniText}
                  type='number'
                  style={{ width: '100%' }}
                  placeholder="DNI"
                />
              </Form.Item>
            </Form>
          </div>
          <div
							style={{
                display: 'flex',
                alignItems: 'center',
								flexDirection: 'row-reverse',
								paddingTop: '15px',
                gap: 10
							}}
						>
							<Button
								loading={loadingFetch}
								style={{
									backgroundColor: '#04B0AD',
									color: 'white',
                  marginTop: '10px'
								}}
								onClick={() => fetchData()}
								disabled={disableFetch}
							>
								Ingresar
							</Button>
              <Button
								loading={loadingData}
								style={{
									backgroundColor: '#04B0AD',
									color: 'white',
                  marginTop: '10px'
								}}
                htmlType='submit'
                onClick={handleSearchPacientePorDNI}
								disabled={searchDniText.length !== 8}
							>
								<SearchOutlined />
							</Button>
						</div>
        </div>
      }>
        <span>Datos de Paciente</span>
        <Form
          style={{ marginTop: 20 }}
          layout='vertical'>
          <Row
            style={{
							flexDirection: 'row',
							marginTop: 10,
							marginBottom: 15,
						}}>
            <Col lg={6} md={7} sm={8} xs={24}>
              <Form.Item
                label="DNI"
              >
                <Input
                  name="NUM_DOCUMENTO"
                  value={dataFound.NUM_DOCUMENTO}
                  disabled
                  placeholder="DNI"
                  type='text'
                  style={{ width: '100% ' }}
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={7} sm={8} xs={24}>
              <Form.Item
                label='Apellido paterno'
              >
                <Input
                  value={dataFound.APE_PATERNO}
                  name="APE_PATERNO"
                  type="text"
                  placeholder="Apellido paterno del paciente"
                  disabled
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={7} sm={8} xs={24}>
              <Form.Item
                label='Apellido materno'
              >
                <Input
                  value={dataFound.APE_MATERNO}
                  name="APE_MATERNO"
                  type="text"
                  disabled
                  placeholder="Apellido materno del paciente"
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={7} sm={8} xs={24}>
              <Form.Item
                label='Nombres'
              >
                <Input
                  value={dataFound.NOMBRE}
                  type="text"
                  name='NOMBRE'
                  disabled
                  placeholder="Nombres del paciente"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Divider />
        <span>Datos de Pre triaje</span>
        <Form {...formItemLayout} style={{ width: '100%', marginTop: 20, marginBottom: 40 }}>
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
        <Divider />
        <span>Fecha y Hora del Pre triaje</span>
        <Form style={{ marginTop: 20, width: '95%', margin: '20px auto' }}>
          <Row
            style={{
							flexDirection: 'row',
							marginTop: 10,
							marginBottom: 15,
              gap: 20,
              alignItems: 'center'
						}}>
              <Col lg={5} md={5} sm={24} xs={24}>
                <Form.Item>
                  <div style={{ margin: 0, padding: 0, width: '100%', marginTop: 10 }}>
                    <div style={{ fontSize: '22px' }}>
                      {dateTime.hours}:{dateTime.minutes}:{dateTime.seconds} {dateTime.indicador}
                    </div>
                    <div>{dateTime.date.locale('es').format('dddd, DD [de] MMMM [de] YYYY')}</div>
                  </div>
                </Form.Item>
              </Col>
              <Col lg={2} md={2} sm={2} xs={24}>
                ó
              </Col>
              <Col lg={6} md={7} sm={8} xs={24}>
                <Form.Item
                  label=""
                >
                  <DatePicker
                    onChange={handleChangeDateCurrent}
                    value={dateCurrent}
                    style={{ width: '100%' }}
                    disabled={disableEditDate}
                    placeholder='Fecha de la toma' />
                </Form.Item>
              </Col>
              <Col lg={6} md={7} sm={8} xs={24}>
                <Form.Item
                  label=""
                >
                  <TimePicker
                    value={timeCurrent}
                    onChange={handleChangeTimeCurrent}
                    style={{ width: '100%' }}
                    disabled={disableEditDate}
                    placeholder='Hora de la toma' />
                </Form.Item>
              </Col>
              <Col lg={2} md={2} sm={2} xs={24}>
                <Form.Item
                  label=""
                >
                  <Button
                    style={{
                      backgroundColor: '#04B0AD',
                      color: 'white',
                      top: '7px'
                    }}
                    onClick={() => handleChangeEditDate()}
                  >
                    {disableEditDate ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
        </Form>
    </Card>
  )
}

export default TomaPreTriaje;