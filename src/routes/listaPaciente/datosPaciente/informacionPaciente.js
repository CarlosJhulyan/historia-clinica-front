import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Col, Row, Button, Modal, Divider } from 'antd';
import { ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { ModalGuardarFinal } from '../../../components/modal/ModalGuardarFinal';
import store from '../../../appRedux/store';
import ReactToPrint from 'react-to-print';

import { httpClient } from '../../../util/Api';
import { useDispatch, useSelector } from 'react-redux';
import { limpiarDiagnosticoAction } from '../../../appRedux/actions/menu/diagnostico';
import { limpiarAnexo } from '../../../appRedux/actions/menu/anexos';
import {
	limpiarAntecedentesFisiologicos,
	limpiarAntecedentesGenerales,
	limpiarAntecedentesGineco,
	limpiarAntecedentesPatologicos,
	limpiarAntecedentesPatologicosFamiliares,
	limpiarOtros,
} from '../../../appRedux/actions/menu/antecedentes';
import { limpiarDesarrolloAction } from '../../../appRedux/actions/menu/desarrollo';
import { limpiarEnfermedadActual } from '../../../appRedux/actions/menu/enfermedadActual';
import {
	limpiarEvolucionTratamiento,
	limpiarRegistrosEvolucion,
} from '../../../appRedux/actions/menu/evolucionTratamiento';
import { limpiarExamenClinico } from '../../../appRedux/actions/menu/examenClinico';
import {
	limpiarEstadoFisico,
	limpiarFuncionesVitales,
} from '../../../appRedux/actions/menu/examenFisico';
import { limpiarImagenes } from '../../../appRedux/actions/menu/imagenes';
import { limpiarLaboratorio } from '../../../appRedux/actions/menu/laboratorio';
import { limpiarPestañas } from '../../../appRedux/actions/menu/pestañas';
import {
	limpiarProcedimientoInterconsultaReducer,
	limpiarProcedimientoReducer,
} from '../../../appRedux/actions/menu/procedimiento';
import {
	limpiarCabeceraReceta,
	limpiarTratamientoCabeceraDetalle,
	limpiarTratamientoReducer,
} from '../../../appRedux/actions/menu/tratamiento';
import { ModalDiagnostico } from '../../../components/modal/ModalDiagnostico';
import { limpiarOpacity, setOpacity } from '../../../appRedux/actions/Opacity';
import {
	setHistoriaClinica,
	setLimpiarHistoriaClinica,
} from '../../../appRedux/actions/menu/helpers';
import { ModalRequeridos } from '../../../components/modal/ModalRequeridos';
import { setClearUI, setMsgRequired } from '../../../appRedux/actions/ui';
import {
	ImpresionImagenes,
	ImpresionLaboratorio,
	ImpresionProcedimientos,
	ImpresionTratamientos,
} from '../../impresiones';

const InformacionPaciente = ({
	datosModal,
	setMostrarListaPaciente,
	setTabDefault,
	traerDatos,
}) => {
	const a = moment();
	const [estado, setEstado] = useState();
	const [firma, setFirma] = useState('');
	const [modalGuardar, setModalGuardar] = useState(false);
	const localS = JSON.parse(localStorage.getItem('token'));
	const [modalImpresion, setModalImpresion] = useState(false);
	const [modalCerrar, setModalCerrar] = useState(false);
	const [estadoImprimir, setEstadoImprimir] = useState(0);
	const diagnostico = useSelector(state => state.diagnostico);
	const [modalDiagnostico, setModalDiagnostico] = useState(false);
	const pestañasReducer = useSelector(state => state.pestañasReducer);
	const { historiaClinica } = useSelector(state => state.helpers);
	const [modalRequeridos, setModalRequeridos] = useState(false);

	const estadoFisico = useSelector(state => state.estadoFisico);
	const enfermedadActual = useSelector(state => state.enfermedadActual);
	const { filtroEspecialidad } = useSelector(state => state.ui);

	useEffect(() => {
		if (datosModal.estado) {
			console.log('Datos modal: ', datosModal.estado);
			setEstado({ ...datosModal.estado });
		}
	}, [datosModal, setEstado]);

	const traerFirma = useCallback(async () => {
		try {
			const { data } = await httpClient.post(`/medicos/getFirma`, {
				codMedico: JSON.parse(localStorage.getItem('token')).cod_medico,
			});
			console.log('FIRMA', data.data.url_firma);
			setFirma(data.data.url_firma);
		} catch (e) {
			console.log(e);
		}
	}, []);

	console.log("DATOS INFORMACION PACIENTE:", datosModal)

	//LIMPIANDO

	const limpiarData = () => {
		//Limpiar Data
		dispatch(limpiarDiagnosticoAction());
		dispatch(limpiarAnexo());
		dispatch(limpiarAntecedentesGenerales());
		dispatch(limpiarAntecedentesFisiologicos());
		dispatch(limpiarAntecedentesGineco());
		dispatch(limpiarAntecedentesPatologicos());
		dispatch(limpiarAntecedentesPatologicosFamiliares());
		dispatch(limpiarOtros());
		dispatch(limpiarDesarrolloAction());
		dispatch(limpiarEnfermedadActual());
		dispatch(limpiarEvolucionTratamiento());
		dispatch(limpiarRegistrosEvolucion());
		dispatch(limpiarExamenClinico());
		dispatch(limpiarFuncionesVitales());
		dispatch(limpiarEstadoFisico());
		dispatch(limpiarImagenes());
		dispatch(limpiarLaboratorio());
		dispatch(limpiarPestañas());
		dispatch(limpiarProcedimientoReducer());
		dispatch(limpiarProcedimientoInterconsultaReducer());
		dispatch(limpiarTratamientoCabeceraDetalle());
		dispatch(limpiarTratamientoReducer());
		dispatch(limpiarCabeceraReceta());
		dispatch(limpiarOpacity());
		dispatch(setLimpiarHistoriaClinica());
		dispatch(setClearUI());
	};

	///GUARDANDO

	const fechaActual = moment().format('DD/MM/YYYY');
	const [enviarData, setEnviarData] = useState({});
	const [enviarData2, setEnviarData2] = useState({});

	const onClickAgregar = async () => {
		const estadoRedux = store.getState();
		const enfermedadActual = estadoRedux.enfermedadActual;
		const triaje = estadoRedux.funcionVital;
		const diagnostico = estadoRedux.diagnostico;
		const cabeceraReceta = estadoRedux.tratamientoCabeceraReceta;
		const cabeceraDetalle = estadoRedux.tratamientoDetalle;
		const tratamiento = estadoRedux.tratamiento;
		const estadoFisico = estadoRedux.estadoFisico;
		//const estadoConsulta =  ;
		//const codPaciente = ;
		const estomatologico = estadoRedux.examenClinico;
		const consultasProcedimientos = estadoRedux.procedimientoReducer;
		const imagenes = estadoRedux.imagenes;
		const laboratorio = estadoRedux.laboratorio;
		const desarrollo = estadoRedux.desarrollo;
		const interconsulta = estadoRedux.procedimientoInterconsulta;

		const data = {
			codGrupoCia: datosModal.estado.COD_GRUPO_CIA,
			codCia: datosModal.estado.COD_CIA,
			codMedico: localS.cod_medico,
			codLocal: datosModal.estado.COD_LOCAL_ANTECENDENTE,
			numAtencion: datosModal.estado.NUM_ATEN_MED,
			enfermedadActual: {
				motivoConsulta: enfermedadActual.motivoConsulta,
				tipoInformante: enfermedadActual.tipoInformante,
				tiempoEnfermedad: enfermedadActual.tiempoEnfermedad,
				curso: enfermedadActual.curso,
				relatoCronologico: enfermedadActual.relatoCronologico,
				apetito: enfermedadActual.apetito,
				sed: enfermedadActual.sed,
				sueno: enfermedadActual.sueno,
				orina: enfermedadActual.orina,
				deposicion: enfermedadActual.deposicion,
			},
			triaje: {
				pa_1: triaje.pa_1,
				pa_2: triaje.pa_2,
				fr: triaje.fr,
				fc: triaje.fc,
				temp: triaje.temp,
				peso: triaje.peso,
				talla: triaje.talla,
				satoxigeno: triaje.satoxigeno,
			},
			estadoFisico: {
				estadoGeneral: estadoFisico.estadoGeneral,
				estadoConciencia: estadoFisico.estadoConciencia,
				exaFisicoDirigido: estadoFisico.examenFisico,
				imc: isNaN(estadoFisico.imc) ? 0 : estadoFisico.imc,
				medCintura: estadoFisico.medCintura === null ? 0 : estadoFisico.medCintura,
			},
			diagnostico: diagnostico,
			cabeceraReceta: {
				cantitems: cabeceraDetalle.length,
				fechavigencia: cabeceraReceta.fechavigencia,
			},
			cabeceraDetalle: cabeceraDetalle,
			tratamiento: {
				indicacionesgen: tratamiento.indicacionesgen,
				validezreceta: tratamiento.validezreceta,
			},
			estadoConsulta: {
				codestadonew: '',
			},
			codPaciente: datosModal.estado.COD_PACIENTE,
			estomatologico: {
				fecha: estomatologico.fecha,
				cara: estomatologico.cara,
				cuello: estomatologico.cuello,
				piel: estomatologico.piel,
				ganglios: estomatologico.ganglios,
				atm: estomatologico.atm,
				labios: estomatologico.labios,
				carrillos: estomatologico.carrillos,
				fondo_surco: estomatologico.fondo_surco,
				periodonto: estomatologico.periodonto,
				zona_retromolar: estomatologico.zona_retromolar,
				saliva: estomatologico.saliva,
				glandulas_salivales: estomatologico.glandulas_salivales,
				lengua: estomatologico.lengua,
				paladar_duro: estomatologico.paladar_duro,
				paladar_blando: estomatologico.paladar_blando,
				piso_boca: estomatologico.piso_boca,
				orofaringe: estomatologico.orofaringe,
				indice_higiene_oral: estomatologico.indice_higiene_oral,
				hendidura_gingival: estomatologico.hendidura_gingival,
				vitalidad_palpar: estomatologico.vitalidad_palpar,
				odusion: estomatologico.odusion,
				guia_anterior: estomatologico.guia_anterior,
				interferencias: estomatologico.interferencias,
				contacto_prematuro: estomatologico.contacto_prematuro,
				rebordes_alveolare: estomatologico.rebordes_alveolare,
				tuberosidades: estomatologico.tuberosidades,
			},
			interconsultas: {
				dataProcedimiento: interconsulta.dataProcedimiento,
				recomendacion: interconsulta.recomendacion,
			},
			consultasProcedimientos: {
				recomendacion: consultasProcedimientos.recomendacion,
				dataProcedimiento: consultasProcedimientos.dataProcedimiento,
			},
			imagenes: {
				recomendacion: imagenes.recomendacion,
				dataProcedimiento: imagenes.dataProcedimiento,
			},
			laboratorio: {
				recomendacion: laboratorio.recomendacion,
				dataLaboratorio: laboratorio.dataProcedimiento,
			},
			desarrolloProcedimiento: {
				relatoMedico: desarrollo.relatoMedico,
				conclusion: desarrollo.conclusion,
				observaciones: desarrollo.observaciones,
			},
		};

		/////////////////////////////////////////////////////

		const data2 = {
			diagnosticos: diagnostico,
			imagenes: imagenes.dataProcedimiento,
			laboratorios: laboratorio.dataProcedimiento,
			tratamientos: cabeceraDetalle,
			interconsultas: interconsulta.dataProcedimiento,
			procedimientos: consultasProcedimientos.dataProcedimiento,
		};

		setEnviarData(data);
		setEnviarData2(data2);
		setModalGuardar(true);
	};

	const impresionRef = useRef();
	const estados = store.getState();
	const dispatch = useDispatch();

	const pageStyle = `
		@page {
			margin: 15
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

	const onClickRetroceder = () => {
		//Volver
		setMostrarListaPaciente(true);
		//Limpiar Data
		dispatch(limpiarDiagnosticoAction());
		dispatch(limpiarAnexo());
		dispatch(limpiarAntecedentesGenerales());
		dispatch(limpiarAntecedentesFisiologicos());
		dispatch(limpiarAntecedentesGineco());
		dispatch(limpiarAntecedentesPatologicos());
		dispatch(limpiarAntecedentesPatologicosFamiliares());
		dispatch(limpiarOtros());
		dispatch(limpiarDesarrolloAction());
		dispatch(limpiarEnfermedadActual());
		dispatch(limpiarEvolucionTratamiento());
		dispatch(limpiarRegistrosEvolucion());
		dispatch(limpiarExamenClinico());
		dispatch(limpiarFuncionesVitales());
		dispatch(limpiarEstadoFisico());
		dispatch(limpiarImagenes());
		dispatch(limpiarLaboratorio());
		dispatch(limpiarPestañas());
		dispatch(limpiarProcedimientoReducer());
		dispatch(limpiarProcedimientoInterconsultaReducer());
		dispatch(limpiarTratamientoCabeceraDetalle());
		dispatch(limpiarTratamientoReducer());
		dispatch(limpiarCabeceraReceta());
		dispatch(limpiarOpacity());
		dispatch(setLimpiarHistoriaClinica());
		dispatch(setClearUI());
	};

	const token = JSON.parse(localStorage.getItem('token'));
	/* const arrayTemp = ['RADIOLOGIA', 'MAMOGRAFIA', 'DENSITOMETRIA OSEA', 'ECOGRAFIA', 'LABORATORIO'];
	const especialidad = arrayTemp.filter((item) => token.des_especialidad.includes(item)); */

	const especialidad = filtroEspecialidad?.filter(item =>
		token.des_especialidad.includes(item.des)
	);

	const guardarDatosPaciente = () => {
		switch (pestañasReducer.actual) {
			case 'medicaGeneral':
				if (diagnostico.length > 0) {
					onClickAgregar();
					traerFirma();
				} else if (especialidad.length > 0) {
					if (
						enfermedadActual.tiempoEnfermedad === '' ||
						enfermedadActual.tipoInformante === '' ||
						enfermedadActual.relatoCronologico === '' ||
						estadoFisico.estadoGeneral === '' ||
						estadoFisico.estadoConciencia === '' ||
						estadoFisico.examenFisico === ''
					) {
						dispatch(setMsgRequired(true));
						setModalRequeridos(true);
					} else {
						dispatch(setMsgRequired(false));
						onClickAgregar();
						traerFirma();
					}
				} else {
					setModalDiagnostico(true);
				}

				break;

			case 'odontologica':
				onClickAgregar();
				traerFirma();
				break;

			case 'procedimental':
				onClickAgregar();
				traerFirma();
				break;

			default:
				break;
		}
	};

	const imagenes = useSelector(state => state.imagenes);
	const laboratorio = useSelector(state => state.laboratorio);
	const procedimientoReducer = useSelector(state => state.procedimientoReducer);
	const tratamientoDetalle = useSelector(state => state.tratamientoDetalle);

	return (
		<div style={{ padding: '20px 20px 0 20px' }}>
			<Row style={{ flexDirection: 'row', paddingBottom: '10px' }}>
				<Col xl={20} lg={20} md={24} sm={24} xs={24}>
					<Row style={{ flexDirection: 'row', paddingBottom: '20px' }}>
						<Col
							lg={18}
							md={24}
							sm={24}
							xs={24}
							style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '5px' }}
						>
							<Button
								className="gx-mb-0"
								type="default"
								htmlType="submit"
								style={{ marginRight: 30 }}
								onClick={() => onClickRetroceder()}
							>
								<ArrowLeftOutlined />
							</Button>
							<h2 style={{ fontWeight: 'bold', fontSize: '20px', margin: '0' }}>
								DATOS DEL PACIENTE
							</h2>
						</Col>
					</Row>
					<Row style={{ flexDirection: 'row' }}>
						<Col lg={5} md={8} sm={12} xs={24}>
							<h4 style={{ fontWeight: 'bold', fontSize: '17px' }}>NOMBRE Y APELLIDO:</h4>
						</Col>
						<Col lg={9} md={16} sm={12} xs={24}>
							<h4>
								{estado ? estado.NOMBRE : null} {estado ? estado.APE_PATERNO : null}{' '}
								{estado ? estado.APE_MATERNO : null}
							</h4>
						</Col>
						<Col lg={5} md={8} sm={12} xs={24}>
							<h4 style={{ fontWeight: 'bold', fontSize: '17px' }}>HISTORIA CLÍNICA:</h4>
						</Col>
						<Col lg={5} md={16} sm={12} xs={24}>
							<h4>{estado ? estado.NRO_HC_ACTUAL : null}</h4>
						</Col>
						<Col lg={5} md={8} sm={12} xs={24}>
							<h4 style={{ fontWeight: 'bold', fontSize: '17px' }}>TIPO DOCUMENTO:</h4>
						</Col>
						<Col lg={9} md={16} sm={12} xs={24}>
							{estado ? <h4> {(estado.COD_TIP_DOCUMENTO = '01') ? 'DNI' : 'OTRO'} </h4> : null}
						</Col>
						<Col lg={5} md={8} sm={12} xs={24}>
							<h4 style={{ fontWeight: 'bold', fontSize: '17px' }}>FECHA NACIMIENTO:</h4>
						</Col>
						<Col lg={5} md={16} sm={12} xs={24}>
							<h4>{estado ? estado.FEC_NAC_CLI._i : null}</h4>
						</Col>
						<Col lg={5} md={8} sm={12} xs={24}>
							<h4 style={{ fontWeight: 'bold', fontSize: '17px' }}>NRO. DOCUMENTO:</h4>
						</Col>
						<Col lg={9} md={16} sm={12} xs={24}>
							<h4>{estado ? estado.NUM_DOCUMENTO : null}</h4>
						</Col>
						<Col lg={5} md={8} sm={12} xs={24}>
							<h4 style={{ fontWeight: 'bold', fontSize: '17px' }}>EDAD:</h4>
						</Col>
						<Col lg={5} md={16} sm={12} xs={24}>
							<h4>{estado ? estado.EDAD : null}</h4>
						</Col>
					</Row>
				</Col>
				<Col
					xl={4}
					lg={4}
					md={24}
					sm={24}
					xs={24}
					style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
				>
					<Button
						disabled={historiaClinica ? true : pestañasReducer.actual === '' ? true : false}
						className="gx-mb-0"
						type="primary"
						htmlType="submit"
						style={{
							height: 'auto',
							width: '95%',
							lineHeight: '1.5em',
							wordWrap: 'break-word',
							whiteSpace: 'break-spaces',
							padding: '10px',
							marginTop: '10px',
						}}
						onClick={() => guardarDatosPaciente()}
					>
						Guardar datos del paciente
					</Button>
				</Col>

				<Modal
					okType="primary"
					//title="¿Está seguro de Salir?"
					okText="Si, Salir"
					cancelText="No, Cancelar"
					onOk={() => {
						limpiarData();
						setMostrarListaPaciente(true);
						setModalCerrar(false);
						setModalImpresion(false);
						setEstadoImprimir(0);
						dispatch(setOpacity(true));
					}}
					onCancel={() => {
						setModalCerrar(false);
					}}
					visible={modalCerrar}
				>
					<div>
						<h2>
							<InfoCircleOutlined style={{ color: 'orange', fontSize: '30px' }} />
							<span style={{ fontWeight: 'bold' }}> ¿Está seguro de Salir?</span>
						</h2>
						{/* <h2 style={{ fontWeight: 'bold' }}><InfoCircleOutlined style={{ color: 'orange', fontSize: '30px' }} /> ¿Está seguro de Salir?</h2> */}
					</div>
					<br />
					<div>
						<h4>
							Los datos de impresion se eliminarán permanentemente y no podrán ser recuperados.
						</h4>
					</div>
				</Modal>

				<Modal
					visible={modalImpresion}
					width={305}
					onCancel={() => {
						setModalCerrar(true);
						//setModalImpresion(false);
						//setEstadoImprimir(0);
					}}
					footer={
						estadoImprimir !== 0
							? [
								<ReactToPrint
									pageStyle={pageStyle}
									trigger={() => <Button type="primary">Imprimir</Button>}
									content={() => impresionRef.current}
								/>,
							]
							: []
					}
					title="Imprimir recetas"
					maskClosable={false}
				>
					{imagenes.dataProcedimiento.length < 1 &&
						laboratorio.dataProcedimiento.length < 1 &&
						procedimientoReducer.dataProcedimiento.length < 1 &&
						tratamientoDetalle.length < 1 ? (
						<div>No hay recetas para imprimir</div>
					) : null}
					{imagenes.dataProcedimiento.length > 0 ? (
						<div
							style={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: 15,
							}}
						>
							<div>Imagenes</div>
							<div>
								<Button onClick={() => setEstadoImprimir(1)} style={{ margin: 0 }}>
									Ver
								</Button>
							</div>
						</div>
					) : null}
					{laboratorio.dataProcedimiento.length > 0 ? (
						<div
							style={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: 15,
							}}
						>
							<div>Laboratorio</div>
							<div>
								<Button onClick={() => setEstadoImprimir(2)} style={{ margin: 0 }}>
									Ver
								</Button>
							</div>
						</div>
					) : null}
					{procedimientoReducer.dataProcedimiento.length > 0 ? (
						<div
							style={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: 15,
							}}
						>
							<div>Procedimientos / Consultas</div>
							<div>
								<Button onClick={() => setEstadoImprimir(3)} style={{ margin: 0 }}>
									Ver
								</Button>
							</div>
						</div>
					) : null}
					{tratamientoDetalle.length > 0 ? (
						<div
							style={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: 30,
							}}
						>
							<div>Tratamientos</div>
							<div>
								<Button onClick={() => setEstadoImprimir(4)} style={{ margin: 0 }}>
									Ver
								</Button>
							</div>
						</div>
					) : null}

					{estadoImprimir !== 0 ? <Divider /> : null}

					<div
						ref={impresionRef}
						style={{ width: '100%', fontSize: 10, lineHeight: 1.5, maxWidth: 257 }}
					>
						{estadoImprimir === 1 ? (
							<ImpresionImagenes
								fechaActual={fechaActual}
								medico={localS.des_ape_medico + ', ' + localS.des_nom_medico}
								cmp={localS.num_cmp}
								especialidad={localS.des_especialidad}
								paciente={
									datosModal.estado.APE_PATERNO +
									' ' +
									datosModal.estado.APE_MATERNO +
									', ' +
									datosModal.estado.NOMBRE
								}
								historiaClinica={datosModal.estado.NRO_HC_ACTUAL}
								dni={datosModal.estado.NUM_DOCUMENTO}
								fechaNacimiento={datosModal.estado.FEC_NAC_CLI}
								codMedico={localS.cod_medico}
								estados={estados}
								firma={firma}
							/>
						) : estadoImprimir === 2 ? (
							<ImpresionLaboratorio
								fechaActual={fechaActual}
								medico={localS.des_ape_medico + ', ' + localS.des_nom_medico}
								cmp={localS.num_cmp}
								especialidad={localS.des_especialidad}
								paciente={
									datosModal.estado.APE_PATERNO +
									' ' +
									datosModal.estado.APE_MATERNO +
									', ' +
									datosModal.estado.NOMBRE
								}
								historiaClinica={datosModal.estado.NRO_HC_ACTUAL}
								dni={datosModal.estado.NUM_DOCUMENTO}
								fechaNacimiento={datosModal.estado.FEC_NAC_CLI}
								codMedico={localS.cod_medico}
								estados={estados}
								firma={firma}
							/>
						) : estadoImprimir === 3 ? (
							<ImpresionProcedimientos
								fechaActual={fechaActual}
								medico={localS.des_ape_medico + ', ' + localS.des_nom_medico}
								cmp={localS.num_cmp}
								especialidad={localS.des_especialidad}
								paciente={
									datosModal.estado.APE_PATERNO +
									' ' +
									datosModal.estado.APE_MATERNO +
									', ' +
									datosModal.estado.NOMBRE
								}
								historiaClinica={datosModal.estado.NRO_HC_ACTUAL}
								dni={datosModal.estado.NUM_DOCUMENTO}
								fechaNacimiento={datosModal.estado.FEC_NAC_CLI}
								codMedico={localS.cod_medico}
								estados={estados}
								firma={firma}
							/>
						) : estadoImprimir === 4 ? (
							<ImpresionTratamientos
								fechaActual={fechaActual}
								medico={localS.des_ape_medico + ', ' + localS.des_nom_medico}
								cmp={localS.num_cmp}
								especialidad={localS.des_especialidad}
								paciente={
									datosModal.estado.APE_PATERNO +
									' ' +
									datosModal.estado.APE_MATERNO +
									', ' +
									datosModal.estado.NOMBRE
								}
								historiaClinica={datosModal.estado.NRO_HC_ACTUAL}
								dni={datosModal.estado.NUM_DOCUMENTO}
								fechaNacimiento={datosModal.estado.FEC_NAC_CLI}
								codMedico={localS.cod_medico}
								estados={estados}
								firma={firma}
							/>
						) : null}
					</div>
				</Modal>

				{datosModal.estado.alergias !== '' && datosModal.estado.alergias ? (
					<Col span={24} style={{ paddingTop: 15 }}>
						<div style={{ backgroundColor: '#F60F5B', padding: 10, color: 'white', fontSize: 16 }}>
							<div style={{ textAlign: 'center' }}>
								<b style={{ fontWeight: 600 }}>Alergias: </b>
								{datosModal.estado.alergias} / <b style={{ fontWeight: 600 }}>Otros: </b>{' '}
								{datosModal.estado.otros}
							</div>
							<div></div>
						</div>
					</Col>
				) : null}
			</Row>
			{modalGuardar ? (
				<ModalGuardarFinal
					limpiarData={limpiarData}
					traerDatos={traerDatos}
					setMostrarListaPaciente={setMostrarListaPaciente}
					enviarData={enviarData}
					enviarData2={enviarData2}
					modalGuardar={modalGuardar}
					setModalGuardar={setModalGuardar}
					setModalImpresion={setModalImpresion}
				/>
			) : null}

			{modalDiagnostico ? (
				<ModalDiagnostico
					modalDiagnostico={modalDiagnostico}
					setModalDiagnostico={setModalDiagnostico}
					setTabDefault={setTabDefault}
				/>
			) : null}

			{modalRequeridos ? (
				<ModalRequeridos
					modalRequeridos={modalRequeridos}
					setModalRequeridos={setModalRequeridos}
					setTabDefault={setTabDefault}
				/>
			) : null}
		</div>
	);
};

export default InformacionPaciente;
