import React, { useState } from 'react';
import { Col, Collapse, Form, Input, Row } from 'antd';

const FuncionesVitales = () => {

  const Panel = Collapse.Panel;

  const estadoInicial = {
    peso: '',
    campoFC: '',
    campoRF: '',
    talla: '',
    campoPresArt: '',
    campoT: ''
  }
  const [estado, setEstado] = useState(estadoInicial);
  const handlePeso = (value) => {
    setEstado({ ...estado, peso: value.target.value });
    console.log(estado);
  };
  const handleCampoFC = (value) => {
    setEstado({ ...estado, campoFC: value.target.value });
    console.log(estado);
  };
  const handleCampoRF = (value) => {
    setEstado({ ...estado, campoRF: value.target.value });
    console.log(estado);
  };
  const handleTalla = (value) => {
    setEstado({ ...estado, talla: value.target.value });
    console.log(estado);
  };
  const handleCampoPresArt = (value) => {
    setEstado({ ...estado, campoPresArt: value.target.value });
    console.log(estado);
  };
  const handleCampoT = (value) => {
    setEstado({ ...estado, campoT: value.target.value });
    console.log(estado);
  };
  console.log(estado);
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="5. FUNCIONES VITALES" key="1">
        <Form
          layout="vertical"
          initialValues={estadoInicial}
        >
          <Row style={{ flexDirection: "row" }}>
            <Col lg={4} md={8} sm={8} xs={12}>
              <Form.Item label="Peso" style={{ alignItems: "center" }}>
                <Input placeholder="000.00" onChange={handlePeso}/>
              </Form.Item>
            </Col>
            <Col lg={4} md={8} sm={8} xs={12}>
              <Form.Item label="FC" style={{ alignItems: "center" }}>
                <Input onChange={handleCampoFC}/>
              </Form.Item>
            </Col>
            <Col lg={4} md={8} sm={8} xs={12}>
              <Form.Item label="RF" style={{ alignItems: "center" }}>
                <Input onChange={handleCampoRF}/>
              </Form.Item>
            </Col>
            <Col lg={4} md={8} sm={8} xs={12}>
              <Form.Item label="TALLA" style={{ alignItems: "center" }}>
                <Input placeholder="0.00" onChange={handleTalla}/>
              </Form.Item>
            </Col>
            <Col lg={4} md={8} sm={8} xs={12}>
              <Form.Item label="PRES/ART" style={{ alignItems: "center" }}>
                <Input onChange={handleCampoPresArt}/>
              </Form.Item>
            </Col>
            <Col lg={4} md={8} sm={8} xs={12}>
              <Form.Item label="T (°)" style={{ alignItems: "center" }}>
                <Input onChange={handleCampoT}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  )
}
export default FuncionesVitales;
