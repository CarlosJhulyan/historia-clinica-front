import { setAnexosAction, setTipoAnexo } from '../../../appRedux/actions/menu/anexos';
import {
	setAntecedentesPatologicos,
	setAntecedentesPatologicosFamiliares,
	setGCicloMenstruacion,
	setGDisminorrea,
	setGeneralesMedicamentos,
	setGeneralesOcupacionales,
	setGeneralesRam,
	setGFechaFpp,
	setGFechaFup,
	setGFechaFur,
	setGMac,
	setGMamografia,
	setGMenarquia,
	setGNroCesareas,
	setGNroGestacion,
	setGOtros,
	setGPap,
	setGPariedad,
	setGRcMenstruacion,
	setGReglaRegular,
	setGRS,
	setOtros,
} from '../../../appRedux/actions/menu/antecedentes';
import {
	setComboCurso,
	setComboViaAdmin,
	setComboTipoInformante,
	setComboApetito,
	setComboSueno,
	setComboDeposicion,
	setComboSed,
	setComboOrina,
	setComboEstadoGeneral,
	setComboTipoDiagnostico,
	setComboPrenatales,
	setComboParto,
	setComboInmunizaciones,
	setDataProcedimiento,
	setDataLaboratorio,
	setDataImagenes,
	setDataTratamientos,
	setDataDiagnostico,
	setComboHabitosNocivos,
} from '../../../appRedux/actions/menu/combos';
import { setDesarrolloAction } from '../../../appRedux/actions/menu/desarrollo';
import { setDiagnosticoAction } from '../../../appRedux/actions/menu/diagnostico';
import { setEnfermedadActual } from '../../../appRedux/actions/menu/enfermedadActual';
import { setEvolucionTratamiento } from '../../../appRedux/actions/menu/evolucionTratamiento';
import { setEvolucionTratamientoOdonto } from '../../../appRedux/actions/menu/evolucionTratamientoOdonto';
import { setEstomatologico } from '../../../appRedux/actions/menu/examenClinico';
import { setEstadoFisico, setFuncionesVitales } from '../../../appRedux/actions/menu/examenFisico';
import { setImagenesAction } from '../../../appRedux/actions/menu/imagenes';
import { setLaboratorioAction } from '../../../appRedux/actions/menu/laboratorio';
import {
	setConsultasProcedimientos,
	setInterconsultasProcedimiento,
} from '../../../appRedux/actions/menu/procedimiento';
import {
	setTratamiento,
	setTratamientoCabeceraDetalle,
} from '../../../appRedux/actions/menu/tratamiento';

import store from '../../../appRedux/store';
import { httpClient } from '../../../util/Api';

import { setFisiologicos } from '../../../appRedux/actions/menu/fisiologicos';
import { setFiltroEspecialidad } from '../../../appRedux/actions/ui';

import { setTratamientoCabeceraDetalleKardex } from '../../../appRedux/actions/kardex/TratamientoKardex';
import { setDiagnosticoActionKardex } from '../../../appRedux/actions/kardex/DiagnosticoKardex';
import { setExamenKardex } from '../../../appRedux/actions/kardex/ExamenKardex';
import { setInterconsultaKardex } from '../../../appRedux/actions/kardex/InterconsultaKardex';

const codMedico = JSON.parse(localStorage.getItem('token'));

/********************************* API COMBOS******************************************/
export const traerCombos = dataGlobal => {
	httpClient.get(`/combo/maestro`).then(comboMaestro => {
		console.log('COOOOOOMBO:', comboMaestro.data.data);
		const data = comboMaestro.data.data;

		//Via administracion
		const viaadministracion = data.viaAdministracion;
		store.dispatch(setComboViaAdmin(viaadministracion));

		//Combo Enfermedad Actual
		const curso = data.curso;
		store.dispatch(setComboCurso(curso));

		const tipoInformante = data.tipoInformante;
		store.dispatch(setComboTipoInformante(tipoInformante));

		const apetito = data.apetito;
		store.dispatch(setComboApetito(apetito));

		const sueno = data.sueno;
		store.dispatch(setComboSueno(sueno));

		const deposicion = data.deposicion;
		store.dispatch(setComboDeposicion(deposicion));

		const sed = data.sed;
		store.dispatch(setComboSed(sed));

		const orina = data.orina;
		store.dispatch(setComboOrina(orina));

		//Combo estado fisico
		const estadoGeneral = data.estadoGeneral;
		store.dispatch(setComboEstadoGeneral(estadoGeneral));

		//Traer tipo de diagnostico
		const tipodiagnostico = data.tipoDiagnostico;
		store.dispatch(setComboTipoDiagnostico(tipodiagnostico));

		//Traer Prenatales
		const prenatales = data.prenatales;
		store.dispatch(setComboPrenatales(prenatales));

		//Traer Parto
		const parto = data.parto;
		store.dispatch(setComboParto(parto));

		//Traer inmunizaciones
		const inmunizaciones = data.inmunizaciones;
		store.dispatch(setComboInmunizaciones(inmunizaciones));
	});

	traerProce(dataGlobal).then(data => {
		store.dispatch(setDataProcedimiento(data));
	});

	traerLab(dataGlobal).then(data => {
		store.dispatch(setDataLaboratorio(data));
	});

	traerImagenes(dataGlobal).then(data => {
		store.dispatch(setDataImagenes(data));
	});

	traerTratamientos(dataGlobal).then(data => {
		store.dispatch(setDataTratamientos(data));
	});

	traerDiagnosticos().then(data => {
		store.dispatch(setDataDiagnostico(data));
	});
};

