import { Row, Col, Divider } from 'antd';
import rojo from '../../assets/impresiones/rojo.jpg';
import azul from '../../assets/impresiones/azul.jpg';
import { useSelector } from 'react-redux';

export const ImpresionRecetas = ({ datosModal, firma, cmp }) => {
    const fuente = 17;
    const espacios = 35;
    const backgroundRojo = '#FF9999';
    const backgroundAzul = '#CCCCCC';

    console.log('DAAAAAATAAAAAAAAAAAA7777777777:', datosModal);
    console.log('FIIIIIIIIIIIIIIIRMAA4:', firma);

    const sinRegistro = "No hay indicaciones";

    //Data del Redux
    const { tipo } = useSelector(state => state.anexo);
    const tratamientoDetalle = useSelector(state => state.tratamientoDetalle);
    const tratamiento = useSelector(state => state.tratamiento);

    return (
        <div>
            <div id="pagina1">
                <div style={{ position: 'relative' }}>
                    <img alt="hoja membreatada" src={tipo === 'N' ? rojo : azul}></img>

                    <div
                        style={{
                            position: 'absolute',
                            top: 170,
                            left: 16,
                            fontSize: fuente,
                            width: '1208px',
                            paddingLeft: 16,
                            paddingRight: 16,
                        }}
                    >
                        <div style={{ width: '100%', textAlign: 'center', paddingRight: 50 }}>
                            <strong style={{ fontSize: '30px' }}>RECETA</strong>
                        </div>
                        <Row style={{ marginTop: 20 }}>
                            <Col xs={8}>
                                <strong>OA : </strong> {datosModal.estado.dataMedico.NUM_ATEN_MED}
                            </Col>
                            <Col xs={8}>
                                <strong>FECHA : </strong> {datosModal.estado.dataMedico.FEC_CREA}
                            </Col>
                            <Col xs={8}>
                                <strong>HORA : </strong> {datosModal.estado.dataMedico.FEC_CREA_HORA}
                            </Col>
                        </Row>

                        <Row style={{ marginTop: espacios - 10 }}>
                            <Col xs={24}>
                                <strong>PACIENTE :</strong> {datosModal.estado.NUM_DOCUMENTO} - {datosModal.estado.dataMedico.NOMBRE}
                            </Col>
                        </Row>
                        <Row style={{ marginTop: espacios - 10 }}>
                            <Col xs={16}>
                                <strong>TITULAR : </strong> {datosModal.estado.dataMedico.NOMBRE}
                            </Col>
                            <Col xs={8}>
                                <strong>VIGENCIA : </strong>
                                {datosModal.estado.dataMedico.FEC_CREA} {tratamiento.validezreceta !== "" ? " AL " + tratamiento.validezreceta : ""}
                            </Col>
                        </Row>
                        <Row style={{ marginTop: espacios - 10 }}>
                            <Col xs={12}>
                                <strong>MÉDICO :</strong> {cmp !== "" ? cmp + " - " : ''} {datosModal.estado.dataMedico.MEDICO}
                            </Col>
                        </Row>
                        <Row
                            style={{
                                marginTop: espacios + 10,
                                paddingTop: 10,
                                paddingBottom: 10,
                                backgroundColor: tipo === 'N' ? backgroundRojo : backgroundAzul,
                            }}
                        >
                            <Col xs={24}>
                                <strong>1. MEDICAMENTOS</strong>
                            </Col>
                        </Row>

                        {/* ------------------------------------ TRATAMIENTOS------------------------------------*/}
                        {
                            tratamientoDetalle.length > 0

                                ? tratamientoDetalle.map((tratamiento, index) => {

                                    if (index <= 2) {
                                        return (
                                            <div>
                                                <Row style={{ marginTop: espacios, marginLeft: 10 }}>
                                                    <Col xs={24}>
                                                        <strong>MEDICAMENTO</strong>
                                                    </Col>
                                                </Row>

                                                <Row style={{ marginTop: espacios - 20, marginLeft: 30 }}>
                                                    <Col xs={24}>
                                                        <strong style={{ fontWeight: 600 }}>DCI: </strong> {tratamiento.descprod}
                                                    </Col>
                                                </Row>

                                                <Row style={{ marginTop: espacios - 30, marginLeft: 30 }}>
                                                    <Col xs={24}>
                                                        <strong style={{ fontWeight: 600 }}>U/M: </strong>{tratamiento.unidvta}
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: espacios - 30, marginLeft: 30 }}>
                                                    <Col xs={8}>
                                                        <strong style={{ fontWeight: 600 }}>DOSIS: </strong>{tratamiento.dosis}
                                                    </Col>
                                                    <Col xs={8}>
                                                        <strong style={{ fontWeight: 600 }}>CADA: </strong> {tratamiento.frecuencia} HRS
                                                    </Col>
                                                    <Col xs={8}>
                                                        <strong style={{ fontWeight: 600 }}>VIA: </strong>{tratamiento.etiquetaVia}
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: espacios - 30, marginLeft: 30 }}>
                                                    <Col xs={8}>
                                                        <strong style={{ fontWeight: 600 }}>DIAS: </strong>{tratamiento.duracion}
                                                    </Col>
                                                    <Col xs={8}>
                                                        <strong style={{ fontWeight: 600 }}>CANTIDAD: </strong>{tratamiento.cantidad}
                                                    </Col>
                                                </Row>
                                                <Row style={{ marginTop: espacios - 20, marginLeft: 10 }}>
                                                    <Col xs={24}>
                                                        <strong>INDICACIONES</strong>
                                                    </Col>
                                                    <Col xs={24}>
                                                        - {tratamiento.recomendacionAplicar !== "" ? tratamiento.recomendacionAplicar : sinRegistro}
                                                    </Col>
                                                </Row>
                                                <DividerPersonalizado espacios={espacios} />
                                            </div>
                                        );
                                    } else {
                                        return null;
                                    }

                                })


                                : <Row style={{ marginTop: espacios, marginLeft: 10 }}>
                                    <Col xs={24}>
                                        <strong>NO SE ENCONTRARON MEDICAMENTOS</strong>
                                    </Col>
                                </Row>
                        }

                        {
                            tratamientoDetalle.length > 0 && tratamientoDetalle.length <= 3
                            &&
                            <Row style={{ marginTop: espacios, marginLeft: 10 }}>
                                <Col xs={24}>
                                    <strong>INDICACIONES GENERALES</strong>
                                </Col>
                                <Col xs={24}>
                                    1. {tratamiento.indicacionesgen.trim() !== "" ? tratamiento.indicacionesgen : sinRegistro}
                                </Col>
                            </Row>
                        }
                    </div>

                    {
                        tratamientoDetalle.length > 0 && tratamientoDetalle.length <= 3
                        &&
                        < div style={{ position: 'absolute', bottom: 200, width: '100%' }}>
                            <Row
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    padding: 5,
                                    textAlign: 'center',
                                    width: '35%',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}
                            >
                                <Col xs={24}>
                                    <img alt="firma" src={firma} style={{ width: '200px' }} />
                                </Col>
                                <Col xs={24}>
                                    <h3 style={{ borderTop: '2px solid #000' }}>
                                        <strong>MÉDICO: </strong>
                                        {datosModal.estado.dataMedico.MEDICO}{' '}
                                    </h3>
                                </Col>
                            </Row>
                        </div>
                    }

                </div>
            </div>

            {tratamientoDetalle.length > 3
                &&
                <div id="pagina2">
                    <div style={{ position: 'relative' }}>
                        <img alt="hoja membreatada" src={tipo === 'N' ? rojo : azul} />
                        <div
                            style={{
                                position: 'absolute',
                                top: 170,
                                left: 16,
                                fontSize: fuente,
                                width: '1208px',
                                paddingLeft: 16,
                                paddingRight: 16,
                            }}>
                            <div style={{ width: '100%', textAlign: 'center', paddingRight: 50 }}>
                                <strong style={{ fontSize: '30px' }}>RECETA</strong>
                            </div>

                            {
                                tratamientoDetalle.length > 3
                                    ? tratamientoDetalle.map((tratamiento, index) => {
                                        if (index > 2 && index <= 6) {
                                            return (
                                                <div>
                                                    <Row style={{ marginTop: espacios, marginLeft: 10 }}>
                                                        <Col xs={24}>
                                                            <strong>MEDICAMENTO</strong>
                                                        </Col>
                                                    </Row>

                                                    <Row style={{ marginTop: espacios - 20, marginLeft: 30 }}>
                                                        <Col xs={24}>
                                                            <strong style={{ fontWeight: 600 }}>DCI: </strong> {tratamiento.descprod}
                                                        </Col>
                                                    </Row>

                                                    <Row style={{ marginTop: espacios - 30, marginLeft: 30 }}>
                                                        <Col xs={24}>
                                                            <strong style={{ fontWeight: 600 }}>U/M: </strong>{tratamiento.unidvta}
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: espacios - 30, marginLeft: 30 }}>
                                                        <Col xs={8}>
                                                            <strong style={{ fontWeight: 600 }}>DOSIS: </strong>{tratamiento.dosis}
                                                        </Col>
                                                        <Col xs={8}>
                                                            <strong style={{ fontWeight: 600 }}>CADA: </strong> {tratamiento.frecuencia} HRS
                                                        </Col>
                                                        <Col xs={8}>
                                                            <strong style={{ fontWeight: 600 }}>VIA: </strong>{tratamiento.etiquetaVia}
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: espacios - 30, marginLeft: 30 }}>
                                                        <Col xs={8}>
                                                            <strong style={{ fontWeight: 600 }}>DIAS: </strong>{tratamiento.duracion}
                                                        </Col>
                                                        <Col xs={8}>
                                                            <strong style={{ fontWeight: 600 }}>CANTIDAD: </strong>{tratamiento.cantidad}
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: espacios - 20, marginLeft: 10 }}>
                                                        <Col xs={24}>
                                                            <strong>INDICACIONES</strong>
                                                        </Col>
                                                        <Col xs={24}>
                                                            - {tratamiento.recomendacionAplicar !== "" ? tratamiento.recomendacionAplicar : sinRegistro}
                                                        </Col>
                                                    </Row>
                                                    <DividerPersonalizado espacios={espacios} />
                                                </div>
                                            );
                                        } else {
                                            return null;
                                        }

                                    })

                                    : <Row style={{ marginTop: espacios, marginLeft: 10 }}>
                                        <Col xs={24}>
                                            <strong>NO SE ENCONTRARON MEDICAMENTOS</strong>
                                        </Col>
                                    </Row>
                            }

                            {
                                tratamientoDetalle.length > 3 && tratamientoDetalle.length <= 7
                                &&
                                <Row style={{ marginTop: espacios, marginLeft: 10 }}>
                                    <Col xs={24}>
                                        <strong>INDICACIONES GENERALES</strong>
                                    </Col>
                                    <Col xs={24}>
                                        1. {tratamiento.indicacionesgen.trim() !== "" ? tratamiento.indicacionesgen : sinRegistro}
                                    </Col>
                                </Row>
                            }

                        </div>

                        {
                            tratamientoDetalle.length > 3 && tratamientoDetalle.length <= 7
                            &&
                            <div style={{ position: 'absolute', bottom: 300, width: '100%' }}>
                                <Row
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        padding: 5,
                                        textAlign: 'center',
                                        width: '35%',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        // marginTop: '300px',
                                    }}
                                >
                                    <Col xs={24}>
                                        <img alt="firma" src={firma} style={{ width: '200px' }} />
                                    </Col>
                                    <Col xs={24}>
                                        <h3 style={{ borderTop: '2px solid #000' }}>
                                            <strong>MÉDICO: </strong>
                                            {datosModal.estado.dataMedico.MEDICO}{' '}
                                        </h3>
                                    </Col>
                                </Row>
                            </div>
                        }

                    </div>
                </div>
            }

            {
                tratamientoDetalle.length > 7
                &&
                <div id="pagina2">
                    <div style={{ position: 'relative' }}>
                        <img alt="hoja membreatada" src={tipo === 'N' ? rojo : azul} />
                        <div
                            style={{
                                position: 'absolute',
                                top: 170,
                                left: 16,
                                fontSize: fuente,
                                width: '1208px',
                                paddingLeft: 16,
                                paddingRight: 16,
                            }}>
                            <div style={{ width: '100%', textAlign: 'center', paddingRight: 50 }}>
                                <strong style={{ fontSize: '30px' }}>RECETA</strong>
                            </div>

                            {
                                tratamientoDetalle.length > 7
                                    ? tratamientoDetalle.map((tratamiento, index) => {
                                        console.log('TRATAMIENTO123312132:', tratamiento);
                                        console.log("INDEX132312132312:", index);
                                        if (index > 6 && index <= 10) {
                                            return (
                                                <div>
                                                    <Row style={{ marginTop: espacios, marginLeft: 10 }}>
                                                        <Col xs={24}>
                                                            <strong>MEDICAMENTO</strong>
                                                        </Col>
                                                    </Row>

                                                    <Row style={{ marginTop: espacios - 20, marginLeft: 30 }}>
                                                        <Col xs={24}>
                                                            <strong style={{ fontWeight: 600 }}>DCI: </strong> {tratamiento.descprod}
                                                        </Col>
                                                    </Row>

                                                    <Row style={{ marginTop: espacios - 30, marginLeft: 30 }}>
                                                        <Col xs={24}>
                                                            <strong style={{ fontWeight: 600 }}>U/M: </strong>{tratamiento.unidvta}
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: espacios - 30, marginLeft: 30 }}>
                                                        <Col xs={8}>
                                                            <strong style={{ fontWeight: 600 }}>DOSIS: </strong>{tratamiento.dosis}
                                                        </Col>
                                                        <Col xs={8}>
                                                            <strong style={{ fontWeight: 600 }}>CADA: </strong> {tratamiento.frecuencia} HRS
                                                        </Col>
                                                        <Col xs={8}>
                                                            <strong style={{ fontWeight: 600 }}>VIA: </strong>{tratamiento.etiquetaVia}
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: espacios - 30, marginLeft: 30 }}>
                                                        <Col xs={8}>
                                                            <strong style={{ fontWeight: 600 }}>DIAS: </strong>{tratamiento.duracion}
                                                        </Col>
                                                        <Col xs={8}>
                                                            <strong style={{ fontWeight: 600 }}>CANTIDAD: </strong>{tratamiento.cantidad}
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ marginTop: espacios - 20, marginLeft: 10 }}>
                                                        <Col xs={24}>
                                                            <strong>INDICACIONES</strong>
                                                        </Col>
                                                        <Col xs={24}>
                                                            - {tratamiento.recomendacionAplicar !== "" ? tratamiento.recomendacionAplicar : sinRegistro}
                                                        </Col>
                                                    </Row>
                                                    <DividerPersonalizado espacios={espacios} />
                                                </div>
                                            );
                                        } else {
                                            return null;
                                        }

                                    })

                                    : <Row style={{ marginTop: espacios, marginLeft: 10 }}>
                                        <Col xs={24}>
                                            <strong>NO SE ENCONTRARON MEDICAMENTOS</strong>
                                        </Col>
                                    </Row>
                            }


                            {
                                tratamientoDetalle.length > 7 && tratamientoDetalle.length <= 11
                                &&
                                <Row style={{ marginTop: espacios, marginLeft: 10 }}>
                                    <Col xs={24}>
                                        <strong>INDICACIONES GENERALES</strong>
                                    </Col>
                                    <Col xs={24}>
                                        1. {tratamiento.indicacionesgen.trim() !== "" ? tratamiento.indicacionesgen : sinRegistro}
                                    </Col>
                                </Row>
                            }
                        </div>


                        {
                            tratamientoDetalle.length > 7 && tratamientoDetalle.length <= 11
                            &&
                            <div style={{ position: 'absolute', bottom: 300, width: '100%' }}>
                                <Row
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        padding: 5,
                                        textAlign: 'center',
                                        width: '35%',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                    }}
                                >
                                    <Col xs={24}>
                                        <img alt="firma" src={firma} style={{ width: '200px' }} />
                                    </Col>
                                    <Col xs={24}>
                                        <h3 style={{ borderTop: '2px solid #000' }}>
                                            <strong>MÉDICO: </strong>
                                            {datosModal.estado.dataMedico.MEDICO}{' '}
                                        </h3>
                                    </Col>
                                </Row>
                            </div>
                        }

                    </div>
                </div>
            }
        </div >
    );
};

const DividerPersonalizado = ({ espacios }) => {
    return (
        <Col xs={24} style={{ textAling: 'center', paddingTop: espacios - 30 }}>
            <Divider style={{ borderTop: '3px dotted rgba(0, 0, 0, 0.55)' }}></Divider>
        </Col>
    );
};
