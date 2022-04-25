import React, { createRef, useEffect } from 'react';
import { datosEnviar } from '../../../../constants/datosEnviar';
import { Col, Form, Row, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setFuncionesVitales } from '../../../../appRedux/actions/menu/examenFisico';

const FuncionesVitales = () => {
	const formRef = createRef();
	const dispatch = useDispatch();

	const funcionVital = useSelector((state) => state.funcionVital);
	const { historiaClinica, visualizar } = useSelector(state => state.helpers)

	useEffect(() => {
		formRef.current.setFieldsValue({
			pa_1: funcionVital.pa_1,
			pa_2: funcionVital.pa_2,
			fr: funcionVital.fr,
			fc: funcionVital.fc,
			temp: funcionVital.temp,
			satoxigeno: funcionVital.satoxigeno,
		});
	}, []);

	const handleCampoPA1 = (value) => {
		dispatch(
			setFuncionesVitales({
				...funcionVital,
				pa_1: value.target.value,
			})
		);

		formRef.current.setFieldsValue({ pa_1: value.target.value });
	};
	const handleCampoPA2 = (value) => {
		dispatch(
			setFuncionesVitales({
				...funcionVital,
				pa_2: value.target.value,
			})
		);
		formRef.current.setFieldsValue({ pa_2: value.target.value });
	};

	const handleCampoFR = (value) => {
		dispatch(
			setFuncionesVitales({
				...funcionVital,
				fr: value.target.value,
			})
		);
		formRef.current.setFieldsValue({ fr: value.target.value });
	};
	const handleCampoFC = (value) => {
		dispatch(
			setFuncionesVitales({
				...funcionVital,
				fc: value.target.value,
			})
		);
		formRef.current.setFieldsValue({ fc: value.target.value });
	};
	const handleCampoTemp = (value) => {
		dispatch(
			setFuncionesVitales({
				...funcionVital,
				temp: value.target.value,
			})
		);
		formRef.current.setFieldsValue({ temp: value.target.value });
	};
	const handleCampoSaturacion = (value) => {
		dispatch(
			setFuncionesVitales({
				...funcionVital,
				satoxigeno: value.target.value,
			})
		);
		formRef.current.setFieldsValue({ satoxigeno: value.target.value });
	};

	return (
		<Form layout="vertical" ref={formRef}>
			<h4 style={{ padding: '20px 0 15px 25px', textTransform: 'uppercase' }}>
				<b>Funciones Vitales</b>
			</h4>
			<Row style={{ flexDirection: 'row', paddingLeft: '30px' }}>
				<Col xxl={12} xl={12} lg={14} md={24} sm={15} xs={24}>
					<Input.Group>
						<Row style={{ flexDirection: 'row', padding: '0px' }}>
							<Col xs={12} style={{ flexDirection: 'row', padding: '0px' }}>
								<Row style={{ flexDirection: 'row', padding: '0px' }}>
									<Col xxl={15} xl={15} lg={15} md={15} sm={15} xs={15} style={{ padding: '0px' }}>
										<Form.Item name="pa_1" label="P.A.">
											<Input disabled={historiaClinica | visualizar} type="number" onChange={handleCampoPA1} style={{ width: '100% ' }} />
										</Form.Item>
									</Col>
									<Col xxl={3} xl={3} lg={3} md={3} sm={3} xs={3} style={{ alignSelf: 'center', margin: '-5px' }}>
										/
									</Col>
								</Row>
							</Col>
							<Col xs={12} style={{ flexDirection: 'row', padding: '0px' }}>
								<Row style={{ flexDirection: 'row', padding: '0px' }}>
									<Col xs={14} style={{ padding: '0px' }}>
										<Form.Item name="pa_2" label=".">
											<Input disabled={historiaClinica | visualizar} type="number" onChange={handleCampoPA2} style={{ width: '100% ' }} />
										</Form.Item>
									</Col>
									<Col xs={8} style={{ alignSelf: 'center', margin: '-15px' }}>
										&nbsp;MMHG
									</Col>
								</Row>
							</Col>
						</Row>
					</Input.Group>
				</Col>
				<Col xxl={6} xl={6} lg={10} md={12} sm={9} xs={24}>
					<Row style={{ flexDirection: 'row', padding: '0px' }}>
						<Col xxl={15} xl={15} lg={15} md={15} sm={15} xs={15} style={{ padding: '0px' }}>
							<Form.Item
								name="fr"
								label="F.R."
							/* rules={[
								{
									required: true,
									message: 'Ingrese un RF válido',
								},
							]} */
							>
								<Input disabled={historiaClinica | visualizar} type="number" onChange={handleCampoFR} style={{ width: '100% ' }} />
							</Form.Item>
						</Col>
						<Col xxl={3} xl={3} lg={3} md={3} sm={3} xs={3} style={{ alignSelf: 'center', margin: '-5px' }}>
							X'
						</Col>
					</Row>
				</Col>
				<Col xxl={6} xl={6} lg={7} md={12} sm={7} xs={24}>
					<Row style={{ flexDirection: 'row', padding: '0px' }}>
						<Col xxl={15} xl={15} lg={15} md={15} sm={15} xs={15} style={{ padding: '0px' }}>
							<Form.Item
								name="fc"
								label="F.C."
							/* 	rules={[
									{
										required: true,
										message: 'Ingrese un PRES válido',
									},
								]} */
							>
								<Input disabled={historiaClinica | visualizar} type="number" onChange={handleCampoFC} style={{ width: '100% ' }} />
							</Form.Item>
						</Col>
						<Col xxl={3} xl={3} lg={3} md={3} sm={3} xs={3} style={{ alignSelf: 'center', margin: '-5px' }}>
							X'
						</Col>
					</Row>
				</Col>
				<Col xxl={12} xl={12} lg={7} md={12} sm={7} xs={24}>
					<Row style={{ flexDirection: 'row', padding: '0px' }}>
						<Col xxl={15} xl={15} lg={15} md={15} sm={15} xs={15} style={{ padding: '0px' }}>
							<Form.Item
								name="temp"
								label="Temp."
							/* rules={[
								{
									required: true,
									message: 'Ingrese un T válido',
								},
							]} */
							>
								<Input disabled={historiaClinica | visualizar} type="number" onChange={handleCampoTemp} style={{ width: '100% ' }} />
							</Form.Item>
						</Col>
						<Col xxl={3} xl={3} lg={3} md={3} sm={3} xs={3} style={{ alignSelf: 'center', margin: '-5px' }}>
							ºC
						</Col>
					</Row>
				</Col>
				<Col xxl={12} xl={12} lg={10} md={12} sm={10} xs={24}>
					<Row style={{ flexDirection: 'row', padding: '0px' }}>
						<Col xxl={15} xl={15} lg={15} md={15} sm={15} xs={15} style={{ padding: '0px' }}>
							<Form.Item
								name="satoxigeno"
								label="Saturación Oxigeno"
							/* 	rules={[
									{
										required: true,
										message: 'Ingrese una Saturación Oxigeno',
									},
								]} */
							>
								<Input disabled={historiaClinica | visualizar} type="number" onChange={handleCampoSaturacion} style={{ width: '100% ' }} />
							</Form.Item>
						</Col>
						<Col xxl={3} xl={3} lg={3} md={3} sm={3} xs={3} style={{ alignSelf: 'center', margin: '-5px' }}>
							%
						</Col>
					</Row>
				</Col>
			</Row>
		</Form>
	);
};

export default FuncionesVitales;
