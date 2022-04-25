import { types } from '../../types/types';

const diagnostico = [];

export const diagnosticoKardexReducer = (state = diagnostico, action) => {
	switch (action.type) {
		case types.setDiagnosticoActionKardex:
			return action.payload;

		case types.limpiarDiagnosticoActionKardex:
			return [];

		default:
			return state;
	}
};
