import { Row, Col, Divider } from 'antd';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
	setFisiologicosInmunizaciones,
	setFisiologicosOtrosInmunizaciones,
	setFisiologicosOtrosPrenatales,
	setFisiologicosParto,
	setFisiologicosPrenatales,
	setHabitosNocivos,
} from '../../appRedux/actions/menu/antecedentes';
import { useEffect } from 'react';

export const ImpresionA4 = ({ datosModal, firma }) => {
	const fuente = 17;
	const espacios = 35;
	const backgroundRojo = '#FFFFFF';
	const backgroundAzul = '#FFFFFF';

	const { themeSettingsGlobal } = useSelector(state => state.settings);

	console.log('DAAAAAATAAAAAAAAAAAA7777777777:', datosModal);
	console.log('FIIIIIIIIIIIIIIIRMAA4:', firma);

	const { habitosNocivos, prenatales, parto, inmunizaciones } = useSelector(
		state => state.combosReducer
	);

	//Data del Redux
	const { tipo } = useSelector(state => state.anexo);
	const funcionVital = useSelector(state => state.funcionVital);
	const estadoFisico = useSelector(state => state.estadoFisico);
	const enfermedadActual = useSelector(state => state.enfermedadActual);
	const diagnostico = useSelector(state => state.diagnostico);
	const evolucionTratamiento = useSelector(state => state.evolucionTratamiento);

	//Antecedentes
	const antecedentesGenerales = useSelector(state => state.antecedentesGenerales);
	const antecedentesFisiologicos = useSelector(state => state.antecedentesFisiologicos);
	const antecedentesGineco = useSelector(state => state.antecedentesGineco);
	const antecedentesPatologicos = useSelector(state => state.antecedentesPatologicos);
	/* const antecedentesPatologicosFamiliares = useSelector(
		state => state.antecedentesPatologicosFamiliares
	); */
	const antecedentesOtros = useSelector(state => state.antecedentesOtros);

	const sinRegistro = 'S/N';

	const dispatch = useDispatch();
	const filtroFisiologicos = useSelector(state => state.fisiologicosReducer);

	// Habitos Nocivos
	useEffect(() => {
		if (filtroFisiologicos.length > 0 && habitosNocivos.length > 0) {
			const fisioHabitosNocivos = filtroFisiologicos.filter(f =>
				habitosNocivos.find(c => c.CODIGO === f.COD_TIPO_FISIO)
			);
			dispatch(setHabitosNocivos(fisioHabitosNocivos.map(f => f.COD_TIPO_FISIO)));
		}
	}, [filtroFisiologicos, habitosNocivos, dispatch]);

	// Fisiologicos
	useEffect(() => {
		if (
			filtroFisiologicos.length > 0 &&
			prenatales.length > 0 &&
			parto.length > 0 &&
			inmunizaciones.length > 0
		) {
			const fisioPrenatales = filtroFisiologicos.filter(f =>
				prenatales.find(c => c.CODIGO === f.COD_TIPO_FISIO)
			);

			const fisioParto = filtroFisiologicos.filter(f =>
				parto.find(c => c.CODIGO === f.COD_TIPO_FISIO)
			);
			const fisioInmunizaciones = filtroFisiologicos.filter(f =>
				inmunizaciones.find(c => c.CODIGO === f.COD_TIPO_FISIO)
			);

			dispatch(
				setFisiologicosPrenatales(
					fisioPrenatales.map(f => {
						if (f.COD_TIPO_FISIO === '214') {
							dispatch(setFisiologicosOtrosPrenatales(f.DESC_FISIO));
						}
						return f.COD_TIPO_FISIO;
					})
				)
			);

			dispatch(
				setFisiologicosInmunizaciones(
					fisioInmunizaciones.map(f => {
						if (f.COD_TIPO_FISIO === '341') {
							dispatch(setFisiologicosOtrosInmunizaciones(f.DESC_FISIO));
						}
						return f.COD_TIPO_FISIO;
					})
				)
			);

			if (fisioParto.length > 0) {
				dispatch(setFisiologicosParto(fisioParto[0].COD_TIPO_FISIO));
			}
		}
	}, [filtroFisiologicos, prenatales, parto, inmunizaciones, dispatch]);

	return (
		<div>
			{/* <div hidden></div> */}
			<div id="pagina1">
				<div style={{ position: 'relative' }}>
					<img
						alt="hoja membreatada"
						src={`${process.env.PUBLIC_URL}/assets/images/${themeSettingsGlobal.FORMATO_A4}`}
					></img>

					<div
						style={{
							position: 'absolute',
							top: 170,
							left: 16,
							fontSize: fuente,
							width: '1208px',
							paddingLeft: 16,
							paddingRight: 16,
						}}
					>
						<div style={{ width: '100%', textAlign: 'end', paddingRight: 50 }}>
							<strong>H.C. N° : </strong> {datosModal.estado.dataMedico.NRO_HC_ACTUAL}
						</div>
						<Row style={{ marginTop: 60 }}>
							<Col xs={5}>
								<strong>FECHA : </strong> {datosModal.estado.dataMedico.FEC_CREA}
							</Col>
							<Col xs={4}>
								<strong>HORA : </strong> {datosModal.estado.dataMedico.FEC_CREA_HORA}
							</Col>
							<Col xs={7}>
								<strong>ESPECIALIDAD : </strong> {datosModal.estado.dataMedico.ESPECIALIDAD}
							</Col>
							<Col xs={8}>
								<strong>MEDICO : </strong> {datosModal.estado.dataMedico.MEDICO}
							</Col>
						</Row>
						<Row style={{ marginTop: espacios - 10 }}>
							<Col xs={4}>
								<strong>FILIACIÓN :</strong>
							</Col>
						</Row>
						<Row style={{ marginTop: espacios - 10 }}>
							<Col xs={8}>
								<strong>APELLIDO PATERNO :</strong> {datosModal.estado.APE_PATERNO}
							</Col>
							<Col xs={7}>
								<strong>APELLIDO MATERNO :</strong> {datosModal.estado.APE_MATERNO}
							</Col>
							<Col xs={9}>
								<strong>NOMBRES :</strong> {datosModal.estado.NOMBRE}
							</Col>
						</Row>
						<Row style={{ marginTop: espacios - 10 }}>
							<Col xs={4}>
								<strong>DNI :</strong> {datosModal.estado.NUM_DOCUMENTO}
							</Col>
							<Col xs={7}>
								<strong>FECHA NACIMIENTO :</strong>{' '}
								{datosModal.estado.FEC_NAC_CLI._i
									? datosModal.estado.FEC_NAC_CLI._i
									: datosModal.estado.FEC_NAC_CLI}
							</Col>
							<Col xs={3}>
								<strong>EDAD :</strong> {datosModal.estado.EDAD}
							</Col>
							<Col xs={4}>
								<strong>SEXO :</strong>{' '}
								{datosModal.estado.SEXO_CLI === 'M'
									? 'MASCULINO'
									: datosModal.estado.SEXO_CLI === 'F'
									? 'FEMENINO'
									: ''}
							</Col>
							<Col xs={6}>
								<strong>TELEFONO :</strong> {datosModal.estado.FONO_CLI}
							</Col>
						</Row>
						<Row
							style={{
								marginTop: espacios + 10,
								paddingTop: 10,
								paddingBottom: 10,
								backgroundColor: tipo === 'N' ? backgroundRojo : backgroundAzul,
							}}
						>
							<Col xs={24}>
								<strong>1 ANTECEDENTES</strong>
							</Col>
						</Row>

						{/* ------------------------------------ANTECEDENTES GENERALES------------------------------------*/}
						<Row style={{ marginTop: espacios, marginLeft: 10 }}>
							<Col xs={24}>
								<strong>GENERALES</strong>
							</Col>
						</Row>

						<Row style={{ marginTop: espacios - 10, marginLeft: 30 }}>
							<Col xs={12}>
								<strong style={{ fontWeight: 600 }}>MEDICAMENTOS: </strong>
								{antecedentesGenerales.medicamentos !== ''
									? antecedentesGenerales.medicamentos
									: sinRegistro}
							</Col>
							<Col xs={12}>
								<strong style={{ fontWeight: 600 }}>RAM: </strong>
								{antecedentesGenerales.ram !== '' ? antecedentesGenerales.ram : sinRegistro}
							</Col>
						</Row>

						<Row style={{ marginTop: espacios - 20, marginLeft: 30 }}>
							<Col xs={12}>
								<strong style={{ fontWeight: 600 }}>OCUPACIONALES: </strong>
								{antecedentesGenerales.ocupacionales !== ''
									? antecedentesGenerales.ocupacionales
									: sinRegistro}
							</Col>
							<Col xs={12}>
								<strong style={{ fontWeight: 600 }}>HÁBITOS: </strong>
								{antecedentesGenerales.habitos.length > 0
									? antecedentesGenerales.habitos.map((habito, index) => {
											return (
												<span key={index}>
													{habitosNocivos
														.filter(h => h.CODIGO == habito)
														.map(habitosNocivos => {
															return (
																<span key={habitosNocivos.CODIGO}>{habitosNocivos.ETIQUETA}</span>
															);
														})}
													{index !== antecedentesGenerales.habitos.length - 1 ? ', ' : ''}
												</span>
											);
									  })
									: sinRegistro}
							</Col>
						</Row>
						<DividerPersonalizado espacios={espacios} />
						{/* -------------------------------------------------------------------------------------------------*/}

						{/* ------------------------------------ANTECEDENTES FISIOLOGICOS------------------------------------*/}

						<Row style={{ marginTop: espacios, marginLeft: 10 }}>
							<Col xs={24}>
								<strong>FISIOLOGICOS</strong>
							</Col>
						</Row>

						<Row style={{ marginTop: espacios - 10, marginLeft: 30 }}>
							<Col xs={24}>
								<strong style={{ fontWeight: 600 }}>PRENATALES: </strong>
								{antecedentesFisiologicos.prenatales.length > 0
									? antecedentesFisiologicos.prenatales.map((prenatal, index) => {
											return (
												<span key={index}>
													{prenatales
														.filter(h => h.CODIGO == prenatal)
														.map(prenatales => {
															return <span key={prenatales.CODIGO}>{prenatales.ETIQUETA}</span>;
														})}
													{index !== antecedentesFisiologicos.prenatales.length - 1 ? ', ' : ''}
												</span>
											);
									  })
									: sinRegistro}
							</Col>
						</Row>

						<Row style={{ marginTop: espacios - 20, marginLeft: 30 }}>
							<Col xs={24}>
								<strong style={{ fontWeight: 600 }}>OTROS PRENATALES: </strong>
								{antecedentesFisiologicos.otrosPrenatales !== ''
									? antecedentesFisiologicos.otrosPrenatales
									: sinRegistro}
							</Col>
						</Row>

						<Row style={{ marginTop: espacios - 20, marginLeft: 30 }}>
							<Col xs={24}>
								<strong style={{ fontWeight: 600 }}>PARTO: </strong>
								{(antecedentesFisiologicos.parto === '' ||
									antecedentesFisiologicos.parto.length === 0) &&
									sinRegistro}
								{(antecedentesFisiologicos.parto !== '' ||
									antecedentesFisiologicos.parto.length > 0) &&
									parto
										.filter(h => h.CODIGO == antecedentesFisiologicos.parto)
										.map(parto => {
											return <span key={parto.CODIGO}>{parto.ETIQUETA}</span>;
										})}
							</Col>
						</Row>

						<Row style={{ marginTop: espacios - 20, marginLeft: 30 }}>
							<Col xs={24}>
								<strong style={{ fontWeight: 600 }}>INMUNIZACIONES: </strong>
								{antecedentesFisiologicos.inmunizaciones.length > 0
									? antecedentesFisiologicos.inmunizaciones.map((inmunizacion, index) => {
											return (
												<span key={index}>
													{inmunizaciones
														.filter(h => h.CODIGO == inmunizacion)
														.map(inmunizaciones => {
															return (
																<span key={inmunizaciones.CODIGO}>{inmunizaciones.ETIQUETA}</span>
															);
														})}
													{index !== antecedentesFisiologicos.inmunizaciones.length - 1 ? ', ' : ''}
												</span>
											);
									  })
									: sinRegistro}
							</Col>
						</Row>

						<Row style={{ marginTop: espacios - 20, marginLeft: 30 }}>
							<Col xs={24}>
								<strong style={{ fontWeight: 600 }}>OTROS INMUNIZACIONES: </strong>{' '}
								{antecedentesFisiologicos.otrosInmunizaciones !== ''
									? antecedentesFisiologicos.otrosInmunizaciones
									: sinRegistro}
							</Col>
						</Row>

						<DividerPersonalizado espacios={espacios} />
						{/* --------------------------------------------------------------------------------------------------*/}

						{/* ------------------------------------ANTECEDENTES GINECOLOGICOS------------------------------------*/}
						<Row style={{ marginTop: espacios, marginLeft: 10 }}>
							<Col xs={24}>
								<strong>GINECOLOGICOS</strong>
							</Col>
						</Row>
						<Row style={{ marginTop: espacios - 10, marginLeft: 30 }}>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>MENARQUIA: </strong>
								{antecedentesGineco.edadMenarquia !== ''
									? antecedentesGineco.edadMenarquia
									: sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>REGLA REGULAR: </strong>{' '}
								{antecedentesGineco.indReglaRegular === 'S' ? 'Si' : 'No'}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>RC MENSTRUACION: </strong>
								{antecedentesGineco.rcMenstruacion !== ''
									? antecedentesGineco.rcMenstruacion
									: sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>CICLO MENSTRUACION: </strong>
								{antecedentesGineco.cicloMenstruacion !== ''
									? antecedentesGineco.cicloMenstruacion
									: sinRegistro}
							</Col>
						</Row>

						<Row style={{ marginTop: espacios - 15, marginLeft: 30 }}>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>RS: </strong>
								{antecedentesGineco.rs !== '' ? antecedentesGineco.rs : sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>FUR: </strong>
								{antecedentesGineco.fechaFur !== '' ? antecedentesGineco.fechaFur : sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>FPP: </strong>
								{antecedentesGineco.fechaFpp !== '' ? antecedentesGineco.fechaFpp : sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>DISMINORREA: </strong>{' '}
								{antecedentesGineco.disminorrea === 'S' ? 'Si' : 'No'}
							</Col>
						</Row>

						<Row style={{ marginTop: espacios - 15, marginLeft: 30 }}>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>GESTACIONES: </strong>
								{antecedentesGineco.nroGestaciones !== ''
									? antecedentesGineco.nroGestaciones
									: sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>FUP: </strong>
								{antecedentesGineco.fechaFup !== '' ? antecedentesGineco.fechaFup : sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>PARIEDAD: </strong>
								{antecedentesGineco.pariedad !== '' ? antecedentesGineco.pariedad : sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>N° CESÁREAS: </strong>
								{antecedentesGineco.nroCesareas !== ''
									? antecedentesGineco.nroCesareas
									: sinRegistro}
							</Col>
						</Row>

						<Row style={{ marginTop: espacios - 15, marginLeft: 30 }}>
							<Col xs={24}>
								<strong style={{ fontWeight: 600 }}>PAP: </strong>
								{antecedentesGineco.pap !== '' ? antecedentesGineco.pap : sinRegistro}
							</Col>
						</Row>

						<Row style={{ marginTop: espacios - 15, marginLeft: 30 }}>
							<Col xs={24}>
								<strong style={{ fontWeight: 600 }}>MAMOGRAFIA: </strong>
								{antecedentesGineco.mamografia !== '' ? antecedentesGineco.mamografia : sinRegistro}
							</Col>
						</Row>

						<Row style={{ marginTop: espacios - 15, marginLeft: 30 }}>
							<Col xs={24}>
								<strong style={{ fontWeight: 600 }}>MAC: </strong>
								{antecedentesGineco.mac !== '' ? antecedentesGineco.mac : sinRegistro}
							</Col>
						</Row>

						<Row style={{ marginTop: espacios - 15, marginLeft: 30 }}>
							<Col xs={24}>
								<strong style={{ fontWeight: 600 }}>OTROS: </strong>
								{antecedentesGineco.otros !== '' ? antecedentesGineco.otros : sinRegistro}
							</Col>
						</Row>

						<DividerPersonalizado espacios={espacios} />
						{/* ------------------------------------ANTECEDENTES GINECOLOGICOS------------------------------------*/}
					</div>
				</div>
			</div>
			<div id="pagina2" style={{ marginTop: -1 }}>
				<div style={{ position: 'relative' }}>
					<img
						alt="hoja membreatada"
						src={`${process.env.PUBLIC_URL}/assets/images/${themeSettingsGlobal.FORMATO_A4}`}
					></img>

					<div
						style={{
							position: 'absolute',
							top: 170,
							left: 16,
							fontSize: fuente,
							width: '1208px',
							paddingLeft: 16,
							paddingRight: 16,
						}}
					>
						<div style={{ width: '100%', textAlign: 'end', paddingRight: 50 }}>
							<strong style={{ fontWeight: 600 }}>H.C. N° : </strong>{' '}
							{datosModal.estado.dataMedico.NRO_HC_ACTUAL}
						</div>

						{/* ------------------------------------ANTECEDENTES PATOLOGICOS------------------------------------*/}

						<Row style={{ marginTop: espacios, marginLeft: 10 }}>
							<Col xs={24}>
								<strong>PATOLOGICOS </strong>
								{antecedentesPatologicos.length === 0 ? ': ' + sinRegistro : ''}
							</Col>
						</Row>

						{antecedentesPatologicos.length > 0 && (
							<Row style={{ marginLeft: 30 }}>
								<Col xs={24}>
									{antecedentesPatologicos.length > 0
										? antecedentesPatologicos.map((item, index) => {
												return (
													<Row key={index} style={{ marginTop: espacios - 20 }}>
														<Col xs={4}>
															<strong style={{ fontWeight: 600 }}>CIE 10 :</strong>{' '}
															{item.cod_cie_10}
														</Col>
														<Col xs={20}>
															<strong style={{ fontWeight: 600 }}>DIAGNOSTICO :</strong>{' '}
															{item.des_diagnostico}
														</Col>
													</Row>
												);
										  })
										: null}
								</Col>
							</Row>
						)}

						{/* {
							antecedentesPatologicosFamiliares.length > 0
							&&
							<Row style={{ marginTop: espacios, marginLeft: 30 }}>
								<Col xs={24}>
									<strong style={{fontWeight: 600}}>PATOLOGICOS FAMILIARES: </strong>
									{
										antecedentesPatologicosFamiliares.length > 0 ?

											antecedentesPatologicosFamiliares.map((item, index) => {
												return (
													<Row key={index} style={{ marginTop: espacios, marginLeft: 10 }}>
														<Col xs={4}>
															<strong style={{fontWeight: 600}}>CIE 10 :</strong> {item.cod_cie_10}
														</Col>
														<Col xs={13}>
															<strong style={{fontWeight: 600}}>DIAGNOSTICO :</strong> {item.des_diagnostico}
														</Col>
														<Col xs={7}>
															<strong style={{fontWeight: 600}}>PARENTESCO :</strong> {item.parentesco}
														</Col>
													</Row>
												)
											})
											: null
									}
								</Col>
							</Row>
						} */}
						<DividerPersonalizado espacios={espacios} />
						{/* -------------------------------------------------------------------------------------------*/}

						{/* ------------------------------------ANTECEDENTES OTROS------------------------------------*/}
						<Row style={{ marginTop: espacios, marginLeft: 10 }}>
							<Col xs={24}>
								<strong>OTROS</strong>
							</Col>
							{/* <Col xs={19}>ITEMS</Col> */}
						</Row>
						<Row style={{ marginTop: espacios - 10, marginLeft: 30 }}>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>DIABETES: </strong>
								{antecedentesOtros.diabetes !== '' ? antecedentesOtros.diabetes : sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>TUBERCULOSIS: </strong>
								{antecedentesOtros.tuberculosis !== ''
									? antecedentesOtros.tuberculosis
									: sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>ANEMIA: </strong>
								{antecedentesOtros.anemia !== '' ? antecedentesOtros.anemia : sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>FIEBRE REUMATICA: </strong>
								{antecedentesOtros.fiebre_reumatica !== ''
									? antecedentesOtros.fiebre_reumatica
									: sinRegistro}
							</Col>
						</Row>

						<Row style={{ marginTop: espacios - 15, marginLeft: 30 }}>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>ENFERMEDAD CARDIOVASCULAR: </strong>
								{antecedentesOtros.enfermedad_cardiovascular !== ''
									? antecedentesOtros.enfermedad_cardiovascular
									: sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>ENFERMEDAD RENAL: </strong>
								{antecedentesOtros.enfermedad_renal !== ''
									? antecedentesOtros.enfermedad_renal
									: sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>ENFERMEDAD HEPÁTICAS: </strong>
								{antecedentesOtros.enfermedad_hepaticas !== ''
									? antecedentesOtros.enfermedad_hepaticas
									: sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>REACCION ANORMAL A LA ANESTECIA LOCAL: </strong>
								{antecedentesOtros.reaccion_anormal_local !== ''
									? antecedentesOtros.reaccion_anormal_local
									: sinRegistro}
							</Col>
						</Row>

						<Row style={{ marginTop: espacios - 15, marginLeft: 30 }}>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>REACCION ANORMAL A OTRAS DROGAS: </strong>
								{antecedentesOtros.reaccion_anormal_drogas !== ''
									? antecedentesOtros.reaccion_anormal_drogas
									: sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>HEMORRAGIAS: </strong>
								{antecedentesOtros.hemorragias !== '' ? antecedentesOtros.hemorragias : sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>ALERGIA A LA PENECILINA: </strong>
								{antecedentesOtros.alergia_penecilina !== ''
									? antecedentesOtros.alergia_penecilina
									: sinRegistro}
							</Col>
							<Col xs={6}>
								<strong style={{ fontWeight: 600 }}>OTRAS: </strong>
								{antecedentesOtros.otras !== '' ? antecedentesOtros.otras : sinRegistro}
							</Col>
						</Row>

						<DividerPersonalizado espacios={espacios} />
						{/* ------------------------------------ANTECEDENTES OTROS------------------------------------*/}

						{/* ------------------------------------ALERGIAS------------------------------------*/}
						<Row style={{ marginTop: espacios, marginLeft: 10 }}>
							<Col xs={24}>
								<strong>ALERGIAS: </strong>
								{datosModal.estado.alergias && datosModal.estado.otros
									? datosModal.estado.alergias + ' / ' + datosModal.estado.otros
									: sinRegistro}
							</Col>
						</Row>
						<DividerPersonalizado espacios={espacios} />
						{/* ------------------------------------ALERGIAS------------------------------------*/}

						<Row
							style={{
								marginTop: espacios,
								paddingTop: 10,
								paddingBottom: 10,
								backgroundColor: tipo === 'N' ? backgroundRojo : backgroundAzul,
							}}
						>
							<Col xs={24}>
								<strong>2 EXAMEN FISICO</strong>
							</Col>
						</Row>
						<Row style={{ marginTop: espacios, marginLeft: 10 }}>
							<Col xs={24}>
								<strong>FUNCIONES VITALES</strong>
							</Col>
						</Row>
						<Row style={{ marginTop: espacios - 10, marginLeft: 30 }}>
							<Col xs={5}>
								<strong style={{ fontWeight: 600 }}>P.A. : </strong>{' '}
								{funcionVital.pa_1 && funcionVital.pa_2 !== '0'
									? funcionVital.pa_1 + ' / ' + funcionVital.pa_2
									: sinRegistro}
							</Col>
							<Col xs={5}>
								<strong style={{ fontWeight: 600 }}>F.R. : </strong>{' '}
								{funcionVital.fr !== '0' ? funcionVital.fr : sinRegistro}
							</Col>
							<Col xs={5}>
								<strong style={{ fontWeight: 600 }}>F.C. : </strong>{' '}
								{funcionVital.fc !== '0' ? funcionVital.fc : sinRegistro}
							</Col>
							<Col xs={4}>
								<strong style={{ fontWeight: 600 }}>TEMP. : </strong>{' '}
								{funcionVital.temp !== '0' ? funcionVital.temp : sinRegistro}
							</Col>
							<Col xs={5}>
								<strong style={{ fontWeight: 600 }}>SAT. : </strong>{' '}
								{funcionVital.satoxigeno !== '0' ? funcionVital.satoxigeno : sinRegistro}
							</Col>
						</Row>
						<DividerPersonalizado espacios={espacios} />
						<Row style={{ marginTop: espacios, marginLeft: 10 }}>
							<Col xs={24}>
								<strong>INDICADORES ANTRO</strong>
							</Col>
						</Row>
						<Row style={{ marginTop: espacios - 10, marginLeft: 30 }}>
							<Col xs={5}>
								<strong style={{ fontWeight: 600 }}>PESO: </strong>{' '}
								{funcionVital.peso !== '0' ? funcionVital.peso : sinRegistro}
							</Col>
							<Col xs={5}>
								<strong style={{ fontWeight: 600 }}>TALLA: </strong>{' '}
								{funcionVital.talla !== '0' ? funcionVital.talla : sinRegistro}
							</Col>
						</Row>
						<DividerPersonalizado espacios={espacios} />
						<Row style={{ marginTop: espacios, marginLeft: 10 }}>
							<Col xs={24}>
								<strong>EXAMEN FISICO</strong>
							</Col>
						</Row>
						<Row style={{ marginTop: espacios - 10, marginLeft: 30 }}>
							<Col xs={12}>
								<strong style={{ fontWeight: 600 }}>ESTADO GENERAL: </strong>
								{estadoFisico.estadoGeneral === 'B'
									? ' APARENTA BUENO'
									: estadoFisico.estadoGeneral === 'R'
									? ' APARENTA REGULAR'
									: estadoFisico.estadoGeneral === 'M'
									? ' APARENTA MALO'
									: sinRegistro}
							</Col>
							<Col xs={12}>
								<strong style={{ fontWeight: 600 }}>ESTADO CONCIENCIA: </strong>
								{estadoFisico.estadoConciencia !== '' ? estadoFisico.estadoConciencia : sinRegistro}
							</Col>
						</Row>
						<Row style={{ marginTop: espacios - 20, marginLeft: 30 }}>
							<Col xs={24}>
								<strong style={{ fontWeight: 600 }}>ESTADO FISICO DIRIGIDO: </strong>
								{estadoFisico.examenFisico !== '' ? estadoFisico.examenFisico : sinRegistro}
							</Col>
						</Row>
						<DividerPersonalizado espacios={espacios} />
					</div>
				</div>
			</div>

			<div id="pagina3" style={{ marginTop: -1 }}>
				<div style={{ position: 'relative' }}>
					<img
						alt="hoja membreatada"
						src={`${process.env.PUBLIC_URL}/assets/images/${themeSettingsGlobal.FORMATO_A4}`}
					></img>

					<div
						style={{
							position: 'absolute',
							top: 170,
							left: 16,
							fontSize: fuente,
							width: '1208px',
							paddingLeft: 16,
							paddingRight: 16,
						}}
					>
						<div style={{ width: '100%', textAlign: 'end', paddingRight: 50 }}>
							<strong style={{ fontWeight: 600 }}>H.C. N° : </strong>{' '}
							{datosModal.estado.dataMedico.NRO_HC_ACTUAL}
						</div>
						<Row
							style={{
								marginTop: espacios + 20,
								paddingTop: 10,
								paddingBottom: 10,
								backgroundColor: tipo === 'N' ? backgroundRojo : backgroundAzul,
							}}
						>
							<Col xs={24}>
								<strong>3 ENFERMEDAD ACTUAL</strong>
							</Col>
						</Row>
						<Row style={{ marginTop: espacios - 10, marginLeft: 10 }}>
							<Col xs={12}>
								<strong style={{ fontWeight: 600 }}>MOTIVO CONSULTA : </strong>
								{enfermedadActual.motivoConsulta !== ''
									? enfermedadActual.motivoConsulta
									: sinRegistro}
							</Col>
							<Col xs={12}>
								<strong style={{ fontWeight: 600 }}>CURSO : </strong>
								{enfermedadActual.curso === '1'
									? ' ESTACIONARIO'
									: enfermedadActual.curso === '2'
									? ' PROGRESIVO'
									: sinRegistro}
							</Col>
						</Row>
						<Row style={{ marginTop: espacios - 20, marginLeft: 10 }}>
							<Col xs={12}>
								<strong style={{ fontWeight: 600 }}>TIEMPO ENFERMEDAD : </strong>
								{enfermedadActual.tiempoEnfermedad.trim() !== ''
									? enfermedadActual.tiempoEnfermedad
									: sinRegistro}
							</Col>
							<Col xs={12}>
								<strong style={{ fontWeight: 600 }}>TIPO INFORMANTE : </strong>
								{enfermedadActual.tipoInformante === 'D'
									? ' DIRECTA'
									: enfermedadActual.tipoInformante === 'I'
									? ' INDIRECTA'
									: enfermedadActual.tipoInformante === 'M'
									? ' MIXTA'
									: sinRegistro}
							</Col>
						</Row>
						<Row style={{ marginTop: espacios - 20, marginLeft: 10 }}>
							<Col xs={24}>
								<strong style={{ fontWeight: 600 }}>RELATO CRONOLOGICO : </strong>
								{enfermedadActual.relatoCronologico !== ''
									? enfermedadActual.relatoCronologico
									: sinRegistro}
							</Col>
						</Row>
						<Row
							style={{
								marginTop: espacios,
								paddingTop: 10,
								paddingBottom: 10,
								backgroundColor: tipo === 'N' ? backgroundRojo : backgroundAzul,
							}}
						>
							<Col xs={24}>
								<strong>4 DIAGNOSTICO</strong>
							</Col>
						</Row>

						{diagnostico.length > 0 ? (
							diagnostico.map((item, index) => {
								return (
									<Row key={index} style={{ marginTop: espacios - 10, marginLeft: 10 }}>
										<Col xs={8}>
											<strong style={{ fontWeight: 600 }}>CIE 10 :</strong> {item.cie}
										</Col>
										<Col xs={8}>
											<strong style={{ fontWeight: 600 }}>DIAGNOSTICO :</strong> {item.diagnostico}
										</Col>
										<Col xs={8}>
											<strong style={{ fontWeight: 600 }}>TIPO :</strong> {item.tipodiagnostico}
										</Col>
									</Row>
								);
							})
						) : (
							<Row style={{ marginTop: espacios - 10, marginLeft: 10 }}>
								<Col xs={24}>{sinRegistro}</Col>
							</Row>
						)}

						<Row
							style={{
								marginTop: espacios,
								paddingTop: 10,
								paddingBottom: 10,
								backgroundColor: tipo === 'N' ? backgroundRojo : backgroundAzul,
							}}
						>
							<Col xs={24}>
								<strong>5 PLAN DE TRATAMIENTO</strong>
							</Col>
						</Row>

						{evolucionTratamiento.length > 0 ? (
							evolucionTratamiento.map((item, index) => {
								return (
									<>
										<Row key={index} style={{ marginTop: espacios - 10, marginLeft: 10 }}>
											<Col xs={24}>
												<strong style={{ fontWeight: 600 }}>PLAN DE TRATAMIENTO : </strong>
												{item.plan_tratamiento}
											</Col>
										</Row>
										<Row key={index} style={{ marginTop: espacios - 15, marginLeft: 10 }}>
											<Col xs={24}>
												<strong style={{ fontWeight: 600 }}>EVOLUCIÓN DE TRATAMIENTO : </strong>
												{item.descripcion_tratamiento}
											</Col>
										</Row>
									</>
								);
							})
						) : (
							<>
								<Row style={{ marginTop: espacios - 10, marginLeft: 10 }}>
									<Col xs={24}>
										<strong style={{ fontWeight: 600 }}>PLAN DE TRATAMIENTO : </strong>
										{sinRegistro}
									</Col>
								</Row>
								<Row style={{ marginTop: espacios - 15, marginLeft: 10 }}>
									<Col xs={24}>
										<strong style={{ fontWeight: 600 }}>EVOLUCIÓN DE TRATAMIENTO : </strong>
										{sinRegistro}
									</Col>
								</Row>
							</>
						)}
					</div>
					<div style={{ position: 'absolute', bottom: 300, width: '100%' }}>
						<Row
							style={{
								display: 'flex',
								flexDirection: 'row',
								padding: 5,
								textAlign: 'center',
								width: '35%',
								marginLeft: 'auto',
								marginRight: 'auto',
								// marginTop: '300px',
							}}
						>
							<Col xs={24}>
								<img alt="firma" src={firma} style={{ width: '200px' }} />
							</Col>
							<Col xs={24}>
								<h3 style={{ borderTop: '2px solid #000' }}>
									<strong>MÉDICO: </strong>
									{datosModal.estado.dataMedico.MEDICO}{' '}
								</h3>
							</Col>
						</Row>
					</div>
				</div>
			</div>
		</div>
	);
};

const DividerPersonalizado = ({ espacios }) => {
	return (
		<Col xs={24} style={{ textAling: 'center', paddingTop: espacios - 20 }}>
			<Divider style={{ borderTop: '3px solid rgba(0, 0, 0, 0.55)' }}></Divider>
		</Col>
	);
};
