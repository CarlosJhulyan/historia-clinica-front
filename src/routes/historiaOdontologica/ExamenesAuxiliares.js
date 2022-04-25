import React, { useState } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Checkbox,
  Collapse
} from 'antd';

const Panel = Collapse.Panel;

const radiografias = ['Periapical (1)', 'Bite Wing (2)', 'Panorámica (3)', 'Octusal (4)'];
const modelo = ['Articulador SemiAjustable', 'Articulador de Bisagra'];
const {TextArea} = Input;

const ExamenesAuxiliares = () => {
  const estadoInicial = {
    radiografias: [],
    informeRadiografico: '',
    modelo: []
  }
  const [estado, setEstado] = useState(estadoInicial);
  const handleRadiografias = (value) => {
    setEstado({ ...estado, radiografias: value });
    console.log(estado);
  };
  const handleInformeRadiografico = (value) => {
    setEstado({ ...estado, informeRadiografico: value.target.value });
    console.log(estado);
  };
  const handleModelo = (value) => {
    setEstado({ ...estado, modelo: value });
    console.log(estado);
  };
  console.log(estado);
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="8. EXÁMENES AUXILIARES" key="1">
      <Form 
        layout="vertical" 
        initialValues={estadoInicial}
        >
          <Row style={{flexDirection: "row", paddingTop: "10px", paddingBottom: "5px"}}>
            <Col lg={3} md={6} sm={12} xs={24}>
              <h4>Radiografías</h4>
            </Col>
            <Col lg={18} md={6} sm={12} xs={24}>
              <Checkbox.Group options={radiografias} onChange={handleRadiografias}/>
            </Col>
          </Row>
          <div style={{paddingLeft: '16px', paddingTop: '10px', paddingBottom: "5px"}}>
            <h4 style={{paddingTop: '10px'}}>Informe Radiografíco</h4>
            <TextArea rows={1} placeholder="Ingrese el informe radiográfico" onChange={handleInformeRadiografico}/>
          </div>
          <Row style={{flexDirection: "row", paddingTop: '15px', paddingBottom: "5px"}}>
            <Col lg={3} md={6} sm={12} xs={24}>
              <h4>Modelo de estudio</h4>
            </Col>
            <Col lg={18} md={6} sm={12} xs={24}>
              <Checkbox.Group options={modelo} onChange={handleModelo}/>
            </Col>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};
export default ExamenesAuxiliares;
