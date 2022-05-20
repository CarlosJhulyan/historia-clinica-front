import { types } from '../../types/types';

export const setEspecialKardex = objData => {
	return {
		type: types.setEspecialKardex,
		payload: objData,
	};
};

export const limpiarEspecialKardex = () => {
	return {
		type: types.limpiarEspecialKardex,
	};
};
