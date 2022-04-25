import React, {useState} from 'react';
import {Collapse, Form, Input} from 'antd';

const Riesgos = () => {

  const Panel = Collapse.Panel;
  const {TextArea} = Input;
  const {Item} = Form;
  const estadoInicial = {
    riesgos: ''
  };
  const [estado, setEstado] = useState(estadoInicial);
  const handleRiesgos = (riesgos) => setEstado({...estado, riesgos});
  console.log(estado);
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="3. RIESGOS" key="1">
        <Form initialValues={estadoInicial} layout='vertical'>
          <Item
            name='riesgos'
          >
            <TextArea
              rows={1}
              placeholder='Ingrese los riesgos'
              onChange={(e) => handleRiesgos(e.target.value)}
            />
          </Item>
        </Form>
      </Panel>
    </Collapse>
  )
}
export default Riesgos;
