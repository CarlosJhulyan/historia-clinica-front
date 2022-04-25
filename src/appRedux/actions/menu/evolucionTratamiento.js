import { types } from '../../types/types';

export const getEvolucionTratamiento = (objData) => {
	return {
		type: types.getEvolucionTratamiento,
		payload: objData,
	};
};
export const setEvolucionTratamiento = (objData) => {
	console.log('Set Evolucion Tratamiento: ', objData);
	return {
		type: types.setEvolucionTratamiento,
		payload: objData,
	};
};



export const setRegistrosEvolucion = (objData) => {
	return {
		type: types.setRegistrosEvolucion,
		payload: objData,
	};
};


export const limpiarEvolucionTratamiento = () => {
	return {
		type: types.limpiarEvolucionTratamiento,
	};
};

export const limpiarRegistrosEvolucion = () => {
	return {
		type: types.limpiarRegistrosEvolucion,
	};
}
