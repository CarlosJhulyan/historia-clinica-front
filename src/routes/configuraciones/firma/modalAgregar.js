import React, { useState, createRef, useEffect } from 'react';
import { Col, Modal, Row, Form, AutoComplete, Button } from 'antd';
import { DeleteOutlined } from "@ant-design/icons";
import { httpClient } from '../../../util/Api';
import { baseUrlImage } from '../../../config/backend';
import { notificaciones } from '../../../util/util';
import axios from 'axios';

const ModalAgregar = ({ abrirModal, setAbrirModal, filaActual, traerData }) => {
  const formRef = createRef();

  const [loading, setLoading] = useState(false);

  const [medico, setMedico] = useState();
  const [valueCOD, setValueCOD] = useState('');
  const [optionsCOD, setOptionsCOD] = useState([]);
  const [valueNOM, setValueNOM] = useState('');
  const [optionsNOM, setOptionsNOM] = useState([]);

  const [hover, setHover] = useState(false);
  const [imagenURL, setImagenURL] = useState(null);
  const [imagen, setImagen] = useState(null);

  const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());
  const [peticion, setPeticion] = useState(false);

  const registrarFirma = async () => {
    const data = new FormData();
    data.append('cod_med', filaActual ? filaActual.cod_med : medico.cod_medico);
    data.append('imagen', imagen);
    var respuesta = {};
    if (filaActual != null) {
      respuesta = await httpClient.post('firmas/updateFirma', data);
    } else {
      respuesta = await httpClient.post('firmas/createFirma', data);
    }
    return respuesta.data;
  };

  const onSearchCOD = async searchText => {
    var cmp = formRef.current.getFieldValue('num_cmp');
    if (cmp ? cmp.length >= 4 : false) {
      setPeticion(true);
      setOptionsCOD();
      const respuesta = await httpClient.post(
        'modulos/getDataMedicos',
        {
          num_cmp: cmp,
          des_nom_medico: '',
        },
        { cancelToken: cancelSource.token }
      );
      var array1 = respuesta.data.data;
      for (let i = 0; i < array1.length; i++) {
        array1[i].key = array1[i].cod_medico;
        array1[i].value = array1[i].cod_medico;
        array1[i].label = array1[i].num_cmp;
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
    var nombre = formRef.current.getFieldValue('des_nom_medico');
    if (nombre ? nombre.length >= 4 : false) {
      setPeticion(true);
      setOptionsNOM();
      const respuesta = await httpClient.post(
        'modulos/getDataMedicos',
        {
          num_cmp: '',
          des_nom_medico: nombre,
        },
        { cancelToken: cancelSource.token }
      );
      var array2 = respuesta.data.data;
      for (let i = 0; i < array2.length; i++) {
        array2[i].key = array2[i].cod_medico;
        array2[i].value = array2[i].cod_medico;
        array2[i].label = (
          <div>
            {array2[i].des_nom_medico}
            <div style={{ color: '#a3a3a3' }}>{' ' + array2[i].des_ape_medico}</div>
          </div>
        );
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
          num_cmp: element.num_cmp,
          des_nom_medico: `${element.des_nom_medico + ' ' + element.des_ape_medico}`,
        });
        setMedico(element);
        setValueCOD(data);
      }
    });
  };

  const onSelectNOM = data => {
    optionsNOM.forEach(element => {
      if (element.key === data) {
        formRef.current.setFieldsValue({
          num_cmp: element.num_cmp,
          des_nom_medico: `${element.des_nom_medico + ' ' + element.des_ape_medico}`,
        });
        setMedico(element);
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

  const handleFile = event => {
    setImagenURL(URL.createObjectURL(event.target.files[0]));
    setImagen(event.target.files[0]);
  }

  function changeBackgroundHover(e) {
    e.target.style.background = 'rgba(0,0,0,0.3)';
    setHover(true);
  }

  function changeBackgroundLeave(e) {
    e.target.style.background = 'rgba(255,255,255,0)';
    setHover(false);
  }

  const hiddenFileInput = React.useRef(null);

  useEffect(() => {
    if (filaActual != null) {
      if (filaActual.url_firma != null) {
        setImagenURL(`${baseUrlImage}/${filaActual.url_firma}`);
        formRef.current.setFieldsValue({
          num_cmp: filaActual.cod_med
        })
      }
    }
  }, [filaActual]);

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
            {filaActual ? 'Editar Firma' : 'Agregar Firma'}
          </div>
        </div>
      }
      visible={abrirModal}
      onOk={async () => {
        var validator = false;
        const nombre = formRef.current.getFieldValue('num_cmp');
        const img = imagen;
        if (nombre ? nombre.length > 0 : false && img ? img.length > 0 : false) {
          validator = true;
        }
        if (validator) {
          setLoading(true);
          const respuesta = await registrarFirma();
          if (respuesta.success) {
            setLoading(false);
            setAbrirModal(false);
            notificaciones('Completado!');
            await traerData();
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
          {filaActual ? null : (
            <>
              <Col xs={6} style={{ padding: '20px 0 10px 0', display: 'flex', alignItems: 'center' }}>
                <div>CMP del médico:</div>
              </Col>
              <Col xs={18} style={{ padding: '20px 0 10px 0' }}>
                <Form.Item name="num_cmp" style={{ margin: 0, padding: 0 }}>
                  <AutoComplete
                    value={valueCOD}
                    options={optionsCOD}
                    onSearch={onSearchCOD}
                    onSelect={onSelectCOD}
                    onChange={onChangeCOD}
                    style={{ width: '100%' }}
                    placeholder="Ingrese el CMP"
                  />
                </Form.Item>
              </Col>
              <Col xs={6} style={{ padding: '20px 0 20px 0', display: 'flex', alignItems: 'center' }}>
                <div>Nombre del médico:</div>
              </Col>
              <Col xs={18} style={{ padding: '20px 0 20px 0' }}>
                <Form.Item name="des_nom_medico" style={{ margin: 0, padding: 0 }}>
                  <AutoComplete
                    value={valueNOM}
                    options={optionsNOM}
                    onSearch={onSearchNOM}
                    onSelect={onSelectNOM}
                    onChange={onChangeNOM}
                    style={{ width: '100%' }}
                    placeholder="Ingrese el nombre del medico"
                  />
                </Form.Item>
              </Col>
            </>
          )}

          <Col xs={6} style={{ padding: '20px 0 10px 0', display: 'flex', alignItems: 'center' }}>
            <div>Firma:</div>
          </Col>
          <Col xs={18} style={{ padding: '20px 0 10px 0' }}>
            <Form.Item name="imagen" style={{ margin: 0, padding: 0 }} >
              {imagenURL == null ?
                <>
                  <input
                    style={{ display: 'none' }}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFile}
                    ref={hiddenFileInput}
                  />
                  <Button
                    style={{ height: '70px', width: '200px', whiteSpace: 'break-spaces', textAlign: 'center', lineHeight: '20px' }}
                    onClick={() => hiddenFileInput.current.click()}
                  >
                    Subir imagen
                  </Button>
                </>
                :
                <div style={{ height: "70px", width: "200px", position: 'relative' }} onClick={() => { setImagenURL(null) }}>

                  <div
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      bottom: '-2px',
                      left: '-2px',
                      right: '-2px',
                      margin: 'auto',
                      width: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center', textAlign: 'center'
                    }}
                    onMouseOver={changeBackgroundHover}
                    onMouseLeave={changeBackgroundLeave}
                  >
                    {hover ?
                      <DeleteOutlined style={{ color: 'white', fontSize: '20px', cursor: 'pointer', padding: '10px', borderRadius: '20px' }} />
                      :
                      null
                    }
                  </div>
                  <img src={imagenURL} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt='imagen' />
                </div>
              }
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalAgregar;
