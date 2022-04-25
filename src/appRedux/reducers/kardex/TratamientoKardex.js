import { types } from '../../types/types';

//Cabecera Detalle
const tratamientoCabeceraDetalle = [];
export const cabeceraKardexReducer = (state = tratamientoCabeceraDetalle, action) => {
	switch (action.type) {
		case types.setTratamientoCabeceraDetalleKardex:
			return action.payload;

		case types.limpiarTratamientoCabeceraDetalleKardex:
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
export const tratamientoKardexReducer = (state = tratamiento, action) => {
	switch (action.type) {
		case types.setTratamientoKardex:
			return action.payload;

		case types.limpiarTratamientoReducerKardex:
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
export const cabeceraRecetaKardexReducer = (state = cabeceraReceta, action) => {
	switch (action.type) {
		case types.setCabeceraRecetaKardex:
			return action.payload;

		case types.limpiarCabeceraRecetaKardex:
			return {
				cantitems: 0,
				fechavigencia: '',
			};

		default:
			return state;
	}
};
