import React, { useState, useEffect, createRef } from 'react';
import { Radio, Col, Modal, Row, Form, Input, Select, AutoComplete } from 'antd';
import { httpClient } from '../../util/Api';
import { notificaciones } from '../../util/util';
import axios from 'axios';

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

const ModalAsignacion = ({ abrirModal, setAbrirModal, traerData, dataModal, hospitalizacion }) => {

  const formRef = createRef();

  const [loading, setLoading] = useState(false);

  const [array, setArray] = useState([]);
  const [arrayCama, setArrayCama] = useState([]);
  const [pisos, setPisos] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [camas, setCamas] = useState([]);

  const asignarCama = async () => {
    console.log(hospitalizacion);
    const repuesta = await httpClient.post('camas/asignacionCama', {
      camaId: formRef.current.getFieldValue('camaId'),
      codPaciente: dataModal.COD_PACIENTE,
      especialidad: JSON.parse(localStorage.getItem('token')).des_especialidad,
      dias: formRef.current.getFieldValue('dias'),
      genero: formRef.current.getFieldValue('genero'),
      codMedico: JSON.parse(localStorage.getItem('token')).cod_medico,
      idHospitalizacion: hospitalizacion.historia_clinica
    });
    return repuesta.data;
  };

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

  const onChangePiso = (e) => {
    pisos.forEach((element) => {
      if (element.piso_id === e) {
        // setHabitacion({
        //   ...habitacion,
        //   pisoId: element.piso_id.toString(),
        // });
        formRef.current.setFieldsValue({
          pisoId: element.piso_id,
          habitacionId: null
        });
      }
    });
    const arr = habitaciones.filter(element => element.piso_id === e);
    setArray(arr);
  };

  const onChangeHabitación = (e) => {
    habitaciones.forEach((element) => {
      if (element.key === e) {
        // setCama({
        //   ...cama,
        //   habitacionId: element.habitacion_id.toString(),
        // });
        formRef.current.setFieldsValue({
          habitacionId: element.habitacion_id
        });
      }
    });
    const arr = camas.filter(element => element.habitacion_id === e);
    console.log(arr);
    setArrayCama(arr);
  };

  const onChangeCama = (e) => {
    camas.forEach((element) => {
      if (element.key === e) {
        console.log(e);
        // setCama({
        //   ...cama,
        //   habitacionId: element.habitacion_id.toString(),
        // });
        formRef.current.setFieldsValue({
          camaId: element.cama_id
        });
      }
    });
  };

  // useEffect(() => {
  //   if (dataModal) {
  //     console.log(dataModal);
  //     const arr = habitaciones.filter(element => element.piso_id === dataModal.piso_id);
  //     setArray(arr);
  //     const arra = camas.filter(element => element.piso_id === dataModal.piso_id);
  //     setArrayCama(arra);
  //     // setCama({
  //     //   ...dataModal,
  //     //   camaId: dataModal.cama_id,
  //     //   habitacionId: dataModal.habitacion_id,
  //     //   habitacionId_anterior: dataModal.habitacion_id,
  //     //   habitacion_anterior: dataModal.nombre_habitacion,
  //     //   piso_anterior: dataModal.nombre_piso
  //     // });
  //     formRef.current.setFieldsValue({
  //       numero: dataModal.numero,
  //       tipo: dataModal.tipo,
  //       pisoId: dataModal.piso_id,
  //       habitacionId: dataModal.habitacion_id
  //     });
  //   }
  // }, [habitaciones, dataModal]);

  useEffect(() => {
    traerPisos();
    traerHabitaciones();
    traerCamas();
  }, [])

  return (
    <Modal
      okText="Aceptar"
      cancelText="Cancelar"
      confirmLoading={loading}
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
          <div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px' }}>
            Asignar Paciente
          </div>
        </div>
      }
      visible={abrirModal}
      onOk={async () => {
        var validator = false;
        const nombre = formRef.current.getFieldValue('camaId');
        const dias = formRef.current.getFieldValue('dias');
        const especialidad = formRef.current.getFieldValue('genero');
        if (nombre ? nombre.length > 0 : false && dias ? dias.length > 0 : false && especialidad ? especialidad.length > 0 : false) {
          validator = true;
        }
        if (validator) {
          setLoading(true);
          const respuesta = await asignarCama();
          if (respuesta.success) {
            //TODO: same
            await traerData();
            setLoading(false);
            setAbrirModal(false);
            notificaciones('Completado!');
          } else {
            notificaciones(respuesta.message, 'Alerta');
            setLoading(false);
          }
        } else {
          notificaciones('Debe llenar todos los campos', 'Alerta');
        }
      }}
      onCancel={() => setAbrirModal(false)}
    >
      <Form ref={formRef} layout="horizontal" style={{ padding: '0 20px 0 20px' }}>
        <Row style={{ flexDirection: 'row' }}>
          {
            dataModal ?
              <>
                <Col xs={6} style={{ padding: '0 0 8px 0' }}>
                  PACIENTE:
                </Col>
                <Col xs={18} style={{ padding: '0 0 8px 0' }}>
                  {dataModal ? dataModal.PACIENTE : null}
                </Col>
                <Col xs={6} style={{ padding: '0 0 8px 0' }}>
                  EDAD:
                </Col>
                <Col xs={18} style={{ padding: '0 0 8px 0' }}>
                  {dataModal ? dataModal.EDAD : null}
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
                // onChange={onChangePiso}
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
                    return < Select.Option value={element.cama_id}>{element.numero + " - " + element.tipo + (element.transferido === "1" ? " (TRANSFERIDO)" : "")}</Select.Option>;
                  })
                }
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalAsignacion;
