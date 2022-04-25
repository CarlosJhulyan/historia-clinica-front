import { Button, Card, Table, Modal, Input, Space } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ModalDetalles from './modalDetalles';
import ModalAsignacion from './modalAsignacion';
import { httpClient } from '../../util/Api';
import moment from 'moment';
import { datosEnviar, funn } from '../../constants/datosEnviar';

import { useIdleTimer } from 'react-idle-timer';
import { useAuth } from '../../authentication';
import { useHistory } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { SearchOutlined } from '@ant-design/icons';


const datos = {
  codGrupoCia: '001',
  codEstado: '2',
  codMedico: '0000026144',
  consultorio: '0',
  bus: '0',
};

const ListaHospitalizar = () => {
  const [abrirModal, setAbrirModal] = useState(false);
  const [modalAsignacion, setModalAsignacion] = useState(false);
  const [filaActual, setFilaActual] = useState({});
  const [data, setData] = useState();
  // const [dataDiagnostico, setDataDiagnostico] = useState();
  const [datosModal, setDatosModal] = useState({});
  const [hospi, setHospi] = useState({});
  const [dataInicialCargada, setDataInicialCargada] = useState(false);
  const [mostrarListaPaciente, setMostrarListaPaciente] = useState(true);

  const [sesionCerrada, setSesionCerrada] = useState(false);
  const [state, setState] = useState();

  const { userSignOut } = useAuth();
  const history = useHistory();

  const datos = useMemo(() => {
    return {
      codGrupoCia: '001',
      codEstado: '2',
      codMedico: JSON.parse(localStorage.getItem('token')).cod_medico,
      consultorio: JSON.parse(localStorage.getItem('token')).id_consultorio,
      bus: JSON.parse(localStorage.getItem('token')).id_bus,
    };
  }, []);

  const traerDatos = useCallback(async () => {
    console.log('TRAER DATOS');
    try {
      var array = []
      const { data } = await httpClient.post(`/pacientes`, datos);
      for (let i = 0; i < data.data.length; i++) {
        if (data.data[i].ASIGNADO !== '1') {
          array.push(data.data[i]);
        }
      }
      setData(array);
    } catch (e) {
      console.log(e);
      setData();
    }
    setDataInicialCargada(true);
  }, []);

  const actualizarDatos = async () => {
    setData(undefined);
    await traerDatos();
  };

  const mostrarModal = (record) => {
    console.log('RECORD', record);
    setFilaActual(record);
    setAbrirModal(true);
  };

  useEffect(() => {
    if (!dataInicialCargada) {
      traerDatos();
      // fecha
      const fechaActual = moment().format('YYYY-MM-DD');
      datosEnviar.evolucionTratamiento['FECHA'] = fechaActual;

      funn.ff = setMostrarListaPaciente;
    }
    /* return () => [] */
  }, [dataInicialCargada, traerDatos]);

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = clearFilters => {
    clearFilters();
    setState({ searchText: '' });
  };

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'FECHA',
      key: 'fecha',
      ...getColumnSearchProps('FECHA'),
    },
    {
      title: 'Hora',
      dataIndex: 'HORA',
      key: 'hora',
      ...getColumnSearchProps('HORA'),

    },
    {
      title: 'Numero HC',
      dataIndex: 'NUM_ATEN_MED',
      key: 'hc',
      ...getColumnSearchProps('NUM_ATEN_MED'),

    },
    {
      title: 'Paciente',
      dataIndex: 'PACIENTE',
      key: 'paciente',
      ...getColumnSearchProps('PACIENTE'),

    },
    {
      title: 'Edad',
      dataIndex: 'EDAD',
      key: 'edad',
      ...getColumnSearchProps('EDAD'),

    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <span>
          <Button onClick={() => mostrarModal(record)}>Detalles</Button>
        </span>
      ),
    },
  ];

  const handleDatos = (data) => {
    console.log('HANDLE DATOS:', data);
    setAbrirModal(false);
    setDatosModal(data);
    setMostrarListaPaciente(false);
  };


  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 60,
    onIdle: (event) => {
      if (!sesionCerrada) {
        Modal.confirm({
          title: 'Tu sesión ha expirado',
          content: (
            <div>
              <p>
                Permaneció mucho tiempo inactivo. <br /> Por favor vuelva a Iniciar Sesión.
              </p>
            </div>
          ),
          onOk() {
            userSignOut(() => {
              history.push('/');
            });
          },
          onCancel() {
            setSesionCerrada(false);
          },
          cancelText: 'Quedarme Aqui',
          okText: 'Aceptar',
        });
        setSesionCerrada(true);
      }
    },
    onActive: (event) => { },
    onAction: (event) => { },
    debounce: 500,
  });



  return (
    <>
      <Card
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
            <div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px', paddingTop: '20px' }}>Lista de Pacientes a Hospitalizar</div>
            <div
              style={{
                gridArea: '1 / 2 / 2 / 3',
                display: 'flex',
                flexDirection: 'row-reverse',
                paddingTop: '15px',
              }}
            >
              <Button
                onClick={actualizarDatos}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Actualizar
              </Button>
            </div>
          </div>
        }
      >
        <Table className="gx-table-responsive" columns={columns} dataSource={data} loading={data === undefined} />
      </Card>

      {abrirModal ? (
        <ModalDetalles
          abrirModal={abrirModal}
          setAbrirModal={setAbrirModal}
          filaActual={filaActual}
          handleDatos={handleDatos}
          setModalAsignacion={setModalAsignacion}
          setHospi={setHospi}
        />
      ) : null}

      {modalAsignacion ? (
        <ModalAsignacion
          abrirModal={modalAsignacion}
          setAbrirModal={setModalAsignacion}
          dataModal={filaActual}
          traerData={traerDatos}
          hospitalizacion={hospi}
        />
      ) : null}

      <ToastContainer pauseOnHover={false} />
    </>
  );
};

export default ListaHospitalizar;
