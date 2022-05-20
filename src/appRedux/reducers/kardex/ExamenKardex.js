import { types } from '../../types/types';

//Examen
const examen = [];
export const examenKardexReducer = (state = examen, action) => {
	switch (action.type) {
		case types.setExamenKardex:
			return action.payload;

		case types.limpiarExamenKardex:
			return [];

		default:
			return state;
	}
};
