import React, {useState} from 'react';
import {
  Form,
  Input,
  Select,
  Row,
  Col
} from 'antd';
import {NUMERO_REGEX} from "../../util/constants";
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

const {Option} = Select;


const Cabecera = () => {

  const [form] = Form.useForm();
  const [estado, setEstado] = useState({
    financiador: '',
    historia: '',
    otro: '',
  });
  const handleFinanciador = (value) => {
    setEstado({...estado, financiador: value});
    console.log(estado);
  }
  const handleHistoria = (value) => {
    console.log(value);
    setEstado({...estado, historia: value});
    console.log(estado);
  }
  const handleOtro = (value) => {
    setEstado({...estado, otro: value});
    console.log(estado);
  }
  const punto=useBreakpoint();
  const cambiarOrientacion = !punto.sm && punto.xs && !punto.md;
  console.log(estado);
  return (
    <Form
      form={form}
      layout="vertical"
    >
      <Row style={{flexDirection: "row"}}>
        <Col lg={12} md={10} sm={12} xs={24}>
          <h1 style={{
            fontSize: '30px', paddingTop: '30px', fontWeight: 'bold',
          }}>HISTORIA ODONTOLÓGICA</h1>
        </Col>
        <Col lg={12} md={14} sm={12} xs={24} style={{paddingRight: '0px', paddingBottom: '20px', paddingTop: '10px'}}>
          <Row style={{flexDirection: cambiarOrientacion?"column-reverse":"row-reverse"}}>
            {(estado.financiador === 'Otro') ?
              <Col lg={7} md={8} sm={24} xs={24} >
                <Form.Item
                  name="Otro"
                  label="Otro"
                  rules={[
                    {
                      required: true,
                      message: 'Ingrese un financiador',
                    },
                  ]}
                >
                  <Input
                    onChange={handleOtro}
                  />
                </Form.Item>
              </Col> : null}
            <Col lg={7} md={8} sm={24} xs={24}>
              <Form.Item
                name="Financiador"
                label="Financiador"
                rules={[
                  {
                    required: true,
                    message: 'Seleccione un financiador',
                  },
                ]}
              >
                <Select
                  allowClear
                  onChange={handleFinanciador}
                  placeholder="Seleccione"
                >
                  <Option value="Propio">Propio</Option>
                  <Option value="SIS">SIS</Option>
                  <Option value="ESSALUD">ESSALUD</Option>
                  <Option value="Otro">Otro</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col lg={7} md={8} sm={24} xs={24}>
              <Form.Item
                name="nro-historia"
                label="Nº Historia"
                rules={[
                  {
                    required: true,
                    pattern: NUMERO_REGEX,
                    message: 'Ingrese un número de historia válido',
                  }
                ]}
              >
                <Input
                  onChange={handleHistoria}
                  placeholder="00000000"
                  style={{width: '100%'}}
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};
export default Cabecera;

