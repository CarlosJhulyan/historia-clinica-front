import { types } from '../../types/types';

export const setTratamientoCabeceraDetalleKardex = objData => {
	return {
		type: types.setTratamientoCabeceraDetalleKardex,
		payload: objData,
	};
};

export const setTratamientoKardex = objData => {
	return {
		type: types.setTratamientoKardex,
		payload: objData,
	};
};

export const setCabeceraRecetaKardex = objData => {
	return {
		type: types.setCabeceraRecetaKardex,
		payload: objData,
	};
};

export const limpiarTratamientoCabeceraDetalleKardex = () => {
	return {
		type: types.limpiarTratamientoCabeceraDetalleKardex,
	};
};

export const limpiarTratamientoReducerKardex = () => {
	return {
		type: types.limpiarTratamientoReducerKardex,
	};
};

export const limpiarCabeceraRecetaKardex = () => {
	return {
		type: types.limpiarCabeceraRecetaKardex,
	};
};
