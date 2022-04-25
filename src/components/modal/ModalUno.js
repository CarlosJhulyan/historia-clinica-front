import React, { useState } from 'react';
import { Col, Modal, Row, Form, Input } from "antd";
import { estado as constEstado } from '../../constants/Odontograma';
import { DienteAdulto } from '../../models/DienteAdulto';
import { useDispatch, useSelector } from 'react-redux';
import handleHallazgo from '../../util/hallazgo';
import { actualizar_diente } from '../../appRedux/actions/DientePrueba';
import { ModalError } from './ModalError';

export const ModalUno = (props) => {
    const { TextArea } = Input;
    //Aparato Orto Fijo - Orto Removible  - Protesis Fija - Protesis Removible - Protesis Total
    const { hallazgo, numero, abrirModal, setAbrirModal, estado, dienteFin, reiniciarDientes } = props;
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
            fin: dienteFin,
            diagnostico: dataEspecificacion,
        }
        try {
            //Actualizar redux
            const newStateDiente = handleHallazgo(hallazgo, data, stateDiente);
            const rawData = newStateDiente.exportar();
            dispatch(actualizar_diente(rawData));
            //Actualizar redux
            console.log('Modal 1: ', data);
            setAbrirModal(false);
            reiniciarDientes();
        } catch (error) {
            console.log(error);
            setAbrirModal(false);
        }

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
                        <Form.Item name="final" label="N° Diente Final">
                            <Input
                                type="text"
                                disabled={true}
                                value={dienteFin}
                                placeholder={dienteFin}
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item name="estado" label="Estado">
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
    )
}