///BTN ACTUALIZAR TABLAS

export const actualizarTratamientos = async dataGlobal => {
	const resp = await traerTratamientos(dataGlobal);
	store.dispatch(setDataTratamientos(resp));
};

export const actualizarProcedimientos = async dataGlobal => {
	const resp = await traerProce(dataGlobal);
	store.dispatch(setDataProcedimiento(resp));
};

export const actualizarLaboratorio = async dataGlobal => {
	const resp = await traerLab(dataGlobal);
	store.dispatch(setDataLaboratorio(resp));
};

export const actualizarImagenes = async dataGlobal => {
	const resp = await traerImagenes(dataGlobal);
	store.dispatch(setDataImagenes(resp));
};

/*********************************PESTAÑA ENFERMEDAD ACTUAL ******************************************/

/*********************************PESTAÑA EXAMEN FISICO******************************************/

/*********************************PESTAÑA DIAGNOSTICO******************************************/

function removeDuplicates(originalArray, prop) {
	var newArray = [];
	var lookupObject = {};

	for (var i in originalArray) {
		lookupObject[originalArray[i][prop]] = originalArray[i];
	}

	for (i in lookupObject) {
		newArray.push(lookupObject[i]);
	}
	return newArray;
}

export const examenFisico = dataGlobal => {
	const stateRedux = store.getState();

	traerFuncionesVitales(dataGlobal).then(async fvital => {
		console.log('HV:', fvital);

		if (fvital !== undefined) {
			const triaje = {
				pa_1: parseInt(fvital[0].PA_1) < 0 ? '0' : fvital[0].PA_1,
				pa_2: parseInt(fvital[0].PA_2) < 0 ? '0' : fvital[0].PA_2,
				fr: parseInt(fvital[0].FR) < 0 ? '0' : fvital[0].FR,
				fc: parseInt(fvital[0].FC) < 0 ? '0' : fvital[0].FC,
				temp: parseInt(fvital[0].TEMP) < 0 ? '0' : fvital[0].TEMP,
				satoxigeno: parseInt(fvital[0].SATURACION_OXIGENO) < 0 ? '0' : fvital[0].SATURACION_OXIGENO,
				peso: parseInt(fvital[0].PESO) < 0 ? '0' : fvital[0].PESO,
				talla: parseInt(fvital[0].TALLA) < 0 ? '0' : fvital[0].TALLA,
			};

			const enfermedadActual = {
				motivoConsulta: fvital[0].MOTIVO_CONSULTA === null ? '' : fvital[0].MOTIVO_CONSULTA,
				curso: fvital[0].CURSO === null ? '' : fvital[0].CURSO,
				tipoInformante: fvital[0].TIPO_INFORMANTE === null ? '' : fvital[0].TIPO_INFORMANTE,
				tiempoEnfermedad: fvital[0].TIEMPO_ENFERMEDAD === null ? '' : fvital[0].TIEMPO_ENFERMEDAD,
				relatoCronologico:
					fvital[0].RELATO_CRONOLOGICO === null ? '' : fvital[0].RELATO_CRONOLOGICO,
				apetito: fvital[0].APETITO === null ? '' : fvital[0].APETITO,
				sueno: fvital[0].SUENIO === null ? '' : fvital[0].SUENIO,
				deposicion: fvital[0].DEPOSICION === null ? '' : fvital[0].DEPOSICION,
				sed: fvital[0].SED === null ? '' : fvital[0].SED,
				orina: fvital[0].ORINA === null ? '' : fvital[0].ORINA,
			};

			const estadoFisico = {
				estadoGeneral: fvital[0].ESTADO_GENERAL === null ? '' : fvital[0].ESTADO_GENERAL,
				estadoConciencia: fvital[0].ESTADO_CONCIENCIA === null ? '' : fvital[0].ESTADO_CONCIENCIA,
				examenFisico: fvital[0].EXA_FISICO_DIRIGIDO === null ? '' : fvital[0].EXA_FISICO_DIRIGIDO,
				imc: fvital[0].IMC,
				medCintura: parseInt(fvital[0].MED_CINTURA) < 0 ? '0' : fvital[0].MED_CINTURA,
			};

			const filtrosDiagnostico = removeDuplicates(fvital, 'COD_DIAGNOSTICO');
			const obtenerDiagnosticoArr = async filtros => {
				const dataDiagnostico = [];
				if (filtros[0].COD_DIAGNOSTICO !== null) {
					if (filtros.length > 0) {
						for (const filtro of filtros) {
							const diagnostico = {
								key: filtro.COD_DIAGNOSTICO,
								cie: filtro.COD_CIE_10,
								coddiagnostico: filtro.COD_DIAGNOSTICO,
								diagnostico: filtro.DES_DIAGNOSTICO,
								secuencia: filtro.SEC_DIAG,
								tipodiagnostico: filtro.TIPO_DIAGNOSTICO === 'D' ? 'DEFINITIVO' : 'PRESUNTIVO',
							};

							dataDiagnostico.push(diagnostico);
						}
					}
				}

				return dataDiagnostico;
			};

			const filtros = removeDuplicates(fvital, 'COD_PROD');
			const obtenerTratamientoArr = async filtros => {
				const dataTratamiento = [];

				if (filtros[0].NRO_RECETA !== null) {
					for (const filtro of filtros) {
						const getRecomendaciones = await httpClient.post('/tratamientos/getRecomendaciones', {
							nunReceta: filtro.NRO_RECETA,
							atencionMedica: filtro.NUM_ATEN_MED,
							codProducto: filtro.COD_PROD,
						});

						const tratamiento = {
							key: filtro.COD_PROD,
							cantidad: filtro.FRECUENCIA_TOMA * filtro.DURACION_TOMA,
							codprod: filtro.COD_PROD,
							descprod: filtro.DESC_PROD,
							rucempresa: filtro.NUM_RUC_CIA,
							valfrac: filtro.VAL_FRAC,
							unidvta: filtro.UNID_VTA,
							viaadministracion: filtro.ID_VIA_ADMINISTRACION,
							etiquetaVia: filtro.DESC_VIA_ADMINISTRACION,
							frecuencia: filtro.FRECUENCIA_TOMA,
							duracion: filtro.DURACION_TOMA,
							dosis: filtro.DOSIS_TOMA,
							recomendacionAplicar:
								getRecomendaciones.data.data === null
									? ''
									: getRecomendaciones.data.data.recomendacion,
							tratamiento:
								filtro.FRECUENCIA_TOMA + ' veces al dia x ' + filtro.FRECUENCIA_TOMA + ' Dias',
						};

						dataTratamiento.push(tratamiento);
					}
				}

				return dataTratamiento;
			};

			obtenerTratamientoArr(filtros).then(data => {
				console.log('dARRAY TRATAMIENTO 1: ', data);
				console.log('dARRAY TRATAMIENTO 2: ', filtros);

				store.dispatch(setTratamientoCabeceraDetalle(data));
			});

			obtenerDiagnosticoArr(filtrosDiagnostico).then(data => {
				store.dispatch(setDiagnosticoAction(data));
			});

			store.dispatch(setFuncionesVitales(triaje));
			store.dispatch(setEnfermedadActual(enfermedadActual));
			store.dispatch(setEstadoFisico(estadoFisico));
		} else {
			store.dispatch(setFuncionesVitales(stateRedux.funcionVital));
			store.dispatch(setEnfermedadActual(stateRedux.enfermedadActual));
			store.dispatch(setEstadoFisico(stateRedux.estadoFisico));
			store.dispatch(setDiagnosticoAction(stateRedux.diagnostico));
			store.dispatch(setTratamientoCabeceraDetalle(stateRedux.tratamientoDetalle));
		}
	});
};

