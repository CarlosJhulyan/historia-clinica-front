import React, { useEffect, useState, createRef } from 'react';
import { Button, Card, Tabs, Row, Col, Spin, Table, Tooltip, Modal, Divider, AutoComplete, Form, Radio } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ToastContainer } from 'react-toastify';
import { httpClient } from '../../util/Api';
import { notificaciones } from '../../util/util';
import Moment from 'moment';
//Chart
import CustomActiveShapePieChart from './CustomActiveShapePieChart';
import ModalAgregar from './modalAgregar';
import ModalTransferir from './modalTransferir';
//Imagenes
import HOSPI_V from '../../assets/camas/HOSPI_V.png';
import HOSPI_F from '../../assets/camas/HOSPI_F.png';
import HOSPI_M from '../../assets/camas/HOSPI_M.png';
import UCI_V from '../../assets/camas/UCI_V.png';
import UCI_F from '../../assets/camas/UCI_F.png';
import UCI_M from '../../assets/camas/UCI_M.png';
import UCIM_V from '../../assets/camas/UCIM_V.png';
import UCIM_F from '../../assets/camas/UCIM_F.png';
import UCIM_M from '../../assets/camas/UCIM_M.png';

const { TabPane } = Tabs;

const AsignacionCamas = () => {
  const [chart, setChart] = useState([
    { name: 'Normales', value: 1 },
    { name: 'UCIM', value: 1 },
    { name: 'UCI', value: 1 },
    { name: 'Vacías', value: 1 },
  ]);
  const [piso, setPiso] = useState();
  const [habitacion, setHabitacion] = useState();
  const [response, setResponse] = useState();
  const [dataSource, setdataSource] = useState([]);
  const [abrirModal, setAbrirModal] = useState(false);
  const [editar, setEditar] = useState(null);
  const [especialidades, setEspecialidades] = useState();
  const [dataModal, setDataModal] = useState(null);

  const [motivo, setMotivo] = useState();
  const [motivos, setMotivos] = useState();
  const [modalMotivo, setModalMotivo] = useState(false);
  const [modalTransferir, setModalTransferir] = useState(false);
  const [modalTransferidoLleno, setModalTransferidoLleno] = useState(false);
  const [modalTransferidoVacio, setModalTransferidoVacio] = useState(false);

  const [record, setRecord] = useState();
  const [abrirModalTransferir, setAbrirModalTransferir] = useState(false);
  const [dataModalTransferir, setDataModalTransferir] = useState(null);

  const [valueCOD, setValueCOD] = useState('');
  const [optionsCOD, setOptionsCOD] = useState([]);

  const [loading, setLoading] = useState(false);

  const formRef = createRef();

  const onSearchCOD = async searchText => {
    var cod = formRef.current.getFieldValue('nombrePaciente');
    var array1 = [];
    if (cod ? cod.length >= 3 : false) {
      setOptionsCOD();
      response.forEach(piso => {
        piso.habitaciones.forEach(habitacion => {
          habitacion.camas.forEach(cama => {
            if (cama.paciente != null) {
              if (cama.nombre_completo.toLowerCase().includes(cod.toLowerCase())) {
                array1.push({
                  piso: piso.piso,
                  piso_index: piso.piso_index,
                  key: cama.cama_id,
                  value: cama.cama_id,
                  label: cama.nombre_completo,
                  habitaciones: [{
                    habitacion: habitacion.habitacion,
                    habitacion_index: habitacion.habitacion_index,
                    camas: [{
                      ...cama,
                      cama_index: cama.cama_id,
                      active: false,
                    }]
                  }]
                });
              }
            }
          });
        });
      });
      setOptionsCOD(array1);
    }
  };

  const onSelectCOD = data => {
    response.forEach(piso => {
      piso.habitaciones.forEach(habitacion => {
        habitacion.camas.forEach(cama => {
          if (cama.cama_id.toLowerCase().startsWith(data.toLowerCase())) {
            cama.active = true;
          } else {
            cama.active = false;
          }
        });
      });
    });
    optionsCOD.forEach(element => {
      if (element.key === data) {
        formRef.current.setFieldsValue({
          nombrePaciente: element.label
        });
        setHabitacion(element.habitaciones[0].habitacion_index);
        setPiso(element.piso_index);
        setValueCOD(element.label);
      }
    });
  };

  const onChangeCOD = data => {
    if (data.length <= 3) {
      setOptionsCOD([]);
      response.forEach(piso => {
        piso.habitaciones.forEach(habitacion => {
          habitacion.camas.forEach(cama => {
            cama.active = false;
          });
        });
      });
    }
  };

  const traerData = async (piso, habitacion) => {
    const data = await crearJson();
    if (piso === '' && habitacion === '') {
      setPiso(data[0].piso_index);
      setHabitacion(data[0].habitaciones[0].habitacion_index);
    } else {
      setPiso(piso);
      setHabitacion(habitacion);
    }
    setResponse(data);
  }

  const traerEspecialidades = async () => {
    const data = await httpClient.get('/camas/getEspecilidades');
    setEspecialidades(data.data.data);
  }

  const traerMotivos = async () => {
    const data = await httpClient.get('/camas/getMotivos');
    setMotivos(data.data.data);
  }

  const liberar = async (body) => {
    const repuesta = await httpClient.post('/camas/liberarCama', body);
    return repuesta.data;
  }

  const devolver = async (body) => {
    const repuesta = await httpClient.post('/camas/devolverCama', body);
    return repuesta.data;
  }

  const liberarCama = (record) => {
    setModalTransferir(true);
    setRecord(record.cama_id);
    setDataModalTransferir(record);
  }

  const transferidoLleno = (record) => {
    setModalTransferidoLleno(true);
    setRecord(record.cama_id);
    setDataModalTransferir(record);
  }

  const transferidoVacio = (record) => {
    setModalTransferidoVacio(true);
    setRecord(record.cama_id);
    setDataModalTransferir(record);
  }

  const columns = [
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
    },
    {
      title: 'Libre',
      dataIndex: 'libre',
      key: 'libre',
    },
    {
      title: 'Ocupado',
      dataIndex: 'ocupado',
      key: 'ocupado',
    },
  ];

  const cambiarPiso = (keyPiso) => {
    if (response) {
      response.forEach(element => {
        if (keyPiso === element.piso_index) {
          if (element.habitaciones.length > 0) {
            setHabitacion(element.habitaciones[0].habitacion_index);
          }
          setPiso(keyPiso);
        }
      });
    }
  }

  //* Actualiza la data del chart y de la tabla
  useEffect(() => {
    var hospi_o = 0;
    var hospi_l = 0;
    var uci_o = 0;
    var uci_l = 0;
    var ucim_o = 0;
    var ucim_l = 0;
    if (response) {
      response.forEach(element => {
        if (element.piso_index === piso) {
          element.habitaciones.forEach(data => {
            if (data.habitacion_index === habitacion) {
              data.camas.forEach(cama => {
                if (cama.paciente) {
                  if (cama.tipo === 'HOSPI') {
                    hospi_o += 1;
                  } else if (cama.tipo === 'UCI') {
                    uci_o += 1;
                  } else if (cama.tipo === 'UCIM') {
                    ucim_o += 1;
                  }
                } else {
                  if (cama.tipo === 'HOSPI') {
                    hospi_l += 1;
                  } else if (cama.tipo === 'UCI') {
                    uci_l += 1;
                  } else if (cama.tipo === 'UCIM') {
                    ucim_l += 1;
                  }
                }
              });
            }
          });
        }
      });
    }
    var vacias = hospi_l + uci_l + ucim_l;
    setChart([
      { name: 'Vacías', value: vacias },
      { name: 'Normales', value: hospi_o },
      { name: 'UCIM', value: ucim_o },
      { name: 'UCI', value: uci_o },
    ]);
    const dataTable = [];
    if (hospi_o > 0 || hospi_l > 0) {
      dataTable.push({
        tipo: 'HOSPI',
        libre: hospi_l,
        ocupado: hospi_o,
      });
    }
    if (uci_o > 0 || uci_l > 0) {
      dataTable.push({
        tipo: 'UCI',
        libre: uci_l,
        ocupado: uci_o,
      });
    }
    if (ucim_o > 0 || ucim_l > 0) {
      dataTable.push({
        tipo: 'UCIM',
        libre: ucim_l,
        ocupado: ucim_o,
      });
    }
    setdataSource(dataTable);
  }, [piso, habitacion, response]);

  useEffect(() => {
    traerData('', '');
    traerEspecialidades();
    traerMotivos();
  }, []);

  // useEffect(() => {
  //   if (response) {
  //     setPiso(response[0].piso_index);
  //     setHabitacion(response[0].habitaciones[0].habitacion_index);
  //   }
  // }, [response])

  return (
    <Card
      title={
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: '1fr',
            gridColumnGap: '0px',
            gridRowGap: '0px',
            marginRight: '5%',
          }}
        >
          <div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px', paddingTop: '20px' }}>
            Asignación de Camas
          </div>
          <Form ref={formRef} layout="horizontal" style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Item
              name="nombrePaciente"
              style={{
                gridArea: '1 / 2 / 2 / 3',
                display: 'flex',
                flexDirection: 'row-reverse',
                width: '100%',
                margin: 0,
                // padding: 0
              }}
            >
              <AutoComplete
                value={valueCOD}
                options={optionsCOD}
                onSearch={onSearchCOD}
                onSelect={onSelectCOD}
                onChange={onChangeCOD}
                style={{ width: '100%' }}
                placeholder="Ingrese el nombre del paciente"
              />
            </Form.Item>
          </Form>
          <div
            style={{
              gridArea: '1 / 3 / 3 / 4',
              display: 'flex',
              flexDirection: 'row-reverse',
              paddingTop: '15px',
            }}
          >
            <Button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#04B0AD',
                color: 'white',
              }}
              onClick={() => traerData('', '')}
            >
              Actualizar
            </Button>
          </div>
        </div>
      }
    >
      {
        response ?
          <Tabs tabPosition={'left'} onChange={keyPiso => cambiarPiso(keyPiso)} activeKey={piso}>
            {/* Pisos */}
            {response.map((piso, indexpiso) => (
              <TabPane tab={piso.piso} key={piso.piso_index} >
                <Tabs tabPosition={'top'} onChange={keyHabitacion => setHabitacion(keyHabitacion)} activeKey={habitacion}>
                  {/* Habitaciones */}
                  {piso.habitaciones.map((habitacion, indexhabitacion) => (
                    <TabPane tab={habitacion.habitacion} key={habitacion.habitacion_index} forceRender={true}>
                      <Row>
                        <Col sm={17} xs={24} style={{ paddingRight: '0px' }}>
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              flexDirection: 'row',
                              width: '100%',
                              alignContent: 'space-around',
                            }}
                          >
                            {/* Camas */}
                            {habitacion.camas.map(cama => (
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  borderRadius: '5px',
                                  paddingBottom: '10px',
                                  backgroundColor: cama.active ? '#04B0AD' : 'white',
                                  color: cama.active ? 'white' : 'black',
                                  width: '100px'
                                }}
                              >
                                <Tooltip
                                  color={
                                    cama.tipo === 'HOSPI'
                                      ? "#8EC1BC"
                                      : cama.tipo === 'UCI'
                                        ? "#A5192A"
                                        : cama.tipo === 'UCIM'
                                          ? "#C9A969"
                                          : "#2FAC66"
                                  }
                                  placement="right"
                                  // style={{ maxWidth: '500px !important' }}
                                  title={
                                    cama.paciente ?
                                      <div
                                        style={{
                                          width: 'auto',
                                          padding: '10px',
                                          backgroundColor: 'white',
                                          borderRadius: '5px',
                                          color: 'black'
                                        }}>
                                        <Row >
                                          {
                                            cama.paciente ?
                                              <>
                                                <div style={{ width: '100%', margin: '0 16px 0 16px', fontSize: '16px' }}>Datos del paciente</div>
                                                <Divider />
                                                <Col xs={12} style={{ padding: '0px 0px 0px 16px', display: 'flex', alignItems: 'center' }}>
                                                  DNI:
                                                </Col>
                                                <Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                  {cama.num_documento}
                                                </Col>
                                                <Divider />
                                                <Col xs={12} style={{ padding: '0px 0px 0px 16px', display: 'flex', alignItems: 'center' }}>
                                                  Nombre:
                                                </Col>
                                                <Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                  {cama.nom_cli}
                                                </Col>
                                                <Divider />
                                                <Col xs={12} style={{ padding: '0px 0px 0px 16px', display: 'flex', alignItems: 'center' }}>
                                                  Apellidos:
                                                </Col>
                                                <Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                  {cama.ape_pat_cli + ' ' + cama.ape_mat_cli}
                                                </Col>
                                                <Divider />
                                                <Col xs={12} style={{ padding: '0px 0px 0px 16px', display: 'flex', alignItems: 'center' }}>
                                                  Especialidad:
                                                </Col>
                                                <Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                  {cama.especialidad}
                                                </Col>
                                                <Divider />
                                                <Col xs={12} style={{ padding: '0px 0px 0px 16px', display: 'flex', alignItems: 'center' }}>
                                                  Fecha de Ingreso:
                                                </Col>
                                                <Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                  {Moment(cama.fecha_ingreso).format('DD/MM/YYYY')}
                                                </Col>
                                                <Divider />
                                                {
                                                  cama.transferido === '1' ?
                                                    <>
                                                      <Col xs={12} style={{ padding: '0px 0px 0px 16px', display: 'flex', alignItems: 'center' }}>
                                                        Días de Hospitalización:
                                                      </Col>
                                                      <Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                        {
                                                          Moment(cama.fecha_transferido).diff(Moment(cama.fecha_ingreso), 'days')
                                                        }
                                                      </Col>
                                                    </>
                                                    :
                                                    <>
                                                      <Col xs={12} style={{ padding: '0px 0px 0px 16px', display: 'flex', alignItems: 'center' }}>
                                                        Días de Hospitalización:
                                                      </Col>
                                                      <Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                        {
                                                          (Moment().diff(Moment(cama.fecha_ingreso), 'days')) === 0 ?
                                                            "Se ingresó hoy" :
                                                            Moment().diff(Moment(cama.fecha_ingreso), 'days')
                                                        }
                                                      </Col>
                                                    </>
                                                }
                                              </>
                                              : null
                                          }
                                          {
                                            cama.transferido === '1' ?
                                              <>
                                                <Divider />
                                                <div style={{ width: '100%', margin: '0 16px 0 16px', fontSize: '16px' }}>Datos de la transferencia</div>
                                                <Divider />
                                                <Col xs={12} style={{ padding: '0px 0px 0px 16px', display: 'flex', alignItems: 'center' }}>
                                                  Fecha de transferencia:
                                                </Col>
                                                <Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                  {Moment(cama.fecha_transferido).format('DD/MM/YYYY')}
                                                </Col>
                                                <Divider />
                                                <Col xs={12} style={{ padding: '0px 0px 0px 16px', display: 'flex', alignItems: 'center' }}>
                                                  Días de Hospitalización:
                                                </Col>
                                                <Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                  {
                                                    (Moment().diff(Moment(cama.fecha_ingreso), 'days')) === 0 ?
                                                      "Se transfirió hoy" :
                                                      Moment().diff(Moment(cama.fecha_ingreso), 'days')
                                                  }
                                                </Col>
                                                <Divider />
                                                <Col xs={12} style={{ padding: '0px 0px 0px 16px', display: 'flex', alignItems: 'center' }}>
                                                  Piso anterior:
                                                </Col>
                                                <Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                  {cama.piso_anterior ? cama.piso_anterior : null}
                                                </Col>
                                                <Divider />
                                                <Col xs={12} style={{ padding: '0px 0px 0px 16px', display: 'flex', alignItems: 'center' }}>
                                                  Habitación anterior:
                                                </Col>
                                                <Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                  {cama.habitacion_anterior ? cama.habitacion_anterior : null}
                                                </Col>
                                              </>
                                              : null
                                          }
                                        </Row>
                                      </div>
                                      : cama.transferido === '1' ?
                                        <div
                                          style={{
                                            width: 'auto',
                                            padding: '10px',
                                            backgroundColor: 'white',
                                            borderRadius: '5px',
                                            color: 'black'
                                          }}>
                                          <Row >
                                            <div style={{ width: '100%', margin: '0 16px 0 16px', fontSize: '16px' }}>Datos de la transferencia</div>
                                            <Divider />
                                            <Col xs={12} style={{ padding: '0px 0px 0px 16px', display: 'flex', alignItems: 'center' }}>
                                              Fecha de transferencia:
                                            </Col>
                                            <Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                              {Moment(cama.fecha_transferido).format('DD/MM/YYYY')}
                                            </Col>
                                            <Divider />
                                            <Col xs={12} style={{ padding: '0px 0px 0px 16px', display: 'flex', alignItems: 'center' }}>
                                              Piso anterior:
                                            </Col>
                                            <Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                              {cama.piso_anterior ? cama.piso_anterior : null}
                                            </Col>
                                            <Divider />
                                            <Col xs={12} style={{ padding: '0px 0px 0px 16px', display: 'flex', alignItems: 'center' }}>
                                              Habitación anterior:
                                            </Col>
                                            <Col xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                              {cama.habitacion_anterior ? cama.habitacion_anterior : null}
                                            </Col>
                                          </Row>
                                        </div>
                                        : null
                                  }
                                >
                                  <div
                                    style={{
                                      padding: '16px',
                                      width: '100px ',
                                      height: '100px',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                      if (cama.habitacion_id_anterior === null) {
                                        if (cama.paciente === null) {
                                          setEditar(cama.paciente);
                                          setDataModal(cama);
                                          setAbrirModal(true);
                                        } else {
                                          liberarCama(cama);
                                        }
                                      } else {
                                        if (cama.paciente === null) {
                                          transferidoVacio(cama);
                                        } else {
                                          transferidoLleno(cama);
                                        }
                                      }
                                    }}
                                  >
                                    {
                                      cama.tipo === 'HOSPI' ? (
                                        cama.genero ?
                                          cama.genero.toUpperCase() === 'F' ? (
                                            <img src={HOSPI_F} alt="cama vacía" />
                                          ) : cama.genero.toUpperCase() === 'M' ? (
                                            <img src={HOSPI_M} alt="cama vacía" />
                                          ) : (
                                            <img src={HOSPI_V} alt="cama vacía" />
                                          )
                                          : (
                                            <img src={HOSPI_V} alt="cama vacía" />
                                          )
                                      ) : cama.tipo === 'UCI' ? (
                                        cama.genero ?
                                          cama.genero.toUpperCase() === 'F' ? (
                                            <img src={UCI_F} alt="cama vacía" />
                                          ) : cama.genero.toUpperCase() === 'M' ? (
                                            <img src={UCI_M} alt="cama vacía" />
                                          ) : (
                                            <img src={UCI_V} alt="cama vacía" />
                                          ) : (
                                            <img src={UCI_V} alt="cama vacía" />
                                          )
                                      ) : cama.tipo === 'UCIM' ? (
                                        cama.genero ?
                                          cama.genero.toUpperCase() === 'F' ? (
                                            <img src={UCIM_F} alt="cama vacía" />
                                          ) : cama.genero.toUpperCase() === 'M' ? (
                                            <img src={UCIM_M} alt="cama vacía" />
                                          ) : (
                                            <img src={UCIM_V} alt="cama vacía" />
                                          ) : (
                                            <img src={UCIM_V} alt="cama vacía" />
                                          )
                                      ) : (
                                        <img src={HOSPI_V} alt="cama vacía" />
                                      )
                                    }
                                  </div>
                                  <div style={{ width: '100% ', display: 'flex', alignItems: 'center', justifyContent: 'center', wordBreak: 'break-word', overflowWrap: 'break-word', textAlign: 'center' }}>
                                    {
                                      cama.habitacion_id_anterior != null ?
                                        cama.numero + ' - ' + cama.tipo + ' (TRANSFERIDO)'
                                        :
                                        cama.numero + ' - ' + cama.tipo
                                    }
                                  </div>
                                </Tooltip>
                              </div>
                            ))}
                          </div>
                        </Col>
                        <Col sm={7} xs={24} style={{ paddingRight: '0px', paddingLeft: '0px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <CustomActiveShapePieChart data={chart} />
                          <Table
                            style={{ width: '80%' }}
                            loading={dataSource.length > 0 ? false : true}
                            dataSource={dataSource}
                            columns={columns}
                            size="small"
                            pagination={false}
                          />
                        </Col>
                      </Row>
                    </TabPane>
                  ))}
                </Tabs>
              </TabPane>
            ))
            }
          </Tabs >
          :
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin />
          </div>
      }
      {
        abrirModal ? (
          <ModalAgregar
            abrirModal={abrirModal}
            setAbrirModal={setAbrirModal}
            editar={editar}
            traerData={traerData}
            dataModal={dataModal}
            especialidades={especialidades}
          />
        ) : null
      }
      {/* //* Modal Liberar */}
      <Modal
        visible={modalTransferir}
        footer={[
          <Button
            key="back"
            onClick={() => setModalTransferir(false)}
          >
            No, Cancelar
          </Button>,

          <Button
            key="submit"
            type="primary"
            onClick={() => {
              setModalTransferir(false);
              setAbrirModalTransferir(true);
            }}
          >
            Transferir
          </Button>,
          <Button
            key="link"
            type="primary"
            loading={loading}
            onClick={() => {
              setModalTransferir(false);
              setModalMotivo(true);
            }}
          >
            Liberar
          </Button>
        ]}
        onCancel={() => setModalTransferir(false)}
        width={'35%'}
      >
        <div style={{ width: '100% ', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'start', gap: '20px', fontSize: '18px' }}>
          <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />
          ¿Desea liberar o transferir la cama?
        </div>
      </Modal>
      {/* //* Modal Transferido Lleno */}
      <Modal
        visible={modalTransferidoLleno}
        footer={[
          <Button
            key="back"
            onClick={() => setModalTransferidoLleno(false)}
          >
            No, Cancelar
          </Button>,
          <Button
            key="link"
            type="primary"
            loading={loading}
            onClick={() => {
              setModalTransferidoLleno(false);
              setModalMotivo(true);
            }}
          >
            Liberar
          </Button>
        ]}
        onCancel={() => setModalTransferidoLleno(false)}
        width={'35%'}
      >
        <div style={{ width: '100% ', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'start', gap: '20px', fontSize: '18px' }}>
          <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />
          ¿Desea liberar la cama?
        </div>
      </Modal>
      {/* //* Modal Transferido Vacío */}
      <Modal
        visible={modalTransferidoVacio}
        footer={[
          <Button
            key="back"
            onClick={() => setModalTransferidoVacio(false)}
          >
            No, Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={async () => {
              setLoading(true);
              var respuesta = await devolver({
                camaId: record,
                habitacionId_anterior: dataModalTransferir.habitacion_id_anterior,
                codMedico: JSON.parse(sessionStorage.getItem('token')).cod_medico
              });
              if (respuesta.success) {
                await traerData(dataModalTransferir.piso_id, dataModalTransferir.habitacion_id);
                notificaciones('Completado!');
                setLoading(false);
                setModalTransferidoVacio(false);
              } else {
                notificaciones(respuesta.message, 'Alerta');
                setLoading(false);
                setModalTransferidoVacio(false);
              }
            }}
          >
            Devolver
          </Button>,
          <Button
            key="link"
            type="primary"
            onClick={() => {
              setEditar(null);
              setDataModal(dataModalTransferir);
              setAbrirModal(true);
              setModalTransferidoVacio(false);
            }}
          >
            Asignar
          </Button>
        ]}
        onCancel={() => setModalTransferidoVacio(false)}
        width={'35%'}
      >
        <div style={{ width: '100% ', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'start', gap: '20px', fontSize: '18px' }}>
          <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />
          ¿Desea devolver o asignar la cama?
        </div>
      </Modal>
      {/* //* Modal Motivo Liberar */}
      <Modal
        visible={modalMotivo}
        footer={[
          <Button
            key="back"
            onClick={() => setModalMotivo(false)}
          >
            No, Cancelar
          </Button>,
          <Button
            key="link"
            type="primary"
            loading={loading}
            onClick={async () => {
              setLoading(true);
              var respuesta = await liberar({
                camaId: record,
                codMedico: JSON.parse(sessionStorage.getItem('token')).cod_medico,
                idHospitalizacion: dataModalTransferir.historia_clinica,
                motivoBaja: motivo
              });
              if (respuesta.success) {
                await traerData(dataModalTransferir.piso_id, dataModalTransferir.habitacion_id);
                notificaciones('Completado!');
                setLoading(false);
                setModalMotivo(false);
              } else {
                setLoading(false);
                notificaciones(respuesta.message, 'Alerta');
                setModalMotivo(false);
              }
            }}
          >
            Grabar Motivo
          </Button>
        ]}
        onCancel={() => setModalMotivo(false)}
        width={'35%'}
      >
        <div style={{ width: '100% ', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'start', gap: '20px', fontSize: '18px' }}>
          Seleccione el motivo para liberar la cama:
        </div>
        <Radio.Group
          style={{ padding: '15px 0 0 15px', display: 'flex', flexDirection: 'column' }}
          onChange={(e) => {
            setMotivo(e.target.value);
          }}
        >
          {
            motivos ?
              motivos.map((motivo) => {
                return (<Radio value={motivo.id_motivo_baja}>{motivo.descripcion}</Radio>);
              }) : null
          }
        </Radio.Group>
      </Modal>
      {
        abrirModalTransferir ? (
          <ModalTransferir
            abrirModal={abrirModalTransferir}
            setAbrirModal={setAbrirModalTransferir}
            traerData={traerData}
            dataModal={dataModalTransferir}
          />
        ) : null
      }
      <ToastContainer pauseOnHover={false} />
    </Card >
  );
};

