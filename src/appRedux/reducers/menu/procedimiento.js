import { types } from '../../types/types';

const consultasProcedimientos = {
	dataProcedimiento: [
		// {
		//     COD_PROD: '',
		//     DESC_PROD: '',
		//     NOM_LAB: '',
		//     RUC: '',
		//     key: '',
		// }
	],
	recomendacion: '',
};

export const procedimientoReducer = (state = consultasProcedimientos, action) => {
	switch (action.type) {
		case types.setConsultasProcedimientos:
			return action.payload;

		case types.limpiarProcedimientoReducer:
			return {
				dataProcedimiento: [],
				recomendacion: '',
			};

		default:
			return state;
	}
};

const procedimientosInterconsultas = {
	dataProcedimiento: [],
	recomendacion: '',
};

export const procedimientoInterconsultaReducer = (state = procedimientosInterconsultas, action) => {
	switch (action.type) {
		case types.setInterconsultasProcedimientos:
			return action.payload;

		case types.limpiarProcedimientoInterconsultaReducer:
			return {
				dataProcedimiento: [],
				recomendacion: '',
			};
		default:
			return state;
	}
};
