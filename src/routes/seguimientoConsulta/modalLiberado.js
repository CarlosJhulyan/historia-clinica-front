import React, { useEffect, useState, createRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import 'moment/locale/es';
import locale from 'antd/es/date-picker/locale/es_ES';
import { Card, Form, Modal, Row, Col, Button, DatePicker, Select, Table, Tag, Input, Space } from 'antd';
import { httpClient } from '../../util/Api';
import { useSelector } from 'react-redux';

export const ModalLiberado = ({ abrirModalL, setAbrirModalL, comboEspecialidad, mapCodEstado }) => {
	const [dataPaciente, setDataPaciente] = useState([]);
	const [dataSource, setDataSource] = useState([]);
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const [data, setData] = useState({ fechaInicio: '', fechaFin: '', especialidad: '' });
	const [btnBuscar, setBtnBuscar] = useState(true);
	const [loading, setLoading] = useState(false);

	const [actual, setActual] = useState('TODOS');

	const abc = {};
	const formRef = createRef();

	for (const key in mapCodEstado) {
		if (Object.hasOwnProperty.call(mapCodEstado, key)) {
			const element = mapCodEstado[key];
			abc[element.key] = dataPaciente.filter(item => {
				return item.COD_ESTADO === element.key;
			});
		}
	}

	const handleChangeFechaInicio = e => {
		if (e !== null) {
			const fechaFormat = e.format('DD/MM/YYYY');
			setData({
				...data,
				fechaInicio: fechaFormat,
			});
		}
	};

	const handleChangeFechaFin = e => {
		if (e !== null) {
			const fechaFormat = e.format('DD/MM/YYYY');
			setData({
				...data,
				fechaFin: fechaFormat,
			});
		}
	};

	const filtroEspecialidad = (e, array) => {
		const qwe = array.filter(item => {
			return e.includes(item.ESPECIALIDAD);
		});
		if (qwe.length > 0) {
			setDataSource(qwe);
		} else if (e.length !== 0) {
			setDataSource([]);
		} else {
			setDataSource(array);
		}
	};

	const handleChangeEspecialidad = e => {
		if (actual === 'TODOS') {
			filtroEspecialidad(e, dataPaciente);
		} else {
			filtroEspecialidad(e, abc[actual]);
		}
	};

	const onClickBuscar = () => {
		const obj = {
			codGrupoCia: '001',
			fechaInicio: data.fechaInicio,
			fechaFin: data.fechaFin,
		};
		buscarHistorial(obj);
	};

	const buscarHistorial = async obj => {
		try {
			setLoading(true);
			const { data } = await httpClient.post('/admin/getListaLiberados', obj);
			console.log('BUSQUEDAAAA ATENCION LIBERADAS: ', data);
			if (data.success) {
				setDataPaciente(data.data);
				setDataSource(data.data);
				setLoading(false);
			}
		} catch (error) {
			console.log('ERROR: ', error);
			setLoading(false);
		}
	};

	useEffect(() => {
		if (data.fechaFin !== '' && data.fechaInicio !== '') {
			setBtnBuscar(false);
		} else {
			setBtnBuscar(true);
		}
	}, [data]);

	const [state, setState] = useState();

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
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{
              width: 90,
              background: themeSettingsGlobal.COD_COLOR_1,
              color: '#fff'
          }}
					>
						Buscar
					</Button>
					<Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
						Reiniciar
					</Button>
				</Space>
			</div>
		),
		filterIcon: filtered => <SearchOutlined style={{ color: filtered ? themeSettingsGlobal.COD_COLOR_1 : undefined }} />,
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
			title: 'User Libera',
			dataIndex: 'NVL_LOGIN_USU',
			key: 'NVL_LOGIN_USU',
			...getColumnSearchProps('NVL_LOGIN_USU'),
		},
		{
			title: 'Fecha y hora Libera',
			dataIndex: 'FECH_LIBERA',
			key: 'FECH_LIBERA',
			...getColumnSearchProps('FECH_LIBERA'),
		},
		{
			title: 'Motivo Libera',
			dataIndex: 'DESCRIPCION',
			key: 'DESCRIPCION',
			...getColumnSearchProps('DESCRIPCION'),
		},
		{
			title: 'Fecha Atención',
			dataIndex: 'FEC_CREA',
			key: 'FEC_CREA',
			...getColumnSearchProps('FEC_CREA'),
		},
		{
			title: 'Hora Atención',
			dataIndex: 'FEC_CREA_HORA',
			key: 'FEC_CREA_HORA',
			...getColumnSearchProps('FEC_CREA_HORA'),
		},
		{
			title: 'Nro HC',
			dataIndex: 'NRO_HC_FISICA',
			key: 'NRO_HC_FISICA',
			...getColumnSearchProps('NRO_HC_FISICA'),
		},
		{
			title: 'Paciente',
			dataIndex: 'NOMBRE',
			key: 'NOMBRE',
			...getColumnSearchProps('NOMBRE'),
		},
		{
			title: 'Edad',
			dataIndex: 'EDAD',
			key: 'EDAD',
			...getColumnSearchProps('EDAD'),
		},
		{
			title: 'Estado',
			dataIndex: 'ESTADO',
			key: 'ESTADO',
			render: (text, record) => {
				return {
					props: {
						style: {
							color: 'white',
							background:
								record.COD_ESTADO === 'A'
									? mapCodEstado.A.color
									: record.COD_ESTADO === 'C'
										? mapCodEstado.C.color
										: record.COD_ESTADO === 'G'
											? mapCodEstado.G.color
											: record.COD_ESTADO === 'P'
												? mapCodEstado.P.color
												: record.COD_ESTADO === 'T'
													? mapCodEstado.T.color
													: '',
						},
					},
					children: <div>{text}</div>,
				};
			},
			...getColumnSearchProps('ESTADO'),
		},
		{
			title: 'Medico',
			dataIndex: 'MEDICO',
			key: 'MEDICO',
			...getColumnSearchProps('MEDICO'),
		},
		{
			title: 'Especialidad',
			dataIndex: 'ESPECIALIDAD',
			key: 'ESPECIALIDAD',
			...getColumnSearchProps('ESPECIALIDAD'),
		},
	];

	useEffect(() => {
		if (actual === 'TODOS' || actual === 'A' || actual === 'C' || actual === 'G' || actual === 'P' || actual === 'PA' || actual === 'T') {
			formRef.current.setFieldsValue({ especialidad: [] });
		}
	}, [actual]);


	return (
		<Modal
			maskClosable={false}
			okText="Salir"
			cancelButtonProps={{ style: { display: 'none' } }}
			onOk={() => setAbrirModalL(false)}
			width={1000}
			title={<div style={{ fontSize: '22px' }}>Listado de Atenciones Liberadas</div>}
			visible={abrirModalL}
			onCancel={() => setAbrirModalL(false)}
      okType='default'
      okButtonProps={{
        style: {background:themeSettingsGlobal.COD_COLOR_1, color: '#fff', border:'none'}
      }}
		>
			<Form layout="vertical" ref={formRef}>
				<Row style={{ flexDirection: 'row', paddingLeft: '30px', paddingRight: '30px' }}>
					<Col lg={7} md={8} sm={12} xs={24}>
						<Form.Item name="fechaInicio" label="Fecha Inicio">
							<DatePicker
								format="DD/MM/YYYY"
								locale={locale}
								style={{ width: '100%' }}
								placeholder="Selecciona fecha de inicio"
								onChange={handleChangeFechaInicio}
							/>
						</Form.Item>
					</Col>

					<Col lg={7} md={8} sm={12} xs={24}>
						<Form.Item name="fechaFin" label="Fecha Fin">
							<DatePicker
								format="DD/MM/YYYY"
								locale={locale}
								style={{ width: '100%' }}
								placeholder="Selecciona fecha de fin"
								onChange={handleChangeFechaFin}
							/>
						</Form.Item>
					</Col>

					<Col lg={6} md={6} sm={12} xs={24}>
						<Form.Item name="especialidad" label="Especialidad">
							<Select
								mode="multiple"
								allowClear
								placeholder="Seleccione"
								onChange={handleChangeEspecialidad}
							>
								{comboEspecialidad?.map(element => {
									return (
										<Select.Option key={element.ID_CONSULTORIO} value={element.DESCRIPCION}>
											{element.DESCRIPCION}
										</Select.Option>
									);
								})}
							</Select>
						</Form.Item>
					</Col>

					<Col lg={4} md={8} sm={12} xs={24}>
						<Button
							loading={loading}
							disabled={btnBuscar}
							onClick={() => onClickBuscar()}
							style={{
                width: '100%',
                marginTop: '25px',
                background: themeSettingsGlobal.COD_COLOR_1,
                color: '#fff'
            }}
						>
							Buscar
						</Button>
					</Col>
				</Row>
			</Form>
			<Card title={<h3 style={{ marginLeft: '20px' }}>Lista de Pacientes</h3>}>
				<Table
					loading={loading}
					className="gx-table-responsive"
					columns={columns}
					dataSource={dataSource}
				></Table>
				<Row style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: '20px' }}>
					<Col lg={3} md={4} sm={12} xs={24}>
						<Button
							disabled={abc.T.length < 1}
							onClick={() => {
								setDataSource(abc.T);
								setActual('T');
							}}
							style={{ backgroundColor: mapCodEstado.T.color, margin: 0, padding: 0 }}
						>
							<Tag color="transparent">{abc.T.length}</Tag>
							<Tag>{mapCodEstado.T.text}</Tag>
						</Button>
					</Col>
					<Col lg={3} md={4} sm={12} xs={24}>
						<Button
							disabled={abc.PA.length < 1}
							onClick={() => {
								setDataSource(abc.PA);
								setActual('PA');
							}}
							style={{ backgroundColor: mapCodEstado.PA.color, margin: 0, padding: 0 }}
						>
							<Tag color="transparent">{abc.PA.length}</Tag>
							<Tag>{mapCodEstado.PA.text}</Tag>
						</Button>
					</Col>
					<Col lg={3} md={4} sm={12} xs={24}>
						<Button
							disabled={abc.P.length < 1}
							onClick={() => {
								setDataSource(abc.P);
								setActual('P');
							}}
							style={{ backgroundColor: mapCodEstado.P.color, margin: 0, padding: 0 }}
						>
							<Tag color="transparent">{abc.P.length}</Tag>
							<Tag>{mapCodEstado.P.text}</Tag>
						</Button>
					</Col>
					<Col lg={3} md={4} sm={12} xs={24}>
						<Button
							disabled={abc.G.length < 1}
							onClick={() => {
								setDataSource(abc.G);
								setActual('G');
							}}
							style={{ backgroundColor: mapCodEstado.G.color, margin: 0, padding: 0 }}
						>
							<Tag color="transparent">{abc.G.length}</Tag>
							<Tag>{mapCodEstado.G.text}</Tag>
						</Button>
					</Col>
					<Col lg={3} md={4} sm={12} xs={24}>
						<Button
							disabled={abc.C.length < 1}
							onClick={() => {
								setDataSource(abc.C);
								setActual('C');
							}}
							style={{ backgroundColor: mapCodEstado.C.color, margin: 0, padding: 0 }}
						>
							<Tag color="transparent">{abc.C.length}</Tag>
							<Tag>{mapCodEstado.C.text}</Tag>
						</Button>
					</Col>
					<Col lg={3} md={4} sm={12} xs={24}>
						<Button
							disabled={abc.A.length < 1}
							onClick={() => {
								setDataSource(abc.A);
								setActual('A');
							}}
							style={{ backgroundColor: mapCodEstado.A.color, margin: 0, padding: 0 }}
						>
							<Tag color="transparent">{abc.A.length}</Tag>
							<Tag>{mapCodEstado.A.text}</Tag>
						</Button>
					</Col>
					<Col lg={3} md={4} sm={12} xs={24}>
						<Button
							disabled={dataPaciente.length < 1}
							onClick={() => {
								setDataSource(dataPaciente);
								setActual('TODOS');
							}}
							style={{ backgroundColor: '#1A0602', margin: 0, padding: 0 }}
						>
							<Tag color="transparent">{dataPaciente.length}</Tag>
							<Tag>Ver Todos</Tag>
						</Button>
					</Col>
				</Row>
			</Card>
		</Modal>
	);
};
