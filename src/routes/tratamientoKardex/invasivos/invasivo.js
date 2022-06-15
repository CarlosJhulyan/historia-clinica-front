import { useEffect, useState } from 'react';
// import TablaEspeciales from './tabla/tabla';
// import ModalImagenes from '../../listaPaciente/datosPaciente/imagenes/modalImagenes';
// import ModalLaboratorio from '../../listaPaciente/datosPaciente/Laboratorio/modalLaboratorio';

import { Button, Form, Row, Col, DatePicker, Select, notification, Divider, Space, Input, Typography } from 'antd';
import moment from 'moment';
import { httpClient } from '../../../util/Api';
import { set } from 'nprogress';
import { PlusOutlined } from '@ant-design/icons';


const Invasivo = ({ historia }) => {
	console.log(historia, 'invasivos cod paciente');
	const [btnDisable, setBtnDisable] = useState(false)
	const [items, setItems] = useState(['Obstruccion', 'Necesita']);
	const [name, setName] = useState('');
	let index = 0;

	const onFinish = async (values) => {
		setBtnDisable(true);
		const { FECHA_CVC, FECHA_TET, FECHA_VIA_PERIFERIA, MOTIVO_VIA_PERIFERICA, FECHA_SNG, FECHA_FOLEY } = values;
		const cvc = moment(FECHA_CVC._d).format("DD-MM-YY");
		const tet = moment(FECHA_TET._d).format("DD-MM-YY");
		const via_periferica = moment(FECHA_VIA_PERIFERIA._d).format("DD-MM-YY");
		const sng = moment(FECHA_SNG._d).format("DD-MM-YY");
		const foley = moment(FECHA_FOLEY._d).format("DD-MM-YY");
		const codPaciente = historia.codPaciente;

		const invasivo = await httpClient.post('/kardex/addInvacivos', { cvc, tet, via_periferica, MOTIVO_VIA_PERIFERICA, sng, foley, codPaciente });

		if (invasivo.data.success) {
			notification.success({
				message: 'Se Registro con exito',
				description: null,
			});	
			setBtnDisable(false);
		}
	}
	const onFinishFailed = () => {

	}

	const onNameChange = (event) => {
		setName(event.target.value);
	  };
	const addItem = (e) => {
		e.preventDefault();
		setItems([...items, name || `New item ${index++}`]);
		setName('');
	  };

	const { Option } = Select;
	return (
		<>
			<Form
				name="form invasivos"
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				labelCol={{
					span: 4,
				}}
				wrapperCol={{
					span: 20,
				}}
			>
				<Row style={{ padding: '20px' }}>
					<Col lg={12} md={12} sm={10} xs={24} >
						<Form.Item label="C.V.C" name="FECHA_CVC">
							<DatePicker placeholder='fecha Colocacion' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={10} xs={24}  >
						<Form.Item label="T.E.T" name="FECHA_TET">
							<DatePicker placeholder='fecha Colocacion' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={10} xs={24}  >
						<Form.Item label="Via Periferica" name="FECHA_VIA_PERIFERIA">
							<DatePicker placeholder='fecha Colocacion' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={10} xs={24}  >
						<Form.Item label="Motivo" name="MOTIVO_VIA_PERIFERICA">

							<Select
								// style={{
								// 	width: 300,
								// }}
								// placeholder="custom dropdown render"
								defaultValue="Obstruccion"
								dropdownRender={(menu) => (
									<>
										{menu}
										<Divider
											style={{
												margin: '8px 0',
											}}
										/>
										<Space
											align="center"
											style={{
												padding: '0 8px 4px',
											}}
										>
											<Input placeholder="Agregar motivo" value={name} onChange={onNameChange} />
											<Typography.Link
												onClick={addItem}
												style={{
													whiteSpace: 'nowrap',
												}}
											>
												<PlusOutlined /> Add item
											</Typography.Link>
										</Space>
									</>
								)}
							>
								{items.map((item) => (
									<Option key={item}>{item}</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={10} xs={24}  >
						<Form.Item label="S.N.G" name="FECHA_SNG">
							<DatePicker placeholder='fecha Colocacion' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={10} xs={24}  >
						<Form.Item label="FOLEY" name="FECHA_FOLEY">
							<DatePicker placeholder='fecha Colocacion' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col lg={24} md={24} sm={24} xs={24} >
						<Form.Item >
							<Button disabled={btnDisable} type="primary" htmlType="submit">
								Guardar
							</Button>
						</Form.Item>
					</Col>
				</Row>


			</Form>
		</>
	)
}

export default Invasivo;
