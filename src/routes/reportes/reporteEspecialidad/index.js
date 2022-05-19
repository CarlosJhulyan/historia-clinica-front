import React, { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { 
	Button, 
	Card, 
	Form, 
	AutoComplete, 
	DatePicker, 
	Table, 
	Input,
	Col,
	Row,
	Select,
	Checkbox,
	Modal
} from 'antd';
import { 
	getColumnSearchProps,
	notificaciones 
} from '../../../util/util';
import { httpClient } from '../../../util/Api';
import Moment from 'moment';
import axios from 'axios';
import locale from 'antd/es/date-picker/locale/es_ES';
import { ToastContainer } from 'react-toastify';
import ReactToPrint from 'react-to-print';
import { StarOutlined, FilePdfOutlined, SearchOutlined } from '@ant-design/icons';
import LegendRanking from './LegendRanking';
import LegendSpecialtyWeight from './LegendSpecialtyWeight';
import { ExportReactCSV } from '../../../util/ExportReactCSV';
import moment from 'moment';

const { RangePicker } = DatePicker;

const ReporteEspecialidad = () => {
	const [loading, setLoading] = useState(false);
	const [btnBuscar, setBtnBuscar] = useState(true);
	const [visibleModalLegend, setVisibleModalLegend] = useState(false);
	const [peticion, setPeticion] = useState(false);
	const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());
	const [valueEspecialidad, setValueEspecialidad] = useState([]);
	const [optionsEspecialidad, setOptionsEspecialidad] = useState([]);
	const [valueCOD, setValueCOD] = useState('');
	const [optionsCOD, setOptionsCOD] = useState([]);
	const [valueNOM, setValueNOM] = useState('');
	const [optionsNOM, setOptionsNOM] = useState([]);
	const [allEspecialidades, setAllEspecialidades] = useState(false);
	const [csvData, setCsvData] = useState([]);
	const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);

	const formSearch = useMemo(() => createRef(), []);
	const { Option } = Select;
	const [data, setData] = useState([]);

	const pageStyle = `
		@page {
			size: landscape;
		}

		@media all {
			.pagebreak {
			display: none;
			}
		}

		@media print {
			.pagebreak {
			page-break-before: always;
			}
		}
		`;

	const impresionRef = useRef();

	const buscarHistorial = async () => {
		setLoading(true);
		const body = formSearch.current.getFieldsValue();
		if (body.COD_MEDICO === undefined || body.COD_MEDICO === null) {
			delete body.COD_MEDICO;
		}
		if (body.rangoFechas !== undefined && body.rangoFechas !== null) {
			body.FECHA_INICIO = body.rangoFechas[0].format('YYYY-MM-DD');
			body.FECHA_FIN = body.rangoFechas[1].format('YYYY-MM-DD');
		}
		delete body.rangoFechas;
		delete body.codPaciente;
		delete body.nombrePaciente;
		var validator = false;
		if (body.FECHA_INICIO && body.FECHA_FIN) {
			validator = true;
		}
		if (body.ESPECIALIDAD?.length <= 0 || body.ESPECIALIDAD === undefined) delete body.ESPECIALIDAD;
		if (!body.ESPECIALIDAD && !allEspecialidades && body.COD_MEDICO) {
			delete body.ESPECIALIDAD;
			body.TODOS = true;
		} else {
			body.TODOS = false;
		}
		if (validator) {
			
			const { data: { data = [] }, message } = await httpClient.post('auditoria/getAuditoriaxEspecialidad', body);
			const arreglo = [];
			const keys = Object.keys(data);
			let arrayCsv;

			for (let index = 0; index < keys.length; index++) {
				let mayor = data[keys[index]][0].puntaje;
				let menor = data[keys[index]][0].puntaje;
				let promedio = 0;
				let cantidad = 0;
				const estrellas = {
					1: 0,
					2: 0,
					3: 0,
					4: 0,
					5: 0,
				};
				data[keys[index]].forEach(element => {
					cantidad++;
					promedio += parseFloat(element.puntaje);
					if (parseFloat(element.puntaje) > mayor) {
						mayor = parseFloat(element.puntaje);
					}
					if (parseFloat(element.puntaje) < menor) {
						menor = parseFloat(element.puntaje);
					}
					if (element.estrellas === '1') {
						estrellas[1]++;
					}
					if (element.estrellas === '2') {
						estrellas[2]++;
					}
					if (element.estrellas === '3') {
						estrellas[3]++;
					}
					if (element.estrellas === '4') {
						estrellas[4]++;
					}
					if (element.estrellas === '5') {
						estrellas[5]++;
					}
				});
				arreglo.push({
					fecha: moment(data[keys[index]][0].fecha).format('DD/MM/yyyy'),
					nom_medico: data[keys[index]][0].nom_medico,
					cod_medico: data[keys[index]][0].cod_medico,
					especialidad: keys[index],
					mayor: mayor,
					menor: menor,
					promedio: promedio / cantidad,
					cantidad: cantidad,
					estrellas: estrellas,
					select: 
						body.TODOS ? body.COD_MEDICO === data[keys[index]][0].cod_medico : null,
					key: data[keys[index]][0].cod_medico
				});
				arrayCsv = arreglo.map(item => {
					return [
						item.fecha,
						item.especialidad, 
						item.cod_medico, 
						item.nom_medico,
						item.mayor,
						item.menor,
						item.promedio,
						item.cantidad,
						item.estrellas[1],
						item.estrellas[2],
						item.estrellas[3],
						item.estrellas[4],
						item.estrellas[5]
					];
				});
			}
			if (arreglo.length > 0) {
				setCsvData(Array.prototype.concat([["Fecha", "Especialidad", "Código Médico", "Nombre Médico", "Mayor Puntaje", "Menor Puntaje", "Puntaje Promedio", "Cantidad de Historias", "⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"]], arrayCsv));
			}
			setData(arreglo);
			if (!data.success) {
				notificaciones(message, 'Alerta');
			}
		} else {
			notificaciones('Debe ingresar un rango de fechas', 'Alerta');
			console.error('Completar datos');
		}
		setLoading(false);
	};

	const onSearchEspecialidad = async () => {
		setLoadingEspecialidades(true);
		try {
			const { data: { data = [] } } = await httpClient.post(
				'auditoria/getEspecialidades',
				{
					especialidad: 'w',
				},
				{ cancelToken: cancelSource.token }
			);

			const formatEspecialidades = data.reduce((previus, value) => {
				const exist = previus.every(item => item.especialidad !== value.especialidad);
				const newData = exist ? Array.prototype.concat(previus, value) : previus;
				return newData;
			}, [])
			setOptionsEspecialidad(formatEspecialidades);
			setLoadingEspecialidades(false);
		} catch (error) {
			cancelSource.cancel('Especialidad Cancelada');
			setCancelSource(axios.CancelToken.source());
		}
	};

	const onSearchCOD = async () => {
		var cod = formSearch.current.getFieldValue('codPaciente');
		if (cod ? cod.length >= 4 : false) {
			setPeticion(true);
			setOptionsCOD();
			const respuesta = await httpClient.post(
				'modulos/getDataMedicos',
				{
					num_cmp: cod,
					des_nom_medico: '',
				},
				{ cancelToken: cancelSource.token }
			);
			var array1 = respuesta.data.data;
			for (let i = 0; i < array1.length; i++) {
				if (array1[i].asignado === '0') {
					delete array1[i];
				} else {
					array1[i].key = array1[i].cod_medico;
					array1[i].value = array1[i].cod_medico;
					array1[i].label = (
						<div>
							{array1[i].num_cmp}
							<div style={{ color: '#a3a3a3' }}>{array1[i].des_ape_medico}</div>
						</div>
					);
				}
			}
			setOptionsNOM();
			setOptionsCOD(array1);
		} else {
			if (peticion) {
				cancelSource.cancel('COD Cancelado');
				setCancelSource(axios.CancelToken.source());
			}
		}
	};

	const onSearchNOM = async () => {
		var nombre = formSearch.current.getFieldValue('nombrePaciente');
		if (nombre ? nombre.length >= 4 : false) {
			setPeticion(true);
			setOptionsNOM();
			const { data: { data = [] } } = await httpClient.post(
				'modulos/getDataMedicos',
				{
					num_cmp: '',
					des_nom_medico: nombre,
				},
				{ cancelToken: cancelSource.token }
			);
			
			for (let i = 0; i < data.length; i++) {
				if (data[i].asignado === '0') {
					delete data[i];
				} else {
					data[i].key = data[i].cod_medico;
					data[i].value = data[i].cod_medico;
					data[i].label = (
						<div>
							{data[i].des_nom_medico}
							<div style={{ color: '#a3a3a3' }}>{data[i].des_ape_medico}</div>
						</div>
					);
				}
			}
			setOptionsCOD();
			setOptionsNOM(data);
		} else {
			if (peticion) {
				cancelSource.cancel('NOM ancelado');
				setCancelSource(axios.CancelToken.source());
			}
		}
	};

	const onSelectEspecialidad = data => {
		// formSearch.current.setFieldsValue({
		// 	ESPECIALIDAD: data,
		// });
		// setValueEspecialidad(data);
	};

	const onChangeEspecialidad = data => {
		formSearch.current.setFieldsValue({
			ESPECIALIDAD: data
		});
		setValueEspecialidad(data);
	}

	const onSelectCOD = data => {
		optionsCOD.forEach(element => {
			if (element.key === data) {
				formSearch.current.setFieldsValue({
					COD_MEDICO: element.cod_medico,
					codPaciente: element.num_cmp,
					nombrePaciente: `${element.des_nom_medico + ' ' + element.des_ape_medico}`,
				});
				setValueCOD(data);
			}
		});
	};

	const handleChangeAllEspecialidades = e => {
		setAllEspecialidades(e.target.checked);
		if (e.target.checked) {
			formSearch.current.setFieldsValue({
				ESPECIALIDAD: []
			});
		} else {
			formSearch.current.setFieldsValue({
				ESPECIALIDAD: valueEspecialidad
			});
		}
	}

	const onSelectNOM = data => {
		optionsNOM.forEach(element => {
			if (element.key === data) {
				formSearch.current.setFieldsValue({
					COD_MEDICO: element.cod_medico,
					codPaciente: element.num_cmp,
					nombrePaciente: `${element.des_nom_medico + ' ' + element.des_ape_medico}`,
				});
				setValueNOM(data);
			}
		});
	};

	const onChangeCOD = data => {
		if (data.length <= 3) {
			setOptionsCOD([]);
		}
	};

	const onChangeNOM = data => {
		if (data.length <= 3) {
			setOptionsNOM([]);
			formSearch.current.setFieldsValue({
				COD_MEDICO: null
			});
		}
	};

	const columns = [
		{
			title: 'Fecha',
			dataIndex: 'fecha',
			key: 'fecha'
		},
		{
			title: 'Especialidad',
			dataIndex: 'especialidad',
			key: 'especialidad',
			...getColumnSearchProps('especialidad'),
		},
		{
			title: 'Codigo Médico',
			dataIndex: 'cod_medico',
			...getColumnSearchProps('cod_medico'),
		},
		{
			title: 'Nombre Médico',
			dataIndex: 'nom_medico',
			render: (nom_medico, item) => (
				<span style={{ background: item.select ? '#D1D100' : 'transparent' }}>{nom_medico}</span>
			),
			...getColumnSearchProps('nom_medico'),
		},
		{
			title: 'Mayor puntaje',
			dataIndex: 'mayor',
			key: 'mayor',
		},
		{
			title: 'Menor puntaje',
			dataIndex: 'menor',
			key: 'menor',
		},
		{
			title: 'Puntaje promedio',
			dataIndex: 'promedio',
			key: 'promedio',
			render: (promedio) => (
				<span>{Math.round(promedio)}</span>
			)
		},
		{
			title: 'Cantidad de historias',
			dataIndex: 'cantidad',
			key: 'cantidad',
		},
		{
			title: () => (
				<div>
					<StarOutlined style={{ color: '#D1D100' }} />
				</div>
			),
			dataIndex: ['estrellas', 1],
			key: 'estrellas',
			align: 'center',
		},
		{
			title: () => (
				<div>
					<StarOutlined style={{ color: '#D1D100' }} />
					<StarOutlined style={{ color: '#D1D100' }} />
				</div>
			),
			dataIndex: ['estrellas', 2],
			key: 'estrellas',
			align: 'center',
		},
		{
			title: () => (
				<div>
					<StarOutlined style={{ color: '#D1D100' }} />
					<StarOutlined style={{ color: '#D1D100' }} />
					<StarOutlined style={{ color: '#D1D100' }} />
				</div>
			),
			dataIndex: ['estrellas', 3],
			key: 'estrellas',
			align: 'center',
		},
		{
			title: () => (
				<div>
					<StarOutlined style={{ color: '#D1D100' }} />
					<StarOutlined style={{ color: '#D1D100' }} />
					<StarOutlined style={{ color: '#D1D100' }} />
					<StarOutlined style={{ color: '#D1D100' }} />
				</div>
			),
			dataIndex: ['estrellas', 4],
			key: 'estrellas',
			align: 'center',
		},
		{
			title: () => (
				<div>
					<StarOutlined style={{ color: '#D1D100' }} />
					<StarOutlined style={{ color: '#D1D100' }} />
					<StarOutlined style={{ color: '#D1D100' }} />
					<StarOutlined style={{ color: '#D1D100' }} />
					<StarOutlined style={{ color: '#D1D100' }} />
				</div>
			),
			dataIndex: ['estrellas', 5],
			key: 'estrellas',
			align: 'center',
		},
	];

	useEffect(() => {
		onSearchEspecialidad();
	}, [])

	return (
		<>
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
						}}
					>
						<div style={{ fontSize: '22px' }}>
							<div style={{ display: 'flex', alignItems: 'center' }}>Auditoria por especialidad</div>
						</div>
						<div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
							<div
								style={{
									gridArea: '1 / 2 / 2 / 3',
									display: 'flex',
									flexDirection: 'row-reverse',
									width: '100%',
									margin: 0,
									// padding: 0
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
									<Form.Item name="COD_MEDICO" style={{ width: '20%', margin: 0 }} hidden>
										<Input style={{ width: '100%' }} placeholder="Codigo de medico" />
									</Form.Item>

									<Form.Item style={{ margin: 0 }}>
										<Checkbox
											name='TODOS'
											checked={allEspecialidades}
											onChange={handleChangeAllEspecialidades}>
												Todas las
										</Checkbox>
									</Form.Item>
									
									<Form.Item name="ESPECIALIDAD" style={{ width: '150px', margin: 0 }}>
										<Select
											disabled={allEspecialidades || loadingEspecialidades}
											mode='multiple'
											value={valueEspecialidad}
											loading={loadingEspecialidades}
											onChange={onChangeEspecialidad}
											onSelect={onSelectEspecialidad}
											style={{ width: '100%' }}
											placeholder="Especialidades"
										>
											{
												optionsEspecialidad.map(especialidad =>
													<Option key={especialidad.key} value={especialidad.especialidad}>{especialidad.especialidad}</Option>)
											}
										</Select>
									</Form.Item>

									<Form.Item name="codPaciente" style={{ width: '20%', margin: 0 }} hidden>
										<AutoComplete
											value={valueCOD}
											options={optionsCOD}
											onSearch={onSearchCOD}
											onSelect={onSelectCOD}
											onChange={onChangeCOD}
											style={{ width: '100%' }}
											placeholder="CMP"
										/>
									</Form.Item>
									<Form.Item name="nombrePaciente" style={{ width: '30%', margin: 0 }}>
										<AutoComplete
											value={valueNOM}
											options={optionsNOM}
											onSearch={onSearchNOM}
											onSelect={onSelectNOM}
											onChange={onChangeNOM}
											style={{ width: '100%' }}
											placeholder="Nombre del médico"
										/>
									</Form.Item>
									<Form.Item name="rangoFechas" style={{ width: '20%', margin: 0 }}>
										<RangePicker
											placeholder={['Inicio', 'Fin']}
											style={{ width: '100%' }}
											locale={locale}
											ranges={{
												Hoy: [Moment(), Moment()],
												'Este Mes': [Moment().startOf('month'), Moment().endOf('month')],
											}}
											onChange={e => {
												if (e !== null && e !== undefined) {
													setBtnBuscar(false);
												} else {
													setBtnBuscar(true);
												}
											}}
										/>
									</Form.Item>
								</Form>
							</div>
						</div>
						<div
							style={{
								flexDirection: 'row-reverse',
								paddingTop: '15px'
							}}
						>
							<Button
								loading={loading}
								style={{
									backgroundColor: '#04B0AD',
									color: 'white',
								}}
								onClick={() => buscarHistorial()}
								disabled={btnBuscar}
							>
								<SearchOutlined />
							</Button>
							<ReactToPrint
								pageStyle={pageStyle}
								trigger={() => (
									<Button
									title='PDF'
										style={{
											backgroundColor: '#04B0AD',
											color: 'white'
										}}
										disabled={!(data.length > 0)}
									>
										<FilePdfOutlined />
									</Button>
								)}
								content={() => impresionRef.current}
							/>
							<ExportReactCSV 
								title='Excel'
								csvData={csvData}
								fileName={`Auditoria_especialidad_${Date.now()}`}
								style={{
									backgroundColor: '#04B0AD',
									color: 'white',
								}}
								disabled={!(data.length > 0)} />
						</div>
					</div>
				}
			>
				<div ref={impresionRef}>
					<Table
						className="gx-table-responsive"
						columns={columns}
						dataSource={data}
						loading={loading}
					/>
				</div>
				<ToastContainer pauseOnHover={false} />
			</Card>
			<Row style={{ marginBottom: 30 }}>
				<Col xs={12} sm={13} md={16} lg={17} xl={18}>
					<LegendRanking />
				</Col>
				<Col xs={5} sm={5} md={6} lg={6} xl={6} style={{ textAlign: 'right' }}>
					<Button onClick={() => setVisibleModalLegend(true)}>Ver Leyenda Puntaje por Formulario</Button>
				</Col>
			</Row>

			<Modal
				closable={false}
				visible={visibleModalLegend}
				onCancel={() => setVisibleModalLegend(false)}
				footer={false}>
				<LegendSpecialtyWeight />
			</Modal>
		</>
	);
};

export default ReporteEspecialidad;
