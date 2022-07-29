import { Checkbox, Col, Form, Input, Modal, Row } from 'antd';
import React, { createRef, useEffect, useState } from 'react';
import Moment from 'moment';
import { httpClient } from '../../../../util/Api';
import { notificaciones } from '../../../../util/util';
import confirm from 'antd/lib/modal/confirm';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

export const ModalHorario = ({
	abrir,
	setAbrir,
	dataModal,
	data,
	setData,
	historia,
	TraerDatos,
	tratamientos,
}) => {
	const formRef = createRef();
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const token = JSON.parse(localStorage.getItem('token'));

	const [horario, setHorario] = useState([]);
	const [seleccionados, setSeleccionados] = useState([]);
	const [dataHorario, setDataHorario] = useState([]);

	const onChangeHora = value => {
		console.log(dataModal);
		const arreglo = [];
		const duracion = dataModal.duracion;
		const frecuencia = dataModal.frecuencia;
		// const duracion = 2;
		// const frecuencia = 3;
		const hora = Moment(value.target.value, 'HH:mm');
		const cantidad = duracion * frecuencia;
		for (let i = 1; i <= cantidad; i++) {
			if (i === 1) {
				arreglo.push({
					label: Moment(value.target.value, 'HH:mm').format('HH:mm DD/MM/YYYY'),
					value: Moment(value.target.value, 'HH:mm').format('HH:mm DD/MM/YYYY'),
				});
			} else {
				hora.add(24 / parseInt(frecuencia), 'h');
				arreglo.push({
					label: hora.format('HH:mm DD/MM/YYYY'),
					value: hora.format('HH:mm DD/MM/YYYY'),
				});
			}
		}
		setHorario(arreglo);
	};

	function onChange(checkedValues) {
		const arreglo = [];
		const inactivos = horario.filter(h => !checkedValues.includes(h.value));
		const activos = horario.filter(h => checkedValues.includes(h.value));
		inactivos.forEach(h => {
			arreglo.push({
				hora: Moment(h.value, 'HH:mm DD/MM/YYYY').utcOffset('GMT-05:00').format(),
				administrado: 0,
			});
		});
		activos.forEach(h => {
			arreglo.push({
				hora: Moment(h.value, 'HH:mm DD/MM/YYYY').utcOffset('GMT-05:00').format(),
				administrado: 1,
			});
		});
		setDataHorario(arreglo);
	}

	const GuardarHorario = () => {
		const dataModificar = (data.find(d => d.codigo_producto === dataModal.codigo_producto).horario =
			dataHorario);
		console.log('dataModificar ', dataModificar);
		setData(dataModificar);
		GuardarKardex();
	};

	const GuardarKardex = async () => {
		var validator = false;
		const arreglo = [];
		data.forEach(d => {
			console.log('data', d);
			validator = true;
			if (d.codigo_producto === dataModal.codigo_producto) {
				arreglo.push({
					codProducto: d.codprod || d.codigo_producto,
					producto: d.descprod || d.producto,
					viaAdministracion: d.viaadministracion || d.via_administracion,
					etiquetaVia: d.etiquetaVia || d.etiqueta_via,
					dosis: d.dosis,
					cantidad: d.cantidad,
					duracion: d.duracion,
					frecuencia: d.frecuencia,
					estado: d.estado || '0',
					horario: d.horario || [],
				});
			}
		});
		const body = {
			codMedico: token.cod_medico,
			nomMedico: token.des_nom_medico + ' ' + token.des_ape_medico,
			codPaciente: historia.codPaciente,
			nomPaciente: historia.nombrePaciente,
			hc: historia.hc,
			tratamiento: arreglo,
			accion: 'Toma de medicamento',
		};
		// console.warn('Cuerpo enviado',body);
		if (validator) {
			var response = {};
			response = await httpClient.post('kardex/setKardexTratamiento', body);
			if (response.data.success) {
				notificaciones('Completado!');
				TraerDatos();
				setAbrir(false);
			} else {
				notificaciones(response.message, 'Alerta');
			}
		} else {
			notificaciones('Debe llenar todos los campos', 'Alerta');
			console.error('Completar datos');
		}
	};

	useEffect(() => {
		if (dataModal.horarios) {
			if (dataModal.horarios.length > 0) {
				const arreglo = [];
				const activos = [];
				dataModal.horarios.forEach(horario => {
					arreglo.push({
						label: Moment(horario.hora).format('HH:mm DD/MM/YYYY'),
						value: Moment(horario.hora).format('HH:mm DD/MM/YYYY'),
					});
					if (horario.administrado === '1') {
						activos.push(Moment(horario.hora).format('HH:mm DD/MM/YYYY'));
					}
				});
				//Ordenar por hora
				arreglo.sort((a, b) => {
					return Moment(a.value, 'HH:mm DD/MM/YYYY').diff(Moment(b.value, 'HH:mm DD/MM/YYYY'));
				});
				setHorario(arreglo);
				setSeleccionados(activos);
			}
		}
	}, []);

	function showConfirm() {
		confirm({
			title: '¿Está seguro de registrar el horario?',
			icon: <ExclamationCircleOutlined />,
			cancelText: 'Cancelar',
			okText: 'Grabar los cambios',
			onOk() {
				GuardarHorario();
			},
			onCancel() {
				// setAbrir(false);
			},
		});
	}

	return (
		<>
			<Modal
				title="Horario de Administración"
				visible={abrir}
				onOk={showConfirm}
				onCancel={() => setAbrir(false)}
				okText="Confirmar"
				cancelText="Cancelar"
				width={400}
        okType='default'
        okButtonProps={{
          style: {background:themeSettingsGlobal.COD_COLOR_1, color: '#fff', border:'none'}
        }}
			>
				<Form ref={formRef} layout="vertical">
					<Row style={{ flexDirection: 'row' }}>
						{(!dataModal.horarios || !dataModal.horarios.length > 0) && (
							<Col lg={24} xs={24}>
								<div style={{ width: '100%', margin: '0 0 10px 0' }}>Hora Administrada</div>
								<Input
									onChange={e => onChangeHora(e)}
									type="time"
									disabled={dataModal.horarios && dataModal.horarios.length > 0}
								/>
							</Col>
						)}
						{horario.length > 0 && (
							<Col lg={24} xs={24}>
								<div
									style={{
										width: '100%',
										margin:
											(!dataModal.horarios || !dataModal.horarios.length > 0 ? '20px' : '0px') +
											' 0 10px 0',
									}}
								>
									Horario
								</div>
								<Checkbox.Group
									options={horario}
									defaultValue={seleccionados}
									onChange={onChange}
								/>
							</Col>
						)}
					</Row>
				</Form>
			</Modal>
		</>
	);
};
