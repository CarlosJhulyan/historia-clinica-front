import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Modal, Row, Table, Form, DatePicker, Card, Tag, Select } from 'antd';
import 'moment/locale/es';
import locale from 'antd/es/date-picker/locale/es_ES';
import { httpClient } from '../../util/Api';

export const ModalSeguimiento = ({ abrirSeguimientoM, setAbrirSeguimientoM, comboEspecialidad }) => {
	const [data, setData] = useState({
		fechaInicio: '',
		fechaFin: '',
		especialidad: '',
	});

	const token = JSON.parse(localStorage.getItem('token'));
	const { codGrupoCia } = useSelector(state => state.dataGlobal);

	const [dataSource, setDataSource] = useState([]);

	const [btnBuscar, setBtnBuscar] = useState(true);

    const mapCodEstado = {
		T: {
			key: 'T',
			color: '#ff0080',
			text: 'Pend. Triaje',
		},
		A: {
			key: 'A',
			color: '#00b251',
			text: 'Atendido',
		},
		C: {
			key: 'C',
			color: '#00bcd4',
			text: 'En Consulta',
		},
		G: {
			key: 'G',
			color: '#fe0100',
			text: 'Grabado Temp.',
		},
		P: {
			key: 'P',
			color: '#fec000',
			text: 'Pend. Atención',
		},
		PA: {
			key: 'PA',
			color: '#ff8000',
			text: 'Por Atender',
		},
	};

	const handleChangeFechaInicio = e => {
		if (e !== null) {
			const fechaFormat = e.format('DD/MM/YYYY');
			setData({
				...data,
				fechaInicio: fechaFormat,
			});
		}
	};

	const handleChangeFechaFin = e => {
		if (e !== null) {
			const fechaFormat = e.format('DD/MM/YYYY');
			setData({
				...data,
				fechaFin: fechaFormat,
			});
		}
	};

	const handleChangeEspecialidad = e => {
		setData({
			...data,
			especialidad: e,
		});
	};

	const columns = [
		{
			title: 'Nro HC',
			dataIndex: 'NRO_HC_ACTUAL',
			key: 'NRO_HC_ACTUAL',
		},
		{
			title: 'Paciente',
			dataIndex: 'NOMBRE',
			key: 'NOMBRE',
		},
		{
			title: 'Edad',
			dataIndex: 'EDAD',
			key: 'EDAD',
		},
		{
			title: 'Estado',
			dataIndex: 'ESTADO',
			key: 'ESTADO',
			align: 'center',
			render: (text, record) => {
				return {
					props: {
						style: {
							color: 'white',
							background:
								record.COD_ESTADO === 'A'
									? mapCodEstado.A.color
									: record.COD_ESTADO === 'C'
									? mapCodEstado.C.color
									: record.COD_ESTADO === 'G'
									? mapCodEstado.G.color
									: record.COD_ESTADO === 'P'
									? mapCodEstado.P.color
									: record.COD_ESTADO === 'T'
									? mapCodEstado.T.color
									: '',
						},
					},
					children: <div>{text}</div>,
				};
			},
		},
		{
			title: 'Médico',
			dataIndex: 'MEDICO',
			key: 'MEDICO',
		},
		{
			title: 'Especialidad',
			dataIndex: 'ESPECIALIDAD',
			key: 'ESPECIALIDAD',
		},
		{
			title: 'N° Orden Vta.',
			dataIndex: 'NUM_ORDEN_VTA',
			key: 'NUM_ORDEN_VTA',
		},
	];

	const onClickBuscar = () => {
		const obj = {
			codGrupoCia: codGrupoCia,
			fechaInicio: data.fechaInicio,
			fechaFin: data.fechaFin,
			codMedico: token.cod_medico,
		};
		buscarHistorial(obj);
	};

	const buscarHistorial = async obj => {
		try {
			const { data } = await httpClient.post('/admin/getListaAtenciones', obj);
			console.log('BUSQUEDAAAA: ', data);
			if (data.success) {
				setDataSource(data.data);
			}
		} catch (error) {
			console.log('ERROR: ', error);
		}
	};

	useEffect(() => {
		if (data.fechaFin !== '' && data.fechaInicio !== '' /* && data.especialidad !== "" */) {
			setBtnBuscar(false);
		} else {
			setBtnBuscar(true);
		}
	}, [data]);

	

	const abc = {};

	for (const key in mapCodEstado) {
		if (Object.hasOwnProperty.call(mapCodEstado, key)) {
			const element = mapCodEstado[key];
			abc[element.key] = dataSource.filter(item => {
				return item.COD_ESTADO === element.key;
			});
		}
	}

	// codEstados.forEach(element => {
	// 	abc[element] = dataSource.filter(item => {
	// 		return item.COD_ESTADO === element;
	// 	});
	// });

	// dataSource.forEach(element => {
	// 	let isE = true;
	// 	codEstados.forEach(element1 => {
	// 		if (element.COD_ESTADO === element1) {
	// 			isE = false;
	// 		}
	// 	});

	// 	if (isE) {
	// 		abc['otros'].push(element);
	// 	}
	// });

	console.log('AARRRRRRRR:', abc);

	return (
		<Modal
			maskClosable={false}
			onCancel={() => setAbrirSeguimientoM(false)}
			width="90%"
			title={<div style={{ fontSize: '22px' }}>Seguimiento de Consultas en Tiempo Real</div>}
			visible={abrirSeguimientoM}
			footer={
				<div>
					<Row style={{ flexDirection: 'row' }}>
						<Col lg={24} style={{ textAlign: 'end' }}>
							<Button>Imprimir Receta y Otros</Button>
							<Button>Visualizar</Button>
							<Button onClick={() => setAbrirSeguimientoM(false)}>Salir</Button>
						</Col>
					</Row>
				</div>
			}
		>
			<Form layout="vertical">
				<Row style={{ flexDirection: 'row', paddingLeft: '30px', paddingRight: '30px' }}>
					<Col lg={4} md={8} sm={12} xs={24}>
						<Button type="primary" style={{ width: '100%', marginTop: '25px' }}>
							Ver Liberación
						</Button>
					</Col>

					<Col lg={5} md={8} sm={12} xs={24}>
						<Form.Item name="fechaInicio" label="Fecha Inicio">
							<DatePicker
								format="DD/MM/YYYY"
								locale={locale}
								style={{ width: '100%' }}
								placeholder="Selecciona fecha de inicio"
								onChange={handleChangeFechaInicio}
							/>
						</Form.Item>
					</Col>

					<Col lg={5} md={8} sm={12} xs={24}>
						<Form.Item name="fechaFin" label="Fecha Fin">
							<DatePicker
								format="DD/MM/YYYY"
								locale={locale}
								style={{ width: '100%' }}
								placeholder="Selecciona fecha de fin"
								onChange={handleChangeFechaFin}
							/>
						</Form.Item>
					</Col>

					<Col lg={6} md={6} sm={12} xs={24}>
						<Form.Item name="especialidad" label="Especialidad">
							<Select allowClear placeholder="Seleccione" onChange={handleChangeEspecialidad}>
								{comboEspecialidad.map(element => {
									return (
										<Select.Option key={element.ID_CONSULTORIO} value={element.DESCRIPCION}>
											{element.DESCRIPCION}
										</Select.Option>
									);
								})}
							</Select>
						</Form.Item>
					</Col>

					<Col lg={4} md={8} sm={12} xs={24}>
						<Button
							disabled={btnBuscar}
							type="primary"
							onClick={() => onClickBuscar()}
							style={{ width: '100%', marginTop: '25px' }}
						>
							Buscar
						</Button>
					</Col>
				</Row>
			</Form>

			<Card title="Lista de Pacientes">
				<Table className="gx-table-responsive" columns={columns} dataSource={dataSource}></Table>
			</Card>

			<Row style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
				<Col lg={3}>
					<Button style={{ backgroundColor: mapCodEstado.T.color /* backgroundColor: '#04b0ad'  */ }}>
						<Tag color="transparent">{abc.T.length}</Tag>
						<Tag>{mapCodEstado.T.text}</Tag>
					</Button>
				</Col>
				<Col lg={3}>
					<Button style={{ backgroundColor: mapCodEstado.PA.color }}>
						<Tag color="transparent">{abc.PA.length}</Tag>
						<Tag>{mapCodEstado.PA.text}</Tag>
					</Button>
				</Col>
				<Col lg={3}>
					<Button style={{ backgroundColor: mapCodEstado.P.color }}>
						<Tag color="transparent">{abc.P.length}</Tag>
						<Tag>{mapCodEstado.P.text}</Tag>
					</Button>
				</Col>
				<Col lg={3}>
					<Button style={{ backgroundColor: mapCodEstado.G.color }}>
						<Tag color="transparent">{abc.G.length}</Tag>
						<Tag>{mapCodEstado.G.text}</Tag>
					</Button>
				</Col>
				<Col lg={3}>
					<Button style={{ backgroundColor: mapCodEstado.C.color }}>
						<Tag color="transparent">{abc.C.length}</Tag>
						<Tag>{mapCodEstado.C.text}</Tag>
					</Button>
				</Col>
				<Col lg={3}>
					<Button style={{ backgroundColor: mapCodEstado.A.color }}>
						<Tag color="transparent">{abc.A.length}</Tag>
						<Tag>{mapCodEstado.A.text}</Tag>
					</Button>
				</Col>
				<Col lg={3}>
					<Button style={{ backgroundColor: '#1A0602' }}>
						<Tag color="transparent">{dataSource.length}</Tag>
						<Tag>Ver Todos</Tag>
					</Button>
				</Col>
			</Row>
		</Modal>
	);
};
