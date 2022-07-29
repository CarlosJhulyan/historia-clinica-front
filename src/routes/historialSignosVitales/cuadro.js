import React, { createRef, useMemo, useState } from 'react';
import { Button, Card, Form, AutoComplete, DatePicker, Spin, Row, Col, Divider } from 'antd';
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { notificaciones } from '../../util/util';
import { httpClient } from '../../util/Api';
import Moment from 'moment';
import axios from 'axios';
import locale from 'antd/es/date-picker/locale/es_ES';
import { useSelector } from 'react-redux';

const CustomFC = ({ cx, cy }) => {
	return (
		<svg
			x={cx - 5}
			y={cy - 5}
			width="10"
			height="10"
			viewBox="0 0 10 10"
			fill="blue"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect x="0.5" y="0.5" width="9" height="9" fill="blue" stroke="blue" />
		</svg>
	);
};

const CustomT = ({ cx, cy }) => {
	return (
		<svg
			x={cx - 5}
			y={cy - 5}
			width="10"
			height="10"
			viewBox="0 0 10 10"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect x="0.5" y="0.5" width="9" height="9" fill="white" stroke="#FF0000" />
		</svg>
	);
};

const CustomFR = ({ cx, cy }) => {
	return (
		<svg
			x={cx - 6}
			y={cy - 6}
			width="12"
			height="12"
			viewBox="0 0 12 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M1 1L11 11M11 1L1 11" stroke="black" />
		</svg>
	);
};

const CustomPA = ({ x, y, width, height }) => {
	return (
		<svg
			x={x}
			y={y}
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			fill="#008000"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d={`M${width / 2} 1V${height}M0 1H${width}M0 ${height}H${width}`} stroke="#008000" />
		</svg>
	);
};

const CustomLegend = ({ payload }) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '45px', margin: '0 0 -10px 30px' }}>
			{payload.map((entry, index) => (
				<div key={`item-${index}`}>{entry.value}</div>
			))}
		</div>
	);
};

