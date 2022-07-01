import React, {
  createRef,
  useEffect, useMemo,
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
import { httpClient } from '../../util/Api';
import axios from 'axios';
import ModalTriajeDetalles from './modalTriajeDetalles';
import { openNotification } from '../../util/util';

function HistoricoPreTriaje() {
  const [peticion, setPeticion] = useState(false);
  const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());
  const [visibleModalDate, setVisibleModalDate] = useState(false);
  const [state, setState] = useState();
  const [data, setData] = useState([]);
  const [valuePaciente, setValuePaciente] = useState('');
  const [optionsPaciente, setOptionsPaciente] = useState([]);
  const [valueMedico, setValueMedico] = useState('');
  const [optionsMedico, setOptionsMedico] = useState([]);
  const formSearch = useMemo(() => createRef(), []);
  const [btnBuscar, setBtnBuscar] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [visibleModalTriaje, setVisibleModalTriaje] = useState(false);
  const [filaActual, setFilaActual] = useState({});
  const [stateDate, setStateDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);

  const searchPreTriaje = async () => {
    setBtnBuscar(true);
    setLoadingData(true);
    try {
      const { data: { data = [], success, message } } = await httpClient.post('preTriaje/searchPreTriaje', {
        FECHA_INICIO: moment(stateDate[0].startDate).format('yyyy-MM-DD'),
        FECHA_FIN: moment(stateDate[0].endDate).format('yyyy-MM-DD'),
        NUM_CMP: valueMedico,
        COD_PACIENTE: valuePaciente,
      });

      if (success) {
        if (data.length === 0) openNotification('Pre triaje', 'No se encontro registros', 'Warning');
        else openNotification('Pre triaje', message);
        setData(data.map((item, index) => {
          return {
            ...item,
            key: index
          }
        }));
      } else {
        openNotification('Pre triaje', message, 'Warning')
        setData([]);
      }
    } catch (e) {
      console.error(e);
    }
    setBtnBuscar(false);
    setLoadingData(false);
  }

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
          <Button onClick={() => {
            setFilaActual(record);
            setVisibleModalTriaje(true);
          }}>Detalles</Button>
        </span>
      ),
    },
  ];

  const onSearchPaciente = async () => {
    var nombre = formSearch.current.getFieldValue('nomPaciente');
    if (nombre ? nombre.length >= 4 : false) {
      setPeticion(true);
      setOptionsPaciente();
      const respuesta = await httpClient.post(
        'preTriaje/searchPacientes',
        {
          NOM_PACIENTE: nombre
        },
        { cancelToken: cancelSource.token }
      );
      const array1 = respuesta.data.data;

      const arrayFormat = array1.reduce((previus, current) => {
        const exist = previus.every(item => item.key !== current.key);
        const newData = exist ? Array.prototype.concat(previus, {
          ...current,
          label: (
            <div>
              <div style={{ color: '#a3a3a3' }}>{current.paciente}</div>
            </div>
          )
        }) : previus;
        return newData;
      }, [])

      setOptionsPaciente(arrayFormat);
    } else {
      if (peticion) {
        cancelSource.cancel('COD Cancelado');
        setCancelSource(axios.CancelToken.source());
      }
    }
  };

  const onSearchMedico = async () => {
    const nombre = formSearch.current.getFieldValue('nomMedico');
    if (nombre ? nombre.length >= 4 : false) {
      setPeticion(true);
      setOptionsMedico();
      const { data: { data = [] } } = await httpClient.post(
        'preTriaje/searchMedicos',
        {
          NOM_MEDICO: nombre,
        },
        { cancelToken: cancelSource.token }
      );

      const arrayFormat = data.reduce((previus, current) => {
        const exist = previus.every(item => item.key !== current.key);
        const newData = exist ? Array.prototype.concat(previus, {
          ...current,
          label: (
            <div>
              <div style={{ color: '#a3a3a3' }}>{current.medico}</div>
            </div>
          )
        }) : previus;
        return newData;
      }, [])

      setOptionsMedico(arrayFormat);
    } else {
      if (peticion) {
        cancelSource.cancel('NOM ancelado');
        setCancelSource(axios.CancelToken.source());
      }
    }
  };

  const onSelectMedico = data => {
    setValueMedico(data);
  };

  const onChangePaciente = data => {
    if (data.length <= 3) {
      setOptionsPaciente([]);
      setValuePaciente('');
    }
  };

  const onChangeMedico = data => {
    if (data.length <= 3) {
      setOptionsMedico([]);
      setValueMedico('');
    }
  };

  const onSelectPaciente = data => {
    setValuePaciente(data);
  };

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
                ref={formSearch}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  gap: '10px',
                }}
              >
                <Form.Item name="nomPaciente" style={{ width: '30%', margin: 0 }}>
                  <AutoComplete
                    value={valuePaciente}
                    options={optionsPaciente}
                    onSearch={onSearchPaciente}
                    onSelect={onSelectPaciente}
                    onChange={onChangePaciente}
                    style={{ width: '100%' }}
                    placeholder="Nombre de Paciente"
                  />
                </Form.Item>
                <Form.Item name="nomMedico" style={{ width: '30%', margin: 0 }}>
                  <AutoComplete
                    value={valueMedico}
                    options={optionsMedico}
                    onSearch={onSearchMedico}
                    onSelect={onSelectMedico}
                    onChange={onChangeMedico}
                    style={{ width: '100%' }}
                    placeholder="Nombre del médico"
                  />
                </Form.Item>
                <Form.Item name="rangoFechas" style={{ width: '20%', margin: 0 }}>
                  <Button
                    style={{
                      backgroundColor: '#04B0AD',
                      color: 'white',
                      marginTop: '12px'
                    }}
                    onClick={() => setVisibleModalDate(true)}
                    disabled={btnBuscar}
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
                  loading={btnBuscar}
                  style={{
                    backgroundColor: '#04B0AD',
                    color: 'white',
                    marginTop: '10px'
                  }}
                  onClick={searchPreTriaje}
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
            dataSource={data}
            loading={loadingData}
          />
      </Card>
      <Modal
        width='630px'
        centered
        closable={false}
        onCancel={() => setVisibleModalDate(false)}
        onOk={() => setVisibleModalDate(false)}
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
      {visibleModalTriaje && (
        <ModalTriajeDetalles
          visible={visibleModalTriaje}
          setVisible={setVisibleModalTriaje}
          filaActual={filaActual}
        />
      )}
    </>
  )
}

export default HistoricoPreTriaje;
