import moment from 'moment';
import { types } from '../../types/types';
const fechaActual = moment().format('YYYY-MM-DD HH:mm:ss');

const initialState = {
	fecha: fechaActual,
	cara: '',
	cuello: '',
	piel: '',
	ganglios: '',
	atm: '',
	labios: '',
	carrillos: '',
	fondo_surco: '',
	periodonto: '',
	zona_retromolar: '',
	saliva: '',
	glandulas_salivales: '',
	lengua: '',
	paladar_duro: '',
	paladar_blando: '',
	piso_boca: '',
	orofaringe: '',
	indice_higiene_oral: '',
	hendidura_gingival: '',
	vitalidad_palpar: '',
	odusion: '',
	guia_anterior: '',
	interferencias: '',
	contacto_prematuro: '',
	rebordes_alveolare: '',
	tuberosidades: '',
};

export const examenClinicoReducer = (state = initialState, action) => {
	switch (action.type) {

		case types.setEstomatologico:
			return action.payload;

		case types.limpiarExamenClinico:
			return initialState;

		default:
			return state;
	}
};
