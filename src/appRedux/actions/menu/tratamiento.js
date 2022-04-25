import { types } from '../../types/types';

export const setTratamientoCabeceraDetalle = (objData) => {
	return {
		type: types.setTratamientoCabeceraDetalle,
		payload: objData,
	};
};

export const setTratamiento = (objData) => {
	return {
		type: types.setTratamiento,
		payload: objData,
	};
};

export const setCabeceraReceta = (objData) => {
	return {
		type: types.setCabeceraReceta,
		payload: objData,
	};
};



export const limpiarTratamientoCabeceraDetalle = () => {
	return {
		type: types.limpiarTratamientoCabeceraDetalle,
	};
};

export const limpiarTratamientoReducer = () => {
	return {
		type: types.limpiarTratamientoReducer,
	};
};

export const limpiarCabeceraReceta = () => {
	return {
		type: types.limpiarCabeceraReceta,
	};
}
