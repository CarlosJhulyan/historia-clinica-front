import { types } from '../../types/types';

export const setDiagnosticoActionKardex = objData => {
	return {
		type: types.setDiagnosticoActionKardex,
		payload: objData,
	};
};

export const limpiarDiagnosticoActionKardex = () => {
	return {
		type: types.limpiarDiagnosticoActionKardex,
	};
};
