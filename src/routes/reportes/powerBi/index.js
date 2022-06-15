import React from "react";
import { Route, Switch } from "react-router-dom";
import GeneralVenta from "./generalVenta";
import EspecialidadDetallado from "./especialidadDetallado";
import EspecialidadAcumulado from "./especialidadAcumulado";
import { generateModules } from "../../util/generateModules";

const Maestro = ({ match }) => {
  const token = JSON.parse(localStorage.getItem("token"));

  const rutas = generateModules(token, "ruta", match);
  const lista = [];

  rutas.forEach((element) => {
    if (element.key.split("/")[0] === "powerBi") {
      if (element.key.split("/")[1]) {
        lista.push(element.key.split("/")[1]);
      }
    }
  });

  const generarSubRuta = (lista) => {
    const listaSubRutas = [];
    lista.forEach((e) => {
      if (e === "generalVenta") {
        listaSubRutas.push(
          <Route path={`${match.url}/generalVenta`} component={GeneralVenta} />
        );
      }
      if (e === "especialidadDetallado") {
        listaSubRutas.push(
          <Route
            path={`${match.url}/especialidadDetallado`}
            component={EspecialidadDetallado}
          />
        );
      }
      if (e === "especialidadAcumulado") {
        listaSubRutas.push(
          <Route
            path={`${match.url}/especialidadAcumulado`}
            component={EspecialidadAcumulado}
          />
        );
      }
    });
    return listaSubRutas;
  };

  const subRutas = generarSubRuta(lista);

  return <Switch>{subRutas.map((e) => e)}</Switch>;
};

export default Maestro;
