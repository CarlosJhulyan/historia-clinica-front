import moment from 'moment';
import { types } from '../../types/types';

//const fechaActual = moment().format('YYYY-MM-DD HH:mm:ss');
const fechaActual = moment().format('DD-MM-YYYY');

// Antecedentes Generales

const generales = {
	medicamentos: '', // SI
	ram: '', // SI
	ocupacionales: '',
	habitos: [], // SI
};

export const antecedentesGenerales = (state = generales, action) => {
	switch (action.type) {
		case types.setGeneralesMedicamentos:
			return {
				...state,
				medicamentos: action.payload,
			};

		case types.setGeneralesRam:
			return {
				...state,
				ram: action.payload,
			};


		case types.setGeneralesOcupacionales:
			return {
				...state,
				ocupacionales: action.payload,
			};

		case types.setHabitosNocivos:
			return {
				...state,
				habitos: action.payload,
			};

		case types.limpiarAntecedentesGenerales:
			return {
				...state,
				medicamentos: '',
				ram: '',
				ocupacionales: '',
				habitos: [],
			};

		default:
			return state;
	}
};

// Antecedentes Fisiologicos

const fisiologicos = {
	prenatales: [], //NO
	parto: "", // NO
	inmunizaciones: [], // NO
	otrosPrenatales: '', // NO
	otrosInmunizaciones: '', // NO
};

export const antecedentesFisiologicos = (state = fisiologicos, action) => {
	switch (action.type) {
		case types.setFisiologicosPrenatales:
			return {
				...state,
				prenatales: action.payload,
			};

		case types.setFisiologicosParto:
			return {
				...state,
				parto: action.payload,
			};

		case types.setFisiologicosInmunizaciones:
			return {
				...state,
				inmunizaciones: action.payload,
			};

		case types.setFisiologicosOtrosPrenatales:
			return {
				...state,
				otrosPrenatales: action.payload,
			};

		case types.setFisiologicosOtrosInmunizaciones:
			return {
				...state,
				otrosInmunizaciones: action.payload,
			};

		case types.limpiarAntecedentesFisiologicos:
			return {
				...state,
				prenatales: [],
				parto: [],
				inmunizaciones: [],
				otrosPrenatales: '',
				otrosInmunizaciones: '',
			};

		default:
			return state;
	}
};

// Antecedentes Ginecologicos
const ginecologicos = {
	edadMenarquia: '', //SI
	indReglaRegular: 'N', //SI
	rcMenstruacion: '', //  SI
	cicloMenstruacion: '', // SI
	rs: '', // SI
	fechaFur: '', // SI
	fechaFpp: '', // SI
	disminorrea: 'N', // SI
	nroGestaciones: '', // SI
	fechaFup: '', // SI
	pariedad: '', // SI
	nroCesareas: '', // SI
	pap: '', // SI
	mamografia: '', // SI
	mac: '', // SI
	otros: '', // SI
};

export const antecedentesGineco = (state = ginecologicos, action) => {
	switch (action.type) {
		case types.setGMenarquia:
			return {
				...state,
				edadMenarquia: action.payload,
			};

		case types.setGReglaRegular:
			return {
				...state,
				indReglaRegular: action.payload,
			};

		case types.setGRcMenstruacion:
			return {
				...state,
				rcMenstruacion: action.payload,
			};

		case types.setGCicloMenstruacion:
			return {
				...state,
				cicloMenstruacion: action.payload,
			};

		case types.setGRS:
			return {
				...state,
				rs: action.payload,
			};

		case types.setGFechaFur:
			return {
				...state,
				fechaFur: action.payload,
			};

		case types.setGFechaFpp:
			return {
				...state,
				fechaFpp: action.payload,
			};

		case types.setGDisminorrea:
			return {
				...state,
				disminorrea: action.payload,
			};

		case types.setGNroGestacion:
			return {
				...state,
				nroGestaciones: action.payload,
			};

		case types.setGFechaFup:
			return {
				...state,
				fechaFup: action.payload,
			};

		case types.setGPariedad:
			return {
				...state,
				pariedad: action.payload,
			};

		case types.setGNroCesareas:
			return {
				...state,
				nroCesareas: action.payload,
			};

		case types.setGPap:
			return {
				...state,
				pap: action.payload,
			};

		case types.setGMamografia:
			return {
				...state,
				mamografia: action.payload,
			};

		case types.setGMac:
			return {
				...state,
				mac: action.payload,
			};

		case types.setGOtros:
			return {
				...state,
				otros: action.payload,
			};

		case types.limpiarAntecedentesGineco:
			return {
				...state,
				edadMenarquia: '',
				indReglaRegular: 'N',
				rcMenstruacion: '',
				cicloMenstruacion: '',
				rs: '',
				fechaFur: '',
				fechaFpp: '',
				disminorrea: 'N',
				nroGestaciones: '',
				fechaFup: '',
				pariedad: '',
				nroCesareas: '',
				pap: '',
				mamografia: '',
				mac: '',
				otros: '',
			};


		default:
			return state;
	}
};

// Antecedentes Patologicos

const patologicos = [];
const patologicosFamiliares = [];

export const antecedentesPatologicos = (state = patologicos, action) => {
	switch (action.type) {
		case types.setAntecedentesPatologicos:
			return action.payload;

		case types.limpiarAntecedentesPatologicos:
			return [];

		default:
			return state;
	}
};

export const antecedentesPatologicosFamiliares = (state = patologicosFamiliares, action) => {
	switch (action.type) {
		case types.setAntecedentesPatologicosFamiliares:
			return action.payload;

		case types.limpiarAntecedentesPatologicosFamiliares:
			return [];

		default:
			return state;
	}
};

// Antecedentes Otros
const otros = {
	fecha: fechaActual,
	diabetes: '',
	tuberculosis: '',
	anemia: '',
	fiebre_reumatica: '',
	enfermedad_cardiovascular: '',
	enfermedad_renal: '',
	enfermedad_hepaticas: '',
	reaccion_anormal_local: '',
	reaccion_anormal_drogas: '',
	hemorragias: '',
	alergia_penecilina: '',
	otras: '',
};

export const antecedentesOtros = (state = otros, action) => {
	switch (action.type) {
		case types.setOtros:
			return action.payload;

		case types.limpiarOtros:
			return {
				...state,
				fecha: fechaActual,
				diabetes: 'NO',
				tuberculosis: 'NO',
				anemia: 'NO',
				fiebre_reumatica: 'NO',
				enfermedad_cardiovascular: 'NO',
				enfermedad_renal: 'NO',
				enfermedad_hepaticas: 'NO',
				reaccion_anormal_local: 'NO',
				reaccion_anormal_drogas: 'NO',
				hemorragias: 'NO',
				alergia_penecilina: 'NO',
				otras: 'NO',
			};

		default:
			return state;
	}
};
