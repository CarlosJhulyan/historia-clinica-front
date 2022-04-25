import React, { createRef, useEffect } from 'react';
import { Col, Form, Input, Row, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setEnfermedadActual } from '../../../appRedux/actions/menu/enfermedadActual';

const EnfermedadActual = () => {
	const { Option } = Select;
	const formRef = createRef();
	const dispatch = useDispatch();
	const { historiaClinica, visualizar } = useSelector(state => state.helpers);


	const enfermedadActual = useSelector((state) => state.enfermedadActual);
	const { inputRequired } = useSelector(state => state.ui);

	useEffect(() => {
		formRef.current.setFieldsValue({
			motivoConsulta: enfermedadActual.motivoConsulta,
			curso: enfermedadActual.curso,
			tiempoEnfermedad: enfermedadActual.tiempoEnfermedad,
			tipoInformante: enfermedadActual.tipoInformante,
			relatoCronologico: enfermedadActual.relatoCronologico,
			apetito: enfermedadActual.apetito,
			sueno: enfermedadActual.sueno,
			deposicion: enfermedadActual.deposicion,
			sed: enfermedadActual.sed,
			orina: enfermedadActual.orina,
		});
	}, [enfermedadActual]);


	//Redux
	const curso = useSelector((state) => state.combosReducer.curso);
	const tipoInformante = useSelector((state) => state.combosReducer.tipoInformante);
	const apetito = useSelector((state) => state.combosReducer.apetito);
	const sueno = useSelector((state) => state.combosReducer.sueno);
	const deposiciones = useSelector((state) => state.combosReducer.deposicion);
	const sed = useSelector((state) => state.combosReducer.sed);
	const orina = useSelector((state) => state.combosReducer.orina);

	//Setteos
	const handleChangeMotivoConsulta = (e) => {
		dispatch(
			setEnfermedadActual({
				...enfermedadActual,
				motivoConsulta: e.target.value,
			})
		);
		formRef.current.setFieldsValue({ motivoConsulta: e.target.value });

	};

	const handleChangeCurso = (e) => {
		dispatch(
			setEnfermedadActual({
				...enfermedadActual,
				curso: e,
			})
		);
		formRef.current.setFieldsValue({ curso: e });

	};

	const handleChangetipoInformante = (e) => {
		dispatch(
			setEnfermedadActual({
				...enfermedadActual,
				tipoInformante: e,
			})
		);
		formRef.current.setFieldsValue({ tiempoEnfermedad: e });

	};

	const handleChangeTiempoEnfermedad = (e) => {
		dispatch(
			setEnfermedadActual({
				...enfermedadActual,
				tiempoEnfermedad: e.target.value,
			})
		);
		formRef.current.setFieldsValue({ tipoInformante: e.target.value, });

	};

	const handleChangeRelatoCronologico = (e) => {
		dispatch(
			setEnfermedadActual({
				...enfermedadActual,
				relatoCronologico: e.target.value,
			})
		);
		formRef.current.setFieldsValue({ relatoCronologico: e.target.value, });

	};

	const handleChangeApetito = (e) => {
		dispatch(
			setEnfermedadActual({
				...enfermedadActual,
				apetito: e,
			})
		);
		formRef.current.setFieldsValue({ apetito: e, });

	};

	const handleChangeSueno = (e) => {
		dispatch(
			setEnfermedadActual({
				...enfermedadActual,
				sueno: e,
			})
		);
		formRef.current.setFieldsValue({ sueno: e, });

	};

	const handleChangeDeposicion = (e) => {
		dispatch(
			setEnfermedadActual({
				...enfermedadActual,
				deposicion: e,
			})
		);
		formRef.current.setFieldsValue({ deposicion: e, });

	};

	const handleChangeSed = (e) => {
		dispatch(
			setEnfermedadActual({
				...enfermedadActual,
				sed: e,
			})
		);
		formRef.current.setFieldsValue({ sed: e, });

	};

	const handleChangeOrina = (e) => {
		dispatch(
			setEnfermedadActual({
				...enfermedadActual,
				orina: e,
			})
		);
		formRef.current.setFieldsValue({ orina: e, });

	};

	return (
		<Form ref={formRef} layout="vertical">
			<Row style={{ flexDirection: 'row', paddingTop: 20 }}>
				<Col lg={16} md={16} sm={14} xs={24}>
					<Form.Item
						name="motivoConsulta"
						label="Motivo Consulta"
					/* rules={[
						{
							required: true,
							message: 'Ingrese un motivo de consulta válido',
						},
					]} */
					>
						<Input disabled={historiaClinica | visualizar} type="text" placeholder="Ingrese el motivo de consulta" onChange={handleChangeMotivoConsulta} />
					</Form.Item>
				</Col>
				<Col lg={8} md={8} sm={10} xs={24}>
					<Form.Item
						name="curso"
						label="Curso"
					/* rules={[
						{
							required: true,
							message: 'Ingrese un curso',
						},
					]} */
					>
						<Select disabled={historiaClinica | visualizar} placeholder="Seleccione" onChange={handleChangeCurso}>
							{curso?.map((element) => {
								return (
									<Option key={element.CODIGO} value={element.CODIGO}>
										{element.ETIQUETA}
									</Option>
								);
							})}
						</Select>
					</Form.Item>
				</Col>
				<Col lg={16} md={16} sm={14} xs={24}>
					<Form.Item
						name="tiempoEnfermedad"
						label="Tiempo Enfermedad"/* 
						validateStatus="error"
						help="Campo requerido" */
						rules={[
							{
								required: true,
								message: 'Ingrese un tiempo valido',
							},
						]}
					>
						<Input
							disabled={historiaClinica | visualizar}
							type="text"
							placeholder="Ingrese el Tiempo que lleva Enfermo"
							onChange={handleChangeTiempoEnfermedad}
						/>
					</Form.Item>
				</Col>
				<Col lg={8} md={8} sm={10} xs={24}>
					<Form.Item
						name="tipoInformante"
						label="Tipo Informante"
						rules={[
							{
								required: true,
								message: 'Ingrese un Tipo Informante',
							},
						]}
					>
						<Select disabled={historiaClinica | visualizar} placeholder="Seleccione" onChange={handleChangetipoInformante}>
							{tipoInformante
								? tipoInformante.map((element) => {
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
				<Col lg={24} md={24} sm={24} xs={24}>
					<Form.Item
						name="relatoCronologico"
						label="Relato Cronologico "
						rules={[
							{
								required: true,
								message: 'Ingrese un relato cronologico valido',
							},
						]}
					>
						<Input.TextArea
							disabled={historiaClinica | visualizar}
							rows={4}
							placeholder="Ingrese su Relato  Cronologico "
							onChange={handleChangeRelatoCronologico}
						/>
					</Form.Item>
				</Col>

				<Col lg={8} md={8} sm={10} xs={24}>
					<Form.Item
						name="apetito"
						label="Apetito"
					/* rules={[
						{
							required: true,
							message: 'Ingrese un Tipo de apetito',
						},
					]} */
					>
						<Select disabled={historiaClinica | visualizar} placeholder="Seleccione" onChange={handleChangeApetito}>
							{apetito
								? apetito.map((element) => {
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

				<Col lg={8} md={8} sm={10} xs={24}>
					<Form.Item
						name="sueno"
						label="Sueño"
					/* rules={[
						{
							required: true,
							message: 'Ingrese un Tipo de sueño',
						},
					]} */
					>
						<Select disabled={historiaClinica | visualizar} placeholder="Seleccione" onChange={handleChangeSueno}>
							{sueno
								? sueno.map((element) => {
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
				<Col lg={8} md={8} sm={10} xs={24}>
					<Form.Item
						name="deposicion"
						label="Deposiciones"
					/* rules={[
						{
							required: true,
							message: 'Ingrese un Tipo de deposicion',
						},
					]} */
					>
						<Select disabled={historiaClinica | visualizar} placeholder="Seleccione" onChange={handleChangeDeposicion}>
							{deposiciones
								? deposiciones.map((element) => {
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
				<Col lg={8} md={8} sm={10} xs={24}>
					<Form.Item
						name="sed"
						label="Sed"
					/* rules={[
						{
							required: true,
							message: 'Ingrese un Tipo de sed',
						},
					]} */
					>
						<Select disabled={historiaClinica | visualizar} placeholder="Seleccione" onChange={handleChangeSed}>
							{sed
								? sed.map((element) => {
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
				<Col lg={8} md={8} sm={10} xs={24}>
					<Form.Item
						name="orina"
						label="Orina"
					/* rules={[
						{
							required: true,
							message: 'Ingrese un Tipo de orina',
						},
					]} */
					>
						<Select disabled={historiaClinica | visualizar} placeholder="Seleccione" onChange={handleChangeOrina}>
							{orina
								? orina.map((element) => {
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
				{
					inputRequired && <Col lg={24}>
						<span style={{ color: 'red' }}>(*) Los datos indicados deben ingresarse de forma obligatoria</span>
					</Col>
				}

			</Row>
		</Form>
	);
};
export default EnfermedadActual;
