import { Col, Button, Form, Input, Modal, Row, Space, Checkbox, Table } from 'antd';
import React, { createRef, useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { actualizarTratamientos } from '../../../listaPaciente/datosPaciente/apis';
const CheckboxGroup = Checkbox.Group;

const options = [
	{ label: 'Farmacia', value: 'farmacia' },
	{ label: 'Otros', value: 'otros' },
];

//Colores Columna
const colorRojo = '#FF9494';
const colorVerde = '#89E077';
const colorBlanco = '#FFFFFF';

const ModalTratamiento = ({ abrirModal, setAbrirModal, handleDatos, dataTratamiento }) => {
	const dataGlobal = {
		codGrupoCia: '001',
		codLocal: '001',
	};

	// referencia del formulario
	const formRef = createRef();

	const [estado, setEstado] = useState({ a: 'a' });
	const [medicamentos, setMedicamentos] = useState();
	const [botonModal, setBotonModal] = useState(true);
	const [btnActualizar, setBtnActualizar] = useState(false);
	const [state, setState] = useState();
	const [filtro, setFiltro] = useState();

	const rowSelection = {
		onChange: selectedRows => {
			console.log('selecteeeeeeed:', selectedRows);
			setEstado(selectedRows);
			setBotonModal(false);
		},
	};

	useEffect(() => {
		let newArray = [];

		if (abrirModal) {
			if (dataTratamiento) {
				const filtroHumanidadStock = dataTratamiento.filter(
					item => item.NOM_LAB === 'FARMACIA HUMANIDAD SUR' && item.STK_FISICO > 0
				);

				const filtroHumanidadSinStock = dataTratamiento.filter(
					item => item.NOM_LAB === 'FARMACIA HUMANIDAD SUR' && item.STK_FISICO < 1
				);

				const filtroOtrosStock = dataTratamiento.filter(
					item => item.NOM_LAB !== 'FARMACIA HUMANIDAD SUR'
				);

				newArray.push(...filtroHumanidadStock, ...filtroHumanidadSinStock, ...filtroOtrosStock);
				setMedicamentos(newArray);
				setBotonModal(true);
			}
		}
	}, [abrirModal, dataTratamiento]);

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
			title: 'DESCRIPCIÓN',
			dataIndex: 'DESC_PROD',
			key: 'descripcion',
			render: (text, record) => {
				return {
					props: {
						style: {
							background:
								record.NOM_LAB !== 'FARMACIA HUMANIDAD SUR'
									? colorBlanco
									: record.STK_FISICO > 0
									? colorVerde
									: colorRojo,
						},
					},
					children: <div>{text}</div>,
				};
			},
			...getColumnSearchProps('DESC_PROD'),
		},
		{
			title: 'UNIDAD',
			dataIndex: 'UNIDAD',
			key: 'unidad',
			render: (text, record) => {
				return {
					props: {
						style: {
							background:
								record.NOM_LAB !== 'FARMACIA HUMANIDAD SUR'
									? colorBlanco
									: record.STK_FISICO > 0
									? colorVerde
									: colorRojo,
						},
					},
					children: <div>{text}</div>,
				};
			},
			...getColumnSearchProps('UNIDAD'),
		},
		{
			title: 'MARCA / LABORATORIO',
			dataIndex: 'MARCA',
			key: 'marca',
			render: (text, record) => {
				return {
					props: {
						style: {
							background:
								record.NOM_LAB !== 'FARMACIA HUMANIDAD SUR'
									? colorBlanco
									: record.STK_FISICO > 0
									? colorVerde
									: colorRojo,
						},
					},
					children: <div>{text}</div>,
				};
			},
			...getColumnSearchProps('MARCA'),
		},
		{
			title: 'GENÉRICO',
			dataIndex: 'GENERICO',
			key: 'generico',
			render: (text, record) => {
				return {
					props: {
						style: {
							background:
								record.NOM_LAB !== 'FARMACIA HUMANIDAD SUR'
									? colorBlanco
									: record.STK_FISICO > 0
									? colorVerde
									: colorRojo,
						},
					},
					children: <div>{text}</div>,
				};
			},
			...getColumnSearchProps('GENERICO'),
		},
		{
			title: 'EMPRESA',
			dataIndex: 'NOM_LAB',
			key: 'empresa',
			render: (text, record) => {
				return {
					props: {
						style: {
							background:
								record.NOM_LAB !== 'FARMACIA HUMANIDAD SUR'
									? colorBlanco
									: record.STK_FISICO > 0
									? colorVerde
									: colorRojo,
						},
					},
					children: <div>{text}</div>,
				};
			},
			...getColumnSearchProps('NOM_LAB'),
		},
	];

	const filtrarPorOpcion = e => {
		if (e.length > 0) {
			if (e[0] === 'farmacia') {
				//llamar farmacia
				const filterFarmacia = dataTratamiento.filter(
					data => data.NOM_LAB === 'LIFE CHANGE  180' || data.NOM_LAB.includes('FARMACIA')
				);
				setFiltro(filterFarmacia);
			} else {
				//lamar otros
				const filterOtros = dataTratamiento.filter(
					data => data.NOM_LAB !== 'LIFE CHANGE  180' && !data.NOM_LAB.includes('FARMACIA')
				);
				setFiltro(filterOtros);
			}
		} else {
			setFiltro(undefined);
		}
	};

	const onClickActualizarModal = async () => {
		setBtnActualizar(true);
		await actualizarTratamientos(dataGlobal);
		setBtnActualizar(false);
	};

	return (
		<>
			<Modal
				width="70%"
				title={<div style={{ fontSize: '22px' }}>Medicamentos</div>}
				visible={abrirModal}
				onOk={() => handleDatos({ estado })}
				okButtonProps={{
					disabled: botonModal,
				}}
				onCancel={() => setAbrirModal(false)}
				footer={[
					<Row style={{ flexDirection: 'row' }}>
						<Col lg={12} md={12} sm={12} xs={12}>
							<Row style={{ flexDirection: 'row', height: '100%' }}>
								<Col
									lg={6}
									md={12}
									sm={12}
									xs={12}
									style={{
										flexDirection: 'row',
										display: 'inline-flex',
										gap: '10px',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<div style={{ backgroundColor: colorRojo, width: '10px', height: '10px' }}></div>
									Sin Stock
								</Col>
								<Col
									lg={6}
									md={12}
									sm={12}
									xs={12}
									style={{
										flexDirection: 'row',
										display: 'inline-flex',
										gap: '10px',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<div style={{ backgroundColor: colorVerde, width: '10px', height: '10px' }}></div>
									Con Stock
								</Col>
							</Row>
						</Col>
						<Col lg={12} md={12} sm={12} xs={12}>
							<Button key="back" onClick={() => setAbrirModal(false)}>
								Cancelar
							</Button>
							<Button
								disabled={botonModal}
								key="submit"
								type="primary"
								onClick={() => handleDatos({ estado })}
							>
								Agregar
							</Button>
						</Col>
					</Row>,
				]}
			>
				{medicamentos === undefined ? (
					<div style={{ display: 'flex', justifyContent: 'center' }}>No hay data</div>
				) : (
					<Form
						ref={formRef}
						layout="vertical"
						initialValues={estado}
						style={{ paddingTop: '20px' }}
					>
						<Row
							style={{
								flexDirection: 'row',
								marginTop: -15,
								marginBottom: 15,
							}}
						>
							<Col lg={24} md={24} sm={24} xs={24}>
								<Table
									key={medicamentos.key}
									className="gx-table-responsive"
									columns={columns}
									loading={btnActualizar}
									dataSource={filtro !== undefined ? filtro : medicamentos}
									rowSelection={{ type: 'radio', ...rowSelection }}
									size="small"
									scroll={{ y: 300 }}
								/>
								<br />
							</Col>
							<Col lg={12} md={24} sm={24} xs={24}>
								<Form.Item
									name="lugares"
									label="Lugares"
									rules={[
										{
											required: false,
											message: 'Seleccione el lugar',
										},
									]}
								>
									<CheckboxGroup options={options} onChange={e => filtrarPorOpcion(e)} />
								</Form.Item>
							</Col>
							<Col
								lg={12}
								md={24}
								sm={24}
								xs={24}
								style={{ alignItems: 'flex-end', display: 'flex', justifyContent: 'flex-end' }}
							>
								<Button
									type="primary"
									disabled={btnActualizar}
									onClick={() => onClickActualizarModal()}
								>
									Actualizar Medicamentos
								</Button>
							</Col>
						</Row>
					</Form>
				)}
			</Modal>
		</>
	);
};
export default ModalTratamiento;
