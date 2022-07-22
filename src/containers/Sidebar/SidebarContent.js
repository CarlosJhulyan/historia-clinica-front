import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

import CustomScrollbars from 'util/CustomScrollbars';
import SidebarLogo from './SidebarLogo';
import UserProfile from './UserProfile';
import {
	NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
	NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
	THEME_TYPE_LITE,
} from '../../constants/ThemeSetting';
import { useSelector } from 'react-redux';
import './styles.css';
import SubMenu from 'antd/lib/menu/SubMenu';

const SidebarContent = ({ sidebarCollapsed, setSidebarCollapsed }) => {
	const { navStyle, themeType, themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const pathname = useSelector(({ common }) => common.pathname);
	const token = JSON.parse(localStorage.getItem('token'));
	const tokenAdmin = JSON.parse(localStorage.getItem('token-admin'));
	const tokenReports = JSON.parse(localStorage.getItem('token-reports'));
	const initURL = useSelector(({ settings }) => settings.initURL);

	const getNoHeaderClass = navStyle => {
		if (
			navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR ||
			navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR
		) {
			return 'gx-no-header-notifications';
		}
		return '';
	};

	const selectedKeys = pathname.substr(1);
	const defaultOpenKeys = selectedKeys.split('/')[1];

	const getNavStyleSubMenuClass = navStyle => {
		if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
			return 'gx-no-header-submenu-popup';
		}
		return '';
	};

	const createMenuItem = () => {
		const menuItems = [];

		if (token?.data && token.data.login_usu && !initURL.includes('/hc-admin')) {
			menuItems.push(
				<SubMenu
					key="posVentaG"
					popupClassName={getNavStyleSubMenuClass(navStyle)}
					title={
						<span>
							{' '}
							<i className="icon icon-icon" />
							<span>Pos Venta</span>
						</span>
					}
				>
					<Menu.Item key="generarPedido">
						<Link to="/generarPedido">
							<i className="icon icon-icon" />
							<span>Generar Pedido</span>
						</Link>
					</Menu.Item>
          <Menu.Item key="reservarPedido">
            <Link to="/reservarPedido">
              <i className="icon icon-icon" />
              <span>Reservar Pedido</span>
            </Link>
          </Menu.Item>
					<Menu.Item key="movimientosCaja">
						<Link to="/movimientosCaja">
							<i className="icon icon-icon" />
							<span>Movimientos de Caja</span>
						</Link>
					</Menu.Item>
				</SubMenu>
			);

			menuItems.push(
				<Menu.Item key="ingresoAtenciones">
					<Link to="/ingresoAtenciones">
						<i className="icon icon-auth-screen" />
						<span>Ingreso Atenciones</span>
					</Link>
				</Menu.Item>
			);

			menuItems.push(
				<Menu.Item key="anulacionPedidosCompletos">
					<Link to="/anulacionPedidosCompletos">
						<i className="icon icon-auth-screen" />
						<span>Anulación de Pedidos Completos</span>
					</Link>
				</Menu.Item>
			);

			menuItems.push(
				<SubMenu
					key="horario"
					popupClassName={getNavStyleSubMenuClass(navStyle)}
					title={
						<span>
							{' '}
							<i className="icon icon-icon" />
							<span>Horario</span>
						</span>
					}
				>
					{/* <Menu.Item key="horario/asignar">
						<Link to="/horario/asignar">
							<i className="icon icon-icon" />
							<span>Mantenedor de Horario</span>
						</Link>
					</Menu.Item> */}
					<Menu.Item key="horario/consultar">
						<Link to="/horario/consultar">
							<i className="icon icon-icon" />
							<span>Horario</span>
						</Link>
					</Menu.Item>
				</SubMenu>
			);

			menuItems.push(
				<SubMenu
					key="pacientes"
					popupClassName={getNavStyleSubMenuClass(navStyle)}
					title={
						<span>
							{' '}
							<i className="icon icon-auth-screen" />
							<span>Pacientes</span>
						</span>
					}
				>
					<Menu.Item key="listaEspera">
						<Link to="/listaEspera">
							<i className="icon icon-auth-screen" />
							<span>Lista de Espera</span>
						</Link>
					</Menu.Item>
				</SubMenu>
			);
		}

		if (token?.modulos && !initURL.includes('/hc-admin') && !initURL.includes('/reportes')) {
			if (token.modulos.includes('16') || token.modulos.includes('17')) {
				menuItems.push(
					<SubMenu
						key="evolucionEnfermeria"
						popupClassName={getNavStyleSubMenuClass(navStyle)}
						title={
							<span>
								{' '}
								<i className="icon icon-icon" />
								<span>Evolución de Enfermería</span>
							</span>
						}
					>
						{token.modulos.includes('16') && (
							<Menu.Item key="ingresoEvolucionEnfermeria">
								<Link to="/ingresoEvolucionEnfermeria">
									<i className="icon icon-icon" />
									<span>Agregar Evolución de Enfermería</span>
								</Link>
							</Menu.Item>
						)}
						{token.modulos.includes('17') && (
							<Menu.Item key="historialEvolucionEnfermeria">
								<Link to="/historialEvolucionEnfermeria">
									<i className="icon icon-icon" />
									<span>Historial Evolución de Enfermería</span>
								</Link>
							</Menu.Item>
						)}
					</SubMenu>
				);
			}

			if (token.modulos.includes('18') || token.modulos.includes('19')) {
				menuItems.push(
					<SubMenu
						key="preTriaje"
						popupClassName={getNavStyleSubMenuClass(navStyle)}
						title={
							<span>
								{' '}
								<i className="icon icon-icon" />
								<span>Pre triaje</span>
							</span>
						}
					>
						{token.modulos.includes('18') && (
							<Menu.Item key="tomaPreTriaje">
								<Link to="/tomaPreTriaje">
									<i className="icon icon-icon" />
									<span>Toma de Pre triaje</span>
								</Link>
							</Menu.Item>
						)}
						{token.modulos.includes('19') && (
							<Menu.Item key="historicoPreTriaje">
								<Link to="/historicoPreTriaje">
									<i className="icon icon-icon" />
									<span>Historico de Pre triaje</span>
								</Link>
							</Menu.Item>
						)}
					</SubMenu>
				);
			}

			if (token.modulos.includes('20')) {
				// menuItems.push(
				// 	<Menu.Item key="ingresoAtenciones">
				// 		<Link to="/ingresoAtenciones">
				// 			<i className="icon icon-auth-screen" />
				// 			<span>Ingreso Atenciones</span>
				// 		</Link>
				// 	</Menu.Item>
				// );
			}

			if (token.modulos.includes('14')) {
				menuItems.push(
					<Menu.Item key="registroPaciente">
						<Link to="/registroPaciente">
							<i className="icon icon-auth-screen" />
							<span>Registro de Pacientes</span>
						</Link>
					</Menu.Item>
				);
			}

			if (token.modulos.includes('1')) {
				menuItems.push(
					<SubMenu
						key="pacientes"
						popupClassName={getNavStyleSubMenuClass(navStyle)}
						title={
							<span>
								{' '}
								<i className="icon icon-auth-screen" />
								<span>Pacientes</span>
							</span>
						}
					>
						<Menu.Item key="listaPaciente">
							<Link to="/listaPaciente">
								<i className="icon icon-auth-screen" />
								<span>Lista de Pacientes</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="listaEspera">
							<Link to="/listaEspera">
								<i className="icon icon-auth-screen" />
								<span>Lista de Espera</span>
							</Link>
						</Menu.Item>
					</SubMenu>
				);
			}

			if (token.modulos.includes('2')) {
				menuItems.push(
					<Menu.Item key="seguimientoConsulta">
						<Link to="/seguimientoConsulta">
							<i className="icon icon-map-drawing" />
							<span>Seguimiento de Consultas</span>
						</Link>
					</Menu.Item>
				);
			}

			if (token.modulos.includes('3')) {
				menuItems.push(
					<Menu.Item key="asignacionCamas">
						<Link to="/asignacionCamas">
							<i className="icon icon-company" />
							<span>Asignación de camas</span>
						</Link>
					</Menu.Item>
				);
			}

			if (token.modulos.includes('5')) {
				menuItems.push(
					<Menu.Item key="listaHospitalizar">
						<Link to="/admisionHospitalaria">
							<i className="icon icon-auth-screen" />
							<span>Admisión Hospitalaria</span>
						</Link>
					</Menu.Item>
				);
			}

			if (
				token.modulos.includes('6') ||
				token.modulos.includes('7') ||
				token.modulos.includes('8') ||
				token.modulos.includes('9')
			) {
				menuItems.push(
					<SubMenu
						key="enfermeria"
						popupClassName={getNavStyleSubMenuClass(navStyle)}
						title={
							<span>
								{' '}
								<i className="icon icon-icon" />
								<span>Enfermería</span>
							</span>
						}
					>
						{(token.modulos.includes('6') || token.modulos.includes('7')) && (
							<SubMenu
								key="enfermeria/balanceHidrico"
								popupClassName={getNavStyleSubMenuClass(navStyle)}
								title={
									<span>
										{' '}
										<i className="icon icon-icon" />
										<span>Balance Hídrico</span>
									</span>
								}
							>
								{token.modulos.includes('6') && (
									<Menu.Item key="enfermeria/balanceHidrico/agregarBalanceHidrico">
										<Link to="/balanceHidrico">
											<i className="icon icon-icon" />
											<span>Agregar Balance Hidrico</span>
										</Link>
									</Menu.Item>
								)}
								{token.modulos.includes('7') && (
									<Menu.Item key="enfermeria/balanceHidrico/historialBalanceHidrico">
										<Link to="/historialBalanceHidrico">
											<i className="icon icon-icon" />
											<span>Historial Balance Hidrico</span>
										</Link>
									</Menu.Item>
								)}
							</SubMenu>
						)}
						{(token.modulos.includes('8') || token.modulos.includes('9')) && (
							<SubMenu
								key="enfermeria/signosVitales"
								popupClassName={getNavStyleSubMenuClass(navStyle)}
								title={
									<span>
										{' '}
										<i className="icon icon-icon" />
										<span>Signos Vitales</span>
									</span>
								}
							>
								{token.modulos.includes('8') && (
									<Menu.Item key="enfermeria/signosVitales/agregarSignosVitales">
										<Link to="/signosVitales">
											<i className="icon icon-company" />
											<span>Agregar Signos Vitales</span>
										</Link>
									</Menu.Item>
								)}
								{token.modulos.includes('9') && (
									<Menu.Item key="enfermeria/signosVitales/historialSignosVitales">
										<Link to="/historialSignosVitales">
											<i className="icon icon-company" />
											<span>Historial Signos Vitales</span>
										</Link>
									</Menu.Item>
								)}
							</SubMenu>
						)}
					</SubMenu>
				);
			}

			if (token.modulos.includes('10')) {
				menuItems.push(
					<SubMenu
						key="tecnicoEnfermeria"
						popupClassName={getNavStyleSubMenuClass(navStyle)}
						title={
							<span>
								{' '}
								<i className="icon icon-etherium" />
								<span>Técnico de Enfermería</span>
							</span>
						}
					>
						{token.modulos.includes('10') && (
							<SubMenu
								key="tecnicoEnfermeria/balanceHidrico"
								popupClassName={getNavStyleSubMenuClass(navStyle)}
								title={
									<span>
										{' '}
										<i className="icon icon-icon" />
										<span>Balance Hídrico</span>
									</span>
								}
							>
								{token.modulos.includes('10') && (
									<Menu.Item key="tecnicoEnfermeria/balanceHidrico/agregarBalanceHidrico">
										<Link to="/tecnico/balanceHidrico">
											<i className="icon icon-icon" />
											<span>Agregar Balance Hidrico</span>
										</Link>
									</Menu.Item>
								)}
								{/* <Menu.Item key="tecnicoEnfermeria/balanceHidrico/historialBalanceHidrico">
									<Link to="/tecnico/historialBalanceHidrico">
										<i className="icon icon-icon" />
										<span>Historial Balance Hidrico</span>
									</Link>
								</Menu.Item> */}
							</SubMenu>
						)}
					</SubMenu>
				);
			}

			if (token.modulos.includes('11') || token.modulos.includes('13')) {
				menuItems.push(
					<SubMenu
						key="auditoria"
						popupClassName={getNavStyleSubMenuClass(navStyle)}
						title={
							<span>
								{' '}
								<i className="icon icon-copy" />
								<span>Auditoria</span>
							</span>
						}
					>
						{token.modulos.includes('11') && (
							<Menu.Item key="auditoria/incompleto">
								<Link to="/auditoria/incompleto">
									<i className="icon icon-copy" />
									<span>Auditoria de historia clínica</span>
								</Link>
							</Menu.Item>
						)}
						{token.modulos.includes('13') && (
							<Menu.Item key="auditoria/especialidad">
								<Link to="/auditoria/especialidad">
									<i className="icon icon-copy" />
									<span>Auditoria por especialidad</span>
								</Link>
							</Menu.Item>
						)}
					</SubMenu>
				);
			}

			if (token.modulos.includes('12')) {
				menuItems.push(
					<Menu.Item key="tratamientoKardex">
						<Link to="/tratamientoKardex">
							<i className="icon icon-copy" />
							<span>Kardex Hospitalario</span>
						</Link>
					</Menu.Item>
				);
			}

			// if (token.modulos.includes('4')) {
			// 	menuItems.push(
			// 		<SubMenu
			// 			key="configuraciones"
			// 			popupClassName={getNavStyleSubMenuClass(navStyle)}
			// 			title={
			// 				<span>
			// 					{' '}
			// 					<i className="icon icon-extra-components" />
			// 					<span>Configuraciones</span>
			// 				</span>
			// 			}
			// 		>
			// 			<Menu.Item key="configuraciones/modulos">
			// 				<Link to="/configuraciones/modulos">
			// 					<i className="icon icon-widgets" />
			// 					<span>Asignacion de Modulos</span>
			// 				</Link>
			// 			</Menu.Item>
			// 			{ token.modulos.includes('15') &&
			// 				<Menu.Item key="configuraciones/camas">
			// 					<Link to="/configuraciones/camas">
			// 						<i className="icon icon-company" />
			// 						<span>Camas</span>
			// 					</Link>
			// 				</Menu.Item>
			// 			}
			// 			<Menu.Item key="configuraciones/firmas">
			// 				<Link to="/configuraciones/firmas">
			// 					<i className="icon icon-rendaring-calendar" />
			// 					<span>Firma Digital</span>
			// 				</Link>
			// 			</Menu.Item>
			// 		</SubMenu>
			// 	);
			// }
		}

		if (tokenAdmin && initURL.includes('/hc-admin')) {
			menuItems.push(
				<>
					<Menu.Item key="configuraciones/modulos">
						<Link to="/hc-admin/configuraciones/modulos">
							<i className="icon icon-widgets" />
							<span>Asignacion de Modulos</span>
						</Link>
					</Menu.Item>
					<SubMenu
						key="medicos"
						title={
							<span>
								{' '}
								<i className="icon icon-widgets" />
								<span>Médicos</span>
							</span>

						}
					>
						<Menu.Item key="configuraciones/medicos">
							<Link to="/hc-admin/configuraciones/medicos">
								<i className="icon icon-widgets" />
								<span>Gestionar Médicos</span>
							</Link>
						</Menu.Item>

						<Menu.Item key="configuraciones/asignacionmedicos">
							<Link to="/hc-admin/configuraciones/asignacionbusmedicos">
								<i className="icon icon-widgets" />
								<span>Asignacion </span>
							</Link>
						</Menu.Item>

					</SubMenu>
					<Menu.Item key="configuraciones/usuarios">
					  <Link to="/hc-admin/configuraciones/usuarios">
					    <i className="icon icon-user" />
					    <span>Usuarios</span>
					  </Link>
					</Menu.Item>
					<Menu.Item key="configuraciones/camas">
						<Link to="/hc-admin/configuraciones/camas">
							<i className="icon icon-company" />
							<span>Camas</span>
						</Link>
					</Menu.Item>
					<Menu.Item key="configuraciones/firmas">
						<Link to="/hc-admin/configuraciones/firmas">
							<i className="icon icon-rendaring-calendar" />
							<span>Firma Digital</span>
						</Link>
					</Menu.Item>
				</>
			);
		}

		if (tokenReports && initURL.includes('/reportes')) {
			menuItems.push(
				<>
					<Menu.Item key="reportes/reporte1">
						<Link to="/reportes/reporte1">
							<i className="icon icon-company" />
							<span>Analisis de Ordenes y Pacientes vs Concluidos</span>
						</Link>
					</Menu.Item>
					<Menu.Item key="reportes/reporte2">
						<Link to="/reportes/reporte2">
							<i className="icon icon-company" />
							<span>Analisis de Venta por Mes</span>
						</Link>
					</Menu.Item>
					<Menu.Item key="reportes/reporte3">
						<Link to="/reportes/reporte3">
							<i className="icon icon-company" />
							<span>Examenes mas Rotados</span>
						</Link>
					</Menu.Item>
					<Menu.Item key="reportes/reporte4">
						<Link to="/reportes/reporte4">
							<i className="icon icon-company" />
							<span>Atencion de espcialidades por mes</span>
						</Link>
					</Menu.Item>
				</>
			);
		}

		return menuItems;
	};

	const menuItems = createMenuItem(token, getNavStyleSubMenuClass, navStyle);

	return (
		<>
			<SidebarLogo sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
			<div className="gx-sidebar-content">
				<div className={`gx-sidebar-notifications ${getNoHeaderClass(navStyle)}`}>
					<UserProfile />
					{/* <AppsNavigation /> */}
				</div>
				<CustomScrollbars
					className={`gx-layout-sider-scrollbar`}
					style={{ backgroundColor: themeSettingsGlobal.COD_COLOR_1 }}
				>
					<Menu
						defaultOpenKeys={[defaultOpenKeys]}
						selectedKeys={[selectedKeys]}
						style={{ backgroundColor: themeSettingsGlobal.COD_COLOR_1 }}
						theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'}
						mode="inline"
					>
						{menuItems.map(item => item)}
					</Menu>
				</CustomScrollbars>
			</div>
		</>
	);
};

export default React.memo(SidebarContent);