/********************************* KARDEX ***************************************** */
export const getKardexHospitaliario = async data => {
	const stateRedux = store.getState();

	traerFuncionesVitales(data).then(async fvital => {
		if (fvital !== undefined) {
			const filtrosDiagnostico = removeDuplicates(fvital, 'COD_DIAGNOSTICO');
			const obtenerDiagnosticoArr = async filtros => {
				const dataDiagnostico = [];
				if (filtros && filtros.length > 0) {
					if (filtros[0].COD_DIAGNOSTICO !== null) {
						for (const filtro of filtros) {
							const diagnostico = {
								key: filtro.COD_DIAGNOSTICO,
								cie: filtro.COD_CIE_10,
								coddiagnostico: filtro.COD_DIAGNOSTICO,
								diagnostico: filtro.DES_DIAGNOSTICO,
								secuencia: filtro.SEC_DIAG,
								tipodiagnostico: filtro.TIPO_DIAGNOSTICO === 'D' ? 'DEFINITIVO' : 'PRESUNTIVO',
							};

							dataDiagnostico.push(diagnostico);
						}
					}
				}

				return dataDiagnostico;
			};

			const filtros = removeDuplicates(fvital, 'COD_PROD');
			const obtenerTratamientoArr = async filtros => {
				const dataTratamiento = [];
				if (filtros[0].NRO_RECETA !== null) {
					for (const filtro of filtros) {
						console.log('FILTRO DE KARDEXXXXX: ', filtro);

						const getRecomendaciones = await httpClient.post('/tratamientos/getRecomendaciones', {
							nunReceta: filtro.NRO_RECETA,
							atencionMedica: filtro.NUM_ATEN_MED,
							codProducto: filtro.COD_PROD,
						});

						const tratamiento = {
							key: filtro.COD_PROD,
							cantidad: filtro.FRECUENCIA_TOMA * filtro.DURACION_TOMA,
							codprod: filtro.COD_PROD,
							descprod: filtro.DESC_PROD,
							rucempresa: filtro.NUM_RUC_CIA,
							valfrac: filtro.VAL_FRAC,
							unidvta: filtro.UNID_VTA,
							viaadministracion: filtro.ID_VIA_ADMINISTRACION,
							etiquetaVia: filtro.DESC_VIA_ADMINISTRACION,
							frecuencia: filtro.FRECUENCIA_TOMA,
							duracion: filtro.DURACION_TOMA,
							dosis: filtro.DOSIS_TOMA,
							recomendacionAplicar:
								getRecomendaciones.data.data === null
									? ''
									: getRecomendaciones.data.data.recomendacion,
							tratamiento:
								filtro.FRECUENCIA_TOMA + ' veces al dia x ' + filtro.FRECUENCIA_TOMA + ' Dias',

							HoraAdministrada: '',
						};
						dataTratamiento.push(tratamiento);
					}
				}
				return dataTratamiento;
			};

			obtenerTratamientoArr(filtros).then(data => {
				store.dispatch(setTratamientoCabeceraDetalleKardex(data));
			});

			obtenerDiagnosticoArr(filtrosDiagnostico).then(data => {
				store.dispatch(setDiagnosticoActionKardex(data));
			});
		} else {
			store.dispatch(setTratamientoCabeceraDetalleKardex(stateRedux.kardexTratamientoDetalle));
			store.dispatch(setDiagnosticoActionKardex(stateRedux.kardexDiagnostico));
		}
	});

	const fechaRes = await httpClient.post('/kardex/getFechaAtencion', data);
	console.log('FECHA', fechaRes.data.data);
	//Imagenes y Laboratorios
	const examenes = [];

	traerListaImagenes(data).then(d => {
		console.log('LISTA IMAGENES:', d);
		if (d) {
			d.forEach(item => {
				item.tipo = 'Imagen';
			});
			examenes.push(...d);
		}
	});

	traerListaLaboratorio(data).then(d => {
		console.log('LISTA LABORATORIO:', d);
		if (d) {
			d.forEach(item => {
				item.tipo = 'Laboratorio';
			});
			examenes.push(...d);
		}
	});

	stateRedux.kardexExamen = examenes;
	store.dispatch(setExamenKardex(stateRedux.kardexExamen));

	//Procedimientos e interconsultas
	let arrayinterconsultas = [];

	//Interconsulta
	const respuesta = await httpClient.post('/pacientes/getInterconsultas', data);
	if (respuesta.data.success) {
		const data = respuesta.data.data;
		const dat = data[0].map(e => ({
			key: e.cod_prod,
			COD_PROD: e.cod_prod,
			DESC_PROD: e.desc_prod,
			NOM_LAB: e.nom_lab,
			RUC: e.ruc,
			tipo: 'Interconsulta',
		}));
		arrayinterconsultas.push(...dat);
	}
	arrayinterconsultas = removeDuplicates(arrayinterconsultas, 'cod_prod');

	traerListaProcedimiento(data).then(d => {
		console.log('LISTA PROCEDIMIENTO:', d);
		if (d) {
			d.forEach(item => {
				// item.FECHA = fechaRes.data.data.FECHA;
				item.tipo = 'Procedimiento';
				console.log('respuesta procedimiento', item);
				arrayinterconsultas.push(item);
			});
		}
	});

	stateRedux.kardexInterconsulta = arrayinterconsultas;
	store.dispatch(setInterconsultaKardex(stateRedux.kardexInterconsulta));
};

