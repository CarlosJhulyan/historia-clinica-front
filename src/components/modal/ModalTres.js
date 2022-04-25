import React, { useState } from 'react';
import { Col, Modal, Row, Form, Input } from "antd";
import { estado as constEstado } from '../../constants/Odontograma';
import { DienteAdulto } from '../../models/DienteAdulto';
import { useDispatch, useSelector } from 'react-redux';
import handleHallazgo from '../../util/hallazgo';
import { actualizar_diente } from '../../appRedux/actions/DientePrueba';

export const ModalTres = (props) => {
    const { TextArea } = Input;
    //'Corona' || 'Corona Temporal' || 'Defectos de Desarrollo del Esmalte' || 'Tratamiento Pulpar'
    const { hallazgo, numero, abrirModal, setAbrirModal, estado, tipo } = props;
    const [dataEspecificacion, setDataEspecificacion] = useState("");
    const sigla = tipo.split(': ',)[0];
    // redux
    const stateDiente = new DienteAdulto();
    const v = useSelector(state => state.dientePrueba.diente);
    stateDiente.importar(v);
    const dispatch = useDispatch();
    // redux
    const agregarHallazgo = () => {
        let data;
        if (hallazgo === 'Corona Temporal') {
            data = {
                estado: (estado === 'Buen Estado') ? constEstado.bueno : constEstado.malo,
                diente: numero,
                diagnostico: dataEspecificacion
            };
        } else {
            data = {
                tipo: sigla,
                estado: (estado === 'Buen Estado') ? constEstado.bueno : constEstado.malo,
                diente: numero,
                diagnostico: dataEspecificacion
            };
        }

        //Actualizar redux
        const newStateDiente = handleHallazgo(hallazgo, data, stateDiente);
        const rawData = newStateDiente.exportar();
        dispatch(actualizar_diente(rawData));
        //Actualizar redux
        console.log('MODAL 3 ', rawData);
        setAbrirModal(false);

    }
    const splitHallazgo = tipo.split(': ',)[0]

    console.log(splitHallazgo);
    return (
        <Modal
            title={'Agregar Hallazgo'}
            visible={abrirModal}
            width="35%"
            onOk={() => agregarHallazgo()}
            onCancel={() => setAbrirModal(false)}>

            <Form layout="vertical">
                <Row style={{ flexDirection: "row" }}>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item name="Hallazgo" label="Hallazgo">
                            <Input
                                type="text"
                                disabled={true}
                                value={tipo}
                                placeholder={tipo}
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
                        <Form.Item name="sigla" label="Estado">
                            <Input
                                type="text"
                                disabled={true}
                                value={estado}
                                placeholder={estado}
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item name="sigla" label="Sigla">
                            <Input
                                type="text"
                                disabled={true}
                                value={splitHallazgo}
                                placeholder={splitHallazgo}
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