const Cuadro = () => {
	const token = JSON.parse(localStorage.getItem('token'));
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const [loading, setLoading] = useState(false);
	const [paciente, setPaciente] = useState();

	const [peticion, setPeticion] = useState(false);
	const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());
	const [valueCOD, setValueCOD] = useState('');
	const [optionsCOD, setOptionsCOD] = useState([]);
	const [valueNOM, setValueNOM] = useState('');
	const [optionsNOM, setOptionsNOM] = useState([]);

	const formRef = useMemo(() => createRef(), []);
	const formSearch = useMemo(() => createRef(), []);

	const [data, setData] = useState([]);
	const [balance, setBalance] = useState([]);

	const buscarHistorial = async () => {
		setLoading(true);
		const body = formSearch.current.getFieldsValue();
		var auxValidator = body.codPaciente;
		if (body.rangoFechas !== undefined) {
			body.fechaI = Moment()
				.isoWeek(body.rangoFechas.isoWeek())
				.startOf('isoWeek')
				.format('YYYY-MM-DD');
			body.fechaF = Moment()
				.isoWeek(body.rangoFechas.isoWeek())
				.endOf('isoWeek')
				.add(1, 'd')
				.format('YYYY-MM-DD');
		}
		if (body.codPaciente !== undefined) {
			body.historiaClinica = paciente.historia;
		}
		delete body.rangoFechas;
		delete body.codPaciente;
		delete body.nombrePaciente;
		var validator = false;
		console.log(auxValidator);
		if (body.fechaI && body.fechaF && auxValidator && body.historiaClinica.length > 0) {
			validator = true;
		}
		if (validator) {
			var arregloSignos = [];
			var arregloBalance = {
				egresos: [],
				ingresos: [],
				labelEgresos: ['Deposición', 'Diuresis', 'Temperatura'],
				labelIngresos: ['Oral', 'Parental', 'Tratamiento'],
				pesos: [],
				turnos: [],
				respiracion: [],
				total: [],
				fecha: [],
				totalEgresos: [],
				totalIngresos: [],
			};
			const response = await httpClient.post('vitales/getRangeSignosVitales', body);
			response.data.data[0].sort((a, b) => Moment(a.fecha).unix() - Moment(b.fecha).unix());
			response.data.data[0].forEach(element => {
				if (element.id_signos_vitales) {
					// if (element.turno === 'M') {
					arregloSignos.push({
						turno: element.turno,
						'P/A': [parseFloat(element.p_a.split('-')[0]), parseFloat(element.p_a.split('-')[1])],
						FC: parseFloat(element.pulso),
						Tº: parseFloat(element.temperatura),
						// FR: parseFloat(element.respiracion),
					});
					arregloBalance['respiracion'].push(parseFloat(element.respiracion));
					arregloBalance['turnos'].push(element.turno);
					// }
				}
			});
			response.data.data[1].forEach(element => {
				if (element.id_balance_hidrico) {
					arregloBalance['fecha'].push(Moment(element.fecha).format('DD/MM/YYYY'));
					// arregloBalance['ingresos'].push([
					// 	parseFloat(element.i_oral_0814 ? element.i_oral_0814 : 0) +
					// 		parseFloat(element.i_oral_1420 ? element.i_oral_1420 : 0) +
					// 		parseFloat(element.i_oral_2008 ? element.i_oral_2008 : 0),
					// 	parseFloat(element.i_parental_0814 ? element.i_parental_0814 : 0) +
					// 		parseFloat(element.i_parental_1420 ? element.i_parental_1420 : 0) +
					// 		parseFloat(element.i_parental_2008 ? element.i_parental_2008 : 0),
					// 	parseFloat(element.i_tratamiento_0814 ? element.i_tratamiento_0814 : 0) +
					// 		parseFloat(element.i_tratamiento_1420 ? element.i_tratamiento_1420 : 0) +
					// 		parseFloat(element.i_tratamiento_2008 ? element.i_tratamiento_2008 : 0),
					// 	parseFloat(element.i_valor_0814 ? element.i_valor_0814 : 0) +
					// 		parseFloat(element.i_valor_1420 ? element.i_valor_1420 : 0) +
					// 		parseFloat(element.i_valor_2008 ? element.i_valor_2008 : 0),
					// ]);
					// if (
					// 	element.e_opcional !== null
					// 		? !arregloBalance['labelEgresos'][3]?.includes(element.e_opcional)
					// 		: false
					// ) {
					// 	arregloBalance['labelEgresos'].push(element.e_opcional);
					// }
					arregloBalance['pesos'].push(parseFloat(element.peso ? element.peso : 0));
					arregloBalance['total'].push(element.balance_hidrico);
				}
			});
			setData(arregloSignos);
			setBalance(arregloBalance);
			if (!response.data.success) {
				notificaciones(response.message, 'Alerta');
			}
		} else {
			notificaciones('Debe llenar los filtros de busqueda', 'Alerta');
			console.error('Completar datos');
		}
		setLoading(false);
	};

	const onSearchCOD = async searchText => {
		var cod = formSearch.current.getFieldValue('codPaciente');
		if (cod ? cod.length >= 4 : false) {
			setPeticion(true);
			setOptionsCOD();
			const respuesta = await httpClient.post(
				'camas/getPacientes',
				{
					codPaciente: cod,
					nombre: '',
				},
				{ cancelToken: cancelSource.token }
			);
			var array1 = respuesta.data.data;
			for (let i = 0; i < array1.length; i++) {
				if (array1[i].asignado === '0') {
					delete array1[i];
				} else {
					array1[i].key = array1[i].cod_paciente;
					array1[i].value = array1[i].cod_paciente;
					array1[i].label = (
						<div>
							{array1[i].historia_clinica}
							<div style={{ color: '#a3a3a3' }}>
								{' ' + array1[i].ape_pat_cli + ' ' + array1[i].ape_mat_cli}
							</div>
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

	const onSearchNOM = async searchText => {
		var nombre = formSearch.current.getFieldValue('nombrePaciente');
		if (nombre ? nombre.length >= 4 : false) {
			setPeticion(true);
			setOptionsNOM();
			const respuesta = await httpClient.post(
				'camas/getPacientes',
				{
					codPaciente: '',
					nombre: nombre,
				},
				{ cancelToken: cancelSource.token }
			);
			var array2 = respuesta.data.data;
			console.log(respuesta.data.data);
			for (let i = 0; i < array2.length; i++) {
				if (array2[i].asignado === '0') {
					delete array2[i];
				} else {
					array2[i].key = array2[i].cod_paciente;
					array2[i].value = array2[i].cod_paciente;
					array2[i].label = (
						<div>
							{array2[i].nom_cli}
							<div style={{ color: '#a3a3a3' }}>
								{' ' + array2[i].ape_pat_cli + ' ' + array2[i].ape_mat_cli}
							</div>
						</div>
					);
				}
			}
			setOptionsCOD();
			setOptionsNOM(array2);
		} else {
			if (peticion) {
				cancelSource.cancel('NOM ancelado');
				setCancelSource(axios.CancelToken.source());
			}
		}
	};

	const onSelectCOD = data => {
		optionsCOD.forEach(element => {
			if (element.key === data) {
				formSearch.current.setFieldsValue({
					codPaciente: element.historia_clinica,
					nombrePaciente: `${
						element.nom_cli + ' ' + element.ape_pat_cli + ' ' + element.ape_mat_cli
					}`,
				});
				setValueCOD(data);
				setPaciente({
					...paciente,
					// nombre: `${element.nom_cli + ' ' + element.ape_pat_cli + ' ' + element.ape_mat_cli}`,
					historia: element.historia_clinica,
				});
				// obtenerSignosVitales(element.historia_clinica);
			}
		});
	};

	const onSelectNOM = data => {
		optionsNOM.forEach(element => {
			if (element.key === data) {
				formSearch.current.setFieldsValue({
					codPaciente: element.historia_clinica,
					nombrePaciente: `${
						element.nom_cli + ' ' + element.ape_pat_cli + ' ' + element.ape_mat_cli
					}`,
				});
				setValueNOM(data);
				setPaciente({
					...paciente,
					// nombre: `${element.nom_cli + ' ' + element.ape_pat_cli + ' ' + element.ape_mat_cli}`,
					historia: element.historia_clinica,
				});
				// obtenerSignosVitales(element.historia_clinica);
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
						gap: '15%',
						flexDirection: 'row',
						width: '100%',
					}}
				>
					<div style={{ fontSize: '22px' }}>
						<div style={{ display: 'flex', alignItems: 'center' }}>Signos Vitales</div>
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
								<Form.Item name="codPaciente" style={{ width: '40%', margin: 0 }}>
									<AutoComplete
										value={valueCOD}
										options={optionsCOD}
										onSearch={onSearchCOD}
										onSelect={onSelectCOD}
										onChange={onChangeCOD}
										style={{ width: '100%' }}
										placeholder="Historia Clínica"
									/>
								</Form.Item>
								<Form.Item name="nombrePaciente" style={{ width: '100%', margin: 0 }}>
									<AutoComplete
										value={valueNOM}
										options={optionsNOM}
										onSearch={onSearchNOM}
										onSelect={onSelectNOM}
										onChange={onChangeNOM}
										style={{ width: '100%' }}
										placeholder="Nombre del paciente"
									/>
								</Form.Item>
								<Form.Item name="rangoFechas" style={{ width: '35%', margin: 0 }}>
									<DatePicker
										style={{ width: '100%' }}
										placeholder="Seleccione la semana"
										// onChange={onChange}
										locale={locale}
										picker="week"
									/>
								</Form.Item>
							</Form>
						</div>
					</div>
					<div
						style={{
							gridArea: '1 / 3 / 3 / 4',
							display: 'flex',
							flexDirection: 'row-reverse',
							paddingTop: '15px',
						}}
					>
						<Button
							loading={loading}
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
                background: themeSettingsGlobal.COD_COLOR_1,
                color: '#fff'
							}}
							onClick={() => buscarHistorial()}
						>
							Buscar
						</Button>
					</div>
				</div>
			}
		>
			{!loading ? (
				data.length > 0 ? (
					<>
						<Row style={{ margin: '10px 0 10px 0' }}>
							<Col style={{ width: '14%', paddingLeft: '24px', fontSize: '16px' }}>Fecha</Col>
							<Col style={{ width: '86%' }}>
								<Row
									style={{
										margin: 0,
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'space-around',
									}}
								>
									{balance.fecha.map(e => (
										<Col style={{ width: '85px' }}>{e}</Col>
									))}
								</Row>
							</Col>
						</Row>
						<ResponsiveContainer width="100%" height={1000}>
							<ComposedChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
								<XAxis dataKey="turno" orientation="top" />
								<YAxis yAxisId="yAxisT" domain={[35, 41]} />
								{/* <YAxis yAxisId="yAxisFR" domain={[10, 50]} /> */}
								<YAxis yAxisId="yAxisPA" domain={[0, 300]} tickCount={16} />
								<YAxis yAxisId="yAxisFC" domain={[35, 185]} tickCount={31} />
								<Tooltip />
								<Legend verticalAlign="top" align="left" content={CustomLegend} />
								<CartesianGrid stroke="#f5f5f5" />
								<Line
									dataKey="FC"
									yAxisId="yAxisFC"
									type="monotone"
									stroke="blue"
									dot={<CustomFC />}
								/>
								<Bar
									dataKey="P/A"
									yAxisId="yAxisPA"
									barSize={20}
									fill="green"
									shape={<CustomPA />}
								/>
								{/* <Line
									dataKey="FR"
									yAxisId="yAxisFR"
									type="monotone"
									stroke="black"
									dot={<CustomFR />}
								/> */}
								<Line
									dataKey="Tº"
									yAxisId="yAxisT"
									type="monotone"
									stroke="red"
									dot={<CustomT />}
								/>
							</ComposedChart>
						</ResponsiveContainer>
						{balance.pesos.length > 0 ? (
							<>
								{/* <h2>Balance Hídrico</h2> */}
								<Row style={{ margin: '10px 0 10px 0' }}>
									<Col style={{ width: '180px', paddingLeft: '24px' }}></Col>
									<Col style={{ width: 'calc(100% - 180px)' }}>
										<Row
											style={{
												margin: 0,
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'space-around',
											}}
										>
											{balance.turnos.map(e => (
												<Col
													style={{
														width: 'auto',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													{e}
												</Col>
											))}
										</Row>
									</Col>
								</Row>
								<Divider />
								<Row style={{ margin: '10px 0 10px 0' }}>
									<Col style={{ width: '180px', paddingLeft: '24px' }}>Respiracion</Col>
									<Col style={{ width: 'calc(100% - 180px)' }}>
										<Row
											style={{
												margin: 0,
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'space-around',
											}}
										>
											{balance.respiracion.map(e => (
												<Col
													style={{
														width: 'auto',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													{e}
												</Col>
											))}
										</Row>
									</Col>
								</Row>
								<Divider />
								<Row style={{ margin: '10px 0 10px 0' }}>
									<Col style={{ width: '180px', paddingLeft: '24px' }}>Peso</Col>
									<Col style={{ width: 'calc(100% - 180px)' }}>
										<Row
											style={{
												margin: 0,
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'space-around',
											}}
										>
											{balance.pesos.map(e => (
												<Col
													style={{
														width: '100px',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													{e} kg
												</Col>
											))}
										</Row>
									</Col>
								</Row>
								<Divider />
								<Row
									style={{
										margin: '10px 0 10px 0',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										width: '100%',
									}}
								>
									<Col style={{ width: '180px', paddingLeft: '24px' }}>Balance Hídrico</Col>
									<Col style={{ width: 'calc(100% - 180px)' }}>
										<Row
											style={{
												margin: 0,
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'space-around',
											}}
										>
											{balance.total.map(e => (
												<Col
													style={{
														width: '100px',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														borderRadius: '10px',
														padding: '10px',
														backgroundColor: 'rgb(254, 91, 90)',
														color: 'white',
													}}
												>
													{e}
												</Col>
											))}
										</Row>
									</Col>
								</Row>
								{/* <h4>Ingresos</h4>
								{balance.labelIngresos
									? balance.labelIngresos.map((li, index) => {
											return (
												<Row style={{ margin: '0 0 10px 0' }}>
													<Col style={{ width: '18%', paddingLeft: '24px' }}>{li}</Col>
													<Col style={{ width: '82%' }}>
														<Row
															style={{
																margin: 0,
																display: 'flex',
																flexDirection: 'row',
																alignItems: 'center',
																justifyContent: 'space-around',
															}}
														>
															{balance.ingresos
																? balance.ingresos.map(i => (
																		<Col style={{ width: '30px' }}>{i[index]}</Col>
																  ))
																: null}
														</Row>
													</Col>
												</Row>
											);
									  })
									: null}
								<h4>Egresos</h4>
								{balance.labelEgresos
									? balance.labelEgresos.map((le, index) => {
											return (
												<Row style={{ margin: '0 0 10px 0' }}>
													<Col style={{ width: '18%', paddingLeft: '24px' }}>{le}</Col>
													<Col style={{ width: '82%' }}>
														<Row
															style={{
																margin: 0,
																display: 'flex',
																flexDirection: 'row',
																alignItems: 'center',
																justifyContent: 'space-around',
															}}
														>
															{balance.egresos
																? balance.egresos.map(e => (
																		<Col style={{ width: '30px' }}>{e[index]}</Col>
																  ))
																: null}
														</Row>
													</Col>
												</Row>
											);
									  })
									: null} */}
							</>
						) : null}
					</>
				) : (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							color: '#757575',
							padding: '30px',
							fontSize: '20px',
						}}
					>
						No hay datos que mostrar!
					</div>
				)
			) : (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						// justifyContent: 'center',
						alignItems: 'center',
						color: '#757575',
						padding: '30px',
						fontSize: '18px',
					}}
				>
					<Spin style={{ margin: '0 0 10px 0' }} />
					Buscando...
				</div>
			)}
		</Card>
	);
};

export default Cuadro;
