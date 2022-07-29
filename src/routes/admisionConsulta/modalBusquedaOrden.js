import React from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Image
} from 'antd';

import { httpClient } from '../../util/Api';
import { openNotification } from '../../util/util';
import FormatoNuevo from '../../assets/images/formato_nuevo.jpg';
import { useSelector } from 'react-redux';

function ModalBusquedaOrden({
  loadingData,
  dataSend,
  abrirModalOrden,
  setAbrirModalOrden,
  setLoadingData,
  setDataCabecera,
  setDataDetalles,
  setDataSend,
  setPedidoFound,
  handleChangeText
}) {
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
  const traerOrden = async (values) => {
    setLoadingData(true);
    const { NUM_ORDEN } = dataSend;
    try {
      const responseCabecera = await httpClient.post('orden/getOrdenCabecera', values);
      const responseDetalles = await httpClient.post('orden/getOrdenDetalles', values);
      if (!responseCabecera.data.success || !responseDetalles.data.success) {
        openNotification('Orden', responseCabecera.data.message, 'Warning');
        setDataCabecera([{}]);
        setDataDetalles([{}]);
        setPedidoFound(false);
      } else {
        setDataCabecera(responseCabecera.data.data);
        setDataDetalles(responseDetalles.data.data);
        setDataSend({
          ...dataSend,
          NUM_PEDIDO: responseCabecera.data.data[0].NUM_PEDIDO,
          COD_PACIENTE: responseCabecera.data.data[0].COD_PACIENTE,
        })
        setAbrirModalOrden(false);
        setPedidoFound(true);
      }
    } catch (error) {
      openNotification('Orden', 'Error en la petición', 'Alerta');
      setPedidoFound(false);
    }
    setLoadingData(false);
  }

  return (
    <Modal
      footer={false}
      title='Búsqueda por Número de Orden'
      closable={false}
      okText='Aceptar'
      cancelText='Salir'
      centered
      onCancel={() => setAbrirModalOrden(false)}
      visible={abrirModalOrden}
      okType='default'
      okButtonProps={{
        style: {background:themeSettingsGlobal.COD_COLOR_1, color: '#fff', border:'none'}
      }}
    >
      <Row>
        <Col span={12}>
          <Form onFinish={traerOrden}>
            <Form.Item name='NUM_ORDEN' label='Número Orden'>
              <Input
                onChange={handleChangeText}
                value={dataSend.NUM_ORDEN} />
            </Form.Item>
            <Form.Item>
              <Button
                style={{
                  background: "#36AE7C"
                }}
                loading={loadingData}
                htmlType='submit'
              >
                <p style={{
                  color: "white"
                }}>
                  Buscar Orden
                </p>
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={12}>
          <Image preview={false} src={FormatoNuevo} />
        </Col>
      </Row>
    </Modal>
  )
}

export default ModalBusquedaOrden;
