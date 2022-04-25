import React, {useState} from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  InputNumber,
  Collapse
} from 'antd';

const Panel = Collapse.Panel;


const Medicacion = () => {
  const estadoInicial = {
    medicamento: '',
    presentacion: '',
    cantidad: 1,
    dosis: 1,
    dias: 1,
  };
  const [estado, setEstado] = useState(estadoInicial);
  const handleDias = (dias) => setEstado({...estado, dias});
  const handleCantidad = (cantidad) => setEstado({...estado, cantidad});
  const handlePresentacion = (presentacion) => setEstado({...estado, presentacion});
  const handleDosis = (dosis) => setEstado({...estado, dosis});
  const handleMedicamento = (medicamento) => setEstado({...estado, medicamento});
  console.log(estado);
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="12. MEDICACION" key="1">
        <Form layout="vertical" initialValues={estadoInicial}>
          <Row style={{flexDirection: "row"}}>
            <Col lg={10} md={14} sm={24} xs={24}>
              <Form.Item
                label='Medicamento'
                name="medicamento"
                rules={[
                  {
                    required: false,
                    message: 'Ingrese el medicamento',
                  },
                ]}
              >
                <Input onChange={(e) => handleMedicamento(e.target.value)} placeholder="Ingrese el medicamento"/>
              </Form.Item>
            </Col>
            <Col lg={5} md={10} sm={24} xs={24}>
              <Form.Item
                label='Presentación'
                name="presentacion"
                rules={[
                  {
                    required: false,
                    message: 'Ingrese la presentación',
                  },
                ]}
              >
                <Input onChange={(e) => handlePresentacion(e.target.value)} placeholder="Ingrese la presentación"/>
              </Form.Item>
            </Col>
            <Col lg={3} md={4} sm={8} xs={24} style={{paddingBottom: '10px'}}>
              <Form.Item
                label='Cantidad'
                name='cantidad'
                rules={[
                  {
                    required: false,
                    message: 'Ingrese la cantidad',
                  },
                ]}
              >
                <InputNumber min={1} onChange={handleCantidad}/>
              </Form.Item>
            </Col>
            <Col lg={3} md={4} sm={8} xs={24} style={{paddingBottom: '10px'}}>
              <Form.Item
                label='Dosis'
                name='dosis'
                rules={[
                  {
                    required: false,
                    message: 'Ingrese la dosis',
                  },
                ]}
              >
                <InputNumber min={1} onChange={handleDosis}/>
              </Form.Item>
            </Col>
            <Col lg={3} md={4} sm={8} xs={24} style={{paddingBottom: '10px'}}>
              <Form.Item
                label='Días'
                name='dias'
                rules={[
                  {
                    required: false,
                    message: 'Ingrese los días',
                  },
                ]}
              >
                <InputNumber min={1} onChange={handleDias}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};
export default Medicacion;
