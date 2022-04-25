import React, { useState } from 'react';
import { Col, Modal, Row, Form, Input } from "antd";
import { estado as constEstado } from '../../constants/Odontograma';
import { DienteAdulto } from '../../models/DienteAdulto';
import { useDispatch, useSelector } from 'react-redux';
import handleHallazgo from '../../util/hallazgo';
import { actualizar_diente } from '../../appRedux/actions/DientePrueba';

export const ModalSeis = (props) => {
    const { TextArea } = Input;
    /* Espigo Muñon, Implante Dental */
    const { hallazgo, numero, abrirModal, setAbrirModal, estado } = props;
    const [dataEspecificacion, setDataEspecificacion] = useState("");

    // redux
    const stateDiente = new DienteAdulto();
    const v = useSelector(state => state.dientePrueba.diente);
    stateDiente.importar(v);
    const dispatch = useDispatch();
    // redux

    const agregarHallazgo = () => {
        const data = {
            estado: (estado === 'Buen Estado') ? constEstado.bueno : constEstado.malo,
            diente: numero,
            diagnostico: dataEspecificacion
        };
        //Actualizar redux
        const newStateDiente = handleHallazgo(hallazgo, data, stateDiente);
        const rawData = newStateDiente.exportar();
        dispatch(actualizar_diente(rawData));
        //Actualizar redux
        console.log('Modal 6: ', data);
        setAbrirModal(false);
    }


    return (
        <Modal
            title={'Agregar Hallazgo Seis'}
            visible={abrirModal}
            onOk={() => agregarHallazgo()}
            width="35%"
            onCancel={() => setAbrirModal(false)}>

            <Form layout="vertical">
                <Row style={{ flexDirection: "row" }}>
                    <Col lg={10} md={12} sm={12} xs={24}>
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
                    <Col lg={8} md={12} sm={12} xs={24}>
                        <Form.Item name="diente" label="Estado">
                            <Input
                                type="text"
                                disabled={true}
                                value={estado}
                                placeholder={estado}
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
