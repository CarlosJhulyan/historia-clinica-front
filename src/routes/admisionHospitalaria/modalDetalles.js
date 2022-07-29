import { Col, DatePicker, Form, Input, Modal, Row, Select, Spin, Divider, Switch, Radio } from 'antd';
import React, { createRef, useCallback, useEffect, useMemo, useState } from 'react';
import { DNI_REGEX, EDAD_REGEX, TELEFONO_REGEX, TEXTO_REGEX, CORREO_REGEX } from '../../util/constants';
import moment from 'moment';
import { httpClient } from '../../util/Api';
import { getDepartamentos, getProvincias, getDistritos } from '../../util/Ubigeo';
import { useDispatch, useSelector } from 'react-redux';
import { setDataGlobal } from '../../appRedux/actions/dataGlobal';

const obtenerValores = modulos => {
  const valores = [];
  for (const key in modulos) {
    if (Object.hasOwnProperty.call(modulos, key)) {
      // const element = modulos[key];
      valores.push(key.toString());
    }
  }
  return valores;
};

const ModaDetalles = (props) => {
  const { abrirModal, setAbrirModal, filaActual, handleDatos, setModalAsignacion, setHospi } = props;
  const formatoFecha = 'DD-MM-YYYY';
  const { Option } = Select;
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
  const [estado, setEstado] = useState({});
  const [paciente, setDataPaciente] = useState();
  const [estadoAnterior, setEstadoAnterior] = useState();
  const [botonModal, setBotonModal] = useState(true);
  const [switchEditar, setSwitchEditar] = useState(false);
  const [tipoPariente, setTipoPariente] = useState([]);

  const [nuevoAlergia, setNuevoAlergia] = useState(true);

  const [valores, setValores] = useState(filaActual ? obtenerValores(filaActual.modulos) : []);

  const dispatch = useDispatch();

  const formRef = createRef();

  const onChange = e => {
    console.log(valores);
    setValores(e);
  };

  console.log('estado', estado);
  console.log('filaActual', filaActual);

  const datosPaciente = useMemo(() => {
    return {
      codGrupoCia: '001',
      codPaciente: filaActual.cod_paciente,
    };
  }, [filaActual]);

  const handleChangeNombrePaciente = (e) => setEstado({ ...estado, PACIENTE: e.target.value });
  const handleChangeDni = (e) => {
    if (e.target.value.length < 9) {
      formRef.current.setFieldsValue({ NUM_DOCUMENTO: e.target.value });
      setEstado({ ...estado, NUM_DOCUMENTO: e.target.value });
    } else {
      formRef.current.setFieldsValue({ NUM_DOCUMENTO: estado.NUM_DOCUMENTO });
    }
  };
  const handleChangeDniFamiliar = (e) => {
    const dniFamiliar = e.target.value;
    if (dniFamiliar.length < 9) {
      formRef.current.setFieldsValue({ dniFamiliar });
      setEstado({ ...estado, dniFamiliar });
    } else {
      formRef.current.setFieldsValue({ dniFamiliar: estado.dniFamiliar });
    }
  };
  const handleChangeFechaNacimiento = (e) => setEstado({ ...estado, FECHA_NAC_CLI: e });
  const handleChangeEdad = (e) => {
    const EDAD = e.target.value;
    if (EDAD.length < 4) {
      formRef.current.setFieldsValue({ EDAD });
      setEstado({ ...estado, EDAD });
    } else {
      formRef.current.setFieldsValue({ EDAD: estado.EDAD });
    }
  };
  const handleChangeSexo = (e) => setEstado({ ...estado, SEXO_CLI: e });
  const handleChangeNombreFamiliar = (e) => setEstado({ ...estado, NOM_ACOM: e.target.value });
  const handleChangeTipoAcom = (e) => setEstado({ ...estado, parentesco: e.target.value });
  const handleChangeTelefono = (e) => {
    const FONO_CLI = e.target.value;
    if (FONO_CLI.length < 10) {
      formRef.current.setFieldsValue({ FONO_CLI });
      setEstado({ ...estado, FONO_CLI });
    } else {
      formRef.current.setFieldsValue({ FONO_CLI: estado.FONO_CLI });
    }
  };
  const handleChangeEditar = (e) => {
    setSwitchEditar(e);
  };

  const traerDatosPaciente = useCallback(async () => {
    //jhonatan
    const acomp = {
      codGrupoCia: '001',
    };
    const respuesta = await httpClient.post('/pacientes/getTipoAcomp', acomp);
    console.log('respuesta', respuesta);
    setTipoPariente(respuesta.data.data);
    try {
      const { data } = await httpClient.post(`/pacientes/getPaciente`, datosPaciente);
      console.log("PPPPPPPPPPPPPP:", data.data);

      /* CODIGO LOCAL */
      data.data.COD_LOCAL_ANTECENDENTE = data.data.COD_LOCAL_ANTECENDENTE === null ? '001' : data.data.COD_LOCAL_ANTECENDENTE;
      data.data.SECUENCIA_ANTECEDENTE = data.data.SECUENCIA_ANTECEDENTE === null ? '0' : data.data.SECUENCIA_ANTECEDENTE;
      /* CODIGO LOCAL */

      const alergias = await obtenerAlergia(data.data);
      const estado = await obtenerEstado(data.data);
      if (alergias !== null) {
        if (estado !== null) {
          setEstado({
            ...filaActual,
            ...data.data,
            alergias: alergias[0].alergias,
            otros: alergias[0].otros,
            id_hospitalizacion: estado[0].id_hospitalizacion,
            estado: estado[0].hospitalizacion === "1" ? "HOSPI" : estado[0].urgencia === "1" ? "URGE" : null,
            FEC_NAC_CLI: moment(data.data.FEC_NAC_CLI, formatoFecha),
          });
        } else {
          setEstado({
            ...filaActual,
            ...data.data,
            alergias: alergias[0].alergias,
            otros: alergias[0].otros,
            FEC_NAC_CLI: moment(data.data.FEC_NAC_CLI, formatoFecha),
          });
        }
      } else {
        if (estado !== null) {
          setEstado({
            ...filaActual,
            ...data.data,
            id_hospitalizacion: estado[0].id_hospitalizacion,
            estado: estado[0].hospitalizacion === "1" ? "HOSPI" : estado[0].urgencia === "1" ? "URGE" : null,
            FEC_NAC_CLI: moment(data.data.FEC_NAC_CLI, formatoFecha),
          });
        } else {
          setEstado({
            ...filaActual,
            ...data.data,
            FEC_NAC_CLI: moment(data.data.FEC_NAC_CLI, formatoFecha),
          });
        }
      }
      setDataPaciente(data.data);
      setBotonModal(false);
    } catch (e) {
      setDataPaciente(null);
    }
  }, [datosPaciente, filaActual]);

  console.log('log', estado);

  useEffect(() => {
    if (abrirModal) {
      if (paciente === undefined) {
        traerDatosPaciente();
      }
    }
  }, [abrirModal, paciente, traerDatosPaciente]);

  // Obtener Hospitalizacion
  const obtenerEstado = async (sss) => {
    const dd = {
      historiaClinica: filaActual.NUM_ATEN_MED,
      codPaciente: filaActual.COD_PACIENTE,
    };

    const respuesta = await httpClient.post('/pacientes/getHospitalizacion', dd);

    console.log('Alergia', respuesta);

    if (respuesta.data.data.length > 0) {
      setNuevoAlergia(false);
      console.log('DATAAAAAAAAA', respuesta.data.data);
      // setHospi(respuesta.data.data);
      setEstadoAnterior(respuesta.data.data);
      return respuesta.data.data;
    }
    return null;
  };

  // Guardar Hospitalizacion
  const guardarEstado = async () => {
    const id = formRef.current.getFieldValue('id_hospitalizacion');
    const estadoForm = formRef.current.getFieldValue('estado');
    var hospi = "0";
    var urge = "0";

    if (estadoForm === "HOSPI" || estadoForm === "HOSPI") {
      hospi = "1";
    }
    if (estadoForm === "URGE" || estadoForm === "URGE") {
      urge = "1";
    }

    let est = { ...estado, estado: [hospi === "1" ? "HOSPI" : null, urge === "1" ? "URGE" : null] };

    if (nuevoAlergia) {
      const nuevo = {
        codGrupoCia: estado.COD_GRUPO_CIA,
        codPaciente: estado.COD_PACIENTE,
        historiaClinica: estado.NUM_ATEN_MED,
        hospitalizacion: hospi,
        urgencia: urge
      };
      httpClient.post('/pacientes/setHospitalizacion', nuevo).then((respuesta) => {
        // if (respuesta.data.success) {
        // 	est = { ...estado, alergias: alerg, otros };
        // 	// setEstado({ ...estado, alergias: alerg, otros });
        // }
        console.log(respuesta);
      });
    } else {
      const editar = {
        id,
        hospitalizacion: hospi,
        urgencia: urge
      };
      console.log(editar);
      httpClient.post('/pacientes/updateHospitalizacion', editar).then((respuesta) => {
        // if (respuesta.data.success) {
        // 	est = { ...estado, alergias: alerg, otros };
        // 	setEstado({ ...estado, alergias: alerg, otros });
        // }
        console.log(respuesta);
      });
    }
    handleDatos({ estado: est });

    /* "0000128101", */

    const dataGlobal = {
      codGrupoCia: estado.COD_GRUPO_CIA,
      codLocal: estado.COD_LOCAL_ANTECENDENTE === null ? '001' : estado.COD_LOCAL_ANTECENDENTE,
      codCia: estado.COD_GRUPO_CIA,
      nroAtencion: estado.NUM_ATEN_MED, //
      codPaciente: estado.COD_PACIENTE,
      secuenciaAntecedente: estado.SECUENCIA_ANTECEDENTE === null ? '0' : estado.SECUENCIA_ANTECEDENTE,
    };

    dispatch(setDataGlobal(dataGlobal))
    if (estadoAnterior) {
      if (estadoAnterior[0].asignado !== "1") {
        if (hospi === "1") {
          setHospi({
            historia_clinica: estado.NUM_ATEN_MED,
          });
          setModalAsignacion(true);
        }
      }
    } else {
      if (hospi === "1") {
        setHospi({
          historia_clinica: estado.NUM_ATEN_MED,
        });
        setModalAsignacion(true);
      }
    }
  };

  // Obtener Alergias
  const obtenerAlergia = async (sss) => {
    const dd = {
      codGrupoCia: sss.COD_GRUPO_CIA,
      codPaciente: sss.COD_PACIENTE,
    };

    const respuesta = await httpClient.post('/pacientes/getAlergias', dd);

    console.log('Alergia', respuesta);

    if (respuesta.data.data.length > 0) {
      return respuesta.data.data;
    }
    return null;
  };

  return (
    <>
      <Modal
        width="70%"
        okText="Guardar cambios"
        cancelText="Cancelar"
        okType='default'
        okButtonProps={{
          style: {background:themeSettingsGlobal.COD_COLOR_1, color: '#fff', border:'none'}
        }}
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
            <div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px' }}>Datos del paciente:</div>
            <div
              style={{
                gridArea: '1 / 2 / 2 / 3',
                display: 'flex',
                flexDirection: 'row-reverse',
              }}
            >
              Historia clinica: {estado.NUM_ATEN_MED}
            </div>
          </div>
        }
        visible={abrirModal}
        onOk={async () => {
          guardarEstado();
        }}
        okButtonProps={{
          disabled: botonModal,
        }}
        onCancel={() => setAbrirModal(false)}
      >
        {paciente === undefined ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spin tip="Cargando" />
          </div>
        ) : (
          <Form ref={formRef} layout="vertical" initialValues={estado}>
            <Row
              style={{
                flexDirection: 'row',
                marginTop: -15,
                marginBottom: 15,
              }}
            >
              <Col lg={5} md={10} sm={8} xs={24}>
                <Form.Item
                  name="COD_TIP_DOCUMENTO"
                  label="Tipo de documento"
                  rules={[
                    {
                      required: false,
                      message: 'Seleccione el tipo de documento',
                    },
                  ]}
                >
                  <Select
                    placeholder="Seleccione"
                    // onChange={handleChangeTipoDocumento}
                    disabled
                  >
                    <Option value="01 ">L.E / DNI</Option>
                    <Option value="04 ">CARNET EXT.</Option>
                    <Option value="06 ">NO RECUERDA</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={6} md={7} sm={8} xs={24}>
                <Form.Item
                  name="NUM_DOCUMENTO"
                  label="DNI"
                  rules={[
                    {
                      required: false,
                      pattern: DNI_REGEX,
                      message: 'Ingrese un DNI válido',
                    },
                  ]}
                >
                  <Input
                    disabled
                    type="number"
                    placeholder="Ingrese el DNI"
                    onChange={handleChangeDni}
                    style={{ width: '100% ' }}
                  />
                </Form.Item>
              </Col>
              <Col lg={5} md={7} sm={12} xs={24}>
                <Form.Item
                  name="FEC_NAC_CLI"
                  label="Fecha de Nacimiento"
                  rules={[
                    {
                      required: false,
                      message: 'Ingrese una fecha de nacimiento',
                    },
                  ]}
                >
                  <DatePicker
                    disabled
                    placeholder="Ingrese la fecha"
                    className="gx-mb-3 gx-w-100"
                    onChange={handleChangeFechaNacimiento}
                    format={formatoFecha}
                  />
                </Form.Item>
              </Col>
              <Col lg={3} md={12} sm={8} xs={9}>
                <Form.Item
                  name="EDAD"
                  label="Edad"
                  rules={[
                    {
                      required: false,
                      pattern: EDAD_REGEX,
                      message: 'Ingrese una edad válida',
                    },
                  ]}
                >
                  <Input disabled type="number" onChange={handleChangeEdad} placeholder="35" />
                </Form.Item>
              </Col>
              <Col lg={5} md={12} sm={8} xs={15}>
                <Form.Item
                  name="SEXO_CLI"
                  label="Sexo"
                  rules={[
                    {
                      required: false,
                      message: 'Seleccione un sexo',
                    },
                  ]}
                >
                  <Select placeholder="Seleccione" onChange={handleChangeSexo} disabled>
                    <Option value="m">Hombre</Option>
                    <Option value="f">Mujer</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row
              style={{
                flexDirection: 'row',
                marginTop: -15,
                marginBottom: 15,
              }}
            >
              <Col lg={7} md={12} sm={12} xs={24}>
                <Form.Item
                  name="APE_PATERNO"
                  label="Apellido Paterno"
                  rules={[
                    {
                      required: false,
                      pattern: TEXTO_REGEX,
                      message: 'Ingrese un nombre válido',
                    },
                  ]}
                >
                  <Input
                    disabled
                    type="text"
                    placeholder="Ingrese el apellido paterno del paciente"
                  // onChange={handleChangeApellidoPaterno}
                  />
                </Form.Item>
              </Col>
              <Col lg={7} md={12} sm={12} xs={24}>
                <Form.Item
                  name="APE_MATERNO"
                  label="Apellido Materno"
                  rules={[
                    {
                      required: false,
                      pattern: TEXTO_REGEX,
                      message: 'Ingrese un nombre válido',
                    },
                  ]}
                >
                  <Input
                    disabled
                    type="text"
                    placeholder="Ingrese el apellido materno del paciente"
                  // onChange={handleChangeApellidoMaterno}
                  />
                </Form.Item>
              </Col>
              <Col lg={10} md={12} sm={12} xs={24}>
                <Form.Item
                  name="NOMBRE"
                  label="Nombres"
                  rules={[
                    {
                      required: false,
                      pattern: TEXTO_REGEX,
                      message: 'Ingrese un nombre válido',
                    },
                  ]}
                >
                  <Input
                    disabled
                    type="text"
                    placeholder="Ingrese los nombres del paciente"
                    onChange={handleChangeNombrePaciente}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row
              style={{
                flexDirection: 'row',
                marginTop: -15,
                marginBottom: 15,
              }}
            >
              <Col lg={4} md={12} sm={8} xs={24}>
                <Form.Item
                  name="ESTADO_CIVIL"
                  label="Estado civil"
                  rules={[
                    {
                      required: false,
                      message: 'Seleccione el tipo de documento',
                    },
                  ]}
                >
                  <Select
                    disabled
                    placeholder="Seleccione"
                  // onChange={handleChangeEstadoCivil}
                  >
                    <Option value="180">SOLTERO</Option>
                    <Option value="2">CASADO</Option>
                    <Option value="3">VIUDO</Option>
                    <Option value="4">DIVORCIADO</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={5} md={12} sm={12} xs={24}>
                <Form.Item
                  name="FONO_CLI"
                  label="Telefono"
                  rules={[
                    {
                      required: false,
                      pattern: TELEFONO_REGEX,
                      message: 'Ingrese un telefono válido',
                    },
                  ]}
                >
                  <Input
                    disabled
                    type="number"
                    onChange={handleChangeTelefono}
                    placeholder="912345678"
                    style={{ width: '100% ' }}
                  />
                </Form.Item>
              </Col>
              <Col lg={5} md={12} sm={12} xs={24}>
                <Form.Item
                  name="CELL_CLI"
                  label="Celular"
                  rules={[
                    {
                      required: false,
                      pattern: TELEFONO_REGEX,
                      message: 'Ingrese un celular válido',
                    },
                  ]}
                >
                  <Input
                    disabled
                    type="number"
                    // onChange={handleChangeTelefonoCelular}
                    placeholder="912345678"
                    style={{ width: '100% ' }}
                  />
                </Form.Item>
              </Col>
              <Col lg={10} md={12} sm={12} xs={24}>
                <Form.Item
                  name="EMAIL"
                  label="E-mail"
                  rules={[
                    {
                      required: false,
                      pattern: CORREO_REGEX,
                      message: 'Ingrese un nombre válido',
                    },
                  ]}
                >
                  <Input
                    disabled
                    type="text"
                    placeholder="Ingrese los nombres del paciente"
                  // onChange={handleChangeEmailPaciente}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row
              style={{
                flexDirection: 'row',
                marginTop: -15,
                marginBottom: 15,
              }}
            >
              <Col lg={4} md={12} sm={8} xs={24}>
                <Form.Item
                  name="DEP_UBIGEO"
                  label="Departamento"
                  rules={[
                    {
                      required: false,
                      message: 'Seleccione el departamento',
                    },
                  ]}
                >
                  <Select
                    disabled
                    showSearch
                    placeholder="Selecione un departamento"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {getDepartamentos().map((element) => {
                      return (
                        <Option key={element} value={element.ubigeo}>
                          {element.nombre}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={5} md={12} sm={12} xs={24}>
                <Form.Item
                  name="PRV_UBIGEO"
                  label="Provincia"
                  rules={[
                    {
                      required: false,
                      message: 'Seleccione una provincia',
                    },
                  ]}
                >
                  <Select
                    disabled
                    showSearch
                    placeholder="Selecione una provincia"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {getProvincias(estado.DEP_UBIGEO).map((element) => {
                      return (
                        <Option key={element} value={element.ubigeo}>
                          {element.nombre}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={7} md={12} sm={12} xs={24}>
                <Form.Item
                  name="DIS_UBIGEO"
                  label="Distrito"
                  rules={[
                    {
                      required: false,
                      message: 'Seleccione un distrito',
                    },
                  ]}
                >
                  <Select
                    disabled
                    showSearch
                    placeholder="Selecione un distrito"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {getDistritos(estado.PRV_UBIGEO).map((element) => {
                      return (
                        <Option key={element} value={element.ubigeo}>
                          {element.nombre}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={12} xs={24}>
                <Form.Item
                  name="DIR_CLI"
                  label="Dirección"
                  rules={[
                    {
                      pattern: TEXTO_REGEX,
                      message: 'Ingrese una dirección',
                    },
                  ]}
                >
                  <Input
                    disabled
                    type="text"
                    // onChange={handleChangeDireccion}
                    placeholder="Ingrese una dirección"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row
              style={{
                flexDirection: 'row',
                marginTop: -15,
                marginBottom: 15,
              }}
            >
              <Col lg={3} md={12} sm={8} xs={24}>
                <Form.Item
                  name="COD_TIP_ACOM"
                  label="Acompañante"
                  rules={[
                    {
                      required: false,
                      message: 'Seleccione el tipo de documento',
                    },
                  ]}
                >
                  <Select disabled placeholder="Seleccione" onChange={handleChangeTipoAcom}>
                    {tipoPariente.map((e) => (
                      <Option key={e.key} value={e.key}>
                        {e.DESCRIPCION}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={11} md={12} sm={12} xs={24}>
                <Form.Item
                  name="NOM_ACOM"
                  label="Nombre y Apellidos del acompañante"
                  rules={[
                    {
                      pattern: TEXTO_REGEX,
                      message: 'Ingrese un nombre válido',
                    },
                  ]}
                >
                  <Input
                    disabled
                    type="text"
                    onChange={handleChangeNombreFamiliar}
                    placeholder="Ingrese el nombre y apellidos del familiar"
                  />
                </Form.Item>
              </Col>
              <Col lg={5} md={12} sm={8} xs={24}>
                <Form.Item
                  name="COD_TIP_DOC_ACOM"
                  label="Tipo de documento"
                  rules={[
                    {
                      required: false,
                      message: 'Seleccione el tipo de documento',
                    },
                  ]}
                >
                  <Select
                    disabled
                    placeholder="Seleccione"
                  // onChange={handleChangeTipoDocumentoAcom}
                  >
                    <Option value="01 ">L.E / DNI</Option>
                    <Option value="04 ">CARNET EXT.</Option>
                    <Option value="06 ">NO RECUERDA</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={5} md={5} sm={12} xs={24}>
                <Form.Item
                  name="NUM_DOC_ACOM"
                  label="DNI"
                  rules={[
                    {
                      pattern: DNI_REGEX,
                      message: 'Ingrese un DNI válido',
                    },
                  ]}
                >
                  <Input
                    disabled
                    type="number"
                    placeholder="Ingrese el DNI del familiar"
                    onChange={handleChangeDniFamiliar}
                    style={{ width: '100% ' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row
              style={{
                flexDirection: 'row',
                marginTop: -15,
                marginBottom: 15,
              }}
            >
              <Form.Item
                name="id_alergia"
                label="id"
                hidden
                rules={[
                  {
                    required: false,
                    message: 'Seleccione la alergia',
                  },
                ]}
              >
                <Input disabled={!switchEditar} placeholder="Ingrese una alergia" />
              </Form.Item>
              <Col lg={8} md={10} sm={12} xs={24}>
                <Form.Item
                  name="alergias"
                  label="Alergias"
                  rules={[
                    {
                      required: false,
                      message: 'Seleccione la alergia',
                    },
                  ]}
                >
                  <Input disabled={!switchEditar} placeholder="Ingrese una alergia" />
                </Form.Item>
              </Col>
              <Col lg={16} md={14} sm={12} xs={24}>
                <Form.Item
                  name="otros"
                  label="Otros"
                  rules={[
                    {
                      required: false,
                      message: 'Ingrese otros',
                    },
                  ]}
                >
                  <Input disabled={!switchEditar} placeholder="Ingrese otros" />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="right">
              {/* <span style={{ fontWeight: 'normal' }}>Editar estado &nbsp;</span> */}
              {/* <Switch onChange={handleChangeEditar} /> */}
            </Divider>
            <Row
              style={{
                flexDirection: 'row', paddingTop: '15px'
              }}
            >
              <Form.Item
                name="id_hospitalizacion"
                hidden
              >
                <Input disabled={!switchEditar} placeholder="Ingrese una alergia" />
              </Form.Item>
              <Col xs={24}>
                <Form.Item
                  name="estado"
                  label="Estado"
                >
                  <Radio.Group
                    style={{ paddingLeft: 15 }}
                    onChange={onChange}
                    value={valores}
                  >
                    <Radio value={'HOSPI'}>Hospitalización</Radio>
                    <Radio value={'URGE'}>Emergencias</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
    </>
  );
};
export default ModaDetalles;
