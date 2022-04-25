import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Table, Row, Col, Button, Tag, Input, Space, Modal } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setVisualizarOn } from '../../appRedux/actions/menu/helpers';
import ModalVisualizar from './visualizar';
export const ListaPaciente = ({
	dataSource,
	setDataSource,
	dataPaciente,
	loading,
	mapCodEstado,
	actual,
	setActual,
	abc,
}) => {
	//Filtro para buscar por columna
	const [state, setState] = useState();
	const [botonModal, setBotonModal] = useState(true);
	const [visualizar, setVisualizar] = useState(false);
	const [itemSeleccionado, setItemSeleccionado] = useState(null);
	const [btnVisualizar, setBtnVisualizar] = useState(false);
	const [mostrarAlerta, setMostrarAlerta] = useState(false);
	const [estado, setEstado] = useState('');

	const dispatch = useDispatch();

	const getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					placeholder={`Buscar ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Buscar
					</Button>
					<Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
						Reiniciar
					</Button>
				</Space>
			</div>
		),
		filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
		onFilter: (value, record) =>
			record[dataIndex]
				? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
				: '',
	});

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};

	const handleReset = clearFilters => {
		clearFilters();
		setState({ searchText: '' });
	};

	const columns = [
		{
			title: 'Nro HC',
			dataIndex: 'NRO_HC_ACTUAL',
			key: 'NRO_HC_ACTUAL',
			...getColumnSearchProps('NRO_HC_ACTUAL'),
		},
		{
			title: 'Paciente',
			dataIndex: 'NOMBRE',
			key: 'NOMBRE',
			...getColumnSearchProps('NOMBRE'),
		},
		{
			title: 'Edad',
			dataIndex: 'EDAD',
			key: 'EDAD',
			...getColumnSearchProps('EDAD'),
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
			...getColumnSearchProps('ESTADO'),
		},
		{
			title: 'Médico',
			dataIndex: 'MEDICO',
			key: 'MEDICO',
			...getColumnSearchProps('MEDICO'),
		},
		{
			title: 'Especialidad',
			dataIndex: 'ESPECIALIDAD',
			key: 'ESPECIALIDAD',
			...getColumnSearchProps('ESPECIALIDAD'),
		},
		{
			title: 'N° Orden Vta.',
			dataIndex: 'NUM_ORDEN_VTA',
			key: 'NUM_ORDEN_VTA',
			...getColumnSearchProps('NUM_ORDEN_VTA'),
		},
	];

	const rowSelection = {
		onChange: (selectedRows, abc) => {
			setItemSeleccionado(abc[0]);
			setBotonModal(false);
			setEstado(abc[0].ESTADO);

		},
	};

	return (
		<>
			<Card title={<h3 style={{ marginLeft: '20px' }}>Lista de Pacientes</h3>}>
				<Table
					loading={loading}
					rowSelection={{ type: 'radio', ...rowSelection }}
					className="gx-table-responsive"
					columns={columns}
					dataSource={dataSource}
				/>

				<Row style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: '20px' }}>
					<Col lg={3} md={4} sm={12} xs={24}>
						<Button
							disabled={abc.T.length < 1}
							onClick={() => {
								setDataSource(abc.T);
								setActual('T');
							}}
							style={{ backgroundColor: mapCodEstado.T.color, margin: 0, padding: 0 }}
						>
							<Tag color="transparent">{abc.T.length}</Tag>
							<Tag>{mapCodEstado.T.text}</Tag>
						</Button>
					</Col>
					<Col lg={3} md={4} sm={12} xs={24}>
						<Button
							disabled={abc.PA.length < 1}
							onClick={() => {
								setDataSource(abc.PA);
								setActual('PA');
							}}
							style={{ backgroundColor: mapCodEstado.PA.color, margin: 0, padding: 0 }}
						>
							<Tag color="transparent">{abc.PA.length}</Tag>
							<Tag>{mapCodEstado.PA.text}</Tag>
						</Button>
					</Col>
					<Col lg={3} md={4} sm={12} xs={24}>
						<Button
							disabled={abc.P.length < 1}
							onClick={() => {
								setDataSource(abc.P);
								setActual('P');
							}}
							style={{ backgroundColor: mapCodEstado.P.color, margin: 0, padding: 0 }}
						>
							<Tag color="transparent">{abc.P.length}</Tag>
							<Tag>{mapCodEstado.P.text}</Tag>
						</Button>
					</Col>
					<Col lg={3} md={4} sm={12} xs={24}>
						<Button
							disabled={abc.G.length < 1}
							onClick={() => {
								setDataSource(abc.G);
								setActual('G');
							}}
							style={{ backgroundColor: mapCodEstado.G.color, margin: 0, padding: 0 }}
						>
							<Tag color="transparent">{abc.G.length}</Tag>
							<Tag>{mapCodEstado.G.text}</Tag>
						</Button>
					</Col>
					<Col lg={3} md={4} sm={12} xs={24}>
						<Button
							disabled={abc.C.length < 1}
							onClick={() => {
								setDataSource(abc.C);
								setActual('C');
							}}
							style={{ backgroundColor: mapCodEstado.C.color, margin: 0, padding: 0 }}
						>
							<Tag color="transparent">{abc.C.length}</Tag>
							<Tag>{mapCodEstado.C.text}</Tag>
						</Button>
					</Col>
					<Col lg={3} md={4} sm={12} xs={24}>
						<Button
							disabled={abc.A.length < 1}
							onClick={() => {
								setDataSource(abc.A);
								setActual('A');
							}}
							style={{ backgroundColor: mapCodEstado.A.color, margin: 0, padding: 0 }}
						>
							<Tag color="transparent">{abc.A.length}</Tag>
							<Tag>{mapCodEstado.A.text}</Tag>
						</Button>
					</Col>
					<Col lg={3} md={4} sm={12} xs={24}>
						<Button
							disabled={dataSource.length < 1}
							onClick={() => {
								setDataSource(dataPaciente);
								setActual('TODOS');
							}}
							style={{ backgroundColor: '#1A0602', margin: 0, padding: 0 }}
						>
							<Tag color="transparent">{dataPaciente.length}</Tag>
							<Tag>Ver Todos</Tag>
						</Button>
					</Col>
				</Row>
			</Card>
			<div style={{ textAlign: 'end' }}>
				<Button
					loading={btnVisualizar}
					disabled={botonModal}
					onClick={() => {
						if (actual === 'A' || estado === 'ATENDIDO') {
							setVisualizar(true);
							setBtnVisualizar(true);
							dispatch(setVisualizarOn(true));
						} else {
							setMostrarAlerta(true);
						}

					}}
					size="large"
					type="primary"
				>
					Visualizar
				</Button>
			</div>
			{visualizar
				? (<ModalVisualizar
					setBtnVisualizar={setBtnVisualizar}
					setVisualizar={setVisualizar}
					visualizar={visualizar}
					data={itemSeleccionado} />
				) : null}

			{
				mostrarAlerta
					? <Modal
						title="Mensaje del Sistema"
						visible={mostrarAlerta}
						okButtonProps={{ hidden: true }}
						onCancel={() => setMostrarAlerta(false)}
						cancelText="Aceptar">
						<div style={{ display: 'flex', width: '100%' }}>
							<ExclamationCircleOutlined style={{ color: 'orange', fontSize: '30px', marginRight: '6px' }} />
							<h4> Solo se muestra de las consultas médicas que ya fueron atendidas.</h4>
						</div>

					</Modal>
					: null
			}
		</>
	);
};
