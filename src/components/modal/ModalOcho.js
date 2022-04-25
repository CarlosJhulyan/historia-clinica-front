import React, { useState } from 'react';
import { Col, Modal, Row, Form, Input } from "antd";
import { DienteAdulto } from '../../models/DienteAdulto';
import { useDispatch, useSelector } from 'react-redux';
import handleHallazgo from '../../util/hallazgo';
import { actualizar_diente } from '../../appRedux/actions/DientePrueba';

export const ModalOcho = (props) => {
    const { TextArea } = Input;
    /* 'Movilidad Patológica' || 'Posicion Dentaria': */
    const { hallazgo, numero, abrirModal, setAbrirModal, tipo } = props;
    const [dataEspecificacion, setDataEspecificacion] = useState("");
    const sigla = tipo.split(': ',)[0];

    // redux
    const stateDiente = new DienteAdulto();
    const v = useSelector(state => state.dientePrueba.diente);
    stateDiente.importar(v);
    const dispatch = useDispatch();
    // redux

    const agregarHallazgo = () => {
        const data = {
            tipo: sigla,
            diente: numero,
            diagnostico: dataEspecificacion
        };
        //Actualizar redux
        const newStateDiente = handleHallazgo(hallazgo, data, stateDiente);
        const rawData = newStateDiente.exportar();
        dispatch(actualizar_diente(rawData));
        //Actualizar redux
        console.log('Modal 8: ', rawData);
        setAbrirModal(false);
    }


    return (
        <Modal
            title={'Agregar Hallazgo'}
            visible={abrirModal}
            onOk={() => agregarHallazgo()}
            width="35%"
            onCancel={() => setAbrirModal(false)}>

            <Form layout="vertical">
                <Row style={{ flexDirection: "row" }}>
                    <Col lg={13} md={12} sm={12} xs={24}>
                        <Form.Item name="Hallazgo" label="Hallazgo">
                            <Input
                                type="text"
                                disabled={true}
                                value={hallazgo}
                                placeholder={hallazgo}
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={6} md={12} sm={12} xs={24}>
                        <Form.Item name="diente" label="N° de Diente">
                            <Input
                                type="text"
                                disabled={true}
                                value={numero}
                                placeholder={numero}
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={5} md={12} sm={12} xs={24}>
                        <Form.Item name="sigla" label="Sigla">
                            <Input
                                type="text"
                                disabled={true}
                                value={sigla}
                                placeholder={sigla}
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={24} md={12} sm={12} xs={24}>
                        <Form.Item name="diagnostico" label="Diagnóstico">
                            <TextArea
                                type="text"
                                cols="50"
                                rows="4"
                                value={dataEspecificacion}
                                onChange={(e) => setDataEspecificacion(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form >
        </Modal >
    )
}
