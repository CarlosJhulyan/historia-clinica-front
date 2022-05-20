import React, { useEffect, useState, createRef, useMemo } from 'react';
import { Button, Card, AutoComplete, Form, Tabs, Row, Col, Spin, Table } from 'antd';
import { ToastContainer } from 'react-toastify';
import { httpClient } from '../../util/Api';
import { notificaciones } from '../../util/util';
import Moment from 'moment';
import axios from 'axios';
import PrimeraParteTable from './tratamiento/primeraParte/primeraParteTable';
import SextaParte from './tratamiento/sextaParte';
import { ModalPrimeraParte } from './tratamiento/primeraParte/modalPrimeraParte';
import { getKardexHospitaliario, traerCombosKardex } from '../listaPaciente/datosPaciente/apis';
import { useSelector } from 'react-redux';
import TablaExamen from './examen/tabla/tabla';
import TablaInterconsulta from './interconsulta/tabla/tabla';
import TablaEspeciales from './especiales/tabla/tabla';
import Especiales from './especiales/especial';
// import './formulario.css';

const TratamientoKardex = () => {
	const [abrirModal, setAbrirModal] = useState(false);
	const [dataModal, setDataModal] = useState([]);

	const [data, setData] = useState({
		servicio: '',
		paciente: '',
		cama: '',
		habitacion: '',
	});

	const [editar, setEditar] = useState();
	const [alergias, setAlergias] = useState();

	const [state, setState] = useState('tratamientos');

	const [historia, setHistoria] = useState();

	const [valueCOD, setValueCOD] = useState('');
	const [optionsCOD, setOptionsCOD] = useState([]);
	const [valueNOM, setValueNOM] = useState('');
	const [optionsNOM, setOptionsNOM] = useState([]);

	const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());
	const [peticion, setPeticion] = useState(false);

	const [loading, setLoading] = useState(false);
	const formSearch = useMemo(() => createRef(), []);

	// Vars
	const dataTratamiento = useSelector(state => state.kardexTratamientoDetalle);
	const diagnostico = useSelector(state => state.kardexDiagnostico);

	const columnasDiagnosticos = [
		{
			title: 'Código',
			dataIndex: 'cie',
			key: 'cie',
		},
		{
			title: 'Descripción',
			dataIndex: 'diagnostico',
			key: 'diagnostico',
		},
		{
			title: 'Tipo',
			dataIndex: 'tipodiagnostico',
			key: 'tipodiagnostico',
		},
	];

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

	const onSelectCOD = cod => {
		optionsCOD.forEach(element => {
			if (element.key === cod) {
				formSearch.current.setFieldsValue({
					codPaciente: element.historia_clinica,
					nombrePaciente: `${
						element.nom_cli + ' ' + element.ape_pat_cli + ' ' + element.ape_mat_cli
					}`,
				});
				setValueCOD(cod);
				setHistoria({
					hc: element.historia_clinica,
					codPaciente: element.cod_paciente,
					nombrePaciente: `${
						element.nom_cli + ' ' + element.ape_pat_cli + ' ' + element.ape_mat_cli
					}`,
				});
				// validarTurno();
			}
		});
	};

	const onSelectNOM = nom => {
		optionsNOM.forEach(element => {
			if (element.key === nom) {
				formSearch.current.setFieldsValue({
					codPaciente: element.historia_clinica,
					nombrePaciente: `${
						element.nom_cli + ' ' + element.ape_pat_cli + ' ' + element.ape_mat_cli
					}`,
				});
				setValueNOM(nom);
				setHistoria(element.historia_clinica);
				// validarTurno();
			}
		});
	};

	const onChangeCOD = cod => {
		if (cod.length <= 3) {
			setOptionsCOD([]);
		}
	};

	const onChangeNOM = nom => {
		if (nom.length <= 3) {
			setOptionsNOM([]);
		}
	};

	const TraerDatos = () => {
		setLoading(true);
		setDataModal();
		setEditar();

		if (valueCOD) {
			// Filtrar el valor del codigo con las opciones
			optionsCOD.forEach(async element => {
				if (element.cod_paciente === valueCOD) {
					const dataGlobal = {
						codGrupoCia: '001',
						codLocal: '001',
						codCia: '001',
						nroAtencion: element.historia_clinica,
						codPaciente: element.cod_paciente,
					};

					const dataCama = {
						codPaciente: element.cod_paciente,
						historiaClinica: element.historia_clinica,
					};

					const respuesta = await httpClient.post('pacientes/getHospitalizacion', dataCama);
					const dataHospitalizacion = respuesta.data.data[0];

					let servicio = '';
					if (dataHospitalizacion.hospitalizacion === '1') {
						servicio = 'HOSPITALIZACION';
					}

					if (dataHospitalizacion.urgencia === '1') {
						servicio = 'URGENCIA';
					}

					setData({
						...data,
						cama: element.cama,
						paciente: element.nombre_completo,
						servicio: servicio,
						habitacion: element.habitacion,
					});

					getKardexHospitaliario(dataGlobal);
					//Obtener kardex
					const kardex = await httpClient.post('kardex/getKardex', {
						hc: element.historia_clinica,
					});
					if (kardex.data.success) {
						console.log(kardex);
						setEditar(kardex.data.data);
					}

					//Obtener Alergias
					const alergias = await httpClient.post('pacientes/getAlergias', {
						codGrupoCia: '001',
						codPaciente: element.cod_paciente,
					});
					if (alergias.data.success) {
						if (alergias.data.data.length > 0) {
							setAlergias({
								alergias: alergias.data.data[0].alergias,
								otros: alergias.data.data[0].otros,
							});
						}
					}
				}
			});
		}
	};

	const paginasTratamientos = [
		{
			title: 'Tratamiento',
			content: (
				<PrimeraParteTable
					setAbrirModal={setAbrirModal}
					setDataModal={setDataModal}
					historia={historia}
					editar={editar}
					TraerDatos={TraerDatos}
				/>
			),
		},
		{ title: 'Historial de Tratamiento', content: <SextaParte historia={historia} /> },
	];
	const paginasExamenes = [
		{
			title: 'Examenes',
			content: <TablaExamen historia={historia} editar={editar} TraerDatos={TraerDatos} />,
		},
	];
	const paginasInterconsulta = [
		{
			title: 'Interconsultas',
			content: <TablaInterconsulta historia={historia} editar={editar} TraerDatos={TraerDatos} />,
		},
	];
	const paginasEspeciales = [
		{
			title: 'Proc. Especiales',
			content: (
				<Especiales
					historia={historia}
					editar={editar}
					TraerDatos={TraerDatos}
					datosModal={{
						estado: {
							COD_GRUPO_CIA: '001',
							COD_LOCAL_ANTECENDENTE: '001',
						},
					}}
				/>
			),
		},
	];

	useEffect(() => {
		if (dataTratamiento) {
			traerCombosKardex();
			setLoading(false);
			// setExisteData(true);
		}
	}, [dataTratamiento]);

	return (
		<>
			<Card
				title={
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'start',
							gap: '10%',
							flexDirection: 'row',
							width: '100%',
						}}
					>
						<div style={{ fontSize: '22px' }}>Kardex Hospitalario</div>
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
								size="large"
								loading={loading}
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									backgroundColor: '#04B0AD',
									color: 'white',
								}}
								/* 	disabled={!data.flagLleno} */
								onClick={() => TraerDatos()}
							>
								Buscar
							</Button>
						</div>
					</div>
				}
			>
				{
					loading ? (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								color: '#757575',
								padding: '30px',
								fontSize: '18px',
							}}
						>
							<Spin style={{ margin: '0 0 10px 0' }} />
							Buscando...
						</div>
					) : data.cama !== '' ? (
						<>
							<Row style={{ paddingBottom: '10px' }}>
								{alergias ? (
									<Col span={24} style={{ paddingBottom: 15 }}>
										<div
											style={{
												backgroundColor: '#F60F5B',
												padding: 10,
												color: 'white',
												fontSize: 16,
											}}
										>
											<div style={{ textAlign: 'center' }}>
												<b style={{ fontWeight: 600 }}>Alergias: </b>
												{alergias.alergias} / <b style={{ fontWeight: 600 }}>Otros: </b>{' '}
												{alergias.otros}
											</div>
											<div></div>
										</div>
									</Col>
								) : null}
								<Col
									xs={2}
									style={{
										paddingBottom: '10px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'start',
										fontWeight: 'bold',
									}}
								>
									Servicio:
								</Col>
								<Col
									xs={5}
									style={{
										paddingBottom: '10px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'start',
									}}
								>
									{(data && data.servicio) || 'No se encuentra el servicio'}
								</Col>
								<Col
									xs={2}
									style={{
										paddingBottom: '10px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'start',
										fontWeight: 'bold',
									}}
								>
									Cama:
								</Col>
								<Col
									xs={4}
									style={{
										paddingBottom: '10px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'start',
									}}
								>
									{/* {(data && data.cama) || 'No se encuentra la cama'} */}
									{(data && ' N°' + data.cama + ' - ' + data.habitacion) ||
										'No se encuentra la cama'}
								</Col>
								<Col
									xs={2}
									style={{
										paddingBottom: '10px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'start',
										fontWeight: 'bold',
									}}
								>
									Paciente:
								</Col>
								<Col
									xs={9}
									style={{
										paddingBottom: '10px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'start',
									}}
								>
									{/* {(data && data.paciente) || 'No se encuentra el paciente'} */}
									{(data && data.paciente) || 'No se encuentró al paciente'}
								</Col>

								<Col
									xs={2}
									style={{
										paddingTop: '10px',
										paddingBottom: '10px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'start',
										fontWeight: 'bold',
									}}
								>
									Diagnóstico:
								</Col>
								<Col
									xs={24}
									style={{
										paddingBottom: '10px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'start',
									}}
								>
									{(diagnostico && diagnostico.length > 0 && (
										<Table
											style={{ width: '100%' }}
											columns={columnasDiagnosticos}
											dataSource={diagnostico}
											pagination={false}
										/>
									)) ||
										'No se encuentra el diagnóstico'}
								</Col>
							</Row>
							<Button
								type="primary"
								onClick={() => {
									setState('tratamientos');
								}}
								disabled={state === 'tratamientos'}
							>
								Tratamientos
							</Button>
							<Button
								type="primary"
								onClick={() => {
									setState('examenes');
								}}
								disabled={state === 'examenes'}
							>
								Examenes
							</Button>
							<Button
								type="primary"
								onClick={() => {
									setState('interconsultas');
								}}
								disabled={state === 'interconsultas'}
							>
								Interconsultas
							</Button>
							<Button
								type="primary"
								onClick={() => {
									setState('especiales');
								}}
								disabled={state === 'especiales'}
							>
								Proc. Especiales
							</Button>
							<Tabs
							//  onChange={callback}
							>
								{state === 'tratamientos'
									? paginasTratamientos.map((e, index) => (
											<Tabs.TabPane tab={e.title} key={'tab' + index}>
												{e.content}
											</Tabs.TabPane>
									  ))
									: state === 'examenes'
									? paginasExamenes.map((e, index) => (
											<Tabs.TabPane tab={e.title} key={'tab' + index}>
												{e.content}
											</Tabs.TabPane>
									  ))
									: state === 'interconsultas'
									? paginasInterconsulta.map((e, index) => (
											<Tabs.TabPane tab={e.title} key={'tab' + index}>
												{e.content}
											</Tabs.TabPane>
									  ))
									: state === 'especiales'
									? paginasEspeciales.map((e, index) => (
											<Tabs.TabPane tab={e.title} key={'tab' + index}>
												{e.content}
											</Tabs.TabPane>
									  ))
									: null}
							</Tabs>
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
							No hay datos que mostrar, realice la búsqueda por Historia Clinica o Nombre del
							Paciente.
						</div>
					)

					/* : <div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							color: '#757575',
							padding: '30px',
							fontSize: '20px',
						}}
					>
						Realice la búsqueda por Historia Clinica o Nombre del Paciente
					</div> */
				}

				<ToastContainer pauseOnHover={false} />
			</Card>
			{abrirModal && (
				<ModalPrimeraParte
					abrirModal={abrirModal}
					setAbrirModal={setAbrirModal}
					data={dataModal}
					TraerDatos={TraerDatos}
					historia={historia}
				/>
			)}
		</>
	);
};

export default TratamientoKardex;
