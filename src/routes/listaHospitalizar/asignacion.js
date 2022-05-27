import React, { useState, useEffect, createRef } from 'react';
import { Radio, Col, Modal, Row, Form, Input, Select, AutoComplete } from 'antd';
import { httpClient } from '../../util/Api';
import moment from 'moment';

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

const Asignacion = ({ dataModal, asignarCama, traerData, formRef }) => {
  const [array, setArray] = useState([]);
  const [arrayCama, setArrayCama] = useState([]);
  const [pisos, setPisos] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [camas, setCamas] = useState([]);

  const asignarCamas = async () => {
    var validator = false;
    const nombre = formRef.current.getFieldValue('camaId');
    const dias = formRef.current.getFieldValue('dias');
    const especialidad = formRef.current.getFieldValue('genero');
    if (nombre ? nombre.length > 0 : false && dias ? dias.length > 0 : false && especialidad ? especialidad.length > 0 : false) {
      validator = true;
    }
    if (validator) {
      const respuesta = await asignarCama();
      if (respuesta.success) {
        await traerData();
      } else {
        console.log('No se pudo completar')
      }
    } else {
      console.error('Error')
    }
  }

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
        formRef.current.setFieldsValue({
          camaId: element.cama_id
        });
      }
    });
  };

  useEffect(() => {
    traerPisos();
    traerHabitaciones();
    traerCamas();
  }, [])

  return (
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
                {dataModal ? moment(dataModal.FECHA_NAC, "YYYY/MM/DD").month(0).from(moment().month(0)).substring(5) : null}
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
  );
};

export default Asignacion;
