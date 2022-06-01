import { Table, Row, Divider } from "antd";

const Tablas = (props) => {
  const {
    ano,
    meses: mesesDesordenado,
    tipos: tiposOrdenados,
    data: dataServidor,
  } = props;

  const tipos = tiposOrdenados.sort((a, b) => a.key - b.key);
  const meses = mesesDesordenado.sort((a, b) => a.orden - b.orden);

  const diccionario = {
    1: "ordenesventa",
    2: "montoventa",
  };

  const columns = [
    {
      title: "",
      dataIndex: "nombre",
      key: "nombre",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "AÑO",
      dataIndex: "ano",
      key: "ano",
    },
  ];

  meses.forEach((mes) => {
    columns.push({
      title: "ORD. VEND.",
      dataIndex: mes.key + "orden",
      key: mes.key + "orden",
      align: "right",
    });
    columns.push({
      title: mes.value.toUpperCase(),
      dataIndex: mes.value,
      key: mes.value,
      align: "right",
    });
  });

  const data = [];

  tipos.forEach((tipo) => {
    console.log(tipo);
    const campos = {};
    if (dataServidor.length > 0) {
      meses.forEach((mes, index) => {
        const ddd = dataServidor.filter((dato) => dato.cod_tipor === tipo.key);

        if (ddd.length > 0) {
          campos[mes.value] =
            "S/. " +
            parseFloat(ddd[0][mes.key + "_" + diccionario[2]]).toFixed(2);
          campos[mes.key + "orden"] = ddd[0][mes.key + "_" + diccionario[1]];
        } else {
          campos[mes.value] = "-";
          campos[mes.key + "orden"] = "-";
        }
      });
    }

    console.log(campos);

    data.push({
      key: tipo.key,
      nombre: tipo.titulo,
      ano: ano,
      ...campos,
    });
  });

  return (
    <div style={{ marginLeft: "10px" }}>
      <Row>
        <Titulo titulo={"Ingresos por linea de negocio VENTA"}></Titulo>
      </Row>
      <Row>
        <Table columns={columns} pagination={false} dataSource={data} />
      </Row>
    </div>
  );
};

const Titulo = (props) => {
  return (
    <div style={{ width: "100%", marginTop: 10 }}>
      <Divider></Divider>
      <div style={{ paddingTop: 30, paddingBottom: 10 }}>
        <h3
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            fontWeight: 400,
            backgroundColor: "#F9E4B7",
          }}
        >
          {props.titulo.toUpperCase()}
        </h3>
      </div>
    </div>
  );
};

export default Tablas;
