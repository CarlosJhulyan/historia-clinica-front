import React, {
  useEffect,
  useState
} from 'react';
import {
  Card,
  Form,
  AutoComplete,
  Button,
  Input,
  Space,
  Table,
  Divider,
  Row,
  Modal,
} from 'antd';
import moment from 'moment';
import ModalListaProductos from './modals/modalListaProductos';
import { httpClient } from '../../util/Api';

function GenerarPedido() {
  const [modal, contextHolder] = Modal.useModal();
  const [visibleModal, setVisibleModal] = useState(false);
  const [disabledAll, setDisabledAll] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const token = JSON.parse(localStorage.getItem('token'));
  const [data, setData] = useState([]);

  const [dataDetallesFinally, setDataDetallesFinally] = useState({
    total: 0,
    totalDolar: 0,
    items: 0,
    tipoCambio: 3.34
  });

  const columns = [
    {
      title: 'Código',
      dataIndex: 'CODIGO',
      key: 'CODIGO'
    },
    {
      title: 'Descripción',
      dataIndex: 'DESCRIPCION',
      key: 'DESCRIPCION',
      width: '350px'
    },
    {
      title: 'Unidad',
      dataIndex: 'UNIDAD',
      key: 'UNIDAD'

    },
    {
      title: 'Precio',
      dataIndex: 'PRECIO',
      key: 'PRECIO',
      align: 'right',
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
      align: 'right',
    },
    {
      title: '%Dscto',
      dataIndex: 'descuento',
      key: 'descuento',
      align: 'right',
    },
    {
      title: 'Precio Venta',
      dataIndex: 'pu',
      key: 'pu',
      align: 'right',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
    },
  ];

  const chargeDetailsModalProducto = (productos, detalles) => {
    const dataFinally = productos.map(product => {
      return {
        ...product,
        ...detalles.find(detail => detail.key === product.key),
      }
    });
    setData(dataFinally);
    const total = dataFinally.reduce((previus, current) => current.total + previus, 0);
    setDataDetallesFinally({
      tipoCambio: 3.34,
      items: dataFinally.length,
      total,
      totalDolar: total / 3.34
    });
  }

  const getFechaMovCaja = async () => {
    const codGrupoCia = '001';
    const codLocal = '001';
    setLoadingData(true);
    try {
      const { data: { success, data: result } } = await httpClient.post('posventa/getCajaDispoUsuario', {
        codGrupoCia,
        codLocal,
        secUsu: token.data.sec_usu_local
      });
      if (success) {
        const { data: { success: successFechaMov, data: fechaMovCaja, message } } = await httpClient.post('posventa/getFechaMovCaja', {
          codGrupoCia,
          codLocal,
          numCaja: result
        });

        const { data: { success: successFechaSistema, data: fechaSistema } } = await httpClient.get('posventa/getFechaHoraDB');

        if (fechaMovCaja.length > 0 && fechaMovCaja.substring(0, 5) !== fechaSistema.substring(0, 5)) {
          showModal('Debe CERRAR su caja para empezar un NUEVO DIA.\n La fecha actual no coincide con la Fecha de Apertura de Caja.');
          setDisabledAll(true);
        }
        else {
          setDisabledAll(false);
          setVisibleModal(true);
        }
        setLoadingData(false);
      }
    } catch (e) {
      showModal('Error al obtener la fecha de movimiento de caja');
    }
  }

  const showModal = (message) => {
    modal.info({
      title: 'Sistema',
      content: (
        <>
          {message}
        </>
      ),
      okText: 'Aceptar',
      centered: true
    });
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  useEffect(() => {
    getFechaMovCaja();
  }, [])

  return (
    <>
      <Card title={
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '280px auto 100px',
            gridTemplateRows: '1fr',
            gridColumnGap: '0px',
            gridRowGap: '0px',
            overflowX: 'auto'
          }}
        >
          <div style={{
            gridArea: '1 / 1 / 2 / 2',
            fontSize: '22px',
            marginTop: '15px'
          }}>
            Generar Pedido
          </div>
          <div
            style={{
              gridArea: '1 / 2 / 2 / 3',
              display: 'flex',
              flexDirection: 'row-reverse',
            }}
          >
            <Form
              // ref={formSearch}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                gap: '10px',
              }}
            >
              <Form.Item name="codPaciente" style={{ width: '30%', margin: 0 }}>
                <AutoComplete
                  disabled={disabledAll}
                  // value={valueCOD}
                  // options={optionsCOD}
                  // onSearch={onSearchCOD}
                  // onSelect={onSelectCOD}
                  // onChange={onChangeCOD}
                  style={{ width: '100%' }}
                  placeholder="Nombre de Producto"
                />
              </Form.Item>
            </Form>
          </div>
          <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row-reverse',
              }}
            >
              {/* <Button
                // loading={loading}
                style={{
                  backgroundColor: '#04B0AD',
                  color: 'white',
                  marginTop: '10px'
                }}
                // onClick={() => buscarHistorial()}
                // disabled={btnBuscar}
              >
                <SearchOutlined />
              </Button> */}
              <Button
                // loading={loading}
                style={{
                  backgroundColor: '#0169aa',
                  color: 'white',
                  marginTop: '10px'
                }}
                // onClick={() => buscarHistorial()}
                disabled={disabledAll}
              >
                Datos Atención
              </Button>
              <Button
                style={{
                  backgroundColor: '#0169aa',
                  color: 'white',
                  marginTop: '10px'
                }}
                onClick={() => setVisibleModal(true)}
                disabled={disabledAll}
                loading={loadingData}
              >
                Lista
              </Button>
            </div>
        </div>
      }>
        <Row
          justify='start'
          style={{
            gap: '20px 80px',
            marginLeft: 10,
            marginBottom: 10
          }}
        >
          <span>Fecha: {moment().format('DD/MM/yyyy')}</span>
          <span>Tipo Cambio: {dataDetallesFinally.tipoCambio}</span>
          <span>Vendedor: {JSON.parse(localStorage.getItem('token'))?.data.login_usu}</span>
          <span>Ult. Pedido: _____</span>
        </Row>
        <Row
          style={{
            marginLeft: 10,
            marginBottom: 20
          }}
        >
          Relacion de Productos: {dataDetallesFinally.items} items
        </Row>
        {/* <Divider /> */}
        <Table
          rowSelection={{
            type: 'radio',
            ...rowSelection
          }}
          loading={loadingData}
          className="gx-table-responsive"
          columns={columns}
          dataSource={data}
          footer={() => (
            <Row
              justify='start'
              style={{
                gap: '20px 80px',
                marginLeft: 10,
                // marginBottom: 20,
                fontWeight: 'bold'
              }}
            >
              <span>Red. S/. 0.00</span>
              <span>I.G.V.: 15.25</span>
              <span>TOTAL: S/. {dataDetallesFinally.total}</span>
              <span>US: $ {dataDetallesFinally.totalDolar}</span>
            </Row>
          )}
          // loading={tableLoading}
        />
        <div style={{
          marginTop: 20
        }}>
          <Button
            disabled={disabledAll}
            style={{
              backgroundColor: '#0169aa',
              color: '#fff'
            }}
          >
            Grabar
          </Button>
          <Button
            disabled={disabledAll}
            style={{
              backgroundColor: '#0169aa',
              color: '#fff'
            }}
          >
            Cambiar Cantidad
          </Button>
          <Button
            disabled={disabledAll}
            style={{
              backgroundColor: '#0169aa',
              color: '#fff'
            }}
          >
            Borrar
          </Button>
          <Button
            disabled={disabledAll}
            style={{
              backgroundColor: '#0169aa',
              color: '#fff'
            }}
          >
            Cotizar
          </Button>
        </div>
      </Card>
      <ModalListaProductos
        visible={visibleModal}
        setVisible={setVisibleModal}
        chargeDetailsModalProducto={chargeDetailsModalProducto}
      />
      {contextHolder}
    </>
  )
}

export default GenerarPedido;
