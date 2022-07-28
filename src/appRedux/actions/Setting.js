import {
  INIT_URL,
  SWITCH_LANGUAGE,
  TOGGLE_COLLAPSED_NAV,
  WINDOW_WIDTH
} from "../../constants/ActionTypes";
import {
  LAYOUT_TYPE,
  NAV_STYLE,
  THEME_COLOR,
  THEME_TYPE,
  UPDATE_RTL_STATUS,
  THEME_DESIGN_LOOK_GLOBAL, ICONS_IMPRESION
} from '../../constants/ThemeSetting';

export function toggleCollapsedSideNav(navCollapsed) {
  return { type: TOGGLE_COLLAPSED_NAV, navCollapsed };
}

export function updateWindowWidth(width) {
  return (dispatch) => {
    dispatch({ type: WINDOW_WIDTH, width });
  }
}

export function setThemeType(themeType) {
  return (dispatch) => {
    dispatch({ type: THEME_TYPE, themeType });
  }
}

export function setThemeColor(themeColor) {
  return (dispatch) => {
    dispatch({ type: THEME_COLOR, themeColor });
  }
}

export function setDirectionRTL(rtlStatus) {
  return (dispatch) => {
    dispatch({ type: UPDATE_RTL_STATUS, rtlStatus });
  }
}

export function onNavStyleChange(navStyle) {
  return (dispatch) => {
    dispatch({ type: NAV_STYLE, navStyle });
  }
}

export function onLayoutTypeChange(layoutType) {
  return (dispatch) => {
    dispatch({ type: LAYOUT_TYPE, layoutType });
  }
}

export function switchLanguage(locale) {
  return (dispatch) => {
    dispatch({
      type: SWITCH_LANGUAGE,
      payload: locale
    });
  }
}

export const setInitUrl = (url) => {
  return {
    type: INIT_URL,
    payload: url
  };
};

export const setLoginLoading = (loading) => {
  return {
    type: 'SET_LOGIN_LOADING',
    payload: loading
  };
}

export const setLoginAdminLoading = (loading) => {
  return {
    type: 'SET_LOGIN_ADMIN_LOADING',
    payload: loading
  };
}

export const setLoginReportsLoading = (loading) => {
  return {
    type: 'SET_LOGIN_REPORTS_LOADING',
    payload: loading
  };
}

export const setHoraImprimible = (data) => {
  return {
    type: '[SET] Hora imprimible',
    payload: data
  };
}

export const setThemeDesignLook = (themeData) => {
  return {
    type: THEME_DESIGN_LOOK_GLOBAL,
    payload: themeData
  };
}

export const setLogosImpresion = (themeData) => {
  return {
    type: ICONS_IMPRESION,
    payload: themeData
  };
}

