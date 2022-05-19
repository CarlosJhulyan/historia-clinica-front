import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col, Table, Input, Space, Divider, Modal } from 'antd';
import { httpClient } from '../../../util/Api';
import { notificaciones } from '../../../util/util';
import { ToastContainer } from 'react-toastify';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ModalAgregar from './modalAgregar';

const ConfiguracionCamas = () => {

  const [pisos, setPisos] = useState();
  const [habitaciones, setHabitaciones] = useState();
  const [camas, setCamas] = useState();
  const [abrirModal, setAbrirModal] = useState(false);
  const [editar, setEditar] = useState(null);
  const [tipo, setTipo] = useState(null);

  const token = JSON.parse(localStorage.getItem('token'));

  //* Obtener datos
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
      data.key = data.cama_id;
      data.nombre_completo = data.paciente ? data.nom_cli + ' ' + data.ape_pat_cli + ' ' + data.ape_mat_cli : null;
    })
    setCamas(respuesta.data.data);
  };

  //* Eliminar datos
  const eliminarPiso = async (body) => {
    const repuesta = await httpClient.post('camas/deletePiso', body);
    return repuesta.data;
  };

  const eliminarHabitacion = async (body) => {
    const repuesta = await httpClient.post('camas/deleteHabitacion', body);
    return repuesta.data;
  };

  const eliminarCama = async (body) => {
    const repuesta = await httpClient.post('camas/deleteCama', body);
    return repuesta.data;
  };

  //* Mantenimiento
  const mantenimientoCama = async (body) => {
    const repuesta = await httpClient.post('camas/changeEstado', body);
    return repuesta.data;
  };

  const confirm = (record, tipo) => {
    Modal.confirm({
      title: '¿Desea eliminar este registro?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Si, Eliminar Registro',
      cancelText: 'No, Cancelar',
      onOk: async () => {
        var respuesta = {};
        if (tipo === 'piso') {
          respuesta = await eliminarPiso({
            pisoId: record.piso_id,
            codMedico: token.cod_medico,
          });
        } else if (tipo === 'habitacion') {
          respuesta = await eliminarHabitacion({
            habitacionId: record.habitacion_id,
            codMedico: token.cod_medico,
          });
        } else if (tipo === 'cama') {
          respuesta = await eliminarCama({
            camaId: record.cama_id,
            codMedico: token.cod_medico,
          });
        }
        if (respuesta.success) {
          await traerPisos();
          await traerHabitaciones();
          await traerCamas();
          notificaciones('Completado!');
        } else {
          notificaciones(respuesta.message, 'Alerta');
        }
      },
      onCancel: () => {
        return false;
      }
    });
  }

  const mantenimiento = (record) => {
    Modal.confirm({
      title: record.estado === '2' ? '¿Desea liberar la cama?' : '¿Desea poner la cama en mantenimiento?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Si, Cambiar Registro',
      cancelText: 'No, Cancelar',
      onOk: async () => {
        const respuesta = await mantenimientoCama({
          camaId: record.cama_id,
          estado: record.estado === '0' ? '2' : '0',
          codMedico: token.cod_medico,
        });
        if (respuesta.success) {
          await traerPisos();
          await traerHabitaciones();
          await traerCamas();
        } else {
          notificaciones(respuesta.message, 'Alerta');
        }
      },
      onCancel: () => {
        return false;
      }
    });
  }

  useEffect(() => {
    traerPisos();
    traerHabitaciones();
    traerCamas();
  }, []);

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
  };

  const handleReset = clearFilters => {
    clearFilters();
  };

  const columnsPisos = [
    {
      title: 'Piso',
      dataIndex: 'nombre_piso',
      key: 'nombre_piso',
      ...getColumnSearchProps('nombre_piso'),
    },
    {
      title: 'Acciones',
      dataIndex: 'a',
      width: 80,
      render: (text, record) => (
        <span>
          <span className="gx-link">
            <i
              className="icon icon-edit"
              style={{ fontSize: 16, color: 'orange' }}
              onClick={() => {
                setTipo('piso');
                setEditar(record);
                setAbrirModal(true);
              }}
            />
          </span>
          <Divider type="vertical" />
          <span className="gx-link">
            <i
              className="icon icon-trash"
              style={{ fontSize: 17, color: "red" }}
              onClick={() => {
                confirm(record, "piso");
              }}
            />
          </span>
        </span >
      ),
    }
  ];

  const columnsHabitaciones = [
    {
      title: 'Habitación',
      dataIndex: 'nombre_habitacion',
      key: 'nombre_habitacion',
      ...getColumnSearchProps('nombre_habitacion'),
    },
    {
      title: 'Piso',
      dataIndex: 'nombre_piso',
      key: 'nombre_piso',
      ...getColumnSearchProps('nombre_piso'),
    },
    {
      title: 'Acciones',
      dataIndex: 'a',
      width: 80,
      render: (text, record) => (
        <span>
          <span className="gx-link">
            <i
              className="icon icon-edit"
              style={{ fontSize: 16, color: 'orange' }}
              onClick={() => {
                setTipo('habitacion');
                setEditar(record);
                setAbrirModal(true);
              }}
            />
          </span>
          <Divider type="vertical" />
          <span className="gx-link">
            <i
              className="icon icon-trash"
              style={{ fontSize: 17, color: "red" }}
              onClick={() => {
                confirm(record, "habitacion");
              }}
            />
          </span>
        </span >
      ),
    }
  ];

  const columnsCamas = [
    {
      title: 'Cama',
      dataIndex: 'numero',
      key: 'numero',
      ...getColumnSearchProps('numero'),
    },
    {
      title: 'Habitación',
      dataIndex: 'nombre_habitacion',
      key: 'nombre_habitacion',
      ...getColumnSearchProps('nombre_habitacion'),
    },
    {
      title: 'Piso',
      dataIndex: 'nombre_piso',
      key: 'nombre_piso',
      ...getColumnSearchProps('nombre_piso'),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      ...getColumnSearchProps('tipo'),
    },
    {
      title: 'Paciente',
      dataIndex: 'nombre_completo',
      key: 'nombre_completo',
      ...getColumnSearchProps('nombre_completo'),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 130,
      align: 'center',
      render: record => {
        return record === '0' ? 'Libre' : record === '1' ? 'Ocupado' : 'Mantenimiento';
      },
    },
    {
      title: 'Acciones',
      dataIndex: 'a',
      width: 120,
      render: (text, record) => (
        <span>
          <span className="gx-link">
            <i
              className="icon icon-edit"
              style={{ fontSize: 16, color: 'orange' }}
              onClick={() => {
                setTipo('cama');
                setEditar(record);
                setAbrirModal(true);
              }}
            />
          </span>
          <Divider type="vertical" />
          <span className="gx-link">
            <i
              className="icon icon-trash"
              style={{ fontSize: 17, color: "red" }}
              onClick={() => {
                confirm(record, "cama");
              }}
            />
          </span>
          <Divider type="vertical" />
          {record.estado === '1' ?
            <span>
              <i
                className="icon icon-setting"
                style={{ fontSize: 17, color: 'gray' }}
              />
            </span>
            :
            <span className="gx-link">
              <i
                className="icon icon-setting"
                style={{ fontSize: 17 }}
                onClick={() => {
                  mantenimiento(record);
                }}
              />
            </span>
          }
        </span >
      ),
    }
  ];

  return (
    <>
      <Row>
        <Col sm={12} xs={24}>
          <Card
            title={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <div style={{ fontSize: '22px' }}>
                  Pisos
                </div>
                <Button
                  onClick={() => {
                    setTipo('piso');
                    setEditar(null);
                    setAbrirModal(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0px'
                  }}
                  type="primary"
                >
                  Agregar Piso
                </Button>
              </div>
            }
          >
            <Table
              className="gx-table-responsive"
              columns={columnsPisos}
              dataSource={pisos}
              loading={pisos === undefined}
            />
          </Card>
        </Col>
        <Col sm={12} xs={24}>
          <Card
            title={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <div style={{ fontSize: '22px' }}>
                  Habitaciones
                </div>
                <Button
                  onClick={() => {
                    setTipo('habitacion');
                    setEditar(null);
                    setAbrirModal(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0px'
                  }}
                  type="primary"
                >
                  Agregar Habitación
                </Button>
              </div>
            }
          >
            <Table
              className="gx-table-responsive"
              columns={columnsHabitaciones}
              dataSource={habitaciones}
              loading={habitaciones === undefined}
            />
          </Card>
        </Col>
        <Col sm={24} xs={24}>
          <Card
            title={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <div style={{ fontSize: '22px' }}>
                  Camas
                </div>
                <Button
                  onClick={() => {
                    setTipo('cama');
                    setEditar(null);
                    setAbrirModal(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0px'
                  }}
                  type="primary"
                >
                  Agregar Cama
                </Button>
              </div>
            }
          >
            <Table
              className="gx-table-responsive"
              columns={columnsCamas}
              dataSource={camas}
              loading={camas === undefined}
            />
          </Card>
        </Col>
      </Row>
      {abrirModal ? (
        <ModalAgregar
          abrirModal={abrirModal}
          setAbrirModal={setAbrirModal}
          editar={editar}
          tipo={tipo}
          traerPisos={traerPisos}
          traerHabitaciones={traerHabitaciones}
          traerCamas={traerCamas}
          habitaciones={habitaciones}
          pisos={pisos}
        />
      ) : null}
      <ToastContainer pauseOnHover={false} />
    </>
  );
};

export default ConfiguracionCamas;
