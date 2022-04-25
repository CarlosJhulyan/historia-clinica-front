import React from 'react';
import { Col, Form, Radio, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setOtros } from '../../../../appRedux/actions/menu/antecedentes';

const Antecedentes = () => {
	const antecedentes = useSelector((state) => state.antecedentesOtros);
	const { historiaAntecedentes, visualizar } = useSelector(state => state.helpers);

	const dispatch = useDispatch();

	const handleDiabetes = (value) => {
		dispatch(setOtros({ ...antecedentes, diabetes: value.target.value }));
	};
	const handleTuberculosis = (value) => {
		dispatch(setOtros({ ...antecedentes, tuberculosis: value.target.value }));
	};
	const handleAnemia = (value) => {
		dispatch(setOtros({ ...antecedentes, anemia: value.target.value }));
	};
	const handleFiebreReumatica = (value) => {
		dispatch(setOtros({ ...antecedentes, fiebre_reumatica: value.target.value }));
	};
	const handleEnfermedadCardiovascular = (value) => {
		dispatch(setOtros({ ...antecedentes, enfermedad_cardiovascular: value.target.value }));
	};
	const handleEnfermedadRenal = (value) => {
		dispatch(setOtros({ ...antecedentes, enfermedad_renal: value.target.value }));
	};
	const handleEnfermedadHepaticas = (value) => {
		dispatch(setOtros({ ...antecedentes, enfermedad_hepaticas: value.target.value }));
	};
	const handleReaccionAnormalALaAnesteciaLocal = (value) => {
		dispatch(setOtros({ ...antecedentes, reaccion_anormal_local: value.target.value }));
	};
	const handleReaccionAnormalAOtrasDrogas = (value) => {
		dispatch(setOtros({ ...antecedentes, reaccion_anormal_drogas: value.target.value }));
	};
	const handleHemorragias = (value) => {
		dispatch(setOtros({ ...antecedentes, hemorragias: value.target.value }));
	};
	const handleAlergiaALaPenicilina = (value) => {
		dispatch(setOtros({ ...antecedentes, alergia_penecilina: value.target.value }));
	};
	const handleOtras = (value) => {
		dispatch(setOtros({ ...antecedentes, otras: value.target.value }));
	};

	return (
		<Form layout="vertical" initialValues={antecedentes} style={{ marginBottom: '10px' }}>
			{/* <h4 style={{ padding: '20px 0 5px 25px', textTransform: 'uppercase' }}><b>ANTECEDENTES</b></h4> */}
			<Row style={{ flexDirection: 'row', paddingLeft: '30px', paddingRight: '30px' }}>
				<Col xl={3} lg={4} md={4} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<p>Diabetes:</p>
				</Col>
				<Col xl={5} lg={8} md={8} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<Radio.Group disabled={historiaAntecedentes | visualizar} style={{ paddingBottom: '15px' }} value={antecedentes.diabetes} onChange={handleDiabetes}>
						<Radio value={'SI'}>Si</Radio>
						<Radio value={'NO'}>No</Radio>
					</Radio.Group>
				</Col>
				<Col xl={3} lg={4} md={4} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<p>Tuberculosis:</p>
				</Col>
				<Col xl={5} lg={8} md={8} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<Radio.Group
						disabled={historiaAntecedentes | visualizar}
						style={{ paddingBottom: '15px' }}
						value={antecedentes.tuberculosis}
						onChange={handleTuberculosis}
					>
						<Radio value={'SI'}>Si</Radio>
						<Radio value={'NO'}>No</Radio>
					</Radio.Group>
				</Col>
				<Col xl={3} lg={4} md={4} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<p>Anemia:</p>
				</Col>
				<Col xl={5} lg={8} md={8} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<Radio.Group disabled={historiaAntecedentes | visualizar} style={{ paddingBottom: '15px' }} value={antecedentes.anemia} onChange={handleAnemia}>
						<Radio value={'SI'}>Si</Radio>
						<Radio value={'NO'}>No</Radio>
					</Radio.Group>
				</Col>
				<Col xl={3} lg={4} md={4} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<p>Fiebre Reumatica:</p>
				</Col>
				<Col xl={5} lg={8} md={8} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<Radio.Group
						disabled={historiaAntecedentes | visualizar}
						style={{ paddingBottom: '15px' }}
						value={antecedentes.fiebre_reumatica}
						onChange={handleFiebreReumatica}
					>
						<Radio value={'SI'}>Si</Radio>
						<Radio value={'NO'}>No</Radio>
					</Radio.Group>
				</Col>
				<Col xl={3} lg={4} md={4} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<p>Enfermedad Cardiovascular:</p>
				</Col>
				<Col xl={5} lg={8} md={8} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<Radio.Group
						disabled={historiaAntecedentes | visualizar}
						style={{ paddingBottom: '15px' }}
						value={antecedentes.enfermedad_cardiovascular}
						onChange={handleEnfermedadCardiovascular}
					>
						<Radio value={'SI'}>Si</Radio>
						<Radio value={'NO'}>No</Radio>
					</Radio.Group>
				</Col>
				<Col xl={3} lg={4} md={4} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<p>Enfermedad Renal:</p>
				</Col>
				<Col xl={5} lg={8} md={8} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<Radio.Group
						disabled={historiaAntecedentes | visualizar}
						style={{ paddingBottom: '15px' }}
						value={antecedentes.enfermedad_renal}
						onChange={handleEnfermedadRenal}
					>
						<Radio value={'SI'}>Si</Radio>
						<Radio value={'NO'}>No</Radio>
					</Radio.Group>
				</Col>
				<Col xl={3} lg={4} md={4} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<p>Enfermedad hepáticas:</p>
				</Col>
				<Col xl={5} lg={8} md={8} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<Radio.Group
						disabled={historiaAntecedentes | visualizar}
						style={{ paddingBottom: '15px' }}
						value={antecedentes.enfermedad_hepaticas}
						onChange={handleEnfermedadHepaticas}
					>
						<Radio value={'SI'}>Si</Radio>
						<Radio value={'NO'}>No</Radio>
					</Radio.Group>
				</Col>
				<Col xl={3} lg={4} md={4} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<p>Reaccion anormal a la anesticia local:</p>
				</Col>
				<Col xl={5} lg={8} md={8} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<Radio.Group
						disabled={historiaAntecedentes | visualizar}
						style={{ paddingBottom: '15px' }}
						value={antecedentes.reaccion_anormal_local}
						onChange={handleReaccionAnormalALaAnesteciaLocal}
					>
						<Radio value={'SI'}>Si</Radio>
						<Radio value={'NO'}>No</Radio>
					</Radio.Group>
				</Col>
				<Col xl={3} lg={4} md={4} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<p>Reaccion anormal a otras drogas:</p>
				</Col>
				<Col xl={5} lg={8} md={8} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<Radio.Group
						disabled={historiaAntecedentes | visualizar}
						style={{ paddingBottom: '15px' }}
						value={antecedentes.reaccion_anormal_drogas}
						onChange={handleReaccionAnormalAOtrasDrogas}
					>
						<Radio value={'SI'}>Si</Radio>
						<Radio value={'NO'}>No</Radio>
					</Radio.Group>
				</Col>
				<Col xl={3} lg={4} md={4} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<p>Hemorragias:</p>
				</Col>
				<Col xl={5} lg={8} md={8} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<Radio.Group disabled={historiaAntecedentes | visualizar} style={{ paddingBottom: '15px' }} value={antecedentes.hemorragias} onChange={handleHemorragias}>
						<Radio value={'SI'}>Si</Radio>
						<Radio value={'NO'}>No</Radio>
					</Radio.Group>
				</Col>
				<Col xl={3} lg={4} md={4} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<p>Alergia a la penecilina:</p>
				</Col>
				<Col xl={5} lg={8} md={8} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<Radio.Group
						disabled={historiaAntecedentes | visualizar}
						style={{ paddingBottom: '15px' }}
						value={antecedentes.alergia_penecilina}
						onChange={handleAlergiaALaPenicilina}
					>
						<Radio value={'SI'}>Si</Radio>
						<Radio value={'NO'}>No</Radio>
					</Radio.Group>
				</Col>
				<Col xl={3} lg={4} md={4} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<p>Otras:</p>
				</Col>
				<Col xl={5} lg={8} md={8} sm={12} xs={24} style={{ paddingTop: '15px' }}>
					<Radio.Group disabled={historiaAntecedentes | visualizar} style={{ paddingBottom: '15px' }} value={antecedentes.otras} onChange={handleOtras}>
						<Radio value={'SI'}>Si</Radio>
						<Radio value={'NO'}>No</Radio>
					</Radio.Group>
				</Col>
			</Row>
		</Form>
	);
};

export default Antecedentes;
