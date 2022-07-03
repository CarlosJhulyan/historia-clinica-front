import React from 'react';
import {
  Col,
  Modal, Row
} from 'antd';

function ModalCobrarPedido({ visible, setVisible }) {
  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      title='Cobrar Pedido'
      width={1000}
    >
      <Row>
        <Col span={8}>
          s
        </Col>
        <Col span={16}>
          g
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Row>
            medico
          </Row>
          <Row>
            Paciente
          </Row>
        </Col>
        <Col span={12}>
          h
        </Col>
      </Row>
    </Modal>
  );
}

export default ModalCobrarPedido;
