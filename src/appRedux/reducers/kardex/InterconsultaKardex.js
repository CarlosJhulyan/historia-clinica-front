import { types } from '../../types/types';

//Interconsulta
const interconsulta = [];
export const interconsultaKardexReducer = (state = interconsulta, action) => {
	switch (action.type) {
		case types.setInterconsultaKardex:
			return action.payload;

		case types.limpiarInterconsultaKardex:
			return [];

		default:
			return state;
	}
};
