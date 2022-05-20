import { types } from '../../types/types';

export const setInterconsultaKardex = objData => {
	return {
		type: types.setInterconsultaKardex,
		payload: objData,
	};
};

export const limpiarInterconsultaKardex = () => {
	return {
		type: types.limpiarInterconsultaKardex,
	};
};
