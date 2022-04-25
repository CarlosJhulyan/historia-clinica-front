import { types } from '../../types/types';

///////////////////////////////////////////

export const setFuncionesVitales = (objData) => {
	console.log('Set Vitales: ', objData);
	return {
		type: types.setFuncionesVitales,
		payload: objData,
	};
};

export const limpiarFuncionesVitales = () => {
	return {
		type: types.limpiarFuncionesVitales,
	};
};

///////////////////////////////////////////

export const setEstadoFisico = (objData) => {
	return {
		type: types.setEstadoFisico,
		payload: objData,
	};
};

export const limpiarEstadoFisico = () => {
	return {
		type: types.limpiarEstadoFisico,
	};
}
