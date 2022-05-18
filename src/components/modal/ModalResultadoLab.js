import React, { createRef, useEffect, useState } from 'react';
import { Button, Col, Modal, Row, Table, Form, Input, DatePicker, Card } from 'antd';
import 'moment/locale/es';
import locale from 'antd/es/date-picker/locale/es_ES';
import { useSelector } from 'react-redux';
import { httpClient } from '../../util/Api';
import { getComboEspecialidades } from '../../routes/listaPaciente/datosPaciente/apis';

export const ModalResultadoLab = ({ abrirResultadoLab, setAbrirResultadoLab, datosModal }) => {



    const token = JSON.parse(sessionStorage.getItem('token'));
    const form = createRef();
    const dataGlobal = useSelector(state => state.dataGlobal);
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [btnBuscar, setBtnBuscar] = useState(true);
    const [data, setData] = useState({
        dni: '',
        fechaInicio: '',
        fechaFin: '',
        paciente: '',
        cmp: '',
    });



    //Form
    const handleChangeDNI = (e) => {
        setData({
            ...data,
            dni: e.target.value
        })
    }

    const handleChangeFechaInicio = (e) => {
        const fechaFormat = e.format('DD/MM/YYYY');
        setData({
            ...data,
            fechaInicio: fechaFormat
        })

    }

    const handleChangeFechaFin = (e) => {
        const fechaFormat = e.format('DD/MM/YYYY');
        setData({
            ...data,
            fechaFin: fechaFormat
        })

    }

    const handleChangePaciente = (e) => {
        setData({
            ...data,
            paciente: e.target.value
        })

    }

    const handleChangeCMP = (e) => {
        setData({
            ...data,
            cmp: e.target.value
        })

    }

    const onClickBuscar = async () => {
        const obj = {
            codGrupoCia: dataGlobal.codGrupoCia,
            fechaInicio: data.fechaInicio,
            fechaFin: data.fechaFin,
            dni: data.dni,
            paciente: data.paciente,
            cmp: data.cmp,
        }
        buscarHistorial(obj);
    }

    const buscarHistorial = async (obj) => {
        console.log("HISTORYY:", obj)
        try {
            setLoading(true);
            const { data } = await httpClient.post('/consulta/getExamenesLaboratorio', obj);
            console.log("BUSQUEDAAAA: ", data)

            if (data.success) {
                setLoading(false);
                setDataSource(data.data);
            }

            setLoading(false);

        } catch (error) {
            setLoading(false);
        }
    }



    useEffect(() => {
        if (data.fechaInicio !== '' && data.fechaFin !== '') {
            setBtnBuscar(false);
        } else {
            setBtnBuscar(true);
        }
    }, [data]);

    useEffect(() => {
        setData({
            ...data,
            dni: datosModal.estado.NUM_DOCUMENTO,
            cmp: token.num_cmp,
        })
        form.current.setFieldsValue({ cmp: token.num_cmp, dni: datosModal.estado.NUM_DOCUMENTO });
    }, [])



    const columns = [
        {
            title: 'Fecha Venta',
            dataIndex: 'TB_EXAM.FEC_PED_VTA',
            key: 'TB_EXAM.FEC_PED_VTA',
        },
        {
            title: 'N° Orden Vta',
            dataIndex: 'TB_EXAM.NUM_ORDEN_VTA',
            key: 'TB_EXAM.NUM_ORDEN_VTA',
        },
        {
            title: 'DNI Paciente',
            dataIndex: 'TB_EXAM.NUM_DOCUMENTO',
            key: 'TB_EXAM.NUM_DOCUMENTO',
        },
        {
            title: 'Datos Paciente',
            dataIndex: 'TB_EXAM.PACIENTE',
            key: 'TB_EXAM.PACIENTE',
        },
        {
            title: 'N° CMP',
            dataIndex: 'TB_EXAM.NUM_CMP',
            key: 'TB_EXAM.NUM_CMP',
        },
        {
            title: 'Datos Medico',
            dataIndex: 'TB_EXAM.DATOS_COMPLETOS',
            key: 'TB_EXAM.DATOS_COMPLETOS',
        },
        {
            title: 'File Resultados',
            dataIndex: 'TB_EXA',
            key: 'TB_EXA',
        }
    ]


    return (
        <Modal
            maskClosable={false}
            okText="Aceptar"
            cancelText="Cancelar"
            width="70%"
            title={<div style={{ fontSize: '22px' }}>Resultados de Pacientes</div>}
            visible={abrirResultadoLab}
            onOk={() => setAbrirResultadoLab(false)}
            onCancel={() => setAbrirResultadoLab(false)}>
            <Form layout="vertical" ref={form}>
                <Row style={{ flexDirection: 'row', paddingLeft: '30px', paddingRight: '30px' }}>
                    <Col lg={8} md={8} sm={12} xs={24}>
                        <Form.Item
                            name="dni"
                            label="DNI">
                            <Input type="number" disabled placeholder="Ingrese DNI" onChange={handleChangeDNI} />
                        </Form.Item>
                    </Col>
                    <Col lg={8} md={8} sm={12} xs={24}>
                        <Form.Item
                            name="fechaInicio"
                            label="Fecha Inicio">
                            <DatePicker format="DD/MM/YYYY" locale={locale} style={{ width: '100%' }} placeholder="Selecciona fecha de inicio" onChange={handleChangeFechaInicio} />
                        </Form.Item>
                    </Col>

                    {/*   <Col lg={6}>
                        <Button>Consulta de Examenes Laboratorio</Button>
                    </Col> */}
                    <Col lg={8} md={8} sm={12} xs={24}>
                        <Form.Item
                            name="fechaFin"
                            label="Fecha Fin">
                            <DatePicker format="DD/MM/YYYY" locale={locale} style={{ width: '100%' }} placeholder="Selecciona fecha de fin" onChange={handleChangeFechaFin} />
                        </Form.Item>
                    </Col>
                    <Col lg={8} md={8} sm={12} xs={24}>
                        <Form.Item
                            name="paciente"
                            label="Paciente">
                            <Input type="text" placeholder="Ingrese Paciente" onChange={handleChangePaciente} />
                        </Form.Item>
                    </Col>

                    <Col lg={8} md={8} sm={12} xs={24}>
                        <Form.Item
                            name="cmp"
                            label="CMP">
                            <Input type="text" disabled placeholder="Ingrese CMP" onChange={handleChangeCMP} />
                        </Form.Item>
                    </Col>
                    <Col lg={8} md={8} sm={12} xs={24}>
                        <Button loading={loading} disabled={btnBuscar} type="primary" onClick={() => onClickBuscar()} style={{ width: '100%', marginTop: '25px' }}>Buscar</Button>
                    </Col>
                </Row>
            </Form>


            <Card title="Listado de Examenes">
                <Table
                    className="gx-table-responsive"
                    columns={columns} dataSource={dataSource}></Table>
            </Card>

        </Modal >
    )
}
