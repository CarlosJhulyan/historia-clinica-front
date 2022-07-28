import React from 'react';
import {
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
} from 'antd';
import moment from 'moment';
import { openNotification } from '../../util/util';
import { httpClient } from '../../util/Api';
import { useSelector } from 'react-redux';

function ModalBusquedaComprobante({
  setLoadingData,
  dataSend,
  setDataSend,
  traerPedido,
  handleChangeText,
  loadingData,
  setAbrirModalManual,
  abrirModalManual,
  dataComprobantesPago
}) {
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
  const { Option } = Select;
  const handleChangeTipoComp = e => {
    setDataSend({
      ...dataSend,
      TIPO_COMP_PAGO: e
    });
  }

  const handleChangeCalendar = (e = moment()) => {
    setDataSend({
      ...dataSend,
      FECHA_FORMAT: e,
      FECHA: e ? moment(e._d).format('DD/MM/yyyy') : ''
    });
  }

  const traerCorrelativoMontoNeto = async () => {
    setLoadingData(true);
    const dataFormat = {
      ...dataSend,
      NUM_COMPROBANTE: dataSend.SERIE_COMP.toUpperCase() + dataSend.NUM_COMP
    };

    try {
      const { data: { data = [], message: messageComp, success: successComp } } = await httpClient.post('comprobante/getCorrelativoMontoNeto', dataFormat);

      if (successComp) {
        setDataSend({
          ...dataSend,
          MONTO: data.MONTO.trim(),
          FECHA: data.FECHA,
          FECHA_FORMAT: moment(data.FECHA, 'DD/MM/yyyy'),
          NUM_PEDIDO: data.NUM_PED_VTA
        });

        const { data: { message: messageValidacion, success: successValidacion } } = await httpClient.post('pedido/verificacionPedido', {
          NUM_PEDIDO: data.NUM_PED_VTA,
          MONTO: data.MONTO.trim(),
        });

        if (successValidacion) {
          await traerPedido(data.NUM_PED_VTA);
          openNotification('Pedido', messageValidacion);
        } else {
          openNotification('Pedido', messageValidacion, 'Warning');
        }
      } else {
        openNotification('Comprobante', messageComp, 'Warning');
      }
    } catch (error) {
      console.error(error);
    }
    setLoadingData(false);
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

  return (
    <Modal
      title='Consulta de Correlativo Comprobante'
      closable={false}
      okText='Aceptar'
      cancelText='Salir'
      centered
      okType='default'
      okButtonProps={{
        style: {background:themeSettingsGlobal.COD_COLOR_1, color: '#fff', border:'none'},
        loading: loadingData
      }}
      onCancel={() => setAbrirModalManual(false)}
      onOk={() => traerCorrelativoMontoNeto()}
      cancelButtonProps={{
        disabled: loadingData
      }}
      visible={abrirModalManual}>
        <Form {...formItemLayout}>
          <Form.Item
            label="Tipo Comprobante"
          >
            <Select onChange={handleChangeTipoComp} value={dataSend.TIPO_COMP_PAGO}>
              {
                dataComprobantesPago.map((item) => (
                  <Option key={item.key} value={item.value}>{item.descripcion}</Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item
            label="Nro. Comprobante"
            // rules={[
            //   {
            //     required: true,
            //     message: 'Este campo es requerido',
            //   },
            // ]}
          >
            <Input.Group>
              <Row gutter={24}>
                <Col span={7}>
                  <Input
                    onChange={handleChangeText}
                    name='SERIE_COMP'
                    value={dataSend.SERIE_COMP} />
                </Col>
                <Col span={17}>
                  <Input
                    onChange={handleChangeText}
                    name='NUM_COMP'
                    value={dataSend.NUM_COMP} />
                </Col>
              </Row>
            </Input.Group>
          </Form.Item>
          <Form.Item
            label="Monto"
            // rules={[
            //   {
            //     required: true,
            //     message: 'Este campo es requerido',
            //   },
            // ]}
          >
            <Input
              onChange={handleChangeText}
              value={dataSend.MONTO}
              type='number'
              name='MONTO'
              prefix="S/" />
          </Form.Item>
          <Form.Item
            label="Fecha"
            // rules={[
            //   {
            //     required: true,
            //     message: 'Este campo es requerido',
            //   },
            // ]}
          >
            <DatePicker
              onChange={handleChangeCalendar}
              name='FECHA_FORMAT'
              value={dataSend.FECHA_FORMAT}
              format='DD/MM/yyyy'
              placeholder='dd/mm/yyyy'
              style={{ width: '100%' }} />
          </Form.Item>
        </Form>
    </Modal>
  )
}

export default ModalBusquedaComprobante;
