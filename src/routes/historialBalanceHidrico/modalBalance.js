import { Col, Divider, Form, Modal, Row } from 'antd';
import React, { createRef, useEffect, useMemo, useState } from 'react';
import Moment from 'moment';

const date = Moment().locale('es');

export const ModalBalanceHidrico = ({ mostrarDetalles, setMostrarDetalles, data }) => {
	const formRef = useMemo(() => createRef(), []);

	const [egresos, setEgresos] = useState({
		egreso_diuresis_0814: 0.0,
		egreso_diuresis_1420: 0.0,
		egreso_diuresis_2008: 0.0,
		egreso_deposicion_0814: 0.0,
		egreso_deposicion_1420: 0.0,
		egreso_deposicion_2008: 0.0,
		egreso_temperatura_0814: 0.0,
		egreso_temperatura_1420: 0.0,
		egreso_temperatura_2008: 0.0,
		egreso_opcional: '',
		egreso_valor_0814: 0.0,
		egreso_valor_1420: 0.0,
		egreso_valor_2008: 0.0,
	});
	const [totalDiuresis, setTotalDiuresis] = useState(0.0);
	const [totalDeposicion, setTotalDeposicion] = useState(0.0);
	const [totalTemperatura, setTotalTemperatura] = useState(0.0);
	const [egresoPI, setEgresoPI] = useState(0.0);
	const [totalOpcionalEgreso, setTotalOpcionalEgreso] = useState(0.0);
	const [totalEgreso0814, setTotalEgreso0814] = useState(0.0);
	const [totalEgreso1420, setTotalEgreso1420] = useState(0.0);
	const [totalEgreso2008, setTotalEgreso2008] = useState(0.0);
	const [totalEgreso, setTotalEgreso] = useState(0.0);
	const [balance, setBalance] = useState(0.0);
	const [ingresos, setIngresos] = useState({
		ingreso_oral_0814: 0.0,
		ingreso_oral_1420: 0.0,
		ingreso_oral_2008: 0.0,
		ingreso_parental_0814: 0.0,
		ingreso_parental_1420: 0.0,
		ingreso_parental_2008: 0.0,
		ingreso_tratamiento_0814: 0.0,
		ingreso_tratamiento_1420: 0.0,
		ingreso_tratamiento_2008: 0.0,
		ingreso_opcional: '',
		ingreso_valor_0814: 0.0,
		ingreso_valor_1420: 0.0,
		ingreso_valor_2008: 0.0,
	});
	const [totalOral, setTotalOral] = useState(0.0);
	const [totalParental, setTotalParental] = useState(0.0);
	const [totalTrataminto, setTotalTratamiento] = useState(0.0);
	const [ingresoAO, setIngresoAO] = useState(0.0);
	const [totalOpcionalIngreso, setTotalOpcionalIngreso] = useState(0.0);
	const [totalIngreso0814, setTotalIngreso0814] = useState(0.0);
	const [totalIngreso1420, setTotalIngreso1420] = useState(0.0);
	const [totalIngreso2008, setTotalIngreso2008] = useState(0.0);
	const [totalIngreso, setTotalIngreso] = useState(0.0);

	useEffect(() => {
		setTotalDiuresis(
			parseFloat(egresos.egreso_diuresis_0814 !== '' ? egresos.egreso_diuresis_0814 : 0) +
				parseFloat(egresos.egreso_diuresis_1420 !== '' ? egresos.egreso_diuresis_1420 : 0) +
				parseFloat(egresos.egreso_diuresis_2008 !== '' ? egresos.egreso_diuresis_2008 : 0)
		);
		setTotalDeposicion(
			parseFloat(egresos.egreso_deposicion_0814 !== '' ? egresos.egreso_deposicion_0814 : 0) +
				parseFloat(egresos.egreso_deposicion_1420 !== '' ? egresos.egreso_deposicion_1420 : 0) +
				parseFloat(egresos.egreso_deposicion_2008 !== '' ? egresos.egreso_deposicion_2008 : 0)
		);
		setTotalTemperatura(
			parseFloat(egresos.egreso_temperatura_0814 !== '' ? egresos.egreso_temperatura_0814 : 0) +
				parseFloat(egresos.egreso_temperatura_1420 !== '' ? egresos.egreso_temperatura_1420 : 0) +
				parseFloat(egresos.egreso_temperatura_2008 !== '' ? egresos.egreso_temperatura_2008 : 0)
		);
		setTotalOpcionalEgreso(
			parseFloat(egresos.egreso_valor_0814 !== '' ? egresos.egreso_valor_0814 : 0) +
				parseFloat(egresos.egreso_valor_1420 !== '' ? egresos.egreso_valor_1420 : 0) +
				parseFloat(egresos.egreso_valor_2008 !== '' ? egresos.egreso_valor_2008 : 0)
		);
		setTotalEgreso0814(
			parseFloat(egresos.egreso_diuresis_0814 !== '' ? egresos.egreso_diuresis_0814 : 0) +
				parseFloat(egresos.egreso_deposicion_0814 !== '' ? egresos.egreso_deposicion_0814 : 0) +
				parseFloat(egresos.egreso_temperatura_0814 !== '' ? egresos.egreso_temperatura_0814 : 0) +
				parseFloat(egresos.egreso_valor_0814 !== '' ? egresos.egreso_valor_0814 : 0) +
				parseFloat(egresoPI !== '' ? egresoPI / 4 : 0)
		);
		setTotalEgreso1420(
			parseFloat(egresos.egreso_diuresis_1420 !== '' ? egresos.egreso_diuresis_1420 : 0) +
				parseFloat(egresos.egreso_deposicion_1420 !== '' ? egresos.egreso_deposicion_1420 : 0) +
				parseFloat(egresos.egreso_temperatura_1420 !== '' ? egresos.egreso_temperatura_1420 : 0) +
				parseFloat(egresos.egreso_valor_1420 !== '' ? egresos.egreso_valor_1420 : 0) +
				parseFloat(egresoPI !== '' ? egresoPI / 4 : 0)
		);
		setTotalEgreso2008(
			parseFloat(egresos.egreso_diuresis_2008 !== '' ? egresos.egreso_diuresis_2008 : 0) +
				parseFloat(egresos.egreso_deposicion_2008 !== '' ? egresos.egreso_deposicion_2008 : 0) +
				parseFloat(egresos.egreso_temperatura_2008 !== '' ? egresos.egreso_temperatura_2008 : 0) +
				parseFloat(egresos.egreso_valor_2008 !== '' ? egresos.egreso_valor_2008 : 0) +
				parseFloat(egresoPI !== '' ? egresoPI / 2 : 0)
		);
		setTotalEgreso(
			parseFloat(egresoPI !== '' ? egresoPI : 0) +
				parseFloat(egresos.egreso_diuresis_0814 !== '' ? egresos.egreso_diuresis_0814 : 0) +
				parseFloat(egresos.egreso_diuresis_1420 !== '' ? egresos.egreso_diuresis_1420 : 0) +
				parseFloat(egresos.egreso_diuresis_2008 !== '' ? egresos.egreso_diuresis_2008 : 0) +
				parseFloat(egresos.egreso_deposicion_0814 !== '' ? egresos.egreso_deposicion_0814 : 0) +
				parseFloat(egresos.egreso_deposicion_1420 !== '' ? egresos.egreso_deposicion_1420 : 0) +
				parseFloat(egresos.egreso_deposicion_2008 !== '' ? egresos.egreso_deposicion_2008 : 0) +
				parseFloat(egresos.egreso_temperatura_0814 !== '' ? egresos.egreso_temperatura_0814 : 0) +
				parseFloat(egresos.egreso_temperatura_1420 !== '' ? egresos.egreso_temperatura_1420 : 0) +
				parseFloat(egresos.egreso_temperatura_2008 !== '' ? egresos.egreso_temperatura_2008 : 0) +
				parseFloat(egresos.egreso_valor_0814 !== '' ? egresos.egreso_valor_0814 : 0) +
				parseFloat(egresos.egreso_valor_1420 !== '' ? egresos.egreso_valor_1420 : 0) +
				parseFloat(egresos.egreso_valor_2008 !== '' ? egresos.egreso_valor_2008 : 0)
		);
	}, [egresos, egresoPI]);

	useEffect(() => {
		setTotalOral(
			parseFloat(ingresos.ingreso_oral_0814 !== '' ? ingresos.ingreso_oral_0814 : 0) +
				parseFloat(ingresos.ingreso_oral_1420 !== '' ? ingresos.ingreso_oral_1420 : 0) +
				parseFloat(ingresos.ingreso_oral_2008 !== '' ? ingresos.ingreso_oral_2008 : 0)
		);
		setTotalParental(
			parseFloat(ingresos.ingreso_parental_0814 !== '' ? ingresos.ingreso_parental_0814 : 0) +
				parseFloat(ingresos.ingreso_parental_1420 !== '' ? ingresos.ingreso_parental_1420 : 0) +
				parseFloat(ingresos.ingreso_parental_2008 !== '' ? ingresos.ingreso_parental_2008 : 0)
		);
		setTotalTratamiento(
			parseFloat(ingresos.ingreso_tratamiento_0814 !== '' ? ingresos.ingreso_tratamiento_0814 : 0) +
				parseFloat(
					ingresos.ingreso_tratamiento_1420 !== '' ? ingresos.ingreso_tratamiento_1420 : 0
				) +
				parseFloat(ingresos.ingreso_tratamiento_2008 !== '' ? ingresos.ingreso_tratamiento_2008 : 0)
		);
		setTotalOpcionalIngreso(
			parseFloat(ingresos.ingreso_valor_0814 !== '' ? ingresos.ingreso_valor_0814 : 0) +
				parseFloat(ingresos.ingreso_valor_1420 !== '' ? ingresos.ingreso_valor_1420 : 0) +
				parseFloat(ingresos.ingreso_valor_2008 !== '' ? ingresos.ingreso_valor_2008 : 0)
		);
		setTotalIngreso0814(
			parseFloat(ingresos.ingreso_oral_0814 !== '' ? ingresos.ingreso_oral_0814 : 0) +
				parseFloat(ingresos.ingreso_parental_0814 !== '' ? ingresos.ingreso_parental_0814 : 0) +
				parseFloat(
					ingresos.ingreso_tratamiento_0814 !== '' ? ingresos.ingreso_tratamiento_0814 : 0
				) +
				parseFloat(ingresos.ingreso_valor_0814 !== '' ? ingresos.ingreso_valor_0814 : 0) +
				parseFloat(ingresoAO !== '' ? ingresoAO / 4 : 0)
		);
		setTotalIngreso1420(
			parseFloat(ingresos.ingreso_oral_1420 !== '' ? ingresos.ingreso_oral_1420 : 0) +
				parseFloat(ingresos.ingreso_parental_1420 !== '' ? ingresos.ingreso_parental_1420 : 0) +
				parseFloat(
					ingresos.ingreso_tratamiento_1420 !== '' ? ingresos.ingreso_tratamiento_1420 : 0
				) +
				parseFloat(ingresos.ingreso_valor_1420 !== '' ? ingresos.ingreso_valor_1420 : 0) +
				parseFloat(ingresoAO !== '' ? ingresoAO / 4 : 0)
		);
		setTotalIngreso2008(
			parseFloat(ingresos.ingreso_oral_2008 !== '' ? ingresos.ingreso_oral_2008 : 0) +
				parseFloat(ingresos.ingreso_parental_2008 !== '' ? ingresos.ingreso_parental_2008 : 0) +
				parseFloat(
					ingresos.ingreso_tratamiento_2008 !== '' ? ingresos.ingreso_tratamiento_2008 : 0
				) +
				parseFloat(ingresos.ingreso_valor_2008 !== '' ? ingresos.ingreso_valor_2008 : 0) +
				parseFloat(ingresoAO !== '' ? ingresoAO / 2 : 0)
		);
		setTotalIngreso(
			parseFloat(ingresoAO !== '' ? ingresoAO : 0) +
				parseFloat(ingresos.ingreso_oral_0814 !== '' ? ingresos.ingreso_oral_0814 : 0) +
				parseFloat(ingresos.ingreso_oral_1420 !== '' ? ingresos.ingreso_oral_1420 : 0) +
				parseFloat(ingresos.ingreso_oral_2008 !== '' ? ingresos.ingreso_oral_2008 : 0) +
				parseFloat(ingresos.ingreso_parental_0814 !== '' ? ingresos.ingreso_parental_0814 : 0) +
				parseFloat(ingresos.ingreso_parental_1420 !== '' ? ingresos.ingreso_parental_1420 : 0) +
				parseFloat(ingresos.ingreso_parental_2008 !== '' ? ingresos.ingreso_parental_2008 : 0) +
				parseFloat(
					ingresos.ingreso_tratamiento_0814 !== '' ? ingresos.ingreso_tratamiento_0814 : 0
				) +
				parseFloat(
					ingresos.ingreso_tratamiento_1420 !== '' ? ingresos.ingreso_tratamiento_1420 : 0
				) +
				parseFloat(
					ingresos.ingreso_tratamiento_2008 !== '' ? ingresos.ingreso_tratamiento_2008 : 0
				) +
				parseFloat(ingresos.ingreso_valor_0814 !== '' ? ingresos.ingreso_valor_0814 : 0) +
				parseFloat(ingresos.ingreso_valor_1420 !== '' ? ingresos.ingreso_valor_1420 : 0) +
				parseFloat(ingresos.ingreso_valor_2008 !== '' ? ingresos.ingreso_valor_2008 : 0)
		);
	}, [ingresos, ingresoAO]);

	useEffect(() => {
		setBalance((totalIngreso - totalEgreso).toFixed(2));
	}, [totalEgreso, totalIngreso]);

	useEffect(() => {
		formRef.current.setFieldsValue({
			fecha: date,
		});
	}, [data.estacion, formRef]);

	useEffect(() => {
		if (data) {
			setIngresos({
				ingreso_oral_0814: data.i_oral_0814 ? data.i_oral_0814 : 0.0,
				ingreso_oral_1420: data.i_oral_1420 ? data.i_oral_1420 : 0.0,
				ingreso_oral_2008: data.i_oral_2008 ? data.i_oral_2008 : 0.0,
				ingreso_parental_0814: data.i_parental_0814 ? data.i_parental_0814 : 0.0,
				ingreso_parental_1420: data.i_parental_1420 ? data.i_parental_1420 : 0.0,
				ingreso_parental_2008: data.i_parental_2008 ? data.i_parental_2008 : 0.0,
				ingreso_tratamiento_0814: data.i_tratamiento_0814 ? data.i_tratamiento_0814 : 0.0,
				ingreso_tratamiento_1420: data.i_tratamiento_1420 ? data.i_tratamiento_1420 : 0.0,
				ingreso_tratamiento_2008: data.i_tratamiento_2008 ? data.i_tratamiento_2008 : 0.0,
				ingreso_opcional: data.i_opcional ? data.i_opcional : 0.0,
				ingreso_valor_0814: data.i_valor_0814 ? data.i_valor_0814 : 0.0,
				ingreso_valor_1420: data.i_valor_1420 ? data.i_valor_1420 : 0.0,
				ingreso_valor_2008: data.i_valor_2008 ? data.i_valor_2008 : 0.0,
			});
			setEgresos({
				egreso_diuresis_0814: data.e_diuresis_0814 ? data.e_diuresis_0814 : 0.0,
				egreso_diuresis_1420: data.e_diuresis_1420 ? data.e_diuresis_1420 : 0.0,
				egreso_diuresis_2008: data.e_diuresis_2008 ? data.e_diuresis_2008 : 0.0,
				egreso_deposicion_0814: data.e_deposicion_0814 ? data.e_deposicion_0814 : 0.0,
				egreso_deposicion_1420: data.e_deposicion_1420 ? data.e_deposicion_1420 : 0.0,
				egreso_deposicion_2008: data.e_deposicion_2008 ? data.e_deposicion_2008 : 0.0,
				egreso_temperatura_0814: data.e_temperatura_0814 ? data.e_temperatura_0814 : 0.0,
				egreso_temperatura_1420: data.e_temperatura_1420 ? data.e_temperatura_1420 : 0.0,
				egreso_temperatura_2008: data.e_temperatura_2008 ? data.e_temperatura_2008 : 0.0,
				egreso_opcional: data.e_opcional ? data.e_opcional : 0.0,
				egreso_valor_0814: data.e_valor_0814 ? data.e_valor_0814 : 0.0,
				egreso_valor_1420: data.e_valor_1420 ? data.e_valor_1420 : 0.0,
				egreso_valor_2008: data.e_valor_2008 ? data.e_valor_2008 : 0.0,
			});
		}
	}, [data]);

	useEffect(() => {
		if (data.peso) {
			setEgresoPI(parseFloat(data.peso) * parseFloat(data.estacion));
			setIngresoAO((parseFloat(data.peso) * parseFloat(data.estacion)) / 3);
			setTotalEgreso(
				parseFloat(data.peso) * parseFloat(data.estacion) +
					parseFloat(egresos.egreso_diuresis_0814) +
					parseFloat(egresos.egreso_diuresis_1420) +
					parseFloat(egresos.egreso_diuresis_2008) +
					parseFloat(egresos.egreso_deposicion_0814) +
					parseFloat(egresos.egreso_deposicion_1420) +
					parseFloat(egresos.egreso_deposicion_2008) +
					parseFloat(egresos.egreso_temperatura_0814) +
					parseFloat(egresos.egreso_temperatura_1420) +
					parseFloat(egresos.egreso_temperatura_2008) +
					parseFloat(egresos.egreso_valor_0814) +
					parseFloat(egresos.egreso_valor_1420) +
					parseFloat(egresos.egreso_valor_2008)
			);
			setTotalIngreso(
				(parseFloat(data.peso) * parseFloat(data.estacion)) / 3 +
					parseFloat(ingresos.ingreso_oral_0814) +
					parseFloat(ingresos.ingreso_oral_1420) +
					parseFloat(ingresos.ingreso_oral_2008) +
					parseFloat(ingresos.ingreso_parental_0814) +
					parseFloat(ingresos.ingreso_parental_1420) +
					parseFloat(ingresos.ingreso_parental_2008) +
					parseFloat(ingresos.ingreso_tratamiento_0814) +
					parseFloat(ingresos.ingreso_tratamiento_1420) +
					parseFloat(ingresos.ingreso_tratamiento_2008) +
					parseFloat(ingresos.ingreso_valor_0814) +
					parseFloat(ingresos.ingreso_valor_1420) +
					parseFloat(ingresos.ingreso_valor_2008)
			);
		}
	}, [data]);

	return (
		<>
			<Modal
				title="Detalles del Balance Hídrico"
				visible={mostrarDetalles}
				onCancel={() => setMostrarDetalles(false)}
				footer={null}
				width={'80%'}
				destroyOnClose={true}
			>
				<Form ref={formRef}>
					<Row>
						<Col
							xs={6}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'start',
							}}
						>
							<label style={{ margin: 0, padding: 0, width: '100%' }}>Peso: {data.peso} kg</label>
						</Col>
						<Col xs={6} />
						<Col
							xs={12}
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'end',
								paddingBottom: '10px',
							}}
						>
							<div
								style={{
									padding: '10px 20px 10px 20px',
									borderRadius: '10px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'end',
									gap: '20px',
									backgroundColor: '#FE5B5A',
									color: 'white',
								}}
							>
								<div>Diferencia ingresos y egresos:</div>
								<div>{balance}</div>
							</div>
						</Col>

						{/* INGRESOS */}
						<Divider />
						<Col xs={24} style={{ fontSize: '22px', paddingTop: '10px', paddingBottom: '10px' }}>
							<div>Ingresos</div>
						</Col>

						{/* Header */}
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>HORA</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>ORAL</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>PARENTAL</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>TRATAMIENTO</div>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>A.O.</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.i_opcional ? data.i_opcional : 0}
							</label>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>TOTAL</div>
						</Col>

						{/* 8:00 - 14:00 */}
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>08:00 AM - 02:00 PM</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.i_oral_0814 ? parseFloat(data.i_oral_0814) : 0}
							</label>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.i_parental_0814 ? parseFloat(data.i_parental_0814) : 0}
							</label>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.i_tratamiento_0814 ? parseFloat(data.i_tratamiento_0814) : 0}
							</label>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(ingresoAO / 4).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.i_valor_0814 ? parseFloat(data.i_valor_0814) : 0}
							</label>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalIngreso0814).toFixed(2)}</div>
						</Col>

						{/* 14:00 - 20:00 */}
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>02:00 PM - 08:00 PM</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.i_oral_1420 ? parseFloat(data.i_oral_1420) : 0}
							</label>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.i_parental_1420 ? parseFloat(data.i_parental_1420) : 0}
							</label>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.i_tratamiento_1420 ? parseFloat(data.i_tratamiento_1420) : 0}
							</label>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(ingresoAO / 4).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.i_valor_1420 ? parseFloat(data.i_valor_1420) : 0}
							</label>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalIngreso1420).toFixed(2)}</div>
						</Col>

						{/* 20:00 - 8:00 */}
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>08:00 PM - 08:00 AM</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.i_oral_2008 ? parseFloat(data.i_oral_2008) : 0}
							</label>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.i_parental_2008 ? parseFloat(data.i_parental_2008) : 0}
							</label>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.i_tratamiento_2008 ? parseFloat(data.i_tratamiento_2008) : 0}
							</label>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(ingresoAO / 2).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.i_valor_2008 ? parseFloat(data.i_valor_2008) : 0}
							</label>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalIngreso2008).toFixed(2)}</div>
						</Col>

						{/* SUBTOTAL */}
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>TOTAL</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalOral).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalParental).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalTrataminto).toFixed(2)}</div>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(ingresoAO).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalOpcionalIngreso).toFixed(2)}</div>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalIngreso).toFixed(2)}</div>
						</Col>

						<Divider />
						<Col xs={24} style={{ fontSize: '22px', paddingTop: '10px', paddingBottom: '10px' }}>
							<div>Egresos</div>
						</Col>

						{/* Header */}
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>HORA</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>DIURESIS</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>DEPOSICION</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>Tº</div>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>P.I.</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.e_opcional ? data.e_opcional : 0}
							</label>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>TOTAL</div>
						</Col>

						{/* 8:00 - 14:00 */}
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>08:00 AM - 02:00 PM</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.e_diuresis_0814 ? parseFloat(data.e_diuresis_0814) : 0}
							</label>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.e_deposicion_0814 ? parseFloat(data.e_deposicion_0814) : 0}
							</label>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.e_temperatura_0814 ? parseFloat(data.e_temperatura_0814) : 0}
							</label>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(egresoPI / 4).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.e_valor_0814 ? parseFloat(data.e_valor_0814) : 0}
							</label>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalEgreso0814).toFixed(2)}</div>
						</Col>

						{/* 14:00 - 20:00 */}
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>02:00 PM - 08:00 PM</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.e_diuresis_1420 ? parseFloat(data.e_diuresis_1420) : 0}
							</label>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.e_deposicion_1420 ? parseFloat(data.e_deposicion_1420) : 0}
							</label>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.e_temperatura_1420 ? parseFloat(data.e_temperatura_1420) : 0}
							</label>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(egresoPI / 4).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.e_valor_1420 ? parseFloat(data.e_valor_1420) : 0}
							</label>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalEgreso1420).toFixed(2)}</div>
						</Col>

						{/* 20:00 - 8:00 */}
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>08:00 PM - 08:00 AM</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.e_diuresis_2008 ? parseFloat(data.e_diuresis_2008) : 0}
							</label>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.e_deposicion_2008 ? parseFloat(data.e_deposicion_2008) : 0}
							</label>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.e_temperatura_2008 ? parseFloat(data.e_temperatura_2008) : 0}
							</label>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(egresoPI / 2).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<label style={{ margin: 0, padding: 0 }}>
								{data.e_valor_2008 ? parseFloat(data.e_valor_2008) : 0}
							</label>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalEgreso2008).toFixed(2)}</div>
						</Col>

						{/* SUBTOTAL */}
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>TOTAL</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalDiuresis).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalDeposicion).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalTemperatura).toFixed(2)}</div>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(egresoPI).toFixed(2)}</div>
						</Col>
						<Col
							xs={4}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalOpcionalEgreso).toFixed(2)}</div>
						</Col>
						<Col
							xs={2}
							style={{
								paddingBottom: '10px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<div>{parseFloat(totalEgreso).toFixed(2)}</div>
						</Col>
					</Row>
				</Form>
			</Modal>
		</>
	);
};
