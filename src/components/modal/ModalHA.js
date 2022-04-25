import { Button, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import 'moment/locale/es';
import locale from 'antd/es/date-picker/locale/es_ES';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginLoading } from '../../appRedux/actions';
import { httpClient } from '../../util/Api';
import { setHistoriaClinica, setHistoriaAntecedentes } from '../../appRedux/actions/menu/helpers';
import { AntecedentesHC, consultasProcedimiento, desarrolloProcedimientos, examenFisico, imagenes, laboratorio, traerAntecedentes, traerAntecedentesPaneles, traerEstematologico, traerEvolucionTratamiento, traerEvolucionTratamientoOdonto, traerInterconsulta, traerPatologicos, traerPatologicosFamiliares, tratamiento } from '../../routes/listaPaciente/datosPaciente/apis';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export const ModalHA = ({ abrirModalHA, setAbrirModalHA }) => {

    const dispatch = useDispatch();
    const dataG = useSelector(state => state.dataGlobal);

    const [fecha, setFecha] = useState({ fechaInicio: '', fechaFin: '' });
    const [dataSeleccionado, setDataSeleccionado] = useState({});
    const [dataHistorial, setDataHistorial] = useState([]);
    const [btnVerHC, setBtnVerHC] = useState(true);
    const [loading, setLoading] = useState(false);
    const [btnBuscar, setBtnBuscar] = useState(true);


    const columns = [
        {
            title: 'FECHA',
            dataIndex: 'FECHA',
            key: 'FECHA',
        },
        {
            title: 'NUM. COLEGIO',
            dataIndex: 'NUM_COLEGIO',
            key: 'NUM_COLEGIO',
        },
        {
            title: 'MÉDICO',
            dataIndex: 'MEDICO',
            key: 'MEDICO',
        },
    ];

    const buscarHistorial = async (fechaInicio, fechaFin) => {
        try {
            setLoading(true);
            const { data } = await httpClient.post('/antecedentes/getHistorial', {
                codGrupoCia: dataG.codGrupoCia,
                codPaciente: dataG.codPaciente,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
            })

            console.log("HISTORIAL HA: ", data)

            if (data.success) {
                setDataHistorial(data.data);
                setLoading(false);
            }


        } catch (error) {
            setLoading(false);
        }
    }

    const onChangeFechaInicial = (e) => {
        if (e !== null) {
            const fechaFormat = e.format('DD/MM/YYYY');
            setFecha({
                ...fecha,
                fechaInicio: fechaFormat
            })
        }


    }
    const onChangeFechaFinal = (e) => {
        if (e !== null) {
            const fechaFormat = e.format('DD/MM/YYYY');
            setFecha({
                ...fecha,
                fechaFin: fechaFormat
            });
        }
    }

    const buscarHistoria = () => {
        console.log("fechaaa:", fecha);
        setLoginLoading(true);
        buscarHistorial(fecha.fechaInicio, fecha.fechaFin);
    }


    const rowSelection = {
        onChange: (selectedRows) => {
            setDataSeleccionado(selectedRows[0]);
            setBtnVerHC(false);
        },
    };

    function confirm() {
        Modal.confirm({
            title: 'Si procede se perderán los cambios no guardados en la Historia Actual',
            icon: <ExclamationCircleOutlined />,
            okText: 'Aceptar',
            cancelText: 'Cancelar',
            onOk: () => {
                onVerHANuevo();
            },
        });
    }

    const onVerHANuevo = () => {
        setAbrirModalHA(false);
        dispatch(setHistoriaAntecedentes(true));
        const dataGlobal = {
            codGrupoCia: dataG.codGrupoCia,
            codLocal: dataG.codLocal,
            codCia: dataG.codCia,
            nroAtencion: dataG.nroAtencion,
            codPaciente: dataG.codPaciente,
            secuenciaAntecedente: dataSeleccionado,
        };

        traerAntecedentes(dataGlobal);
        AntecedentesHC(dataGlobal);
        traerPatologicos(dataGlobal);
        traerPatologicosFamiliares(dataGlobal);
        traerAntecedentesPaneles(dataGlobal);
    }

    useEffect(() => {
        if (fecha.fechaInicio !== '' && fecha.fechaFin !== '') {
            setBtnBuscar(false);
        } else {
            setBtnBuscar(true);
        }
    }, [fecha.fechaInicio, fecha.fechaFin])

    return (
        <Modal
            maskClosable={false}
            okText="Ver"
            cancelText="Salir"
            width="60%"
            title={<div style={{ fontSize: '22px' }}>Historial de Antecedentes</div>}
            visible={abrirModalHA}
            okButtonProps={{ disabled: btnVerHC }}
            onOk={() => confirm()}
            onCancel={() => setAbrirModalHA(false)}>
            <div style={{ marginBottom: '40px' }}>
                <span>Fechas de Búsqueda </span>
                <DatePicker format="DD/MM/YYYY" locale={locale} style={{ width: '230px', marginLeft: '10px' }} placeholder="Selecciona fecha de inicio" onChange={onChangeFechaInicial} />
                <DatePicker format="DD/MM/YYYY" locale={locale} style={{ width: '230px', marginLeft: '10px' }} placeholder="Selecciona fecha de fin" onChange={onChangeFechaFinal} />
                <Button loading={loading} disabled={btnBuscar} type="primary" className="gx-mt-md-1 gx-mb-1" style={{ marginLeft: '10px' }} onClick={() => buscarHistoria()}>Buscar</Button>
            </div>

            <Table
                loading={loading}
                className="gx-table-responsive"
                columns={columns}
                rowSelection={{ type: 'radio', ...rowSelection }}
                dataSource={dataHistorial}
            >

            </Table>
            {/*  <br />
            <span style={{ color: 'red' }}>No hay conexión con central, solo se muestra información local</span> */}
        </Modal >
    )
}