export const traerCombosKardex = () => {
	httpClient.get(`/combo/maestro`).then(comboMaestro => {
		const data = comboMaestro.data.data;

		//Via administracion
		const viaadministracion = data.viaAdministracion;
		store.dispatch(setComboViaAdmin(viaadministracion));
	});

	const dataGlobal = {
		codGrupoCia: '001',
		codLocal: '001',
	};

	traerTratamientos(dataGlobal).then(data => {
		store.dispatch(setDataTratamientos(data));
	});

	actualizarImagenes(dataGlobal);
	actualizarLaboratorio(dataGlobal);
};

/*****************************PESTAÑA EVOLUCION DEL TRATAMIENTO**************************************/

// export const evolucionTratamiento = dataGlobal => {
// 	traerTratamientoPacientes(dataGlobal).then(data => {
// 		store.dispatch(setEvolucionTratamiento(data));
// 	});
// };

/*****************************PESTAÑA TRATAMIENTO**************************************/

export const tratamiento = dataGlobal => {
	/* 	const dataTratamiento = {
			indicacionesgen: '',
			validezreceta: '',
		}; */

	//
	traerFuncionesVitales(dataGlobal).then(data => {
		console.log('DATA TRATAMIENTO2323223: ', data[0].VALIDEZ_RECETA);
		const proc = store.getState();
		proc.tratamiento.validezreceta = data[0].VALIDEZ_RECETA === null ? '' : data[0].VALIDEZ_RECETA;
		store.dispatch(setTratamiento({ ...proc.tratamiento }));
	});

	//Traer OBS tratamiento
	traerObsT(dataGlobal).then(obs => {
		console.log('OBS Tratamiento: ', obs);
		const proc = store.getState();
		proc.tratamiento.indicacionesgen = obs === 'N' ? '' : obs;
		store.dispatch(setTratamiento({ ...proc.tratamiento }));
	});

	/* traerObsT(dataGlobal).then(obs => {
		console.log('OBS Tratamiento: ', obs);
		dataTratamiento.indicacionesgen = obs === 'N' ? '' : obs;
		store.dispatch(setTratamiento(dataTratamiento));
	}); */
};

