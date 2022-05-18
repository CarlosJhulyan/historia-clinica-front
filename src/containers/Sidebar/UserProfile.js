import React from "react";
import { Avatar, Popover } from "antd";
import { useAuth } from "../../authentication";
import { useHistory } from "react-router-dom";

const UserProfile = () => {
  const { userSignOut } = useAuth();
  const history = useHistory();
  const data = JSON.parse(sessionStorage.getItem("token"));


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


  const nombre = data.des_nom_medico.split(' ');


  return (
    <div className="gx-flex-row gx-align-items-center gx-mb-4 gx-avatar-row">
      {/* <Popover placement="bottomRight" content={userMenuOptions} trigger="click"> */}
        {/* <Avatar src={"https://via.placeholder.com/150"} className="gx-size-40 gx-pointer gx-mr-3" alt="" /> */}
        <span className="gx-avatar-name">
          {nombre[0]} {data.des_ape_medico}         
        </span>
      {/* </Popover> */}
    </div>
  )
};

export default UserProfile;
