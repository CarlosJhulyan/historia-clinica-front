import moment from 'moment';
import { types } from '../../types/types';
const fechaActual = moment().format('YYYY-MM-DD HH:mm:ss');

/* const evolucionTratamiento = {
	FECHA: fechaActual,
	PLAN: '',
	DESCRIPCION: '',
}; */

const evolucionTratamiento = [];

export const evolucionTratamientoReducer = (state = evolucionTratamiento, action) => {
	switch (action.type) {
		case types.setEvolucionTratamiento:
			return action.payload;

		case types.limpiarEvolucionTratamiento:
			return [];

		default:
			return state;
	}
};

const registrosEvolucion = [];

export const registrosEvolucionReducer = (state = registrosEvolucion, { type, payload }) => {
	switch (type) {
		case types.setRegistrosEvolucion:
			return payload;

		case types.limpiarRegistrosEvolucion:
			return [];

		default:
			return state;
	}
};