/*****************************PESTAÑA ANEXOS **************************************/
export const anexos = () => {};

/*****************************PESTAÑA CONSULTAS PROCEDIMIENTO  **************************************/
export const consultasProcedimiento = global => {
	traerListaProcedimiento(global).then(data => {
		console.log('LISTA PROCEDIMIENTO:', data);
		const proc = store.getState();
		proc.procedimientoReducer.dataProcedimiento = data;
		store.dispatch(setConsultasProcedimientos({ ...proc.procedimientoReducer }));
	});

	//Traer OBS procedimiento
	traerObsP(global).then(data => {
		const proc = store.getState();
		proc.procedimientoReducer.recomendacion = data === 'N' ? '' : data;
		store.dispatch(setConsultasProcedimientos({ ...proc.procedimientoReducer }));
	});
};

/*****************************PESTAÑA IMAGNES  **************************************/

export const imagenes = dataGlobal => {
	traerListaImagenes(dataGlobal).then(data => {
		console.log('LISTA IMAGENES:', data);
		if (data) {
			const proc = store.getState();
			proc.imagenes.dataProcedimiento = data;
			store.dispatch(setImagenesAction({ ...proc.imagenes }));
		}
	});

	//Traer OBS imagenes
	traerObsImagen(dataGlobal).then(data => {
		const proc = store.getState();
		proc.imagenes.recomendacion = data === 'N' ? '' : data;
		store.dispatch(setImagenesAction({ ...proc.imagenes }));
	});
};

/***************************** PESTAÑA LABORATORIO  **************************************/
export const laboratorio = dataGlobal => {
	traerListaLaboratorio(dataGlobal).then(data => {
		console.log('LISTA LABORATORIO:', data);

		const proc = store.getState();
		proc.laboratorio.dataProcedimiento = data;
		store.dispatch(setLaboratorioAction({ ...proc.laboratorio }));
	});

	//Traer OBS laboratorio
	traerObsLaboratorio(dataGlobal).then(data => {
		const proc = store.getState();
		proc.laboratorio.recomendacion = data === 'N' ? '' : data;
		store.dispatch(setLaboratorioAction({ ...proc.laboratorio }));
	});
};

/*********************************PESTAÑA DESARROLLO PROCEDIMIENTOS******************************************/
export const desarrolloProcedimientos = dataGlobal => {
	traerDesarrolloProcedimiento(dataGlobal).then(data => {
		if (data.data.length > 0) {
			const resp = data.data[0];
			console.log('Desarrollo Proccedimiento:', resp);
			const desarrollo = {
				relatoMedico: resp.relato_medico,
				conclusion: resp.conclusion,
				observaciones: resp.observaciones,
			};
			store.dispatch(setDesarrolloAction(desarrollo));
		} else {
			console.log('Desarrollo Procedimiento vacio');
		}
	});
};

/***************************** BOTON ANTECEDENTES  **************************************/

export const traerAntecedentes = dataGlobal => {
	console.log('AAAAAAAAAAAAAATRATATATA:', dataGlobal);
	// TRAER OTROS
	httpClient
		.post(`/tratamientos/antecedentes`, {
			codGrupoCia: dataGlobal.codGrupoCia,
			codPaciente: dataGlobal.codPaciente,
			codMedico: codMedico.cod_medico,
		})
		.then(resp => {
			console.log('RESPUESTAAAAAA2222:', resp);
			const data = resp.data.data;
			const proc = store.getState();
			console.log('OTROSssss:,', data);
			store.dispatch(setOtros(data.length > 0 ? data[0] : proc.antecedentesOtros));
		});
};

export const traerEstematologico = dataGlobal => {
	httpClient
		.post(`/tratamientos/estomatologico`, {
			codGrupoCia: dataGlobal.codGrupoCia,
			codPaciente: dataGlobal.codPaciente,
			codMedico: codMedico.cod_medico,
			nroAtencion: dataGlobal.nroAtencion,
		})
		.then(resp => {
			const data = resp.data.data;
			const proc = store.getState();
			console.log('ESTOMATOGOLOOCISOS:,', data);

			store.dispatch(setEstomatologico(data.length > 0 ? data[0] : proc.examenClinico));
		});
};

///////////////////////////////////// A P I S ////////////////////////////////////////////////////

