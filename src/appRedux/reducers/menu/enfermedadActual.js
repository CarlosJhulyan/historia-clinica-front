import { types } from '../../types/types';

const enfermedadActual = {
	motivoConsulta: '',
	curso: '',
	tipoInformante: '',
	tiempoEnfermedad: '',
	relatoCronologico: '',
	apetito: 'N',
	sueno: 'N',
	deposicion: 'N',
	sed: 'N',
	orina: 'N',
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
				apetito: 'N',
				sueno: 'N',
				deposicion: 'N',
				sed: 'N',
				orina: 'N',
			};


		default:
			return state;
	}
};
