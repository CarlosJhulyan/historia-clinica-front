import React, { useState } from "react";
import { Col, Modal, Row, Form, Input, Table, Button } from "antd";
import TextArea from "rc-textarea";
import { useDispatch, useSelector } from "react-redux";
import { DienteAdulto } from "../../models/DienteAdulto";
import handleHallazgo from "../../util/hallazgo";
import { actualizar_diente } from "../../appRedux/actions/DientePrueba";

const ModalDienteSimple = (props) => {
  const { abrirModal, setAbrirModal, numero, hallazgo } = props;
  const [dataEspecificacion, setDataEspecificacion] = useState("");

  const stateDiente = new DienteAdulto();
  const v = useSelector(state => state.dientePrueba.diente);
  stateDiente.importar(v);
  const dispatch = useDispatch();

  /////////
  const agregarHallazgo = () => {
    const data = handleHallazgo(hallazgo, numero, dataEspecificacion, stateDiente);
    console.log("Agregando hallazzgo: ", data);
    setAbrirModal(false);
    const data1 = data.exportar();
    dispatch(actualizar_diente(data1));
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
    },
    {
      title: "Diente",
      dataIndex: "diente",
    },
    {
      title: "Diente Final",
      dataIndex: "dienteFinal",
    },
    {
      title: "Estado",
      dataIndex: "estado",
    },
    {
      title: "Dibujo",
      dataIndex: "dibujo",
    },
    {
      title: "Especificaciones",
      dataIndex: "especificaciones",
    },
    {
      title: "",
      key: "borrar",
      render: (e) => (
        <Button
          className="gx-btn-danger"
          style={{ margin: '0px', padding: '4px 10px 0 10px' }}
          onClick={() => {
            stateDiente.eliminarDetalle(e);
            const data1 = stateDiente.exportar();
            dispatch(actualizar_diente(data1));
          }}
        >
          <i className="icon icon-trash" />
        </Button>
      ),
    },
  ];
  console.log(stateDiente);
  const data = stateDiente.getDetalles(numero, stateDiente);

  //Condición para retornar el modal Agregar Hallazgo o Listar Hallazgo
  if (hallazgo) {
    console.log("if", hallazgo);
    return (
      <Modal
        title={`Agregar Hallazgo - ${numero}`}
        visible={abrirModal}
        onOk={() => agregarHallazgo()}
        onCancel={() => setAbrirModal(false)}
      >
        <Form layout="vertical">
          <Row style={{ flexDirection: "row" }}>
            <Col lg={12} md={12} sm={12} xs={24}>
              <Form.Item name="Hallazgo" label="Hallazgo">
                <Input
                  type="text"
                  disabled={true}
                  value={hallazgo}
                  placeholder={hallazgo}
                />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={12} xs={24}>
              <Form.Item name="diente" label="N° de Diente">
                <Input
                  type="text"
                  disabled={true}
                  value={numero}
                  placeholder={numero}
                />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={12} xs={24}>
              <Form.Item name="diagnostico" label="Diagnóstico">
                <TextArea
                  type="text"
                  cols="60"
                  rows="3"
                  value={dataEspecificacion}
                  onChange={(e) => setDataEspecificacion(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  } else {
    return (
      <Modal
        title="Lista de Hallazasdsdadsagos"
        visible={abrirModal}
        onOk={() => setAbrirModal(false)}
        okText="Cerrar"
        onCancel={() => setAbrirModal(false)}
        width="60%"
      >
        <Table
          className="gx-table-responsive"
          columns={columns}
          dataSource={data}
        />
      </Modal>
    );
  }
};

export default ModalDienteSimple;
