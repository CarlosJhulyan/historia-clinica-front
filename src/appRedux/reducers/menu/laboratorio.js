import { types } from '../../types/types';

const laboratorio = {
	dataProcedimiento: [],
	recomendacion: '',
};

export const laboratorioReducer = (state = laboratorio, action) => {
	switch (action.type) {
		case types.setLaboratorioAction:
			return action.payload;

		case types.limpiarLaboratorio:
			return {
				...state,
				dataProcedimiento: [],
				recomendacion: '',
			};

		default:
			return state;
	}
};
