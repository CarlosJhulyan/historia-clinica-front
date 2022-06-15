import { Table, Row, Col, Divider } from "antd";

const Tablas = (props) => {
  const { ano, meses, tipos, ordenes, compras, data: dataServidor } = props;

  const tiposOrdenados = tipos.sort((a, b) => a.key - b.key);

  const dataOrden = dataServidor[0];
  const dataProducto = dataServidor[1];

  return (
    <div style={{ marginLeft: "10px" }}>
      <Row>
        {tiposOrdenados.map((tipo) => {
          let datOrden = null;
          dataOrden.forEach((element) => {
            if (element.cod_tipor === tipo.key) {
              datOrden = element;
            }
          });

          let datProducto = null;
          dataProducto.forEach((element) => {
            if (element.cod_tipor === tipo.key) {
              datProducto = element;
            }
          });

          return (
            <>
              <Tipos
                titulo={tipo.titulo}
                ano={ano}
                meses={meses}
                dataOrden={datOrden}
                dataProducto={datProducto}
                ordenes={ordenes}
                compras={compras}
              ></Tipos>
            </>
          );
        })}
      </Row>
    </div>
  );
};

const Tipos = (props) => {
  const { titulo, ano, meses, dataOrden, dataProducto, ordenes, compras } =
    props;
  return (
    <Col xs={24}>
      <Row>
        <Titulo titulo={titulo}></Titulo>
      </Row>
      <Row>
        {ordenes ? (
          <Contenido
            abc="ordenes"
            ano={ano}
            meses={meses}
            data={dataOrden}
          ></Contenido>
        ) : null}
      </Row>
      <Row>
        {compras ? (
          <Contenido
            abc="productos"
            ano={ano}
            meses={meses}
            data={dataProducto}
          ></Contenido>
        ) : null}
      </Row>
    </Col>
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

const Contenido = (props) => {
  const { ano, meses: mesesDesordenado, data: dataServidor, abc } = props;

  const meses = mesesDesordenado.sort((a, b) => a.orden - b.orden);

  const diccionario = {
    1: "numordens",
    2: "numeroordensr",
    3: "totalpacientes",
    4: "porcentajesc",
    5: "porcentajess",
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
      title: mes.value,
      dataIndex: mes.value,
      key: mes.value,
      align: "right",
    });
  });

  let data = [];
  if (abc === "ordenes") {
    data = [
      {
        key: 1,
        nombre: "Nro de ordenes".toUpperCase(),
        ano: ano,
      },
      {
        key: 2,
        nombre: "Nro ORDENES realizados".toUpperCase(),
        ano: ano,
      },
      {
        key: 3,
        nombre: "Total pacientes".toUpperCase(),
        ano: ano,
      },
      {
        key: 4,
        nombre: "% VERSUS ORDEN VS. CONCLUIDO".toUpperCase(),
        ano: ano,
      },
      {
        key: 5,
        nombre: "% VERSUS DE PACIENTE VS ORDENE COCNL".toUpperCase(),
        ano: ano,
      },
    ];
  } else {
    data = [
      {
        key: 1,
        nombre: "NRO DE PRODUCTOS".toUpperCase(),
        ano: ano,
      },
      {
        key: 2,
        nombre: "NRO DE PRODUCTO REALIZADO".toUpperCase(),
        ano: ano,
      },
      {
        key: 3,
        nombre: "Total pacientes".toUpperCase(),
        ano: ano,
      },
      {
        key: 4,
        nombre: "% VERSUS ORDEN VS. CONCLUIDO".toUpperCase(),
        ano: ano,
      },
      {
        key: 5,
        nombre: "% VERSUS DE PACIENTE VS ORDENE COCNL".toUpperCase(),
        ano: ano,
      },
    ];
  }

  if (dataServidor) {
    data.forEach((dato) => {
      meses.forEach((mes) => {
        const porcentaje = dato.key === 4 ? "%" : dato.key === 5 ? "%" : "";
        dato[mes.value] =
          dataServidor[mes.key + "_" + diccionario[dato.key]].toString() +
          porcentaje;
      });
    });
  }

  return <Table columns={columns} pagination={false} dataSource={data} />;
};

export default Tablas;
