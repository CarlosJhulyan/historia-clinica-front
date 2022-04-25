import { types } from '../../types/types';

const enfermedadActual = {
	motivoConsulta: '',
	curso: '',
	tipoInformante: '',
	tiempoEnfermedad: '',
	relatoCronologico: '',
	apetito: '',
	sueno: '',
	deposicion: '',
	sed: '',
	orina: '',
};

export const enfermedadActualReducer = (state = enfermedadActual, action) => {
	switch (action.type) {
		case types.setEnfermedadActual:
			return action.payload;

		case types.limpiarEnfermedadActual:
			return {
				motivoConsulta: '',
				curso: '',
				tipoInformante: '',
				tiempoEnfermedad: '',
				relatoCronologico: '',
				apetito: '',
				sueno: '',
				deposicion: '',
				sed: '',
				orina: '',
			};

		default:
			return state;
	}
};
