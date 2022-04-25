import { Button, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import 'moment/locale/es';
import locale from 'antd/es/date-picker/locale/es_ES';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginLoading } from '../../appRedux/actions';
import { httpClient } from '../../util/Api';
import { setHistoriaClinica } from '../../appRedux/actions/menu/helpers';
import { consultasProcedimiento, desarrolloProcedimientos, examenFisico, imagenes, laboratorio, traerEstematologico, traerEvolucionTratamiento, traerEvolucionTratamientoOdonto, traerInterconsulta, tratamiento } from '../../routes/listaPaciente/datosPaciente/apis';
import { ExclamationCircleOutlined } from '@ant-design/icons';


const { RangePicker } = DatePicker;


export const ModalHC = ({ abrirModalHc, setAbrirModalHc }) => {

    const dataG = useSelector(state => state.dataGlobal);
    const [btnVerHC, setBtnVerHC] = useState(true);
    const dispatch = useDispatch();
    const [dataSeleccionado, setDataSeleccionado] = useState({});
    const [dataHistorial, setDataHistorial] = useState([]);
    const [loading, setLoading] = useState(false);
    const [btnBuscar, setBtnBuscar] = useState(true);
    const [fecha, setFecha] = useState({
        fechaInicio: '',
        fechaFin: ''
    })


    /* const estado = {
        "COD_GRUPO_CIA": datosModal.estado.COD_GRUPO_CIA,
        "COD_PACIENTE": datosModal.estado.COD_PACIENTE,
    } */

    const columns = [
        {
            title: 'Fecha',
            dataIndex: 'FECHA',
            key: 'FECHA',
        },
        {
            title: 'Centro Medico',
            dataIndex: 'CENTRO_MEDICO',
            key: 'CENTRO_MEDICO',
        },
        {
            title: 'Num. Colegio',
            dataIndex: 'NUM_COLEGIO',
            key: 'NUM_COLEGIO',
        },
        {
            title: 'Medico',
            dataIndex: 'MEDICO',
            key: 'MEDICO',
        },
        {
            title: 'Especialidad',
            dataIndex: 'ESPECIALIDAD',
            key: 'ESPECIALIDAD',
        },
    ];

    const buscarHistorial = async (fechaInicio, fechaFin) => {
        try {
            setLoading(true);
            const { data } = await httpClient.post('/consulta/getHistoriaMedica', {
                codGrupoCia: dataG.codGrupoCia,
                codPaciente: dataG.codPaciente,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
            })

            console.log("HISTORIAL HC: ", data)

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

    /*  const onChangeRangoFecha = (e) => {
 
         let fechaInicio = e[0].split('-');
         fechaInicio = fechaInicio[2] + "/" + fechaInicio[1] + "/" + fechaInicio[0];
 
         let fechaFin = e[1].split('-');
         fechaFin = fechaFin[2] + "/" + fechaFin[1] + "/" + fechaFin[0];
 
         if (fechaInicio && fechaFin) {
             setLoginLoading(true);
             buscarHistorial(fechaInicio, fechaFin);
         }
     } */

    const rowSelection = {
        onChange: (selectedRows) => {
            setDataSeleccionado(selectedRows[0]);
            setBtnVerHC(false);
        },
    };

    function confirm(e) {
        Modal.confirm({
            title: 'Si procede se perderán los cambios no guardados en la Historia Actual',
            icon: <ExclamationCircleOutlined />,
            okText: 'Aceptar',
            cancelText: 'Cancelar',
            onOk: () => {
                onVerHCNuevo();
            },
        });
    }

    const onVerHCNuevo = () => {
        setAbrirModalHc(false);
        dispatch(setHistoriaClinica(true));

        const dataGlobal = {
            codGrupoCia: dataG.codGrupoCia,
            codLocal: dataG.codLocal,
            codCia: dataG.codCia,
            nroAtencion: dataSeleccionado,
            codPaciente: dataG.codPaciente,
            secuenciaAntecedente: dataG.secuenciaAntecedente,
        };
        examenFisico(dataGlobal);
        traerEvolucionTratamiento(dataGlobal);
        tratamiento(dataGlobal);
        consultasProcedimiento(dataGlobal);
        traerInterconsulta(dataGlobal);
        imagenes(dataGlobal);
        laboratorio(dataGlobal);
        traerEstematologico(dataGlobal);
        traerEvolucionTratamientoOdonto(dataGlobal);
        desarrolloProcedimientos(dataGlobal);
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
            okText="Ver HC Nuevo"
            cancelText="Salir"
            width="60%"
            title={<div style={{ fontSize: '22px' }}>Historia Clinica</div>}
            visible={abrirModalHc}
            okButtonProps={{ disabled: btnVerHC }}
            onOk={() => confirm()}
            onCancel={() => setAbrirModalHc(false)}>

            <div style={{ marginBottom: '40px' }}>
                {/*  <h4>Fechas de búsqueda:
                    <RangePicker
                        locale={locale}
                        style={{ width: '55%', marginLeft: '20px' }}
                        onChange={(date, dateString) => onChangeRangoFecha(dateString)} />
                </h4> */}
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
            <br />
            {/* <span style={{ color: 'red' }}>No hay conexión con central, solo se muestra información local</span> */}

        </Modal >
    )
}
