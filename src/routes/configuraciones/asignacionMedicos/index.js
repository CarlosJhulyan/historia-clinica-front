import React, { useEffect, useRef, useState } from 'react';
import { httpClient } from "../../../util/Api";
import { Button, Card, Table, Row, Col, Form, Input, Modal, Select, AutoComplete } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import { openNotification } from '../../../util/util';
import axios from 'axios';
import { useSelector } from 'react-redux';


const AsignacionMedicos = () => {
  const [data, setData] = useState([]);
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
  const [dataFiltered, setDataFiltered] = useState([]);
  const { confirm } = Modal;
  const [valueSearch, setValueSearch] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [currentMedico, setCurrentMedico] = useState();
  const [loadingSearh, setLoadingSearch] = useState(false);
  const [visibleModalUpsert, setVisibleModalUpsert] = useState(false);

  const findMedicos = (values) => {
    setLoadingSearch(true);
    if (valueSearch.trim() === '') {
      setDataFiltered([]);
    }

    setDataFiltered(data.filter(item => {
      if (valueSearch.length === 5 && !isNaN(Number(valueSearch))) return item.CMP === valueSearch;
      else return `${item.NOMBRES} ${item.APELLIDOS}`.includes(valueSearch);
    }));
    setLoadingSearch(false);
  }

  const defData = async () => {
    setLoadingData(true);
    const response = await httpClient.get('/admin/searchAsignaMedicos');
    setData(response.data.data);
    setLoadingData(false);
  }

  useEffect(() => {
    defData();
  }, [])

  useEffect(() => {
    setDataFiltered(data);
  }, [data]);

  const handleEditAsignacion = (record) => {
    setCurrentMedico(record);
  }

  const handleDeleteAsignacion = (cmp) => {
    setLoadingData(true);
    httpClient
      .post('admin/deleteAsignacion', {cmp})
      .then(({ data: {success,message} }) => {
        if (success) {
          openNotification('Asignación médico', message);
          defData();
        }
        else openNotification('Asignación médico', message, 'Warning');
      })
      .catch(e => console.error(e));
  }

  const columns = [
      {
          title: 'CMP',
          dataIndex: 'CMP',
          key: 'CMP',

      },
      {
          title: 'NOMBRE',
          dataIndex: 'NOMBRES',
          key: 'NOMBRES',

      },
      {
          title: 'APELLIDOS',
          dataIndex: 'APELLIDOS',
          key: 'APELLIDOS',
      },
      {
          title: 'CONSULTORIO',
          dataIndex: 'CONSULTORIO',
          key: 'CONSULTORIO'
      },
      {
          title: 'BUS',
          dataIndex: 'BUS',
          key: 'BUS',
      },
      {
          title: 'EDITAR',
          dataIndex: 'key',
          key: 'key',
          render: (key, record) => (
              <Button
                  style={{
                      background: themeSettingsGlobal.COD_COLOR_1
                  }}
                  onClick={e => {
                    handleEditAsignacion(record);
                    setVisibleModalUpsert(true);
                  }}>
                  <p style={{
                      color: "white"
                  }}>
                      Editar
                  </p>
              </Button>
          )
      },
      {
          title: 'ELIMINAR',
          dataIndex: 'key',
          key: 'key',
          render: (key, record) => (
            <Button
              onClick={() => {
                confirm({
                  content: '¿Eliminar asignación de médico?',
                  okText: 'Aceptar',
                  cancelText: 'Cancelar',
                  onOk: () => {
                    handleDeleteAsignacion(record.CMP);
                  },
                  centered: true
                });
              }}
              style={{
                  background: "#EB5353"
              }}
            >
                <p style={{
                    color: "white"
                }}>
                    Eliminar
                </p>
            </Button>
          )
      }
  ]

  return (
    <>
      <Card
        title={(
          <Row justify='space-between' align='middle'>
            <Col span={5}>
                Asignar Médico
            </Col>
            <Col span={9}>
              <Form id='form-search' onFinish={findMedicos}>
                <Form.Item
                  name='valor'
                  style={{ margin: 0, padding: 0 }}
                >
                  <Input
                    placeholder='CMP o nombres'
                    onChange={e => setValueSearch(e.target.value.toUpperCase())}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col span={8}>
              <Row justify="end" align="middle">
                <Button
                  style={{
                    margin: 0,
                    background: themeSettingsGlobal.COD_COLOR_1,
                    color: '#fff'
                  }}
                  form='form-search'
                  htmlType='submit'
                  loading={loadingSearh}
                >
                  <SearchOutlined />
                </Button>
                <Button
                  onClick={() => {
                    setVisibleModalUpsert(true);
                    setCurrentMedico(null);
                  }}
                  style={{
                    margin: 0,
                    marginLeft: 20,
                    marginRight: 20,
                    background: themeSettingsGlobal.COD_COLOR_1,
                    color: '#fff'
                }}
                >
                  Crear
                </Button>
              </Row>
            </Col>
          </Row>
        )}
      >
        <Table
          className="gx-table-responsive"
          columns={columns}
          dataSource={dataFiltered}
          loading={loadingData}
        />
      </Card>

      <ModalUpsertAsignacion
        visible={visibleModalUpsert}
        setVisible={setVisibleModalUpsert}
        currentAsignacion={currentMedico}
        defData={defData}
      />
    </>
  );
}

