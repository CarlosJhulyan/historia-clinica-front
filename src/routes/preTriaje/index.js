import React, {
  useEffect,
  useState
} from 'react';
import { 
  Card,
  Form,
  Input,
  AutoComplete,
  Button,
  Table,
  Space,
  Modal
} from 'antd';
import {
  SearchOutlined,

} from '@ant-design/icons';
import { addDays } from 'date-fns';
import moment from 'moment';
import { DateRangePicker } from 'react-date-range';
import { es } from 'react-date-range/dist/locale';
import 'react-date-range/dist/styles.css';
import './styles.css';

function HistoricoPreTriaje() {
  const [visibleModalDate, setVisibleModalDate] = useState(false);
  const [state, setState] = useState();

  const [stateDate, setStateDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);

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
      title: 'Fecha',
      dataIndex: 'fec_crea',
      key: 'fecha',
      render: (fecha) => (
        <span>{moment(fecha, 'yyyy-MM-DD HH:mm:ss').format('DD/MM/yyyy')}</span>
      )
    },
    {
      title: 'Hora',
      dataIndex: 'fec_crea',
      key: 'hora',
      render: (hora) => (
        <span>{moment(hora, 'yyyy-MM-DD HH:mm:ss').format('HH:mm:ss')}</span>
      )

    },
    {
      title: 'Numero HC',
      dataIndex: 'nro_hc',
      key: 'nro_hc'

    },
    {
      title: 'Paciente',
      dataIndex: 'paciente',
      key: 'paciente',
      ...getColumnSearchProps('PACIENTE'),

    },
    {
      title: 'Medico',
      dataIndex: 'medico',
      key: 'medico',
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (record) => (
        <span>
          <Button onClick={() => {}}>Detalles</Button>
        </span>
      ),
    },
  ];

  useEffect(() => {
    const labels = document.querySelectorAll('.rdrStaticRangeLabel');
    const labels2 = document.querySelectorAll('.rdrInputRange');
    if (labels.length > 0) {
      labels[0].innerHTML = 'Hoy';
      labels[1].innerHTML = 'Ayer';
      labels[2].innerHTML = 'Esta semana';
      labels[3].innerHTML = 'La semana pasada';
      labels[4].innerHTML = 'Este mes';
      labels[5].innerHTML = 'El mes pasado';
    }
    if (labels2.length > 0) {
      labels2[0].children[1].innerHTML = 'dias hasta hoy';
      labels2[1].children[1].innerHTML = 'dias después de hoy'
    }
  }, [visibleModalDate])

  return (
    <>
      <Card
        title={
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '280px auto 100px',
              gridTemplateRows: '1fr',
              gridColumnGap: '0px',
              gridRowGap: '0px',
              marginRight: '5%',
              overflowX: 'auto'
            }}
          >
            <div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px', marginTop: '30px' }}>Historico de Pre triaje</div>
            <div
              style={{
                gridArea: '1 / 2 / 2 / 3',
                display: 'flex',
                flexDirection: 'row-reverse',
                paddingTop: '15px',
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
                    placeholder="Nombre de Paciente"
                  />
                </Form.Item>
                <Form.Item name="nombrePaciente" style={{ width: '30%', margin: 0 }}>
                  <AutoComplete
                    // value={valueNOM}
                    // options={optionsNOM}
                    // onSearch={onSearchNOM}
                    // onSelect={onSelectNOM}
                    // onChange={onChangeNOM}
                    style={{ width: '100%' }}
                    placeholder="Nombre del médico"
                  />
                </Form.Item>
                <Form.Item name="rangoFechas" style={{ width: '20%', margin: 0 }}>
                  <Button
                    // loading={loading}
                    style={{
                      backgroundColor: '#04B0AD',
                      color: 'white',
                      marginTop: '12px'
                    }}
                    onClick={() => setVisibleModalDate(true)}
                    // disabled={btnBuscar}
                  >
                    Filtrar por fecha
                  </Button>    
                </Form.Item> 
              </Form>
            </div>
            <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row-reverse',
                  paddingTop: '15px'
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
                  <SearchOutlined />
                </Button>              
              </div>
          </div>
        }>
          <Table 
            className="gx-table-responsive" 
            columns={columns}
            // dataSource={data} 
            // loading={tableLoading} 
          />
      </Card>
      <Modal
        width='630px'
        centered
        closable={false}
        onCancel={() => setVisibleModalDate(false)}
        visible={visibleModalDate}>
          <DateRangePicker
            onChange={item => setStateDate([item.selection])}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={stateDate}
            direction="vertical"
            locale={es}
          />
      </Modal>
    </>
  )
}

export default HistoricoPreTriaje;