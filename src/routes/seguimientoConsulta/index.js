import React, { createRef, useEffect, useState } from 'react';
import 'moment/locale/es';
import locale from 'antd/es/date-picker/locale/es_ES';
import { Card, Form, Row, Col, Button, DatePicker, Select } from 'antd';
import { httpClient } from '../../util/Api';
import { getComboEspecialidades } from '../listaPaciente/datosPaciente/apis';
import { ModalLiberado } from './modalLiberado';
import { ListaPaciente } from './listaPaciente';
import { useSelector } from 'react-redux';

export const SeguimientoConsulta = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
    const [dataPaciente, setDataPaciente] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [comboEspecialidad, setComboEspecialidad] = useState([]);

    const [data, setData] = useState({ fechaInicio: '', fechaFin: '', especialidad: '' });
    const [btnBuscar, setBtnBuscar] = useState(true);
    const [loading, setLoading] = useState(false);
    const [abrirModalL, setAbrirModalL] = useState(false);

    const [actual, setActual] = useState('TODOS');

    const abc = {};
    const formRef = createRef();

    const mapCodEstado = {
        T: {
            key: 'T',
            color: '#ff0080',
            text: 'Pend. Triaje',
        },
        A: {
            key: 'A',
            color: '#00b251',
            text: 'Atendido',
        },
        C: {
            key: 'C',
            color: '#00bcd4',
            text: 'En Consulta',
        },
        G: {
            key: 'G',
            color: '#fe0100',
            text: 'Grabado Temp.',
        },
        P: {
            key: 'P',
            color: '#fec000',
            text: 'Pend. Atención',
        },
        PA: {
            key: 'PA',
            color: '#ff8000',
            text: 'Por Atender',
        },
    };

    for (const key in mapCodEstado) {
        if (Object.hasOwnProperty.call(mapCodEstado, key)) {
            const element = mapCodEstado[key];
            abc[element.key] = dataPaciente.filter(item => {
                return item.COD_ESTADO === element.key;
            });
        }
    }

    const handleChangeFechaInicio = e => {
        if (e !== null) {
            const fechaFormat = e.format('DD/MM/YYYY');
            setData({
                ...data,
                fechaInicio: fechaFormat,
            });
        }
    };

    const handleChangeFechaFin = e => {
        if (e !== null) {
            const fechaFormat = e.format('DD/MM/YYYY');
            setData({
                ...data,
                fechaFin: fechaFormat,
            });
        }
    };

    const filtroEspecialidad = (e, array) => {
        const qwe = array.filter(item => {
            return e.includes(item.ESPECIALIDAD);
        });
        if (qwe.length > 0) {
            setDataSource(qwe);
        } else if (e.length !== 0) {
            setDataSource([]);
        } else {
            setDataSource(array);
        }
    };

    const handleChangeEspecialidad = e => {
        if (actual === 'TODOS') {
            filtroEspecialidad(e, dataPaciente);
        } else {
            filtroEspecialidad(e, abc[actual]);
        }
    };

    const onClickBuscar = () => {
        const obj = {
            codGrupoCia: '001',
            fechaInicio: data.fechaInicio,
            fechaFin: data.fechaFin,
            // codMedico: token.cod_medico,
            codMedico: '',
        };
        buscarHistorial(obj);
    };

    const buscarHistorial = async obj => {
        try {
            setLoading(true);
            const { data } = await httpClient.post('/admin/getListaAtenciones', obj);
            console.log('BUSQUEDAAAA: ', data);
            if (data.success) {
                setDataPaciente(data.data);
                setDataSource(data.data);
                setLoading(false);
            }
        } catch (error) {
            console.log('ERROR: ', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data.fechaFin !== '' && data.fechaInicio !== '' /* && data.especialidad !== "" */) {
            setBtnBuscar(false);
        } else {
            setBtnBuscar(true);
        }
    }, [data]);

    useEffect(() => {
        getComboEspecialidades({
            codGrupoCia: '001',
            codLocal: '001',
            codMedico: token.cod_medico,
        }).then(resp => {
            setComboEspecialidad(resp.data);
        });
    }, []);



    useEffect(() => {
        if (actual === 'TODOS' || actual === 'A' || actual === 'C' || actual === 'G' || actual === 'P' || actual === 'PA' || actual === 'T') {
            formRef.current.setFieldsValue({ especialidad: [] });
        }
    }, [actual]);

    return (
        <>
            <Card title={<h1 style={{ fontWeight: 'bold' }}>Seguimiento de Consultas en Tiempo Real</h1>}>
                <Form layout="vertical" ref={formRef}>
                    <Row style={{ flexDirection: 'row', paddingLeft: '30px', paddingRight: '30px' }}>
                        <Col lg={4} md={8} sm={12} xs={24}>
                            <Button
                                style={{
                                    width: '100%',
                                    marginTop: '25px',
                                    background: themeSettingsGlobal.COD_COLOR_1,
                                    color: '#fff'
                                }}
                                onClick={() => setAbrirModalL(true)}
                            >
                                Ver Liberación
                            </Button>
                        </Col>

                        <Col lg={5} md={8} sm={12} xs={24}>
                            <Form.Item name="fechaInicio" label="Fecha Inicio">
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    locale={locale}
                                    style={{ width: '100%' }}
                                    placeholder="Selecciona fecha de inicio"
                                    onChange={handleChangeFechaInicio}
                                />
                            </Form.Item>
                        </Col>

                        <Col lg={5} md={8} sm={12} xs={24}>
                            <Form.Item name="fechaFin" label="Fecha Fin">
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    locale={locale}
                                    style={{ width: '100%' }}
                                    placeholder="Selecciona fecha de fin"
                                    onChange={handleChangeFechaFin}
                                />
                            </Form.Item>
                        </Col>

                        <Col lg={4} md={8} sm={12} xs={24}>
                            <Button
                                loading={loading}
                                disabled={btnBuscar}
                                onClick={() => onClickBuscar()}
                                style={{
                                    width: '100%',
                                    marginTop: '25px',
                                    background: themeSettingsGlobal.COD_COLOR_1,
                                    color: '#fff'
                                }}
                            >
                                Buscar
                            </Button>
                        </Col>

                        <Col lg={6} md={6} sm={12} xs={24}>
                            <Form.Item name="especialidad" label="Especialidad">
                                <Select mode="multiple" allowClear placeholder="Seleccione" onChange={handleChangeEspecialidad}>
                                    {comboEspecialidad.map(element => {
                                        return (
                                            <Select.Option key={element.ID_CONSULTORIO} value={element.DESCRIPCION}>
                                                {element.DESCRIPCION}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>


                    </Row>
                </Form>

                <ListaPaciente
                    mapCodEstado={mapCodEstado}
                    dataSource={dataSource}
                    setDataSource={setDataSource}
                    dataPaciente={dataPaciente}
                    loading={loading}
                    actual={actual}
                    setActual={setActual}
                    abc={abc}
                />
            </Card>
            {abrirModalL ? (
                <ModalLiberado
                    mapCodEstado={mapCodEstado}
                    abrirModalL={abrirModalL}
                    setAbrirModalL={setAbrirModalL}
                    comboEspecialidad={comboEspecialidad}
                />
            ) : null}
        </>
    );
};
