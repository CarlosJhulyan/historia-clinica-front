import { Button, Divider, Modal } from 'antd'
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';


import ReactToPrint from 'react-to-print';
import store from '../../../appRedux/store';
import { ImpresionImagenes, ImpresionLaboratorio, ImpresionProcedimientos, ImpresionTratamientos } from '../../impresiones';


export const ModalImpresionReceta = ({ modalImpresionReceta, setModalImpresionReceta, firma, datosModal }) => {

    const [estadoImprimir, setEstadoImprimir] = useState(0);

    console.log("fechaNacimiento:", datosModal);

    //IMPRESION
    const localS = JSON.parse(sessionStorage.getItem('token'));
    const fechaActual = moment().format('DD/MM/YYYY');
    const impresionRef = useRef();

    const estados = store.getState();

    const imagenes = useSelector(state => state.imagenes);
    const laboratorio = useSelector(state => state.laboratorio);
    const procedimientoReducer = useSelector(state => state.procedimientoReducer);
    const tratamientoDetalle = useSelector(state => state.tratamientoDetalle);

    const pageStyle = `
		@page {
			margin: 15
		}

		@media all {
			.pagebreak {
			display: none;
			}
		}

		@media print {
			.pagebreak {
			page-break-before: always;
			}
		}
		`;


    //


    return (
        <Modal
            visible={modalImpresionReceta}
            width={305}
            onOk={() => setModalImpresionReceta(false)}
            onCancel={() => {
                setModalImpresionReceta(false);
            }}
            footer={
                estadoImprimir !== 0
                    ? [
                        <ReactToPrint
                            pageStyle={pageStyle}
                            trigger={() => <Button type="primary">Imprimir</Button>}
                            content={() => impresionRef.current}
                        />,
                    ]
                    : []
            }
            title="Imprimir receta"
            maskClosable={false}>

            {imagenes.dataProcedimiento.length < 1 &&
                laboratorio.dataProcedimiento.length < 1 &&
                procedimientoReducer.dataProcedimiento.length < 1 &&
                tratamientoDetalle.length < 1 ? (
                <div>No hay recetas para imprimir</div>
            ) : null}

            {imagenes.dataProcedimiento.length > 0 ? (
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 15,
                    }}
                >
                    <div>Imagenes</div>
                    <div>
                        <Button onClick={() => setEstadoImprimir(1)} style={{ margin: 0 }}>
                            Ver
                        </Button>
                    </div>
                </div>
            ) : null}
            {laboratorio.dataProcedimiento.length > 0 ? (
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 15,
                    }}
                >
                    <div>Laboratorio</div>
                    <div>
                        <Button onClick={() => setEstadoImprimir(2)} style={{ margin: 0 }}>
                            Ver
                        </Button>
                    </div>
                </div>
            ) : null}
            {procedimientoReducer.dataProcedimiento.length > 0 ? (
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 15,
                    }}
                >
                    <div>Procedimientos / Consultas</div>
                    <div>
                        <Button onClick={() => setEstadoImprimir(3)} style={{ margin: 0 }}>
                            Ver
                        </Button>
                    </div>
                </div>
            ) : null}
            {tratamientoDetalle.length > 0 ? (
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 30,
                    }}
                >
                    <div>Tratamientos</div>
                    <div>
                        <Button onClick={() => setEstadoImprimir(4)} style={{ margin: 0 }}>
                            Ver
                        </Button>
                    </div>
                </div>
            ) : null}

            {estadoImprimir !== 0 ? <Divider /> : null}

            <div ref={impresionRef} style={{ width: '100%', fontSize: 10, lineHeight: 1.5, maxWidth: 257 }}>
                {estadoImprimir === 1 ? (
                    <ImpresionImagenes
                        fechaActual={fechaActual}
                        medico={localS.des_ape_medico + ', ' + localS.des_nom_medico}
                        cmp={localS.num_cmp}
                        especialidad={localS.des_especialidad}
                        paciente={
                            datosModal.estado.APE_PATERNO +
                            ' ' +
                            datosModal.estado.APE_MATERNO +
                            ', ' +
                            datosModal.estado.NOMBRE
                        }
                        historiaClinica={datosModal.estado.NRO_HC_ACTUAL}
                        dni={datosModal.estado.NUM_DOCUMENTO}
                        fechaNacimiento={moment(datosModal.estado.FEC_NAC_CLI, 'DD-MM-YYYY')}
                        codMedico={localS.cod_medico}
                        estados={estados}
                        firma={firma}
                    />
                ) : estadoImprimir === 2 ? (
                    <ImpresionLaboratorio
                        fechaActual={fechaActual}
                        medico={localS.des_ape_medico + ', ' + localS.des_nom_medico}
                        cmp={localS.num_cmp}
                        especialidad={localS.des_especialidad}
                        paciente={
                            datosModal.estado.APE_PATERNO +
                            ' ' +
                            datosModal.estado.APE_MATERNO +
                            ', ' +
                            datosModal.estado.NOMBRE
                        }
                        historiaClinica={datosModal.estado.NRO_HC_ACTUAL}
                        dni={datosModal.estado.NUM_DOCUMENTO}
                        fechaNacimiento={moment(datosModal.estado.FEC_NAC_CLI, 'DD-MM-YYYY')}
                        codMedico={localS.cod_medico}
                        estados={estados}
                        firma={firma}
                    />
                ) : estadoImprimir === 3 ? (
                    <ImpresionProcedimientos
                        fechaActual={fechaActual}
                        medico={localS.des_ape_medico + ', ' + localS.des_nom_medico}
                        cmp={localS.num_cmp}
                        especialidad={localS.des_especialidad}
                        paciente={
                            datosModal.estado.APE_PATERNO +
                            ' ' +
                            datosModal.estado.APE_MATERNO +
                            ', ' +
                            datosModal.estado.NOMBRE
                        }
                        historiaClinica={datosModal.estado.NRO_HC_ACTUAL}
                        dni={datosModal.estado.NUM_DOCUMENTO}
                        fechaNacimiento={moment(datosModal.estado.FEC_NAC_CLI, 'DD-MM-YYYY')}
                        codMedico={localS.cod_medico}
                        estados={estados}
                        firma={firma}
                    />
                ) : estadoImprimir === 4 ? (
                    <ImpresionTratamientos
                        fechaActual={fechaActual}
                        medico={localS.des_ape_medico + ', ' + localS.des_nom_medico}
                        cmp={localS.num_cmp}
                        especialidad={localS.des_especialidad}
                        paciente={
                            datosModal.estado.APE_PATERNO +
                            ' ' +
                            datosModal.estado.APE_MATERNO +
                            ', ' +
                            datosModal.estado.NOMBRE
                        }
                        historiaClinica={datosModal.estado.NRO_HC_ACTUAL}
                        dni={datosModal.estado.NUM_DOCUMENTO}
                        fechaNacimiento={moment(datosModal.estado.FEC_NAC_CLI, 'DD-MM-YYYY')}
                        codMedico={localS.cod_medico}
                        estados={estados}
                        firma={firma}
                    />
                ) : null}
            </div>
        </Modal>
    )
}
