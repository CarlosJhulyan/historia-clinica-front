import { INIT_URL, SWITCH_LANGUAGE } from "../../constants/ActionTypes";
import {
  LAYOUT_TYPE,
  LAYOUT_TYPE_FULL,
  NAV_STYLE,
  NAV_STYLE_MINI_SIDEBAR,
  THEME_COLOR,
  THEME_TYPE,
  THEME_TYPE_SEMI_DARK,
  UPDATE_RTL_STATUS,
  THEME_DESIGN_LOOK_GLOBAL, ICONS_IMPRESION
} from '../../constants/ThemeSetting';
import { types } from "../types/types";

const initialSettings = {
  navStyle: NAV_STYLE_MINI_SIDEBAR,
  layoutType: LAYOUT_TYPE_FULL,
  themeType: THEME_TYPE_SEMI_DARK,
  themeColor: '',

  isDirectionRTL: false,
  locale: {
    languageId: 'english',
    locale: 'en',
    name: 'English',
    icon: 'us'
  },
  initURL: '',
  loading: false,
  loadingAdmin: false,
  loadingReports: false,
  horaImprimible:'00:00:00',
  themeSettingsGlobal: {
    ID_TAB_GRAL: '',
    COMPANIA: '',
    LOGO: '',
    COD_COLOR_1: '',
    COD_COLOR_2: '',
    COD_COLOR_3: '',
  },
  logosImpresion: {
    LOGO_CIA: '',
    LOGO_FE_TERMICA: '',
    LOGO_FE_PDF: '',
  }
};

const SettingsReducer = (state = initialSettings, action) => {
  switch (action.type) {

    case THEME_TYPE:
      return {
        ...state,
        themeType: action.themeType
      };
    case THEME_COLOR:
      return {
        ...state,
        themeColor: action.themeColor
      };

    case UPDATE_RTL_STATUS:
      return {
        ...state,
        isDirectionRTL: action.rtlStatus
      };

    case NAV_STYLE:
      return {
        ...state,
        navStyle: action.navStyle
      };
    case LAYOUT_TYPE:
      return {
        ...state,
        layoutType: action.layoutType
      };

    case SWITCH_LANGUAGE:
      return {
        ...state,
        locale: action.payload,

      };

    case INIT_URL: {
      return {
        ...state,
        initURL: action.payload
      }
    }

    case types.setLoginLoading: {
      return {
        ...state,
        loading: action.payload
      }
    }

    case types.setLoginAdminLoading: {
      return {
        ...state,
        loadingAdmin: action.payload
      }
    }

    case types.setLoginReportsLoading: {
      return {
        ...state,
        loadingReports: action.payload
      }
    }

    case types.setHoraImprimible: {
      return {
        ...state,
        horaImprimible: action.payload
      }
    }

    case THEME_DESIGN_LOOK_GLOBAL: {
      return {
        ...state,
        themeSettingsGlobal: action.payload
      }
    }

    case ICONS_IMPRESION: {
      return {
        ...state,
        logosImpresion: action.payload
      }
    }

    default:
      return state;
  }
};

export default SettingsReducer;
