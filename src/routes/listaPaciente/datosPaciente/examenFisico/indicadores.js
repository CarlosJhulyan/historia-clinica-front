import React, { createRef, useEffect } from 'react';
import { Col, Form, Row, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setFuncionesVitales, setEstadoFisico } from '../../../../appRedux/actions/menu/examenFisico';
const Indicadores = () => {
	const formRef = createRef();
	const dispatch = useDispatch();
	const { historiaClinica, visualizar } = useSelector(state => state.helpers)
	const funcionVital = useSelector((state) => state.funcionVital);
	const estadoFisico = useSelector((state) => state.estadoFisico);


	useEffect(() => {
		formRef.current.setFieldsValue({
			peso: funcionVital.peso,
			talla: funcionVital.talla,
			imc: funcionVital.imc,
			medCintura: estadoFisico.medCintura,
		});
	}, []);

	const handleCampoPeso = (value) => {
		dispatch(
			setFuncionesVitales({
				...funcionVital,
				peso: value.target.value,
			})
		);

		formRef.current.setFieldsValue({ peso: value.target.value });
	};
	const handleCampoTalla = (value) => {
		dispatch(
			setFuncionesVitales({
				...funcionVital,
				talla: value.target.value,
			})
		);
		formRef.current.setFieldsValue({ talla: value.target.value });
	};

	const handleCampoCintura = (value) => {
		dispatch(
			setEstadoFisico({
				...estadoFisico,
				medCintura: value.target.value,
			})
		);
		formRef.current.setFieldsValue({ medCintura: value.target.value });
	};

	function calcular(peso, talla) {
		return (peso / ((talla / 100).toFixed(2) * (talla / 100).toFixed(2)).toFixed(2)).toFixed(1);
	}

	useEffect(() => {
		if (funcionVital.peso !== '' && funcionVital.talla !== '') {
			let imc = calcular(funcionVital.peso, funcionVital.talla);
			dispatch(
				setFuncionesVitales({
					...funcionVital,
					imc: imc,
				})
			);
			dispatch(
				setEstadoFisico({
					...estadoFisico,
					imc: imc,
				})
			)
			formRef.current.setFieldsValue({ imc: imc });
		} else {
			formRef.current.setFieldsValue({ imc: 0 });
		}
	}, [funcionVital.peso, funcionVital.talla]);

	// useEffect(() => {
	// 	if (estado.peso && estado.talla) {
	// 		let imc = calcular(estado.peso, estado.talla);
	// 		setEstado({ ...estado, imc: imc });
	// 		formRef.current.setFieldsValue({ IMC: imc });
	// 	} else {
	// 		setEstado({ ...estado, imc: null });
	// 		formRef.current.setFieldsValue({ IMC: 0 });
	// 	}
	// }, [estado.peso, estado.talla]);

	// useEffect(() => {
	// 	if (estado !== null) {
	// 		datosEnviar.triaje['peso'] = estado.peso;
	// 		datosEnviar.triaje['talla'] = estado.talla;
	// 		formRef.current.setFieldsValue({ ...estado });
	// 		if (estado.peso != null && estado.talla != null) {
	// 			let imc = calcular(estado.peso, estado.talla);
	// 			setEstado({ ...estado, imc: imc });
	// 			formRef.current.setFieldsValue({ IMC: imc });
	// 		}
	// 	}
	// }, [estado]);

	return (
		<Form layout="vertical" ref={formRef}>
			<h4 style={{ padding: '20px 0 15px 25px', textTransform: 'uppercase' }}>
				<b>Indicadores Antropométricos</b>
			</h4>
			<Row style={{ flexDirection: 'row', paddingRight: '30px', paddingLeft: '30px' }}>
				<Col xxl={8} xl={12} lg={12} md={12} sm={12} xs={24}>
					<Row style={{ flexDirection: 'row', padding: '0px' }}>
						<Col xxl={15} xl={15} lg={15} md={15} sm={15} xs={15} style={{ padding: '0px' }}>
							<Form.Item
								name="peso"
								label="Peso"
							/* rules={[
								{
									required: true,
									message: 'Ingrese un peso válido',
								},
							]} */
							>
								<Input disabled={historiaClinica | visualizar} type="number" onChange={handleCampoPeso} style={{ width: '100% ' }} />
							</Form.Item>
						</Col>
						<Col xxl={3} xl={3} lg={3} md={3} sm={3} xs={3} style={{ alignSelf: 'center', margin: '-5px' }}>
							Kg
						</Col>
					</Row>
				</Col>
				<Col xxl={8} xl={12} lg={12} md={12} sm={12} xs={24}>
					<Row style={{ flexDirection: 'row', padding: '0px' }}>
						<Col xxl={15} xl={15} lg={15} md={15} sm={15} xs={15} style={{ padding: '0px' }}>
							<Form.Item
								name="talla"
								label="Talla"
							/* 	rules={[
									{
										required: true,
										message: 'Ingrese una talla válida',
									},
								]} */
							>
								<Input disabled={historiaClinica | visualizar} type="number" onChange={handleCampoTalla} style={{ width: '100% ' }} />
							</Form.Item>
						</Col>
						<Col xxl={3} xl={3} lg={3} md={3} sm={3} xs={3} style={{ alignSelf: 'center', margin: '-5px' }}>
							cm
						</Col>
					</Row>
				</Col>
				<Col xxl={8} xl={24} lg={24} md={24} sm={24} xs={24}>
					<Form.Item
						name="imc"
						label="IMC."
					/* 	rules={[
							{
								required: true,
								message: 'Ingrese un IMC válido',
							},
						]} */
					>
						<Input disabled type="number" style={{ width: '100% ' }} />
					</Form.Item>
				</Col>
				<Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={24}>
					<Row style={{ flexDirection: 'row', padding: '0px' }}>
						<Col xxl={15} xl={15} lg={15} md={15} sm={15} xs={15} style={{ padding: '0px' }}>
							<Form.Item
								name="medCintura"
								label="Med. Cintura"
							/* rules={[
								{
									required: true,
									message: 'Ingrese una talla válida',
								},
							]} */
							>
								<Input disabled={historiaClinica | visualizar} type="number" onChange={handleCampoCintura} style={{ width: '100% ' }} />
							</Form.Item>
						</Col>
						<Col xxl={3} xl={3} lg={3} md={3} sm={3} xs={3} style={{ alignSelf: 'center', margin: '-5px' }}>
							cm
						</Col>
					</Row>
				</Col>
			</Row>
		</Form>
	);
};

export default Indicadores;
