import React, { useEffect, useState } from 'react';
import { Checkbox, Col, Form, Input, Modal, Row } from "antd";
import { DIENTE_MOLAR, DIENTE_PREMOLAR_VACIO_DOS, DIENTE_PREMOLAR_VACIO_UNO, DIENTE_PREMOLAR_LLENO_UNO, DIENTE_PREMOLAR_LLENO_DOS, DIENTE_MOLAR_INV, DIENTE_PREMOLAR_INV } from '../../constants/TipoDiente';
import { DIENTES } from '../../constants/Dientes';
import { opciones } from '../../models/opciones';
import { DienteAdulto } from '../../models/DienteAdulto';
import { useDispatch, useSelector } from 'react-redux';
import handleHallazgo from '../../util/hallazgo';
import { actualizar_diente } from '../../appRedux/actions/DientePrueba';

export const ModalDos = (props) => {
    const { TextArea } = Input;
    //'Caries Dental'
    const { hallazgo, numero, abrirModal, setAbrirModal, tipo, tipoDiente, modoInferior } = props;
    console.log(props);

    const [dataEspecificacion, setDataEspecificacion] = useState("");
    //TODO: AQUI AGREGAR LOS DEMAS DIENTES DE TIPO 1
    const esTipo1 = () => {
        console.log(tipoDiente);
        const tipos1 = [DIENTE_MOLAR, DIENTE_PREMOLAR_VACIO_DOS, DIENTE_PREMOLAR_VACIO_UNO, DIENTE_PREMOLAR_LLENO_UNO, DIENTE_PREMOLAR_LLENO_DOS, DIENTE_MOLAR_INV, DIENTE_PREMOLAR_INV];
        return tipos1.includes(tipoDiente);
    };

    const [partes, setPartes] = useState({
        vestibular: false,
        palatino: false,
        mesial: false,
        distal: false
    });
    useEffect(() => {
        if (esTipo1()) {
            setPartes({
                ...partes,
                oclusal: false
            })
        }
    }, []);

    const sigla = tipo.split(':',)[0];
    // redux
    const stateDiente = new DienteAdulto();
    const v = useSelector(state => state.dientePrueba.diente);
    stateDiente.importar(v);
    const dispatch = useDispatch();
    // redux

    const agregarHallazgo = () => {
        const data = {
            tipo: sigla,
            partes: partes,
            diente: numero,
            diagnostico: dataEspecificacion,
        }
        //Actualizar redux
        const newStateDiente = handleHallazgo(hallazgo, data, stateDiente);
        const rawData = newStateDiente.exportar();
        dispatch(actualizar_diente(rawData));
        //Actualizar redux
        console.log(data);
        setAbrirModal(false);
    }


    const getCariesDental = () => {
        const superior = opciones.cariesDental.imagenes.superior;
        const inferior = opciones.cariesDental.imagenes.inferior;
        if (esTipo1()) {
            return modoInferior ? inferior.tipo1 : superior.tipo1;
        } else {
            return modoInferior ? inferior.tipo2 : superior.tipo2;
        }
    }

    const cariesDental = getCariesDental();
    const dibujarDiente = () => {
        return (<div style={{ justifyContent: "center", display: "flex" }}>
            <div className="size-diente">
                <div className="contenedor-diente">
                    {DIENTES[tipoDiente]}
                </div>
                {(obtenerPartes()).map((e, i) => <div key={i}>{e}</div>)}
            </div>
        </div>
        );
    }
    const obtenerPartes = () => {
        let partesComp = [];
        for (const property in partes) {
            //RECORREMOS LOS INDEX DE LAS PARTES QUE SON IGUALES A LAS OPCIONES
            if (partes[property]) {
                partesComp.push(<img src={cariesDental[property]} alt={property} className="absolute" />);
            }
        }
        return partesComp;
    }

    const handleVestibular = (vestibular) => setPartes({ ...partes, vestibular });
    const handlePalatino = (palatino) => setPartes({ ...partes, palatino });
    const handleDistal = (distal) => setPartes({ ...partes, distal });
    const handleMesial = (mesial) => setPartes({ ...partes, mesial });
    const handleOclusal = (oclusal) => setPartes({ ...partes, oclusal });

    return (
        <Modal
            title={'Agregar Hallazgo'}
            visible={abrirModal}
            onOk={() => agregarHallazgo()}
            width="35%"
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
                    <Col lg={6} md={12} sm={12} xs={24}>
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
                        <div>Seleccione las partes</div>
                        <Row lg={24} style={{ flexDirection: 'row' }}>
                            <Col lg={5} /* style={{ backgroundColor: 'green[500]' }} */>
                                {dibujarDiente()}
                            </Col>
                            <Col lg={8} /* style={{ backgroundColor: 'red' }} */>
                                <div>
                                    <Checkbox onChange={(e) => handleVestibular(e.target.checked)}>Vestibular</Checkbox>
                                </div>
                                {
                                    modoInferior
                                        ? <div>
                                            <Checkbox onChange={(e) => handlePalatino(e.target.checked)}>Lingual</Checkbox>
                                        </div>
                                        : <div>
                                            <Checkbox onChange={(e) => handlePalatino(e.target.checked)}>Palatino</Checkbox>
                                        </div>
                                }
                                <div>
                                    <Checkbox onChange={(e) => handleDistal(e.target.checked)}>Distal</Checkbox>
                                </div>
                                <div>
                                    <Checkbox onChange={(e) => handleMesial(e.target.checked)}>Mesial</Checkbox>
                                </div>
                                {esTipo1() ?
                                    <div>
                                        <Checkbox onChange={(e) => handleOclusal(e.target.checked)}>Oclusal</Checkbox>
                                    </div> : null
                                }
                            </Col>
                        </Row>
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
