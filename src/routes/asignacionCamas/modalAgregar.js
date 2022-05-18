import React, { useState, createRef } from 'react';
import { Input, Col, Modal, Row, Form, AutoComplete, Select } from 'antd';
import { httpClient } from '../../util/Api';
import { notificaciones } from '../../util/util';
import axios from 'axios';

const ModalAgregar = ({ abrirModal, setAbrirModal, editar, traerData, dataModal, especialidades }) => {
  const formRef = createRef();

  const [loading, setLoading] = useState(false);

  const [paciente, setPaciente] = useState();
  const [hospitalizacion, setHospitalizacion] = useState();
  const [valueCOD, setValueCOD] = useState('');
  const [optionsCOD, setOptionsCOD] = useState([]);
  const [valueNOM, setValueNOM] = useState('');
  const [optionsNOM, setOptionsNOM] = useState([]);

  const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());
  const [peticion, setPeticion] = useState(false);

  const asignarCama = async () => {
    const repuesta = await httpClient.post('camas/asignacionCama', {
      camaId: dataModal.cama_id,
      codPaciente: paciente.cod_paciente,
      especialidad: formRef.current.getFieldValue('especialidad'),
      dias: formRef.current.getFieldValue('dias'),
      genero: paciente.sexo_cli,
      codMedico: JSON.parse(sessionStorage.getItem('token')).cod_medico,
      idHospitalizacion: paciente.historia_clinica
    });
    return repuesta.data;
  };

  const onSearchCOD = async searchText => {
    var cod = formRef.current.getFieldValue('codPaciente');
    if (cod ? cod.length >= 4 : false) {
      setPeticion(true);
      setOptionsCOD();
      const respuesta = await httpClient.post(
        'camas/getPacientes',
        {
          codPaciente: cod,
          nombre: '',
        },
        { cancelToken: cancelSource.token }
      );
      var array1 = respuesta.data.data;
      for (let i = 0; i < array1.length; i++) {
        if (array1[i].motivo_baja === null) {
          if (array1[i].asignado === "1") {
            delete array1[i];
          } else {
            array1[i].key = array1[i].cod_paciente;
            array1[i].value = array1[i].cod_paciente;
            array1[i].label = (
              <div>
                {array1[i].historia_clinica}
                <div style={{ color: '#a3a3a3' }}>{' ' + array1[i].ape_pat_cli + ' ' + array1[i].ape_mat_cli}</div>
              </div>
            );
          }
        } else {
          delete array1[i];
        }
      }
      setOptionsNOM();
      setOptionsCOD(array1);
    } else {
      if (peticion) {
        cancelSource.cancel('COD Cancelado');
        setCancelSource(axios.CancelToken.source());
      }
    }
  };

  const onSearchNOM = async searchText => {
    var nombre = formRef.current.getFieldValue('nombre');
    if (nombre ? nombre.length >= 4 : false) {
      setPeticion(true);
      setOptionsNOM();
      const respuesta = await httpClient.post(
        'camas/getPacientes',
        {
          codPaciente: '',
          nombre: nombre,
        },
        { cancelToken: cancelSource.token }
      );
      var array2 = respuesta.data.data;
      console.log(respuesta.data.data);
      for (let i = 0; i < array2.length; i++) {
        if (array2[i].motivo_baja === null) {
          if (array2[i].asignado === "1") {
            delete array2[i];
          } else {
            array2[i].key = array2[i].cod_paciente;
            array2[i].value = array2[i].cod_paciente;
            array2[i].label = (
              <div>
                {array2[i].nom_cli}
                <div style={{ color: '#a3a3a3' }}>{' ' + array2[i].ape_pat_cli + ' ' + array2[i].ape_mat_cli}</div>
              </div>
            );
          }
        } else {
          delete array2[i];
        }
      }
      setOptionsCOD();
      setOptionsNOM(array2);
    } else {
      if (peticion) {
        cancelSource.cancel('NOM ancelado');
        setCancelSource(axios.CancelToken.source());
      }
    }
  };

  const onSelectCOD = data => {
    optionsCOD.forEach(element => {
      if (element.key === data) {
        formRef.current.setFieldsValue({
          codPaciente: element.historia_clinica,
          nombre: `${element.nom_cli + ' ' + element.ape_pat_cli + ' ' + element.ape_mat_cli}`,
        });
        setPaciente(element);
        setValueCOD(data);
      }
    });
  };

  const onSelectNOM = data => {
    optionsNOM.forEach(element => {
      if (element.key === data) {
        formRef.current.setFieldsValue({
          codPaciente: element.historia_clinica,
          nombre: `${element.nom_cli + ' ' + element.ape_pat_cli + ' ' + element.ape_mat_cli}`,
        });
        setPaciente(element);
        setValueNOM(data);
      }
    });
  };

  const onChangeCOD = data => {
    if (data.length <= 3) {
      setOptionsCOD([]);
    }
  };

  const onChangeNOM = data => {
    if (data.length <= 3) {
      setOptionsNOM([]);
    }
  };

  return (
    <Modal
      okText="Aceptar"
      cancelText="Cancelar"
      confirmLoading={loading}
      title={
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridTemplateRows: '1fr',
            gridColumnGap: '0px',
            gridRowGap: '0px',
            marginRight: '5%',
          }}
        >
          <div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px' }}>
            {editar ? 'Editar Paciente' : 'Agregar Paciente'}
          </div>
        </div>
      }
      visible={abrirModal}
      onOk={async () => {
        var validator = false;
        const nombre = formRef.current.getFieldValue('nombre');
        const dias = formRef.current.getFieldValue('dias');
        const especialidad = formRef.current.getFieldValue('especialidad');
        if (nombre ? nombre.length > 0 : false && dias ? dias.length > 0 : false && especialidad ? especialidad.length > 0 : false) {
          validator = true;
        }
        if (validator) {
          setLoading(true);
          const respuesta = await asignarCama();
          if (respuesta.success) {
            //TODO: same
            await traerData(dataModal.piso_id, dataModal.habitacion_id);
            setLoading(false);
            setAbrirModal(false);
            notificaciones('Completado!');
          } else {
            notificaciones(respuesta.message, 'Alerta');
            setLoading(false);
          }
        } else {
          notificaciones('Debe llenar todos los campos', 'Alerta');
        }
      }}
      onCancel={() => setAbrirModal(false)}
    >
      <Form ref={formRef} layout="horizontal" style={{ padding: '0 20px 0 20px' }}>
        <Row style={{ flexDirection: 'row' }}>
          {editar ? null : (
            <>
              <Col xs={6} style={{ padding: '20px 0 10px 0', display: 'flex', alignItems: 'center' }}>
                <div>Historial Clínico:</div>
              </Col>
              <Col xs={18} style={{ padding: '20px 0 10px 0' }}>
                <Form.Item name="codPaciente" style={{ margin: 0, padding: 0 }}>
                  <AutoComplete
                    value={valueCOD}
                    options={optionsCOD}
                    onSearch={onSearchCOD}
                    onSelect={onSelectCOD}
                    onChange={onChangeCOD}
                    style={{ width: '100%' }}
                    placeholder="Ingrese el Historial clínico"
                  />
                </Form.Item>
              </Col>
              <Col xs={6} style={{ padding: '20px 0 20px 0', display: 'flex', alignItems: 'center' }}>
                <div>Nombre del paciente:</div>
              </Col>
              <Col xs={18} style={{ padding: '20px 0 20px 0' }}>
                <Form.Item name="nombre" style={{ margin: 0, padding: 0 }}>
                  <AutoComplete
                    value={valueNOM}
                    options={optionsNOM}
                    onSearch={onSearchNOM}
                    onSelect={onSelectNOM}
                    onChange={onChangeNOM}
                    style={{ width: '100%' }}
                    placeholder="Ingrese el nombre del paciente"
                  />
                </Form.Item>
              </Col>
            </>
          )}
          {
            paciente ?
              <>
                <Col xs={6} style={{ padding: '0 0 8px 0' }}>
                  NOMBRES:
                </Col>
                <Col xs={18} style={{ padding: '0 0 8px 0' }}>
                  {paciente ? paciente.nom_cli : null}
                </Col>
                <Col xs={6} style={{ padding: '0 0 8px 0' }}>
                  APELLIDOS:
                </Col>
                <Col xs={18} style={{ padding: '0 0 8px 0' }}>
                  {paciente ? paciente.ape_pat_cli + ' ' + paciente.ape_mat_cli : null}
                </Col>
                <Col xs={6} style={{ padding: '0 0 8px 0' }}>
                  DNI:
                </Col>
                <Col xs={18} style={{ padding: '0 0 8px 0' }}>
                  {paciente ? paciente.num_documento : null}
                </Col>
                <Col xs={6} style={{ padding: '0 0 8px 0' }}>
                  SEXO:
                </Col>
                <Col xs={18} style={{ padding: '0 0 8px 0' }}>
                  {paciente ? paciente.sexo_cli === 'F' ? 'FEMENINO' : 'MASCULINO' : null}
                </Col>
              </>
              : null
          }
          {/* <Col xs={6} style={{ padding: '20px 0 10px 0', display: 'flex', alignItems: 'center' }}>
            <div>Días:</div>
          </Col>
          <Col xs={18} style={{ padding: '20px 0 10px 0' }}>
            <Form.Item name="dias" style={{ margin: 0, padding: 0 }} >
              <Input type="number" placeholder="Días" />
            </Form.Item>
          </Col> */}
          <Col xs={6} style={{ padding: '10px 0 20px 0', display: 'flex', alignItems: 'center' }}>
            <div>Especialidad:</div>
          </Col>
          <Col xs={18} style={{ padding: '10px 0 20px 0' }}>
            <Form.Item name="especialidad" style={{ margin: 0, padding: 0 }}>
              <Select
                showSearch
                placeholder="Especialidad"
                onChange={() => { console.log('asdasd'); }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {
                  especialidades ?
                    especialidades.map((element) => {
                      return (
                        <Select.Option key={element.id_consultorio} value={element.descripcion}>
                          {element.descripcion}
                        </Select.Option>
                      );
                    })
                    : null
                }
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalAgregar;
