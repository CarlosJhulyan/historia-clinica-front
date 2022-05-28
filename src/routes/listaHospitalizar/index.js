import { Button, Card, Table, Input, Space } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ModalAsignacion from './modalAsignacion';
import { httpClient } from '../../util/Api';
import moment from 'moment';
import { datosEnviar, funn } from '../../constants/datosEnviar';

import { useAuth } from '../../authentication';
import { useHistory } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { SearchOutlined } from '@ant-design/icons';
import ModalTicketAtencion from './modalTicketAtencion';
import ModalDetalles from '../listaPaciente/modalDetalles';
import DatosPaciente from '../listaPaciente/datosPaciente';
import ModalDetallesTriaje from './modalDetallesTriaje';

const ListaHospitalizar = () => {
  const [abrirModal, setAbrirModal] = useState(false);
  const [modalAsignacion, setModalAsignacion] = useState(false);
  const [modalDetallesTriaje, setModalDetallesTriaje] = useState(false);
  const [filaActual, setFilaActual] = useState({});
  const [data, setData] = useState();
  const [abrirModalTicket, setAbrirModalTicket] = useState(false);
  const [datosModal, setDatosModal] = useState({});
  const [hospi, setHospi] = useState({});
  const [dataInicialCargada, setDataInicialCargada] = useState(false);
  const [mostrarListaPaciente, setMostrarListaPaciente] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

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
    setTableLoading(true);
    try {
      var array = []
      const { data } = await httpClient.post(`/triaje/getTriajeLista`, datos);
      // for (let i = 0; i < data.data.length; i++) {
      //   // if (data.data[i].asignado !== '1') {
          
      //   // }
      //   array.push(data.data[i]);
      //   data.data[i].EDAD = moment(data.data[i].FECHA_NAC, "MM/DD/YYYY").month(0).from(moment().month(0));
      // }

      setData(data.data);
    } catch (e) {
      setData([]);
    }
    setTableLoading(false);
    setDataInicialCargada(true);
  }, [datos]);

  const actualizarDatos = async () => {
    setData(undefined);
    await traerDatos();
  };

  const mostrarModal = async (record) => {
    setFilaActual({
      ...record,
      NUM_ATEN_MED: data
    });
    setAbrirModal(true);
  };

  const mostrarModalDetallesTriaje = (record) => {
    setFilaActual({
      ...record,
      NUM_ATEN_MED: data
    });
    setModalDetallesTriaje(true);
  }

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
      dataIndex: 'FEC_CREA',
      key: 'fecha',
      render: (fecha) => (
        <span>{moment(fecha, 'yyyy-MM-DD HH:mm:ss').format('DD/MM/yyyy')}</span>
      )
    },
    {
      title: 'Hora',
      dataIndex: 'FEC_CREA',
      key: 'hora',
      render: (hora) => (
        <span>{moment(hora, 'yyyy-MM-DD HH:mm:ss').format('HH:mm:ss')}</span>
      )

    },
    {
      title: 'Numero HC',
      dataIndex: 'NRO_HC',
      key: 'nro_hc'

    },
    {
      title: 'Paciente',
      dataIndex: 'PACIENTE',
      key: 'paciente',
      ...getColumnSearchProps('PACIENTE'),

    },
    {
      title: 'Edad',
      dataIndex: 'FEC_NAC',
      key: 'edad',
      render: (fecha) => (
        <span>{moment(fecha, "YYYY-MM-DD HH:mm:ss").month(0).from(moment().month(0)).substring(5)}</span>
      )
    },
    {
      title: 'Area Asignada',
      dataIndex: 'ASIGNADO',
      key: 'asignado',
      render: (asignado) => (
        <span>
          {asignado === '1' && 'HOSPITALIZACION'}
          {asignado === '2' && 'EMERGENCIA'}
        </span>
      )
    },
    {
			title: 'Estado',
			dataIndex: 'ESTADO',
			key: 'estado',
      render: (estado) => (
        <span>
          {estado === 'T' && 'PEND.TRIAJE'}
          {estado === 'P' && 'PEND.ATENCION'}
          {estado === 'C' && 'EN CONSULTA'}
          {estado === 'A' && 'ATENDIDO'}
          {estado === 'G' && 'GRABADO TEMPORALMENTE'}
        </span>
      ),
		},
    {
      title: 'Acciones',
      key: 'action',
      render: (record) => (
        <>
          <Button onClick={() => mostrarModal(record)}>Consulta</Button>
          <Button onClick={() => mostrarModalDetallesTriaje(record)}>Triaje</Button>
        </>
      ),
      width: 220
    },
  ];

  const handleDatos = (data) => {
    console.log('HANDLE DATOS:', data);
    setAbrirModal(false);
    setDatosModal(data);
    setMostrarListaPaciente(false);
  };

  // const { getRemainingTime, getLastActiveTime } = useIdleTimer({
  //   timeout: 1000 * 60 * 60,
  //   onIdle: (event) => {
  //     if (!sesionCerrada) {
  //       Modal.confirm({
  //         title: 'Tu sesión ha expirado',
  //         content: (
  //           <div>
  //             <p>
  //               Permaneció mucho tiempo inactivo. <br /> Por favor vuelva a Iniciar Sesión.
  //             </p>
  //           </div>
  //         ),
  //         onOk() {
  //           userSignOut(() => {
  //             history.push('/');
  //           });
  //         },
  //         onCancel() {
  //           setSesionCerrada(false);
  //         },
  //         cancelText: 'Quedarme Aqui',
  //         okText: 'Aceptar',
  //       });
  //       setSesionCerrada(true);
  //     }
  //   },
  //   onActive: (event) => { },
  //   onAction: (event) => { },
  //   debounce: 500,
  // });


  return (
    <>
      {mostrarListaPaciente ? 
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
              <div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px', paddingTop: '20px' }}>Admisión Hospitalaria</div>
              <div
                style={{
                  gridArea: '1 / 2 / 2 / 3',
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  paddingTop: '15px',
                  gap: '20px'
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
                <Button
                  type='primary'
                  onClick={() => setAbrirModalTicket(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Generar Ticket
                </Button>
              </div>
            </div>
          }
        >
          <Table className="gx-table-responsive" columns={columns} dataSource={data} loading={tableLoading} />
        </Card> :
        <DatosPaciente setDatosModal={setDatosModal} datosModal={datosModal} setMostrarListaPaciente={setMostrarListaPaciente} traerDatos={traerDatos} />
      }

      {abrirModal ? (
        <ModalDetalles
          abrirModal={abrirModal}
          setAbrirModal={setAbrirModal}
          filaActual={filaActual}
          handleDatos={handleDatos}
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

      {abrirModalTicket ? (
        <ModalTicketAtencion
          traerDatosTable={traerDatos}
          abrirModal={abrirModalTicket}
          setAbrirModal={setAbrirModalTicket}
          dataModal={filaActual}
          traerData={traerDatos}
          hospi={hospi}
        />
      ) : null}

      {modalDetallesTriaje ? (
        <ModalDetallesTriaje 
          setVisible={setModalDetallesTriaje}
          visible={modalDetallesTriaje}
          filaActual={filaActual}
        />
      ) : null}

      <ToastContainer pauseOnHover={false} />
    </>
  );
};

export default ListaHospitalizar;
