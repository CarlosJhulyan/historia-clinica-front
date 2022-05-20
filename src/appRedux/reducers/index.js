import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import Settings from './Settings';
import Common from './Common';
import Menu from './Menu';
import DientePrueba from './DientePrueba';
import { anexoReducer } from './menu/anexos';
import { desarrolloReducer } from './menu/desarrollo';
import { diagnosticoReducer } from './menu/diagnostico';
import { enfermedadActualReducer } from './menu/enfermedadActual';
import {
	evolucionTratamientoReducer,
	registrosEvolucionReducer,
} from './menu/evolucionTratamiento';
import { examenClinicoReducer } from './menu/examenClinico';
import { estadoFisicoReducer, funcionVitalReducer } from './menu/examenFisico';
import { imagenesReducer } from './menu/imagenes';
import { laboratorioReducer } from './menu/laboratorio';
import { procedimientoInterconsultaReducer, procedimientoReducer } from './menu/procedimiento';
import { cabeceraReducer, tratamientoReducer, cabeceraRecetaReducer } from './menu/tratamiento';
import { combosReducer } from './menu/combos';
import {
	antecedentesFisiologicos,
	antecedentesGenerales,
	antecedentesGineco,
	antecedentesOtros,
	antecedentesPatologicos,
	antecedentesPatologicosFamiliares,
} from './menu/antecedentes';
import { pestañasReducer } from './menu/pestañas';
import { opacityReducer } from './Opacity';
import { fisiologicosReducer } from './menu/fisiologicos';
import {
	evolucionTratamientoOdontoReducer,
	registrosEvolucionOdontoReducer,
} from './menu/evolucionTratamientoOdonto';
import { sugerenciaReducer } from './menu/sugerencias';
import { dataGlobalReducer } from './dataGlobal';
import { HelpersReducer } from './menu/helpers';
import UiReducer from './ui';

import {
	cabeceraKardexReducer,
	cabeceraRecetaKardexReducer,
	tratamientoKardexReducer,
} from './kardex/TratamientoKardex';
import { diagnosticoKardexReducer } from './kardex/DiagnosticoKardex';
import { examenKardexReducer } from './kardex/ExamenKardex';
import { interconsultaKardexReducer } from './kardex/InterconsultaKardex';
import { especialKardexReducer } from './kardex/EspecialKardex';

const createRootReducer = history =>
	combineReducers({
		router: connectRouter(history),
		settings: Settings,
		common: Common,
		menu: Menu,
		dientePrueba: DientePrueba,
		anexo: anexoReducer,
		desarrollo: desarrolloReducer,
		diagnostico: diagnosticoReducer,
		enfermedadActual: enfermedadActualReducer,
		evolucionTratamiento: evolucionTratamientoReducer,
		registrosEvolucion: registrosEvolucionReducer,
		examenClinico: examenClinicoReducer,
		//EVOLUCION TRATAMIENTO ODONTO
		evolucionTratamientoOdonto: evolucionTratamientoOdontoReducer,
		registrosEvolucionOdonto: registrosEvolucionOdontoReducer,
		// ANTECEDENTES
		antecedentesGenerales: antecedentesGenerales,
		antecedentesFisiologicos: antecedentesFisiologicos,
		antecedentesGineco: antecedentesGineco,
		antecedentesPatologicos: antecedentesPatologicos,
		antecedentesPatologicosFamiliares: antecedentesPatologicosFamiliares,
		antecedentesOtros: antecedentesOtros,
		//--------------
		estadoFisico: estadoFisicoReducer,
		funcionVital: funcionVitalReducer,
		imagenes: imagenesReducer,
		laboratorio: laboratorioReducer,
		procedimientoReducer: procedimientoReducer,
		procedimientoInterconsulta: procedimientoInterconsultaReducer,
		//Tratamiento
		tratamientoDetalle: cabeceraReducer,
		tratamientoCabeceraReceta: cabeceraRecetaReducer,
		tratamiento: tratamientoReducer,
		//--------
		combosReducer: combosReducer,
		pestañasReducer: pestañasReducer,
		opacity: opacityReducer,

		fisiologicosReducer: fisiologicosReducer,
		sugerenciaReducer: sugerenciaReducer,

		dataGlobal: dataGlobalReducer,
		helpers: HelpersReducer,

		//
		ui: UiReducer,
		//Kardex

		kardexTratamientoDetalle: cabeceraKardexReducer,
		kardexTratamientoCabeceraReceta: cabeceraRecetaKardexReducer,
		kardexTratamiento: tratamientoKardexReducer,
		kardexDiagnostico: diagnosticoKardexReducer,
		kardexExamen: examenKardexReducer,
		kardexInterconsulta: interconsultaKardexReducer,
		kardexEspeciales: especialKardexReducer,
	});

export default createRootReducer;
