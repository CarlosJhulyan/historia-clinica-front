import { Button, Col, DatePicker, Row, Select, Table } from 'antd'
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { httpClient } from '../../../util/Api';
import { useSelector } from 'react-redux';

function HistorialInvasivos({ historia }) {
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const [data, setData] = useState([]);
	const [fecha1cvc, setFecha1cvc] = useState();
	const [fecha2cvc, setFecha2cvc] = useState();
	const [fecha1tet, setFecha1tet] = useState();
	const [fecha2tet, setFecha2tet] = useState();
	const [fecha1sng, setFecha1sng] = useState();
	const [fecha2sng, setFecha2sng] = useState();
	const [fecha1foley, setFecha1foley] = useState();
	const [fecha2foley, setFecha2foley] = useState();
	const [fecha1via, setFecha1via] = useState();
	const [fecha2via, setFecha2via] = useState();
	const [tipoInva, setTipoInva] = useState(1);
	const [loading, setLoading] = useState(false);
	const codPaciente = historia.codPaciente;

	const traerInvasivos = async () => {
		setLoading(true);
		const response = await httpClient.post(`/kardex/getInvacivos`, { codPaciente,fecha1cvc,fecha2cvc,fecha1tet,fecha2tet,fecha1sng,fecha2sng,fecha1foley,fecha2foley,fecha1via,fecha2via });
		console.log(response, 'datta');
		setData(response.data.data);
		setLoading(false);
		if(response.data.success){
			setFecha1cvc(null);
			setFecha1foley(null);
			setFecha1sng(null);
			setFecha1tet(null);
			setFecha1via(null);
			setFecha2cvc(null);
			setFecha2foley(null);
			setFecha2sng(null);
			setFecha2tet(null);
			setFecha2via(null);
		}
	};

	useEffect(() => {
		traerInvasivos();
	}, []);

	const columnsTET = [
		{
			title: 'Fecha T.E.T',
			dataIndex: 'fecha_tet',
			key: 'tet',
			render: (text, record) => {
				return <span>{moment(text).format('DD/MM/YY')}</span>;
			},
		},
		{
			title: 'Motivo T.E.T',
			dataIndex: 'motivo_tet',
			key: 'Mtet',
		},
	];
	const columnsSNG = [
		{
			title: 'Fecha S.N.G',
			dataIndex: 'fecha_sng',
			key: 'sng',
			render: (text, record) => {
				return <span>{moment(text).format('DD/MM/YY')}</span>;
			},
		},
		{
			title: 'Motivo S.N.G',
			dataIndex: 'motivo_SNG',
			key: 'Msng',
		},
	];
	const columnsFOLEY = [
		{
			title: 'Fecha Foley',
			dataIndex: 'fecha_foley',
			key: 'foley',
			render: (text, record) => {
				return <span>{moment(text).format('DD/MM/YY')}</span>;
			},
		},
		{
			title: 'Motivo FOLEY',
			dataIndex: 'motivo_foley',
			key: 'motivofoley',
		},
	];
	const columnsVIA = [

		{
			title: 'Fecha Via Periferica',
			dataIndex: 'fecha_via_periferia',
			key: 'via',
			render: (text, record) => {
				return <span>{moment(text).format('DD/MM/YY')}</span>;
			},
		},
		{
			title: 'Motivo Via',
			dataIndex: 'motivo_via_periferica',
			key: 'motivovia',
		},
	];
	const columnsCVC = [
		{
			title: 'Fecha C.V.C',
			dataIndex: 'fecha_cvc',
			key: 'cvc',
			render: (text, record) => {
				return <span>{moment(text).format('DD/MM/YY')}</span>;
			},
		},
		{
			title: 'Motivo C.V.C',
			dataIndex: 'motivo_cvc',
			key: 'Mcvc',
		},
	];

	const { Option } = Select;
	const tipoInvasivo = (e) => {

		console.log(e);
		setTipoInva(e);
	}
	const changeFecha1cvc = (e) => {
		setFecha1cvc(moment(e._d).format('DD/MM/YYYY'));
	};
	const changeFecha2cvc = (e) => {
		setFecha2cvc(moment(e._d).format('DD/MM/YYYY'));
	};
	const changeFecha1tet = (e) => {
		setFecha1tet(moment(e._d).format('DD/MM/YYYY'));
	};
	const changeFecha2tet = (e) => {
		setFecha2tet(moment(e._d).format('DD/MM/YYYY'));
	};
	const changeFecha1sng = (e) => {
		setFecha1sng(moment(e._d).format('DD/MM/YYYY'));
	};
	const changeFecha2sng = (e) => {
		setFecha2sng(moment(e._d).format('DD/MM/YYYY'));
	};
	const changeFecha1foley = (e) => {
		setFecha1foley(moment(e._d).format('DD/MM/YYYY'));
	};
	const changeFecha2foley = (e) => {
		setFecha2foley(moment(e._d).format('DD/MM/YYYY'));
	};
	const changeFecha1via = (e) => {
		setFecha1via(moment(e._d).format('DD/MM/YYYY'));
	};
	const changeFecha2via = (e) => {
		setFecha2via(moment(e._d).format('DD/MM/YYYY'));
	};
	return (
		<div style={{ width: '100%' }}>
			<Row>
					<Col span={15} style={{textAlign:'end'}}>
						<Select defaultValue="1" style={{ width: 120 }} onChange={(e) => tipoInvasivo(e)}>
							<Option value="1">C.V.C</Option>
							<Option value="2">T.E.T</Option>
							<Option value="3">S.N.G</Option>
							<Option value="4">FOLEY</Option>
							<Option value="5">VIA PERFIERICA</Option>
						</Select>
					</Col>
					{
						tipoInva == 1 ?
							<>
								<Col span={3}>
									<DatePicker style={{width:'100%'}} placeholder='Fecha Inicial' onChange={changeFecha1cvc} />
								</Col>
								<Col span={3}>
									<DatePicker style={{width:'100%'}} placeholder='Fecha Final' onChange={changeFecha2cvc} />
								</Col>
							</>
							: tipoInva == 2 ?
								<>
									<Col span={3}>
										<DatePicker style={{width:'100%'}} placeholder='Fecha Inicial' onChange={changeFecha1tet} />
									</Col>
									<Col span={3}>
										<DatePicker style={{width:'100%'}} placeholder='Fecha Final' onChange={changeFecha2tet} />
									</Col>
								</>
								: tipoInva == 3 ?
									<>
										<Col span={3}>
											<DatePicker style={{width:'100%'}} placeholder='Fecha Inicial' onChange={changeFecha1sng} />
										</Col>
										<Col span={3}>
											<DatePicker style={{width:'100%'}} placeholder='Fecha Final' onChange={changeFecha2sng} />
										</Col>
									</>
									: tipoInva == 4 ?
										<>
											<Col span={3}>
												<DatePicker style={{width:'100%'}} placeholder='Fecha Inicial' onChange={changeFecha1foley} />
											</Col>
											<Col span={3}>
												<DatePicker style={{width:'100%'}} placeholder='Fecha Final' onChange={changeFecha2foley} />
											</Col>
										</>
										:
										<>
											<Col span={3}>
												<DatePicker style={{width:'100%'}} placeholder='Fecha Inicial' onChange={changeFecha1via} />
											</Col>
											<Col span={3}>
												<DatePicker style={{width:'100%'}} placeholder='Fecha Final' onChange={changeFecha2via} />
											</Col>
										</>
					}

					<Col span={3} style={{textAlign:'end'}}>
						<Button style={{background: themeSettingsGlobal.COD_COLOR_1, color: '#fff'}} onClick={() => traerInvasivos()}>filtrar</Button>
					</Col>
				</Row>
			<div>

				<Table
					className="gx-table-responsive"
					columns={tipoInva == 1 ? columnsCVC : tipoInva == 2 ? columnsTET : tipoInva == 3 ? columnsSNG : tipoInva == 4 ? columnsFOLEY : columnsVIA}
					dataSource={data}
					loading={loading}
				/>
			</div>
		</div>
	)
}

export default HistorialInvasivos
