import React, { useEffect, useState } from 'react';

import { Card, Form, Row, Button, AutoComplete, Col, Input, TimePicker, DatePicker } from 'antd';
import ModalListaMedicos from './modalListaMedicos';
import { openNotification } from '../../../../util/util';
import { httpClient } from '../../../../util/Api';

const AsignarHorario = () => {
	const [visibleModalMedico, setVisibleModalMedico] = useState(false);
	const [medicoCurrent, setMedicoCurrent] = useState({
		NOMBRE_COMPLETO: '',
	});
	const [horario, setHorario] = useState();
	const [fecha, setFecha] = useState();
	const [guardando, setGuardando] = useState(false);

	console.log('medicoCurrent', medicoCurrent);

	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue({
			medico: medicoCurrent.NOMBRE_COMPLETO,
		});
	}, [medicoCurrent]);

	const guardarHorario = async () => {
		setGuardando(true);
		if (!horario || !fecha || medicoCurrent.NOMBRE_COMPLETO === '') {
			openNotification('Error', 'Debe seleccionar un horario y una fecha', 'Alerta');
			setGuardando(false);
			return;
		}

		const response = await httpClient.post('horarios/setHorario', {
			cmp: medicoCurrent.CMP,
			nombreMedico: medicoCurrent.NOMBRE_COMPLETO,
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
		setMedicoCurrent({ NOMBRE_COMPLETO: '' });
		setHorario(null);
		setFecha(null);
		setGuardando(false);
	};

	return (
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
							onClick={() => guardarHorario()}
						>
							Guardar
						</Button>
					</div>
				</div>
			}
		>
			<div style={{ padding: 10 }}>
				<Form form={form}>
					<Row>
						<Col xs={20}>
							<Form.Item name="medico" label="Medico">
								<Input disabled={true} style={{ width: '100%' }} placeholder="Medico" />
							</Form.Item>
						</Col>
						<Col xs={2}>
							<Button onClick={() => setVisibleModalMedico(true)}>Buscar Medico</Button>
						</Col>
					</Row>
					<Row>
						<Col xs={8}>
							<Form.Item name="fecha" label="Fecha" style={{ marginRight: 10 }}>
								<DatePicker
									style={{ width: '100%' }}
									onChange={data => {
										setFecha(data);
									}}
								/>
							</Form.Item>
						</Col>
						<Col xs={8}>
							<Form.Item name="horario" label="Horario" style={{ marginRight: 10 }}>
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
				{visibleModalMedico ? (
					<ModalListaMedicos
						visible={visibleModalMedico}
						setVisible={setVisibleModalMedico}
						setMedicoCurrent={setMedicoCurrent}
					/>
				) : null}
			</div>
		</Card>
	);
};

export default AsignarHorario;
