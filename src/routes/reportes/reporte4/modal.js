import { Table, Modal, Spin } from "antd";
import React, { useEffect, useCallback, useState } from "react";
import { httpClientReports } from "../../../util/Api";

const ModalDetalles = ({ abrirModal, setAbrirModal, datosModal }) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const traerDatos = useCallback(async () => {
    try {
      const response = await httpClientReports.post(
        "reportes/getReporte4Detalle",
        datosModal
      );
      if (response.data.success) {
        setLoading(false);
        response.data.data.forEach((element) => {
          element.key = element.id;
        });
        setDataSource(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    traerDatos();
  }, []);

  const columns = [
    {
      title: "Codigo Producto",
      dataIndex: "codigo_producto",
      key: "codigo_producto",
    },
    {
      title: "Nombre Producto",
      dataIndex: "nombre_producto",
      key: "nombre_producto",
    },
    {
      title: "Monto Vendido",
      dataIndex: "mont_venta_prod",
      key: "mont_venta_prod",
      align: "right",
      render: (text, record) => (
        <span>{"S/ " + parseFloat(text).toFixed(2)}</span>
      ),
    },
    {
      title: "Numero Ordenes",
      dataIndex: "num_order_prod",
      key: "num_order_prod",
      align: "right",
    },
  ];

  return (
    <>
      <Modal
        visible={abrirModal}
        onCancel={() => setAbrirModal(false)}
        footer={false}
        width="70%"
        maskClosable={false}
      >
        {loading ? (
          <div
            style={{
              fontSize: "22px",
              padding: "30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Spin style={{ width: "100%" }} />
            Cargando...
          </div>
        ) : dataSource.length > 0 ? (
          <Table
            style={{
              width: "100%",
              textAlign: "center",
            }}
            className="gx-table-responsive"
            columns={columns}
            dataSource={dataSource}
          />
        ) : (
          <div style={{ fontSize: "22px", padding: "30px" }}>
            No hay productos registrados para este mes
          </div>
        )}
      </Modal>
    </>
  );
};
export default ModalDetalles;
