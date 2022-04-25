import { types } from '../../types/types';

const imagenes = {
	dataProcedimiento: [],
	recomendacion: '',
};

export const imagenesReducer = (state = imagenes, action) => {
	switch (action.type) {

		case types.setImagenesAction:
			return action.payload;

		case types.limpiarImagenes:
			return {
				...state,
				dataProcedimiento: [],
				recomendacion: '',
			};

		default:
			return state;
	}
};
