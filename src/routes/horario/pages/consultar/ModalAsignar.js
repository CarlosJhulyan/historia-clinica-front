import React, { useEffect, useState } from 'react';
import locale from 'antd/es/date-picker/locale/es_ES';

import {
	Card,
	Form,
	Row,
	Button,
	AutoComplete,
	Col,
	Modal,
	Input,
	TimePicker,
	DatePicker,
	Select,
} from 'antd';
import { openNotification } from '../../../../util/util';
import { httpClient } from '../../../../util/Api';

const ModalAsignar = ({ visibleModal, setVisibleModal, traerData }) => {
	const [horario, setHorario] = useState();
	const [fecha, setFecha] = useState();
	const [guardando, setGuardando] = useState(false);
	const [dataEspecialidades, setDataEspecialidades] = useState([]);
	const [dataMedicos, setDataMedicos] = useState([]);
	const [currentEspecialidad, setCurrentEspecialidad] = useState('');
	const [currentMedico, setCurrentMedico] = useState('');

	const [form] = Form.useForm();

	const guardarHorario = async () => {
		setGuardando(true);
		if (!horario || !fecha || currentMedico === '' || currentEspecialidad === '') {
			openNotification('Error', 'Debe completar todos los campos', 'Alerta');
			setGuardando(false);
			return;
		}

		const medico = dataMedicos.find(medico => medico.num_cmp === currentMedico);
		console.log('medico', medico);
		console.log('currentMedico', currentMedico);
		const response = await httpClient.post('horarios/setHorario', {
			cmp: currentMedico,
			nombreMedico: medico.des_nom_medico + ' ' + medico.des_ape_medico,
			fecha: fecha,
			horaInicio: horario[0].format('HH:mm'),
			horaFin: horario[1].format('HH:mm'),
			especialidad: medico.des_especialidad,
			idEspecialidad: medico.id_consultorio,
		});
		if (response.data.success) {
			openNotification('Exito', 'Horario asignado correctamente');
		} else {
			openNotification('Error', response.data.message, 'Alerta');
		}
		form.resetFields();
		setCurrentMedico('');
		setHorario(null);
		setFecha(null);
		setGuardando(false);
		setVisibleModal(false);
		traerData();
	};

	const traerEspeciliades = async () => {
		const response = await httpClient.post('horarios/obtenerEspecialidad');
		if (response.data.success) {
			setDataEspecialidades(response.data.data);
		}
	};

	const traerMedicos = async () => {
		const response = await httpClient.post('horarios/getMedicoByEspecialidad', {
			especialidad_id: currentEspecialidad,
		});
		if (response.data.success) {
			setDataMedicos(response.data.data);
		}
	};

	useEffect(() => {
		form.setFieldsValue({ medico: '' });
		setCurrentMedico('');
		traerMedicos();
	}, [currentEspecialidad]);

	useEffect(() => {
		traerEspeciliades();
	}, []);

	return (
		<>
			<Modal
				visible={visibleModal}
				onCancel={() => {
					if (!guardando) {
						setVisibleModal(false);
					}
				}}
				onOk={() => {
					guardarHorario();
				}}
				title="Asignar Horario"
			>
				<div style={{ padding: 10 }}>
					<Form form={form} style={{ paddingLeft: 20, paddingRight: 20 }}>
						<Row>
							<Col span={24}>
								<Form.Item name="especialidad" label="Especialidad">
									<Select onChange={setCurrentEspecialidad} value={currentEspecialidad}>
										{dataEspecialidades.map(item => (
											<Select.Option key={item.key} value={item.value}>
												{item.descripcion}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<Form.Item name="medico" label="Medico">
									<Select onChange={setCurrentMedico} value={currentMedico}>
										{dataMedicos.map(item => (
											<Select.Option key={item.num_cmp} value={item.num_cmp}>
												{item.des_nom_medico} {item.des_ape_medico}
											</Select.Option>
										))}
									</Select>
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
										placeholder={["Inicio","Fin"]}
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
		</>
	);
};

export default ModalAsignar;
