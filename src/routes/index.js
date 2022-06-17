import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
// import asyncComponent from 'util/asyncComponent';
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
// import { PruebaOdontograma } from './odontograma';
import { SeguimientoConsulta } from './seguimientoConsulta';
import HistorialSignosVitales from './historialSignosVitales';
import TecnicoBalanceHidrico from './tecnicoBalanceHidrico';
import ReporteIncompletos from './auditoria/reporteIncompletos';
import TratamientoKardex from './tratamientoKardex';
import ReporteEspecialidad from './auditoria/reporteEspecialidad';
import Ingreso from './evolucionEnfermeria/ingreso';
import Historial from './evolucionEnfermeria/historial';
import TomaPreTriaje from './preTriaje/tomaPreTriaje';
import HistoricoPreTriaje from './preTriaje';
import AdmisionConsulta from './admisionConsulta';
import Reporte1 from './reportes/reporte1';
import Reporte2 from './reportes/reporte2';
import Reporte3 from './reportes/reporte3';
import Reporte4 from './reportes/reporte4';
import { Modal } from 'antd';
import { useAuth } from '../authentication';
import { tablasPrincipales } from "../constants/TablasPrincipales";
import { httpClientReports } from '../util/Api';
import GenerarPedido from './posVenta';

const App = ({ match }) => {
	const token = JSON.parse(localStorage.getItem('token'));
	const tokenAdmin = JSON.parse(localStorage.getItem('token-admin'));
	const tokenReports = JSON.parse(localStorage.getItem('token-reports'));
	const [modal, contextHolder] = Modal.useModal();
	const [dataPrincial, setDataPrincial] = useState(false);
	const { userSignOut } = useAuth();

	const traerDataPrincial = async () => {
    const response = await httpClientReports.post("reportes/getTablasPrimarias");
    if (response && response.data && response.data.data) {
      response.data.data.forEach((element) => {
        element.forEach((elemento) => {
          elemento.key =
            elemento.cod_esp || elemento.cod_mes || elemento.cod_tipo;
        });
      });
    }
    tablasPrincipales.TablasPrincipales = response.data.data;
    setDataPrincial(true);
  };

	const generateRoute = token => {
		const items = [];

		if (token && token.modulos?.length > 0) {
			if (token.modulos.includes('1')) {
				items.push(<Route key={1} path={`${match.url}listaPaciente`} component={listaPaciente} />);
			}
			if (token.modulos.includes('2')) {
				items.push(<Route key={2} path={`${match.url}seguimientoConsulta`} component={SeguimientoConsulta} />);
			}
			if (token.modulos.includes('3')) {
				items.push(<Route key={3} path={`${match.url}asignacionCamas`} component={AsignacionCamas} />);
			}
			// if (token.modulos.includes('4')) {
			// 	items.push(
			// 		<Route path={`${match.url}configuraciones/modulos`} component={AsignacionModulos} />
			// 	);
			// 	items.push(
			// 		<Route path={`${match.url}configuraciones/firmas`} component={ConfiguracionFirmas} />
			// 	);
			// }
			// if (token.modulos.includes('15')) {
			// 	items.push(
			// 		<Route path={`${match.url}configuraciones/camas`} component={ConfiguracionCamas} />
			// 	);
			// }
			if (token.modulos.includes('5')) {
				items.push(<Route key={5} path={`${match.url}admisionHospitalaria`} component={listaHospitalizar} />);
			}
			if (token.modulos.includes('8')) {
				items.push(<Route key={8} path={`${match.url}signosVitales`} component={SignosVitales} />);
			}
			if (token.modulos.includes('9')) {
				items.push(<Route key={9} path={`${match.url}historialSignosVitales`} component={HistorialSignosVitales} />);
			}
			if (token.modulos.includes('6')) {
				items.push(<Route key={6} path={`${match.url}balanceHidrico`} component={BalanceHidrico} />);
			}
			if (token.modulos.includes('7')) {
				items.push(<Route key={7} path={`${match.url}historialBalanceHidrico`} component={HistorialBalanceHidrico} />);
			}
			if (token.modulos.includes('10')) {
				items.push(<Route key={10} path={`${match.url}tecnico/balanceHidrico`} component={TecnicoBalanceHidrico} />);
			}
			if (token.modulos.includes('11')) {
				items.push(<Route key={11} path={`${match.url}auditoria/incompleto`} component={ReporteIncompletos} />);
			}
			if (token.modulos.includes('12')) {
				items.push(<Route key={12} path={`${match.url}tratamientoKardex`} component={TratamientoKardex} />);
			}
			if (token.modulos.includes('13')) {
				items.push(<Route key={13} path={`${match.url}auditoria/especialidad`} component={ReporteEspecialidad} />);
			}
			if (token.modulos.includes('14')) {
				items.push(<Route key={14} path={`${match.url}registroPaciente`} component={registroPaciente} />);
			}
			if (token.modulos.includes('16')) {
				items.push(<Route key={16} path={`${match.url}ingresoEvolucionEnfermeria`} component={Ingreso} />)
			}
			if (token.modulos.includes('17')) {
				items.push(<Route key={17} path={`${match.url}historialEvolucionEnfermeria`} component={Historial} />)
			}
			if (token.modulos.includes('18')) {
				items.push(<Route key={18} path={`${match.url}tomaPreTriaje`} component={TomaPreTriaje} />);
			}
			if (token.modulos.includes('19')) {
				items.push(<Route key={19} path={`${match.url}historicoPreTriaje`} component={HistoricoPreTriaje} />);
			}
			if (token.modulos.includes('20')) {
				items.push(<Route key={20} path={`${match.url}admisionConsulta`} component={AdmisionConsulta} />);
			}
		}

		if (tokenAdmin) {
			items.push(
				<Route key={25} path={`${match.url}hc-admin/configuraciones/modulos`} component={AsignacionModulos} />
			);
			items.push(
				<Route key={26} path={`${match.url}hc-admin/configuraciones/firmas`} component={ConfiguracionFirmas} />
			);
			items.push(
				<Route key={27} path={`${match.url}hc-admin/configuraciones/camas`} component={ConfiguracionCamas} />
			);
		}

		if (tokenReports && dataPrincial) {
			items.push(
				<Route key={28} path={`${match.url}reportes/reporte1`} component={Reporte1} />
			);
			items.push(
				<Route key={29} path={`${match.url}reportes/reporte2`} component={Reporte2} />
			);
			items.push(
				<Route key={30} path={`${match.url}reportes/reporte3`} component={Reporte3} />
			);
			items.push(
				<Route key={31} path={`${match.url}reportes/reporte4`} component={Reporte4} />
			);
		}

    if (token?.data) {
      items.push(<Route key={30} path={`${match.url}generarPedido`} component={GenerarPedido} />);
    }

		return items;
	};

	useEffect(() => {
		if (token && (!token.modulos || token?.modulos.length <= 0)) {
			modal.info({
				title: 'Modulos de Sistema',
				content: (
					<>
						No cuenta con modulos a su disposición. Contactese con el administrador.
					</>
				),
				onOk: () => {
					userSignOut();
				},
				okText: 'Aceptar',
				centered: true
			});
		}
		traerDataPrincial();
	}, [])

	const rutas = generateRoute(token);

	return (
		<div className="gx-main-content-wrapper">
			<Switch>
				{/* ---------------- DAVID ------------------- */}
				{rutas.map(item => item)}
				{contextHolder}
			</Switch>
		</div>
	);
};

export default App;
