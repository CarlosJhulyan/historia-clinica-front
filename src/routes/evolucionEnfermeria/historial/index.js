import React, {
  createRef,
  useMemo,
  useState
} from 'react';
import {
  Card,
  Form,
  AutoComplete,
  Button,
  DatePicker,
  Table,
  notification,
  Modal
} from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/es_ES';
import moment from 'moment';
import axios from 'axios';

import { httpClient } from '../../../util/Api';
import { useSelector } from 'react-redux';

function Historial() {
  const { RangePicker } = DatePicker;
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
  const formSearch = useMemo(() => createRef(), []);
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [formValidate, setFormValidate] = useState(false);
  const [textDescription, setTextDescription] = useState('');
  const [visibleModalText, setVisibleModalText] = useState(false);
  const [peticion, setPeticion] = useState(false);
	const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());

  const [valueMED, setValueMED] = useState('');
	const [optionsMED, setOptionsMED] = useState([]);
  const [valuePAC, setValuePAC] = useState('');
	const [optionsPAC, setOptionsPAC] = useState([]);

  const openNotification = (type, message, description) => {
		notification[type]({
			message,
			description,
		});
	};

  const filtrarPorFecha = async () => {
    setLoadingData(true);
    const body = formSearch.current.getFieldsValue();
    if (body.rangoFechas !== undefined && body.rangoFechas !== null) {
			body.FECHA_INICIO = body.rangoFechas[0].format('YYYY-MM-DD');
			body.FECHA_FIN = body.rangoFechas[1].format('YYYY-MM-DD');
		}

    var validator = false;
		if (body.FECHA_INICIO && body.FECHA_FIN) {
			validator = true;
		}

    if (validator) {
      try {
        const { data: { data = [], message } } = await httpClient.post('evolucionEnfermeria/getByFecha', body);
        const dataFormat = data.map(item => {
          return {
            ...item,
            key: item.id
          }
        });
        setData(dataFormat);
        openNotification('success', 'Búsqueda', message);
      } catch (error) {
        setData([]);
        openNotification('warning', 'Error en la petición', error.message);
      }
    } else {
      openNotification('error', 'Algo salió mal', 'Por favor vuelve a intentarlo.');
    }
    setLoadingData(false);
  }

  const setModalInformation = (text) => {
    setTextDescription(text);
    setVisibleModalText(true);
  }

  const columns = [
		{
			title: 'Fecha',
			dataIndex: 'fecha',
			key: 'fecha',
      render: (fecha) => (
        <span>{moment(fecha).format('DD/MM/yyyy')}</span>
      )
		},
		{
			title: 'Hora',
			dataIndex: 'fecha',
			key: 'fecha',
      render: (fecha) => (
        <span>{moment(fecha).format('H:mm:ss')}</span>
      )
		},
    {
			title: 'Codigo Médico',
			dataIndex: 'cod_paciente',
			key: 'cod_paciente'
		},
    {
			title: 'Nombre Médico',
			dataIndex: 'nom_medico',
			key: 'nom_medico'
		},
    {
			title: 'Nombre Paciente',
			dataIndex: 'nom_paciente',
			key: 'nom_paciente'
		},
    {
			title: 'Código Paciente',
			dataIndex: 'cod_paciente',
			key: 'cod_paciente'
		},
    {
			title: 'Acción',
			dataIndex: 'narracion_estado',
			key: 'narracion_estado',
      render: (narracion) => (
        <Button
          style={{
            background: themeSettingsGlobal.COD_COLOR_1,
            color: '#fff'
          }}
          title='Ver Narración'
          onClick={() => setModalInformation(narracion)}>
            <EyeOutlined />
        </Button>
      )
		},
	];

  const onSearchMED = async () => {
		var nombre = formSearch.current.getFieldValue('NOM_MEDICO');
		if (nombre ? nombre.length >= 4 : false) {
			setPeticion(true);
			setOptionsMED();
			const { data: { data = [] } } = await httpClient.post(
				'evolucionEnfermeria/getMedicos',
				{
					NOM_MEDICO: nombre,
				},
				{ cancelToken: cancelSource.token }
			);
			const formatData = data.reduce((previus, value) => {
				const exist = previus.every(item => item.nom_medico !== value.nom_medico);
				const newData = exist ? Array.prototype.concat(previus, value) : previus;
				return newData;
			}, [])
			setOptionsMED(formatData);
		} else {
			if (peticion) {
				cancelSource.cancel('MED cancelado');
				setCancelSource(axios.CancelToken.source());
			}
		}
	};

  const onSelectMED = data => {
		optionsMED.forEach(element => {
			if (element.key === data) {
				formSearch.current.setFieldsValue({
					NOM_MEDICO: element.nom_medico
				});
				setValueMED(data);
			}
		});
	};

  const onChangeMED = data => {
		if (data.length <= 3) {
			setOptionsMED([]);
		}
	};

  const onSearchPAC = async () => {
		var nombre = formSearch.current.getFieldValue('NOM_PACIENTE');
		if (nombre ? nombre.length >= 4 : false) {
			setPeticion(true);
			setOptionsMED();
			const { data: { data = [] } } = await httpClient.post(
				'evolucionEnfermeria/getPacientes',
				{
					NOM_PACIENTE: nombre,
				},
				{ cancelToken: cancelSource.token }
			);

      const formatData = data.reduce((previus, value) => {
				const exist = previus.every(item => item.nom_paciente !== value.nom_paciente);
				const newData = exist ? Array.prototype.concat(previus, value) : previus;
				return newData;
			}, [])
			setOptionsPAC(formatData);
		} else {
			if (peticion) {
				cancelSource.cancel('PAC cancelado');
				setCancelSource(axios.CancelToken.source());
			}
		}
	};

  const onSelectPAC = data => {
		optionsPAC.forEach(element => {
			if (element.key === data) {
				formSearch.current.setFieldsValue({
					NOM_PACIENTE: element.nom_paciente
				});
				setValuePAC(data);
			}
		});
	};

  const onChangePAC = data => {
		if (data.length <= 3) {
			setOptionsPAC([]);
		}
	};

  return (
    <Card
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start',
            gap: '3%',
            flexDirection: 'row',
            width: '100%',
            overflowX: 'auto'
          }}>
          <div style={{ fontSize: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>Historial Evolución de Enfermería</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Form
              ref={formSearch}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'end',
                gap: '20px',
                }}>
              <Form.Item name="NOM_MEDICO" style={{ width: '30%', margin: 0 }}>
                <AutoComplete
                  value={valueMED}
                  options={optionsMED}
                  onSearch={onSearchMED}
                  onSelect={onSelectMED}
                  onChange={onChangeMED}
                  style={{ width: '100%' }}
                  placeholder="Nombre del médico"
                />
              </Form.Item>
              <Form.Item name="NOM_PACIENTE" style={{ width: '30%', margin: 0 }}>
                <AutoComplete
                  value={valuePAC}
                  options={optionsPAC}
                  onSearch={onSearchPAC}
                  onSelect={onSelectPAC}
                  onChange={onChangePAC}
                  style={{ width: '100%' }}
                  placeholder="Nombre del paciente"
                />
              </Form.Item>
              <Form.Item
                name="rangoFechas"
                style={{ margin: 0 }}>
                <RangePicker
                  placeholder={['Inicio', 'Fin']}
                  locale={locale}
                  ranges={{
                    Hoy: [moment(), moment()],
                    'Este Mes': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  onChange={e => {
                    if (e !== null && e !== undefined) {
                      setFormValidate(true);
                    } else {
                      setFormValidate(false);
                    }
                  }}
                />
              </Form.Item>
            </Form>
          </div>
          <div
            style={{
              flexDirection: 'row',
              paddingTop: '15px'
            }}>
            <Button
              loading={loadingData}
              onClick={filtrarPorFecha}
              disabled={!formValidate}
              style={{
                background: themeSettingsGlobal.COD_COLOR_1,
                color: '#fff'
              }}
            >
              <SearchOutlined />
            </Button>
          </div>
        </div>
      }>
      <Table
        className="gx-table-responsive"
        dataSource={data}
        loading={loadingData}
        columns={columns} />
      <Modal
        centered
        closable={false}
        title='Descripción de estado del paciente'
        visible={visibleModalText}
        onCancel={() => setVisibleModalText(false)}
        footer={false}
      >
          {textDescription}
      </Modal>
    </Card>
  )
}

export default Historial;
