import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  createRef
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
  Alert,
  Row,
  Col,
  Select
} from 'antd';
import {
  SearchOutlined
} from '@ant-design/icons'

import { httpClient } from '../../util/Api';
import ModalDetalles from '../registroPaciente/modalDetalles';
import moment from 'moment';
import { useSelector } from 'react-redux';

function ModalTicketAtencion({
  setAbrirModal,
  abrirModal,
  traerDatosTable,
  traerData,
}) {
  const formRef = createRef();
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
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);

  const [dataAsignar, setDataAsignar] = useState({
    camaId: '',
    genero: '',
    habitacionId: '',
    pisoId: ''
  });

  const [arrayCama, setArrayCama] = useState([]);
  const [pisos, setPisos] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [camas, setCamas] = useState([]);
  const [array, setArray] = useState([]);

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
        const { data: { success, message } } = await httpClient.post(`/triaje/getExisteTriaje`, {
          COD_PACIENTE: data[0].COD_PACIENTE
        });
        if (success) {
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
            COD_GRUPO_CIA: response.data.data.COD_GRUPO_CIA
          });
          setMessage({
            text: `${data[0].APE_PATERNO.toUpperCase()} ${data[0].APE_MATERNO.toUpperCase()}, ${data[0].NOMBRE.toUpperCase()}`,
            type: 'success',
            visible: true
          });
        } else {
          setMessage({
            text: message,
            type: 'warning',
            visible: true
          });
        }

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
      const { data: { success: successAtencion, data: numAtencionMedica } } = await httpClient.post('atencionMedica/setConsultaMedica', {
        USU_CREA: JSON.parse(localStorage.getItem('token')).usuario,
        COD_ESPECIALIDAD: JSON.parse(localStorage.getItem('token')).id_consultorio,
        COD_BUS: JSON.parse(localStorage.getItem('token')).id_bus,
        COD_PACIENTE: datosEnviar.COD_PACIENTE,
        COD_MEDICO: JSON.parse(localStorage.getItem('token')).cod_medico,
        ESTADO: 'C'
      });

      const dataFetch = {
        ...datosEnviar,
        ASIGNADO: areaDesignada,
        NUM_ATEN_MED: numAtencionMedica
      }

      // Grabar hospitalizacion
      var hospi = "0";
      var urge = "0";

      if (areaDesignada === '1') {
        hospi = '1';
      } else {
        urge = '1';
      }

      const dd = {
        historiaClinica: numAtencionMedica,
        codPaciente: datosEnviar.COD_PACIENTE,
      };

      if (successAtencion) {
        const respuesta = await httpClient.post('/pacientes/getHospitalizacion', dd);
        if (respuesta.data.data) {
          const nuevo = {
            codGrupoCia: datosEnviar.COD_GRUPO_CIA,
            codPaciente: datosEnviar.COD_PACIENTE,
            historiaClinica: datosEnviar.NUM_HC,
            hospitalizacion: hospi,
            urgencia: urge,
            numAtenMed: numAtencionMedica
          };
          await httpClient.post('/pacientes/setHospitalizacion', nuevo);
        } else {
          const editar = {
            id: respuesta.data.data.id,
            hospitalizacion: hospi,
            urgencia: urge
          };
          await httpClient.post('/pacientes/updateHospitalizacion', editar);
        }
      }

      if (successAtencion) {
        const { data: { message, success } } = await httpClient.post(`triaje/upsertTriaje`, dataFetch);
        if (success) {
          const repuesta = await httpClient.post('camas/asignacionCama', {
            camaId: dataAsignar.camaId,
            codPaciente: datosEnviar.COD_PACIENTE,
            especialidad: JSON.parse(localStorage.getItem('token')).des_especialidad,
            dias: dataAsignar.dias,
            genero: dataAsignar.genero,
            codMedico: JSON.parse(localStorage.getItem('token')).cod_medico,
            idHospitalizacion: numAtencionMedica
          });

          if (repuesta.data.success) {
            openNotification('success', 'Triaje', message);
            setAbrirModal(false);
            traerDatosTable();
          } else {
            console.log('No se pudo completar')
          }
        } else {
          openNotification('warning', 'Triaje', message);
        }
      }
    } catch (error) {
      console.log(error);
    }

    setLoadingFetch(false);
  }

  const traerPisos = async () => {
    const respuesta = await httpClient.get('camas/getPisos');
    respuesta.data.data.forEach((data) => {
      data.key = data.piso_id;
    })
    setPisos(respuesta.data.data);
  };

  const traerHabitaciones = async () => {
    const respuesta = await httpClient.get('camas/getHabitaciones');
    respuesta.data.data.forEach((data) => {
      data.key = data.habitacion_id;
    })
    setHabitaciones(respuesta.data.data);
  };

  const traerCamas = async () => {
    const respuesta = await httpClient.get('camas/getCamas');
    respuesta.data.data.forEach((data) => {
      data.key = data.habitacion_id;
    })
    setCamas(respuesta.data.data);
  };

  const onChangeGenero = (e) => {
    formRef.current.setFieldsValue({
      genero: e
    });
    setDataAsignar({
      ...dataAsignar,
      genero: e
    })
  };

  const onChangePiso = (e) => {
    pisos.forEach((element) => {
      if (element.piso_id === e) {
        formRef.current.setFieldsValue({
          pisoId: element.piso_id,
          habitacionId: null
        });
        setDataAsignar({
          ...dataAsignar,
          pisoId: element.piso_id,
          habitacionId: null
        })
      }
    });
    const arr = habitaciones.filter(element => element.piso_id === e);
    setArray(arr);
  };

  const onChangeHabitación = (e) => {
    habitaciones.forEach((element) => {
      if (element.key === e) {
        formRef.current.setFieldsValue({
          habitacionId: element.habitacion_id
        });
        setDataAsignar({
          ...dataAsignar,
          habitacionId: element.habitacion_id
        })
      }
    });
    const arr = camas.filter(element => element.habitacion_id === e);
    setArrayCama(arr);
  };

  const onChangeCama = (e) => {
    camas.forEach((element) => {
      if (element.cama_id === e) {
        formRef.current.setFieldsValue({
          camaId: element.cama_id
        });
        setDataAsignar({
          ...dataAsignar,
          camaId: element.cama_id
        })
        console.log(element.cama_id);
      }
    });
  };

  useEffect(() => {
    traerPisos();
    traerHabitaciones();
    traerCamas();
  }, [])

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
                style={{
                  background: themeSettingsGlobal.COD_COLOR_1,
                  color: '#fff'
                }}
              >
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
                onChange={handleChangeAreaDesignada}
                buttonStyle="solid">
                  <Radio.Button
                    style={{
                      background: areaDesignada === '1' && themeSettingsGlobal.COD_COLOR_1,
                      border: areaDesignada === '1' && '1px solid #000'
                    }}
                    value="1">Hospitalización</Radio.Button>
                  <Radio.Button
                    style={{
                      background: areaDesignada === '2' && themeSettingsGlobal.COD_COLOR_1,
                      border: areaDesignada === '2' && '1px solid #000'
                    }}
                    value="2">Emergencia</Radio.Button>
                  <Radio.Button
                    style={{
                      background: areaDesignada === '3' && themeSettingsGlobal.COD_COLOR_1,
                      border: areaDesignada === '3' && '1px solid #000'
                    }}
                    value="3">UCI</Radio.Button>
                  <Radio.Button
                    style={{
                      background: areaDesignada === '4' && themeSettingsGlobal.COD_COLOR_1,
                      border: areaDesignada === '4' && '1px solid #000'
                    }}
                    value="4">SOP</Radio.Button>
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
    },
    {
      title: 'Asignar Cama',
      content: (
        <Form ref={formRef} layout="horizontal" style={{ padding: '0 20px 0 20px' }}>
          <Row style={{ flexDirection: 'row' }}>
            {
              datosEnviar ?
                <>
                  <Col xs={6} style={{ padding: '0 0 8px 0' }}>
                    PACIENTE:
                  </Col>
                  <Col xs={18} style={{ padding: '0 0 8px 0' }}>
                    {datosEnviar ? datosEnviar.PACIENTE : null}
                  </Col>
                  <Col xs={6} style={{ padding: '0 0 8px 0' }}>
                    EDAD:
                  </Col>
                  <Col xs={18} style={{ padding: '0 0 8px 0' }}>
                    {datosEnviar ? moment(datosEnviar.FECHA_NAC, "YYYY/MM/DD").month(0).from(moment().month(0)).substring(5) : null}
                  </Col>
                </>
                : null
            }
            {/* <Col xs={6} style={{ padding: '20px 0 10px 0', display: 'flex', alignItems: 'center' }}>
              <div>Días:</div>
            </Col>
            <Col xs={18} style={{ padding: '20px 0 10px 0' }}>
              <Form.Item name="dias" style={{ margin: 0, padding: 0 }} >
                <Input type="number" placeholder="Días" />
              </Form.Item>
            </Col> */}
            <Col xs={6} style={{ padding: '10px 0 10px 0', display: 'flex', alignItems: 'center' }}>
              <div>Género:</div>
            </Col>
            <Col xs={18} style={{ padding: '10px 0 10px 0' }}>
              <Form.Item name="genero" style={{ margin: 0, padding: 0 }}>
                <Select
                  style={{ width: '100% ', margin: '0' }}
                  showSearch
                  placeholder="Seleccione un piso"
                  optionFilterProp="children"
                  onChange={onChangeGenero}
                  onSearch={() => { }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  < Select.Option value={"M"}>Masculino</Select.Option>
                  < Select.Option value={"F"}>Femenino</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={6} style={{ padding: '10px 0 10px 0', display: 'flex', alignItems: 'center' }}>
              <div>Piso:</div>
            </Col>
            <Col xs={18} style={{ padding: '10px 0 10px 0' }}>
              <Form.Item name="pisoId" style={{ margin: 0 }}>
                <Select
                  style={{ width: '100% ', margin: '0' }}
                  showSearch
                  placeholder="Seleccione un piso"
                  optionFilterProp="children"
                  onChange={onChangePiso}
                  onSearch={() => { }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {
                    pisos.map((element) => {
                      return < Select.Option value={element.piso_id}>{element.nombre_piso}</Select.Option>;
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col xs={6} style={{ padding: '10px 0 10px 0', display: 'flex', alignItems: 'center' }}>
              <div>Habitación:</div>
            </Col>
            <Col xs={18} style={{ padding: '10px 0 10px 0' }}>
              <Form.Item name="habitacionId" style={{ margin: 0, padding: 0 }}>
                <Select
                  style={{ width: '100% ', margin: '0' }}
                  showSearch
                  placeholder="Seleccione una habitación "
                  optionFilterProp="children"
                  onChange={onChangeHabitación}
                  onSearch={() => { }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {
                    array.map((element) => {
                      return < Select.Option value={element.habitacion_id}>{element.nombre_habitacion}</Select.Option>;
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col xs={6} style={{ padding: '10px 0 20px 0', display: 'flex', alignItems: 'center' }}>
              <div>Cama:</div>
            </Col>
            <Col xs={18} style={{ padding: '10px 0 20px 0' }}>
              <Form.Item name="camaId" style={{ margin: 0 }}>
                <Select
                  style={{ width: '100% ', margin: '0' }}
                  showSearch
                  placeholder="Seleccione un piso"
                  optionFilterProp="children"
                  onChange={onChangeCama}
                  onSearch={() => { }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {
                    arrayCama.map((element) => {
                      return < Select.Option disabled={element.estado === '1'} value={element.cama_id}>{element.numero + " - " + element.tipo + (element.transferido === "1" ? " (TRANSFERIDO)" : "")}</Select.Option>;
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )
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
            <Button
              disabled={message.type !== 'success'}
              style={{
                background: themeSettingsGlobal.COD_COLOR_1,
                color: '#fff'
              }}
              onClick={() => next()}
            >
              Siguiente
            </Button>
          ),
          current === steps.length - 1 && (
            <Button
              style={{
                background: themeSettingsGlobal.COD_COLOR_1,
                color: '#fff'
              }}
              onClick={() => fetchData()}
              loading={loadingFetch}
            >
              Generar
            </Button>
          )
        ]}
        visible={abrirModal}
        onOk={async () => {

        }}
        okType='default'
        okButtonProps={{
          style: {background:themeSettingsGlobal.COD_COLOR_1, color: '#fff', border:'none'}
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
