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
import { SearchOutlined } from '@ant-design/icons';
import ModalListaProductos from './modalListaProductos';
import { httpClient } from '../../util/Api';

function GenerarPedido() {
  const [modal, contextHolder] = Modal.useModal();
  const [state, setState] = useState();
  const [visibleModal, setVisibleModal] = useState(false);
  const token = JSON.parse(localStorage.getItem('token'));
  const [data, setData] = useState([{
    codigo: '00000001',
    descripcion: '06 Sesion de masaje relajante x 30 minutos',
    unidad: 'UND',
    precio: '100.00',
    cantidad: '1',
    descuento: '',
    precio_venta: '100.00',
    total: '100.00'
  }])

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = clearFilters => {
    clearFilters();
    setState({ searchText: '' });
  };

  const columns = [
    {
      title: 'Código',
      dataIndex: 'codigo',
      key: 'codigo',
      ...getColumnSearchProps('codigo'),
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      width: '350px'
    },
    {
      title: 'Unidad',
      dataIndex: 'unidad',
      key: 'unidad'

    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
    },
    {
      title: '%Dscto',
      dataIndex: 'descuento',
      key: 'descuento',
    },
    {
      title: 'Precio Venta',
      dataIndex: 'precio_venta',
      key: 'precio_venta',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
  ];

  const getFechaMovCaja = async () => {
    const codGrupoCia = '001';
    const codLocal = '001';

    try {
      const { data: { success, data: result } } = await httpClient.post('posventa/getCajaDispoUsuario', {
        codGrupoCia,
        codLocal,
        secUsu: token.data.sec_usu_local
      });
      // console.log(result);
      if (success) {
        const { data: { success: successFechaMov, data: fechaMovCaja, message } } = await httpClient.post('posventa/getFechaMovCaja', {
          codGrupoCia,
          codLocal,
          numCaja: result
        });

        const { data: { success: successFechaSistema, data: fechaSistema } } = await httpClient.get('posventa/getFechaHoraDB');

        if (fechaMovCaja.length > 0 && fechaMovCaja.substring(0, 5) !== fechaSistema.substring(0, 5))
          showModal('Debe CERRAR su caja para empezar un NUEVO DIA.\n La fecha actual no coincide con la Fecha de Apertura de Caja.');
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
                  backgroundColor: '#04B0AD',
                  color: 'white',
                  marginTop: '10px'
                }}
                // onClick={() => buscarHistorial()}
                // disabled={btnBuscar}
              >
                Datos Atención
              </Button>
              <Button
                // loading={loading}
                style={{
                  backgroundColor: '#04B0AD',
                  color: 'white',
                  marginTop: '10px'
                }}
                onClick={() => setVisibleModal(true)}
                // disabled={btnBuscar}
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
          <span>Tipo Cambio: 3.34</span>
          <span>Vendedor: {JSON.parse(localStorage.getItem('token'))?.data.login_usu}</span>
          <span>Ult. Pedido: _____</span>
        </Row>
        <Row
          style={{
            marginLeft: 10,
            marginBottom: 20
          }}
        >
          Relacion de Productos: 1 items
        </Row>
        {/* <Divider /> */}
        <Table
          rowSelection={{
            type: 'radio',
            ...rowSelection
          }}
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
              <span>TOTAL: S/. 100.00</span>
              <span>US: $ 29.94</span>
            </Row>
          )}
          // loading={tableLoading}
        />
        <div style={{
          marginTop: 20
        }}>
          <Button type='primary'>
            Grabar
          </Button>
          <Button type='primary'>
            Cambiar Cantidad
          </Button>
          <Button type='primary'>
            Borrar
          </Button>
          <Button type='primary'>
            Cotizar
          </Button>
        </div>
      </Card>
      <ModalListaProductos
          visible={visibleModal}
          setVisible={setVisibleModal}
        />
      {contextHolder}
    </>
  )
}

export default GenerarPedido;
