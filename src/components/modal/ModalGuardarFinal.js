import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { notification, message, Modal, Button, Row, Col } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpacity } from '../../appRedux/actions/Opacity';

import { httpClient } from '../../util/Api';
import { notificaciones } from '../../util/util';

export const ModalGuardarFinal = ({
	enviarData,
	enviarData2,
	modalGuardar,
	setModalGuardar,
	limpiarData,
	setModalImpresion,
	traerDatos,
	setMostrarListaPaciente,
}) => {

	const dispatch = useDispatch();
	const token = JSON.parse(localStorage.getItem('token'));

	const onConfirmAtendido = async () => {
		/* setModalImpresion(true); */
		console.log('Atendido');
		setModalGuardar(false);
		dispatch(setOpacity(false));
		console.log('DATITA', enviarData);

		try {
			enviarData.estadoConsulta.codestadonew = 'A';
			enviarData.especialidad = token.des_especialidad.toUpperCase();
			const e = await httpClient.post('/consulta/setConsulta', enviarData);
			if (e.data.success) {
				enviarData2.cod_medico = token.cod_medico;
				const env = await httpClient.post('/consulta/guardarSugerencias', enviarData2);
				setModalImpresion(true);
				traerDatos();
			} else {
				dispatch(setOpacity(true));
				throw e.data.message;
			}
		} catch (error) {
			dispatch(setOpacity(true));
			throw error;
		}
	};

	const onCancelGuardado = async () => {
		console.log('Guardado');
		setModalGuardar(false);
		dispatch(setOpacity(false));
		console.log('DATITA', enviarData);

		try {
			enviarData.estadoConsulta.codestadonew = 'G';
			enviarData.especialidad = token.des_especialidad.toUpperCase();
			const e = await httpClient.post('/consulta/setConsulta', enviarData);
			if (!e.data.success) {
				dispatch(setOpacity(true));
				throw e.data.message;
			} else {
				enviarData2.cod_medico = token.cod_medico;
				const env = await httpClient.post('/consulta/guardarSugerencias', enviarData2);
				setMostrarListaPaciente(true);
				traerDatos();
				limpiarData();
			}
		} catch (error) {
			dispatch(setOpacity(true));
			throw error;
		}
	};

	return (
		<>
			<Modal
				visible={modalGuardar}
				onCancel={() => setModalGuardar(false)}
				footer={[
					<Row key="1" style={{ flexDirection: 'row' }}>
						<Col lg={12}>
							<div>
								<Button
									onClick={() => {
										notificaciones('Guardado Temporalmente', 'Promesa', {
											promesa: onCancelGuardado,
											pendiente: 'Guardando datos',
											error: 'Alerta al guardar los datos',
											ok: 'Datos guardados',
										});
									}}
								>
									No, Grabar Temporalmente
								</Button>
							</div>
						</Col>
						<Col lg={12}>
							<div>
								<Button
									onClick={() =>
										notificaciones('Paciente Atendido', 'Promesa', {
											promesa: onConfirmAtendido,
											pendiente: 'Guardando datos',
											error: 'Alerta al guardar los datos',
											ok: 'Datos guardados',
										})
									}
									type="primary"
								>
									Si, Genera Recetas y Otros
								</Button>
							</div>
						</Col>
					</Row>,
				]}
			>
				<div style={{ textAlign: 'center' }}>
					<ExclamationCircleOutlined
						style={{ fontSize: '70px', color: 'orange', marginBottom: '20px' }}
					/>
					<h1 style={{ fontWeight: 'bold' }}>¿Qué desea hacer?</h1>
				</div>
				<div style={{ textAlign: 'center' }}>
					<h4>Finalizar Consulta Médica</h4>
				</div>
			</Modal>

			{/* <SweetAlert
				title="Que desea hacer?"
				show={modalGuardar}
				style={{
					width: '30%',
				}}
				warning
				showCancel

				cancelBtnText="No, Grabar Temporalmente"
				onCancel={() =>
					notificaciones('Guardado Temporalmente', 'Promesa', {
						promesa: onCancelGuardado,
						pendiente: 'Guardando datos',
						error: 'Error al guardar los datos',
						ok: 'Datos guardados',
					})
				}
				confirmBtnText="Si, Genera Recetas y Otros"
				onConfirm={() =>
					notificaciones('Paciente Atendido', 'Promesa', {
						promesa: onConfirmAtendido,
						pendiente: 'Guardando datos',
						error: 'Error al guardar los datos',
						ok: 'Datos guardados',
					})
				}
			>
				Finalizar Consulta Medica
			</SweetAlert> */}
		</>
	);
};
