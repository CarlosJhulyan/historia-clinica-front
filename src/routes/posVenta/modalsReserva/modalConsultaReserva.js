import React, {
  useEffect,
  useRef,
  useState
} from 'react';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Row,
  Table
} from 'antd';
import { httpClient } from '../../../util/Api';
import ModalListaReservas from './modalListaReservas';
import { openNotification } from '../../../util/util';

const ModalConsultaReserva = ({
                                visible,
                                setVisible,
}) => {
  const { warning } = Modal;
  const [textSearch, setTextSearch] = useState('');
  const [messageError, setMessageError] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [dataReserva, setDataReserva] = useState([{}]);
  const [datosPacienteReserva, setDatosPacienteReserva] = useState({});
  const [datosMedicoReserva, setDatosMedicoReserva] = useState({});
  const [visibleModalListaRes, setVisibleModalListaRes] = useState(false);
  const [disabledButton, setDisabledButton] = useState(true);
  const [loadingBuscarReserva, setLoadingBuscarReserva] = useState(false);

  const getDatosPacienteReserva = async (dataFetch) => {
    setMessageError('');
    if (textSearch.trim() === '') {
      openNotification('Consulta Reserva', 'Complete el campo', 'Warning');
      return;
    }

    setDisabledButton(true);
    try {
      const {
        data: { success, data, message }
      } = await httpClient.post('posventa/getDatosReservaPaciente', dataFetch);
      const {
        data: { success: successMedico, data: dataMedico }
      } = await httpClient.post('posventa/getDatosReservaMedico', dataFetch);
      const {
        data: { data: dataDetalles, success: successDetalles, message: messageDetalles }
      } = await httpClient.post('posventa/getListaDetalles', dataFetch);

      if (success) {
        const valido = await isValidoPedidoReserva(dataFetch);

        setDatosPacienteReserva(data);
        setTextSearch(data.NUM_PEDIDO_VTA);

        if (successMedico) setDatosMedicoReserva(dataMedico);
        if (successDetalles) {
          setDataReserva(dataDetalles);
        } else {
          setDataReserva([{}]);
          openNotification('Consulta Reserva', messageDetalles, 'Warning');
        }

        if (valido === 'N') {
          warning({
            title: 'Mensaje de Sistema',
            content: 'La hora pactada en la reserva fue superada',
            centered: true
          });
          setMessageError('NO SE PUEDE ATENDER POR IMPUNTUALIDAD');
          setDisabledButton(true);
        } else setDisabledButton(false);
      } else {
        setDisabledButton(true);
        setDataReserva([{}]);
        setDatosPacienteReserva({});
        setDatosMedicoReserva({});
        openNotification('Consulta Reserva', message, 'Warning');
      }
    } catch (e) {
      console.error(e);
    }
  }

  const isValidoPedidoReserva = async (dataFetch) => {
    const {
      data: { data, success }
    } = await httpClient.post('posventa/validoReservaPedido', dataFetch);
    if (success) return data;
  }

  const columns = [
    {
      title: 'Especialidad',
      dataIndex: 'ESPECIALIDAD',
      key: 'ESPECIALIDAD',
    },
    {
      title: 'Código',
      dataIndex: 'CODIGO',
      key: 'CODIGO',
    },
    {
      title: 'Descripción',
      dataIndex: 'DESCRIPCION',
      key: 'DESCRIPCION',
    },
    {
      title: 'Unidad',
      dataIndex: 'UNIDAD',
      key: 'UNIDAD',
    },
    {
      title: 'Cantidad',
      dataIndex: 'CANTIDAD',
      key: 'CANTIDAD',
    },
    {
      title: 'S/ Prec.Unit',
      dataIndex: 'PRECIO_UNI',
      key: 'PRECIO_UNI',
    },
    {
      title: 'S/ Total',
      dataIndex: 'TOTAL',
      key: 'TOTAL',
    },
  ];

  const handleSearchDatosPacienteReserva = async values => {
    const dataFetch = {
      codGrupoCia: '001',
      codLocal: '001',
      numPedido: values.padStart(10, '0')
    }

    setLoadingSearch(true);
    await getDatosPacienteReserva(dataFetch);
    setLoadingSearch(false);
  }

  useEffect(() => {

  }, []);

  return (
    <>
      <Modal
        width={1100}
        visible={visible}
        onCancel={() => !loadingSearch && setVisible(false)}
        className='modal-posventa'
        title='Consulta Reserva'
        centered
        footer={[
          <Button
            onClick={() => !loadingSearch && setVisible(false)}
          >
            Cerrar
          </Button>,
          <Button
            onClick={() => setVisibleModalListaRes(true)}
            loading={loadingBuscarReserva}
          >
            Buscar Reserva
          </Button>,
          <Button
            style={{
              backgroundColor: '#0169aa',
              color: 'white',
            }}
            disabled={disabledButton}
          >
            Aceptar
          </Button>
        ]}
      >
        <Row>
          <Col span={12}>
            <Form>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label='Nro Reserva (Código barra)'
                    style={{margin:0}}
                  >
                    <Input.Search
                      type='number'
                      onSearch={handleSearchDatosPacienteReserva}
                      onChange={e => setTextSearch(e.target.value)}
                      value={textSearch}
                      loading={loadingSearch}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Card size='small' style={{margin:0}}>
              <Row>
                <Col span={24}>
                  <Descriptions title='Paciente' size='small'>
                    <Descriptions.Item label='DNI' span={3}>{datosPacienteReserva.DOCUMENTO}</Descriptions.Item>
                    <Descriptions.Item label='Nombre' span={3}>{datosPacienteReserva.NOM_CLI} {datosPacienteReserva.APE_PAT_CLI} {datosPacienteReserva.APE_MAT_CLI}</Descriptions.Item>
                    <Descriptions.Item label='Edad' span={3}>{datosPacienteReserva.EDAD}</Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={12}>
            <Card size='small' style={{height:200,margin:0}}>
              <Descriptions title='Médico y Precedencia' size='small'>
                <Descriptions.Item label='Fecha Reserva' span={3}>
                  <span style={{color:'red'}}>{datosPacienteReserva.FEC_PEDIDO_VTA}</span>
                </Descriptions.Item>
                <Descriptions.Item label='CMP' span={3}>{datosMedicoReserva.CMP}</Descriptions.Item>
                <Descriptions.Item label='Médico' span={3}>{datosMedicoReserva.NOMBRE} {datosMedicoReserva.APELLIDO}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
        <Row style={{marginTop:10}}>
          <Col
            span={24}
            style={{
              backgroundColor:'#0169aa',
              paddingTop:10,
              paddingBottom:10,
              color:'#fff',
              fontSize:20
          }}
          >
            Consulta de Reserva
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              dataSource={dataReserva}
              columns={columns}
              size='small'
              pagination={{
                pageSize:5
              }}
            />
          </Col>
        </Row>
        <Row style={{marginTop:10}} align='middle'>
          <Col span={18}>
            <Card
              size='small'
              style={{
                height: 50,
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                color: 'red',
                fontSize: 20,
                margin: 0
              }}
            >
              {messageError}
            </Card>
          </Col>
          <Col span={6} style={{textAlign:'right',fontWeight:'bold'}}>
            Total S/ {datosPacienteReserva.VAL_NETO_PEDIDO}
          </Col>
        </Row>
      </Modal>

      <ModalListaReservas
        visible={visibleModalListaRes}
        setVisible={setVisibleModalListaRes}
        handleSearchDatosPacienteReserva={handleSearchDatosPacienteReserva}
        loading={loadingBuscarReserva}
        setLoading={setLoadingBuscarReserva}
      />
    </>
  );
}

export default ModalConsultaReserva;
