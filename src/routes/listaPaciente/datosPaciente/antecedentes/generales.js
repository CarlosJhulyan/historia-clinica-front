import React, { useEffect } from 'react';
import { Col, Form, Row, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
	setGeneralesMedicamentos,
	setGeneralesOcupacionales,
	setGeneralesRam,
	setHabitosNocivos,

} from '../../../../appRedux/actions/menu/antecedentes';

const Generales = ({ habitosNocivos }) => {
	const { Option } = Select;
	const dispatch = useDispatch();
	const [form] = Form.useForm();

	const dataAntecedentes = useSelector((state) => state.antecedentesGenerales);
	const { historiaAntecedentes, visualizar } = useSelector(state => state.helpers);

	const handleCampoMedicamentos = (value) => {
		dispatch(setGeneralesMedicamentos(value.target.value));
	};

	const handleCampoRAM = (value) => {
		dispatch(setGeneralesRam(value.target.value));
	};


	const handleCampoOcupacionales = (value) => {
		dispatch(setGeneralesOcupacionales(value.target.value));
	};

	const handleCampoHabitos = (value) => {
		dispatch(setHabitosNocivos(value));
	};


	useEffect(() => {
		form.setFieldsValue({ ...dataAntecedentes });
	}, [dataAntecedentes]);

	return (
		<Form layout="vertical" form={form}>
			<h4 style={{ padding: '20px 0 15px 25px', textTransform: 'uppercase' }}>
				<b>GENERALES / OCUPACIONES</b>
			</h4>
			<Row style={{ flexDirection: 'row', paddingLeft: '30px', paddingRight: '30px' }}>
				<Col lg={12} md={12} sm={12} xs={24}>
					<Form.Item
						name="medicamentos"
						label="¿Qué medicamentos toma actualmente? (Enfermedades Crónicas)"
						rules={[
							{
								required: true,
								message: 'Ingrese un Peso válido',
							},
						]}
					>
						<Input.TextArea disabled={historiaAntecedentes | visualizar} rows={4} onChange={handleCampoMedicamentos} />
					</Form.Item>
				</Col>
				<Col lg={12} md={12} sm={12} xs={24}>
					<Form.Item
						name="ram"
						label="RAM"
						rules={[
							{
								required: true,
								message: 'Ingrese un RAM válido',
							},
						]}
					>
						<Input.TextArea disabled={historiaAntecedentes | visualizar} rows={4} onChange={handleCampoRAM} />
					</Form.Item>
				</Col>

				<Col lg={12} md={12} sm={12} xs={24}>
					<Form.Item
						name="habitos"
						label="Habitos Nocivos"
						rules={[
							{
								required: true,
								message: "Ingrese un Habito válido"
							}
						]}>

						<Select disabled={historiaAntecedentes | visualizar} mode="multiple" allowClear placeholder="Seleccione" onChange={handleCampoHabitos}>
							{habitosNocivos.map((element) => {
								return (
									<Option key={element.CODIGO} value={element.CODIGO}>
										{element.ETIQUETA}
									</Option>
								);
							})}
						</Select>
					</Form.Item>
				</Col>

				<Col lg={12} md={12} sm={12} xs={24}>
					<Form.Item
						name="ocupacionales"
						label="Ocupacionales"
						rules={[
							{
								required: true,
								message: 'Ingrese un TALLA válido',
							},
						]}
					>
						<Input disabled={historiaAntecedentes | visualizar} type="text" onChange={handleCampoOcupacionales} />
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};

export default Generales;
