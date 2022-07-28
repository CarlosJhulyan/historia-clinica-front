import React, { useState } from 'react';
import { Button, Col, Layout, Row } from 'antd';
import { Link } from 'react-router-dom';

/* import CustomScrollbars from "util/CustomScrollbars";
import languageData from "./languageData"; */
import { toggleCollapsedSideNav } from '../../appRedux/actions';
/*  import SearchBox from "../../components/SearchBox";
import UserInfo from "../../components/UserInfo";
import AppNotification from "../../components/AppNotification";
import MailNotification from "../../components/MailNotification";
import Auxiliary from "util/Auxiliary";  */

import {
	NAV_STYLE_DRAWER,
	NAV_STYLE_FIXED,
	NAV_STYLE_MINI_SIDEBAR,
	TAB_SIZE,
} from '../../constants/ThemeSetting';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useAuth } from '../../authentication';
import { ModalCerrarSesion } from '../../components/modal/ModalCerrarSesion';
import { httpClient } from '../../util/Api';

const { Header } = Layout;

const Topbar = () => {
	const { navStyle } = useSelector(({ settings }) => settings);
	const navCollapsed = useSelector(({ common }) => common.navCollapsed);
	const width = useSelector(({ common }) => common.width);
	const [modalCerar, setModalCerrar] = useState(false);
	const token = JSON.parse(localStorage.getItem('token'));
	const tokenAdmin = JSON.parse(localStorage.getItem('token-admin'));
	/* const [searchText, setSearchText] = useState(''); */
	const dispatch = useDispatch();
	const initURL = useSelector(({ settings }) => settings.initURL);

	/* const languageMenu = () => (
    <CustomScrollbars className="gx-popover-lang-scroll">
      <ul className="gx-sub-popover">
        {languageData.map(language =>
          <li className="gx-media gx-pointer" key={JSON.stringify(language)} onClick={() =>
            dispatch(switchLanguage(language))
          }>
            <i className={`flag flag-24 gx-mr-2 flag-${language.icon}`}/>
            <span className="gx-language-text">{language.name}</span>
          </li>
        )}
      </ul>
    </CustomScrollbars>); */

	/*  const updateSearchChatUser = (evt) => {
     setSearchText(evt.target.value);
   }; */

	const { adminSignOut, authUser, reportsSignOut } = useAuth();

	const history = useHistory();

	const cerrarSesion = async () => {
    const tt = authUser?.data ? authUser.data : authUser;
    // let id = tt?.login_usu ? tt.login_usu : token?.num_cmp;
    let id = '';
    if (tokenAdmin && initURL.includes('/hc-admin')) {
      id = tokenAdmin.login_usu;
      console.log(id);
    } else {
      id = tt.login_usu ? tt.login_usu : token.num_cmp
      console.log(id);
    }
		const response = await httpClient.post('/authController/cerrarSesionActivo', { userId: id });
		console.log('response', response.data.message);
	};

	const onLogoutAdmin = () => {
		adminSignOut(() => {
			history.push('/hc-admin');
		});
		cerrarSesion();
	};

	const onLogoutReports = () => {
		reportsSignOut(() => {
			history.push('/reportes');
		});
	};

	return (
		<>
			<Header style={{background: '#afafaf'}}>
				{navStyle === NAV_STYLE_DRAWER ||
				((navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR) &&
					width < TAB_SIZE) ? (
					<div className="gx-linebar gx-mr-3">
						<i
							className="gx-icon-btn icon icon-menu"
							onClick={() => {
								dispatch(toggleCollapsedSideNav(!navCollapsed));
							}}
						/>
					</div>
				) : null}
				<Link to="/" className="gx-d-block gx-d-lg-none gx-pointer">
					<img alt="" src={'/assets/images/w-logo.png'} />
				</Link>
				<div>
					{initURL.includes('/hc-admin') && (
						<Button onClick={() => onLogoutAdmin()} style={{ marginTop: 12 }}>
							Cerrar Sesión Admin
						</Button>
					)}
					{initURL.includes('/reportes') && (
						<Button onClick={() => onLogoutReports()} style={{ marginTop: 12 }}>
							Cerrar Sesión Reportes
						</Button>
					)}
					{authUser && !initURL.includes('/hc-admin') && !initURL.includes('/reportes') && (
						<Button onClick={() => setModalCerrar(true)} style={{ marginTop: 12 }}>
							Cerrar Sesión
						</Button>
					)}
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						width: 'auto',
						alignItems: 'center',
						gap: '30px',
					}}
				>
					{token && !initURL.includes('/hc-admin') && !initURL.includes('/reportes') && (
						<>
							<div>
								<h4 style={{ fontWeight: 'bold', marginBottom: '0' }}>
									{!token.data ? <>MÉDICO: </> : <>USUARIO: </>}
									<span style={{ fontWeight: 'normal' }}>
										{!token.data
											? token.des_nom_medico + ' ' + token.des_ape_medico
											: token.data.login_usu}
									</span>{' '}
								</h4>
							</div>
							{!token.data && (
								<>
									<div>
										<h4 style={{ fontWeight: 'bold', marginBottom: '0' }}>
											ESPECIALIDAD:{' '}
											<span style={{ fontWeight: 'normal' }}>{token.des_especialidad}</span>
										</h4>
									</div>
									<div>
										<h4 style={{ fontWeight: 'bold', marginBottom: '0' }}>
											CMP: <span style={{ fontWeight: 'normal' }}>{token.num_cmp}</span>
										</h4>
									</div>
								</>
							)}
						</>
					)}
					{tokenAdmin && initURL.includes('/hc-admin') && (
						<div>
							<h4 style={{ fontWeight: 'bold', marginBottom: '0' }}>
								<span style={{ fontWeight: 'normal' }}>{tokenAdmin.login_usu}</span>
							</h4>
						</div>
					)}
				</div>
			</Header>
			{modalCerar ? (
				<ModalCerrarSesion
					modalCerar={modalCerar}
					setModalCerrar={setModalCerrar}
					cerrarSesion={cerrarSesion}
				/>
			) : null}
		</>
	);
};

export default Topbar;
