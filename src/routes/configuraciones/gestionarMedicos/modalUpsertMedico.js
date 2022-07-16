import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd';
import { httpClient } from '../../../util/Api';
import { notificaciones } from '../../../util/util';
import moment from 'moment';

const ModalUpsertMedico = ({
                             visible,
                             setVisible,
                             filaActual,
                             editarMedico
}) => {
  const [dataListTipoColegio, setDataListTipoColegio] = useState([]);
  const [dataListEspecialidad, setDataListEspecialidad] = useState([]);
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

    if (editarMedico) {
      refForm.setFieldsValue({
        cmp: filaActual.CMP,
        nombre: filaActual.NOMBRE,
        apellidoP: filaActual.APE_PAT,
        apellidoM: filaActual.APE_MAT,
        referencia: filaActual.DESC_REFERENCIA,
      });
    } else {
      refForm.setFieldsValue({ referencia: '', nombre: '', apellidoP: '', cmp: '', apellidoM: '' });
    }
  }, []);

  const guardar = async (data) => {
    const dataFormat = {
      ...data,
      fechaNac: moment(data.fechaNac).format('YYYY-MM-DD'),
      apellidos: data.apellidoP + ' ' + data.apellidoM
    }

    const funGuardar = async () => {
      await httpClient.post('/admin/createMedico', dataFormat);
      setVisible(false);
    };
    notificaciones('', 'Promesa', {
      pendiente: 'Guardando...',
      ok: 'Guardado correctamente',
      error: 'Error al guardar',
      promesa: funGuardar,
    });
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
          <Button onClick={() => setVisible(false)}>Cerrar</Button>,
          <Button
            htmlType='submit'
            type='primary'
            form='form-create-doctor'
          >
            Grabar
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
                name="fechaNac"
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
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="especialidad"
                label="Especialidad"
                rules={[{ required: true }]}
              >
                <Select placeholder="Seleccionar especialidad">
                  {dataListEspecialidad.map((item, index) => {
                    return (
                      <Select.Option value={item.value} key={index}>
                        {item.descripcion}
                      </Select.Option>
                    );
                  })}
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
