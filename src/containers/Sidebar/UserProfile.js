import React from "react";
import { Avatar, Popover } from "antd";
import { useAuth } from "../../authentication";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const { userSignOut } = useAuth();
  const history = useHistory();
  const initURL = useSelector(({ settings }) => settings.initURL);
  const data = JSON.parse(localStorage.getItem("token"));
  const dataAdmin = JSON.parse(localStorage.getItem("token-admin"));

  const onLogoutClick = () => {
    userSignOut(() => {
      history.push('/');
    });
  }

  const userMenuOptions = (
    <ul className="gx-user-popover">
      {/* <li>My Account</li>
      <li>Connections</li> */}
      <li onClick={onLogoutClick}>Cerrar sesión
      </li>
    </ul>
  );


  const nombre = data && data.des_nom_medico.split(' ');
  const nombreAdmin = (dataAdmin && initURL.includes('/hc-admin')) && dataAdmin.login_usu;

  return (
    <div className="gx-flex-row gx-align-items-center gx-mb-4 gx-avatar-row">
      {/* <Popover placement="bottomRight" content={userMenuOptions} trigger="click"> */}
        {/* <Avatar src={"https://via.placeholder.com/150"} className="gx-size-40 gx-pointer gx-mr-3" alt="" /> */}
        <span className="gx-avatar-name">
          {nombreAdmin || nombre[0]} {(data && !initURL.includes('/hc-admin')) && data.des_ape_medico}
        </span>
      {/* </Popover> */}
    </div>
  )
};

export default UserProfile;