const ModalUpsertAsignacion = ({
  visible,
  setVisible,
  currentAsignacion,
  defData
}) => {
  const formRef = useRef();
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
  const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());
  const [peticion, setPeticion] = useState(false);
  const [loadingUpsert, setLoadingUpsert] = useState(false);
  const [loadingDataConsultorio, setLoadingDataConsultorio] = useState(false);
  const [loadingDataBus, setLoadingDataBus] = useState(false);
  const [valueCOD, setValueCOD] = useState('');
  const [optionsCOD, setOptionsCOD] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [buses, setBuses] = useState([]);

  const onSelectCOD = data => {
    optionsCOD.forEach(element => {
      console.log(element);
      if (element.key === data) {
        formRef.current.setFieldsValue({
          codmedico: element.cod_medico,
          nombreMedico: `${element.des_nom_medico + ' ' + element.des_ape_medico}`,
          cmp: element.num_cmp
        });
      }
      setValueCOD(element.num_cmp);
    });
  };

  const onChangeCOD = data => {
    setValueCOD(data);
    if (data.length <= 3) {
      setOptionsCOD([]);
    }
  };

  const onSearchCOD = async (data) => {
    var cod = data;
    if (cod ? cod.length >= 4 : false) {
      setPeticion(true);
      setOptionsCOD();
      const respuesta = await httpClient.post(
        'modulos/getDataMedicos',
        {
          num_cmp: cod,
          des_nom_medico: '',
        },
        { cancelToken: cancelSource.token }
      );
      var array1 = respuesta.data.data;
      for (let i = 0; i < array1.length; i++) {
        if (array1[i].asignado === '0') {
          delete array1[i];
        } else {
          array1[i].key = array1[i].cod_medico;
          array1[i].value = array1[i].cod_medico;
          array1[i].label = (
            <div>
              {array1[i].num_cmp}
              <div style={{ color: '#a3a3a3' }}>{array1[i].des_ape_medico}</div>
            </div>
          );
        }
      }
      setOptionsCOD(array1);
    } else {
      if (peticion) {
        cancelSource.cancel('COD Cancelado');
        setCancelSource(axios.CancelToken.source());
      }
    }
  };

  const handleCreateAsignacion = (data) => {
    setLoadingUpsert(true);
    httpClient
      .post('admin/createAsignaMedicos', data)
      .then(({ data: {success, message} }) => {
        if (success) openNotification('Asignación médico', message);
        else openNotification('Asignación médico', message, 'Warning');
        setLoadingUpsert(false);
        setVisible(false);
        defData();
      })
      .catch(e => console.error(e));
  }

  const handleFinishForm = (values) => {
    if (currentAsignacion) {
      handleCreateAsignacion(values);
    } else {
      handleCreateAsignacion(values);
    }
    formRef.current.resetFields();
  }

  const getConsultoriosMedico = () => {
    setLoadingDataConsultorio(true);
    httpClient
      .get('admin/getConsultorioMedico')
      .then(({ data: {success,data} }) => {
        if (success) setConsultorios(data);
        setLoadingDataConsultorio(false);
      })
      .catch(e => console.error(e));
  }

  const getBusMedico = (id) => {
    setLoadingDataBus(true);
    httpClient
      .post('admin/getBusMedico', {id})
      .then(({ data: {success,data} }) => {
        if (success) setBuses(data);
        setLoadingDataBus(false);
      })
      .catch(e => console.error(e));
  }

  const handleChangeConsultorio = value => {
    formRef.current.setFieldsValue({
      idbus: null
    });
    getBusMedico(value);
  }

  const handleChangeBus = (value) => {
    formRef.current.setFieldsValue({
      bus: buses.find(item => item.key === value).descripcion
    });
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
    },
  };

  useEffect(() => {
    getConsultoriosMedico();
    if (currentAsignacion) {
      getBusMedico(currentAsignacion.ID_CONSULTORIO);
      formRef.current.setFieldsValue({
        nombreMedico: currentAsignacion.NOMBRES + " " + currentAsignacion.APELLIDOS,
        codmedico: currentAsignacion.COD_MEDICO,
        cmp: currentAsignacion.CMP,
        bus: currentAsignacion.BUS,
        idbus: currentAsignacion.ID_BUS,
        idconsultorio: currentAsignacion.ID_CONSULTORIO
      });
      setValueCOD(currentAsignacion.CMP);
    } else {
      formRef.current?.resetFields();
      setValueCOD('');
    }
  }, [currentAsignacion]);

  return (
    <>
      <Modal
        title='Crear asignación medica'
        closable={false}
        centered
        onCancel={() => setVisible(false)}
        width={600}
        visible={visible}
        footer={[
          <Button onClick={() => {
            setVisible(false);
            formRef.current.resetFields();
          }}>
            Cancelar
          </Button>,
          <Button
            form='form-asignacion'
            htmlType='submit'
            loading={loadingUpsert}
            style={{
              background: themeSettingsGlobal.COD_COLOR_1,
              color: '#fff'
            }}
          >
            {currentAsignacion ? 'Actualizar' : 'Crear'}
          </Button>
        ]}
      >
        <Form
          id='form-asignacion'
          onFinish={handleFinishForm}
          ref={formRef}
          {...formItemLayout}
        >
          <Form.Item
            name="cmp"
            label="Médico"
            rules={[{required: true}]}
          >
            <Input.Group>
              <Row gutter={24}>
                <Col span={8}>
                  <AutoComplete
                    placeholder='CMP'
                    value={valueCOD}
                    options={optionsCOD}
                    onSearch={onSearchCOD}
                    onSelect={onSelectCOD}
                    onChange={onChangeCOD}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col span={16}>
                  <Form.Item name='nombreMedico' style={{margin: 0}}>
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
            </Input.Group>
          </Form.Item>
          <Form.Item
            name='idconsultorio'
            label="Consultorio"
            rules={[{required: true}]}
          >
            <Select
              onChange={handleChangeConsultorio}
              disabled={loadingDataConsultorio}
              loading={loadingDataConsultorio}
              placeholder='Seleccionar consultorio'
            >
              {
                consultorios.map(item => (
                  <Select.Option key={item.key} value={item.value}>{item.descripcion}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item
            name='idbus'
            label="Bus"
            rules={[{required: true}]}
          >
            <Select
              placeholder='Seleccionar bus'
              disabled={loadingDataBus}
              loading={loadingDataBus}
              onChange={handleChangeBus}
            >
              {
                buses.map((item) => (
                  <Select.Option key={item.key} value={item.value}>{item.descripcion}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item style={{display: 'none'}} name='codmedico'></Form.Item>
          <Form.Item style={{display: 'none'}} name='bus'></Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AsignacionMedicos;
