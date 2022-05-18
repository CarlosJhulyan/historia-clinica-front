import React, { useState, useEffect, createRef } from 'react';
import { Radio, Col, Modal, Row, Form, Input, Select } from 'antd';
import { httpClient } from '../../util/Api';
import { notificaciones } from '../../util/util';

//Imagenes
import HOSPI_V from '../../assets/camas/HOSPI_V.png';
import HOSPI_F from '../../assets/camas/HOSPI_F.png';
import HOSPI_M from '../../assets/camas/HOSPI_M.png';
import UCI_V from '../../assets/camas/UCI_V.png';
import UCI_F from '../../assets/camas/UCI_F.png';
import UCI_M from '../../assets/camas/UCI_M.png';
import UCIM_V from '../../assets/camas/UCIM_V.png';
import UCIM_F from '../../assets/camas/UCIM_F.png';
import UCIM_M from '../../assets/camas/UCIM_M.png';

const ModalTransferir = ({ abrirModal, setAbrirModal, traerData, dataModal }) => {

  const [loading, setLoading] = useState(false);
  const [array, setArray] = useState([]);
  const [pisos, setPisos] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [piso, setPiso] = useState({
    nombre: "",
  });
  const [habitacion, setHabitacion] = useState({
    nombre: "",
    pisoId: ""
  });
  const [cama, setCama] = useState({
    numero: "",
    habitacionId: "",
    tipo: ""
  });

  const formRef = createRef();

  //* Transferir
  const transferirCama = async (body) => {
    const repuesta = await httpClient.post('camas/transferirCama', body);
    return repuesta.data;
  };

  //* Obtener
  const traerPisos = async () => {
    const respuesta = await httpClient.get('camas/getPisos');
    respuesta.data.data.forEach((data) => {
      data.key = data.piso_id;
    })
    setPisos(respuesta.data.data);
  };

  const traerHabitaciones = async () => {
    const respuesta = await httpClient.get('camas/getHabitaciones');
    respuesta.data.data.forEach((data) => {
      data.key = data.habitacion_id;
    })
    setHabitaciones(respuesta.data.data);
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
    traerPisos();
    traerHabitaciones();
  }, [])

  useEffect(() => {
    if (dataModal) {
      console.log(dataModal);
      const arr = habitaciones.filter(element => element.piso_id === dataModal.piso_id);
      setArray(arr);
      setCama({
        ...dataModal,
        camaId: dataModal.cama_id,
        habitacionId: dataModal.habitacion_id,
        habitacionId_anterior: dataModal.habitacion_id,
        habitacion_anterior: dataModal.nombre_habitacion,
        piso_anterior: dataModal.nombre_piso
      });
      formRef.current.setFieldsValue({
        numero: dataModal.numero,
        tipo: dataModal.tipo,
        pisoId: dataModal.piso_id,
        habitacionId: dataModal.habitacion_id
      });
    }
  }, [habitaciones, piso, dataModal]);

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
            Transferir Cama
          </div>
        </div>
      }
      visible={abrirModal}
      onOk={async () => {
        var validator = false;
        if (cama.tipo.length > 0 && cama.habitacionId.length > 0) {
          validator = true;
        }
        if (validator) {
          var respuesta = {};
          setLoading(true);
          const body = {
            camaId: cama.cama_id,
            tipo: cama.tipo,
            habitacionId_anterior: cama.habitacion_id,
            habitacionId: cama.habitacionId,
            habitacion_anterior: cama.habitacion_anterior,
            piso_anterior: cama.piso_anterior,
            codMedico: JSON.parse(sessionStorage.getItem('token')).cod_medico
          }
          respuesta = await transferirCama(body);
          if (respuesta.success) {
            await traerData(dataModal.piso_id, dataModal.habitacion_id);
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
                cama.genero ?
                  cama.genero.toUpperCase() === 'F' ? (
                    <img src={HOSPI_F} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                  ) : cama.genero.toUpperCase() === 'M' ? (
                    <img src={HOSPI_M} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                  ) : (
                    <img src={HOSPI_V} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                  ) : (
                    <img src={HOSPI_V} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                  )
              ) : cama.tipo === 'UCI' ? (
                cama.genero ?
                  cama.genero.toUpperCase() === 'F' ? (
                    <img src={UCI_F} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                  ) : cama.genero.toUpperCase() === 'M' ? (
                    <img src={UCI_M} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                  ) : (
                    <img src={UCI_V} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                  ) : (
                    <img src={UCI_V} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                  )
              ) : cama.tipo === 'UCIM' ? (
                cama.genero ?
                  cama.genero.toUpperCase() === 'F' ? (
                    <img src={UCIM_F} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                  ) : cama.genero.toUpperCase() === 'M' ? (
                    <img src={UCIM_M} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                  ) : (
                    <img src={UCIM_V} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                  ) : (
                    <img src={UCIM_V} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
                  )
              ) : (
                <img src={HOSPI_V} alt="cama vacía" style={{ width: '70px', height: '70px', marginRight: '30px' }} />
              )
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
        </Row>
      </Form>
    </Modal >
  );
};

export default ModalTransferir;