export const traerDesarrolloProcedimiento = async dataGlobal => {
	const { data } = await httpClient.post(`/procedimientos/getProcedimientos`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codPaciente: dataGlobal.codPaciente,
		codMedico: codMedico.cod_medico,
		nroAtencion: dataGlobal.nroAtencion,
	});

	console.log('DESARROLLO DEL PROCEDIMIENTO:', data);
	return data;
};

export const AntecedentesGenerales = async () => {
	const { data } = await httpClient.post(`antecedentes/generales`, {
		codMaestro: '34',
	});

	store.dispatch(setComboHabitosNocivos(data.data));
};

export const AntecedentesHC = async dataGlobal => {
	const datos = {
		codGrupoCia: dataGlobal.codGrupoCia,
		codLocal: dataGlobal.codLocal,
		codPaciente: dataGlobal.codPaciente,
		codSecuencia: dataGlobal.secuenciaAntecedente,
		nroAtencion: dataGlobal.nroAtencion,
	};

	const { data } = await httpClient.post(`/antecedentes/hc`, datos);
	console.log(' ANTECEDENTES GENERAAAAAAAAAAAAAAAAALES:', data);
	if (data.success) {
		store.dispatch(
			setGeneralesMedicamentos(data.data.MEDICAMENTOS === null ? '' : data.data.MEDICAMENTOS)
		);
		store.dispatch(
			setGeneralesOcupacionales(data.data.OCUPACIONALES === null ? '' : data.data.OCUPACIONALES)
		);
		store.dispatch(setGeneralesRam(data.data.RAM === null ? '' : data.data.RAM));
		store.dispatch(
			setGCicloMenstruacion(
				data.data.RC_CICLO_MENSTRUAL === null ? '' : data.data.RC_CICLO_MENSTRUAL
			)
		);
		store.dispatch(
			setGRcMenstruacion(data.data.RC_MENSTRUACION === null ? '' : data.data.RC_MENSTRUACION)
		);
		store.dispatch(setGRS(data.data.RS === null ? '' : data.data.RS));
		store.dispatch(
			setGReglaRegular(data.data.IS_REGLA_REGULAR === null ? 'N' : data.data.IS_REGLA_REGULAR)
		);
		store.dispatch(setGPariedad(data.data.PARIDAD === null ? '' : data.data.PARIDAD));
		store.dispatch(setGOtros(data.data.OTROS === null ? '' : data.data.OTROS));
		store.dispatch(setGNroGestacion(data.data.GESTACIONES === null ? '' : data.data.GESTACIONES));
		store.dispatch(
			setGMenarquia(data.data.EDAD_MENARQUIA === null ? '' : data.data.EDAD_MENARQUIA)
		);
		store.dispatch(setGMamografia(data.data.MAMOGRAFIA === null ? '' : data.data.MAMOGRAFIA));
		store.dispatch(setGFechaFur(data.data.FUR === null ? '' : data.data.FUR));
		store.dispatch(setGFechaFup(data.data.FUP === null ? '' : data.data.FUP));
		store.dispatch(setGFechaFpp(data.data.FPP === null ? '' : data.data.FPP));
		store.dispatch(setGDisminorrea(data.data.DISMINORREA === null ? 'N' : data.data.DISMINORREA));
		store.dispatch(setGNroCesareas(data.data.CESAREAS === null ? '' : data.data.CESAREAS));
		store.dispatch(setGPap(data.data.PAP === null ? '' : data.data.PAP));
		store.dispatch(setGMac(data.data.MAC === null ? '' : data.data.MAC));
	}
};

export const traerPatologicos = async dataGlobal => {
	const { data } = await httpClient.post(`/antecedentes/getPatologico`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codLocal: dataGlobal.codLocal,
		codPaciente: dataGlobal.codPaciente,
		codSecuencia: dataGlobal.secuenciaAntecedente,
		tipo: 'PA',
	});

	if (data.data.length > 0) {
		data.data.forEach((element, index) => {
			element['key'] = index;
		});
	}
	store.dispatch(setAntecedentesPatologicos(data.data));
};

export const traerPatologicosFamiliares = async dataGlobal => {
	const { data } = await httpClient.post(`/antecedentes/getPatologico`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codLocal: dataGlobal.codLocal,
		codPaciente: dataGlobal.codPaciente,
		codSecuencia: dataGlobal.secuenciaAntecedente,
		tipo: 'FA',
	});

	if (data.data.length > 0) {
		data.data.forEach((element, index) => {
			element['key'] = index;
			element['parentesco'] = element['desc_parientes'];
		});
	}

	store.dispatch(setAntecedentesPatologicosFamiliares(data.data));
};

