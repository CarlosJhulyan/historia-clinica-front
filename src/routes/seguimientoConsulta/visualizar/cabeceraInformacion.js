import React, { useState, useEffect } from 'react';
import { Col, Row } from 'antd';



const CabeceraInformacion = ({ datosModal }) => {


    const [estado, setEstado] = useState();

    useEffect(() => {
        if (datosModal.estado) {
            setEstado({ ...datosModal.estado });
        }
    }, [datosModal, setEstado]);
    return (
        <div style={{ padding: '20px 20px 0 20px' }}>
            <Row style={{ flexDirection: 'row', paddingBottom: '10px' }}>
                <Col xl={24} lg={20} md={24} sm={24} xs={24}>
                    <Row style={{ flexDirection: 'row' }}>
                        <Col lg={5} md={8} sm={12} xs={24}>
                            <h4 style={{ fontWeight: 'bold', fontSize: '17px' }}>NOMBRE Y APELLIDO:</h4>
                        </Col>
                        <Col lg={9} md={16} sm={12} xs={24}>
                            <h4>
                                {estado ? estado.NOMBRE : null} {estado ? estado.APE_PATERNO : null}{' '}
                                {estado ? estado.APE_MATERNO : null}
                            </h4>
                        </Col>
                        <Col lg={5} md={8} sm={12} xs={24}>
                            <h4 style={{ fontWeight: 'bold', fontSize: '17px' }}>HISTORIA CLÍNICA:</h4>
                        </Col>
                        <Col lg={5} md={16} sm={12} xs={24}>
                            <h4>{estado ? estado.NRO_HC_ACTUAL : null}</h4>
                        </Col>
                        <Col lg={5} md={8} sm={12} xs={24}>
                            <h4 style={{ fontWeight: 'bold', fontSize: '17px' }}>TIPO DOCUMENTO:</h4>
                        </Col>
                        <Col lg={9} md={16} sm={12} xs={24}>
                            {estado ? <h4> {estado.COD_TIP_DOCUMENTO.trim() === "01" ? 'DNI' : 'OTRO'} </h4> : null}
                        </Col>
                        <Col lg={5} md={8} sm={12} xs={24}>
                            <h4 style={{ fontWeight: 'bold', fontSize: '17px' }}>FECHA NACIMIENTO:</h4>
                        </Col>
                        <Col lg={5} md={16} sm={12} xs={24}>
                            <h4>{estado ? estado.FEC_NAC_CLI : null}</h4>
                        </Col>
                        <Col lg={5} md={8} sm={12} xs={24}>
                            <h4 style={{ fontWeight: 'bold', fontSize: '17px' }}>NRO. DOCUMENTO:</h4>
                        </Col>
                        <Col lg={9} md={16} sm={12} xs={24}>
                            <h4>{estado ? estado.NUM_DOCUMENTO : null}</h4>
                        </Col>
                        <Col lg={5} md={8} sm={12} xs={24}>
                            <h4 style={{ fontWeight: 'bold', fontSize: '17px' }}>EDAD:</h4>
                        </Col>
                        <Col lg={5} md={16} sm={12} xs={24}>
                            <h4>{estado ? estado.EDAD : null}</h4>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default CabeceraInformacion;
