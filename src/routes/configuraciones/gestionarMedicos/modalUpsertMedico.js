import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd';
import { httpClient } from '../../../util/Api';
import { notificaciones, openNotification } from '../../../util/util';
import moment from 'moment';
import { useSelector } from 'react-redux';

const ModalUpsertMedico = ({
                             visible,
                             setVisible,
                             currentMedico
}) => {
  const [dataListTipoColegio, setDataListTipoColegio] = useState([]);
  const [dataListEspecialidad, setDataListEspecialidad] = useState([]);
  const [newEspecialidad, setNewEspecialidad] = useState('');
  const [loadingSave, setLoadingSave] = useState(false);
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
  const [refForm] = Form.useForm();

  const traerListaTipoColegio = () => {
    httpClient
      .get('/admin/getTipoColegios')
      .then(response => {
        if (response.data.success) setDataListTipoColegio(response.data.data);
      })
      .catch(e => console.error(e));
  };

  const traerListaEspecialidad = () => {
    httpClient
      .get('/admin/getEspecialidadesMedico')
      .then(response => {
        if (response.data.success) setDataListEspecialidad(response.data.data);
      })
      .catch(e => console.error(e));
  };

  useEffect(() => {
    traerListaTipoColegio();
    traerListaEspecialidad();

    if (currentMedico) {
      const apellidos = {
        apellidoP: currentMedico.APELLIDOS.trim().split(' ')[0],
        apellidoM: currentMedico.APELLIDOS.trim().split(' ')[1],
      }
      if (currentMedico.APELLIDOS.trim().split(' ').length === 3) {
        apellidos.apellidoM = currentMedico.APELLIDOS.trim().split(' ')[2]
      }

      refForm.setFieldsValue({
        cmp: currentMedico.CMP,
        nombre: currentMedico.NOMBRES,
        referencia: currentMedico.DESC_REFERENCIA,
        sexo: currentMedico.COD_SEXO,
        direccion: currentMedico.DIRECCION,
        numDoc: currentMedico.NUM_DOC,
        especialidad: currentMedico.ESPECIALIDAD,
        tipoColegio: currentMedico.COD_TIPO_COLEGIO,
        codUsu: currentMedico.USUARIO,
        fecNac: moment(currentMedico.FEC_NAC),
        ...apellidos
      });
    }
  }, []);

  const guardar = async (values) => {
    setLoadingSave(true);
    const dataFormat = {
      ...values,
      fecNac: moment(values.fecNac).format('DD/MM/yyyy'),
      apellidos: values.apellidoP + ' ' + values.apellidoM,
    }

    const { data: { success, message } } = await httpClient.post('/admin/createMedico', dataFormat);

    if (success) {
      openNotification('Médico', message);
      setVisible(false);
    } else {
      openNotification('Médico', message, 'warning');
    }
    setLoadingSave(false);
  };

  return (
    <>
      <Modal
        centered
        width={800}
        visible={visible}
        title="Mantenimiento Médico"
        onCancel={() => setVisible(false)}
        footer={[
          <Button
            onClick={() => setVisible(false)}
            disabled={loadingSave}
          >
            Cerrar
          </Button>,
          <Button
            htmlType='submit'
            form='form-create-doctor'
            loading={loadingSave}
            style={{
              background: themeSettingsGlobal.COD_COLOR_1,
              color: '#fff'
            }}
          >
            {currentMedico ? 'Actualizar' : 'Grabar'}
          </Button>,
        ]}
      >
        <Form
          id='form-create-doctor'
          form={refForm}
          onFinish={guardar}
          labelCol={{
            span: 8
          }}
        >
          <Row justify='space-between'>
            <Col xl={12} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                name="cmp"
                label="CMP"
                rules={[{ required: true, len: 5 }]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                name="tipoColegio"
                label="Tipo Colegio"
                rules={[{ required: true }]}
              >
                <Select placeholder="Seleccionar Tipo Colegio">
                  {dataListTipoColegio.map(item => {
                    return (
                      <Select.Option value={item.value} key={item.key}>
                        {item.descripcion}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>

              <Form.Item
                name="numDoc"
                label="DNI"
                rules={[{ required: true, len: 8 }]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                name="direccion"
                label="Dirección"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="sexo"
                label="Sexo"
                rules={[{ required: true }]}
              >
                <Select placeholder="Seleccionar sexo">
                  <Select.Option value='0'>
                    Hombre
                  </Select.Option>
                  <Select.Option value='1'>
                    Mujer
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="fecNac"
                label="Fecha Nac"
                rules={[{ required: true }]}
              >
                <DatePicker
                  format='DD/MM/yyyy'
                  style={{width: '100%'}}
                  placeholder='Completa fecha'
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={11} md={11} sm={24} xs={24}>
              <Form.Item
                name="nombre"
                label="Nombre"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="apellidoP"
                label="Apellido Pat."
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="apellidoM"
                label="Apellido Mat."
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="codUsu"
                label="Usuario"
                rules={[{ required: true, len: 5 }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="especialidad"
                label="Especialidad"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Seleccionar especialidad"
                  showSearch
                  onSearch={e => {
                    setNewEspecialidad(e.toUpperCase());
                  }}
                >
                  {dataListEspecialidad.map((item, index) => {
                    return (
                      <Select.Option value={item.value} key={index}>
                        {item.descripcion}
                      </Select.Option>
                    );
                  })}
                  <Select.Option value={newEspecialidad}>{newEspecialidad}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default ModalUpsertMedico;
