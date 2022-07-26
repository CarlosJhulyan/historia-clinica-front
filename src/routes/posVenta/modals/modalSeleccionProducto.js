import React, {
  useEffect,
  useState
} from 'react';
import {
  Alert, Button,
  Col, Form, Input,
  Modal,
  Row,
  Table
} from 'antd';
import { httpClient } from '../../../util/Api';
import { openNotification } from '../../../util/util';
import { useSelector } from 'react-redux';

function ModalSeleccionProducto({
                                  visible,
                                  setProductoCurrent,
                                  productoCurrent,
                                  cancelProductoSelected,
                                  aceptedProductoSelected,
                                  permiteEditarPrecio,
}) {
  const dataInitialFetch = {
    codGrupoCia: '001',
    codLocal: '001'
  };
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
  const [bloqueoProducto, setBloqueoProducto] = useState(false);
  const [loadingDetalles, setLoadingDetalles] = useState(false);
  const [loadingListaFrac, setLoadingListaFrac] = useState(false);
  const [detalles, setDetalles] = useState({});
  const [listaFrac, setListaFrac] = useState([]);
  const [dataForm, setDataForm] = useState({
    pu: 0,
    cantidad: 1,
    total: 0
  });

  const columnsProducto = [
    {
      title: 'Abreviatura',
      key: 'ABREVIATURA',
      dataIndex: 'ABREVIATURA'
    },
    {
      title: 'Precio S/',
      key: 'PRECIO',
      dataIndex: 'PRECIO'
    }
  ]

  // const columnsLote = [
  //   {
  //     title: 'Lote',
  //   },
  //   {
  //     title: 'Fecha Venc.'
  //   }
  // ]

  const getDetalleCompProducto = () => {
    setLoadingDetalles(true);
    httpClient.post('posventa/getDetalleCompProducto', {
      ...dataInitialFetch,
      codProducto: productoCurrent.key,
      indVerifica: "N"
    })
      .then(response => {
        if (response.data.success && response.data.data) {
          setDetalles(response.data.data[0]);
          if (Number(response.data.data.STOCK_FISICO) <= 0) {
            setBloqueoProducto(true);
          }
        }
        setLoadingDetalles(false);
      })
      .catch(e => console.error(e));
  }

  const getListaFracciones = () => {
    setLoadingListaFrac(true);
    httpClient.post('posventa/getListaFracciones', {
      ...dataInitialFetch,
      codProducto: productoCurrent.key,
      codTipoVenta: "V"
    })
      .then(response => {
        if (response.data.success)
          setListaFrac(response.data.data);
        setLoadingListaFrac(false);
        setDataForm({
          ...dataForm,
          pu: response.data.data ? response.data.data[0].PRECIO_MIN : 0,
          total: response.data.data && response.data.data[0].PRECIO_MIN * dataForm.cantidad
        })
      })
      .catch(e => console.error(e));
  }

  useEffect(() => {
    getDetalleCompProducto();
    getListaFracciones();
  }, [productoCurrent])

  return (
    <Modal
      title='Ingreso de Cantidad'
      visible={visible}
      // onCancel={() => setVisible(false)}
      footer={false}
      width={750}
      centered
      className='modal-custom'
      closable={false}
    >
      <Row style={{ marginTop: 10, marginLeft: 0, marginRight: 0 }}>
        <Col span={24}>
          {loadingDetalles ? (
            <Alert style={{ background: themeSettingsGlobal.COD_COLOR_1 }} message={`Cargando detalles...`} type='info' />
          ): (
            <Alert className='font-white' style={{ background: themeSettingsGlobal.COD_COLOR_1 }} message={`Stock del Producto: ${detalles.STOCK_FISICO}, Unidades: ${detalles.UNIDAD}, Precio Costo: S/. ${detalles.PRECIO_LISTA}`} type='info' />
          )}
        </Col>
        <Col sm={24} md={24}>
          <Row justify='space-between' style={{ marginBottom: 10, marginLeft: 10, marginRight: 10 }}>
            <Col>
              Unidad: {productoCurrent.UNIDAD}
            </Col>
            <Col>
              Marca: {productoCurrent.MARCA}
            </Col>
          </Row>
          <Row justify='space-between' style={{marginBottom: 20, marginLeft: 10, marginRight: 10}}>
            <Col>
              Código: {productoCurrent.CODIGO}
            </Col>
            <Col>
              Descripción: {productoCurrent.DESCRIPCION}
            </Col>
          </Row>
          <Form
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
          >
            <Row style={{marginBottom: 30}}>
              <Col span={14}>
                <Table
                  columns={columnsProducto}
                  pagination={false}
                  bordered
                  dataSource={listaFrac}
                  loading={loadingListaFrac}
                  size='small'
                />
              </Col>
              <Col span={10}>
                  <Form.Item
                    label="Cantidad"
                  >
                    <Input
                      type='number'
                      value={dataForm.cantidad}
                      min={0}
                      disabled={loadingListaFrac}
                      onChange={(e) => setDataForm({...dataForm, cantidad: Number(e.target.value), total: dataForm.pu * Number(e.target.value)})}
                    />
                  </Form.Item>
                  <Form.Item
                    label="PU S/"
                  >
                    <Input
                      type='number'
                      min={0}
                      value={dataForm.pu}
                      disabled={loadingListaFrac || !permiteEditarPrecio}
                      onChange={(e) => setDataForm({...dataForm, pu: Number(e.target.value), total: Number(e.target.value) * dataForm.cantidad})}
                    />
                    {(listaFrac && listaFrac.length > 0 && dataForm.pu < listaFrac[0].PRECIO_MIN) && (
                      <label style={{color: 'red', fontSize: 10}}>Debe ser mayor a S/ {listaFrac[0].PRECIO_MIN}</label>
                    )}
                  </Form.Item>
                  <Form.Item
                    label="Sub Total"
                  >
                    <Input disabled value={(listaFrac && listaFrac.length > 0 && dataForm.pu < listaFrac[0].PRECIO_MIN) ? '' : dataForm.total.toFixed(2)} />
                  </Form.Item>
              </Col>
            </Row>
            {/*<Row style={{marginBottom: 20}}>*/}
            {/*  <Col span={12}></Col>*/}
            {/*  <Col span={12}>*/}
            {/*    <Form.Item*/}
            {/*      required*/}
            {/*      label="Lote"*/}
            {/*    >*/}
            {/*      <Input />*/}
            {/*    </Form.Item>*/}
            {/*  </Col>*/}
            {/*</Row>*/}
            <Row justify='space-around'>
              <Button
                disabled={
                  loadingDetalles ||
                  loadingListaFrac ||
                  dataForm.cantidad <= 0 ||
                  (listaFrac && listaFrac.length > 0 && dataForm.pu < listaFrac[0].PRECIO_MIN) ||
                  bloqueoProducto
                }
                style={{
                  backgroundColor: themeSettingsGlobal.COD_COLOR_1,
                  color: 'white'
                }}
                onClick={() => {
                  if (bloqueoProducto) return;
                  else {
                    if (Number(detalles.STOCK_FISICO) < Number(dataForm.cantidad)) {
                      openNotification('Selección de Producto', 'No hay cantidad en STOCK', 'Warning');
                      return;
                    }
                    aceptedProductoSelected(productoCurrent.key, {
                      ...detalles,
                      pu: Number(dataForm.pu),
                      cantidad: Number(dataForm.cantidad),
                      total: dataForm.total
                    });
                    setDataForm({
                      pu: 0,
                      cantidad: 0,
                      total: 0
                    });
                    setListaFrac([]);
                    if (setProductoCurrent) setProductoCurrent({});
                  }
                }}
              >
                Aceptar
              </Button>
              <Button
                disabled={loadingDetalles || loadingListaFrac}
                onClick={() => {
                  cancelProductoSelected(productoCurrent.key);
                  setDataForm({
                    pu: 0,
                    cantidad: 0,
                    total: 0
                  });
                }}
              >
                Cancelar
              </Button>
            </Row>
          </Form>
        </Col>
        {/*<Col sm={24} md={10}>*/}
        {/*  <Row justify='center' align='middle' style={{marginBottom: 30}}>*/}
        {/*    <span>Seleccione Lote (*) - Opcional</span>*/}
        {/*    <Button style={{marginBottom: 0, marginLeft: 5}}>Historico Precio V...</Button>*/}
        {/*  </Row>*/}
        {/*  <Table*/}
        {/*    pagination={false}*/}
        {/*    bordered*/}
        {/*    columns={columnsLote}*/}
        {/*    dataSource={[]}*/}
        {/*    scroll={{*/}
        {/*      y: 500*/}
        {/*    }}*/}
        {/*  />*/}
        {/*</Col>*/}
      </Row>
    </Modal>
  );
}

export default ModalSeleccionProducto;