export const traerInterconsulta = async dataGlobal => {
	const ss = store.getState();

	const datos = {
		codGrupoCia: dataGlobal.codGrupoCia,
		codPaciente: dataGlobal.codPaciente,
		nroAtencion: dataGlobal.nroAtencion,
	};

	const respuesta = await httpClient.post('/pacientes/getInterconsultas', datos);

	console.log('INTERCONSULTAS:', respuesta);

	if (respuesta.data.success) {
		const data = respuesta.data.data;
		console.log('interconsultaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', data);
		const dat = data[0].map(e => ({
			key: e.cod_prod,
			COD_PROD: e.cod_prod,
			DESC_PROD: e.desc_prod,
			NOM_LAB: e.nom_lab,
			RUC: e.ruc,
		}));

		store.dispatch(
			setInterconsultasProcedimiento({
				...ss.procedimientoInterconsulta,
				dataProcedimiento: dat,
				recomendacion: data[1] ? data[1].recomendacion : '',
			})
		);
	}
};

export const traerEvolucionTratamiento = async dataGlobal => {
	console.log('dataGlobal22222222', dataGlobal);

	const { data } = await httpClient.post(`/consulta/getEvolucionTratamiento`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codPaciente: dataGlobal.codPaciente,
		nroAtencion: dataGlobal.nroAtencion,
	});
	console.log('TRAEEEEEER EVOLUCION TRATAMIENTO:', data);
	store.dispatch(setEvolucionTratamiento(data.data));
};

export const traerEvolucionTratamientoOdonto = async dataGlobal => {
	const { data } = await httpClient.post(`/consulta/getEvolucionTratamientoOdonto`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codPaciente: dataGlobal.codPaciente,
		nroAtencion: dataGlobal.nroAtencion,
	});
	console.log('Evolucion Odontoooooooooooooooooooooooooooooooooooooooooo', data.data);
	store.dispatch(setEvolucionTratamientoOdonto(data.data));
};

// TRAER TIPO DE ANEXO (FIRESTORE O LOCAL)
export const tipoAnexo = async () => {
	const respuesta = await httpClient.post('/tipoAnexos');
	if (respuesta.data.success) {
		if (respuesta.data.data[0].llave_tab_gral === 'S') {
			store.dispatch(setTipoAnexo('S'));
		}
	}
};

// TRAER ANEXOS LOCAL
export const traerAnexo = async dataGlobal => {
	const estado = store.getState();
	// if (estado.anexo.tipo === 'local') {
	const resp = await httpClient.post('/anexos/getAnexos', { numAtendMed: dataGlobal.nroAtencion });
	console.log('ANEEEEEEEXOOO13223:', resp);
	if (resp.data.success) {
		store.dispatch(setAnexosAction({ ...estado.anexo, data: resp.data.data }));
	}
	// }
};

// TRAER ANEXOS LOCAL
export const traerAnexoBusqueda = async (numAtendMed, fechaInicio, fechaFin) => {
	const estado = store.getState();
	// if (estado.anexo.tipo === 'local') {
	const resp = await httpClient.post('/anexos/getAnexosFecha', {
		numAtendMed,
		fechaInicio,
		fechaFin,
	});

	return resp.data;
	//AÑO MES Y DIA
};

const traerDiagnosticos = async () => {
	const resp = await httpClient.get(`/antecedentes/diagnosticos`);
	console.log('DIAGNOSTICOSSS:', resp.data);
	return resp.data.data;
};

const traerTratamientos = async dataGlobal => {
	const resp = await httpClient.post(`/tratamientos`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codLocal: dataGlobal.codLocal,
	});
	console.log('tratamientooooooooos:', resp.data);

	return resp.data.data;
};

// const traerTratamientoPacientes = async dataGlobal => {
// 	const resp = await httpClient.post(`/consulta/getEvolucionTratamiento`, {
// 		codGrupoCia: dataGlobal.codGrupoCia,
// 		codPaciente: dataGlobal.codPaciente,
// 		codMedico: codMedico.cod_medico,
// 	});
// 	console.log("TRATTAMIENTO PACIENTES:", resp.data.data);
// 	return resp.data.data;
// };

const traerFuncionesVitales = async dataGlobal => {
	console.log('DATAAAAAAA FUNCION VITALES GLOBAL: ', dataGlobal);
	const resp = await httpClient.post(`/antecedentes/funcionesvitales`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codLocal: dataGlobal.codLocal,
		codCia: dataGlobal.codCia,
		nroAtencion: dataGlobal.nroAtencion,
	});
	console.log('abc123', resp.data.data);
	return resp.data.data;
};

const traerLab = async dataGlobal => {
	const resp = await httpClient.post(`/combo/laboratorio`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codLocal: dataGlobal.codLocal,
	});

	console.log('COMBO LABORATORIO :', resp);
	if (resp.data.success) {
		return resp.data.data;
	} else {
		return [];
	}
};

const traerProce = async dataGlobal => {
	const resp = await httpClient.post(`/combo/procedimientos`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codLocal: dataGlobal.codLocal,
	});

	console.log('COMBO procedimiento :', resp);

	if (resp.data.success) {
		return resp.data.data;
	} else {
		return [];
	}
};

const traerImagenes = async dataGlobal => {
	const resp = await httpClient.post(`/combo/imagenes`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codLocal: dataGlobal.codLocal,
	});
	console.log('COMBO img :', resp);

	if (resp.data.success) {
		return resp.data.data;
	} else {
		return [];
	}
};

