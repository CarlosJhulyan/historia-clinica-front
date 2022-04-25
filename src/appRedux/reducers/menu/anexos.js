import { types } from '../../types/types';

const anexos = {
	tipo: 'local',
	data: [],
};

export const anexoReducer = (state = anexos, action) => {
	switch (action.type) {
		case types.setAnexosAction:
			return action.payload;

		case types.setTipoAnexo:
			return {
				...state,
				tipo: action.payload,
			};

		case types.limpiarAnexo:
			return {
				...state,
				data: [],
			};
		default:
			return state;
	}
};
