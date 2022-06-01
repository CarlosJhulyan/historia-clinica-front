import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { ConfigProvider, Modal } from 'antd';
import { IntlProvider } from "react-intl";

import AppLocale from "../../lngProvider";
import MainApp from "./MainApp";
import SignIn from "../SignIn";
import SignUp from "../SignUp";
import { setInitUrl } from "../../appRedux/actions";

import {
  LAYOUT_TYPE_BOXED,
  LAYOUT_TYPE_FRAMED,
  LAYOUT_TYPE_FULL,
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
  THEME_TYPE_DARK
} from "../../constants/ThemeSetting";
import CircularProgress from "../../components/CircularProgress";
import { useAuth } from "../../authentication";
import { httpClient } from "../../util/Api";
import SignInAdmin from "../SignInAdmin";
import SignInReports from "../SignInReport";

const RestrictedRoute = ({ component: Component, location, authUser, authAdmin, authReports, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      (authUser || authAdmin || authReports)
        ? <Component {...props} />
        : <Redirect
          to={{
            pathname: '/signin',
            state: { from: location }
          }}
        />}
  />;

const setLayoutType = (layoutType) => {
  if (layoutType === LAYOUT_TYPE_FULL) {
    document.body.classList.remove('boxed-layout');
    document.body.classList.remove('framed-layout');
    document.body.classList.add('full-layout');
  } else if (layoutType === LAYOUT_TYPE_BOXED) {
    document.body.classList.remove('full-layout');
    document.body.classList.remove('framed-layout');
    document.body.classList.add('boxed-layout');
  } else if (layoutType === LAYOUT_TYPE_FRAMED) {
    document.body.classList.remove('boxed-layout');
    document.body.classList.remove('full-layout');
    document.body.classList.add('framed-layout');
  }
};

const setNavStyle = (navStyle) => {
  if (navStyle === NAV_STYLE_DEFAULT_HORIZONTAL ||
    navStyle === NAV_STYLE_DARK_HORIZONTAL ||
    navStyle === NAV_STYLE_INSIDE_HEADER_HORIZONTAL ||
    navStyle === NAV_STYLE_ABOVE_HEADER ||
    navStyle === NAV_STYLE_BELOW_HEADER) {
    document.body.classList.add('full-scroll');
    document.body.classList.add('horizontal-layout');
  } else {
    document.body.classList.remove('full-scroll');
    document.body.classList.remove('horizontal-layout');
  }
};

const App = () => {
  const [modal, contextHolder] = Modal.useModal();
  const locale = useSelector(({ settings }) => settings.locale);
  const navStyle = useSelector(({ settings }) => settings.navStyle);
  const layoutType = useSelector(({ settings }) => settings.layoutType);
  const themeType = useSelector(({ settings }) => settings.themeType);
  const isDirectionRTL = useSelector(({ settings }) => settings.isDirectionRTL);
  const initURL = useSelector(({ settings }) => settings.initURL);

  const { 
    authUser, 
    isLoadingUser, 
    userSignOut,
    loadingAdmin,
    authAdmin,
    authReports,
    loadingReports,
  } = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  useEffect(() => {
    if (isDirectionRTL) {
      document.documentElement.classList.add('rtl');
      document.documentElement.setAttribute('data-direction', 'rtl')
    } else {
      document.documentElement.classList.remove('rtl');
      document.documentElement.setAttribute('data-direction', 'ltr')
    }
  }, [isDirectionRTL]);

  useEffect(() => {
    if (locale)
      document.documentElement.lang = locale.locale;
  }, [locale]);

  useEffect(() => {
    if (themeType === THEME_TYPE_DARK) {
      document.body.classList.add('dark-theme');
    } else if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
    }
  }, [themeType]);

  useEffect(() => {
    if (initURL === '') {
      dispatch(setInitUrl(location.pathname));
    }
  });

  useEffect(() => {
     if (!isLoadingUser || !loadingAdmin || !loadingReports) {
      if (!authAdmin && initURL.includes('/hc-admin')) {
        history.push('/hc-admin/signin');
      } else if (!authReports && initURL.includes('/reportes')) {
        history.push('/reportes/signin');
      } else if (authAdmin && initURL.includes('/hc-admin')) {
        history.push(initURL);
      } else if (authReports && initURL.includes('/reportes')) {
        history.push(initURL);
      } else if (authAdmin && initURL === '/hc-admin/signin') {
        history.push('/hc-admin');
      } else if (authReports && initURL === '/reportes/signin') {
        history.push('/reportes');
      } else if (!authUser) {
        history.push('/signin');
      } else if (initURL === '' || initURL === '/' || initURL === '/signin') {
        history.push('/');
      } else {
        history.push(initURL);
      }
    }
  }, [isLoadingUser, authUser, initURL, history, authAdmin, loadingAdmin, loadingReports, authReports]);

  useEffect(() => {
    setLayoutType(layoutType);
    setNavStyle(navStyle);
  }, [layoutType, navStyle]);

  useEffect(() => {
    if (localStorage.getItem('version')) {
      httpClient
      .post('sistema/getVersion')
      .then(({ data: { data, success, message } }) => {
        if (success && localStorage.getItem('version') === data.num_version) {
          console.log('Stable version', data.num_version);
        } else {
          modal.info({
            title: 'Versión de Sistema',
            content: (
              <>
                {message} Debe iniciar sesión nuevamente. Acepte para volver a logearse.
              </>
            ),
            onOk: () => {
              userSignOut();
            },
            okText: 'Aceptar',
            centered: true
          });
        }
      })
      .catch(function (error) {
        console.error(error);
      });
    }
  }, [])

  const currentAppLocale = AppLocale[locale.locale];

  return (isLoadingUser || loadingAdmin || loadingReports) ? <CircularProgress /> : (
    <ConfigProvider locale={currentAppLocale.antd} direction={isDirectionRTL ? 'rtl' : 'ltr'}>
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}>
        <Switch>
          <Route exact path='/signin' component={SignIn} />
          <Route exact path='/signup' component={SignUp} />
          <Route exact path='/hc-admin/signin' component={SignInAdmin} />
          <Route exact path='/reportes/signin' component={SignInReports} />
          <RestrictedRoute path={`${match.url}`} authUser={authUser} location={location} component={MainApp} authAdmin={authAdmin} authReports={authReports} />
        </Switch>
        {contextHolder}
      </IntlProvider>
    </ConfigProvider>
  )
};

export default App;
