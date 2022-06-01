import { Table, Tag, Space, Row, Col, Pagination, Divider } from "antd";

const Tablas = (props) => {
  const { ano, mes, especialidad, data: dataServidor } = props;

  const columns = [
    {
      title: "Ranking".toUpperCase(),
      dataIndex: "posicion_top",
      key: "posicion_top",
      align: "center",
    },
    {
      title: "Etiquetas de fila".toUpperCase(),
      dataIndex: "nombre_producto",
      key: "nombre_producto",
    },
    {
      title: "Suma de REAL Monto Venta".toUpperCase(),
      dataIndex: "monto_venta",
      key: "monto_venta",
      align: "right",
    },
    {
      title: "Ordenes Ventas".toUpperCase(),
      dataIndex: "ordenes_venta",
      key: "ordenes_venta",
      align: "right",
    },
  ];

  const data = dataServidor.map((dd) => {
    return {
      key: dd.cod_producto,
      posicion_top: dd.posicion_top,
      nombre_producto: dd.nombre_producto,
      monto_venta: "S/. " + parseFloat(dd.monto_venta).toFixed(2),
      ordenes_venta: dd.ordenes_venta,
    };
  });

  return (
    <div>
      <Row>
        <Titulo titulo={"Examenes mas Rotados"}></Titulo>
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
