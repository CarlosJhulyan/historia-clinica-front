import { SearchOutlined } from "@ant-design/icons";
import { DatePicker, Row, Col, Select, Checkbox, Tooltip, Button } from "antd";
import { useState } from "react";
import { tablasPrincipales } from "../../../constants/TablasPrincipales";
import { httpClientReports } from "../../../util/Api";
import Tablas from "./tablas";

const Cuerpo = ({ impresion }) => {
  const [ano, setAno] = useState("");
  const [mes, setMes] = useState({});
  const [especialidad, setEspecialidad] = useState({});
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(false);

  const onChangeAno = (date, dateString) => {
    // console.log(date, dateString);
    setAno(dateString);
  };

  const { Option } = Select;

  const mesesData = tablasPrincipales.TablasPrincipales[1].map((item) => (
    <Option key={item.prefijo}>{item.desc_mes}</Option>
  ));

  const especialidadData = tablasPrincipales.TablasPrincipales[0].map(
    (item) => <Option key={item.cod_esp}>{item.desc_esp}</Option>
  );

  function handleChangeMeses(value) {
    console.log(value);

    const seleccionado = tablasPrincipales.TablasPrincipales[1].filter(
      (item) => item.prefijo === value
    );

    const resp = {
      orden: seleccionado[0].cod_mes,
      key: seleccionado[0].prefijo,
      value: seleccionado[0].desc_mes,
    };

    setMes(resp);
  }

  function handleChangeEspecialidad(value) {
    // {{ key: "0001", titulo: "Laboratorio" }}

    // let resp = null;

    const seleccionado = tablasPrincipales.TablasPrincipales[0].filter(
      (item) => item.cod_esp === value
    );

    const resp = {
      key: seleccionado[0].cod_esp,
      titulo: seleccionado[0].desc_esp,
    };

    console.log(resp);
    setEspecialidad(resp);
  }

  async function traerData() {
    if (ano !== "") {
      setCargando(true);
      const response = await httpClientReports.post("/reportes/getReporte3", {
        AÑO: ano,
        MES: mes.orden.toString().padStart(2, "0"),
        ESPECIALIDAD: especialidad.key,
      });
      setData(response.data.data);
      console.log(response.data.data);
      setCargando(false);
    }
  }

  return (
    <div>
      <Col xs={24}>
        <Row justify="center" align="middle">
          <Col xs={4}>
            <Tooltip title="Seleccione el año">
              <DatePicker
                onChange={onChangeAno}
                picker="year"
                placeholder="Año"
              />
            </Tooltip>
          </Col>
          <Col xs={5}>
            <Tooltip title="Seleccione el mes">
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Seleccione el mes"
                onChange={handleChangeMeses}
              >
                {mesesData}
              </Select>
            </Tooltip>
          </Col>
          <Col xs={9}>
            <Tooltip title="Seleccione la especialidad">
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Seleccione la especialidad"
                onChange={handleChangeEspecialidad}
              >
                {especialidadData}
              </Select>
            </Tooltip>
          </Col>

          <Col xs={2}>
            <Tooltip title="buscar">
              <Button
                type="primary"
                shape="circle"
                icon={<SearchOutlined />}
                size="large"
                onClick={() => traerData()}
                loading={cargando}
              />
            </Tooltip>
          </Col>
        </Row>

        {data ? (
          <div ref={impresion}>
            <Tablas
              ano={ano}
              mes={mes}
              especialidad={especialidad}
              data={data}
            ></Tablas>
          </div>
        ) : null}
      </Col>
    </div>
  );
};

export default Cuerpo;
