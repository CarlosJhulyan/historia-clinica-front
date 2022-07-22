import React from 'react';
import { Button, Card, Col, Descriptions, Modal, Row } from 'antd';

const ModalGenPedidoDiario = ({ visible, dataFetchCabecera, clearDataFinally }) => {
  return (
    <>
      <Modal
        closable={false}
        centered
        visible={visible}
        title='Generación de pedido diario'
        footer={[
          <Button
            onClick={() => clearDataFinally()}
          >
            Aceptar
          </Button>,
          <Button>
            Imprimir Térmica
          </Button>,
          <Button>
            Generar PDF
          </Button>
        ]}
      >
        <Row>
          <Col span={16}>
            <Descriptions title="RESERVA" size='middle'>
              <Descriptions.Item label="Nro Reserva" span={3}>
                <span style={{color:'red'}}>{dataFetchCabecera.cNumPedVta_in}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Fecha" span={2}>
                {dataFetchCabecera.cfecha_reserva}
              </Descriptions.Item>
              <Descriptions.Item label="Hora" span={1}>
                {dataFetchCabecera.chora_reserva}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={3}>
                {dataFetchCabecera.cemail_reserva}
              </Descriptions.Item>
              <Descriptions.Item label="Celular" span={3}>
                {dataFetchCabecera.ccelular_reserva}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={8}>
            <Descriptions size='middle' layout='vertical'>
              <Descriptions.Item label='Monto Venta' span={3}>
                <span style={{color:'red', fontSize:20}}>S/. {Number(dataFetchCabecera.nValNetoPedVta_in).toFixed(2)}</span>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Card size='small' style={{margin:0, minHeight:70}}>
          {dataFetchCabecera.cobs_reserva}
        </Card>
      </Modal>
    </>
  );
}

export default ModalGenPedidoDiario;
