import React, { useEffect, useState } from 'react';

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
import { Option } from 'antd/lib/mentions';
import ConsultarHorario from '../consultar';

const AsignarHorario = () => {
	const [visibleModal, setVisibleModal]= useState(false);
	const [horario, setHorario] = useState();
	const [fecha, setFecha] = useState();
	const [guardando, setGuardando] = useState(false);
	const [dataEspecialidades, setDataEspecialidades] = useState([]);
	const [dataMedicos, setDataMedicos] = useState([]);
	const [currentEspecialidad, setCurrentEspecialidad] = useState('');
	const [currentMedico, setCurrentMedico] = useState('');

	const [form] = Form.useForm();

	const defVisible=()=>{
		console.log("Ingresando al def")
		setVisibleModal(true);
	}

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
	const layout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 },
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
			>

				<Card
					title={
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: '10px',
							}}
						>
							<div
								style={{
									width: '50%',
									fontSize: '22px',
									marginTop: '15px',
								}}
							>
								Mantenedor de Horario
							</div>
							<div
								style={{
									width: '50%',
									display: 'flex',
									justifyContent: 'right',
								}}
							>
								<Button
									loading={guardando}
									style={{
										backgroundColor: '#04B0AD',
										color: 'white',
										marginTop: '10px',
									}}
									onClick={() =>{ guardarHorario();
										setVisibleModal(false);
									}}
								>
									Guardar
								</Button>
							</div>
						</div>
					}
				>
					<div style={{ padding: 10 }}>
						<Form {...layout} form={form} style={{ paddingLeft: 20, paddingRight: 20 }}>
							<Row>
								<Col span={12}>
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
								<Col span={12}>
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
								<Col span={12}>
									<Form.Item name="fecha" label="Fecha">
										<DatePicker
											style={{ width: '100%' }}
											onChange={data => {
												setFecha(data);
											}}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row>
								<Col xs={12}>
									<Form.Item name="horario" label="Horario">
										<TimePicker.RangePicker
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
				</Card>
			</Modal>
				<ConsultarHorario defV={defVisible}></ConsultarHorario>
		</>
	);
};

export default AsignarHorario;
