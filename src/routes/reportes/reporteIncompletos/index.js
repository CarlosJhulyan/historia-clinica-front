import React, { 
	createRef, 
	useMemo, 
	useRef, 
	useState,
	useEffect
} from 'react';
import { 
	Button, 
	Card, 
	Form, 
	AutoComplete, 
	DatePicker, 
	Table, 
	Input,
	Select
} from 'antd';
import { getColumnSearchProps, notificaciones } from '../../../util/util';
import { FilePdfOutlined, SearchOutlined } from '@ant-design/icons';
import { httpClient } from '../../../util/Api';
import Moment from 'moment';
import axios from 'axios';
import locale from 'antd/es/date-picker/locale/es_ES';
import { ToastContainer } from 'react-toastify';
import ReactToPrint from 'react-to-print';

const { RangePicker } = DatePicker;

const ReporteIncompletos = () => {
	// const token = JSON.parse(sessionStorage.getItem('token'));
	const { Option } = Select;
	const [loading, setLoading] = useState(false);
	const [btnBuscar, setBtnBuscar] = useState(true);

	const [peticion, setPeticion] = useState(false);
	const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());
	const [valueEspecialidad, setValueEspecialidad] = useState('');
	const [optionsEspecialidad, setOptionsEspecialidad] = useState([]);
	const [valueCOD, setValueCOD] = useState('');
	const [optionsCOD, setOptionsCOD] = useState([]);
	const [valueNOM, setValueNOM] = useState('');
	const [optionsNOM, setOptionsNOM] = useState([]);
	const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);

	const formSearch = useMemo(() => createRef(), []);

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
		if (body.COD_MEDICO === undefined) {
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
		if (validator) {
			const { data: { data = [], success }, message } = await httpClient.post('auditoria/getAuditoria', body);
			data.forEach(data => {
				data.key = data.id;
			});
			setData(data);
			if (!success) {
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
			setLoadingEspecialidades(false);
			setOptionsEspecialidad(formatEspecialidades);
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
		// optionsEspecialidad.forEach(element => {
		// 	if (element.key === data) {
		// 		formSearch.current.setFieldsValue({
		// 			especialidad: element.especialidad,
		// 		});
		// 		setValueEspecialidad(data);
		// 	}
		// });
	};

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

	const onChangeEspecialidad = data => {
		formSearch.current.setFieldsValue({
			ESPECIALIDAD: data
		});
		setValueEspecialidad(data);
	}

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
			key: 'fecha',
			render: record => {
				const fechaParseada = Moment(record, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
				return <span>{fechaParseada}</span>;
			},
		},
		{
			title: 'Especialidad',
			dataIndex: 'especialidad',
			key: 'especialidad',
			...getColumnSearchProps('especialidad'),
		},
		{
			title: 'Medico',
			dataIndex: 'nom_medico',
			key: 'nom_medico',
			...getColumnSearchProps('nom_medico'),
		},
		{
			title: 'Paciente',
			dataIndex: 'nom_paciente',
			key: 'nom_paciente',
			...getColumnSearchProps('nom_paciente'),
		},
		{
			title: 'Estado',
			dataIndex: 'estado',
			key: 'estado',
			render: record => (
				<span>{record === 'G' ? 'GRABADO TEMPORAL' : 'ACTIVO'}</span>
			),
		},
		{
			title: 'Historia Clínica',
			dataIndex: 'hc',
			key: 'hc',
			...getColumnSearchProps('hc'),
		},
		{
			title: 'Puntaje',
			dataIndex: 'puntaje',
			key: 'puntaje',
		},
		{
			title: 'Campos',
			dataIndex: 'completos',
			key: 'completos',
			render: (record, data) => {
				let incompletos = [];
				let completos = [];

				const dataCompletos = {
					enfermedadActual: Boolean(Number(data.enfermedad_actual)),
					examenFisico: Boolean(Number(data.examen_fisico)),
					imagenes: Boolean(Number(data.imagenes)),
					interconsulta: Boolean(Number(data.interconsulta)),
					laboratorio: Boolean(Number(data.laboratorio)),
					procedimiento: Boolean(Number(data.procedimiento)),
					tratamiento: Boolean(Number(data.tratamiento)),
				};
				for (const key in dataCompletos) {
					let palabra = key.split(/(?=[A-Z])/);
					if (dataCompletos[key]) {
						completos.push(palabra.join(' '));
					} else {
						incompletos.push(palabra.join(' '));
					}
				}
				
				return (
					<div
						style={{
							display: 'flex',
							alignItems: 'start',
							justifyContent: 'start',
							flexDirection: 'row',
							gap: '20px',
						}}
					>
						<div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
							Completos:
							<ul>
								{completos.length > 0 &&
									completos.map(completo => (
										<li style={{ textTransform: 'capitalize' }}>{completo}</li>
									))}
							</ul>
						</div>
						<div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
							Incompletos:
							<ul>
								{incompletos.length > 0 &&
									incompletos.map(incompleto => (
										<li style={{ textTransform: 'capitalize' }}>{incompleto}</li>
									))}
							</ul>
						</div>
					</div>
				);
			},
		},
	];

	useEffect(() => {
		onSearchEspecialidad();
	}, [])

	return (
		<Card
			title={
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'start',
						gap: '5%',
						flexDirection: 'row',
						width: '100%',
						overflowX: 'auto'
					}}
				>
					<div style={{ fontSize: '22px' }}>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							Auditoria de historia clínica
						</div>
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
									gap: '20px',
								}}
							>
								<Form.Item name="COD_MEDICO" style={{ width: '20%', margin: 0 }} hidden>
									<Input style={{ width: '100%' }} placeholder="Codigo de medico" />
								</Form.Item>
								<Form.Item name="ESPECIALIDAD" style={{ width: '180px', margin: 0 }}>
									<Select
										disabled={loadingEspecialidades}
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
								<Form.Item name="nombrePaciente" style={{ width: '55%', margin: 0 }}>
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
								<Form.Item name="rangoFechas" style={{ width: '35%', margin: 0 }}>
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
							display: 'flex',
							flexDirection: 'row-reverse',
							paddingTop: '15px',
							gap: '20px',
						}}
					>
						<ReactToPrint
							pageStyle={pageStyle}
							trigger={() => (
								<Button
									title='PDF'
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										backgroundColor: '#04B0AD',
										color: 'white',
									}}
									disabled={!(data.length > 0)}
								>
									<FilePdfOutlined />
								</Button>
							)}
							content={() => impresionRef.current}
						/>
						<Button
							loading={loading}
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: '#04B0AD',
								color: 'white',
							}}
							onClick={() => buscarHistorial()}
							disabled={btnBuscar}
						>
							<SearchOutlined />
						</Button>
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
	);
};

export default ReporteIncompletos;
