import departamentosJson from '../assets/ubigeo/departamentos.json';
import provinciasJson from '../assets/ubigeo/provincias.json';
import distritosJson from '../assets/ubigeo/distritos.json';

export const getDepartamentos = () => {
  let lista = [];
  departamentosJson.forEach((prov) => {
    const data = prov['fields'];
    lista.push({
      ubigeo: data['cod_ubigeo_inei'],
      nombre: data['nombre']
    });
  });
  return lista;
}

export const getProvincias = (ubigeoDepartamento) => {
  let lista = [];
  provinciasJson.forEach((prov) => {
    const data = prov['fields'];
    if (ubigeoDepartamento === data['cod_ubigeo_inei'].substring(0, 2)) {
      lista.push({
        ubigeo: data['cod_ubigeo_inei'].substring(2,4),
        nombre: data['nombre']
      });
    }
  });
  return lista;
}

export const getDistritos = (ubigeoDepartamento, ubigeoProvincia) => {
  let lista = [];
  distritosJson.forEach((prov) => {
    const data = prov['fields'];
    if (ubigeoProvincia === data['cod_ubigeo_inei'].substring(2, 4) && ubigeoDepartamento === data['cod_ubigeo_inei'].substring(0, 2)) {
      lista.push({
        ubigeo: data['cod_ubigeo_inei'].substring(4,6),
        nombre: data['nombre']
      });
    }
  });
  return lista;
}
