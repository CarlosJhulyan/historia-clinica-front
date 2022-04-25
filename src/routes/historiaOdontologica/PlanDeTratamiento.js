import React, { useState } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Collapse
} from 'antd';

const Panel = Collapse.Panel;
const {TextArea} = Input;

const PlanDeTratamiento = () => {
  const estadoInicial={
    tratamiento: '',
  }
  const [estado, setEstado] = useState(estadoInicial);
  const handleTratamiento = (value) => {
    setEstado({ ...estado, tratamiento: value.target.value });
    console.log(estado);
  };
  console.log(estado);
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="10. PLAN DE TRATAMIENTO" key="1">
        <Form 
        layout="vertical"
        initialValues={estadoInicial}
        >
          <Row style={{flexDirection: "row"}}>
            <Col lg={24} md={24} sm={24} xs={24}>
              <TextArea 
              style={{marginLeft: '46', paddingRight: '46'}} 
              rows={1} 
              placeholder="Ingrese el plan de tratamiento"
              onChange={handleTratamiento}
              />
            </Col>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};
export default PlanDeTratamiento;
