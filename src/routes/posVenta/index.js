import React, {
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
  Col
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

function PosVenta() {
  const [data, setData] = useState([
    {
      key: 1,
      codigo: '001478',
      descripcion: '03 sesion de masaje relajante x 30 minutos',
      unidad: 'UND',
      marca: 'MASOTERAPIA',
      precio: '50.00'
    },
    {
      key: 2,
      codigo: '001480',
      descripcion: '06 Sesion de masaje decontracturannte x 30 minutos',
      unidad: 'UND',
      marca: 'MASOTERAPIA',
      precio: '200.00'
    },
    {
      key: 3,
      codigo: '001481',
      descripcion: '06 sesion de masaje relajante x 30 minutos',
      unidad: 'UND',
      marca: 'MASOTERAPIA',
      precio: '100.00'
    },
    {
      key: 4,
      codigo: '000648',
      descripcion: '17 Hidroxi progesterona',
      unidad: 'UND',
      marca: 'LABORATORIO',
      precio: '68.00'
    },
  ]);
  const [state, setState] = useState();
  const { Option } = Select;

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
      width: '400px'
    },
    {
      title: 'Unidad',
      dataIndex: 'unidad',
      key: 'unidad'

    },
    {
      title: 'Marca',
      dataIndex: 'marca',
      key: 'marca',
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
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

  return (
    <Card title={
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
            <Form.Item name="ESPECIALIDAD" style={{ width: '30%', margin: 0 }}>
              <Select
                // disabled={allEspecialidades || loadingEspecialidades}
                mode='multiple'
                // value={valueEspecialidad}
                // loading={loadingEspecialidades}
                // onChange={onChangeEspecialidad}
                // onSelect={onSelectEspecialidad}
                // style={{ width: '100%' }}
                placeholder="Especialidades"
              >
                <Option value=''>Seleccionar</Option>)
                {/* {
                  optionsEspecialidad.map(especialidad =>
                    <Option key={especialidad.key} value={especialidad.especialidad}>{especialidad.especialidad}</Option>)
                } */}
              </Select>
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
    }>
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
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
        className="gx-table-responsive" 
        columns={columns}
        dataSource={data}
        // footer={() => (
        //   <Row
        //     justify='start'
        //     style={{
        //       gap: '20px 80px',
        //       marginLeft: 10,
        //       // marginBottom: 20,
        //       fontWeight: 'bold'
        //     }}
        //   >
        //     <span>Red. S/. 0.00</span>
        //     <span>I.G.V.: 15.25</span>
        //     <span>TOTAL: S/. 100.00</span>
        //     <span>US: $ 29.94</span>
        //   </Row>
        // )}
        // loading={tableLoading}
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
    </Card>
  )
}

export default PosVenta;