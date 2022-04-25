import { ZoomInOutlined } from '@ant-design/icons';
import { Button, Card, Spin, Table, Typography, Modal, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { httpClient } from '../../util/Api';
import { DatePicker } from 'antd';
import 'moment/locale/es';
import locale from 'antd/es/date-picker/locale/es_ES';

const { RangePicker } = DatePicker;

export const ListaOdontograma = ({ datosModal, estadosOdontograma, obtenerOdontoHistorial, estado: estadoOdonto, cargando, verHistorial, setVerHistorial }) => {

    const [dataHistorial, setDataHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const { Title } = Typography;
    const [verSeleccionado, setVerSeleccionado] = useState(false);

    const estado = {
        "COD_PACIENTE": datosModal.estado.COD_PACIENTE,
        "COD_GRUPO_CIA": datosModal.estado.COD_GRUPO_CIA,
        "COD_MEDICO": datosModal.estado.COD_MEDICO,
    }


    useEffect(() => {
        postHistorial();
        setVerSeleccionado(false);
    }, [estadosOdontograma])



    const postHistorial = async () => {
        setLoading(true);
        if (estado) {
            try {
                const { data } = await httpClient.post('/odontograma/historial', estado);
                setDataHistorial(data.data)
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
    }

    const buscarHistorial = async (fechaI, fechaF) => {
        setLoading(true);
        if (estado) {
            try {
                const { data } = await httpClient.post('/odontograma/historial/fecha', {
                    COD_PACIENTE: estado.COD_PACIENTE,
                    COD_GRUPO_CIA: estado.COD_GRUPO_CIA,
                    FECHA_INICIO: fechaI,
                    FECHA_FIN: fechaF,
                });
                console.log("AAAAAAAAAAAAAAAAAAAAAAAA:", data);
                setDataHistorial(data.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
    }




    const verOdontograma = (data) => {
        obtenerOdontoHistorial(data);
        setVerSeleccionado(true);
        setVerHistorial(false);
    };


    const onChangeRangoFecha = (e) => {
        const fechaInicio = e[0]
        const fechaFin = e[1]
        if (fechaInicio && fechaFin) {
            buscarHistorial(fechaInicio, fechaFin);
        } else {
            postHistorial();
        }
    }


    const columns = [
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha',
            render: text => <span className="gx-link">{text}</span>,
        },
        {
            title: 'Médico',
            dataIndex: 'medico',
            key: 'medico',
        },
        {
            title: 'Opcion',
            dataIndex: 'opcion',
            key: 'opcion',
            render: (text, record) => {
                return <Button icon={<ZoomInOutlined />} onClick={() => verOdontograma(record)}>Ver</Button>
            }
        }
    ];

    return (
        <>
            <Modal
                title="Historial"
                width='650px'
                visible={verHistorial}
                onOk={() => setVerHistorial(false)}
                onCancel={() => setVerHistorial(false)}
                cancelText="Cerrar"
                okText="Aceptar"

            >
                <div style={{ marginBottom: '40px' }}>
                    <h4>Seleccione un rango de fechas:
                        <RangePicker
                            locale={locale}
                            style={{ width: '55%', marginLeft: '20px' }}
                            onChange={(date, dateString) => onChangeRangoFecha(dateString)} />
                    </h4>

                </div>

                <Table
                    className="gx-table-responsive"
                    columns={columns}
                    loading={loading}
                    dataSource={
                        (dataHistorial)
                            ? dataHistorial.map(data => {
                                return {
                                    key: data.id_historial,
                                    fecha: data.fecha,
                                    medico: data.des_nom_medico + ' ' + data.des_ape_medico
                                }
                            })
                            : ''
                    }>
                </Table>
            </Modal>
            <hr />
            <div style={{ marginTop: '80px', width: '1500px', textAlign: 'center' }}>
                {
                    verSeleccionado
                        ? cargando
                            ? <div style={{ display: "flex", justifyContent: "center", flexDirection: 'column' }}>
                                <Spin tip="Cargando" />
                            </div>

                            : <Row style={{ flexDirection: 'row' }}>
                                <Col lg={12} >
                                    <Title level={4}>Especificaciones:</Title>
                                    <h5>"{estadoOdonto.especificaciones}"</h5>
                                </Col>
                                <Col lg={12}  >
                                    <Title level={4}>Observaciones:</Title>
                                    <h5>"{estadoOdonto.observaciones}"</h5>
                                </Col>
                            </Row>
                        : null
                }
            </div>
        </>


    )
}
