import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Modal, Table } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import ReactWebMediaPlayer from 'react-web-media-player';
import Lightbox from 'react-awesome-lightbox';

import 'moment/locale/es';
import locale from 'antd/es/date-picker/locale/es_ES';

import { notificaciones } from '../../../../util/util';
import { httpClient } from '../../../../util/Api';
import { traerAnexo, traerAnexoBusqueda } from '../apis';
import { urlImagen } from '../../../../config/backend';

export const ModalBusqueda = ({ modalBuscar, setModalBuscar, datosModal }) => {

    const [fecha, setFecha] = useState({
        fechaInicio: '',
        fechaFin: ''
    });

    const [dataSource, setDataSource] = useState([]);

    const [imagenActual, setImagenActual] = useState('');
    const [modalVideo, setModalVideo] = useState(null);

    const [loading, setLoading] = useState(false);
    const [btnBuscar, setBtnBuscar] = useState(true);


    function confirm(e) {
        Modal.confirm({
            title: '¿Desea eliminar este registro?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Si, Eliminar Registro',
            cancelText: 'No, Cancelar',
            onOk: () => {
                notificaciones('', 'Promesa', {
                    promesa: eliminarAnexo,
                    ok: 'Registro eliminado correctamente',
                    error: 'Alerta al eliminar, Por favor vuelva a intentarlo',
                    pendiente: 'Eliminando Anexo',
                    parametros: [e],
                });
            },
        });
    }

    const eliminarAnexo = async (a) => {
        const respuesta = await httpClient.post('/anexos/deleteAnexos', { codAnexo: a.cod_anexo });
        if (respuesta.data.success) {
            await traerAnexo({ nroAtencion: datosModal.estado.NUM_ATEN_MED });
        } else {
            throw 'Por favor vuelva a intentarlo';
        }
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nom_file',
        },
        {
            title: 'Observacion',
            dataIndex: 'obs_anexo',
        },
        {
            title: 'Acciones',
            key: 'borrar',
            width: 200,
            render: (eee) => {
                console.log("EEEEEEEEEEEEEEEEEEEE2:", eee)
                const formato = eee.ext_file.trim();
                let accion;
                let tipo;
                if (
                    formato === 'doc' ||
                    formato === 'DOC' ||
                    formato === 'docx' ||
                    formato === 'DOCX' ||
                    formato === 'pdf' ||
                    formato === 'PDF'
                ) {
                    tipo = 'documento';
                    accion = () => {
                        console.log('documento');
                    };
                } else if (formato === 'mp4') {
                    tipo = 'multimedia';
                    accion = () => {
                        console.log('multimedia');
                        const aa = (
                            <Modal
                                title={eee.nom_file}
                                visible
                                onOk={() => setModalVideo(null)}
                                okText="Cerrar"
                                cancelText={null}
                                onCancel={() => setModalVideo(null)}
                                footer={[
                                    <Button key="back" onClick={() => setModalVideo(null)}>
                                        Cerrar
                                    </Button>,
                                ]}
                                width="60%"
                            >
                                <ReactWebMediaPlayer width="100%" title={eee.nom_file} video={eee.url} thumbnail="" />
                            </Modal>
                        );
                        setModalVideo(aa);
                    };
                } else {
                    tipo = 'imagenes';
                    accion = () => {
                        console.log('imagenes');
                        setImagenActual(eee.url);
                    };
                }

                return (
                    <div>
                        <Button
                            className="gx-btn-danger"
                            style={{ margin: '0px', padding: '4px 10px 0 10px' }}
                            onClick={async () => {
                                confirm(eee);
                            }}
                        >
                            <i className="icon icon-trash" />
                        </Button>
                        <Button
                            className="gx-btn-cyan"
                            style={{ margin: '0px', marginLeft: 10 }}
                            onClick={accion}
                            href={tipo === 'documento' ? eee.url : null}
                            download={tipo === 'documento' ? true : false}
                        >
                            {tipo === 'documento' ? 'DESCARGAR' : 'VER'}
                        </Button>
                    </div>
                );
            },
        },
    ];

    const onChangeFechaInicial = (e) => {
        if (e !== null) {
            const fechaFormat = e.format('YYYY/MM/DD');
            setFecha({
                ...fecha,
                fechaInicio: fechaFormat
            })
        }
    }

    const onChangeFechaFinal = (e) => {
        if (e !== null) {
            const fechaFormat = e.format('YYYY/MM/DD');
            setFecha({
                ...fecha,
                fechaFin: fechaFormat
            });
        }
    }

    const buscarHistoria = () => {
        buscarHistorial(fecha.fechaInicio, fecha.fechaFin);
    };

    const buscarHistorial = async (fechaInicio, fechaFin) => {
        try {
            setLoading(true);
            const resp = await traerAnexoBusqueda(datosModal.estado.NUM_ATEN_MED, fechaInicio, fechaFin);
            const dataAnexos = resp.data.map((e) => ({ ...e, url: urlImagen + e.ruta_local }));

            console.log("RESPUESTA111111111", resp);
            if (resp.success) {
                setDataSource(dataAnexos);
                setLoading(false);
            }

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (fecha.fechaInicio !== '' && fecha.fechaFin !== '') {
            setBtnBuscar(false);
        } else {
            setBtnBuscar(true);
        }
    }, [fecha.fechaInicio, fecha.fechaFin])

    return (
        <>
            <Modal
                maskClosable={false}
                okText="Aceptar"
                cancelText="Cancelar"
                width="60%"
                title={<div style={{ fontSize: '22px' }}>Buscar Anexos</div>}
                visible={modalBuscar}
                onOk={() => setModalBuscar(false)}
                onCancel={() => setModalBuscar(false)}>

                <div style={{ marginBottom: '40px' }}>
                    <span>Fechas de Búsqueda </span>
                    <DatePicker format="DD/MM/YYYY" locale={locale} style={{ width: '230px', marginLeft: '10px' }} placeholder="Selecciona fecha de inicio" onChange={onChangeFechaInicial} />
                    <DatePicker format="DD/MM/YYYY" locale={locale} style={{ width: '230px', marginLeft: '10px' }} placeholder="Selecciona fecha de fin" onChange={onChangeFechaFinal} />
                    <Button loading={loading} disabled={btnBuscar} type="primary" className="gx-mt-md-1 gx-mb-1" style={{ marginLeft: '10px' }} onClick={() => buscarHistoria()}>Buscar</Button>
                </div>

                <Table
                    className="gx-table-responsive"
                    dataSource={dataSource}
                    columns={columns}>
                </Table>
            </Modal >
            {imagenActual !== '' ? (
                <Lightbox
                    showTitle={false}
                    onClose={() => setImagenActual('')}
                    image={imagenActual}
                    title="Image Title"
                ></Lightbox>
            ) : null}
            {modalVideo}
        </>
    )
}
