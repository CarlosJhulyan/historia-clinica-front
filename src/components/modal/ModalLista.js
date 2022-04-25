import React from 'react';
import { Modal, Table, Button } from "antd";
import { DienteAdulto } from '../../models/DienteAdulto';
import { useDispatch, useSelector } from 'react-redux';
import { actualizar_diente } from '../../appRedux/actions/DientePrueba';


export const ModalLista = (props) => {
    const { abrirModal, setAbrirModal, numero } = props;

    const stateDiente = new DienteAdulto();
    const v = useSelector(state => state.dientePrueba.diente);
    stateDiente.importar(v);
    const dispatch = useDispatch();


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

    const data = stateDiente.getDetalles(numero, stateDiente);

    return (
        <Modal
            title="Lista de Hallazgos"
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
    )
}
