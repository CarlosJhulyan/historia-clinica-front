import { types } from '../types/types';

// const Diente = new DienteAdulto();
const initialState = { diente: '', actual: '', estadoOdontograma: 'evolutivo' };

const DientePruebaReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case types.actualizar_diente:
			return {
				...state,
				diente: payload,
			};

		case types.diente_actual:
			return {
				...state,
				actual: payload,
			};

		case types.setEstadoOdonotograma:
			return {
				...state,
				estadoOdontograma: payload,
			};
		default:
			return state;
	}
};

export default DientePruebaReducer;