const crearJson = async () => {
  const data = [];

  const respPisos = await httpClient.get('/camas/getPisos');
  const respHabitaciones = await httpClient.get('/camas/getHabitaciones');
  const respCamas = await httpClient.get('camas/getCamas');

  respPisos.data.data.forEach((piso, indexPiso) => {

    const habitaciones = [];

    respHabitaciones.data.data.forEach((habitacion, indexhabitacion) => {
      if (habitacion.piso_id === piso.piso_id) {
        const camas = [];

        respCamas.data.data.forEach((cama, indexCama) => {
          if (cama.habitacion_id === habitacion.habitacion_id) {
            cama.nombre_completo = cama.nom_cli + ' ' + cama.ape_pat_cli + ' ' + cama.ape_mat_cli;
            cama.cama_index = cama.cama_id;
            cama.active = false;
            camas.push(cama);
          }
        });

        const habitacionData = {
          habitacion: habitacion.nombre_habitacion,
          habitacion_index: habitacion.habitacion_id,
          camas: camas,
        };

        habitaciones.push(habitacionData);
      } else {
        indexhabitacion = 0;
      }
    });

    const pisoData = {
      piso: piso.nombre_piso,
      piso_index: piso.piso_id,
      habitaciones: habitaciones,
    };

    data.push(pisoData);

  });

  return data;
};

export default AsignacionCamas;
