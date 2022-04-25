import React, {useState} from 'react';
import {
  Form,
  Row,
  Col,
  Checkbox,
  Collapse
} from 'antd';

const planesDeTrabajo1 = ['Estudio de imágenes', 'Modelos de estudio'];
const planesDeTrabajo2 = ['Especialidad odontológica', 'Medica'];
const Panel = Collapse.Panel;

const PlanDeTrabajo = () => {
  const estadoInicial = {
    planDeTrabajo: [],
    interconsulta: [],
  }
  const [estado, setEstado] = useState(estadoInicial);
  const handlePlanDeTrabajo = (value) => {
    setEstado({...estado, radiografias: value});
    console.log(estado);
  };
  const handleInterconsulta = (value) => {
    setEstado({...estado, radiografias: value});
    console.log(estado);
  };
  console.log(estado);
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="7. PLAN DE TRABAJO PARA EL DIAGNÓSTICO" key="1">
        <Form
          layout="vertical"
          initialValues={estadoInicial}
        >
          <Row style={{flexDirection: "row"}}>
            <Col lg={24} md={24} sm={24} xs={24} style={{paddingTop: "10px", paddingBottom: "10px"}}>
              <Checkbox.Group options={planesDeTrabajo1} onChange={handlePlanDeTrabajo}/>
            </Col>
            <Col lg={24} md={24} sm={24} xs={24}>
              <h4 style={{paddingTop: '10px'}}>Interconsulta</h4>
            </Col>
            <Col lg={24} md={24} sm={24} xs={24} style={{paddingTop: "10px", paddingBottom: "5px"}}>
              <Checkbox.Group options={planesDeTrabajo2} onChange={handleInterconsulta}/>
            </Col>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};
export default PlanDeTrabajo;
