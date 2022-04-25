import { types } from '../../types/types';

export const getEnfermedadActual = (objData) => {
	return {
		type: types.getEnfermedadActual,
		payload: objData,
	};
};
export const setEnfermedadActual = (objData) => {
	return {
		type: types.setEnfermedadActual,
		payload: objData,
	};
};

export const limpiarEnfermedadActual = () => {
	return {
		type: types.limpiarEnfermedadActual,
	};
}
