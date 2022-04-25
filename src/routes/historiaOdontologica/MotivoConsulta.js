import React, {useState} from 'react';
import {Collapse, Input, Form} from 'antd';

const MotivoConsulta = () => {

  const Panel = Collapse.Panel;
  const {TextArea} = Input;
  const {Item} = Form;
  const estadoInicial = {
    motivoConsulta: ''
  };
  const [estado, setEstado] = useState(estadoInicial);
  const handleMotivoConsulta = (motivoConsulta) => setEstado({...estado, motivoConsulta});
  console.log(estado);
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="2. MOTIVO DE CONSULTA" key="1">
        <Form initialValues={estadoInicial} layout='vertical'>
          <Item
            name='motivoConsulta'
            rules={[{
              required: true,
              message: 'Ingrese el motivo de consulta'
            }]}
          >
            <TextArea
              rows={1}
              placeholder='Ingrese el motivo de consulta'
              onChange={(e) => handleMotivoConsulta(e.target.value)}
            />
          </Item>
        </Form>
      </Panel>
    </Collapse>
  )
}
export default MotivoConsulta;
