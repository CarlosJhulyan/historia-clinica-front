import { Link, Route } from "react-router-dom";
import { Modulos } from "../constants/Modulos";
import asyncComponent from "util/asyncComponent";
import { Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";

export const generateModules = (token, tipo, match, navStyle) => {
  let menu = Modulos;
  const items = [];
  if (token && token.success) {
    var filtro = [];
    const hijos = [];
    token.modulos.sort();
    token.modulos.forEach((item) => {
      var busqueda = menu.find((a) => item === a.modulo);
      if (busqueda) {
        filtro.push(busqueda);
      } else {
        menu.forEach((a) => {
          if (a.hijos) {
            hijos.push(a.hijos.find((c) => item === c.modulo));
            filtro.push(a.hijos.find((c) => item === c.modulo));
          }
        });
      }
    });
    if (hijos) {
      menu.forEach((a) => {
        if (a.hijos) {
          a.hijos = hijos;
        }
      });
    }
    if (tipo === "ruta") {
      filtro.forEach((a) => {
        console.log(a.ruta);
        items.push(
          <Route
            key={a.ruta}
            path={`${match.url + a.ruta}`}
            component={asyncComponent(() => import("../routes/" + a.ruta))}
          />
        );
      });
    } else {
      filtro = filtro.filter((el) => !hijos.includes(el));
      filtro.forEach((a) => {
        if (a.subMenu) {
          items.push(
            <SubMenu
              key={a.ruta}
              popupClassName={match(navStyle)}
              title={
                <span>
                  <i className={"icon " + a.icono} />
                  <span>{a.descripcion}</span>
                </span>
              }
            >
              {a.hijos &&
                a.hijos.map((e) => (
                  <Menu.Item key={e.ruta}>
                    <Link to={"/" + e.ruta}>
                      <i className={"icon " + e.icono} />
                      <span>{e.descripcion}</span>
                    </Link>
                  </Menu.Item>
                ))}
            </SubMenu>
          );
        } else {
          items.push(
            <Menu.Item key={a.ruta}>
              <Link to={"/" + a.ruta}>
                <i className={"icon " + a.icono} />
                <span>{a.descripcion}</span>
              </Link>
            </Menu.Item>
          );
        }
      });
    }
  }
  console.log(tipo, items);
  return items;
};
