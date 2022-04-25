import React from 'react';
import { Route, Switch } from 'react-router-dom';
import asyncComponent from 'util/asyncComponent';
import AsignacionCamas from './asignacionCamas';
import BalanceHidrico from './balanceHidrico';
import HistorialBalanceHidrico from './historialBalanceHidrico';

import AsignacionModulos from './configuraciones/asignacionModulos';
import ConfiguracionCamas from './configuraciones/camas';
import ConfiguracionFirmas from './configuraciones/firma';
import listaPaciente from './listaPaciente';
import registroPaciente from './registroPaciente';
import listaHospitalizar from './listaHospitalizar';
import SignosVitales from './signosVitales';
import { PruebaOdontograma } from './odontograma';
import { SeguimientoConsulta } from './seguimientoConsulta';
import HistorialSignosVitales from './historialSignosVitales';
import TecnicoBalanceHidrico from './tecnicoBalanceHidrico';
import ReporteIncompletos from './reportes/reporteIncompletos';
import TratamientoKardex from './tratamientoKardex';
import ReporteEspecialidad from './reportes/reporteEspecialidad';
import Ingreso from './evolucionEnfermeria/ingreso';
import Historial from './evolucionEnfermeria/historial';

const App = ({ match }) => {
	const token = JSON.parse(localStorage.getItem('token'));

	const generateRoute = token => {
		const items = [];

		items.push(<Route path={`${match.url}historialEvolucionEnfermeria`} component={Historial} />)
		items.push(<Route path={`${match.url}ingresoEvolucionEnfermeria`} component={Ingreso} />)
		items.push(<Route path={`${match.url}registroPaciente`} component={registroPaciente} />);

		if (token.modulos.length > 0) {
			if (token.modulos.includes('1')) {
				items.push(<Route path={`${match.url}listaPaciente`} component={listaPaciente} />);
			}
			if (token.modulos.includes('2')) {
				items.push(
					<Route path={`${match.url}seguimientoConsulta`} component={SeguimientoConsulta} />
				);
			}
			if (token.modulos.includes('3')) {
				items.push(<Route path={`${match.url}asignacionCamas`} component={AsignacionCamas} />);
			}
			if (token.modulos.includes('4')) {
				items.push(
					<Route path={`${match.url}configuraciones/modulos`} component={AsignacionModulos} />
				);
				items.push(
					<Route path={`${match.url}configuraciones/camas`} component={ConfiguracionCamas} />
				);
				items.push(
					<Route path={`${match.url}configuraciones/firmas`} component={ConfiguracionFirmas} />
				);
			}
			if (token.modulos.includes('5')) {
				items.push(<Route path={`${match.url}listaHospitalizar`} component={listaHospitalizar} />);
			}
			if (token.modulos.includes('6')) {
				items.push(<Route path={`${match.url}signosVitales`} component={SignosVitales} />);
			}
			if (token.modulos.includes('7')) {
				items.push(
					<Route path={`${match.url}historialSignosVitales`} component={HistorialSignosVitales} />
				);
			}
			if (token.modulos.includes('8')) {
				items.push(<Route path={`${match.url}balanceHidrico`} component={BalanceHidrico} />);
			}
			if (token.modulos.includes('9')) {
				items.push(
					<Route path={`${match.url}historialBalanceHidrico`} component={HistorialBalanceHidrico} />
				);
			}
			if (token.modulos.includes('10')) {
				items.push(
					<Route path={`${match.url}tecnico/balanceHidrico`} component={TecnicoBalanceHidrico} />
				);
			}
			if (token.modulos.includes('11')) {
				items.push(
					<Route path={`${match.url}reportes/incompleto`} component={ReporteIncompletos} />
				);
			}
			if (token.modulos.includes('12')) {
				items.push(<Route path={`${match.url}tratamientoKardex`} component={TratamientoKardex} />);
			}
			if (token.modulos.includes('13')) {
				items.push(
					<Route path={`${match.url}reportes/especialidad`} component={ReporteEspecialidad} />
				);
			}
		} else {
		}

		return items;
	};

	const rutas = generateRoute(token);

	return (
		<div className="gx-main-content-wrapper">
			<Switch>
				{/* ---------------- DAVID ------------------- */}
				{rutas.map(item => item)}
			</Switch>
		</div>
	);
};

export default App;
