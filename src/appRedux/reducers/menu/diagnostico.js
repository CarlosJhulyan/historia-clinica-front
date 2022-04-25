import { types } from '../../types/types';

/* const diagnostico = [
	{
		cie: '',
		coddiagnostico: '',
		diagnostico: '',
		secuencia: '',
		tipodiagnostico: '',
	},
];
 */
const diagnostico = [];

export const diagnosticoReducer = (state = diagnostico, action) => {
	switch (action.type) {
		
		case types.setDiagnosticoAction:
			return action.payload;

		case types.limpiarDiagnosticoAction:
			return [];

		default:
			return state;
	}
};
