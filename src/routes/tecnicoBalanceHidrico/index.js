import React, { useEffect, useState, createRef, useMemo } from 'react';
import { Button, Card, Row, Col, Divider, AutoComplete, Form, Input, DatePicker } from 'antd';
import { ToastContainer } from 'react-toastify';
import { httpClient } from '../../util/Api';
import { notificaciones } from '../../util/util';
import Moment from 'moment';
import axios from 'axios';
import '../balanceHidrico/formulario.css';
import { useSelector } from 'react-redux';

const date = Moment().locale('es');

const TecnicoBalanceHidrico = () => {
	const token = JSON.parse(localStorage.getItem('token'));
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const [editar, setEditar] = useState();
	const [historia, setHistoria] = useState();

	const [valueCOD, setValueCOD] = useState('');
	const [optionsCOD, setOptionsCOD] = useState([]);
	const [valueNOM, setValueNOM] = useState('');
	const [optionsNOM, setOptionsNOM] = useState([]);

	const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());
	const [peticion, setPeticion] = useState(false);

	const [loading, setLoading] = useState(false);
	const [flagIngresos, setFlagIngresos] = useState(true);
	const [flagEgresos, setFlagEgresos] = useState(true);
	const [flagOpcionalI, setFlagOpcionalI] = useState(false);
	const [flagOpcionalE, setFlagOpcionalE] = useState(false);

	const [estaciones, setEstaciones] = useState(12);
	const [turno, setTurno] = useState('');

	const [egresos, setEgresos] = useState({
		egreso_diuresis_0814: 0.0,
		egreso_diuresis_1420: 0.0,
		egreso_diuresis_2008: 0.0,
		egreso_deposicion_0814: 0.0,
		egreso_deposicion_1420: 0.0,
		egreso_deposicion_2008: 0.0,
		egreso_temperatura_0814: 0.0,
		egreso_temperatura_1420: 0.0,
		egreso_temperatura_2008: 0.0,
		egreso_opcional: '',
		egreso_valor_0814: 0.0,
		egreso_valor_1420: 0.0,
		egreso_valor_2008: 0.0,
	});
	const [totalDiuresis, setTotalDiuresis] = useState(0.0);
	const [totalDeposicion, setTotalDeposicion] = useState(0.0);
	const [totalTemperatura, setTotalTemperatura] = useState(0.0);
	const [egresoPI, setEgresoPI] = useState(0.0);
	const [totalOpcionalEgreso, setTotalOpcionalEgreso] = useState(0.0);
	const [totalEgreso0814, setTotalEgreso0814] = useState(0.0);
	const [totalEgreso1420, setTotalEgreso1420] = useState(0.0);
	const [totalEgreso2008, setTotalEgreso2008] = useState(0.0);
	const [totalEgreso, setTotalEgreso] = useState(0.0);
	const [balance, setBalance] = useState(0.0);

	const [ingresos, setIngresos] = useState({
		ingreso_oral_0814: 0.0,
		ingreso_oral_1420: 0.0,
		ingreso_oral_2008: 0.0,
		ingreso_parental_0814: 0.0,
		ingreso_parental_1420: 0.0,
		ingreso_parental_2008: 0.0,
		ingreso_tratamiento_0814: 0.0,
		ingreso_tratamiento_1420: 0.0,
		ingreso_tratamiento_2008: 0.0,
		ingreso_opcional: '',
		ingreso_valor_0814: 0.0,
		ingreso_valor_1420: 0.0,
		ingreso_valor_2008: 0.0,
	});
	const [totalOral, setTotalOral] = useState(0.0);
	const [totalParental, setTotalParental] = useState(0.0);
	const [totalTrataminto, setTotalTratamiento] = useState(0.0);
	const [ingresoAO, setIngresoAO] = useState(0.0);
	const [totalOpcionalIngreso, setTotalOpcionalIngreso] = useState(0.0);
	const [totalIngreso0814, setTotalIngreso0814] = useState(0.0);
	const [totalIngreso1420, setTotalIngreso1420] = useState(0.0);
	const [totalIngreso2008, setTotalIngreso2008] = useState(0.0);
	const [totalIngreso, setTotalIngreso] = useState(0.0);

	const formRef = useMemo(() => createRef(), []);
	const formSearch = useMemo(() => createRef(), []);

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
				setHistoria(element.historia_clinica);
				obtenerBalance(element.historia_clinica);
				validarTurno();
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
				setHistoria(element.historia_clinica);
				obtenerBalance(element.historia_clinica);
				validarTurno();
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

	const ObtenerEstadoAnho = async () => {
		const mes = date.format('M');
		const response = await httpClient.get('balance/getEstaciones');
		if (response) {
			if (mes > 0 && mes <= 3) {
				setEstaciones(response.data.data[0].verano);
			} else if (mes > 3 && mes <= 12) {
				setEstaciones(response.data.data[0].invierno);
			} else {
				setEstaciones(12);
			}
		}
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
					if (response.data.data.i_opcional === null || response.data.data.i_opcional === '') {
						setFlagOpcionalI(false);
					} else {
						setFlagOpcionalI(true);
						setFlagIngresos(false);
					}
					if (response.data.data.e_opcional === null || response.data.data.e_opcional === '') {
						setFlagOpcionalE(false);
					} else {
						setFlagOpcionalE(true);
						setFlagEgresos(false);
					}
					setEditar(response.data.data.id_balance_hidrico);
          setEgresoPI(parseFloat(response.data.data.peso) * parseFloat(estaciones));
					setIngresoAO((parseFloat(response.data.data.peso) * parseFloat(estaciones)) / 3);
					setIngresos({
						ingreso_oral_0814: response.data.data.i_oral_0814
							? response.data.data.i_oral_0814
							: 0.0,
						ingreso_oral_1420: response.data.data.i_oral_1420
							? response.data.data.i_oral_1420
							: 0.0,
						ingreso_oral_2008: response.data.data.i_oral_2008
							? response.data.data.i_oral_2008
							: 0.0,
						ingreso_parental_0814: response.data.data.i_parental_0814
							? response.data.data.i_parental_0814
							: 0.0,
						ingreso_parental_1420: response.data.data.i_parental_1420
							? response.data.data.i_parental_1420
							: 0.0,
						ingreso_parental_2008: response.data.data.i_parental_2008
							? response.data.data.i_parental_2008
							: 0.0,
						ingreso_tratamiento_0814: response.data.data.i_tratamiento_0814
							? response.data.data.i_tratamiento_0814
							: 0.0,
						ingreso_tratamiento_1420: response.data.data.i_tratamiento_1420
							? response.data.data.i_tratamiento_1420
							: 0.0,
						ingreso_tratamiento_2008: response.data.data.i_tratamiento_2008
							? response.data.data.i_tratamiento_2008
							: 0.0,
						ingreso_opcional: response.data.data.i_opcional ? response.data.data.i_opcional : 0.0,
						ingreso_valor_0814: response.data.data.i_valor_0814
							? response.data.data.i_valor_0814
							: 0.0,
						ingreso_valor_1420: response.data.data.i_valor_1420
							? response.data.data.i_valor_1420
							: 0.0,
						ingreso_valor_2008: response.data.data.i_valor_2008
							? response.data.data.i_valor_2008
							: 0.0,
					});
					setEgresos({
						egreso_diuresis_0814: response.data.data.e_diuresis_0814
							? response.data.data.e_diuresis_0814
							: 0.0,
						egreso_diuresis_1420: response.data.data.e_diuresis_1420
							? response.data.data.e_diuresis_1420
							: 0.0,
						egreso_diuresis_2008: response.data.data.e_diuresis_2008
							? response.data.data.e_diuresis_2008
							: 0.0,
						egreso_deposicion_0814: response.data.data.e_deposicion_0814
							? response.data.data.e_deposicion_0814
							: 0.0,
						egreso_deposicion_1420: response.data.data.e_deposicion_1420
							? response.data.data.e_deposicion_1420
							: 0.0,
						egreso_deposicion_2008: response.data.data.e_deposicion_2008
							? response.data.data.e_deposicion_2008
							: 0.0,
						egreso_temperatura_0814: response.data.data.e_temperatura_0814
							? response.data.data.e_temperatura_0814
							: 0.0,
						egreso_temperatura_1420: response.data.data.e_temperatura_1420
							? response.data.data.e_temperatura_1420
							: 0.0,
						egreso_temperatura_2008: response.data.data.e_temperatura_2008
							? response.data.data.e_temperatura_2008
							: 0.0,
						egreso_opcional: response.data.data.e_opcional ? response.data.data.e_opcional : 0.0,
						egreso_valor_0814: response.data.data.e_valor_0814
							? response.data.data.e_valor_0814
							: 0.0,
						egreso_valor_1420: response.data.data.e_valor_1420
							? response.data.data.e_valor_1420
							: 0.0,
						egreso_valor_2008: response.data.data.e_valor_2008
							? response.data.data.e_valor_2008
							: 0.0,
					});
					formRef.current.setFieldsValue({
						peso: response.data.data.peso,
						ingreso_oral_0814: response.data.data.i_oral_0814
							? parseFloat(response.data.data.i_oral_0814)
							: null,
						ingreso_oral_1420: response.data.data.i_oral_1420
							? parseFloat(response.data.data.i_oral_1420)
							: null,
						ingreso_oral_2008: response.data.data.i_oral_2008
							? parseFloat(response.data.data.i_oral_2008)
							: null,
						ingreso_parental_0814: response.data.data.i_parental_0814
							? parseFloat(response.data.data.i_parental_0814)
							: null,
						ingreso_parental_1420: response.data.data.i_parental_1420
							? parseFloat(response.data.data.i_parental_1420)
							: null,
						ingreso_parental_2008: response.data.data.i_parental_2008
							? parseFloat(response.data.data.i_parental_2008)
							: null,
						ingreso_tratamiento_0814: response.data.data.i_tratamiento_0814
							? parseFloat(response.data.data.i_tratamiento_0814)
							: null,
						ingreso_tratamiento_1420: response.data.data.i_tratamiento_1420
							? parseFloat(response.data.data.i_tratamiento_1420)
							: null,
						ingreso_tratamiento_2008: response.data.data.i_tratamiento_2008
							? parseFloat(response.data.data.i_tratamiento_2008)
							: null,
						ingreso_opcional: response.data.data.i_opcional ? response.data.data.i_opcional : null,
						ingreso_valor_0814: response.data.data.i_valor_0814
							? parseFloat(response.data.data.i_valor_0814)
							: null,
						ingreso_valor_1420: response.data.data.i_valor_1420
							? parseFloat(response.data.data.i_valor_1420)
							: null,
						ingreso_valor_2008: response.data.data.i_valor_2008
							? parseFloat(response.data.data.i_valor_2008)
							: null,
						egreso_diuresis_0814: response.data.data.e_diuresis_0814
							? parseFloat(response.data.data.e_diuresis_0814)
							: null,
						egreso_diuresis_1420: response.data.data.e_diuresis_1420
							? parseFloat(response.data.data.e_diuresis_1420)
							: null,
						egreso_diuresis_2008: response.data.data.e_diuresis_2008
							? parseFloat(response.data.data.e_diuresis_2008)
							: null,
						egreso_deposicion_0814: response.data.data.e_deposicion_0814
							? parseFloat(response.data.data.e_deposicion_0814)
							: null,
						egreso_deposicion_1420: response.data.data.e_deposicion_1420
							? parseFloat(response.data.data.e_deposicion_1420)
							: null,
						egreso_deposicion_2008: response.data.data.e_deposicion_2008
							? parseFloat(response.data.data.e_deposicion_2008)
							: null,
						egreso_temperatura_0814: response.data.data.e_temperatura_0814
							? parseFloat(response.data.data.e_temperatura_0814)
							: null,
						egreso_temperatura_1420: response.data.data.e_temperatura_1420
							? parseFloat(response.data.data.e_temperatura_1420)
							: null,
						egreso_temperatura_2008: response.data.data.e_temperatura_2008
							? parseFloat(response.data.data.e_temperatura_2008)
							: null,
						egreso_opcional: response.data.data.e_opcional ? response.data.data.e_opcional : null,
						egreso_valor_0814: response.data.data.e_valor_0814
							? parseFloat(response.data.data.e_valor_0814)
							: null,
						egreso_valor_1420: response.data.data.e_valor_1420
							? parseFloat(response.data.data.e_valor_1420)
							: null,
						egreso_valor_2008: response.data.data.e_valor_2008
							? parseFloat(response.data.data.e_valor_2008)
							: null,
					});
				} else {
					setEditar();
				}
			});
	};

	const GuardarBalance = async () => {
		setLoading(true);
		const body = formRef.current.getFieldsValue();
		body.fecha = Moment(body.fecha).format('YYYY/MM/DD');
		body.paciente = valueCOD || valueNOM;
		body.estacion = estaciones;
		body.codMedico = token.cod_medico;
		body.historia_clinica = historia;
		body.balance_hidrico = balance;
		var validator = false;
		if (
			body.paciente.length > 0 &&
			body.fecha.length > 0 &&
			body.peso.length > 0 &&
			body.estacion.length > 0 &&
			body.codMedico.length > 0
		) {
			validator = true;
		}
		if (validator) {
			var response = {};
			if (editar) {
				body.id = editar;
				response = await httpClient.post('balance/updateBalanceHidrico', body);
			} else {
				response = await httpClient.post('balance/createBalanceHidrico', body);
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

	const validarTurno = () => {
		var hora = parseInt(date.format('HH'));
		if (hora > 0 && hora <= 8) {
			setTurno('N');
		} else if (hora > 8 && hora < 14) {
			setTurno('M');
		} else if (hora > 14 && hora < 20) {
			setTurno('T');
		} else if (hora > 20 && hora < 24) {
			setTurno('N');
		} else {
			setTurno();
		}
	};

	useEffect(() => {
		formRef.current.setFieldsValue({
			fecha: date,
		});
		ObtenerEstadoAnho();
		validarTurno();
		// reloj();
	}, []);

	useEffect(() => {
		setTotalDiuresis(
			parseFloat(egresos.egreso_diuresis_0814 !== '' ? egresos.egreso_diuresis_0814 : 0) +
				parseFloat(egresos.egreso_diuresis_1420 !== '' ? egresos.egreso_diuresis_1420 : 0) +
				parseFloat(egresos.egreso_diuresis_2008 !== '' ? egresos.egreso_diuresis_2008 : 0)
		);
		setTotalDeposicion(
			parseFloat(egresos.egreso_deposicion_0814 !== '' ? egresos.egreso_deposicion_0814 : 0) +
				parseFloat(egresos.egreso_deposicion_1420 !== '' ? egresos.egreso_deposicion_1420 : 0) +
				parseFloat(egresos.egreso_deposicion_2008 !== '' ? egresos.egreso_deposicion_2008 : 0)
		);
		setTotalTemperatura(
			parseFloat(egresos.egreso_temperatura_0814 !== '' ? egresos.egreso_temperatura_0814 : 0) +
				parseFloat(egresos.egreso_temperatura_1420 !== '' ? egresos.egreso_temperatura_1420 : 0) +
				parseFloat(egresos.egreso_temperatura_2008 !== '' ? egresos.egreso_temperatura_2008 : 0)
		);
		setTotalOpcionalEgreso(
			parseFloat(egresos.egreso_valor_0814 !== '' ? egresos.egreso_valor_0814 : 0) +
				parseFloat(egresos.egreso_valor_1420 !== '' ? egresos.egreso_valor_1420 : 0) +
				parseFloat(egresos.egreso_valor_2008 !== '' ? egresos.egreso_valor_2008 : 0)
		);
		setTotalEgreso0814(
      parseFloat(egresoPI !== '' ? parseFloat(egresoPI) / 4 : 0) +
			parseFloat(egresos.egreso_diuresis_0814 !== '' ? egresos.egreso_diuresis_0814 : 0) +
				parseFloat(egresos.egreso_deposicion_0814 !== '' ? egresos.egreso_deposicion_0814 : 0) +
				parseFloat(egresos.egreso_temperatura_0814 !== '' ? egresos.egreso_temperatura_0814 : 0) +
				parseFloat(egresos.egreso_valor_0814 !== '' ? egresos.egreso_valor_0814 : 0)
		);
		setTotalEgreso1420(
      parseFloat(egresoPI !== '' ? parseFloat(egresoPI) / 4 : 0) +
			parseFloat(egresos.egreso_diuresis_1420 !== '' ? egresos.egreso_diuresis_1420 : 0) +
				parseFloat(egresos.egreso_deposicion_1420 !== '' ? egresos.egreso_deposicion_1420 : 0) +
				parseFloat(egresos.egreso_temperatura_1420 !== '' ? egresos.egreso_temperatura_1420 : 0) +
				parseFloat(egresos.egreso_valor_1420 !== '' ? egresos.egreso_valor_1420 : 0)
		);
		setTotalEgreso2008(
      parseFloat(egresoPI !== '' ? parseFloat(egresoPI) / 2 : 0) +
			parseFloat(egresos.egreso_diuresis_2008 !== '' ? egresos.egreso_diuresis_2008 : 0) +
				parseFloat(egresos.egreso_deposicion_2008 !== '' ? egresos.egreso_deposicion_2008 : 0) +
				parseFloat(egresos.egreso_temperatura_2008 !== '' ? egresos.egreso_temperatura_2008 : 0) +
				parseFloat(egresos.egreso_valor_2008 !== '' ? egresos.egreso_valor_2008 : 0)
		);
		setTotalEgreso(
			parseFloat(egresoPI !== '' ? egresoPI : 0) +
				parseFloat(egresos.egreso_diuresis_0814 !== '' ? egresos.egreso_diuresis_0814 : 0) +
				parseFloat(egresos.egreso_diuresis_1420 !== '' ? egresos.egreso_diuresis_1420 : 0) +
				parseFloat(egresos.egreso_diuresis_2008 !== '' ? egresos.egreso_diuresis_2008 : 0) +
				parseFloat(egresos.egreso_deposicion_0814 !== '' ? egresos.egreso_deposicion_0814 : 0) +
				parseFloat(egresos.egreso_deposicion_1420 !== '' ? egresos.egreso_deposicion_1420 : 0) +
				parseFloat(egresos.egreso_deposicion_2008 !== '' ? egresos.egreso_deposicion_2008 : 0) +
				parseFloat(egresos.egreso_temperatura_0814 !== '' ? egresos.egreso_temperatura_0814 : 0) +
				parseFloat(egresos.egreso_temperatura_1420 !== '' ? egresos.egreso_temperatura_1420 : 0) +
				parseFloat(egresos.egreso_temperatura_2008 !== '' ? egresos.egreso_temperatura_2008 : 0) +
				parseFloat(egresos.egreso_valor_0814 !== '' ? egresos.egreso_valor_0814 : 0) +
				parseFloat(egresos.egreso_valor_1420 !== '' ? egresos.egreso_valor_1420 : 0) +
				parseFloat(egresos.egreso_valor_2008 !== '' ? egresos.egreso_valor_2008 : 0)
		);
		validarTurno();
	}, [egresos]);

	useEffect(() => {
		setTotalOral(
			parseFloat(ingresos.ingreso_oral_0814 !== '' ? ingresos.ingreso_oral_0814 : 0) +
				parseFloat(ingresos.ingreso_oral_1420 !== '' ? ingresos.ingreso_oral_1420 : 0) +
				parseFloat(ingresos.ingreso_oral_2008 !== '' ? ingresos.ingreso_oral_2008 : 0)
		);
		setTotalParental(
			parseFloat(ingresos.ingreso_parental_0814 !== '' ? ingresos.ingreso_parental_0814 : 0) +
				parseFloat(ingresos.ingreso_parental_1420 !== '' ? ingresos.ingreso_parental_1420 : 0) +
				parseFloat(ingresos.ingreso_parental_2008 !== '' ? ingresos.ingreso_parental_2008 : 0)
		);
		setTotalTratamiento(
			parseFloat(ingresos.ingreso_tratamiento_0814 !== '' ? ingresos.ingreso_tratamiento_0814 : 0) +
				parseFloat(
					ingresos.ingreso_tratamiento_1420 !== '' ? ingresos.ingreso_tratamiento_1420 : 0
				) +
				parseFloat(ingresos.ingreso_tratamiento_2008 !== '' ? ingresos.ingreso_tratamiento_2008 : 0)
		);
		setTotalOpcionalIngreso(
			parseFloat(ingresos.ingreso_valor_0814 !== '' ? ingresos.ingreso_valor_0814 : 0) +
				parseFloat(ingresos.ingreso_valor_1420 !== '' ? ingresos.ingreso_valor_1420 : 0) +
				parseFloat(ingresos.ingreso_valor_2008 !== '' ? ingresos.ingreso_valor_2008 : 0)
		);
		setTotalIngreso0814(
      parseFloat(ingresoAO !== '' ? parseFloat(ingresoAO) / 4 : 0) +
			parseFloat(ingresos.ingreso_oral_0814 !== '' ? ingresos.ingreso_oral_0814 : 0) +
				parseFloat(ingresos.ingreso_parental_0814 !== '' ? ingresos.ingreso_parental_0814 : 0) +
				parseFloat(
					ingresos.ingreso_tratamiento_0814 !== '' ? ingresos.ingreso_tratamiento_0814 : 0
				) +
				parseFloat(ingresos.ingreso_valor_0814 !== '' ? ingresos.ingreso_valor_0814 : 0)
		);
		setTotalIngreso1420(
      parseFloat(ingresoAO !== '' ? parseFloat(ingresoAO) / 4 : 0) +
			parseFloat(ingresos.ingreso_oral_1420 !== '' ? ingresos.ingreso_oral_1420 : 0) +
				parseFloat(ingresos.ingreso_parental_1420 !== '' ? ingresos.ingreso_parental_1420 : 0) +
				parseFloat(
					ingresos.ingreso_tratamiento_1420 !== '' ? ingresos.ingreso_tratamiento_1420 : 0
				) +
				parseFloat(ingresos.ingreso_valor_1420 !== '' ? ingresos.ingreso_valor_1420 : 0)
		);
		setTotalIngreso2008(
      parseFloat(ingresoAO !== '' ? parseFloat(ingresoAO) / 2 : 0) +
			parseFloat(ingresos.ingreso_oral_2008 !== '' ? ingresos.ingreso_oral_2008 : 0) +
				parseFloat(ingresos.ingreso_parental_2008 !== '' ? ingresos.ingreso_parental_2008 : 0) +
				parseFloat(
					ingresos.ingreso_tratamiento_2008 !== '' ? ingresos.ingreso_tratamiento_2008 : 0
				) +
				parseFloat(ingresos.ingreso_valor_2008 !== '' ? ingresos.ingreso_valor_2008 : 0)
		);
		setTotalIngreso(
			parseFloat(ingresoAO !== '' ? ingresoAO : 0) +
				parseFloat(ingresos.ingreso_oral_0814 !== '' ? ingresos.ingreso_oral_0814 : 0) +
				parseFloat(ingresos.ingreso_oral_1420 !== '' ? ingresos.ingreso_oral_1420 : 0) +
				parseFloat(ingresos.ingreso_oral_2008 !== '' ? ingresos.ingreso_oral_2008 : 0) +
				parseFloat(ingresos.ingreso_parental_0814 !== '' ? ingresos.ingreso_parental_0814 : 0) +
				parseFloat(ingresos.ingreso_parental_1420 !== '' ? ingresos.ingreso_parental_1420 : 0) +
				parseFloat(ingresos.ingreso_parental_2008 !== '' ? ingresos.ingreso_parental_2008 : 0) +
				parseFloat(
					ingresos.ingreso_tratamiento_0814 !== '' ? ingresos.ingreso_tratamiento_0814 : 0
				) +
				parseFloat(
					ingresos.ingreso_tratamiento_1420 !== '' ? ingresos.ingreso_tratamiento_1420 : 0
				) +
				parseFloat(
					ingresos.ingreso_tratamiento_2008 !== '' ? ingresos.ingreso_tratamiento_2008 : 0
				) +
				parseFloat(ingresos.ingreso_valor_0814 !== '' ? ingresos.ingreso_valor_0814 : 0) +
				parseFloat(ingresos.ingreso_valor_1420 !== '' ? ingresos.ingreso_valor_1420 : 0) +
				parseFloat(ingresos.ingreso_valor_2008 !== '' ? ingresos.ingreso_valor_2008 : 0)
		);
		validarTurno();
	}, [ingresos]);

	useEffect(() => {
		setBalance((totalIngreso - totalEgreso).toFixed(2));
	}, [totalEgreso, totalIngreso]);

	const [dateTime, setDateTime] = useState({
		hours: date.format('h'),
		minutes: date.format('mm'),
		seconds: date.format('ss'),
		indicador: date.format('a'),
	});

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
						gap: '20%',
						flexDirection: 'row',
						width: '100%',
					}}
				>
					<div style={{ fontSize: '22px' }}>Balance Hídrico</div>
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
								<Form.Item name="codPaciente" style={{ width: '50%', margin: 0 }}>
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
                background: themeSettingsGlobal.COD_COLOR_1,
                color: '#fff'
							}}
							onClick={() => GuardarBalance()}
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
							<div style={{ fontSize: '22px' }}>
								{dateTime.hours}:{dateTime.minutes}:{dateTime.seconds} {dateTime.indicador}
							</div>
							<div>{Moment().locale('es').format('dddd, DD [de] MMMM [de] YYYY')}</div>
						</div>
					</Col>
					<Col
						xs={6}
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
						xs={18}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'start',
						}}
					>
						<Form.Item name="peso" style={{ margin: 0, padding: 0, width: '40%' }} label="Peso">
							<Input
								type="number"
								placeholder="Peso del paciente"
								onChange={e => {
									validarTurno();
									setEgresoPI(parseFloat(e.target.value) * parseFloat(estaciones));
									setIngresoAO((parseFloat(e.target.value) * parseFloat(estaciones)) / 3);
									setTotalEgreso(
										parseFloat(e.target.value) * parseFloat(estaciones) +
											parseFloat(egresos.egreso_diuresis_0814) +
											parseFloat(egresos.egreso_diuresis_1420) +
											parseFloat(egresos.egreso_diuresis_2008) +
											parseFloat(egresos.egreso_deposicion_0814) +
											parseFloat(egresos.egreso_deposicion_1420) +
											parseFloat(egresos.egreso_deposicion_2008) +
											parseFloat(egresos.egreso_temperatura_0814) +
											parseFloat(egresos.egreso_temperatura_1420) +
											parseFloat(egresos.egreso_temperatura_2008) +
											parseFloat(egresos.egreso_valor_0814) +
											parseFloat(egresos.egreso_valor_1420) +
											parseFloat(egresos.egreso_valor_2008)
									);
									setTotalIngreso(
										(parseFloat(e.target.value) * parseFloat(estaciones)) / 3 +
											parseFloat(ingresos.ingreso_oral_0814) +
											parseFloat(ingresos.ingreso_oral_1420) +
											parseFloat(ingresos.ingreso_oral_2008) +
											parseFloat(ingresos.ingreso_parental_0814) +
											parseFloat(ingresos.ingreso_parental_1420) +
											parseFloat(ingresos.ingreso_parental_2008) +
											parseFloat(ingresos.ingreso_tratamiento_0814) +
											parseFloat(ingresos.ingreso_tratamiento_1420) +
											parseFloat(ingresos.ingreso_tratamiento_2008) +
											parseFloat(ingresos.ingreso_valor_0814) +
											parseFloat(ingresos.ingreso_valor_1420) +
											parseFloat(ingresos.ingreso_valor_2008)
									);
								}}
							/>
						</Form.Item>
					</Col>
					<div style={{ display: 'none' }}>
						{/* INGRESOS */}
						<Divider />
						<Col xs={24} style={{ fontSize: '22px', paddingTop: '10px', paddingBottom: '10px' }}>
							<div>Ingresos</div>
						</Col>

						{/* Header */}
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>HORA</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>ORAL</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>PARENTAL</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>TRATAMIENTO</div>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>A.O.</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Form.Item name="ingreso_opcional" style={{ margin: 0, padding: 0 }}>
								<Input
									disabled={flagOpcionalI}
									placeholder="Opcional"
									onChange={e => {
										setIngresos({
											...ingresos,
											ingreso_opcional: e.target.value,
										});
										if (e.target.value === '') {
											setFlagIngresos(true);
										} else {
											setFlagIngresos(false);
										}
									}}
								/>
							</Form.Item>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>TOTAL</div>
						</Col>

						{/* 8:00 - 14:00 */}
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>08:00 AM - 02:00 PM</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Form.Item
								name="ingreso_oral_0814"
								style={{ margin: 0, padding: 0 }}
								rules={[
									{
										validator(_, value) {
											if (value === '0') {
												return Promise.reject();
											}
											return Promise.resolve();
										},
									},
								]}
							>
								<Input
									type="number"
									disabled={turno === 'M' ? false : true}
									placeholder="Oral"
									onChange={e => {
										setIngresos({
											...ingresos,
											ingreso_oral_0814: e.target.value,
										});
									}}
								/>
							</Form.Item>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Form.Item
								name="ingreso_parental_0814"
								style={{ margin: 0, padding: 0 }}
								rules={[
									{
										validator(_, value) {
											if (value === '0') {
												return Promise.reject();
											}
											return Promise.resolve();
										},
									},
								]}
							>
								<Input
									type="number"
									disabled={turno === 'M' ? false : true}
									placeholder="Parental"
									onChange={e => {
										setIngresos({
											...ingresos,
											ingreso_parental_0814: e.target.value,
										});
									}}
								/>
							</Form.Item>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Form.Item
								name="ingreso_tratamiento_0814"
								style={{ margin: 0, padding: 0 }}
								rules={[
									{
										validator(_, value) {
											if (value === '0') {
												return Promise.reject();
											}
											return Promise.resolve();
										},
									},
								]}
							>
								<Input
									type="number"
									disabled={turno === 'M' ? false : true}
									placeholder="Tratamiento"
									onChange={e => {
										setIngresos({
											...ingresos,
											ingreso_tratamiento_0814: e.target.value,
										});
									}}
								/>
							</Form.Item>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(ingresoAO / 4).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Form.Item
								name="ingreso_valor_0814"
								style={{ margin: 0, padding: 0 }}
								rules={[
									{
										validator(_, value) {
											if (value === '0') {
												return Promise.reject();
											}
											return Promise.resolve();
										},
									},
								]}
							>
								<Input
									disabled={!flagIngresos && turno === 'M' ? false : true}
									type="number"
									placeholder="Valor"
									onChange={e => {
										setIngresos({
											...ingresos,
											ingreso_valor_0814: e.target.value,
										});
									}}
								/>
							</Form.Item>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalIngreso0814).toFixed(2)}</div>
						</Col>

						{/* 14:00 - 20:00 */}
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>02:00 PM - 08:00 PM</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Form.Item
								name="ingreso_oral_1420"
								style={{ margin: 0, padding: 0 }}
								rules={[
									{
										validator(_, value) {
											if (value === '0') {
												return Promise.reject();
											}
											return Promise.resolve();
										},
									},
								]}
							>
								<Input
									type="number"
									disabled={turno === 'T' ? false : true}
									placeholder="Oral"
									onChange={e => {
										setIngresos({
											...ingresos,
											ingreso_oral_1420: e.target.value,
										});
									}}
								/>
							</Form.Item>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Form.Item
								name="ingreso_parental_1420"
								style={{ margin: 0, padding: 0 }}
								rules={[
									{
										validator(_, value) {
											if (value === '0') {
												return Promise.reject();
											}
											return Promise.resolve();
										},
									},
								]}
							>
								<Input
									type="number"
									disabled={turno === 'T' ? false : true}
									placeholder="Parental"
									onChange={e => {
										setIngresos({
											...ingresos,
											ingreso_parental_1420: e.target.value,
										});
									}}
								/>
							</Form.Item>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Form.Item
								name="ingreso_tratamiento_1420"
								style={{ margin: 0, padding: 0 }}
								rules={[
									{
										validator(_, value) {
											if (value === '0') {
												return Promise.reject();
											}
											return Promise.resolve();
										},
									},
								]}
							>
								<Input
									type="number"
									disabled={turno === 'T' ? false : true}
									placeholder="Tratamiento"
									onChange={e => {
										setIngresos({
											...ingresos,
											ingreso_tratamiento_1420: e.target.value,
										});
									}}
								/>
							</Form.Item>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(ingresoAO / 4).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Form.Item
								name="ingreso_valor_1420"
								style={{ margin: 0, padding: 0 }}
								rules={[
									{
										validator(_, value) {
											if (value === '0') {
												return Promise.reject();
											}
											return Promise.resolve();
										},
									},
								]}
							>
								<Input
									disabled={!flagIngresos && turno === 'T' ? false : true}
									type="number"
									placeholder="Valor"
									onChange={e => {
										setIngresos({
											...ingresos,
											ingreso_valor_1420: e.target.value,
										});
									}}
								/>
							</Form.Item>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalIngreso1420).toFixed(2)}</div>
						</Col>

						{/* 20:00 - 8:00 */}
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>08:00 PM - 08:00 AM</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Form.Item
								name="ingreso_oral_2008"
								style={{ margin: 0, padding: 0 }}
								rules={[
									{
										validator(_, value) {
											if (value === '0') {
												return Promise.reject();
											}
											return Promise.resolve();
										},
									},
								]}
							>
								<Input
									type="number"
									disabled={turno === 'N' ? false : true}
									placeholder="Oral"
									onChange={e => {
										setIngresos({
											...ingresos,
											ingreso_oral_2008: e.target.value,
										});
									}}
								/>
							</Form.Item>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Form.Item
								name="ingreso_parental_2008"
								style={{ margin: 0, padding: 0 }}
								rules={[
									{
										validator(_, value) {
											if (value === '0') {
												return Promise.reject();
											}
											return Promise.resolve();
										},
									},
								]}
							>
								<Input
									type="number"
									disabled={turno === 'N' ? false : true}
									placeholder="Parental"
									onChange={e => {
										setIngresos({
											...ingresos,
											ingreso_parental_2008: e.target.value,
										});
									}}
								/>
							</Form.Item>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Form.Item
								name="ingreso_tratamiento_2008"
								style={{ margin: 0, padding: 0 }}
								rules={[
									{
										validator(_, value) {
											if (value === '0') {
												return Promise.reject();
											}
											return Promise.resolve();
										},
									},
								]}
							>
								<Input
									type="number"
									disabled={turno === 'N' ? false : true}
									placeholder="Tratamiento"
									onChange={e => {
										setIngresos({
											...ingresos,
											ingreso_tratamiento_2008: e.target.value,
										});
									}}
								/>
							</Form.Item>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(ingresoAO / 2).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Form.Item
								name="ingreso_valor_2008"
								style={{ margin: 0, padding: 0 }}
								rules={[
									{
										validator(_, value) {
											if (value === '0') {
												return Promise.reject();
											}
											return Promise.resolve();
										},
									},
								]}
							>
								<Input
									disabled={!flagIngresos && turno === 'N' ? false : true}
									type="number"
									placeholder="Valor"
									onChange={e => {
										setIngresos({
											...ingresos,
											ingreso_valor_2008: e.target.value,
										});
									}}
								/>
							</Form.Item>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalIngreso2008).toFixed(2)}</div>
						</Col>

						{/* SUBTOTAL */}
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>TOTAL</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalOral).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalParental).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalTrataminto).toFixed(2)}</div>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(ingresoAO).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalOpcionalIngreso).toFixed(2)}</div>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalIngreso).toFixed(2)}</div>
						</Col>
					</div>

					{/* EGRESOS */}
					<Divider />
					<Col xs={24} style={{ fontSize: '22px', paddingTop: '10px', paddingBottom: '10px' }}>
						<div>Egresos</div>
					</Col>

					{/* Header */}
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div>HORA</div>
					</Col>
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div>DIURESIS</div>
					</Col>
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div>DEPOSICION</div>
					</Col>

					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Form.Item name="egreso_opcional" style={{ margin: 0, padding: 0 }}>
							<Input
								placeholder="Opcional"
								disabled={flagOpcionalE}
								onChange={e => {
									formRef.current.setFieldsValue({
										egreso_opcional: e.target.value,
									});
									if (e.target.value === '') {
										setFlagEgresos(true);
									} else {
										setFlagEgresos(false);
									}
								}}
							/>
						</Form.Item>
					</Col>
					{/* <Col
						xs={2}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div>TOTAL</div>
					</Col> */}

					{/* 8:00 - 14:00 */}
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div>08:00 AM - 02:00 PM</div>
					</Col>
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Form.Item
							name="egreso_diuresis_0814"
							style={{ margin: 0, padding: 0 }}
							rules={[
								{
									validator(_, value) {
										if (value === '0') {
											return Promise.reject();
										}
										return Promise.resolve();
									},
								},
							]}
						>
							<Input
								type="number"
								disabled={turno === 'M' ? false : true}
								placeholder="Diuresis"
								onChange={e => {
									setEgresos({
										...egresos,
										egreso_diuresis_0814: e.target.value,
									});
								}}
							/>
						</Form.Item>
					</Col>
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Form.Item
							name="egreso_deposicion_0814"
							style={{ margin: 0, padding: 0 }}
							rules={[
								{
									validator(_, value) {
										if (value === '0') {
											return Promise.reject();
										}
										return Promise.resolve();
									},
								},
							]}
						>
							<Input
								type="number"
								disabled={turno === 'M' ? false : true}
								placeholder="Deposición"
								onChange={e => {
									setEgresos({
										...egresos,
										egreso_deposicion_0814: e.target.value,
									});
								}}
							/>
						</Form.Item>
					</Col>
          <Col
						xs={4}
						style={{
							paddingBottom: '10px',
							display: 'none',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Form.Item
							name="egreso_temperatura_0814"
							style={{ margin: 0, padding: 0 }}
							rules={[
								{
									validator(_, value) {
										if (value === '0') {
											return Promise.reject();
										}
										return Promise.resolve();
									},
								},
							]}
						>
							<Input
								type="number"
								disabled={turno === 'M' ? false : true}
								placeholder="Temperatura"
								onChange={e => {
									setEgresos({
										...egresos,
										egreso_temperatura_0814: e.target.value,
									});
								}}
							/>
						</Form.Item>
					</Col>
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Form.Item
							name="egreso_valor_0814"
							style={{ margin: 0, padding: 0 }}
							rules={[
								{
									validator(_, value) {
										if (value === '0') {
											return Promise.reject();
										}
										return Promise.resolve();
									},
								},
							]}
						>
							<Input
								disabled={!flagEgresos && turno === 'M' ? false : true}
								type="number"
								placeholder="Valor"
								onChange={e => {
									setEgresos({
										...egresos,
										egreso_valor_0814: e.target.value,
									});
								}}
							/>
						</Form.Item>
					</Col>
					{/* <Col
						xs={2}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div>{parseFloat(totalEgreso0814).toFixed(2)}</div>
					</Col> */}

					{/* 14:00 - 20:00 */}
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div>02:00 PM - 08:00 PM</div>
					</Col>
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Form.Item
							name="egreso_diuresis_1420"
							style={{ margin: 0, padding: 0 }}
							rules={[
								{
									validator(_, value) {
										if (value === '0') {
											return Promise.reject();
										}
										return Promise.resolve();
									},
								},
							]}
						>
							<Input
								type="number"
								disabled={turno === 'T' ? false : true}
								placeholder="Diuresis"
								onChange={e => {
									setEgresos({
										...egresos,
										egreso_diuresis_1420: e.target.value,
									});
								}}
							/>
						</Form.Item>
					</Col>
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Form.Item
							name="egreso_deposicion_1420"
							style={{ margin: 0, padding: 0 }}
							rules={[
								{
									validator(_, value) {
										if (value === '0') {
											return Promise.reject();
										}
										return Promise.resolve();
									},
								},
							]}
						>
							<Input
								type="number"
								disabled={turno === 'T' ? false : true}
								placeholder="Deposición"
								onChange={e => {
									setEgresos({
										...egresos,
										egreso_deposicion_1420: e.target.value,
									});
								}}
							/>
						</Form.Item>
					</Col>
          <Col
						xs={4}
						style={{
							paddingBottom: '10px',
							display: 'none',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Form.Item
							name="egreso_temperatura_1420"
							style={{ margin: 0, padding: 0 }}
							rules={[
								{
									validator(_, value) {
										if (value === '0') {
											return Promise.reject();
										}
										return Promise.resolve();
									},
								},
							]}
						>
							<Input
								type="number"
								disabled={turno === 'T' ? false : true}
								placeholder="Temperatura"
								onChange={e => {
									setEgresos({
										...egresos,
										egreso_temperatura_1420: e.target.value,
									});
								}}
							/>
						</Form.Item>
					</Col>
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Form.Item
							name="egreso_valor_1420"
							style={{ margin: 0, padding: 0 }}
							rules={[
								{
									validator(_, value) {
										if (value === '0') {
											return Promise.reject();
										}
										return Promise.resolve();
									},
								},
							]}
						>
							<Input
								disabled={!flagEgresos && turno === 'T' ? false : true}
								type="number"
								placeholder="Valor"
								onChange={e => {
									setEgresos({
										...egresos,
										egreso_valor_1420: e.target.value,
									});
								}}
							/>
						</Form.Item>
					</Col>
					{/* <Col
						xs={2}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div>{parseFloat(totalEgreso1420).toFixed(2)}</div>
					</Col> */}

					{/* 20:00 - 8:00 */}
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div>08:00 PM - 08:00 AM</div>
					</Col>
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Form.Item
							name="egreso_diuresis_2008"
							style={{ margin: 0, padding: 0 }}
							rules={[
								{
									validator(_, value) {
										if (value === '0') {
											return Promise.reject();
										}
										return Promise.resolve();
									},
								},
							]}
						>
							<Input
								type="number"
								disabled={turno === 'N' ? false : true}
								placeholder="Diuresis"
								onChange={e => {
									setEgresos({
										...egresos,
										egreso_diuresis_2008: e.target.value,
									});
								}}
							/>
						</Form.Item>
					</Col>
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Form.Item
							name="egreso_deposicion_2008"
							style={{ margin: 0, padding: 0 }}
							rules={[
								{
									validator(_, value) {
										if (value === '0') {
											return Promise.reject();
										}
										return Promise.resolve();
									},
								},
							]}
						>
							<Input
								type="number"
								disabled={turno === 'N' ? false : true}
								placeholder="Deposición"
								onChange={e => {
									setEgresos({
										...egresos,
										egreso_deposicion_2008: e.target.value,
									});
								}}
							/>
						</Form.Item>
					</Col>
          <Col
						xs={4}
						style={{
							paddingBottom: '10px',
							display: 'none',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Form.Item
							name="egreso_temperatura_2008"
							style={{ margin: 0, padding: 0 }}
							rules={[
								{
									validator(_, value) {
										if (value === '0') {
											return Promise.reject();
										}
										return Promise.resolve();
									},
								},
							]}
						>
							<Input
								type="number"
								disabled={turno === 'N' ? false : true}
								placeholder="Temperatura"
								onChange={e => {
									setEgresos({
										...egresos,
										egreso_temperatura_2008: e.target.value,
									});
								}}
							/>
						</Form.Item>
					</Col>
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Form.Item
							name="egreso_valor_2008"
							style={{ margin: 0, padding: 0 }}
							rules={[
								{
									validator(_, value) {
										if (value === '0') {
											return Promise.reject();
										}
										return Promise.resolve();
									},
								},
							]}
						>
							<Input
								disabled={!flagEgresos && turno === 'N' ? false : true}
								type="number"
								placeholder="Valor"
								onChange={e => {
									setEgresos({
										...egresos,
										egreso_valor_2008: e.target.value,
									});
								}}
							/>
						</Form.Item>
					</Col>
					{/* <Col
						xs={2}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div>{parseFloat(totalEgreso2008).toFixed(2)}</div>
					</Col> */}

					{/* SUBTOTAL */}
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div>TOTAL</div>
					</Col>
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div>{parseFloat(totalDiuresis).toFixed(2)}</div>
					</Col>
					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div>{parseFloat(totalDeposicion).toFixed(2)}</div>
					</Col>

					<Col
						xs={6}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div>{parseFloat(totalOpcionalEgreso).toFixed(2)}</div>
					</Col>
					{/* <Col
						xs={2}
						style={{
							paddingBottom: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div>{parseFloat(totalEgreso).toFixed(2)}</div>
					</Col> */}
				</Row>
			</Form>
			<ToastContainer pauseOnHover={false} />
		</Card>
	);
};

export default TecnicoBalanceHidrico;
