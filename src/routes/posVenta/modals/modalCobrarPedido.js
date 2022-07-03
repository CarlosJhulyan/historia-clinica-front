import React, { useState } from 'react';
import {
  Button, Card,
  Col, Descriptions, Divider, Form, Input, List,
  Modal, Row, Table
} from 'antd';
import ModalListaMedicos from './modalListaMedicos';
import ModalListaPacientes from './modalListaPacientes';
import ModalListaClientes from './modalListaClientes';
import Doctor from '../../../assets/posventa/doctor.png';
import Paciente from '../../../assets/posventa/paciente.png';

function ModalCobrarPedido({
                             visible,
                             setVisible,
                             medicoCurrent,
                             clienteCurrent,
                             pacienteCurrent,
                             setClienteCurrent,
                             setMedicoCurrent,
                             setPacienteCurrent,
                             productos
}) {
  const [visibleModalMedicos, setVisibleModalMedicos] = useState(false);
  const [visibleModalPacientes, setVisibleModalPacientes] = useState(false);
  const [visibleModalCliente, setVisibleModalCliente] = useState(false);
  const [dataFormaPago, setDataFormaPago] = useState(['EFECTIVO SOLES', 'VISA POS', 'MASTERCARD POS']);

  const columnsEspecialidad = [
    {
      title: 'Especialidad',
      dataIndex: 'ESPECIALIDAD',
      key: 'ESPECIALIDAD',
    },
    {
      title: '.',
      dataIndex: 'P',
      key: 'P',
    },
    {
      title: 'Total',
      dataIndex: 'TOTAL',
      key: 'TOTAL',
      align: 'right',
    }
  ];

  const columnsFormaPago = [
    {
      title: 'Forma de Pago',
      dataIndex: 'ESPECIALIDAD',
      key: 'ESPECIALIDAD',
    },
    {
      title: 'Total',
      dataIndex: 'P',
      key: 'P',
    },
    {
      title: 'Nº Operación',
      dataIndex: 'TOTAL',
      key: 'TOTAL',
      align: 'right',
    }
  ]

  const columnsProductos = [
    {
      title: 'Código',
      dataIndex: 'CODIGO',
      key: 'CODIGO',
    },
    {
      title: 'Descripción',
      dataIndex: 'DESCRIPCION',
      key: 'DESCRIPCION',
    },
    {
      title: 'Pre. Vta.',
      dataIndex: 'pu',
      key: 'pu',
      align: 'right',
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
      align: 'right',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
    },
  ];

  return (
    <>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        centered
        title='Cobrar Pedido'
        className='modal-custom'
        width={1200}
        footer={false}
      >
        <Row style={{ marginTop: 10, marginLeft: 0, marginRight: 0 }}>
          <Col span={8}>
            <Table
              columns={columnsEspecialidad}
              dataSource={[{
                key: 1,
                TOTAL: '12.00',
                ESPECIALIDAD: 'VENTA',
                P: 'P'
              }]}
              pagination={false}
              size='small'
              bordered
            />
          </Col>
          <Col span={16}>
            <Table
              columns={columnsProductos}
              dataSource={productos}
              // pagination={false}
              size='small'
              bordered
            />
          </Col>
        </Row>
        <Row style={{ marginLeft: 0, marginRight: 0, marginTop: 10 }}>
          <Col span={11}>
            <Row>
              <Col span={6}>
                <Button
                  block
                  onClick={() => setVisibleModalMedicos(true)}
                  style={{ display: 'block', height: 'auto', padding: 10 }}
                >
                  <img src={Doctor} />
                </Button>
              </Col>
              <Col span={18}>
                <h5>Datos de Medico</h5>
                <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>

                  <Form.Item label="CMP" style={{ margin: 0 }}>
                    <Input disabled size="small" value={medicoCurrent.CMP} />
                  </Form.Item>
                  <Form.Item label="Nombre Completo" style={{ margin: 0 }}>
                    <Input disabled size="small" value={medicoCurrent.NOMBRE_COMPLETO} />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Button
                  block
                  onClick={() => setVisibleModalPacientes(true)}
                  style={{ display: 'block', height: 'auto', padding: 10 }}
                >
                  <img src={Paciente} />
                </Button>
              </Col>
              <Col span={18}>
                <h5>Datos de Paciente</h5>
                <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  <Form.Item label="DNI" style={{ margin: 0 }}>
                    <Input disabled size="small" value={pacienteCurrent.NUM_DOCUMENTO} />
                  </Form.Item>
                  <Form.Item label="Nacimiento" style={{ margin: 0 }}>
                    <Input disabled size="small" value={pacienteCurrent.FEC_NAC_CLI} />
                  </Form.Item>
                  <Form.Item label="Nombres" style={{ margin: 0 }}>
                    <Input disabled size="small" value={pacienteCurrent.NOMBRE} />
                  </Form.Item>
                  <Form.Item label="Apellidos" style={{ margin: 0 }}>
                    <Input
                      disabled
                      size="small"
                      value={`${
                        pacienteCurrent.APE_PATERNO ? pacienteCurrent.APE_PATERNO : ''
                      } ${pacienteCurrent.APE_MATERNO ? pacienteCurrent.APE_MATERNO : ''}`}
                    />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <h5>Datos Comprobante</h5>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Form.Item label="Documento" style={{ margin: 0 }}>
                    <Input
                      style={{ cursor: 'pointer' }}
                      addonAfter={
                        <span
                          onClick={() => setVisibleModalCliente(true)}
                        >
                        Seleccionar Cliente
                    </span>
                      }
                      size="small"
                      disabled
                      value={clienteCurrent.NUM_DOCUMENTO}
                    />
                  </Form.Item>
                  <Form.Item label="Nombres" style={{ margin: 0 }}>
                    <Input size="small" disabled value={clienteCurrent.CLIENTE} />
                  </Form.Item>
                  <Form.Item label="Dirección" style={{ margin: 0 }}>
                    <Input size="small" disabled value={clienteCurrent.DIRECCION} />
                  </Form.Item>
                  <Form.Item label="Email" style={{ margin: 0 }}>
                    <Input size="small" disabled value={clienteCurrent.CORREO} />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Col>
          <Col span={13}>
            <Row>
              <Descriptions>
                <Descriptions.Item span={1} label="BOLETA"></Descriptions.Item>
                <Descriptions.Item span={2} label="RUC">20786785672</Descriptions.Item>
                <Descriptions.Item span={4} label="Cliente">{clienteCurrent.CLIENTE}</Descriptions.Item>
                <Descriptions.Item span={1} label="Pedido">
                  <Input size='small' style={{width: 100}} />
                </Descriptions.Item>
                <Descriptions.Item label="TOTAL VENTA S/.">12.00</Descriptions.Item>
                <Descriptions.Item label="US$">3.6</Descriptions.Item>
              </Descriptions>
            </Row>
            <Divider />
            <Row>
              <Col span={8}>
                <List
                  size="small"
                  header={<div>Formas de Pagos</div>}
                  bordered
                  style={{height: 150, overflowY: 'auto'}}
                  dataSource={dataFormaPago}
                  renderItem={item => <List.Item>{item}</List.Item>}
                />
              </Col>
              <Col span={16}>
                <Form>
                  <Row>
                    <Col span={10} style={{marginRight: 10}}>
                      <Form.Item label='Moneda'>
                        <Input disabled/>
                      </Form.Item>
                    </Col>
                    <Col span={13}>
                      <Form.Item label='Nº Operación'>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={10} style={{marginRight: 10}}>
                      <Form.Item label='Monto'>
                        <Input type='number' value='0.00' />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col span={14}>
                <Table
                  columns={columnsFormaPago}
                  size='small'
                  pagination={false}
                  dataSource={[{}]}
                />
              </Col>
              <Col span={10}>
                <Card>
                  <Descriptions>
                    <Descriptions.Item span={3} label="TOTAL A PAGAR S/.">12.00</Descriptions.Item>
                    <Descriptions.Item span={3} label="Vuelto S/.">0.00</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={24}>
                <Row justify='end' style={{marginRight: 5}}>
                  <Button>
                    % Descuento
                  </Button>
                  <Button>
                    Limpiar
                  </Button>
                  <Button style={{ backgroundColor: '#0169aa', color: 'white', }}>
                    Aceptar
                  </Button>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
      {visibleModalMedicos ? (
        <ModalListaMedicos
          setVisible={setVisibleModalMedicos}
          visible={visibleModalMedicos}
          setMedicoCurrent={setMedicoCurrent}
        />
      ) : null}
      <ModalListaPacientes
        visible={visibleModalPacientes}
        setVisible={setVisibleModalPacientes}
        setPacienteCurrent={setPacienteCurrent}
      />
      <ModalListaClientes
        visible={visibleModalCliente}
        setVisible={setVisibleModalCliente}
        setClienteCurrent={setClienteCurrent}
      />
    </>
  );
}

export default ModalCobrarPedido;
