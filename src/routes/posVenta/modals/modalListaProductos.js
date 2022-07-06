import React, { useEffect, useRef, useState } from 'react';
import {
	Card,
	Form,
	AutoComplete,
	Button,
	Table,
	Row,
	Input,
	Col,
	Modal,
	Divider,
	List,
} from 'antd';
import moment from 'moment';
import { httpClient } from '../../../util/Api';
import ModalSeleccionProducto from './modalSeleccionProducto';
import { ExclamationCircleOutlined, MinusOutlined } from '@ant-design/icons';
import ModalDatosPedido from './modalDatosPedido';

function ModalListaProductos({
	visible,
	setVisible,
	chargeDetailsModalProducto,
	pacienteCurrent,
	setPacienteCurrent,
	medicoCurrent,
	setMedicoCurrent,
	clienteCurrent,
	setClienteCurrent,
	datosPedidoAceptar,
}) {
	const [data, setData] = useState([]);
	const { confirm, warning } = Modal;
	const [loadingProductos, setLoadingProductos] = useState(false);
	const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
	const [dataEspecialidades, setDataEspecialidades] = useState([]);
	const [especialidad, setEspecialidad] = useState('');
	const [textSearch, settextSearch] = useState('');
	const [productoCurrent, setProductoCurrent] = useState({});
	const [productosCurrent, setProductosCurrent] = useState([]);
	const [productosDetalles, setProductosDetalles] = useState([]);
	const [visibleModalCantidad, setVisibleModalCantidad] = useState(false);
	const [visibleModalDatosPedido, setVisibleModalDatosPedido] = useState(false);

	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [state, setState] = useState();
	const [dataList, setDataList] = useState([]);
	const formRefEspe = useRef();
	const buttonReset = useRef();
	const buttonByEspecialidad = useRef();

	const handleReset = () => {
		setEspecialidad('');
		settextSearch('');
	};

	const handleResetProducto = clearFilters => {
		clearFilters();
		setState({ searchText: '' });
	};

	const resetEspecialidades = () => {
		buttonReset.current.click();
	};

	const rowSelection = {
		onChange: (selectedRowKey, selectedRows) => {
			setSelectedRowKeys(selectedRowKey);
			setProductosCurrent(selectedRows);
		},
		onSelect: (recordSelect, into, selectedRows) => {
			if (into) {
				setVisibleModalCantidad(true);
				setProductoCurrent(recordSelect);
			} else {
				confirm({
					icon: <ExclamationCircleOutlined />,
					centered: true,
					content:
						'Se eliminará los datos guardados del producto, ¿Está seguro de querer quitar este producto?',
					onOk() {
						setSelectedRowKeys(selectedRowKeys.filter(item => item !== recordSelect.key));
						setProductosDetalles(productosDetalles.filter(item => item.key !== recordSelect.key));
						setProductosCurrent(selectedRows);
					},
					onCancel() {
						setSelectedRowKeys([...selectedRows.map(item => item.key), recordSelect.key]);
						setProductosCurrent([...selectedRows, recordSelect]);
					},
				});
			}
		},
		selectedRowKeys,
		columnTitle: () => <>Sel</>,
	};

	const columns = [
		{
			title: 'Código',
			dataIndex: 'CODIGO',
			key: 'CODIGO',
		},
		{
			title: 'Descripción',
			dataIndex: 'DESCRIPCION',
			key: 'DESCRIPCION',
			width: '400px',
			filterDropdownVisible: true,
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
				<form
					id="my-form"
					onResetCapture={() => {
						handleResetProducto(clearFilters);
						handleReset();
					}}
					onSubmitCapture={e => {
						e.preventDefault();
						// handleSearchProducto([textSearch], confirm, 'DESCRIPCION');
						setSelectedKeys([textSearch]);
						confirm();
					}}
				></form>
			),
			filterIcon: filtered => null,
			onFilter: (value, record) =>
				record['DESCRIPCION']
					? record['DESCRIPCION'].toString().toLowerCase().includes(value.toLowerCase())
					: '',
		},
		{
			title: 'Unidad',
			dataIndex: 'UNIDAD',
			key: 'UNIDAD',
		},
		{
			title: 'Marca',
			dataIndex: 'MARCA',
			key: 'MARCA',
			filterDropdownVisible: true,
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
				<form
					ref={formRefEspe}
					id="my-form-espe"
					onResetCapture={() => {
						handleResetProducto(clearFilters);
						handleReset();
					}}
					onSubmitCapture={e => {
						e.preventDefault();
						setSelectedKeys([especialidad]);
						confirm();
					}}
				></form>
			),
			filterIcon: filtered => null,
			onFilter: (value, record) =>
				record['MARCA']
					? record['MARCA'].toString().toLowerCase().includes(value.toLowerCase())
					: '',
		},
		{
			title: 'Precio',
			dataIndex: 'PRECIO',
			key: 'PRECIO',
		},
	];

	const handleSelectEspecialidad = value => {
		setEspecialidad(value);
		setLoadingProductos(true);
		setTimeout(() => {
			buttonByEspecialidad.current.click();
			setLoadingProductos(false);
		}, 500);
	};

	const cancelProductoSelected = key => {
		setSelectedRowKeys(selectedRowKeys.filter(item => item !== key));
		setVisibleModalCantidad(false);
		setProductosCurrent(productosCurrent.filter(item => item.key !== key));
	};

	const aceptedProductoSelected = (key, newData) => {
		setProductosDetalles([...productosDetalles, { ...newData, key }]);
		setVisibleModalCantidad(false);
	};

	const getListaProductos = async () => {
		setLoadingProductos(true);
		try {
			const {
				data: { success, data },
			} = await httpClient.post('posventa/getProductos', {
				codGrupoCia: '001',
				codLocal: '001',
			});

			if (success) {
				setData(data);
			}
		} catch (error) {
			console.error(error);
		}
		setLoadingProductos(false);
	};

	const getListaEspecialidades = async () => {
		setLoadingEspecialidades(true);
		try {
			const {
				data: { success, data },
			} = await httpClient.post('posventa/getEspecialidades', {
				codGrupoCia: '001',
				codLocal: '001',
			});

			if (success) {
				setDataEspecialidades(data);
				setDataList(data.map(item => item.ESPECIALIDAD));
			}
		} catch (error) {
			console.error(error);
		}
		setLoadingEspecialidades(false);
	};

	useEffect(() => {
		getListaProductos();
		getListaEspecialidades();
	}, []);

	return (
		<>
			<Modal
				centered
				width={1200}
				footer={false}
				visible={visible}
				title="Lista de Productos y Precios"
				closeIcon={<MinusOutlined />}
				onCancel={() => {
					if (productosDetalles.length <= 0)
						warning({
							centered: true,
							content: 'No hay productos seleccionados. Verifique!!!',
						});
					else setVisible(false);
				}}
			>
				<Row justify="space-between">
					<Col span={18}>
						<Row justify="space-between" style={{ margin: 0 }}>
							<Col span={17}>
								<Form.Item label="Producto">
									<Input
										size="large"
										onChange={e => settextSearch(e.target.value.toUpperCase())}
										value={textSearch}
										disabled={loadingProductos}
										placeholder="Ejm: CORONA METAL PORCELANA II"
									/>
								</Form.Item>
							</Col>
							<Col span={6}>
								<Row style={{ flexDirection: 'column' }}>
									<Button
										htmlType="submit"
										form="my-form"
										size="small"
										disabled={textSearch.trim() === ''}
										style={{
											backgroundColor: '#0169aa',
											color: 'white',
											margin: 0,
											marginBottom: 5,
										}}
										// onClick={handleSearch}
									>
										Buscar
									</Button>
									<Button
										size="small"
										style={{
											backgroundColor: '#0169aa',
											color: 'white',
										}}
										onClick={() => setVisibleModalDatosPedido(true)}
									>
										Datos Pedido
									</Button>
								</Row>
							</Col>
						</Row>
						<Row justify="space-between">
							<Col span={13}>
								<Row justify="space-between" style={{ margin: 0 }}>
									Unidad: {moment().format('DD/MM/yyyy')}
								</Row>
								<Row justify="space-between">
									<Col span={12}>
										<span>Precio: S/. 50.00</span>
									</Col>
									<Col span={12}>
										<Input size="small" placeholder="Stock adic.:" />
									</Col>
								</Row>
							</Col>
							{/*<Divider type='vertical' />*/}
							<Col span={7}>
								<Row justify="space-between" style={{ margin: 0 }}>
									<span>Items:</span>
									<span>{selectedRowKeys.length}</span>
								</Row>
								<Row justify="space-between" style={{ margin: 0 }}>
									<span>Total Venta: S/.</span>
									<span>0.00</span>
								</Row>
							</Col>
						</Row>
						<Divider />
						<Table
							pagination={{
								pageSize: 5,
								pageSizeOptions: [],
							}}
							rowSelection={{
								type: 'checkbox',
								...rowSelection,
							}}
							className="gx-table-responsive"
							columns={columns}
							dataSource={data}
							loading={loadingProductos}
							size="small"
							bordered
						/>
						<div
							style={{
								marginTop: 20,
							}}
						>
							<Button
								style={{
									backgroundColor: '#0169aa',
									color: 'white',
								}}
							>
								Info Prod.
							</Button>
							{/*<Button type='primary'>*/}
							{/*  Cotizar*/}
							{/*</Button>*/}
							{/*<Button type='primary'>*/}
							{/*  Ingresar Pedido/Cotizacion*/}
							{/*</Button>*/}
							<Button
								style={{
									backgroundColor: '#0169aa',
									color: 'white',
								}}
								onClick={() => {
									chargeDetailsModalProducto(productosCurrent, productosDetalles);
									setVisible(false);
								}}
								disabled={productosDetalles.length <= 0}
							>
								Aceptar
							</Button>
							<Button type="default">Ver Campañas</Button>
							<Button form="my-form" htmlType="reset" type="default" onClick={resetEspecialidades}>
								Limpiar Filtro
							</Button>
						</div>
					</Col>
					<Col span={6}>
						<Form layout="vertical">
							<Form.Item label="Especialidad">
								<AutoComplete
									value={especialidad}
									options={dataEspecialidades}
									onSelect={handleSelectEspecialidad}
									style={{ width: '100%' }}
									disabled={loadingEspecialidades}
									placeholder="SELECCIONAR"
								/>
								<Button
									form="my-form-espe"
									htmlType="submit"
									ref={buttonByEspecialidad}
									style={{ display: 'none' }}
								></Button>
								<Button
									form="my-form-espe"
									htmlType="reset"
									ref={buttonReset}
									style={{ display: 'none' }}
								></Button>
							</Form.Item>
						</Form>
						<div style={{ height: 300, overflowY: 'auto' }}>
							<List
								loading={loadingEspecialidades}
								size="small"
								bordered
								dataSource={dataList}
								renderItem={item => (
									<List.Item
										onClick={() => handleSelectEspecialidad(item)}
										style={{ fontWeight: especialidad === item && 'bold', cursor: 'pointer' }}
									>
										{item}
									</List.Item>
								)}
							/>
						</div>
					</Col>
				</Row>
			</Modal>
			<ModalSeleccionProducto
				cancelProductoSelected={cancelProductoSelected}
				aceptedProductoSelected={aceptedProductoSelected}
				visible={visibleModalCantidad}
				setVisible={setVisibleModalCantidad}
				productoCurrent={productoCurrent}
				productosCurrent={productosCurrent}
				setProductoCurrent={setProductoCurrent}
			/>
			<ModalDatosPedido
				// grabarPedido
				// guardarDatosPedidoCabecera
				visible={visibleModalDatosPedido}
				setVisible={setVisibleModalDatosPedido}
				visibleDatosPedidoAceptar={datosPedidoAceptar}
				pacienteCurrent={pacienteCurrent}
				setPacienteCurrent={setPacienteCurrent}
				medicoCurrent={medicoCurrent}
				setMedicoCurrent={setMedicoCurrent}
				clienteCurrent={clienteCurrent}
				setClienteCurrent={setClienteCurrent}
			/>
		</>
	);
}

export default ModalListaProductos;
