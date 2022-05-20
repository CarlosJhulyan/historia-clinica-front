import { types } from '../../types/types';

export const setExamenKardex = objData => {
	return {
		type: types.setExamenKardex,
		payload: objData,
	};
};

export const limpiarExamenKardex = () => {
	return {
		type: types.limpiarExamenKardex,
	};
};
