import { INIT_URL, SWITCH_LANGUAGE } from "../../constants/ActionTypes";
import {
  LAYOUT_TYPE,
  LAYOUT_TYPE_FULL,
  NAV_STYLE,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  THEME_COLOR,
  THEME_TYPE,
  THEME_TYPE_SEMI_DARK, UPDATE_RTL_STATUS
} from "../../constants/ThemeSetting";
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
  horaImprimible:'00:00:00',
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

    case types.setHoraImprimible: {
      return {
        ...state,
        horaImprimible: action.payload
      }
    }


    default:
      return state;
  }
};

export default SettingsReducer;
