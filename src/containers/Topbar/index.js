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

const { Header } = Layout;

const Topbar = () => {
	const { navStyle } = useSelector(({ settings }) => settings);
	const navCollapsed = useSelector(({ common }) => common.navCollapsed);
	const width = useSelector(({ common }) => common.width);
	const [modalCerar, setModalCerrar] = useState(false);
	const token = JSON.parse(localStorage.getItem('token'));
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

	const { adminSignOut } = useAuth();

	const history = useHistory();

	const onLogoutClick = () => {
		adminSignOut(() => {
			history.push('/hc-admin');
		})
	};

	return (
		<>
			<Header>
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
					{initURL.includes('/hc-admin') ? (
						<Button onClick={() => onLogoutClick()} style={{ marginTop: 12 }}>
							Cerrar Sesión Admin
						</Button>
					) : (
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
					<div>
						<h4 style={{ fontWeight: 'bold', marginBottom: '0' }}>
							MÉDICO:{' '}
							<span style={{ fontWeight: 'normal' }}>
								{token.des_nom_medico + ' ' + token.des_ape_medico}
							</span>{' '}
						</h4>
					</div>
					<div>
						<h4 style={{ fontWeight: 'bold', marginBottom: '0' }}>
							ESPECIALIDAD: <span style={{ fontWeight: 'normal' }}>{token.des_especialidad}</span>
						</h4>
					</div>
					<div>
						<h4 style={{ fontWeight: 'bold', marginBottom: '0' }}>
							CMP: <span style={{ fontWeight: 'normal' }}>{token.num_cmp}</span>
						</h4>
					</div>
				</div>
			</Header>
			{modalCerar ? (
				<ModalCerrarSesion modalCerar={modalCerar} setModalCerrar={setModalCerrar} />
			) : null}
		</>
	);
};

export default Topbar;
