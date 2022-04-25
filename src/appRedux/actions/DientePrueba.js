import { types } from '../types/types';

export const actualizar_diente = (objDiente) => {
	return {
		type: types.actualizar_diente,
		payload: objDiente,
	};
};

export const actualizar_actual = (actual) => {
	return {
		type: types.diente_actual,
		payload: actual,
	};
};

export const setEstadoOdonotograma = (obj) => {
	return {
		type: types.setEstadoOdonotograma,
		payload: obj,
	};
};
