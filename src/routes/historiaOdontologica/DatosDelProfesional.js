import React, { useState } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Collapse,
  Select
} from 'antd';
import { TEXTO_REGEX } from "../../util/constants";
const { Option } = Select;
const Panel = Collapse.Panel;

const DatosDelProfesional = () => {
  const estadoInicial = {
    profesional: '',
    cop: '',
    consultorio: '',
    turno: ''
  }
  const [estado, setEstado] = useState(estadoInicial);
  const handleProfesional = (value) => {
    setEstado({ ...estado, profesional: value.target.value });
    console.log(estado);
  };
  const handleCOP = (value) => {
    setEstado({ ...estado, cop: value.target.value });
    console.log(estado);
  };
  const handleConsultorio = (value) => {
    setEstado({ ...estado, consultorio: value.target.value });
    console.log(estado);
  };
  const handleTurno = (value) => {
    setEstado({ ...estado, turno: value });
    console.log(estado);
  };
  console.log(estado);
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="14. DATOS DEL PROFESIONAL" key="1">
        <Form
          layout="vertical"
          initialValues={estadoInicial}
        >
          <Row style={{ flexDirection: "row" }}>
            <Col lg={9} md={16} sm={24} xs={24}>
              <Form.Item
                name="profesional"
                label="Profesional"
                rules={[
                  {
                    required: false,
                    pattern: TEXTO_REGEX,
                    message: 'Datos requeridos',
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Ingrese los datos"
                  value={estado.profesional}
                  onChange={handleProfesional}
                />
              </Form.Item>
            </Col>
            <Col lg={5} md={8} sm={24} xs={24}>
              <Form.Item
                name="cop"
                label="C.O.P."
                rules={[
                  {
                    required: false,
                    message: 'C.O.P Requerido',
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Ingrese C.O.P"
                  value={estado.cop}
                  onChange={handleCOP}
                />
              </Form.Item>
            </Col>
            <Col lg={6} md={16} sm={24} xs={24}>
              <Form.Item
                name="consultorio"
                label="Consultorio"
                rules={[
                  {
                    required: false,
                    pattern: TEXTO_REGEX,
                    message: 'Consultorio Requerido',
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Ingrese consultorio"
                  value={estado.consultorio}
                  onChange={handleConsultorio}
                />
              </Form.Item>
            </Col>
            <Col lg={4} md={8} sm={24} xs={24}>
              <Form.Item
                name="turno"
                label="Turno"
                rules={[
                  {
                    required: false,
                    message: 'Seleccione un turno',
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder="Seleccione"
                  value={estado.turno}
                  onChange={handleTurno}
                >
                  <Option value="Manhana">Mañana</Option>
                  <Option value="Tarde">Tarde</Option>
                  <Option value="Noche">Noche</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};
export default DatosDelProfesional;
