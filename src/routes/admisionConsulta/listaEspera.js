import React, {
  useState,
  useCallback, useEffect
} from 'react';
import {
  Button, Card,
  Col,
  Form,
  Row,
  Select,
  Table
} from 'antd';
import { httpClient } from '../../util/Api';
import { openNotification } from '../../util/util';
import ModalTriaje from './modalTriaje';

function ListaEspera() {
  const { Option } = Select;
  const [loadingData, setLoadingData] = useState(false);
  const [dataListaEspera, setDataListaEspera] = useState([]);
  const [abrirModalTriaje, setAbrirModalTriaje] = useState(false);
  const [dataSend, setDataSend] = useState({
    // codMedico: JSON.parse(localStorage.getItem('token')).cod_medico,
    codEstado: '1',
    consultorio: '',
    bus: ''
  });
  const [dataConsultorios, setDataConsultorios] = useState(['1']);
  const [dataEspecialidades, setDataEspecialidades] = useState([]);
  const [loadingDataConsultorio, setLoadingDataConsultorio] = useState(true);
  const [loadingDataEspecialidad, setLoadingDataEspecialidad] = useState(true);
  const [numHCSelection, setNumHCSelection] = useState([]);
  const [atender, setAtender] = useState('');

  const [loadingAnular, setLoadingAnular] = useState(false);
  const [loadingActualizar, setLoadingActualizar] = useState(false);

  const traerConsultorios = async (id = '1') => {
    setLoadingDataConsultorio(true);
    try {
      const { data: { data = [], success } } = await httpClient.post('atencionMedica/getConsultorios', { COD_ESPECIALIDAD: id });
      if (success) {
        setDataConsultorios(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoadingDataConsultorio(false);
  }

  const traerEspecialidades = async () => {
    setLoadingDataEspecialidad(true);
    try {
      const { data: { data = [], success } } = await httpClient.post('atencionMedica/getEspecialidades');
      if (success) {
        setDataEspecialidades(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoadingDataEspecialidad(false);
  }

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
      setDataListaEspera([]);
      setNumHCSelection([]);
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

  const anularAtencionMedica = async () => {
    setLoadingAnular(true);
    try {
      const { data: { success, message } } = await httpClient.post('atencionMedica/setAnular', {
        USU_CREA: JSON.parse(localStorage.getItem('token')).usuario,
        NUM_ATENCION: numHCSelection[0]
      });
      if (success) {
        openNotification('Atención Médica', message);
      } else {
        openNotification('Atención Médica', message, 'Warning');
      }
    } catch (error) {
      console.error(error)
    }
    setLoadingAnular(false);
  }

  const actualizarAtencionMedica = async () => {
    setLoadingActualizar(true);
    try {
      const { data: { success, message } } = await httpClient.post('atencionMedica/updateAtencion', {
        USU_CREA: JSON.parse(localStorage.getItem('token')).usuario,
        NUM_ATENCION: numHCSelection[0],
        ESTADO: 'C'
      });
      if (success) {
        openNotification('Atención Médica', message);
      } else {
        openNotification('Atención Médica', message, 'Warning');
      }
    } catch (error) {
      console.error(error)
    }
    setLoadingActualizar(false);
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const establecerAtender = () => {
    if (atender === 'PEND.TRIAJE') {
      setAbrirModalTriaje(true);
    } else if (atender === 'PEND.ATENCION') {
      actualizarAtencionMedica();
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await traerEspecialidades();
      await traerConsultorios();
    }
    fetchData();
  }, [])

  return (
    <>
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
            <div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px', paddingTop: '20px' }}>Lista de Espera</div>
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
            </div>
          </div>
        }
        footer={[
          <Button
            loading={loadingAnular}
            onClick={() => anularAtencionMedica()}
            disabled={!numHCSelection || numHCSelection.length <= 0}
            type='primary'>
            Anular
          </Button>,
          <Button
            onClick={() => traerListaEspera()}
            type='primary'>
            Actualizar
          </Button>,
          <Button
            loading={loadingActualizar}
            disabled={!numHCSelection || numHCSelection.length <= 0}
            onClick={() => establecerAtender()}
            type='primary'>
            Atender
          </Button>
        ]}
      >
        <Form
          {...layout}
          style={{ paddingLeft: 20, paddingRight: 20 }}>
          <Row>
            <Col span={12}>
              <Form.Item
                label="Especialidad"
              >
                <Select
                  disabled={loadingDataEspecialidad}
                  onChange={handleChangeEspecialidad}
                  value={dataSend.consultorio}
                >
                  <Option value=''>Seleccionar Especilidad</Option>
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
                onClick={() => traerListaEspera()}>
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
                  <Option value=''>Seleccionar Consultorio</Option>
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
          className="gx-table-responsive"
          rowSelection={{
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
              setAtender(selectedRows[0].ESTADO);
              setNumHCSelection(selectedRowKeys);
            },
            selectedRowKeys: numHCSelection
          }}
          pagination={{
            pageSize: 5
          }}
          size='small'
          bordered
          loading={loadingData}
          dataSource={dataListaEspera}
          columns={columns}/>
        <Row justify='end' style={{marginTop: 20}}>
          <Button
            loading={loadingAnular}
            onClick={() => anularAtencionMedica()}
            disabled={!numHCSelection || numHCSelection.length <= 0}
            type='primary'>
            Anular
          </Button>
          <Button
            onClick={() => traerListaEspera()}
            type='primary'>
            Actualizar
          </Button>
          <Button
            loading={loadingActualizar}
            disabled={!numHCSelection || numHCSelection.length <= 0}
            onClick={() => establecerAtender()}
            type='primary'>
            Atender
          </Button>
        </Row>
      </Card>
      <ModalTriaje
        traerListaEspera={traerListaEspera}
        numAtencionMedica={numHCSelection[0]}
        setAbrirModal={setAbrirModalTriaje}
        abrirModal={abrirModalTriaje}/>
    </>
  )
}

export default ListaEspera;
