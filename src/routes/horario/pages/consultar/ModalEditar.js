/* eslint-disable default-case */
import { TextField } from '@mui/material';
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, TimePicker } from 'antd';
import { useEffect, useState } from 'react';
import locale from 'antd/es/date-picker/locale/es_ES';
import moment from 'moment';
import { openNotification } from '../../../../util/util';
import { httpClient } from '../../../../util/Api';
import confirm from 'antd/lib/modal/confirm';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ModalEditar = ({ visibleModal, setVisibleModal, medico, traerData }) => {
	const [guardando, setGuardando] = useState(false);
	const [horario, setHorario] = useState([
		moment().set({
			hour: medico.hora_inicio.split(':')[0],
			minute: medico.hora_inicio.split(':')[1],
		}),
		moment().set({
			hour: medico.hora_fin.split(':')[0],
			minute: medico.hora_fin.split(':')[1],
		}),
	]);
	const [fecha, setFecha] = useState(moment(medico.fecha));

	const confirmar = tipo => {
		confirm({
			title: '¿Está seguro de aplicar el cambio?',
			icon: <ExclamationCircleOutlined />,

			onOk() {
				switch (tipo) {
					case 'delete':
						eliminarHorario();
						break;
					case 'save':
						guardarHorario();
						break;
				}
			},

			onCancel() {
				console.log('Cancel');
			},
		});
	};

	const guardarHorario = async () => {
		setGuardando(true);
		if (!horario || !fecha) {
			openNotification('Error', 'Debe completar todos los campos', 'Alerta');
			setGuardando(false);
			return;
		}

		const response = await httpClient.post('/horarios/editarHorario', {
			id: medico.id_horario,
			fecha: fecha,
			horaInicio: horario[0].format('HH:mm'),
			horaFin: horario[1].format('HH:mm'),
		});
		if (response.data.success) {
			openNotification('Exito', 'Horario asignado correctamente');
		} else {
			openNotification('Error', response.data.message, 'Alerta');
		}
		form.resetFields();
		setHorario(null);
		setFecha(null);
		setGuardando(false);
		setVisibleModal(false);
		traerData();
	};

	const eliminarHorario = async () => {
		setGuardando(true);

		const response = await httpClient.post('/horarios/eliminarHorario', {
			id: medico.id_horario,
		});
		if (response.data.success) {
			openNotification('Exito', 'Horario eliminado correctamente');
		} else {
			openNotification('Error', response.data.message, 'Alerta');
		}
		form.resetFields();
		setHorario(null);
		setFecha(null);
		setGuardando(false);
		setVisibleModal(false);
		traerData();
	};

	const [form] = Form.useForm();

	return (
		<Modal
			visible={visibleModal}
			onCancel={() => {
				if (!guardando) {
					setVisibleModal(false);
				}
			}}
			footer={[
				<Button
					onClick={() => {
						if (!guardando) {
							setVisibleModal(false);
						}
					}}
				>
					Cancelar
				</Button>,
				<Button
					danger
					onClick={() => {
						confirmar('delete');
					}}
				>
					Eliminar
				</Button>,
				<Button
					onClick={() => {
						confirmar('save');
					}}
					type="primary"
				>
					Aceptar
				</Button>,
			]}
			title="Editar Horario"
		>
			<div style={{ padding: 10 }}>
				<Form
					form={form}
					style={{ paddingLeft: 20, paddingRight: 20 }}
					initialValues={{
						especialidad: medico.especialidad,
						medico: medico.nombre_medico,
						fecha: moment(medico.fecha),
						horario: [
							moment().set({
								hour: medico.hora_inicio.split(':')[0],
								minute: medico.hora_inicio.split(':')[1],
							}),
							moment().set({
								hour: medico.hora_fin.split(':')[0],
								minute: medico.hora_fin.split(':')[1],
							}),
						],
					}}
				>
					<Row>
						<Col span={24}>
							<Form.Item name="especialidad" label="Especialidad">
								<Input disabled></Input>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item name="medico" label="Medico">
								<Input disabled></Input>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Form.Item name="fecha" label="Fecha">
								<DatePicker
									locale={locale}
									style={{ width: '100%' }}
									onChange={data => {
										console.log('data', data);
										setFecha(data);
									}}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col xs={24}>
							<Form.Item name="horario" label="Horario">
								<TimePicker.RangePicker
									placeholder={['Inicio', 'Fin']}
									format="HH:mm"
									style={{ width: '100%' }}
									onChange={data => {
										setHorario(data);
									}}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>
		</Modal>
	);
};

export default ModalEditar;
