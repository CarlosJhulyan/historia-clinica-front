import { types } from '../../types/types';

export const setAnexosAction = (objData) => {
	console.log('Set Anexos: ', objData);
	return {
		type: types.setAnexosAction,
		payload: objData,
	};
};

export const setTipoAnexo = (objData) => {
	return {
		type: types.setTipoAnexo,
		payload: objData,
	};
};

export const limpiarAnexo = () => {
	return {
		type: types.limpiarAnexo,
	};
};





