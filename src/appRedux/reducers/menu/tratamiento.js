import { types } from '../../types/types';


//Cabecera Detalle
const tratamientoCabeceraDetalle = [];
export const cabeceraReducer = (state = tratamientoCabeceraDetalle, action) => {
	switch (action.type) {
		case types.setTratamientoCabeceraDetalle:
			return action.payload;

		case types.limpiarTratamientoCabeceraDetalle:
			return [];

		default:
			return state;
	}
};

//Tratamiento
const tratamiento = {
	indicacionesgen: '',
	validezreceta: '',
};
export const tratamientoReducer = (state = tratamiento, action) => {
	switch (action.type) {
		case types.setTratamiento:
			return action.payload;

		case types.limpiarTratamientoReducer:
			return {
				indicacionesgen: '',
				validezreceta: '',
			};

		default:
			return state;
	}
};

//Cabecera Receta
const cabeceraReceta = {
	cantitems: 0,
	fechavigencia: '',
};
export const cabeceraRecetaReducer = (state = cabeceraReceta, action) => {
	switch (action.type) {
		case types.setCabeceraReceta:
			return action.payload;

		case types.limpiarCabeceraReceta:
			return {
				cantitems: 0,
				fechavigencia: '',
			};

		default:
			return state;
	}
};
