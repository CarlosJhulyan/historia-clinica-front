import React, { 
  useState,
  useCallback
} from 'react';
import { 
  Button,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Table,
} from 'antd';
import { httpClient } from '../../util/Api';
import { openNotification } from '../../util/util';

function ModalListaEspera({ 
  visible, 
  setVisible,
  dataConsultorios,
  dataEspecialidades,
  loadingDataConsultorio,
  traerConsultorios
}) {
  const { Option } = Select;
  const [loadingData, setLoadingData] = useState(false);
  const [dataListaEspera, setDataListaEspera] = useState([]);
  const [dataSend, setDataSend] = useState({
    // codMedico: JSON.parse(localStorage.getItem('token')).cod_medico,
    codEstado: '1',
    consultorio: '1',
    bus: ''
  });

  const handleChangeEspecialidad = e => {
    traerConsultorios(e);
    setDataSend({
      ...dataSend,
      consultorio: e,
      bus: ''
    });
  }

  const handleChangeConsultorio = e => {
    setDataSend({
      ...dataSend,
      bus: e
    });
  }
  
  const columns = [
		{
			title: 'Hora',
			dataIndex: 'HORA',
			key: 'hora'
		},
    {
      title: 'Número HC',
      dataIndex: 'COD_PACIENTE',
      key: 'hc',
    },
		{
			title: 'Paciente',
			dataIndex: 'PACIENTE',
			key: 'paciente',
		},
		{
			title: 'Edad',
			dataIndex: 'EDAD',
			key: 'edad'
		},
		{
			title: 'Estado',
			dataIndex: 'ESTADO',
			key: 'estado',
		}
  ];

  const traerListaEspera = useCallback(
    async () => {
      setLoadingData(true);
      try {
        const { data: { data = [], success, message } } = await httpClient.post('pacientes/getListaEsperaTriaje', dataSend);
        if (success) {
          setDataListaEspera(data);
        } else {
          setDataListaEspera([]);
          openNotification('Lista de Espera', message, 'Warning');
        }
      } catch (error) {
        console.error(error);
      }
      setLoadingData(false);
    },
    [dataSend]
  )

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <Modal
      width={700}
      centered
      title='Lista de Espera'
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button type='primary'>
          Anular
        </Button>,
        <Button type='primary'>
          Actualizar
        </Button>,
        <Button type='primary'>
          Atender
        </Button>
      ]}
    >
      <Form {...layout} style={{ paddingLeft: 20, paddingRight: 20 }}>
        <Row>
          <Col span={12}>
            <Form.Item
              label="Especialidad"
            >
              <Select onChange={handleChangeEspecialidad} value={dataSend.consultorio}>
                {
                  dataEspecialidades.map((item) => (
                    <Option key={item.key} value={item.value}>{item.descripcion}</Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Button
              onClick={() => traerListaEspera()}
              loading={loadingData}>
                Buscar
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="Consultorio"
            >
              <Select disabled={loadingDataConsultorio} loading={loadingDataConsultorio} onChange={handleChangeConsultorio} value={dataSend.bus}>
              {
                  dataConsultorios.map((item) => (
                    <Option key={item.key} value={item.value}>{item.descripcion}</Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="Medico"
            >
              
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              label="HC. Fisica"
            >
              
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Nro HC. Fisica"
            >
              
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        size='small'
        bordered
        loading={loadingData}
        dataSource={dataListaEspera}
        columns={columns}/>
    </Modal>
  )
}

export default ModalListaEspera;