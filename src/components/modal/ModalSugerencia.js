import { Checkbox, Col, Modal, Row } from 'antd'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setImagenesAction } from '../../appRedux/actions/menu/imagenes';
import { setLaboratorioAction } from '../../appRedux/actions/menu/laboratorio';
import { setConsultasProcedimientos, setInterconsultasProcedimiento } from '../../appRedux/actions/menu/procedimiento';
import { setTratamientoCabeceraDetalle } from '../../appRedux/actions/menu/tratamiento';

export const ModalSugerencia = ({ modalSugerencia, setModalSugerencia }) => {

    const dispatch = useDispatch();
    const sugerenciaReducer = useSelector(state => state.sugerenciaReducer);
    const combosReducer = useSelector(state => state.combosReducer);

    const imagenes = useSelector(state => state.imagenes);
    const laboratorio = useSelector(state => state.laboratorio);
    const procedimiento = useSelector(state => state.procedimientoReducer);
    const interconsulta = useSelector(state => state.procedimientoInterconsulta);


    const [tratamientoTemp, setTratamientoTemp] = useState([]);
    const [imagenesTemp, setImagenesTemp] = useState([]);
    const [laboratoriosTemp, setLaboratoriosTemp] = useState([]);
    const [procedimientosTemp, setProcedimientosTemp] = useState([]);
    const [interconsultaTemp, setInterConsultaTemp] = useState([]);


    const onChangeTratamiento = (e) => {
        console.log("TRATAMIENTO", e.target.value);

        const descprod = combosReducer.dataTratamiento.filter(tratamiento => tratamiento.COD_PROD === e.target.value.codprod)[0].DESC_PROD;

        if (e.target.checked) {
            const obj = {
                cantidad: e.target.value.cantidad,
                key: e.target.value.codprod,
                codprod: e.target.value.codprod,
                descprod: descprod,
                rucempresa: e.target.value.rucempresa,
                valfrac: e.target.value.valfrac,
                unidvta: e.target.value.unidvta,
                viaadministracion: e.target.value.vidadministracion,
                etiquetaVia: e.target.value.etiquetavia,
                frecuencia: e.target.value.frecuencia,
                duracion: e.target.value.duracion,
                dosis: e.target.value.dosis,
                recomendacionAplicar: e.target.value.cantidad,
                tratamiento: e.target.value.tratamiento,
            }
            console.log("AAAAAAAAAAAAAA1", e.target.value);
            setTratamientoTemp([...tratamientoTemp, obj]);
        } else {
            console.log("AAAAAAAAAAAAAA122");
            setTratamientoTemp(tratamientoTemp.filter(item => item !== e.target.value));
        }
    }

    const onChangeImagenes = (e) => {
        if (e.target.checked) {
            const obj = {
                key: e.target.value.cod_prod,
                COD_PROD: e.target.value.cod_prod,
                DESC_PROD: e.target.value.desc_prod,
                NOM_LAB: e.target.value.nom_lab,
                RUC: e.target.value.ruc,
            }

            console.log("AAAAAAAAAAAAAA122222222222222", e.target.value);
            setImagenesTemp([...imagenesTemp, obj]);
        } else {
            console.log("AAAAAAAAAAAAAA122");
            setImagenesTemp(imagenesTemp.filter(item => item !== e.target.value));
        }
    }

    const onChangeLaboratorios = (e) => {
        if (e.target.checked) {
            const obj = {
                key: e.target.cod_prod,
                COD_PROD: e.target.cod_prod,
                DESC_PROD: e.target.value.desc_prod,
                NOM_LAB: e.target.value.nom_lab,
                RUC: e.target.value.ruc,
            }
            console.log("AAAAAAAAAAAAAA1LAB", e.target.value);
            setLaboratoriosTemp([...laboratoriosTemp, obj]);
        } else {
            console.log("AAAAAAAAAAAAAA122");
            setLaboratoriosTemp(laboratoriosTemp.filter(item => item !== e.target.value));
        }
    }


    const onChangeProcedimientos = (e) => {
        if (e.target.checked) {
            const obj = {
                key: e.target.cod_prod,
                COD_PROD: e.target.cod_prod,
                DESC_PROD: e.target.value.desc_prod,
                NOM_LAB: e.target.value.nom_lab,
                RUC: e.target.value.ruc,
            }
            console.log("AAAAAAAAAAAAAA1", e.target.value);
            setProcedimientosTemp([...procedimientosTemp, obj]);
        } else {
            console.log("AAAAAAAAAAAAAA122");
            setProcedimientosTemp(procedimientosTemp.filter(item => item !== e.target.value));
        }
    }


    const onChangeInterconsultas = (e) => {
        if (e.target.checked) {
            const obj = {
                key: e.target.cod_prod,
                COD_PROD: e.target.cod_prod,
                DESC_PROD: e.target.value.desc_prod,
                NOM_LAB: e.target.value.nom_lab,
                RUC: e.target.value.ruc,
            }
            console.log("AAAAAAAAAAAAAA1", e.target.value);
            setInterConsultaTemp([...interconsultaTemp, obj]);
        } else {
            console.log("AAAAAAAAAAAAAA122");
            setInterConsultaTemp(interconsultaTemp.filter(item => item !== e.target.value));
        }
    }



    const aceptar = () => {

        //Dispatch al tratamiento --- imagenes ---- procedimiento ---- laboratorio
        if (tratamientoTemp.length > 0) {
            dispatch(setTratamientoCabeceraDetalle([...tratamientoTemp]));
        }

        if (imagenesTemp.length > 0) {
            dispatch(setImagenesAction({
                ...imagenes,
                dataProcedimiento: imagenesTemp,
            }));
        }


        if (procedimientosTemp.length > 0) {
            dispatch(setConsultasProcedimientos({
                ...procedimiento,
                dataProcedimiento: procedimientosTemp,
            }));
        }

        if (interconsultaTemp.length > 0) {
            dispatch(setInterconsultasProcedimiento({
                ...interconsulta,
                dataProcedimiento: interconsultaTemp,
            }));
        }

        if (laboratoriosTemp.length > 0) {
            dispatch(setLaboratorioAction({
                ...laboratorio,
                dataProcedimiento: laboratoriosTemp,
            }));

        }
        setModalSugerencia(false);
    }

    return (
        <Modal

            visible={modalSugerencia}
            title={<h3 style={{ fontWeight: 'bold', margin: 0, padding: 0 }}>LISTA DE SUGERENCIAS</h3>}
            onOk={() => aceptar()}
            onCancel={() => setModalSugerencia(false)}
            okText="Aplicar cambios"
            cancelText="Cancelar">
            <Row style={{ flexDirection: 'row' }}>
                <Col lg={24} style={{ marginBottom: '13px' }}>
                    <h4 style={{ fontWeight: 'bold' }}>Tratamientos</h4>

                    {sugerenciaReducer.tratamiento.length > 0 && <h5 style={{ fontStyle: "italic", marginBottom: '10px' }}>La opción del tratamiento se puede modificar en la pestaña tratamiento</h5>}
                    {
                        sugerenciaReducer.tratamiento.length > 0
                            ? (
                                sugerenciaReducer.tratamiento.map((item, index) => {
                                    return (
                                        <div style={{ marginBottom: '5px' }}>
                                            <Checkbox
                                                key={index}
                                                value={item}
                                                onChange={onChangeTratamiento}
                                                style={{ marginRight: '10px' }}>
                                                {
                                                    combosReducer.dataTratamiento.filter(item2 => item2.COD_PROD === item.codprod).map(item2 => {
                                                        return (
                                                            <div key={item2.COD_PROD}>
                                                                <span>{item2.DESC_PROD + " - " + item.tratamiento}</span>
                                                            </div>
                                                        )
                                                    }
                                                    )

                                                }
                                            </Checkbox>
                                            <br />
                                        </div>)
                                })
                            )

                            : <p style={{ textAlign: 'center' }}>No se encontraron sugerencias para los tratamientos</p>
                    }
                </Col>

                <Col lg={24} style={{ marginBottom: '13px' }}>
                    <h4 style={{ fontWeight: 'bold' }}>Consultas/Procedimientos</h4>
                    {
                        sugerenciaReducer.procedimiento.length > 0
                            ? sugerenciaReducer.procedimiento.map((item, index) => {
                                return (
                                    <div style={{ marginBottom: '5px' }}>
                                        <Checkbox
                                            key={index}
                                            value={item}
                                            onChange={onChangeProcedimientos}
                                            style={{ marginRight: '10px' }}>
                                            {
                                                combosReducer.dataProcedimiento.filter(item2 => item2.COD_PROD === item.cod_prod).map(item2 => {
                                                    return (
                                                        <div key={item2.COD_PROD}>
                                                            <span>{item2.DESC_PROD}</span>
                                                        </div>
                                                    )
                                                }
                                                )

                                            }
                                        </Checkbox>
                                        <br />
                                    </div>
                                )
                            })
                            : <p style={{ textAlign: 'center' }}>No se encontraron sugerencias para los procedimientos</p>
                    }
                </Col>

                <Col lg={24} style={{ marginBottom: '13px' }}>
                    <h4 style={{ fontWeight: 'bold' }}>Interconsultas</h4>
                    {
                        sugerenciaReducer.interconsultas.length > 0
                            ? sugerenciaReducer.interconsultas.map((item, index) => {
                                return (
                                    <div style={{ marginBottom: '5px' }}>
                                        <Checkbox
                                            key={index}
                                            value={item}
                                            onChange={onChangeInterconsultas}
                                            style={{ marginRight: '10px' }}>
                                            {
                                                combosReducer.dataProcedimiento.filter(item2 => item2.COD_PROD === item.cod_prod).map(item2 => {
                                                    return (
                                                        <div key={item2.COD_PROD}>
                                                            <span>{item2.DESC_PROD}</span>
                                                        </div>
                                                    )
                                                }
                                                )

                                            }
                                        </Checkbox>
                                        <br />
                                    </div>
                                )
                            })
                            : <p style={{ textAlign: 'center' }}>No se encontraron sugerencias para las interconsultas</p>
                    }
                </Col>

                <Col lg={24} style={{ marginBottom: '13px' }}>
                    <h4 style={{ fontWeight: 'bold' }}>Imágenes</h4>
                    {
                        sugerenciaReducer.imagenes.length > 0
                            ? sugerenciaReducer.imagenes.map((item, index) => {
                                console.log("AAAAAAAAAAAAAA22", item);
                                return (
                                    <div style={{ marginBottom: '5px' }}>
                                        <Checkbox
                                            key={index}
                                            value={item}
                                            onChange={onChangeImagenes}
                                            style={{ marginRight: '10px' }}>
                                            {
                                                combosReducer.dataImagenes.filter(item2 => item2.COD_PROD === item.cod_prod).map(item2 => {
                                                    return (
                                                        <div key={item2.COD_PROD}>
                                                            <span>{item2.DESC_PROD}</span>
                                                        </div>
                                                    )
                                                }
                                                )

                                            }
                                        </Checkbox>
                                        <br />
                                    </div>
                                )
                            })
                            : <p style={{ textAlign: 'center' }}>No se encontraron sugerencias para las imágenes</p>
                    }
                </Col>
                <Col lg={24} style={{}}>
                    <h4 style={{ fontWeight: 'bold' }}>Laboratorios</h4>
                    {
                        sugerenciaReducer.laboratorio.length > 0
                            ?
                            sugerenciaReducer.laboratorio.map((item, index) => {
                                return (
                                    <div style={{ marginBottom: '5px' }}>
                                        <Checkbox
                                            key={index}
                                            value={item}
                                            onChange={onChangeLaboratorios}
                                            style={{ marginRight: '10px' }}>
                                            {
                                                combosReducer.dataLaboratorio.filter(item2 => item2.COD_PROD === item.cod_prod).map(item2 => {
                                                    return (
                                                        <div key={item2.COD_PROD}>
                                                            <span>{item2.DESC_PROD}</span>
                                                        </div>
                                                    )
                                                }
                                                )

                                            }
                                        </Checkbox>
                                        <br />
                                    </div>
                                )
                            })
                            : <p style={{ textAlign: 'center' }}>No se encontraron sugerencias para los laboratorios</p>
                    }
                </Col>
            </Row>
        </Modal >
    )
}
