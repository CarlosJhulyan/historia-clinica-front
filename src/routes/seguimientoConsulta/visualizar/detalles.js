import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../../appRedux/store';
import moment from 'moment';
import { Button, Card, Tabs, Row, Col, Modal, Divider, Tree } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import InformacionPaciente from '../../listaPaciente/datosPaciente/informacionPaciente';
import EnfermedadActual from '../../listaPaciente/datosPaciente/enfermedadActual';
import ExamenFisico from '../../listaPaciente/datosPaciente/examenFisico/examenFisico';
import Diagnostico from '../../listaPaciente/datosPaciente/diagnostico';
import EvolucionTratamiento from '../../listaPaciente/datosPaciente/evolucionTratamiento';
import SeptimaParte from '../../listaPaciente/datosPaciente/tratamiento';
import Anexos from '../../listaPaciente/datosPaciente/anexos';
import { Odontograma } from '../../odontograma/odontograma';
import Historial from '../../listaPaciente/datosPaciente/historialOdonto';
import Desarrollo from '../../listaPaciente/datosPaciente/desarrollo';
import {
	setHistoriaAntecedentes,
	setHistoriaClinica,
} from '../../../appRedux/actions/menu/helpers';
import './styles.css';
import { httpClient } from '../../../util/Api';
import { Laboratorio } from '../../listaPaciente/datosPaciente/Laboratorio';
import { Procedemientos } from '../../listaPaciente/datosPaciente/Procedimientos';
import { Imagenes } from '../../listaPaciente/datosPaciente/imagenes';

import {
	AntecedentesHC,
	consultasProcedimiento,
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
	traerEvolucionTratamientoOdonto,
	AntecedentesGenerales,
	getListaIgnorados,
} from '../../listaPaciente/datosPaciente/apis';
import { notificaciones, openNotification } from '../../../util/util';
import { setRegistrosEvolucion } from '../../../appRedux/actions/menu/evolucionTratamiento';
import { quitar_seleccion, setEstadoOdonotograma } from '../../../appRedux/actions';
import 'react-toastify/dist/ReactToastify.css';
import { setPestañas } from '../../../appRedux/actions/menu/pestañas';
import EvolucionTratamientoOdonto from '../../listaPaciente/datosPaciente/evolucionTratamientoOdonto';

import { ModalHC } from '../../../components/modal/ModalHC';
import { ModalHA } from '../../../components/modal/ModalHA';
import { ModalResultadoLab } from '../../../components/modal/ModalResultadoLab';
import AntecedentesModal from '../../listaPaciente/datosPaciente/antecedentes';
import { Interconsultas } from '../../listaPaciente/datosPaciente/Procedimientos/interconsulta';
import Estematologico from '../../listaPaciente/datosPaciente/estematologico';
import CabeceraInformacion from './cabeceraInformacion';

import { ModalImpresionReceta } from './modalImpresion';
import { ModalImpresionA4 } from './modalImpresionA4';
import { baseUrlImage } from '../../../config/backend';
import ModalLoading from '../../../util/modalLoading';

