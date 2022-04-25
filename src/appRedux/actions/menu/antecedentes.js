import { types } from '../../types/types';

// Antecedentes Generales

export const setGeneralesMedicamentos = (objData) => {
	return {
		type: types.setGeneralesMedicamentos,
		payload: objData,
	};
};
export const setGeneralesRam = (objData) => {
	return {
		type: types.setGeneralesRam,
		payload: objData,
	};
};


export const setGeneralesOcupacionales = (objData) => {
	return {
		type: types.setGeneralesOcupacionales,
		payload: objData,
	};
};

export const setHabitosNocivos = (objData) => {
	return {
		type: types.setHabitosNocivos,
		payload: objData,
	};
};

export const limpiarAntecedentesGenerales = () => {
	return {
		type: types.limpiarAntecedentesGenerales,
	};
};

// Antecedentes Fisiologicos

export const setFisiologicosPrenatales = (objData) => {
	return {
		type: types.setFisiologicosPrenatales,
		payload: objData,
	};
};
export const setFisiologicosParto = (objData) => {
	return {
		type: types.setFisiologicosParto,
		payload: objData,
	};
};
export const setFisiologicosInmunizaciones = (objData) => {
	return {
		type: types.setFisiologicosInmunizaciones,
		payload: objData,
	};
};
export const setFisiologicosOtrosPrenatales = (objData) => {
	return {
		type: types.setFisiologicosOtrosPrenatales,
		payload: objData,
	};
};
export const setFisiologicosOtrosInmunizaciones = (objData) => {
	return {
		type: types.setFisiologicosOtrosInmunizaciones,
		payload: objData,
	};
};

export const limpiarAntecedentesFisiologicos = () => {
	return {
		type: types.limpiarAntecedentesFisiologicos,
	};
};

// Antecedentes Ginecologicos
export const setGMenarquia = (objData) => {
	return {
		type: types.setGMenarquia,
		payload: objData,
	};
};
export const setGReglaRegular = (objData) => {
	return {
		type: types.setGReglaRegular,
		payload: objData,
	};
};
export const setGRcMenstruacion = (objData) => {
	return {
		type: types.setGRcMenstruacion,
		payload: objData,
	};
};
export const setGCicloMenstruacion = (objData) => {
	return {
		type: types.setGCicloMenstruacion,
		payload: objData,
	};
};
export const setGRS = (objData) => {
	return {
		type: types.setGRS,
		payload: objData,
	};
};
export const setGFechaFur = (objData) => {
	return {
		type: types.setGFechaFur,
		payload: objData,
	};
};
export const setGFechaFpp = (objData) => {
	return {
		type: types.setGFechaFpp,
		payload: objData,
	};
};
export const setGDisminorrea = (objData) => {
	return {
		type: types.setGDisminorrea,
		payload: objData,
	};
};
export const setGNroGestacion = (objData) => {
	return {
		type: types.setGNroGestacion,
		payload: objData,
	};
};
export const setGFechaFup = (objData) => {
	return {
		type: types.setGFechaFup,
		payload: objData,
	};
};
export const setGPariedad = (objData) => {
	return {
		type: types.setGPariedad,
		payload: objData,
	};
};
export const setGNroCesareas = (objData) => {
	return {
		type: types.setGNroCesareas,
		payload: objData,
	};
};
export const setGPap = (objData) => {
	return {
		type: types.setGPap,
		payload: objData,
	};
};
export const setGMamografia = (objData) => {
	return {
		type: types.setGMamografia,
		payload: objData,
	};
};
export const setGMac = (objData) => {
	return {
		type: types.setGMac,
		payload: objData,
	};
};
export const setGOtros = (objData) => {
	return {
		type: types.setGOtros,
		payload: objData,
	};
};

export const limpiarAntecedentesGineco = () => {
	return {
		type: types.limpiarAntecedentesGineco,
	};
};

// Antecedentes Patologicos

export const setAntecedentesPatologicos = (objData) => {
	return {
		type: types.setAntecedentesPatologicos,
		payload: objData,
	};
};

export const setAntecedentesPatologicosFamiliares = (objData) => {
	return {
		type: types.setAntecedentesPatologicosFamiliares,
		payload: objData,
	};
};

export const limpiarAntecedentesPatologicos = () => {
	return {
		type: types.limpiarAntecedentesPatologicos,
	};
};

export const limpiarAntecedentesPatologicosFamiliares = () => {
	return {
		type: types.limpiarAntecedentesPatologicosFamiliares,
	};
};


// Antecedentes Otros
export const setOtros = (objData) => {
	return {
		type: types.setOtros,
		payload: objData,
	};
};

export const limpiarOtros = () => {
	return {
		type: types.limpiarOtros,
	};
}

