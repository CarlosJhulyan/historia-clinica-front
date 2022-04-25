import React, {useState} from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Collapse
} from 'antd';

const Panel = Collapse.Panel;

const {TextArea} = Input;

const ImpresionDiagnostica = () => {

  const estadoInicial = {
    descripcionDiagnostico: '',
    cie: '',
    campoP: '',
    campoD: '',
    campoR: '',
  };
  const [estado, setEstado] = useState(estadoInicial);
  const handleDiagnostico = (descripcionDiagnostico) => setEstado({...estado, descripcionDiagnostico});
  const handleCie = (cie) => setEstado({...estado, cie});
  const handleCampoP = (campoP) => setEstado({...estado, campoP});
  const handleCampoD = (campoD) => setEstado({...estado, campoD});
  const handleCampoR = (campoR) => setEstado({...estado, campoR});
  console.log(estado);
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="9.IMPRESIÓN DIAGNÓSTICA" key="1">
        <Form layout="vertical" initialValues={estadoInicial}>
          <Row style={{flexDirection: "row"}}>
            <Col lg={14} md={11} sm={24} xs={24}>
              <Form.Item
                label='Descripción del diagnóstico'
                name='descripcionDiagnostico'
              >
                <TextArea
                  placeholder='Ingrese su descripción de diagnóstico'
                  onChange={(e) => handleDiagnostico(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col lg={4} md={7} sm={12} xs={12}>
              <Form.Item
                label='CIE-10'
                name='cie'
              >
                <Input
                  placeholder='Ingrese su CIE-10'
                  onChange={(e) => handleCie(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col lg={2} md={2} sm={4} xs={4}>
              <Form.Item
                label='P'
                name='campoP'
              >
                <Input
                  onChange={(e) => handleCampoP(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col lg={2} md={2} sm={4} xs={4}>
              <Form.Item
                label='D'
                name="campoD"
              >
                <Input
                  onChange={(e) => handleCampoD(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col lg={2} md={2} sm={4} xs={4}>
              <Form.Item
                label='R'
                name='campoR'
              >
                <Input
                  onChange={(e) => handleCampoR(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};
export default ImpresionDiagnostica;
