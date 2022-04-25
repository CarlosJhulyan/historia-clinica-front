import React, { createRef, useEffect } from 'react';
import { Col, Form, Row, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setEstadoFisico } from '../../../../appRedux/actions/menu/examenFisico';

const ExamenFisico = () => {
	const { Option } = Select;
	const formRef = createRef();
	const dispatch = useDispatch();
	const { historiaClinica, visualizar } = useSelector(state => state.helpers)

	const estadoGeneral = useSelector((state) => state.combosReducer.estadoGeneral);
	const estadoFisico = useSelector((state) => state.estadoFisico);
	const { inputRequired } = useSelector(state => state.ui);


	useEffect(() => {
		formRef.current.setFieldsValue({
			estadoGeneral: estadoFisico.estadoGeneral,
			estadoConciencia: estadoFisico.estadoConciencia,
			examenFisico: estadoFisico.examenFisico,
		});
	}, [estadoFisico]);


	const handleChangeEstadoFisisco = (e) => {
		dispatch(
			setEstadoFisico({
				...estadoFisico,
				estadoGeneral: e,
			})
		);
		formRef.current.setFieldsValue({ estadoGeneral: e });
	};
	const handleConciencia = (value) => {
		dispatch(
			setEstadoFisico({
				...estadoFisico,
				estadoConciencia: value.target.value,
			})
		);
		formRef.current.setFieldsValue({ estadoConciencia: value.target.value });
	};
	const handleExamenFisico = (value) => {
		dispatch(
			setEstadoFisico({
				...estadoFisico,
				examenFisico: value.target.value,
			})
		);
		formRef.current.setFieldsValue({ examenFisico: value.target.value });
	};

	return (
		<Form layout="vertical" ref={formRef} initialValues={estadoFisico}>
			<h4 style={{ padding: '20px 0 15px 25px', textTransform: 'uppercase' }}>
				<b>EXAMEN FISICO</b>
			</h4>
			<Row style={{ flexDirection: 'row', paddingLeft: '30px', paddingRight: '30px' }}>
				<Col lg={12} md={12} sm={12} xs={24}>
					<Form.Item
						name="estadoGeneral"
						label="Estado General"
						rules={[
							{
								required: true,
								message: 'Ingrese un estado',
							},
						]}
					>
						<Select disabled={historiaClinica | visualizar} placeholder="Seleccione" onChange={handleChangeEstadoFisisco}>
							{estadoGeneral
								? estadoGeneral.map((element) => {
									return (
										<Option key={element.CODIGO} value={element.CODIGO}>
											{element.ETIQUETA}
										</Option>
									);
								})
								: null}
						</Select>
					</Form.Item>
				</Col>
				<Col lg={12} md={12} sm={12} xs={24}>
					<Form.Item
						name="estadoConciencia"
						label="Estado Conciencia"
						rules={[
							{
								required: true,
								message: 'Ingrese un estado conciencia',
							},
						]}
					>
						<Input disabled={historiaClinica | visualizar} type="text" rows={4} onChange={handleConciencia} />
					</Form.Item>
				</Col>
				<Col lg={24} md={24} sm={24} xs={24}>
					<Form.Item
						name="examenFisico"
						label="Examen Fisico Dirigido"
						rules={[
							{
								required: true,
								message: 'Ingrese un examen fisico válido',
							},
						]}
					>
						<Input.TextArea disabled={historiaClinica | visualizar} rows={4} onChange={handleExamenFisico} />
					</Form.Item>
				</Col>
				{
					inputRequired && <Col lg={24}>
						<span style={{ color: 'red' }}>(*) Los datos indicados deben ingresarse de forma obligatoria</span>
					</Col>
				}
			</Row>
		</Form>
	);
};

export default ExamenFisico;
