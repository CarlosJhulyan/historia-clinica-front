import React from 'react';
import { Row, Col, Divider } from 'antd';
import FuncionesVitales from './funcionesVitales';
import Indicadores from './indicadores';
import ExamenFisico from './examenFisico';

const SegundaParte = () => {

	return (
		<>
			<Row style={{ flexDirection: 'row', paddingTop: '10px', paddingBottom: '10px' }}>
				<Col xl={13} lg={13} md={12} sm={24} xs={24}>
					<FuncionesVitales />
				</Col>
				<Col>
					<Divider type="vertical" style={{ height: '100%', width: '100% ' }} />
				</Col>
				<Col xl={10} lg={10} md={11} sm={24} xs={24}>
					<Indicadores />
				</Col>
			</Row>
			<ExamenFisico />
		</>
	);
};

export default SegundaParte;