const DetallesPaciente = ({ datosModal }) => {
  const [cargandoGlobal, setCargandoGlobal] = useState(false);
	const dispatch = useDispatch();
	const [opcion, setOpcion] = useState();
	const [state, setState] = useState();
	const [abrirModal, setAbrirModal] = useState(false);

	const [abrirModalHc, setAbrirModalHc] = useState(false);
	const [abrirModalHA, setAbrirModalHA] = useState(false);
	const [abrirResultadoLab, setAbrirResultadoLab] = useState(false);

	//Impresion
	const [modalImpresion, setModalImpresion] = useState(false);
	const [modalImpresionReceta, setModalImpresionReceta] = useState(false);
	const [modalImpresionA4, setModalImpresionA4] = useState(false);

	const [abrirModalOpciones, setAbrirModalOpciones] = useState(false);
	const [checkedKeys, setCheckedKeys] = useState([]);
	const [selectedKey, setSelectedKey] = useState([]);
	const { historiaClinica, historiaAntecedentes, visualizar } = useSelector(state => state.helpers);

	const data = {
		codGrupoCia: datosModal.estado.COD_GRUPO_CIA,
		codLocal: datosModal.estado.COD_LOCAL_ANTECENDENTE,
		codCia: datosModal.estado.COD_CIA,
		nroAtencion: datosModal.estado.NUM_ATEN_MED,
		codPaciente: datosModal.estado.COD_PACIENTE,
		secuenciaAntecedente: datosModal.estado.SECUENCIA_ANTECEDENTE,
	};

	const [numeroAntecedente, setNumeroAntecedente] = useState(parseInt(data.secuenciaAntecedente));
	const [estado, setEstado] = useState({
		especificaciones: '',
		observaciones: '',
	});

	const TabPane = Tabs.TabPane;

	const pestañasReducer = useSelector(state => state.pestañasReducer);
	const [tabDefault, setTabDefault] = useState();
	const opacity = useSelector(state => state.opacity);

	const [cmp, setCmp] = useState('');

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
      traerCombos(dataGlobal);
      setCargandoGlobal(true);
      openNotification('', 'Cargando anexos', 'Info');
      await traerAnexo(dataGlobal);
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

	const getCMP = async () => {
		const { data } = await httpClient.post('/getCMP', {
			codMedico: datosModal.estado.dataMedico.COD_MEDICO,
		});

		if (data.success) {
			setCmp(data.data[0].num_cmp);
		}
	};

	useEffect(() => {
		getCMP();
	}, []);

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
			content: <SeptimaParte datosModal={datosModal} />,
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
			setCheckedKeys(checkedKeys);
		} else {
			setCheckedKeys(selectedKeys);
			setSelectedKey(selectedKeys);
		}
	};

	const onCheck = checkedKeysValue => {
		if (checkedKeysValue[checkedKeysValue.length - 1] === undefined) {
			setCheckedKeys(checkedKeys);
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

		setAbrirModal(false);

		const resp = await httpClient.post(`/antecedentes/setAntecedentes`, {
			codGrupoCia: datosModal.estado.COD_GRUPO_CIA,
			codLocal: datosModal.estado.COD_LOCAL_ANTECENDENTE,
			codPaciente: datosModal.estado.COD_PACIENTE,
			codMedico: usuario.cod_medico,
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
	};

	//IMPRESION
	const [firma, setFirma] = useState('');

	const traerFirma = useCallback(async () => {
		try {
			const { data } = await httpClient.post(`/medicos/getFirma`, {
				codMedico: JSON.parse(localStorage.getItem('token')).cod_medico,
			});

			if (data.data.url_firma) {
				setFirma(baseUrlImage + '/' + data.data.url_firma);
			} else {
				// firma por dafault cuando no se encuentra una firma en la db
				setFirma(
					'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Firma_de_Juan_Jos%C3%A9_Pradera.svg/1280px-Firma_de_Juan_Jos%C3%A9_Pradera.svg.png'
				);
			}
		} catch (e) {
			console.log(e);
		}
	}, []);

	//

	return (
		<>
			<CabeceraInformacion datosModal={datosModal} setTabDefault={setTabDefault} />
			<Row
				style={{
					flexDirection: 'row',
					paddingBottom: '20px',
					paddingTop: '20px',
					marginBottom: '20px',
				}}
			>
				<Col
					xl={8}
					lg={8}
					md={8}
					sm={24}
					xs={24}
					style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
				>
					<Button
						disabled={historiaClinica}
						className="gx-mb-0"
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
					xl={8}
					lg={8}
					md={8}
					sm={24}
					xs={24}
					style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
				>
					<Button
						disabled={historiaClinica}
						className="gx-mb-0"
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
					xl={8}
					lg={8}
					md={8}
					sm={24}
					xs={24}
					style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
				>
					<Button
						className="gx-mb-0"
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
							setModalImpresion(true);
							traerFirma();
						}}
					>
						Imprimir Recetas
					</Button>
				</Col>
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
									<Button
										disabled={visualizar}
										type="primary"
										onClick={() => setAbrirModalHA(true)}
									>
										Ver Historial
									</Button>
								</Col>
							)}

							<Col lg={16} style={{ textAlign: 'end' }}>
								{visualizar ? (
									<Button
										disabled={historiaAntecedentes}
										onClick={() => {
											setAbrirModal(false);
										}}
									>
										Cerrar
									</Button>
								) : (
									<>
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
									</>
								)}
							</Col>
						</Row>
					</div>
				}
				visible={abrirModal}
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

			{modalImpresion ? (
				<Modal
					title="Recetas"
					visible={modalImpresion}
					okButtonProps={{ hidden: true }}
					cancelText="Salir"
					onCancel={() => setModalImpresion(false)}
				>
					<Row style={{ flexDirection: 'row' }}>
						<Col lg={24} style={{ marginBottom: '10px' }}>
							Seleccione una opción a imprimir:
						</Col>
						<Col lg={12}>
							<Button style={{ width: '100%' }} onClick={() => setModalImpresionReceta(true)}>
								Receta
							</Button>
						</Col>

						<Col lg={12}>
							<Button style={{ width: '100%' }} onClick={() => setModalImpresionA4(true)}>
								A4
							</Button>
						</Col>
					</Row>
				</Modal>
			) : null}

			{modalImpresionReceta ? (
				<ModalImpresionReceta
					modalImpresionReceta={modalImpresionReceta}
					setModalImpresionReceta={setModalImpresionReceta}
					firma={firma}
					datosModal={datosModal}
				/>
			) : null}
			{modalImpresionA4 ? (
				<ModalImpresionA4
					cmp={cmp}
					firma={firma}
					modalImpresionA4={modalImpresionA4}
					setModalImpresionA4={setModalImpresionA4}
					datosModal={datosModal}
				/>
			) : null}

      {cargandoGlobal ? <ModalLoading /> : null}

			<div hidden={opacity} className="asd" />
		</>
	);
};

export default DetallesPaciente;
