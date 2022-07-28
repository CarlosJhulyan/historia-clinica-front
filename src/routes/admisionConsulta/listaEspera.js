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
import moment from 'moment';
import { useSelector } from 'react-redux';

function ListaEspera() {
  const { Option } = Select;
  const medico = JSON.parse(localStorage.getItem('token')).usuario;
  const personal = JSON.parse(localStorage.getItem('token')).data?.login_usu;
  const usuario = personal ? personal : medico;
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
  const [loadingData, setLoadingData] = useState(false);
  const [dataListaEspera, setDataListaEspera] = useState([]);
  const [abrirModalTriaje, setAbrirModalTriaje] = useState(false);
  const [dataSend, setDataSend] = useState({
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
  const [currentPaciente, setCurrentPaciente] = useState({});
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
      setCurrentPaciente();
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
        USU_CREA: usuario,
        NUM_ATENCION: numHCSelection[0]
      });
      if (success) {
        openNotification('Atención Médica', message);
        traerListaEspera();
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
        USU_CREA: usuario,
        NUM_ATENCION: numHCSelection[0],
        ESTADO: 'C'
      });
      if (success) {
        openNotification('Atención Médica', message);
        traerListaEspera();
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
  console.log(currentPaciente);

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
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '50%',
                fontSize: '22px',
              }}
            >
              Lista de Espera
            </div>
          </div>
        }
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
                disabled={loadingDataConsultorio}
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
              setCurrentPaciente(selectedRows[0]);
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
            style={{
              background: themeSettingsGlobal.COD_COLOR_1,
              color: '#fff'
            }}
          >
            Anular
          </Button>
          <Button
            onClick={() => traerListaEspera()}
            style={{
              background: themeSettingsGlobal.COD_COLOR_1,
              color: '#fff'
            }}
          >
            Actualizar
          </Button>
          <Button
            loading={loadingActualizar}
            disabled={!numHCSelection || numHCSelection.length <= 0}
            onClick={() => establecerAtender()}
            style={{
              background: themeSettingsGlobal.COD_COLOR_1,
              color: '#fff'
            }}
          >
            Atender
          </Button>
        </Row>
      </Card>
      {abrirModalTriaje && (
        <ModalTriaje
          usuario={usuario}
          traerListaEspera={traerListaEspera}
          numAtencionMedica={numHCSelection[0]}
          setAbrirModal={setAbrirModalTriaje}
          abrirModal={abrirModalTriaje}
          currentPaciente={currentPaciente}
        />
      )}
    </>
  )
}

export default ListaEspera;
