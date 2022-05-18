import React, { useState, useEffect, createRef } from 'react';
import { Radio, Col, Modal, Row, Form, Input, Select } from 'antd';
import { httpClient } from '../../../util/Api';
import { notificaciones } from '../../../util/util';

//TODO: validar el número de cama

//Imagenes
import HOSPI_V from '../../../assets/camas/HOSPI_V.png';
import HOSPI_F from '../../../assets/camas/HOSPI_F.png';
import HOSPI_M from '../../../assets/camas/HOSPI_M.png';
import UCI_V from '../../../assets/camas/UCI_V.png';
import UCI_F from '../../../assets/camas/UCI_F.png';
import UCI_M from '../../../assets/camas/UCI_M.png';
import UCIM_V from '../../../assets/camas/UCIM_V.png';
import UCIM_F from '../../../assets/camas/UCIM_F.png';
import UCIM_M from '../../../assets/camas/UCIM_M.png';

const ModalAgregar = ({ abrirModal, setAbrirModal, editar, tipo, traerPisos, traerHabitaciones, traerCamas, habitaciones, pisos }) => {

  const [loading, setLoading] = useState(false);
  const [array, setArray] = useState([]);
  const [piso, setPiso] = useState({
    codMedico: JSON.parse(sessionStorage.getItem('token')).cod_medico,
    nombre: ""
  });
  const [habitacion, setHabitacion] = useState({
    codMedico: JSON.parse(sessionStorage.getItem('token')).cod_medico,
    nombre: "",
    pisoId: ""
  });
  const [cama, setCama] = useState({
    codMedico: JSON.parse(sessionStorage.getItem('token')).cod_medico,
    numero: "",
    habitacionId: "",
    tipo: ""
  });

  const formRef = createRef();

  //* Agregar
  const guardarPiso = async (body) => {
    const repuesta = await httpClient.post('camas/createPiso', body);
    return repuesta.data;
  };

  const guardarHabitacion = async (body) => {
    const repuesta = await httpClient.post('camas/createHabitacion', body);
    return repuesta.data;
  };

  const guardarCama = async (body) => {
    const repuesta = await httpClient.post('camas/createCama', body);
    return repuesta.data;
  };

  //* Editar
  const editarPiso = async (body) => {
    const repuesta = await httpClient.post('camas/editPiso', body);
    return repuesta.data;
  };

  const editarHabitacion = async (body) => {
    const repuesta = await httpClient.post('camas/editHabitacion', body);
    return repuesta.data;
  };

  const editarCama = async (body) => {
    const repuesta = await httpClient.post('camas/editCama', body);
    return repuesta.data;
  };

  const onChange = e => {
    setCama({ ...cama, tipo: e.target.value.toString() });
  };

  const onChangePiso = (e) => {
    pisos.forEach((element) => {
      if (element.piso_id === e) {
        setHabitacion({
          ...habitacion,
          pisoId: element.piso_id.toString(),
        });
        formRef.current.setFieldsValue({
          pisoId: element.piso_id,
          habitacionId: null
        });
      }
    });
    const arr = habitaciones.filter(element => element.piso_id === e);
    setArray(arr);
  };

  const onChangeHabitación = (e) => {
    habitaciones.forEach((element) => {
      console.log(element);
      if (element.key === e) {
        setCama({
          ...cama,
          habitacionId: element.habitacion_id.toString(),
        });
        formRef.current.setFieldsValue({
          habitacionId: element.habitacion_id
        });
      }
    });
  };

  useEffect(() => {
    console.log(editar);
    if (editar) {
      if (tipo === 'piso') {
        setPiso({
          ...editar,
          pisoId: editar.piso_id
        });
        formRef.current.setFieldsValue({
          nombre: editar.nombre_piso
        });
      } else if (tipo === 'habitacion') {
        setHabitacion({
          ...editar,
          pisoId: editar.piso_id,
          habitacionId: editar.habitacion_id
        });
        formRef.current.setFieldsValue({
          nombre: editar.nombre_habitacion,
          pisoId: editar.piso_id
        });
      } else if (tipo === 'cama') {
        const arr = habitaciones.filter(element => element.piso_id === editar.piso_id);
        setArray(arr);
        setCama({
          ...editar,
          camaId: editar.cama_id,
          habitacionId: editar.habitacion_id
        });
        formRef.current.setFieldsValue({
          numero: editar.numero,
          tipo: editar.tipo,
          pisoId: editar.piso_id,
          habitacionId: editar.habitacion_id
        });
      }
    }
  }, []);

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
            {
              tipo === 'piso' ?
                editar ?
                  'Editar Piso'
                  : 'Agregar Piso'
                : tipo === 'habitacion' ?
                  editar ?
                    'Editar Habitación'
                    : 'Agregar Habitación'
                  : tipo === 'cama' ?
                    editar ?
                      'Editar Cama'
                      : 'Agregar Cama'
                    : null
            }
          </div>
        </div>
      }
      visible={abrirModal}
      onOk={async () => {
        var validator = false;
        if (tipo === 'piso') {
          if (piso.nombre.length > 0) {
            validator = true;
          }
        } else if (tipo === 'habitacion') {
          if (habitacion.nombre.length > 0 && habitacion.pisoId.length > 0) {
            validator = true;
          }
        } else if (tipo === 'cama') {
          if (cama.numero.length > 0 && cama.tipo.length > 0 && cama.habitacionId.length > 0) {
            validator = true;
          }
        }
        if (validator) {
          var respuesta = {};
          if (editar) {
            if (tipo === 'piso') {
              setLoading(true);
              respuesta = await editarPiso(piso);
            } else if (tipo === 'habitacion') {
              setLoading(true);
              respuesta = await editarHabitacion(habitacion);
            } else if (tipo === 'cama') {
              setLoading(true);
              respuesta = await editarCama(cama);
            }
          } else {
            if (tipo === 'piso') {
              setLoading(true);
              respuesta = await guardarPiso(piso);
            } else if (tipo === 'habitacion') {
              setLoading(true);
              respuesta = await guardarHabitacion(habitacion);
            } else if (tipo === 'cama') {
              setLoading(true);
              respuesta = await guardarCama(cama);
            }
          }
          if (respuesta.success) {
            await traerPisos();
            await traerHabitaciones();
            await traerCamas();
            setLoading(false);
            setAbrirModal(false);
            notificaciones('Completado!');
          } else {
            notificaciones('Algo salió mal', 'Alerta');
            setLoading(false);
          }
        } else {
          notificaciones('Debe llenar todos los campos', 'Alerta');
        }
      }}
      onCancel={() => setAbrirModal(false)}
    >
      <Form ref={formRef} layout="vertical">
        <Row style={{ flexDirection: 'row' }}>
          {
            tipo === 'piso' ?
              <>
                <Col xs={24}>
                  <Form.Item name="nombre" label="Nombre">
                    <Input
                      placeholder="Nombre del piso"
                      onChange={(e) => { setPiso({ ...piso, nombre: e.target.value }) }}
                    />
                  </Form.Item>
                </Col>
              </>
              : tipo === 'habitacion' ?
                <>
                  <Col xs={24}>
                    <Form.Item name="nombre" label="Nombre">
                      <Input
                        placeholder="Nombre de la habitacion"
                        onChange={(e) => { setHabitacion({ ...habitacion, nombre: e.target.value }) }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="pisoId" label="Piso">
                      <Select
                        style={{ width: '100% ' }}
                        showSearch
                        placeholder="Seleccione un Piso"
                        optionFilterProp="children"
                        onChange={onChangePiso}
                        onSearch={() => { }}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {
                          pisos.map((element) => {
                            return < Select.Option key={element.key} value={element.piso_id}>{element.nombre_piso}</Select.Option>;
                          })
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                </>
                : tipo === 'cama' ?
                  <>
                    <Col xs={24}>
                      <Form.Item name="numero" label="Número de cama">
                        <Input
                          placeholder="Número de cama"
                          type="number"
                          onChange={(e) => { setCama({ ...cama, numero: e.target.value }) }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={14}>
                      <Form.Item name="tipo" label="Tipo de cama">
                        <Radio.Group onChange={onChange} value={cama.tipo}>
                          <Radio value={'HOSPI'}>HOSPI</Radio>
                          <Radio value={'UCI'}>UCI</Radio>
                          <Radio value={'UCIM'}>UCIM</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col xs={10} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                      {
                        cama.tipo === 'HOSPI' ? (
                          cama.genero === 'F' ? (
                            <img src={HOSPI_F} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                          ) : cama.genero === 'M' ? (
                            <img src={HOSPI_M} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                          ) : (
                            <img src={HOSPI_V} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                          )
                        ) : cama.tipo === 'UCI' ? (
                          cama.genero === 'F' ? (
                            <img src={UCI_F} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                          ) : cama.genero === 'M' ? (
                            <img src={UCI_M} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                          ) : (
                            <img src={UCI_V} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                          )
                        ) : cama.tipo === 'UCIM' ? (
                          cama.genero === 'F' ? (
                            <img src={UCIM_F} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                          ) : cama.genero === 'M' ? (
                            <img src={UCIM_M} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                          ) : (
                            <img src={UCIM_V} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                          )
                        ) : (
                          <img src={HOSPI_V} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                        )
                        // cama.tipo === "HOSPI" ?
                        //   <img src={HOSPI_M} alt="HOSPI" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                        //   : cama.tipo === "UCI" ?
                        //     <img src={UCI_M} alt="UCI" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                        //     : cama.tipo === "UCIM" ?
                        //       <img src={UCIM_M} alt="UCIM" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                        //       :
                        //       <img src={HOSPI_V} alt="VACIO" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                      }
                    </Col>
                    <Col sm={11} xs={24}>
                      <Form.Item name="pisoId" label="Piso">
                        <Select
                          style={{ width: '100% ' }}
                          showSearch
                          placeholder="Seleccione un piso"
                          optionFilterProp="children"
                          onChange={onChangePiso}
                          onSearch={() => { }}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {
                            pisos.map((element) => {
                              return < Select.Option value={element.piso_id}>{element.nombre_piso}</Select.Option>;
                            })
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col sm={13} xs={24}>
                      <Form.Item name="habitacionId" label="Habitación">
                        <Select
                          style={{ width: '100% ' }}
                          showSearch
                          placeholder="Seleccione una habitación "
                          optionFilterProp="children"
                          onChange={onChangeHabitación}
                          onSearch={() => { }}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {
                            array.map((element) => {
                              return < Select.Option value={element.habitacion_id}>{element.nombre_habitacion}</Select.Option>;
                            })
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                  </>
                  : null
          }
        </Row>
      </Form>
    </Modal >
  );
};

export default ModalAgregar;
