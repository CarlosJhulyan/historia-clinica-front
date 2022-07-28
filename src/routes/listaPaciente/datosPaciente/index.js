import React, { useEffect, useState } from 'react';
import { Button, Card, Tabs, Row, Col, Modal, Divider, Tree } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import InformacionPaciente from './informacionPaciente';
import EnfermedadActual from './enfermedadActual';
import ExamenFisico from './examenFisico/index';
import Diagnostico from './diagnostico';
import EvolucionTratamiento from './evolucionTratamiento';
import SeptimaParte from './tratamiento';
import Odontograma from './odontograma';
import Historial from './historialOdonto';
import Anexos from './anexos/index';
import Desarrollo from './desarrollo';
import { useDispatch, useSelector } from 'react-redux';
import { quitar_seleccion } from '../../../appRedux/actions/Menu';
import {
	setHistoriaAntecedentes,
	setHistoriaClinica,
} from '../../../appRedux/actions/menu/helpers';

import './styles.css';
import { httpClient } from '../../../util/Api';
import { Laboratorio } from './Laboratorio';
import { Imagenes } from './imagenes';
import { Procedemientos } from './Procedimientos';
import {
	AntecedentesHC,
	consultasProcedimiento,
	enfermedadActual,
	evolucionTratamiento,
	examenFisico,
	imagenes,
	laboratorio,
	traerAntecedentes,
	traerCombos,
	traerEstematologico,
	traerEvolucionTratamiento,
	traerPatologicos,
	traerPatologicosFamiliares,
	traerInterconsulta,
	tratamiento,
	traerAnexo,
	desarrolloProcedimientos,
	traerAntecedentesPaneles,
	consultaMedicaGeneral,
	consultaOdontologica,
	consultaProcedimental,
	traerFuncionesVitales,
	traerEvolucionTratamientoOdonto,
	antecedengesGenrales,
	AntecedentesGenerales,
	getListaIgnorados,
	getComboEspecialidades,
} from './apis';
import AntecedentesModal from './antecedentes/index';
import { Interconsultas } from './Procedimientos/interconsulta';
import Estematologico from './estematologico';
import store from '../../../appRedux/store';
import moment from 'moment';
import { notificaciones, openNotification } from '../../../util/util';
import { setRegistrosEvolucion } from '../../../appRedux/actions/menu/evolucionTratamiento';
import { setEstadoOdonotograma } from '../../../appRedux/actions';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setPestañas } from '../../../appRedux/actions/menu/pestañas';
import EvolucionTratamientoOdonto from './evolucionTratamientoOdonto';
import { ModalHC } from '../../../components/modal/ModalHC';
import { ModalHA } from '../../../components/modal/ModalHA';
import { ModalResultadoLab } from '../../../components/modal/ModalResultadoLab';
import { ModalSeguimiento } from '../../../components/modal/ModalSeguimiento';
import axios from 'axios';
import ModalLoading from '../../../util/modalLoading';

