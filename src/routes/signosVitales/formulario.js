import React, { createRef, useCallback, useEffect, useMemo, useState } from 'react';
import {
	Button,
	Card,
	Divider,
	Input,
	Form,
	AutoComplete,
	Row,
	Col,
	DatePicker,
	Slider,
} from 'antd';
import { notificaciones } from '../../util/util';
import { httpClient } from '../../util/Api';
import Moment from 'moment';
import axios from 'axios';
import { datosEnviar, funn } from '../../constants/datosEnviar';

import { useIdleTimer } from 'react-idle-timer';
import { useAuth } from '../../authentication';
import { useHistory } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';

const date = Moment().locale('es');

const Formulario = ({ setSwitcher }) => {
	const token = JSON.parse(sessionStorage.getItem('token'));

	const [loading, setLoading] = useState(false);
	const [editar, setEditar] = useState();
	const [paciente, setPaciente] = useState({
		nombre: '',
		historia: '',
	});
	const [cama, setCama] = useState({
		piso: '',
		cama: '',
		habitacion: '',
	});
	const [balance, setBalance] = useState({
		balance: '',
		peso: '',
	});

	const [peticion, setPeticion] = useState(false);
	const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());
	const [valueCOD, setValueCOD] = useState('');
	const [optionsCOD, setOptionsCOD] = useState([]);
	const [valueNOM, setValueNOM] = useState('');
	const [optionsNOM, setOptionsNOM] = useState([]);

	const [dateTime, setDateTime] = useState({
		hours: date.format('h'),
		minutes: date.format('mm'),
		seconds: date.format('ss'),
		indicador: date.format('a'),
		turno: '',
	});

	const formRef = useMemo(() => createRef(), []);
	const formSearch = useMemo(() => createRef(), []);

	const marcas = {};
	const marcasT = { 0: '0º' };

	for (let index = 0; index <= 15; index += 1) {
		const aux = index === 0 ? ' mmHg' : index === 15 ? ' mmHg' : '';
		marcas[index * 20] = `${index * 20}` + aux;
	}

	for (let index = 35; index <= 42; index += 1) {
		const aux = index === 35 ? 'º' : index === 42 ? 'º' : '';
		marcasT[index] = `${index}` + aux;
	}

	const guardarSignosVitales = async () => {
		setLoading(true);
		const body = formRef.current.getFieldsValue();
		body.p_a = `${body.p_a[0] + '-' + body.p_a[1]}`;
		console.log(body.p_a);
		body.fecha = Moment(body.fecha).format('YYYY/MM/DD');
		body.turno = dateTime.turno[0];
		body.paciente = valueCOD;
		body.codMedico = token.cod_medico;
		body.historia_clinica = paciente.historia;
		var validator = false;
		if (
			body.turno.length > 0 &&
			body.fecha.length > 0 &&
			body.historia_clinica.length > 0 &&
			body.paciente.length > 0 &&
			body.codMedico.length > 0
		) {
			validator = true;
		}
		if (validator) {
			var response = {};
			if (editar) {
				body.id = editar;
				response = await httpClient.post('vitales/updateSignosVitales', body);
			} else {
				response = await httpClient.post('vitales/createSignosVitales', body);
			}
			if (response.data.success) {
				notificaciones('Completado!');
			} else {
				notificaciones(response.message, 'Alerta');
			}
		} else {
			notificaciones('Debe llenar todos los campos', 'Alerta');
			console.error('Completar datos');
		}
		setLoading(false);
	};

	const obtenerBalance = historiaClinica => {
		const fecha = date.format('YYYY/MM/DD');
		httpClient
			.post('balance/getOneBalanceHidrico', {
				historiaClinica: historiaClinica,
				fecha: fecha,
			})
			.then(response => {
				if (response.data.data) {
					setBalance({
						peso: response.data.data.peso,
						balance: response.data.data.balance_hidrico,
					});
				}
			});
	};

	const obtenerSignosVitales = historiaClinica => {
		const fecha = date.format('YYYY/MM/DD');
		httpClient
			.post('vitales/getOneSignosVitales', {
				historiaClinica: historiaClinica,
				fecha: fecha,
				turno: dateTime.turno[0],
			})
			.then(response => {
				console.log(response);
				if (response.data.data) {
					setEditar(response.data.data.id_signos_vitales);
					formRef.current.setFieldsValue({
						pulso: response.data.data.pulso ? parseFloat(response.data.data.pulso) : null,
						p_a: response.data.data.p_a
							? [response.data.data.p_a.split('-')[0], response.data.data.p_a.split('-')[1]]
							: null,
						respiracion: response.data.data.respiracion
							? parseFloat(response.data.data.respiracion)
							: null,
						temperatura: response.data.data.temperatura
							? parseFloat(response.data.data.temperatura)
							: null,
					});
				} else {
					setEditar();
				}
			});
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
					nombre: `${element.nom_cli + ' ' + element.ape_pat_cli + ' ' + element.ape_mat_cli}`,
					historia: element.historia_clinica,
				});
				setCama({
					piso: element.piso,
					habitacion: element.habitacion,
					cama: element.cama,
				});
				obtenerBalance(element.historia_clinica);
				obtenerSignosVitales(element.historia_clinica);
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
					nombre: `${element.nom_cli + ' ' + element.ape_pat_cli + ' ' + element.ape_mat_cli}`,
					historia: element.historia_clinica,
				});
				setCama({
					piso: element.piso,
					habitacion: element.habitacion,
					cama: element.cama,
				});
				obtenerBalance(element.historia_clinica);
				obtenerSignosVitales(element.historia_clinica);
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

	useEffect(() => {
		const timer = setInterval(() => {
			const date = Moment().locale('es');
			setDateTime({
				hours:
					date.format('h').toString().length !== 1
						? date.format('h')
						: '0' + date.format('h').toString(),
				minutes:
					date.format('mm').toString().length !== 1
						? date.format('mm')
						: '0' + date.format('mm').toString(),
				seconds:
					date.format('ss').toString().length !== 1
						? date.format('ss')
						: '0' + date.format('ss').toString(),
				indicador: date.format('a'),
				turno:
					Moment().format('HH') < 8
						? 'Noche'
						: Moment().format('HH') < 14
						? 'Mañana'
						: Moment().format('HH') < 20
						? 'Tarde'
						: Moment().format('HH') < 24
						? 'Noche'
						: '',
			});
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<Card
			title={
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'start',
						gap: '18%',
						flexDirection: 'row',
						width: '100%',
					}}
				>
					<div style={{ fontSize: '22px' }}>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							{/* <Button
								className="gx-mb-0"
								type="text"
								htmlType="submit"
								style={{ marginRight: 10 }}
								onClick={() => setSwitcher('Tabla')}
							>
								<ArrowLeftOutlined />
							</Button> */}
							{editar ? 'Actualizar' : 'Registrar'}
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
								backgroundColor: '#04B0AD',
								color: 'white',
							}}
							onClick={() => guardarSignosVitales()}
						>
							{editar ? 'Actualizar' : 'Guardar'}
						</Button>
					</div>
				</div>
			}
		>
			<Form ref={formRef}>
				<Row>
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'start',
						}}
					>
						<div style={{ margin: 0, padding: 0, width: '100%' }}>
							<div style={{ fontSize: '24px' }}>Turno {dateTime.turno}</div>
							<div style={{ fontSize: '20px' }}>
								{dateTime.hours}:{dateTime.minutes}:{dateTime.seconds} {dateTime.indicador}
							</div>
							<div>{date.format('dddd, DD [de] MMMM [de] YYYY')}</div>
						</div>
					</Col>
					{paciente.historia.length > 1 ? (
						<>
							<Col
								xs={6}
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignContent: 'start',
									alignItems: 'start',
									justifyContent: 'center',
									gap: '5px',
								}}
							>
								<div>Historia Clínica: {paciente.historia}</div>
								<div>Nombre: {paciente.nombre}</div>
							</Col>
							<Col
								xs={6}
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignContent: 'center',
									alignItems: 'start',
									justifyContent: 'center',
									gap: '5px',
								}}
							>
								{balance.balance.length > 0 ? (
									<>
										<div>Balance Hídrico: {balance.balance}</div>
										<div>Peso: {balance.peso}</div>
									</>
								) : (
									<div
										style={{
											borderRadius: '10px',
											padding: '10px',
											color: 'white',
											backgroundColor: 'red',
										}}
									>
										Aún no se ha registrado <br /> un balance hídrico
									</div>
								)}
							</Col>
							<Col
								xs={6}
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignContent: 'start',
									alignItems: 'start',
									justifyContent: 'center',
									gap: '5px',
								}}
							>
								<div>Piso: {cama.piso}</div>
								<div>Habitación: {cama.habitacion}</div>
								<div>Cama: {cama.cama}</div>
							</Col>
						</>
					) : null}
					<Divider style={{ paddingBottom: '15px' }} />
				</Row>
				<Row style={{ padding: '0 30px 0 30px' }}>
					<Col
						xs={12}
						style={{
							paddingBottom: '10px',
							display: 'none',
							alignItems: 'center',
							justifyContent: 'start',
						}}
					>
						<Form.Item name="fecha" style={{ margin: 0, padding: 0, width: '100%' }} label="Fecha">
							<DatePicker
								disabled
								onChange={e => {
									formRef.current.setFieldsValue({
										fecha: e,
									});
								}}
								style={{ width: '100%' }}
								placeholder="Seleccione la fecha"
							/>
						</Form.Item>
					</Col>
					<Col
						xs={2}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'start',
						}}
					>
						Respiración:
					</Col>
					<Col
						xs={10}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'start',
						}}
					>
						<Form.Item name="respiracion" style={{ margin: 0, padding: 0, width: '100%' }}>
							<Input
								type="number"
								// disabled={balance.balance.length > 0 ? false : true}
								placeholder="Respiración del paciente"
							/>
						</Form.Item>
					</Col>
					<Col
						xs={2}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'start',
						}}
					>
						Pulso:
					</Col>
					<Col
						xs={10}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'start',
						}}
					>
						<Form.Item name="pulso" style={{ margin: 0, padding: 0, width: '100%' }}>
							<Input
								type="number"
								// disabled={balance.balance.length > 0 ? false : true}
								placeholder="Pulso del paciente"
							/>
						</Form.Item>
					</Col>
					<Col
						xs={2}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'start',
						}}
					>
						Temperatura:
					</Col>
					<Col
						xs={22}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'start',
						}}
					>
						<Form.Item name="temperatura" style={{ margin: 0, padding: 0, width: '100%' }}>
							{/* <Input
								type="number"
								// disabled={balance.balance.length > 0 ? false : true}
								placeholder="Temperatura del paciente"
							/> */}
							<Slider min={35} max={42} step={0.1} marks={marcasT} />
						</Form.Item>
					</Col>
					<Col
						xs={2}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'start',
						}}
					>
						P/A:
					</Col>
					<Col
						xs={22}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'start',
						}}
					>
						<Form.Item name="p_a" style={{ margin: 0, padding: 0, width: '100%' }}>
							{/* <Input
								type="text"
								// disabled={balance.balance.length > 0 ? false : true}
								placeholder="P/A del paciente"
							/> */}
							<Slider range max={300} step={20} marks={marcas} />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Card>
	);
};

export default Formulario;
