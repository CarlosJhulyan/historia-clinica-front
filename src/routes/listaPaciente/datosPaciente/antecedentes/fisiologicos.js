import React, { useState, useEffect } from 'react';
import { Col, Form, Row, Input, Select, Spin } from 'antd';
import {
	setFisiologicosInmunizaciones,
	setFisiologicosOtrosInmunizaciones,
	setFisiologicosOtrosPrenatales,
	setFisiologicosParto,
	setFisiologicosPrenatales,
} from '../../../../appRedux/actions/menu/antecedentes';
import { useDispatch, useSelector } from 'react-redux';

const Fisiologicos = ({ parto, prenatales, inmunizaciones }) => {

	const { Option } = Select;
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const dataFisiologicos = useSelector((state) => state.antecedentesFisiologicos);
	const { historiaAntecedentes, visualizar } = useSelector(state => state.helpers);

	const [otrosP, setOtrosP] = useState(false);
	const [otrosI, setOtrosI] = useState(false);

	const handleChangePrenatales = (value) => {
		dispatch(setFisiologicosPrenatales(value));

		if (value.find((value) => value === '214')) {
			setOtrosP(true);
		} else {
			dispatch(setFisiologicosOtrosPrenatales(''));
			setOtrosP(false);
		}
	};
	const handleChangeParto = (value) => {
		dispatch(setFisiologicosParto(value));
	};
	const handleChangeInmunizaciones = (value) => {
		dispatch(setFisiologicosInmunizaciones(value));

		if (value.find((value) => value === '341')) {
			setOtrosI(true);
		} else {
			dispatch(setFisiologicosOtrosInmunizaciones(''));
			setOtrosI(false);
		}
	};
	const handleChangeOtrosP = (e) => {
		dispatch(setFisiologicosOtrosPrenatales(e.target.value));
	};

	const handleChangeOtrosI = (e) => {
		dispatch(setFisiologicosOtrosInmunizaciones(e.target.value));
	};

	useEffect(() => {

		if (dataFisiologicos.otrosPrenatales !== "") {
			setOtrosP(true);
		}

		if (dataFisiologicos.otrosInmunizaciones !== "") {
			setOtrosI(true);
		}

		form.setFieldsValue({ ...dataFisiologicos });
	}, [dataFisiologicos]);

	return (
		<Form layout="vertical" form={form}>
			<h4 style={{ padding: '20px 0 15px 25px', textTransform: 'uppercase' }}>
				<b>Fisiologicos</b>
			</h4>
			{inmunizaciones ? (
				<Row style={{ flexDirection: 'row', paddingLeft: '30px', paddingRight: '30px' }}>
					<Col lg={24} md={24} sm={24} xs={24}>
						<Form.Item
							name="prenatales"
							label="Prenatales"
							rules={[
								{
									required: true,
									message: 'Seleccione prenatales',
								},
							]}
						>
							<Select disabled={historiaAntecedentes | visualizar} mode="multiple" allowClear placeholder="Seleccione" onChange={handleChangePrenatales}>
								{prenatales.map((element) => {
									return (
										<Option key={element.CODIGO} value={element.CODIGO}>
											{element.ETIQUETA}
										</Option>
									);
								})}
							</Select>
						</Form.Item>
					</Col>
					{otrosP ? (
						<Col lg={24} md={24} sm={24} xs={24}>
							<Form.Item
								name="otrosPrenatales"
								label="Otros prenatales"
								rules={[
									{
										required: true,
										message: 'Ingrese otros prenatales',
									},
								]}
							>
								<Input disabled={historiaAntecedentes | visualizar} type="text" placeholder="Seleccione" onChange={handleChangeOtrosP} />
							</Form.Item>
						</Col>
					) : null}
					<Col lg={24} md={24} sm={24} xs={24}>
						<Form.Item
							name="parto"
							label="Parto"
							rules={[
								{
									required: true,
									message: 'Seleccione un parto',
								},
							]}
						>
							<Select disabled={historiaAntecedentes | visualizar} allowClear placeholder="Seleccione" onChange={handleChangeParto}>
								{parto.map((element) => {
									return (
										<Option key={element.CODIGO} value={element.CODIGO}>
											{element.ETIQUETA}
										</Option>
									);
								})}
							</Select>
						</Form.Item>
					</Col>
					<Col lg={24} md={24} sm={24} xs={24}>
						<Form.Item
							name="inmunizaciones"
							label="Inmunizaciones"
							rules={[
								{
									required: true,
									message: 'Seleccione inmunizaciones',
								},
							]}
						>
							<Select disabled={historiaAntecedentes | visualizar} mode="multiple" allowClear placeholder="Seleccione" onChange={handleChangeInmunizaciones}>
								{inmunizaciones.map((element) => {
									return (
										<Option key={element.CODIGO} value={element.CODIGO}>
											{element.ETIQUETA}
										</Option>
									);
								})}
							</Select>
						</Form.Item>
					</Col>
					{otrosI ? (
						<Col lg={24} md={24} sm={24} xs={24}>
							<Form.Item
								name="otrosInmunizaciones"
								label="Otros inmunizaciones"
								rules={[
									{
										required: true,
										message: 'Ingrese otros inmunizaciones',
									},
								]}
							>
								<Input disabled={historiaAntecedentes | visualizar} type="text" placeholder="Seleccione" onChange={handleChangeOtrosI} />
							</Form.Item>
						</Col>
					) : null}
				</Row>
			) : (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Spin tip="Cargando" />
				</div>
			)}
		</Form>
	);
};

export default Fisiologicos;
