import React from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  TimePicker
} from 'antd';
import { useSelector } from 'react-redux';

const ModalInsertReserva = ({ visible, setVisible, guardarReservaPedidoCabecera, setGuardando,guardando }) => {
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
  const handleReservaPedidoFinal = async (values) => {
    setGuardando(true);
    const dataFormat = {
      ...values,
      cfecha_reserva: values.cfecha_reserva.format('DD/MM/yyyy'),
      chora_reserva: values.chora_reserva.format('HH:mm')
    }
    await guardarReservaPedidoCabecera(dataFormat);
    setGuardando(false);
    setVisible(false);
  }

  return (
    <>
      <Modal
        width={650}
        centered
        visible={visible}
        closable={false}
        title='Datos para Reserva'
        footer={[
          <Button
            onClick={() => setVisible(false)}
            disabled={guardando}
          >
            Volver
          </Button>,
          <Button
            htmlType='submit'
            style={{
              backgroundColor: themeSettingsGlobal.COD_COLOR_1,
              color: 'white',
            }}
            form='form-reserva-pedido'
            loading={guardando}
          >
            Aceptar
          </Button>
        ]}
      >
        <Form
          labelCol={{
            span:6
          }}
          wrapperCol={{
            span:18
          }}
          id='form-reserva-pedido'
          onFinish={handleReservaPedidoFinal}
        >
          <Row>
            <Col span={12}>
              <Form.Item label='Fecha' name='cfecha_reserva' rules={[{required:true}]}>
                <DatePicker
                  format='DD/MM/yyyy'
                  style={{width:'100%'}}
                  placeholder='__/__/____'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Hora' name='chora_reserva' rules={[{required:true}]}>
                <TimePicker
                  style={{width:'100%'}}
                  placeholder='00:00'
                  format='H:mm'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Celular' name='ccelular_reserva'>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Correo' name='cemail_reserva' rules={[{type:'email'}]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item wrapperCol={{span:24}} name='cobs_reserva'>
                <Input.TextArea
                  placeholder='Observaciones'
                  style={{minHeight:70,margin:0}}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default ModalInsertReserva;
