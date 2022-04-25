import React from 'react';
import { Col, Form, Row, Radio, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setEstomatologico } from '../../../appRedux/actions/menu/examenClinico';

const Estematologico = () => {
	const dataEstematologico = useSelector((state) => state.examenClinico);
	const dispatch = useDispatch();
	const { historiaClinica, visualizar } = useSelector(state => state.helpers)

	//Setteos
	const handleCara = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				cara: value.target.value,
			})
		);
	};
	const handleCuello = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				cuello: value.target.value,
			})
		);
	};
	const handlePiel = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				piel: value.target.value,
			})
		);
	};
	const handleGanglios = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				ganglios: value.target.value,
			})
		);
	};
	const handleATM = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				atm: value.target.value,
			})
		);
	};
	const handleLabios = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				labios: value.target.value,
			})
		);
	};
	const handleCarrillos = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				carrillos: value.target.value,
			})
		);
	};
	const handleSurco = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				fondo_surco: value.target.value,
			})
		);
	};
	const handlePeriodonto = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				periodonto: value.target.value,
			})
		);
	};
	const handleRetromolar = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				zona_retromolar: value.target.value,
			})
		);
	};
	const handleSaliva = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				saliva: value.target.value,
			})
		);
	};

	const handleGlandulas = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				glandulas_salivales: value.target.value,
			})
		);
	};

	const handleLengua = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				lengua: value.target.value,
			})
		);
	};
	const handleDuro = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				paladar_duro: value.target.value,
			})
		);
	};
	const handleBlando = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				paladar_blando: value.target.value,
			})
		);
	};
	const handlePiso = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				piso_boca: value.target.value,
			})
		);
	};
	const handleOrofaringe = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				orofaringe: value.target.value,
			})
		);
	};
	const handleHigiene = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				indice_higiene_oral: value.target.value,
			})
		);
	};
	const handleHendidura = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				hendidura_gingival: value.target.value,
			})
		);
	};
	const handleVitalidad = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				vitalidad_palpar: value.target.value,
			})
		);
	};
	const handleOdusion = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				odusion: value.target.value,
			})
		);
	};
	const handleAnterior = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				guia_anterior: value.target.value,
			})
		);
	};
	const handleInterfencias = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				interferencias: value.target.value,
			})
		);
	};
	const handlePrematuro = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				contacto_prematuro: value.target.value,
			})
		);
	};
	const handleAlveolare = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				rebordes_alveolare: value.target.value,
			})
		);
	};
	const handleTuberosidades = (value) => {
		dispatch(
			setEstomatologico({
				...dataEstematologico,
				tuberosidades: value.target.value,
			})
		);
	};

	return (
		<>
			<Row>
				<Col lg={8} md={8} sm={8}>
					<h4 style={{ padding: '50px 0 50px 50px', textTransform: 'uppercase' }}>
						<b>Examen clínico estomatológico</b>
					</h4>
				</Col>
				<Col lg={16} md={16} sm={16}>
					<div style={{ float: 'right', margin: '25px 100px', padding: '25px', border: '1px solid' }}>
						<h4>
							<b>N:</b> NO VISIBLE <Divider type="vertical" /> <b>P:</b> PALPABLE
						</h4>
					</div>
				</Col>
			</Row>
			<Form layout="vertical" initialValues={{ dataEstematologico }}>
				<Row style={{ flexDirection: 'row', paddingLeft: '30px', paddingRight: '30px' }}>
					<Col xl={6} lg={8} md={12} sm={24} xs={24}>
						<h4>Ex Extraoral</h4>
						<Row style={{ flexDirection: 'row' }}>
							<Col xxl={10} xl={12} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Cara:</p>
							</Col>
							<Col xxl={14} xl={12} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group disabled={historiaClinica | visualizar} onChange={handleCara} style={{ paddingBottom: '15px' }} value={dataEstematologico.cara}>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Cuello:</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleCuello}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.cuello}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Piel:</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group disabled={historiaClinica | visualizar} onChange={handlePiel} style={{ paddingBottom: '15px' }} value={dataEstematologico.piel}>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Ganglios:</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleGanglios}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.ganglios}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>ATM:</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group disabled={historiaClinica | visualizar} onChange={handleATM} style={{ paddingBottom: '15px' }} value={dataEstematologico.atm}>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
						</Row>
					</Col>
					<Col xl={6} lg={8} md={12} sm={24} xs={24}>
						<h4>Ex Intraoral</h4>
						<Row style={{ flexDirection: 'row' }}>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Labios</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleLabios}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.labios}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Carrillos</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleCarrillos}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.carrillos}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Fondo de Surco</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleSurco}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.fondo_surco}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Periodonto</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handlePeriodonto}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.periodonto}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Zona Retromolar</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleRetromolar}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.zona_retromolar}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Saliva</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleSaliva}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.saliva}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Glándulas Salivales</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleGlandulas}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.glandulas_salivales}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
						</Row>
					</Col>
					<Col xl={6} lg={8} md={12} sm={24} xs={24}>
						<Row style={{ flexDirection: 'row' }}>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Lengua</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleLengua}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.lengua}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Paladar Duro</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleDuro}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.paladar_duro}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Paladar Blando</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleBlando}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.paladar_blando}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Piso de Boca</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handlePiso}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.piso_boca}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Orofaringe</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleOrofaringe}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.orofaringe}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Indice de Higiene Oral</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleHigiene}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.indice_higiene_oral}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Hendidura Gingival</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleHendidura}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.hendidura_gingival}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
						</Row>
					</Col>
					<Col xl={6} lg={8} md={12} sm={24} xs={24}>
						<Row style={{ flexDirection: 'row' }}>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Vitalidad Palpar</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleVitalidad}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.vitalidad_palpar}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Odusión</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleOdusion}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.odusion}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Guia Anterior</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleAnterior}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.guia_anterior}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Interferencias</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleInterfencias}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.interferencias}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Contacto Prematuro</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handlePrematuro}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.contacto_prematuro}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Rebordes Alveolare</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleAlveolare}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.rebordes_alveolare}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
							<Col xxl={10} xl={24} lg={24} md={24} sm={24} xs={8} style={{ paddingTop: '15px' }}>
								<p>Tuberosidades</p>
							</Col>
							<Col xxl={14} xl={24} lg={24} md={24} sm={24} xs={16} style={{ paddingTop: '15px' }}>
								<Radio.Group
									disabled={historiaClinica | visualizar}
									onChange={handleTuberosidades}
									style={{ paddingBottom: '15px' }}
									value={dataEstematologico.tuberosidades}
								>
									<Radio value="N">N</Radio>
									<Radio value="P">P</Radio>
								</Radio.Group>
							</Col>
						</Row>
					</Col>
				</Row>
			</Form>
		</>
	);
};
export default Estematologico;
