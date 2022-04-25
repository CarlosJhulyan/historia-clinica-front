import React, { useState } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Collapse
} from 'antd';
import moment from 'moment';


const { TextArea } = Input;
const Panel = Collapse.Panel;


const EvolucionTratamiento = () => {
  const dateFormat = 'YYYY/MM/DD';
  const fechaActual = moment().format('YYYY/MM/DD');
  const estadoInicial = {
    procedimiento: '',
    fecha: fechaActual,
    sello: ''
  }
  const [estado, setEstado] = useState(estadoInicial);
  const handleProcedimiento = (value) => {
    setEstado({ ...estado, procedimiento: value.target.value });
    console.log(estado);
  };
  const handleFecha = (value) => {
    setEstado({ ...estado, fecha: value.format('YYYY/MM/DD') });
    console.log(estado);
  };
  console.log(estado);
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="11. EVOLUCION TRATAMIENTO" key="1">
        <Form 
        layout="vertical" 
        initialValues={estadoInicial}
        >
          <Row style={{ flexDirection: "row", paddingTop: '10px' }}>
            <Col lg={14} md={14} sm={24} xs={24}>
              <Form.Item
                label="Descripción del procedimiento realizado"
              >
                <TextArea
                  rows={1}
                  placeholder="Ingrese el procedimiento realizado"
                  onChange={handleProcedimiento}
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={6} sm={24} xs={24}>
              <Form.Item
                label="Fecha"
              >
                <DatePicker
                  className="gx-mb-3 gx-w-100"
                  defaultValue={moment(fechaActual, dateFormat)}
                  format={dateFormat}
                  onChange={handleFecha}
                />
              </Form.Item>
            </Col>
            <Col lg={2} md={4} sm={24} xs={24}>
              <p>Sello / Firma</p>
              {/* AGREGAR DRAGDROP */}
            </Col>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};
export default EvolucionTratamiento;
