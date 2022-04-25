import { types } from '../../types/types';

///////////////////////////////////////////////////////////////////////////////////

const triaje = {
	pa_1: '',
	pa_2: '',
	fr: '',
	fc: '',
	temp: '',
	satoxigeno: '',
	peso: '',
	talla: '',
	imc: '',
};

export const funcionVitalReducer = (state = triaje, action) => {
	switch (action.type) {

		case types.setFuncionesVitales:
			return action.payload;

		case types.limpiarFuncionesVitales:
			return triaje;

		default:
			return state;
	}
};

///////////////////////////////////////////////////////////////////////////////////

const estadoFisico = {
	estadoGeneral: '',
	estadoConciencia: '',
	examenFisico: '',
	imc: '',
	medCintura: '',
};

export const estadoFisicoReducer = (state = estadoFisico, action) => {
	switch (action.type) {

		case types.setEstadoFisico:
			return action.payload;


		case types.limpiarEstadoFisico:
			return {
				estadoGeneral: '',
				estadoConciencia: '',
				examenFisico: '',
				imc: '',
				medCintura: '',
			};

		default:
			return state;
	}
};
