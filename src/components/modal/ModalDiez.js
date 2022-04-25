import React, { useEffect, useState } from 'react';
import { Col, Modal, Row, Form, Input, Checkbox, Radio } from "antd";
import { opciones } from '../../models/opciones';
import { DIENTE_MOLAR, DIENTE_PREMOLAR_LLENO_DOS, DIENTE_PREMOLAR_LLENO_UNO, DIENTE_PREMOLAR_VACIO_DOS, DIENTE_PREMOLAR_VACIO_UNO, DIENTE_MOLAR_INV, DIENTE_PREMOLAR_INV } from '../../constants/TipoDiente';
import { DIENTES } from '../../constants/Dientes';
import { estado } from '../../constants/Odontograma';
import { DienteAdulto } from '../../models/DienteAdulto';
import { useDispatch, useSelector } from 'react-redux';
import handleHallazgo from '../../util/hallazgo';
import { actualizar_diente } from '../../appRedux/actions/DientePrueba';

export const ModalDiez = (props) => {
    const { TextArea } = Input;
    /* 'Restauración Temporal' || 'Sellantes'*/
    const { hallazgo, numero, abrirModal, setAbrirModal, mostrarEstados, tipoDiente, modoInferior } = props;
    const [dataEspecificacion, setDataEspecificacion] = useState("");
    const [partes, setPartes] = useState({
        vestibular: false,
        palatino: false,
        mesial: false,
        distal: false,
    });

    const [partesBuenEstado, setPartesBuenEstado] = useState({
        vestibular: true,
        palatino: true,
        mesial: true,
        distal: true
    });
    const esTipo1 = () => {
        console.log(tipoDiente);
        const tipos1 = [DIENTE_MOLAR, DIENTE_PREMOLAR_VACIO_DOS, DIENTE_PREMOLAR_VACIO_UNO, DIENTE_PREMOLAR_LLENO_UNO, DIENTE_PREMOLAR_LLENO_DOS, DIENTE_MOLAR_INV, DIENTE_PREMOLAR_INV];
        return tipos1.includes(tipoDiente);
    };
    const getImagenAzul = () => {
        const superior = opciones.restauracionTemporal.imagenes.superior;
        const inferior = opciones.restauracionTemporal.imagenes.inferior;
        if (esTipo1()) {
            return modoInferior ? inferior.tipo1_azul : superior.tipo1_azul;
        } else {
            return modoInferior ? inferior.tipo2_azul : superior.tipo2_azul;
        }
    }
    const getImagenRojo = () => {
        const superior = opciones.restauracionTemporal.imagenes.superior;
        const inferior = opciones.restauracionTemporal.imagenes.inferior;
        if (esTipo1()) {
            return modoInferior ? inferior.tipo1_rojo : superior.tipo1_rojo;
        } else {
            return modoInferior ? inferior.tipo2_rojo : superior.tipo2_rojo;
        }
    }
    const restauracionTemporalAzul = getImagenAzul();

    const restauracionTemporalRojo = getImagenRojo();

    const getEstado = (value) => value ? estado.bueno : estado.malo;
    // redux
    const stateDiente = new DienteAdulto();
    const v = useSelector(state => state.dientePrueba.diente);
    stateDiente.importar(v);
    const dispatch = useDispatch();
    // redux
    const agregarHallazgo = () => {
        let data = {
            partes: partes,
            diente: numero,
            diagnostico: dataEspecificacion
        }
        if (mostrarEstados) {
            for (const property in partes) {
                data.partes[property] = { activo: partes[property], estado: partes[property] ? getEstado(partesBuenEstado[property]) : null }
            }
        }
        console.log('Modal 10', data);

        //Actualizar redux
        const newStateDiente = handleHallazgo(hallazgo, data, stateDiente);
        const rawData = newStateDiente.exportar();
        dispatch(actualizar_diente(rawData));
        //Actualizar redux
        setAbrirModal(false);
    }


    useEffect(() => {
        if (esTipo1()) {
            setPartes({
                ...partes,
                oclusal: false
            });
            setPartesBuenEstado({
                ...partes,
                oclusal: true
            })
        }
    }, []);
    const obtenerPartes = () => {
        let partesComp = [];
        for (const property in partes) {
            //RECORREMOS LOS INDEX DE LAS PARTES QUE SON IGUALES A LAS OPCIONES
            if (partes[property]) {
                console.log(property, ' PARTE : ', partes[property]);
                if (partesBuenEstado[property] !== undefined) {
                    if (partesBuenEstado[property]) {
                        console.log('pintar ', property, 'BUEN ESTADO');
                        if (mostrarEstados) {
                            partesComp.push(<img src={restauracionTemporalAzul[property]} alt={property} className="absolute" />);
                        } else {
                            partesComp.push(<img src={restauracionTemporalRojo[property]} alt={property} className="absolute" />);
                        }
                    } else {
                        console.log('pintar ', property, 'MAL ESTADO');
                        partesComp.push(<img src={restauracionTemporalRojo[property]} alt={property} className="absolute" />);
                    }
                }
            }
        }
        return partesComp;
    }
    const changeEstado = (parte, value) => setPartesBuenEstado({ ...partesBuenEstado, [parte]: value });
    const handleVestibular = (vestibular) => { setPartes({ ...partes, vestibular }); changeEstado('vestibular', vestibular); };
    const handlePalatino = (palatino) => { setPartes({ ...partes, palatino }); changeEstado('palatino', palatino); };
    const handleDistal = (distal) => { setPartes({ ...partes, distal }); changeEstado('distal', distal); };
    const handleMesial = (mesial) => { setPartes({ ...partes, mesial }); changeEstado('mesial', mesial); };
    const handleOclusal = (oclusal) => { setPartes({ ...partes, oclusal }); changeEstado('oclusal', oclusal); };

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

    return (
        <Modal
            title={'Agregar Hallazgo Diez'}
            visible={abrirModal}
            onOk={() => agregarHallazgo()}
            onCancel={() => setAbrirModal(false)}
            width="35%">
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
                        <div>Seleccione las partes</div>
                        <Row lg={24} style={{ flexDirection: 'row' }}>
                            <Col lg={5} /* style={{ backgroundColor: 'green[500]' }} */>
                                {dibujarDiente()}
                            </Col>
                            <Col lg={19} /* style={{ backgroundColor: 'red' }} */>
                                <Row style={{ flexDirection: 'row' }}>
                                    <Col lg={9}>
                                        <Checkbox onChange={(e) => handleVestibular(e.target.checked)} >Vestibular</Checkbox>
                                    </Col>
                                    {
                                        (partes.vestibular && mostrarEstados
                                            ? <Col lg={15} >
                                                <div>
                                                    <Radio.Group>
                                                        <Radio onChange={(e) => changeEstado('vestibular', e.target.checked)} defaultChecked={true}>Buen Estado</Radio>
                                                        <Radio onChange={(e) => changeEstado('vestibular', !e.target.checked)} value="Mal">Mal Estado</Radio>
                                                    </Radio.Group>
                                                </div>
                                            </Col>
                                            : <div></div>)
                                    }
                                </Row>

                                <Row style={{ flexDirection: 'row' }}>
                                    {
                                        modoInferior
                                            ? <Col lg={9}>
                                                <Checkbox onChange={(e) => handlePalatino(e.target.checked)}>Lingual</Checkbox>
                                            </Col>
                                            : <Col lg={9}>
                                                <Checkbox onChange={(e) => handlePalatino(e.target.checked)}>Palatino</Checkbox>
                                            </Col>
                                    }

                                    {
                                        (partes.palatino && mostrarEstados
                                            ? <Col lg={15} >
                                                <div>
                                                    <Radio.Group>
                                                        <Radio onChange={(e) => changeEstado('palatino', e.target.checked)} defaultChecked={true}>Buen Estado</Radio>
                                                        <Radio onChange={(e) => changeEstado('palatino', !e.target.checked)} value="Mal">Mal Estado</Radio>
                                                    </Radio.Group>
                                                </div>
                                            </Col>
                                            : <div></div>)
                                    }
                                </Row>

                                <Row style={{ flexDirection: 'row' }}>
                                    <Col lg={9}>
                                        <Checkbox onChange={(e) => handleDistal(e.target.checked)}>Distal</Checkbox>
                                    </Col>
                                    {
                                        (partes.distal && mostrarEstados
                                            ? <Col lg={15} >
                                                <div>
                                                    <Radio.Group>
                                                        <Radio onChange={(e) => changeEstado('distal', e.target.checked)} defaultChecked={true}>Buen Estado</Radio>
                                                        <Radio onChange={(e) => changeEstado('distal', !e.target.checked)} value="Mal">Mal Estado</Radio>
                                                    </Radio.Group>
                                                </div>
                                            </Col>
                                            : <div></div>)
                                    }
                                </Row>

                                <Row style={{ flexDirection: 'row' }}>
                                    <Col lg={9}>
                                        <Checkbox onChange={(e) => handleMesial(e.target.checked)}>Mesial</Checkbox>
                                    </Col>
                                    {
                                        (partes.mesial && mostrarEstados
                                            ? <Col lg={15} >
                                                <div>
                                                    <Radio.Group>
                                                        <Radio onChange={(e) => changeEstado('mesial', e.target.checked)} defaultChecked={true}>Buen Estado</Radio>
                                                        <Radio onChange={(e) => changeEstado('mesial', !e.target.checked)} value="Mal">Mal Estado</Radio>
                                                    </Radio.Group>
                                                </div>
                                            </Col>
                                            : <div></div>)
                                    }
                                </Row>

                                {esTipo1() ? <Row style={{ flexDirection: 'row' }}>
                                    <Col lg={9}>
                                        <Checkbox onChange={(e) => handleOclusal(e.target.checked)}>Oclusal</Checkbox>
                                    </Col>
                                    {
                                        (partes.oclusal && mostrarEstados
                                            ? <Col lg={15} >
                                                <div>
                                                    <Radio.Group>
                                                        <Radio onChange={(e) => changeEstado('oclusal', e.target.checked)} defaultChecked={true}>Buen Estado</Radio>
                                                        <Radio onChange={(e) => changeEstado('oclusal', !e.target.checked)} value="Mal">Mal Estado</Radio>
                                                    </Radio.Group>
                                                </div>
                                            </Col>
                                            : <div></div>)
                                    }
                                </Row> : null}
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
