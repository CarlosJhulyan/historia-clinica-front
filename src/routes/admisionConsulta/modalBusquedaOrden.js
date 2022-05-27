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

  const traerOrden = async () => {
    setLoadingData(true);
    const { NUM_ORDEN } = dataSend;
    try {
      const responseCabecera = await httpClient.post('orden/getOrdenCabecera', { NUM_ORDEN });
      const responseDetalles = await httpClient.post('orden/getOrdenDetalles', { NUM_ORDEN });
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
      visible={abrirModalOrden}>
      <Row>
        <Col span={12}>
          <Form.Item label='Número Orden'>
            <Input
              name='NUM_ORDEN'
              onChange={handleChangeText}
              value={dataSend.NUM_ORDEN} />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loadingData} 
              onClick={() => traerOrden()}>
                Buscar Orden
            </Button>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Image preview={false} src={FormatoNuevo} />
        </Col>
      </Row>
    </Modal>
  )
}

export default ModalBusquedaOrden;