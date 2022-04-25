import React, { useState } from 'react';
import { Col, Modal, Row, Form, Input } from "antd";
import handleHallazgo from '../../util/hallazgo';
import { actualizar_diente } from '../../appRedux/actions/DientePrueba';
import { DienteAdulto } from '../../models/DienteAdulto';
import { useDispatch, useSelector } from 'react-redux';

export const ModalCinco = (props) => {
    const { TextArea } = Input;
    /* Edentulo Total */
    const { hallazgo, numero, abrirModal, setAbrirModal, dienteFin, reiniciarDientes } = props;
    const [dataEspecificacion, setDataEspecificacion] = useState("");
    // redux
    const stateDiente = new DienteAdulto();
    const v = useSelector(state => state.dientePrueba.diente);
    stateDiente.importar(v);
    const dispatch = useDispatch();
    // redux

    const agregarHallazgo = () => {
        const data = {
            diente: numero,
            fin: dienteFin,
            diagnostico: dataEspecificacion
        };
        console.log('Modal 5: ', data);


        //Actualizar redux
        const newStateDiente = handleHallazgo(hallazgo, data, stateDiente);
        const rawData = newStateDiente.exportar();
        dispatch(actualizar_diente(rawData));
        //Actualizar redux
        setAbrirModal(false);
        reiniciarDientes();
    }


    return (
        <Modal
            title={'Agregar Hallazgo'}
            visible={abrirModal}
            width="35%"
            onOk={() => agregarHallazgo()}
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
                    <Col lg={7} md={12} sm={12} xs={24}>
                        <Form.Item name="diente" label="N° de Diente">
                            <Input
                                type="text"
                                disabled={true}
                                value={numero}
                                placeholder={numero}
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={7} md={12} sm={12} xs={24}>
                        <Form.Item name="diente" label="N° Diente Final">
                            <Input
                                type="text"
                                disabled={true}
                                value={dienteFin}
                                placeholder={dienteFin}
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
