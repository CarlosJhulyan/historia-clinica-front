import React, {
  useEffect,
  useState
} from 'react';
import { 
  Card,
  Button,
  Table,
  Modal,
  Image,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Select,
  AutoComplete,
  Popconfirm,
} from 'antd';
import moment from 'moment';

import { openNotification } from '../../util/util';
import { httpClient } from '../../util/Api';
import FormatoNuevo from '../../assets/images/formato_nuevo.jpg';
import FormatoViejo from '../../assets/images/formato_viejo.jpg';
import axios from 'axios';

function AdmisionConsulta() {
  const { Option } = Select;
  const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());
  const [peticion, setPeticion] = useState(false);
  const [abrirModalManual, setAbrirModalManual] = useState(false);
  const [abrirModalOrden, setAbrirModalOrden] = useState(false);
  const [abrirModalPedido, setAbrirModalPedido] = useState(false);
  const [abrirModalConsulta, setAbrirModalConsulta] = useState(false);

  const [dataCabecera, setDataCabecera] = useState([{}]);
  const [dataDetalles, setDataDetalles] = useState([{}]);
  const [dataComprobantesPago, setDataComprobantesPago] = useState([]);
  const [dataEspecialidades, setDataEspecialidades] = useState([]);
  const [dataConsultorios, setDataConsultorios] = useState(['1']);
  const [valueCOD, setValueCOD] = useState('');
  const [optionsCOD, setOptionsCOD] = useState([]);
  const [pedidoFound, setPedidoFound] = useState(false);
  const [consultaConfirmada, setConsultaConfirmada] = useState(false);
  const [opcionBusqueda, setOpcionBusqueda] = useState(1);

  const [loadingData, setLoadingData] = useState(false);
  const [loadingDataConsultorio, setLoadingDataConsultorio] = useState(false);
  const [loadingConfirmar, setLoadingConfirmar] = useState(false);

  const [dataSend, setDataSend] = useState({
    NUM_PEDIDO: '',
    NUM_ORDEN: '',
    TIPO_COMP_PAGO: '01',
    NUM_COMP: '',
    SERIE_COMP: '',
    NUM_COMPROBANTE: '',
    FECHA: '',
    FECHA_FORMAT: null,
    MONTO: '',
    COD_ESPECIALIDAD: '1',
    COD_CONSULTORIO: '1',
    COD_MEDICO: '',
    NOM_MEDICO: '',
    USU_CREA: JSON.parse(localStorage.getItem('token')).usuario
  });

  const handleChangeText = e => {
    setDataSend({
      ...dataSend,
      [e.target.name]: e.target.value
    });
  }

  const handleChangeTipoComp = e => {
    setDataSend({
      ...dataSend,
      TIPO_COMP_PAGO: e
    });
  }

  const handleChangeEspecialidad = e => {
    traerConsultorios(e);
    setDataSend({
      ...dataSend,
      COD_ESPECIALIDAD: e,
      COD_CONSULTORIO: ''
    });
  }

  const handleChangeConsultorio = e => {
    setDataSend({
      ...dataSend,
      COD_CONSULTORIO: e
    });
  }

  const handleChangeCalendar = (e = moment()) => {
    setDataSend({
      ...dataSend,
      FECHA_FORMAT: e,
      FECHA: e ? moment(e._d).format('DD/MM/yyyy') : ''
    });
  }

  const cabeceraColumn = [
    {
      title: 'Pedido',
      dataIndex: 'key'
    },
    {
      title: 'Fecha',
      dataIndex: 'FECHA'
    },
    {
      title: 'Total S/',
      dataIndex: 'MONTO'
    },
    {
      title: 'Documento',
      dataIndex: 'NUM_DOCUMENTO'
    },
    {
      title: 'Paciente',
      dataIndex: 'PACIENTE'
    },
    {
      title: 'Cajero',
      dataIndex: 'CAJERO'
    },
    {
      title: 'Fecha Recepción',
      dataIndex: 'FEC_PENDIENTE',
      key: 'FEC_PENDIENTE',
      render: (fecha) => (
        <span>{fecha?.trim().length === 0 ? '-' : fecha}</span>
      )
    },
    {
      title: 'Fecha Env. Consu.',
      dataIndex: 'FEC_ENVIO_CONSULTA',
      key: 'FEC_ENVIO_CONSULTA',
      render: (fecha) => (
        <span>{fecha?.trim().length === 0 ? '-' : fecha}</span>
      )
    },
    {
      title: 'Fecha Ini. Consu.',
      dataIndex: 'FEC_INI_CONSULTA',
      key: 'FEC_INI_CONSULTA',
      render: (fecha) => (
        <span>{fecha?.trim().length === 0 ? '-' : fecha}</span>
      )
    },
    {
      title: 'Fecha Fin. Consu.',
      dataIndex: 'FEC_FIN_CONSULTA',
      key: 'FEC_FIN_CONSULTA',
      render: (fecha) => (
        <span>{fecha?.trim().length === 0 ? '-' : fecha}</span>
      )
    },
  ];

  const detallesColumn = [
    {
      title: 'Código',
      dataIndex: 'key'
    },
    {
      title: 'Descripción',
      dataIndex: 'DESCRIPCION'
    },
    {
      title: 'Unidad',
      dataIndex: 'UNIDAD'
    },
    {
      title: 'Pre. Vta.',
      dataIndex: 'PRE_VTA'
    },
    {
      title: 'Cantidad',
      dataIndex: 'CANTIDAD'
    },
    {
      title: 'Total',
      dataIndex: 'TOTAL'
    },
    {
      title: 'Especialidad',
      dataIndex: 'ESPECIALIDAD'
    },
  ];

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
    },
  };

  const onSelectCOD = data => {
		optionsCOD.forEach(element => {
			if (element.key === data) {
				setDataSend({
          ...dataSend,
					COD_MEDICO: element.cod_medico,
					NOM_MEDICO: `${element.des_nom_medico + ' ' + element.des_ape_medico}`,
				});
				setValueCOD(data);
			}
		});
	};

  const onChangeCOD = data => {
    setValueCOD(data);
		if (data.length <= 3) {
			setOptionsCOD([]);
		}
	};

  const onSearchCOD = async () => {
		var nom = valueCOD;
		if (nom ? nom.length >= 4 : false) {
			setPeticion(true);
			setOptionsCOD();
			const respuesta = await httpClient.post(
				'modulos/getDataMedicos',
				{
					des_nom_medico: nom,
				},
				{ cancelToken: cancelSource.token }
			);
			var array1 = respuesta.data.data;
			for (let i = 0; i < array1.length; i++) {
				if (array1[i].asignado === '0') {
					delete array1[i];
				} else {
					array1[i].key = array1[i].cod_medico;
					array1[i].value = array1[i].cod_medico;
					array1[i].label = (
						<div>
							{array1[i].cod_medico}
							<div style={{ color: '#a3a3a3' }}>{array1[i].des_ape_medico}</div>
						</div>
					);
				}
			}
			setOptionsCOD(array1);
		} else {
			if (peticion) {
				cancelSource.cancel('COD Cancelado');
				setCancelSource(axios.CancelToken.source());
			}
		}
	};

  const traerPedido = async (numPedido) => {
    setLoadingData(true);
    setConsultaConfirmada(false);
    setOpcionBusqueda(1);
    try {
      const responseCabecera = await httpClient.post('pedido/getPedidoCabecera', { NUM_PEDIDO: numPedido || dataSend.NUM_PEDIDO });
      const responseDetalles = await httpClient.post('pedido/getPedidoDetalles', { NUM_PEDIDO: numPedido || dataSend.NUM_PEDIDO });
      if (!responseCabecera.data.success || !responseDetalles.data.success) {
        openNotification('Pedido', responseCabecera.data.message, 'Warning');
        setDataCabecera([{}]);
        setDataDetalles([{}]);
        setPedidoFound(false);
      } else {
        setDataCabecera(responseCabecera.data.data);
        setDataDetalles(responseDetalles.data.data);
        setAbrirModalPedido(false);
        setPedidoFound(true);
      }
    } catch (error) {
      openNotification('Pedido', 'Error en la petición', 'Alerta');
      setPedidoFound(false);
    }
    setLoadingData(false);
  }

  const traerOrden = async () => {
    setLoadingData(true);
    setConsultaConfirmada(false);
    const { NUM_ORDEN } = dataSend;
    setOpcionBusqueda(2);
    try {
      const responseCabecera = await httpClient.post('orden/getOrdenCabecera', { NUM_ORDEN });
      const responseDetalles = await httpClient.post('orden/getOrdenDetalles', { NUM_ORDEN });
      if (!responseCabecera.data.success || !responseDetalles.data.success) {
        openNotification('Orden', responseCabecera.data.message, 'Warning');
        setDataCabecera([{}]);
        setDataDetalles([{}]);
        setPedidoFound(false);
      } else {
        setDataCabecera(responseCabecera.data.data);
        setDataDetalles(responseDetalles.data.data);
        setDataSend({
          ...dataSend,
          NUM_PEDIDO: responseCabecera.data.data[0].NUM_PEDIDO
        })
        setAbrirModalOrden(false);
        setPedidoFound(true);
      }
    } catch (error) {
      openNotification('Orden', 'Error en la petición', 'Alerta');
      setPedidoFound(false);
    }
    setLoadingData(false);
  }

  const traerComprobantesPago = async () => {
    try {
      const { data: { data = [] } } = await httpClient.post('comprobante/getComprobantesPago');
      setDataComprobantesPago(data);
    } catch (error) {
      console.error(error);
    }
  }

  const traerCorrelativoMontoNeto = async () => {
    setLoadingData(true);
    const dataFormat = { 
      ...dataSend, 
      NUM_COMPROBANTE: dataSend.SERIE_COMP.toUpperCase() + dataSend.NUM_COMP
    };

    try {
      const { data: { data = [], message: messageComp, success: successComp } } = await httpClient.post('comprobante/getCorrelativoMontoNeto', dataFormat);
      
      if (successComp) {
        setDataSend({
          ...dataSend,
          MONTO: data.MONTO.trim(),
          FECHA: data.FECHA,
          FECHA_FORMAT: moment(data.FECHA, 'DD/MM/yyyy'),
          NUM_PEDIDO: data.NUM_PED_VTA
        });

        const { data: { message: messageValidacion, success: successValidacion } } = await httpClient.post('pedido/verificacionPedido', {
          NUM_PEDIDO: data.NUM_PED_VTA,
          MONTO: data.MONTO.trim(),
        });

        if (successValidacion) {
          await traerPedido(data.NUM_PED_VTA);
          openNotification('Pedido', messageValidacion);
        } else {
          openNotification('Pedido', messageValidacion, 'Warning');
        }
      } else {
        openNotification('Comprobante', messageComp, 'Warning');
      }
    } catch (error) {
      console.error(error);
    }
    setLoadingData(false);
  }
  
  const traerConsultorios = async (id = '1') => {
    setLoadingDataConsultorio(true);
    try {
      const { data: { data = [], success } } = await httpClient.post('consultaMedica/getConsultorios', { COD_ESPECIALIDAD: id });
      if (success) {
        setDataConsultorios(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoadingDataConsultorio(false);
  }

  const traerEspecialidades = async () => {
    try {
      const { data: { data = [], success } } = await httpClient.post('consultaMedica/getEspecialidades');
      if (success) {
        setDataEspecialidades(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const confirmarRecepcion = async () => {
    setLoadingConfirmar(true);
    try {
      const { data: { success, message } } = await httpClient.post('consultaMedica/setConfirmarRecepcion', dataSend);
      if (success) {
        if (opcionBusqueda === 1) await traerPedido();
        else await traerOrden();
        setConsultaConfirmada(true);
        openNotification('Confirmar recepción', message);
      } else {
        openNotification('Confirmar recepción', message, 'Warning');
        setConsultaConfirmada(false);
      }
    } catch (error) {
      openNotification('Confirmar recepción', 'No se pudo realizar la acción', 'Alerta');
      setConsultaConfirmada(false);
    }
    setLoadingConfirmar(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      await traerComprobantesPago();
      await traerEspecialidades();
      await traerConsultorios();
    }
    fetchData();
  }, [])

  return (
    <div>
      <Card
        title={
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '250px auto',
              gridTemplateRows: '1fr',
              gridColumnGap: '0px',
              gridRowGap: '0px'
            }}
          >
            <div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px', paddingTop: '20px' }}>Admisión Consulta</div>
            <div
              style={{
                gridArea: '1 / 2 / 2 / 3',
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '15px',
                justifyContent: 'flex-end',
                flexWrap: 'wrap'
              }}
            >
              <Button
                onClick={() => setAbrirModalPedido(true)}
                type='primary'>
                  Buscar pedido
              </Button>
              <Button
                onClick={() => setAbrirModalOrden(true)}
                type='primary'>
                  Buscar orden
              </Button>
              <Button
                onClick={() => setAbrirModalManual(true)}
                type='default'>
                  Buscar comprobante manual.
              </Button>
              {
                pedidoFound &&
                (
                  consultaConfirmada ?
                  <Button
                    onClick={() => setAbrirModalConsulta(true)}
                    type='default'>
                      Consulta médica
                  </Button> :
                  <Popconfirm
                  placement="bottomRight"
                  title='¿Está seguro de confirmar recepción?'
                  onConfirm={() => confirmarRecepcion()}
                  okText="De acuerdo"
                  cancelText="No"
                  >
                    <Button type='primary' loading={loadingConfirmar}>
                        Confirmar recepción
                    </Button>
                  </Popconfirm>
                )
              }
            </div>
          </div>
        }
      >
        
      </Card>
      <Table
        style={{ marginBottom: 30 }}
        title={() => <span>Cabecera Pedido</span>} 
        size='small'
        dataSource={dataCabecera}
        pagination={false}
        columns={cabeceraColumn} />
      <Table
        pagination={false}
        dataSource={dataDetalles}
        title={() => <span>Detalles Pedido</span>} 
        size='small' 
        columns={detallesColumn} />

      <Modal
        title='Consulta de Correlativo Comprobante'
        closable={false}
        okText='Aceptar'
        cancelText='Salir'
        centered
        onCancel={() => setAbrirModalManual(false)}
        onOk={() => traerCorrelativoMontoNeto()}
        okButtonProps={{
          loading: loadingData
        }}
        cancelButtonProps={{
          disabled: loadingData
        }}
        visible={abrirModalManual}>
          <Form {...formItemLayout}>
            <Form.Item
              label="Tipo Comprobante"
            >
              <Select onChange={handleChangeTipoComp} value={dataSend.TIPO_COMP_PAGO}>
                {
                  dataComprobantesPago.map((item) => (
                    <Option key={item.key} value={item.value}>{item.descripcion}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="Nro. Comprobante"
              // rules={[
              //   {
              //     required: true,
              //     message: 'Este campo es requerido',
              //   },
              // ]}
            >
              <Input.Group>
                <Row gutter={24}>
                  <Col span={7}>
                    <Input
                      onChange={handleChangeText}
                      name='SERIE_COMP'
                      value={dataSend.SERIE_COMP} />
                  </Col>
                  <Col span={17}>
                    <Input
                      onChange={handleChangeText}
                      name='NUM_COMP'
                      value={dataSend.NUM_COMP} />
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
            <Form.Item
              label="Monto"
              // rules={[
              //   {
              //     required: true,
              //     message: 'Este campo es requerido',
              //   },
              // ]}
            >
              <Input
                onChange={handleChangeText}
                value={dataSend.MONTO}
                type='number'
                name='MONTO'
                prefix="S/" />
            </Form.Item>
            <Form.Item
              label="Fecha"
              // rules={[
              //   {
              //     required: true,
              //     message: 'Este campo es requerido',
              //   },
              // ]}
            >
              <DatePicker
                onChange={handleChangeCalendar}
                name='FECHA_FORMAT'
                value={dataSend.FECHA_FORMAT}
                format='DD/MM/yyyy'
                placeholder='dd/mm/yyyy' 
                style={{ width: '100%' }} />
            </Form.Item>
          </Form>
      </Modal>

      <Modal
        footer={false}
        title='Búsqueda por Número de Orden'
        closable={false}
        okText='Aceptar'
        cancelText='Salir'
        centered
        onCancel={() => setAbrirModalOrden(false)}
        visible={abrirModalOrden}>
        <Row>
              <Col span={12}>
                <Form.Item label='Número Orden'>
                  <Input
                    name='NUM_ORDEN'
                    onChange={handleChangeText}
                    value={dataSend.NUM_ORDEN} />
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={loadingData} 
                    onClick={() => traerOrden()}>
                      Buscar Orden
                  </Button>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Image preview={false} src={FormatoNuevo} />
              </Col>
            </Row>
      </Modal>

      <Modal
        footer={false}
        title='Búsqueda por Número de Pedido'
        closable={false}
        okText='Aceptar'
        cancelText='Salir'
        centered
        onCancel={() => setAbrirModalPedido(false)}
        visible={abrirModalPedido}>
        <Row>
          <Col span={12}>
            <Form.Item label='Número Pedido'>
              <Input 
                name='NUM_PEDIDO'
                onChange={handleChangeText}
                value={dataSend.NUM_PEDIDO} />
            </Form.Item>
            <Form.Item>
              <Button 
                loading={loadingData} 
                onClick={() => traerPedido()}>
                  Buscar Pedido
              </Button>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Image preview={false} src={FormatoViejo} />
          </Col>
        </Row>
      </Modal>

      <Modal
        title='Datos Consulta Médica'
        closable={false}
        okText='Aceptar'
        cancelText='Salir'
        centered
        onCancel={() => setAbrirModalConsulta(false)}
        width={600}
        visible={abrirModalConsulta}>
          <Form {...formItemLayout}>
            <Form.Item
              name="numComprobante"
              label="Médico"
              // rules={[
              //   {
              //     required: true,
              //     message: 'Este campo es requerido',
              //   },
              // ]}
            >
              <Input.Group>
                <Row gutter={24}>
                  <Col span={8}>
                  <AutoComplete
                    value={valueCOD}
                    options={optionsCOD}
                    onSearch={onSearchCOD}
                    onSelect={onSelectCOD}
                    onChange={onChangeCOD}
                    style={{ width: '100%' }}
                  />
                  </Col>
                  <Col span={16}>
                    <Input 
                      name='NOM_MEDICO'
                      disabled
                      value={dataSend.NOM_MEDICO} />
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
            <Form.Item
              label="Especialidad"
            >
              <Select onChange={handleChangeEspecialidad} value={dataSend.COD_ESPECIALIDAD}>
                {
                  dataEspecialidades.map((item) => (
                    <Option key={item.key} value={item.value}>{item.descripcion}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="Consultorio"
            >
              <Select disabled={loadingDataConsultorio} loading={loadingDataConsultorio} onChange={handleChangeConsultorio} value={dataSend.COD_CONSULTORIO}>
              {
                  dataConsultorios.map((item) => (
                    <Option key={item.key} value={item.value}>{item.descripcion}</Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Form>
      </Modal>
    </div>
  )
}

export default AdmisionConsulta;