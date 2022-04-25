import React, {useState} from 'react';
import {Col, Collapse, Form, Radio, Row} from 'antd';

const Panel = Collapse.Panel;

const Antecedentes = () => {

  const [estado, setEstado] = useState({
    diabetes: false,
    tuberculosis: false,
    anemia: false,
    fiebreReumatica: false,
    enfermedadCardiovascular: false,
    enfermedadRenal: false,
    enfermedadHepaticas: false,
    reaccionAnormalALaAnesteciaLocal: false,
    reaccionAnormalAOtrasDrogas: false,
    hemorragias: false,
    alergiaALaPenicilina: false,
    otras: false
  });
  const handleDiabetes = (value) => {
    setEstado({...estado, diabetes: value.target.value});
    console.log(estado);
  }
  const handleTuberculosis = (value) => {
    setEstado({...estado, tuberculosis: value.target.value});
    console.log(estado);
  }
  const handleAnemia = (value) => {
    setEstado({...estado, anemia: value.target.value});
    console.log(estado);
  }
  const handleFiebreReumatica = (value) => {
    setEstado({...estado, fiebreReumatica: value.target.value});
    console.log(estado);
  }
  const handleEnfermedadCardiovascular = (value) => {
    setEstado({...estado, enfermedadCardiovascular: value.target.value});
    console.log(estado);
  }
  const handleEnfermedadRenal = (value) => {
    setEstado({...estado, enfermedadRenal: value.target.value});
    console.log(estado);
  }
  const handleEnfermedadHepaticas = (value) => {
    setEstado({...estado, enfermedadHepaticas: value.target.value});
    console.log(estado);
  }
  const handleReaccionAnormalALaAnesteciaLocal = (value) => {
    setEstado({...estado, reaccionAnormalALaAnesteciaLocal: value.target.value});
    console.log(estado);
  }
  const handleReaccionAnormalAOtrasDrogas = (value) => {
    setEstado({...estado, reaccionAnormalAOtrasDrogas: value.target.value});
    console.log(estado);
  }
  const handleHemorragias = (value) => {
    setEstado({...estado, hemorragias: value.target.value});
    console.log(estado);
  }
  const handleAlergiaALaPenicilina = (value) => {
    setEstado({...estado, alergiaALaPenicilina: value.target.value});
    console.log(estado);
  }
  const handleOtras = (value) => {
    setEstado({...estado, otras: value.target.value});
    console.log(estado);
  }
  console.log(estado);
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header="4. ANTECEDENTES" key="1">
        <Form>
          <Row style={{flexDirection: "row", paddingLeft: "30px", paddingRight: "30px"}}>
            <Col lg={8} md={10} sm={12} xs={24} style={{paddingTop: "15px"}}>
              <p>Diabetes:</p>
              <Radio.Group style={{paddingBottom: "15px"}} value={estado.diabetes} onChange={handleDiabetes}>
                <Radio value={true}>Si</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
              <p>Tuberculosis:</p>
              <Radio.Group style={{paddingBottom: "15px"}} value={estado.tuberculosis} onChange={handleTuberculosis}>
                <Radio value={true}>Si</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
              <p>Anemia:</p>
              <Radio.Group style={{paddingBottom: "15px"}} value={estado.anemia} onChange={handleAnemia}>
                <Radio value={true}>Si</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
              <p>Fiebre Reumatica:</p>
              <Radio.Group style={{paddingBottom: "15px"}} value={estado.fiebreReumatica}
                           onChange={handleFiebreReumatica}>
                <Radio value={true}>Si</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Col>
            <Col lg={8} md={14} sm={12} xs={24} style={{paddingTop: "15px"}}>
              <p>Enfermedad Cardiovascular:</p>
              <Radio.Group style={{paddingBottom: "15px"}} value={estado.enfermedadCardiovascular}
                           onChange={handleEnfermedadCardiovascular}>
                <Radio value={true}>Si</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
              <p>Enfermedad Renal:</p>
              <Radio.Group style={{paddingBottom: "15px"}} value={estado.enfermedadRenal}
                           onChange={handleEnfermedadRenal}>
                <Radio value={true}>Si</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
              <p>Enfermedad hepáticas:</p>
              <Radio.Group style={{paddingBottom: "15px"}} value={estado.enfermedadHepaticas}
                           onChange={handleEnfermedadHepaticas}>
                <Radio value={true}>Si</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
              <p>Reacion anormal a la anesticia local:</p>
              <Radio.Group style={{paddingBottom: "15px"}} value={estado.reaccionAnormalALaAnesteciaLocal}
                           onChange={handleReaccionAnormalALaAnesteciaLocal}>
                <Radio value={true}>Si</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Col>
            <Col lg={8} md={24} sm={12} xs={24} style={{paddingTop: "15px"}}>
              <p>Reaccion anormal a otras drogas:</p>
              <Radio.Group style={{paddingBottom: "15px"}} value={estado.reaccionAnormalAOtrasDrogas}
                           onChange={handleReaccionAnormalAOtrasDrogas}>
                <Radio value={true}>Si</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
              <p>Hemorragias:</p>
              <Radio.Group style={{paddingBottom: "15px"}} value={estado.hemorragias} onChange={handleHemorragias}>
                <Radio value={true}>Si</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
              <p>Alergia a la penecilina:</p>
              <Radio.Group style={{paddingBottom: "15px"}} value={estado.alergiaALaPenicilina}
                           onChange={handleAlergiaALaPenicilina}>
                <Radio value={true}>Si</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
              <p>Otras:</p>
              <Radio.Group style={{paddingBottom: "15px"}} value={estado.otras} onChange={handleOtras}>
                <Radio value={true}>Si</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Col>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  )
}

export default Antecedentes;
