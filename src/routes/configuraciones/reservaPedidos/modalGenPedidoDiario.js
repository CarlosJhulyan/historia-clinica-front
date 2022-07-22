import React from 'react';
import { Button, Card, Col, Descriptions, Modal, Row } from 'antd';

const ModalGenPedidoDiario = ({visible, setVisible}) => {
  return (
    <>
      <Modal
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        title='Generación de pedido diario'
        footer={[
          <Button>
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
              <Descriptions.Item label="Nro Reserva" span={3}><span style={{color:'red'}}>0000041027</span></Descriptions.Item>
              <Descriptions.Item label="Fecha" span={2}>29/07/2022</Descriptions.Item>
              <Descriptions.Item label="Hora" span={1}>23:59</Descriptions.Item>
              <Descriptions.Item label="Email" span={3}>GERARDOISLA@GMAIL.COM</Descriptions.Item>
              <Descriptions.Item label="Celular" span={3}>423423423423</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={8}>
            <Descriptions size='middle' layout='vertical'>
              <Descriptions.Item label='Monto Venta' span={3}>
                <span style={{color:'red', fontSize:25}}>75.00</span>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Card size='small' style={{margin:0, minHeight:70}}>
          <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aliquam animi architecto aut blanditiis culpa
            dolorum esse ipsam iure laborum minima mollitia nesciunt odio, pariatur, quod, rem suscipit unde
            voluptatibus?
          </div>
        </Card>
      </Modal>
    </>
  );
}

export default ModalGenPedidoDiario;