const DatosPaciente = ({ datosModal, setMostrarListaPaciente, traerDatos, setDatosModal }) => {
  const [cargandoGlobal, setCargandoGlobal] = useState(false);
	console.log('DATOS MODAL222222222222222:', datosModal);
	const dispatch = useDispatch();

	const token = JSON.parse(localStorage.getItem('token'));
	const [opcion, setOpcion] = useState();
	const [state, setState] = useState();
	const [abrirModal, setAbrirModal] = useState(false);

	const [abrirModalHc, setAbrirModalHc] = useState(false);
	const [abrirModalHA, setAbrirModalHA] = useState(false);
	const [abrirResultadoLab, setAbrirResultadoLab] = useState(false);
	const [abrirSeguimientoM, setAbrirSeguimientoM] = useState(false);

	const [abrirModalOpciones, setAbrirModalOpciones] = useState(false);
	const [checkedKeys, setCheckedKeys] = useState([]);
	const [selectedKey, setSelectedKey] = useState([]);
	/* const [comboEspecialidad, setComboEspecialidad] = useState([]); */
	const { historiaClinica, historiaAntecedentes } = useSelector(state => state.helpers);

	const data = useSelector(state => state.dataGlobal);

	const [numeroAntecedente, setNumeroAntecedente] = useState(parseInt(data.secuenciaAntecedente));
	const [estado, setEstado] = useState({
		especificaciones: '',
		observaciones: '',
	});

	const TabPane = Tabs.TabPane;

	const pestañasReducer = useSelector(state => state.pestañasReducer);
	const [tabDefault, setTabDefault] = useState();
	const opacity = useSelector(state => state.opacity);

	// ---------------- ENVIAR DATOS -------------
	const usuario = JSON.parse(localStorage.getItem('token'));

	const dataGlobal = {
		codGrupoCia: data.codGrupoCia,
		codLocal: data.codLocal,
		codCia: data.codCia,
		nroAtencion: data.nroAtencion,
		codPaciente: data.codPaciente,
		secuenciaAntecedente: numeroAntecedente,
	};

	const setEstadosOdontograma = data => {
		dispatch(setEstadoOdonotograma(data));
	};

	const traerDataAtencionPacienteActual = async (datos) => {
		const { data: { data = [] } } = await httpClient.post('pacientes/getAtencionPaciente', datos);
		const estado = {
			...datosModal.estado,
			dataMedico: data
		}
		setDatosModal({
			...datosModal,
			estado
		});
	}

	useEffect(() => {
		const asyncronized = async () => {
      setCargandoGlobal(true);
      openNotification('', 'Cargando lista de ignorados', 'Info');
      await getListaIgnorados();
      setCargandoGlobal(true);
      openNotification('', 'Cargando antecedentes generales', 'Info');
      await AntecedentesGenerales();
      setCargandoGlobal(true);
      openNotification('', 'Cargando diagóstico', 'Info');
      await traerCombos(dataGlobal);
      setCargandoGlobal(true);
      openNotification('', 'Cargando anexos', 'Info');
      await traerAnexo(dataGlobal);
      setCargandoGlobal(true);
      openNotification('', 'Cargando datos del paciente actual', 'Info');
      await traerDataAtencionPacienteActual(dataGlobal);
      setCargandoGlobal(false);
    }
    asyncronized();
	}, []);

	useEffect(() => {
    const asyncronized = async () => {
      if (!historiaAntecedentes) {
        setCargandoGlobal(true);
        await traerAntecedentes(dataGlobal);
        setCargandoGlobal(true);
        openNotification('', 'Cargando antecedentes de historia clínica', 'Info');
        await AntecedentesHC(dataGlobal);
        setCargandoGlobal(true);
        openNotification('', 'Cargando patológicos', 'Info');
        await traerPatologicos(dataGlobal);
        setCargandoGlobal(true);
        await traerPatologicosFamiliares(dataGlobal);
        setCargandoGlobal(true);
        openNotification('', 'Cargando antecedentes penales', 'Info');
        await traerAntecedentesPaneles(dataGlobal);
        setCargandoGlobal(false);
      }
    }
    asyncronized();
	}, [historiaAntecedentes]);

	useEffect(() => {
    const asyncronized = async () => {
      if (!historiaClinica) {
        setCargandoGlobal(true);
        examenFisico(dataGlobal);
        openNotification('', 'Cargando evolución tratamiento', 'Info');
        await traerEvolucionTratamiento(dataGlobal);
        tratamiento(dataGlobal);
        consultasProcedimiento(dataGlobal);
        openNotification('', 'Cargando interconsulta', 'Info');
        await traerInterconsulta(dataGlobal);
        imagenes(dataGlobal);
        laboratorio(dataGlobal);
        traerEstematologico(dataGlobal);
        openNotification('', 'Cargando evolución tratamiento odontológico', 'Info');
        await traerEvolucionTratamientoOdonto(dataGlobal);
        desarrolloProcedimientos(dataGlobal);
        setCargandoGlobal(false);
      }
      return () => {
        dispatch(setRegistrosEvolucion([]));
      };
    }
    asyncronized();
	}, [historiaClinica]);


	const abc = key => {
		switch (key) {
			case '11':
				setEstadosOdontograma('historial');
				dispatch(quitar_seleccion());
				break;
			case '10':
				setEstadosOdontograma('evolutivo');
				dispatch(quitar_seleccion());
				break;
			default:
				dispatch(quitar_seleccion());
				break;
		}
	};

	const boton_1 = [
		{
			title: 'Enfermedad Actual',
			content: <EnfermedadActual />,
			key: '1',
		},
		{
			title: 'Examen Físico',
			content: <ExamenFisico />,
			key: '2',
		},
		{
			title: 'Diagnóstico',
			content: <Diagnostico datosModal={datosModal} />,
			key: '3',
		},
		{
			title: 'Evolución  del tratamiento',
			content: <EvolucionTratamiento datosModal={datosModal} />,
			key: '4',
		},
		{
			title: 'Tratamiento',
			content: (
				<SeptimaParte
					datosModal={datosModal}
					// dataTratamiento={dataTratamiento}
					//viaAdministracion={viaAdministracion}
					//obsTratamiento={obsTratamiento}
				/>
			),
			key: '5',
		},
		{
			title: 'Anexos',
			content: <Anexos datosModal={datosModal} />,
			key: '6',
		},
		{
			title: 'Consultas / Procedimiento',
			content: (
				<div>
					{usuario.des_especialidad !== null ? (
						<div style={{ textAlign: 'center', marginTop: 10 }}>
							<h1>
								<b>PROCEDIMIENTO DE LA ESPECIALIDAD: {usuario.des_especialidad}</b>
							</h1>
						</div>
					) : null}
					<Procedemientos datosModal={datosModal} />
					<Divider style={{ fontSize: 20, fontWeight: 600 }}>Interconsulta</Divider>
					<Interconsultas datosModal={datosModal} />
				</div>
			),
			key: '7',
		},
		{
			title: 'Imágenes',
			content: <Imagenes datosModal={datosModal} />,
			key: '8',
		},
		{
			title: 'Laboratorio',
			content: <Laboratorio datosModal={datosModal} />,
			key: '9',
		},
	];
	const boton_2 = [
		{
			title: 'Enfermedad Actual',
			content: <EnfermedadActual />,
			key: '19',
		},
		{
			title: 'Diagnóstico',
			content: <Diagnostico datosModal={datosModal} />,
			key: '20',
		},
		{
			title: 'Examen Clinico Estomatológico',
			content: <Estematologico />,
			key: '18',
		},
		{
			title: 'Odontograma',
			content: <Odontograma estado={estado} setEstado={setEstado} datosModal={datosModal} />,
			key: '10',
		},
		{
			title: 'Historial - Odontograma',
			content: <Historial datosModal={datosModal} estado={estado} setEstado={setEstado} />,
			key: '11',
		},
		{
			title: 'Evolución  del tratamiento',
			content: <EvolucionTratamientoOdonto datosModal={datosModal} />,
			key: '21',
		},
		{
			title: 'Anexos',
			content: <Anexos datosModal={datosModal} />,
			key: '22',
		},
		{
			title: 'Tratamiento/Receta',
			content: <SeptimaParte datosModal={datosModal} />,
			key: '23',
		},
		{
			title: 'Interconsulta/Procedimiento',
			content: (
				<div>
					{usuario.des_especialidad !== null ? (
						<div style={{ textAlign: 'center', marginTop: 10 }}>
							<h1>
								<b>PROCEDIMIENTO DE LA ESPECIALIDAD: {usuario.des_especialidad}</b>
							</h1>
						</div>
					) : null}
					<Procedemientos datosModal={datosModal} />
					<Divider style={{ fontSize: 20, fontWeight: 600 }}>Interconsulta</Divider>
					<Interconsultas datosModal={datosModal} />
				</div>
			),
			key: '24',
		},
		{
			title: 'Imágenes',
			content: <Imagenes datosModal={datosModal} />,
			key: '25',
		},
		{
			title: 'Laboratorio',
			content: <Laboratorio datosModal={datosModal} />,
			key: '26',
		},
	];

	const boton_3 = [
		{
			title: 'Desarrollo de procedimiento',
			content: <Desarrollo />,
			key: '12',
		},
		{
			title: 'Anexos',
			content: <Anexos datosModal={datosModal} />,
			key: '13',
		},
		{
			title: 'Interconsulta/Procedimiento',
			content: (
				<div>
					{usuario.des_especialidad !== null ? (
						<div style={{ textAlign: 'center', marginTop: 10 }}>
							<h1>
								<b>PROCEDIMIENTO DE LA ESPECIALIDAD: {usuario.des_especialidad}</b>
							</h1>
						</div>
					) : null}
					<Procedemientos datosModal={datosModal} />
					<Divider style={{ fontSize: 20, fontWeight: 600 }}>Interconsulta</Divider>
					<Interconsultas datosModal={datosModal} />
				</div>
			),
			key: '14',
		},
		{
			title: 'Tratamiento/Receta',
			content: <SeptimaParte datosModal={datosModal} />,
			key: '15',
		},

		{
			title: 'Imágenes',
			content: <Imagenes datosModal={datosModal} />,
			key: '16',
		},
		{
			title: 'Laboratorio',
			content: <Laboratorio datosModal={datosModal} />,
			key: '17',
		},
	];

	function confirmAdd() {
		Modal.confirm({
			title: '¿Desea guardar todos los campos?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si, Guardar',
			cancelText: 'No, Cancelar',
			onOk: () => {
				notificaciones('', 'Promesa', {
					promesa: grabarAntecedentes,
					ok: 'Antecedentes registrados correctamente',
					error: 'Alerta al guardar, Por favor vuelva a intentarlo',
					pendiente: 'Guardando Antecedentes',
				});
			},
		});
	}

	function confirm(e) {
		Modal.confirm({
			title: 'Si cambias de opción perderás los cambios realizados',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si, Cambiar opción',
			cancelText: 'No, Cancelar',
			onOk: () => {
				if (e === 1) {
					setState({
						activeKey: boton_1[0].key,
						boton_1,
					});
					setOpcion(1);
				} else if (e === 2) {
					setState({
						activeKey: boton_2[0].key,
						boton_2,
					});
					setOpcion(2);
				} else if (e === 3) {
					setState({
						activeKey: boton_3[0].key,
						boton_3,
					});
					setOpcion(3);
				}
			},
		});
	}

	const treeData = [
		{
			title: 'Tipo Consulta Médica',
			key: 1000,
			disabled: true,
			children: [
				{
					title: 'Consulta Medica',
					key: 100,
					disabled: true,
					children: [
						{
							title: 'Consulta Médica General',
							key: 1,
							children: [],
						},
						{
							title: 'Consulta Odontológica',
							key: 2,
							children: [],
						},
					],
				},
				{
					title: 'Procedimiento',
					key: 200,
					disabled: true,
					children: [
						{
							title: 'Consulta Procedimental',
							key: 3,
							children: [],
						},
					],
				},
			],
		},
	];

	const onSelect = selectedKeys => {
		if (selectedKeys[0] === undefined) {
      notificaciones('No se puede quitar la selección', 'Warn');
			setCheckedKeys(checkedKeys);
			// setSelectedKey(selectedKey);
		} else {
			setCheckedKeys(selectedKeys);
			setSelectedKey(selectedKeys);
		}
	};

	const onCheck = checkedKeysValue => {
		if (checkedKeysValue[checkedKeysValue.length - 1] === undefined) {
      notificaciones('No se puede quitar la selección', 'Warn');
			setCheckedKeys(checkedKeys);
			// setSelectedKey(selectedKey);
		} else {
			setCheckedKeys([checkedKeysValue[checkedKeysValue.length - 1]]);
			setSelectedKey([checkedKeysValue[checkedKeysValue.length - 1]]);
		}
	};

	const confirmarOpcion = () => {
		switch (checkedKeys[0]) {
			case 1:
				if (state) {
					confirm(1);
				} else {
					setState({
						activeKey: boton_1[0].key,
						boton_1,
					});
					setOpcion(1);
					setAbrirModalOpciones(false);
				}
				break;
			case 2:
				if (state) {
					confirm(2);
				} else {
					setState({
						activeKey: boton_2[0].key,
						boton_2,
					});
					setOpcion(2);
					setAbrirModalOpciones(false);
				}
				break;
			case 3:
				if (state) {
					confirm(3);
				} else {
					setState({
						activeKey: boton_3[0].key,
						boton_3,
					});
					setOpcion(3);
					setAbrirModalOpciones(false);
				}
				break;
			default:
				console.log('Seleccionado: ', checkedKeys);
				break;
		}
	};

	useEffect(() => {
		const asyncronized = async () => {
      setCargandoGlobal(true);
      switch (pestañasReducer.actual) {
        case 'medicaGeneral':
          notificaciones('Cargando consulta medicina general', 'Info');
          await consultaMedicaGeneral(dataGlobal);
          break;

        case 'odontologica':
          notificaciones('Cargando consulta odotológica', 'Info');
          await consultaOdontologica(dataGlobal);
          break;

        case 'procedimental':
          consultaProcedimental(dataGlobal);
          break;

        default:
          break;
      }

      if (opcion == 1) {
        dispatch(setPestañas('medicaGeneral'));
      } else if (opcion == 2) {
        dispatch(setPestañas('odontologica'));
      } else if (opcion == 3) {
        dispatch(setPestañas('procedimental'));
      } else {
        dispatch(setPestañas(''));
      }
      setCargandoGlobal(false);
    }
    asyncronized();
	}, [opcion]);

	const grabarAntecedentes = async () => {
		const sss = store.getState();
		const antecedentesGenerales = sss.antecedentesGenerales;
		const antecedentesFisiologicos = sss.antecedentesFisiologicos;
		const antecedentesGineco = sss.antecedentesGineco;
		const antecedentesOtros = sss.antecedentesOtros;
		const antecedentesPatologicos = sss.antecedentesPatologicos;
		const antecedentesPatologicosF = sss.antecedentesPatologicosFamiliares;

		console.log('AG: ', antecedentesGenerales);
		console.log('AF: ', antecedentesFisiologicos);
		console.log('AG: ', antecedentesGineco);
		console.log('AO: ', antecedentesOtros);
		console.log('AP: ', antecedentesPatologicos);
		console.log('APF: ', antecedentesPatologicosF);

		setAbrirModal(false);

		const resp = await httpClient.post(`/antecedentes/setAntecedentes`, {
			codGrupoCia: datosModal.estado.COD_GRUPO_CIA,
			codLocal: datosModal.estado.COD_LOCAL_ANTECENDENTE,
			codPaciente: datosModal.estado.COD_PACIENTE,
			codMedico: usuario.cod_medico,
			//Secuencia SUMAR + 1 para grabar.
			secuenciaHC: parseInt(numeroAntecedente) + 1,
			generales: {
				medicamentos: antecedentesGenerales.medicamentos,
				ram: antecedentesGenerales.ram,
				ocupacionales: antecedentesGenerales.ocupacionales,
				habitos: antecedentesGenerales.habitos,
			},
			antecedentes: {
				fecha: moment().format('DD-MM-YYYY'),
				diabetes: antecedentesOtros.diabetes,
				fiebre_reumatica: antecedentesOtros.fiebre_reumatica,
				enfermedad_hepaticas: antecedentesOtros.enfermedad_hepaticas,
				hemorragias: antecedentesOtros.hemorragias,
				tuberculosis: antecedentesOtros.tuberculosis,
				enfermedad_cardiovascular: antecedentesOtros.enfermedad_cardiovascular,
				reaccion_anormal_local: antecedentesOtros.reaccion_anormal_local,
				alergia_penecilina: antecedentesOtros.alergia_penecilina,
				anemia: antecedentesOtros.anemia,
				enfermedad_renal: antecedentesOtros.enfermedad_renal,
				reaccion_anormal_drogas: antecedentesOtros.reaccion_anormal_drogas,
				otras: antecedentesOtros.otras,
			},
			fisiologicos: antecedentesFisiologicos,
			ginecologicos: {
				edadMenarquia: antecedentesGineco.edadMenarquia,
				rcMenstruacion: antecedentesGineco.rcMenstruacion,
				cicloMenstruacion: antecedentesGineco.cicloMenstruacion,
				fechaFur: antecedentesGineco.fechaFur,
				fechaFpp: antecedentesGineco.fechaFpp,
				rs: antecedentesGineco.rs,
				disminorrea: antecedentesGineco.disminorrea,
				nroGestaciones: antecedentesGineco.nroGestaciones,
				paridad: antecedentesGineco.pariedad,
				fechaFup: antecedentesGineco.fechaFup,
				nroCesareas: antecedentesGineco.nroCesareas,
				pap: antecedentesGineco.pap,
				mamografia: antecedentesGineco.mamografia,
				mac: antecedentesGineco.mac,
				otros: antecedentesGineco.otros,
				indReglaRegular: antecedentesGineco.indReglaRegular,
			},
			patologicos: antecedentesPatologicos,
			patologicosFamiliares: antecedentesPatologicosF,
		});

		setNumeroAntecedente(numeroAntecedente + 1);

		console.log('RESPUESTA ANTECEDENTES:', resp);

		if (!resp.data.success) {
			throw resp.data.message;
		}

		// AntecedentesHC(dataGlobal);

		/* if (resp.data.success) {
			openNotification('Antecedentes registrados', 'Los antecedentes se registraron correctamente', '');
		} else {
			openNotification('Error al registrar', 'Por favor vuelva a intentarlo', 'Alerta');
		} */
	};

	return (
		<>
			<Card className="gx-card">
				<InformacionPaciente
					setMostrarListaPaciente={setMostrarListaPaciente}
					traerDatos={traerDatos}
					datosModal={datosModal}
					setTabDefault={setTabDefault}
				/>
				<Row style={{ flexDirection: 'row', paddingBottom: '20px', paddingTop: '20px' }}>
					<Col
						xl={6}
						lg={6}
						md={6}
						sm={24}
						xs={24}
						style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
					>
						<Button
							disabled={historiaClinica}
							className={('gx-mb-0', null)}
							type="primary"
							style={{
								maxWidth: 256,
								height: 'auto',
								minWidth: 200,
								lineHeight: '1.5em',
								wordWrap: 'break-word',
								whiteSpace: 'break-spaces',
								padding: '10px',
								marginTop: '10px',
							}}
							onClick={() => {
								setAbrirModalOpciones(true);
							}}
						>
							Tipo Consulta Médica
						</Button>
					</Col>
					<Col
						xl={6}
						lg={6}
						md={6}
						sm={24}
						xs={24}
						style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
					>
						<Button
							disabled={historiaClinica}
							className={('gx-mb-0', null)}
							type="primary"
							style={{
								maxWidth: 256,
								height: 'auto',
								minWidth: 200,
								lineHeight: '1.5em',
								wordWrap: 'break-word',
								whiteSpace: 'break-spaces',
								padding: '10px',
								marginTop: '10px',
							}}
							onClick={() => {
								setAbrirModal(true);
							}}
						>
							Antecedentes
						</Button>
					</Col>
					<Col
						xl={6}
						lg={6}
						md={6}
						sm={24}
						xs={24}
						style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
					>
						<Button
							disabled={historiaClinica}
							className={('gx-mb-0', null)}
							type="primary"
							style={{
								maxWidth: 256,
								height: 'auto',
								minWidth: 200,
								lineHeight: '1.5em',
								wordWrap: 'break-word',
								whiteSpace: 'break-spaces',
								padding: '10px',
								marginTop: '10px',
							}}
							onClick={() => {
								setAbrirResultadoLab(true);
							}}
						>
							Resultados Laboratorio
						</Button>
					</Col>
					<Col
						xl={6}
						lg={6}
						md={6}
						sm={24}
						xs={24}
						style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
					>
						{historiaClinica ? (
							<Button
								disabled={pestañasReducer.actual === '' ? true : false}
								className="gx-mb-0"
								style={{
									maxWidth: 256,
									height: 'auto',
									minWidth: 200,
									lineHeight: '1.5em',
									wordWrap: 'break-word',
									whiteSpace: 'break-spaces',
									padding: '10px',
									marginTop: '10px',
									backgroundColor: '#F60F5B',
									color: '#fff',
								}}
								onClick={() => {
									dispatch(setHistoriaClinica(false));
								}}
							>
								Regresar
							</Button>
						) : (
							<Button
								disabled={pestañasReducer.actual === '' ? true : false}
								className={('gx-mb-0', null)}
								type="primary"
								style={{
									maxWidth: 256,
									height: 'auto',
									minWidth: 200,
									lineHeight: '1.5em',
									wordWrap: 'break-word',
									whiteSpace: 'break-spaces',
									padding: '10px',
									marginTop: '10px',
								}}
								onClick={() => {
									setAbrirModalHc(true);
								}}
							>
								Historia Clinica
							</Button>
						)}
					</Col>
					{/* <Col
						xl={6}
						lg={6}
						md={6}
						sm={24}
						xs={24}
						style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
					>
						<Button
							disabled={historiaClinica}
							className={('gx-mb-0', null)}
							type="primary"
							style={{
								maxWidth: 256,
								height: 'auto',
								minWidth: 200,
								lineHeight: '1.5em',
								wordWrap: 'break-word',
								whiteSpace: 'break-spaces',
								padding: '10px',
								marginTop: '10px',
							}}
							onClick={() => {
								setAbrirSeguimientoM(true);
							}}
						>
							Seguimiento de Consultas
						</Button>
					</Col> */}
				</Row>
				{opcion === 1 ? (
					<h2
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontWeight: 'bold',
							fontSize: '20px',
							margin: '0',
							textTransform: 'uppercase',
						}}
					>
						Consulta medica general
					</h2>
				) : opcion === 2 ? (
					<h2
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontWeight: 'bold',
							fontSize: '20px',
							margin: '0',
							textTransform: 'uppercase',
						}}
					>
						Consulta odontológica
					</h2>
				) : opcion === 3 ? (
					<h2
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontWeight: 'bold',
							fontSize: '20px',
							margin: '0',
							textTransform: 'uppercase',
						}}
					>
						Consulta procedimientos
					</h2>
				) : null}
				<Tabs
					type="card"
					onChange={abc}
					style={{ marginTop: 18 }}
					tabPosition="left"
					activeKey={tabDefault}
					onTabClick={e => setTabDefault(e)}
				>
					{opcion === 1
						? state.boton_1.map(pane => (
								<TabPane tab={pane.title} key={pane.key}>
									{pane.content}
								</TabPane>
						  ))
						: opcion === 2
						? state.boton_2.map(pane => (
								<TabPane tab={pane.title} key={pane.key}>
									{pane.content}
								</TabPane>
						  ))
						: opcion === 3
						? state.boton_3.map(pane => (
								<TabPane tab={pane.title} key={pane.key}>
									{pane.content}
								</TabPane>
						  ))
						: null}
					{/*<TabPane tab="Examen Clinico Estomatológico" key="3">
                    <TerceraParte estematologico={estematologico} />
                </TabPane>*/}
				</Tabs>
				<Modal
					maskClosable={false}
					width="70%"
					onCancel={() => {
						if (!historiaAntecedentes) {
							setAbrirModal(false);
						}
					}}
					title={<div style={{ fontSize: '22px' }}>Antecedentes</div>}
					footer={
						<div>
							<Row style={{ flexDirection: 'row' }}>
								{historiaAntecedentes ? (
									<Col lg={8} style={{ textAlign: 'start' }}>
										<Button
											style={{
												backgroundColor: '#F60F5B',
												color: '#fff',
											}}
											onClick={() => dispatch(setHistoriaAntecedentes(false))}
										>
											Regresar
										</Button>
									</Col>
								) : (
									<Col lg={8} style={{ textAlign: 'start' }}>
										<Button type="primary" onClick={() => setAbrirModalHA(true)}>
											Ver Historial
										</Button>
									</Col>
								)}

								<Col lg={16} style={{ textAlign: 'end' }}>
									<Button
										disabled={historiaAntecedentes}
										onClick={() => {
											setAbrirModal(false);
											AntecedentesHC(dataGlobal);
											traerPatologicosFamiliares(dataGlobal);
											traerPatologicos(dataGlobal);
										}}
									>
										Cancelar
									</Button>
									<Button
										disabled={historiaAntecedentes}
										type="primary"
										onClick={() => confirmAdd()}
									>
										Guardar
									</Button>
								</Col>
							</Row>
						</div>
					}
					visible={abrirModal}
					/* okText="Guardar"
				onOk={() => confirmAdd()}
				cancelText="Cancelar"
				// okButtonProps={{
				//   disabled: botonModal
				// }}
				onCancel={() => {
				setAbrirModal(false);
			AntecedentesHC(dataGlobal);
			traerPatologicosFamiliares(dataGlobal);
			traerPatologicos(dataGlobal);
				}} */
				>
					<AntecedentesModal datosModal={datosModal} />
				</Modal>
				{abrirModalHA ? (
					<ModalHA abrirModalHA={abrirModalHA} setAbrirModalHA={setAbrirModalHA} />
				) : null}
				{abrirResultadoLab ? (
					<ModalResultadoLab
						datosModal={datosModal}
						abrirResultadoLab={abrirResultadoLab}
						setAbrirResultadoLab={setAbrirResultadoLab}
					/>
				) : null}
				{/* {
					abrirSeguimientoM
						? <ModalSeguimiento comboEspecialidad={comboEspecialidad} abrirSeguimientoM={abrirSeguimientoM} setAbrirSeguimientoM={setAbrirSeguimientoM} />
						: null
				} */}

				<Modal
					maskClosable={false}
					okText="Aceptar"
					cancelText="Cancelar"
					width="30%"
					title={<div style={{ fontSize: '22px' }}>Opciones</div>}
					visible={abrirModalOpciones}
					onOk={() => {
						confirmarOpcion();
						setAbrirModalOpciones(false);
					}}
					onCancel={() => setAbrirModalOpciones(false)}
				>
					<Tree
						checkable
						defaultExpandAll
						onSelect={onSelect}
						onCheck={onCheck}
						checkedKeys={checkedKeys}
						selectedKeys={selectedKey}
						treeData={treeData}
					/>
				</Modal>
				{abrirModalHc ? (
					<ModalHC
						dataGlobal={dataGlobal}
						abrirModalHc={abrirModalHc}
						setAbrirModalHc={setAbrirModalHc}
					/>
				) : null}
			</Card>
			<div hidden={opacity} className="asd" />

      {cargandoGlobal ? <ModalLoading /> : null}
		</>
	);
};

export default DatosPaciente;
