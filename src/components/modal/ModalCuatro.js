import React, { useState } from 'react';
import { Col, Modal, Row, Form, Input } from "antd";
import { DienteAdulto } from '../../models/DienteAdulto';
import { useDispatch, useSelector } from 'react-redux';
import handleHallazgo from "../../util/hallazgo";
import { actualizar_diente } from '../../appRedux/actions/DientePrueba';


export const ModalCuatro = (props) => {
    const { TextArea } = Input;
    /*
    'Diastema' || 'Fosas y Fisuras Profundas' || 'Fusión' || 'Geminasión' || 'Impactación' || 'Macrodoncia' || 'Microdoncia' ||
      'Pieza Dentaria Ausente' || 'Pieza Dentaria Ectópica' || 'Pieza Dentaria en Clavija' || 'Pieza Dentaria en Erupcion' ||
      'Pieza Dentaria Extruida' || 'Pieza Dentaria Intruida' || 'Pieza Dentaria Supernumeraria' || 'Remanente Radicular' ||
      'Superficie Desgastada' || 'Transposición'
    */
    const { hallazgo, numero, abrirModal, setAbrirModal, } = props;
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
            diagnostico: dataEspecificacion
        }
        //Actualizar redux
        const newStateDiente = handleHallazgo(hallazgo, data, stateDiente);
        const rawData = newStateDiente.exportar();
        dispatch(actualizar_diente(rawData));
        //Actualizar redux
        console.log('Modal 4: ', data);
        setAbrirModal(false);
    };


    return (
        <Modal
            title={'Agregar Hallazgo'}
            visible={abrirModal}
            width="35%"
            onOk={() => agregarHallazgo()}
            onCancel={() => setAbrirModal(false)}>

            <Form layout="vertical">
                <Row style={{ flexDirection: "row" }}>
                    <Col lg={16} md={12} sm={12} xs={24}>
                        <Form.Item name="Hallazgo" label="Hallazgo">
                            <Input
                                type="text"
                                disabled={true}
                                value={hallazgo}
                                placeholder={hallazgo}
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={8} md={12} sm={12} xs={24}>
                        <Form.Item name="diente" label="N° de Diente">
                            <Input
                                type="text"
                                disabled={true}
                                value={numero}
                                placeholder={numero}
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