const traerListaProcedimiento = async dataGlobal => {
	const resp = await httpClient.post(`/tabla/procedimientos`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codLocal: dataGlobal.codLocal,
		numAtendMed: dataGlobal.nroAtencion,
	});

	console.log('Logggggggg:', resp);

	return resp.data.data;
};

const traerListaImagenes = async dataGlobal => {
	const resp = await httpClient.post(`/tabla/imagenes`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codLocal: dataGlobal.codLocal,
		numAtendMed: dataGlobal.nroAtencion,
	});

	return resp.data.data;
};

const traerListaLaboratorio = async dataGlobal => {
	const resp = await httpClient.post(`/tabla/laboratorio`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codLocal: dataGlobal.codLocal,
		numAtendMed: dataGlobal.nroAtencion,
	});
	return resp.data.data;
};

const traerObsT = async dataGlobal => {
	const resp = await httpClient.post(`/obs/tratamiento`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codLocal: dataGlobal.codLocal,
		numAtendMed: dataGlobal.nroAtencion,
	});

	return resp.data.data;
};

const traerObsP = async dataGlobal => {
	const resp = await httpClient.post(`/obs/procedimiento`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codLocal: dataGlobal.codLocal,
		numAtendMed: dataGlobal.nroAtencion,
	});

	return resp.data.data;
};

const traerObsLaboratorio = async dataGlobal => {
	const resp = await httpClient.post(`/obs/laboratorio`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codLocal: dataGlobal.codLocal,
		numAtendMed: dataGlobal.nroAtencion,
	});

	return resp.data.data;
};

const traerObsImagen = async dataGlobal => {
	const resp = await httpClient.post(`/obs/imagenes`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codLocal: dataGlobal.codLocal,
		numAtendMed: dataGlobal.nroAtencion,
	});

	return resp.data.data;
};

export const traerAntecedentesPaneles = async dataGlobal => {
	const resp = await httpClient.post(`/antecedentes/paneles`, {
		codGrupoCia: dataGlobal.codGrupoCia,
		codLocal: dataGlobal.codLocal,
		codPaciente: dataGlobal.codPaciente,
		codSecuencia: dataGlobal.secuenciaAntecedente,
		nroAtencion: dataGlobal.nroAtencion,
	});

	if (resp.data.data !== undefined) {
		console.log('RESPUESTA PANELESSSSSSSSSSSSSSSSS', resp.data.data);
		const filtrosFisilogicos = removeDuplicates(resp.data.data, 'COD_TIPO_FISIO');
		console.log('filtrosFisilogicos:', filtrosFisilogicos);
		const abc = filtrosFisilogicos.map(filtros => ({
			COD_TIPO_FISIO: filtros.COD_TIPO_FISIO,
			DESC_FISIO: filtros.DESC_FISIO,
		}));

		if (abc[0].COD_TIPO_FISIO !== null) {
			store.dispatch(setFisiologicos(abc));
		}
	}
};

export const getListaIgnorados = async () => {
	const { data } = await httpClient.post('/consulta/getListaIgnorados');
	console.log('AVER:', data);
	if (data.success) {
		store.dispatch(setFiltroEspecialidad(data.data));
	}
	return data;
};

export const getExamenesLaboratorio = async datos => {
	const { data } = await httpClient.post('/consulta/getExamenesLaboratorio', {
		codGrupoCia: datos.codGrupoCia,
		fechaInicio: datos.fechaInicio,
		fechaFin: datos.fechaFin,
		dni: datos.dni,
		paciente: datos.paciente,
		cmp: datos.cmp,
	});

	return data;
};

export const getComboEspecialidades = async datos => {
	const { data } = await httpClient.post('/admin/getEspecialidades', {
		codGrupoCia: datos.codGrupoCia,
		codLocal: datos.codLocal,
		codMedico: datos.codMedico,
	});

	return data;
};

// ---------------------------- LUIS GRABADO -----------------------------------
//Separar funciones Pestañas.

export const consultaMedicaGeneral = dataGlobal => {
	examenFisico(dataGlobal);
	traerEvolucionTratamiento(dataGlobal); //edited
	tratamiento(dataGlobal);
	consultasProcedimiento(dataGlobal);
	traerInterconsulta(dataGlobal); //edited
	imagenes(dataGlobal);
	laboratorio(dataGlobal);
};

export const consultaOdontologica = dataGlobal => {
	examenFisico(dataGlobal);
	traerEstematologico(dataGlobal); //edited
	traerEvolucionTratamientoOdonto(dataGlobal); //edited
	tratamiento(dataGlobal);
	consultasProcedimiento(dataGlobal);
	traerInterconsulta(dataGlobal); //edited
	imagenes(dataGlobal);
	laboratorio(dataGlobal);
};

export const consultaProcedimental = dataGlobal => {
	desarrolloProcedimientos(dataGlobal); //edited
	consultasProcedimiento(dataGlobal);
	tratamiento(dataGlobal);
	imagenes(dataGlobal);
	laboratorio(dataGlobal);
};
