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
import './styles.css';

const SidebarLogo = ({ sidebarCollapsed, setSidebarCollapsed }) => {

  const { width, themeType, themeSettingsGlobal } = useSelector(({ settings }) => settings);
  let navStyle = useSelector(({ settings }) => settings.navStyle);

  if (width < TAB_SIZE && navStyle === NAV_STYLE_FIXED) {
    navStyle = NAV_STYLE_DRAWER;
  }

  return (
    <div style={{ backgroundColor: themeSettingsGlobal.COD_COLOR_1 }}>
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
            <img alt="lo" src={`${process.env.PUBLIC_URL}/assets/images/${themeSettingsGlobal.LOGO}`} /> :
            themeType === THEME_TYPE_LITE ?
              <img alt="logo1" src={`${process.env.PUBLIC_URL}/assets/images/${themeSettingsGlobal.LOGO}`} /> :
              <div style={{display: 'flex', alignItems: 'center', gap: 5}}>
                <img
                  alt="logoHC"
                  style={{ float: "left", width: " 25%" }} src={`${process.env.PUBLIC_URL}/assets/images/${themeSettingsGlobal.LOGO}`}
                  title={themeSettingsGlobal.COMPANIA}
                />
                <h1 style={{ color: "white", float: "right", width: " 70%", fontSize: "18px", paddingTop: "8px" }}>Historia Clínica</h1>
              </div>
          }
          {/*<img alt="lo" src={ImageLocal} />*/}
        </Link>
      </div>
    </div>
  );
};

export default SidebarLogo;
