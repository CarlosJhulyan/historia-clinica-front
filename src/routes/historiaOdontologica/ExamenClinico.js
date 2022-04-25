import React from 'react';
import {Col, Collapse, Form, Radio, Row} from 'antd';

const ExamenClinico = () => {

  const Panel = Collapse.Panel;

  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="6.EXAMEN CLÍNICO ESTOMALOGICO" key="1">
        <Form>
          <Row style={{flexDirection: "row", paddingLeft: "30px", paddingRight: "30px"}}>
            <Col lg={6} md={12} sm={12} xs={24}>
              <Form.Item label="Ex Extraoral">
              </Form.Item>
              <Form.Item label="Cara">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Cuello">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Piel">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Ganglios">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="ATV">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={12} xs={24}>
              <Form.Item label="Ex Extraoral">
              </Form.Item>
              <Form.Item label="Labios">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Carillos">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Fondo de Surco">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Periodonto">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Zona Retromolar">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Saliva">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Glandulas Salivales">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={12} xs={24}>
              <Form.Item label="Ex Extraoral">
              </Form.Item>
              <Form.Item label="Lengua">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Palador Duro">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Paladar Blando">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Piso de Boca">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Orifaringe">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Indice de Higinie Oral">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Hendidura Gingival">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={12} xs={24}>
              <Form.Item label="Ex Extraoral">
              </Form.Item>
              <Form.Item label="Vetalidar Palpar">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Odusión">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Guia Anterior">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Interfencias">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Contacto Prematuro">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Rebordes Alveolares">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Tuberosidades">
                <Radio.Group>
                  <Radio value={1}>N</Radio>
                  <Radio value={2}>P</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          
        </Form>
      </Panel>
    </Collapse>
  )
}
export default ExamenClinico;
