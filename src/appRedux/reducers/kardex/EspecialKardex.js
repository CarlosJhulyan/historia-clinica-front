import { types } from '../../types/types';

//Especiales
const especial = [];
export const especialKardexReducer = (state = especial, action) => {
	switch (action.type) {
		case types.setEspecialKardex:
			return action.payload;

		case types.limpiarEspecialKardex:
			return [];

		default:
			return state;
	}
};
