import React from 'react';
import { 
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Image,
} from 'antd';

import FormatoViejo from '../../assets/images/formato_viejo.jpg';

function ModalBusquedaPedido({
  abrirModalPedido,
  setAbrirModalPedido,
  dataSend,
  handleChangeText,
  traerPedido,
  loadingData
}) {

  return (
    <Modal
      footer={false}
      title='Búsqueda por Número de Pedido'
      closable={false}
      okText='Aceptar'
      cancelText='Salir'
      centered
      onCancel={() => setAbrirModalPedido(false)}
      visible={abrirModalPedido}>
      <Form>
        <Row>
          <Col span={12}>
            <Form.Item label='Número Pedido'>
              <Input
                name='NUM_PEDIDO'
                onChange={handleChangeText}
                value={dataSend.NUM_PEDIDO} />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType='submit'
                loading={loadingData} 
                onClick={() => traerPedido()}>
                  Buscar Pedido
              </Button>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Image preview={false} src={FormatoViejo} />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ModalBusquedaPedido;