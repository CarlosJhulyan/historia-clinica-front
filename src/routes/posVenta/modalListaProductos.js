import React, {
  useEffect,
  useState
} from 'react';
import {
  Card,
  Form,
  AutoComplete,
  Button,
  Table,
  Row,
  Input,
  Space,
  Select,
  Col,
  Modal
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { httpClient } from '../../util/Api';

function ModalListaProductos({ visible, setVisible }) {
  const [state, setState] = useState();
  const { Option } = Select;
  const [data, setData] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
  const [dataEspecialidades, setDataEspecialidades] = useState([]);

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
      dataIndex: 'CODIGO',
      key: 'CODIGO',
      ...getColumnSearchProps('CODIGO'),
    },
    {
      title: 'Descripción',
      dataIndex: 'DESCRIPCION',
      key: 'DESCRIPCION',
      width: '400px',
      ...getColumnSearchProps('DESCRIPCION'),
    },
    {
      title: 'Unidad',
      dataIndex: 'UNIDAD',
      key: 'UNIDAD'

    },
    {
      title: 'Marca',
      dataIndex: 'MARCA',
      key: 'MARCA',
    },
    {
      title: 'Precio',
      dataIndex: 'PRECIO',
      key: 'PRECIO',
    },
  ];

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

  const getListaProductos = async () => {
    setLoadingProductos(true);
    try {
      const { data: { success, data } } = await httpClient.post('posventa/getProductos', {
        codGrupoCia: '001',
        codLocal: '001'
      });

      if (success) {
        setData(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoadingProductos(false);
  }

  const getListaEspecialidades = async () => {
    setLoadingEspecialidades(true);
    try {
      const { data: { success, data } } = await httpClient.post('posventa/getEspecialidades', {
        codGrupoCia: '001',
        codLocal: '001'
      });

      if (success) {
        setDataEspecialidades(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoadingEspecialidades(false);
  }

  useEffect(() => {
    const charge = async () => {
      await getListaProductos();
      await getListaEspecialidades();
    };
    charge();
  }, [])

  return (
    <Modal
      centered
      width={1000}
      footer={false}
      visible={visible}
      onCancel={() => setVisible(false)}
      title={
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '300px auto 100px',
            gridTemplateRows: '1fr',
            gridColumnGap: '0px',
            gridRowGap: '0px',
            overflowX: 'auto'
          }}
        >
          <div style={{
            gridArea: '1 / 1 / 2 / 2',
            fontSize: '22px',
            marginTop: '15px',
          }}>
            Lista de Productos y Precios
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
                gap: '5px 10px',
              }}
            >
              <Form.Item name="ESPECIALIDAD" style={{ width: '30%', margin: 0 }}>
                <Select
                  // disabled={allEspecialidades || loadingEspecialidades}
                  mode='multiple'
                  // value={valueEspecialidad}
                  // loading={loadingEspecialidades}
                  // onChange={onChangeEspecialidad}
                  // onSelect={onSelectEspecialidad}
                  // style={{ width: '100%' }}
                  placeholder="Nombre de Producto"
                >
                  <Option value=''>Seleccionar</Option>)
                  {/* {
                    optionsEspecialidad.map(especialidad =>
                      <Option key={especialidad.key} value={especialidad.especialidad}>{especialidad.especialidad}</Option>)
                  } */}
                </Select>
              </Form.Item>
              <Form.Item name="codPaciente" style={{ width: '30%', margin: 0 }}>
                <AutoComplete
                  // value={valueCOD}
                  options={dataEspecialidades}
                  // onSearch={onSearchCOD}
                  // onSelect={onSelectCOD}
                  // onChange={onChangeCOD}
                  style={{ width: '100%' }}
                  disabled={loadingEspecialidades}
                  placeholder="Especialidades"
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
                Datos Pedido
              </Button>
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
                <SearchOutlined />
              </Button>
            </div>
        </div>
      }
    >
      <Row justify='space-between' style={{
        gap: 20
      }}>
        <Col
          span='10'
          style={{
            display: 'flex',
            gap: '20px 80px',
            marginBottom: 20
          }}
        >
          <span>Unidad: {moment().format('DD/MM/yyyy')}</span>
          <span>Precio: S/. 50.00</span>
          <span>Stock adic.: </span>
        </Col>
        <Col
          span='10'
          style={{
            display: 'flex',
            gap: '20px 100px',
            marginBottom: 20
          }}
        >
          <span>Items: 0</span>
          <span>Total Venta: S/. 0.00</span>
        </Col>
      </Row>
      {/* <Divider /> */}
      <Table
        pagination={{
          pageSize: 5,
          pageSizeOptions: []
        }}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        className="gx-table-responsive"
        columns={columns}
        dataSource={data}
        loading={loadingProductos}
      />
      <div style={{
        marginTop: 20
      }}>
        <Button type='primary'>
          Info Prod.
        </Button>
        <Button type='primary'>
          Cotizar
        </Button>
        <Button type='primary'>
          Ingresar Pedido/Cotizacion
        </Button>
        <Button type='primary'>
          Aceptar
        </Button>
        <Button type='default'>
          Ver Campañas
        </Button>
        <Button type='default'>
          Limpiar Filtro
        </Button>
      </div>
    </Modal>
  )
}

export default ModalListaProductos;
