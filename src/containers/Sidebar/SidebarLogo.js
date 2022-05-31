import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  TAB_SIZE,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";
import Image from '../../assets/images/biensalud-logo.ico'
import ImageLocal from '../../assets/images/logo.png';
import './styles.css';

const SidebarLogo = ({ sidebarCollapsed, setSidebarCollapsed }) => {

  const { width, themeType } = useSelector(({ settings }) => settings);
  let navStyle = useSelector(({ settings }) => settings.navStyle);
  const anexo = useSelector(state => state.anexo);


  if (width < TAB_SIZE && navStyle === NAV_STYLE_FIXED) {
    navStyle = NAV_STYLE_DRAWER;
  }

  return (
    <div className={`${anexo.tipo === "N" && "mitema"}`}>
      <div className="gx-layout-sider-header">
        {(navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR) ? <div className="gx-linebar">
          <i
            className={`gx-icon-btn icon icon-${!sidebarCollapsed ? 'menu-unfold' : 'menu-fold'} ${themeType !== THEME_TYPE_LITE ? 'gx-text-white' : ''}`}
            onClick={() => {
              setSidebarCollapsed(!sidebarCollapsed)
            }}
          />
        </div> : null}

        <Link to="/" className="gx-site-logo">
          {navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR && width >= TAB_SIZE ?
            <img alt="lo" src={("/assets/images/w-logo.png")} /> :
            themeType === THEME_TYPE_LITE ?
              <img alt="logo1" src={("/assets/images/logoP.jpeg")} /> :

              anexo.tipo === "N"
                ? <div>
                  <img alt="logoHC" style={{ float: "left", width: " 25%" }} src={ImageLocal} />
                  <h1 style={{ color: "white", float: "right", width: " 70%", fontSize: "18px", paddingTop: "8px" }}>Historia Clinica</h1>
                </div>
                : <div>
                  <img alt="logoHC" style={{ float: "left", width: " 25%" }} src={Image} />
                  <h1 style={{ color: "white", float: "right", width: " 70%", fontSize: "18px", paddingTop: "8px" }}>Historia Clinica</h1>
                </div>
          }

        </Link>
      </div>
    </div>
  );
};

export default SidebarLogo;
