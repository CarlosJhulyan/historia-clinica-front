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

import { httpClient } from '../../../util/Api';
import ModalSeleccionProducto from '../modals/modalSeleccionProducto';
import { ExclamationCircleOutlined, MinusOutlined } from '@ant-design/icons';
import ModalDatosPedido from '../modals/modalDatosPedido';
import ModalInfoProducto from '../modals/modalInforProducto';
import { useAuth } from '../../../authentication';
import ModalConsultaReserva from '../modalsReserva/modalConsultaReserva';
import { useSelector } from 'react-redux';

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
	tipoVenta,
	setTipoVenta,
	selectedRowKeys,
	setSelectedRowKeys,
	productosDetalles,
	setProductosDetalles,
	productosCurrent,
	setProductosCurrent,
  setGrabarPedido,
  reserva,
  setDataReservaFinally,
  setDataReserva,
}) {
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const [data, setData] = useState([]);
	const { confirm, warning, info } = Modal;
	const [loadingProductos, setLoadingProductos] = useState(false);
	const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
	const [dataEspecialidades, setDataEspecialidades] = useState([]);
	const [especialidad, setEspecialidad] = useState('');
	const [textSearch, settextSearch] = useState('');
	const [productoCurrent, setProductoCurrent] = useState({});
	const [productoCurrentDetails, setProductoCurrentDetails] = useState({});
  const [visibleModalConsultaReserva, setVisibleModalConsultaReserva] = useState(false);
	const [visibleModalCantidad, setVisibleModalCantidad] = useState(false);
	const [visibleModalDatosPedido, setVisibleModalDatosPedido] = useState(false);
	const [visibleModalInfoProducto, setVisibleModalInfoProducto] = useState(false);
	const [totalLabel, setTotalLabel] = useState(0);
	const [dataCurrentLabel, setDataCurrentLabel] = useState({});
  const [permiteEditarPrecio, setPermiteEditarPrecio] = useState(false);
  const {
    authUser: { data: user },
  } = useAuth();

	const [state, setState] = useState();
	const [dataList, setDataList] = useState([]);
	const formRefEspe = useRef();
	const buttonReset = useRef();
	const buttonByEspecialidad = useRef();
	const buttonRef = useRef();

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
      width: 80
		},
		{
			title: 'Descripción',
			dataIndex: 'DESCRIPCION',
			key: 'DESCRIPCION',
      width: 230,
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
      width: 70
		},
		{
			title: 'Marca',
			dataIndex: 'MARCA',
			key: 'MARCA',
      width: 150,
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
			title: 'Precio(S/)',
			dataIndex: 'PRECIO',
			key: 'PRECIO',
      width: 100
		},
		{
			title: '',
			dataIndex: 'key',
			key: 'key',
      width: 70,
			render: (_, record) => (
				<>
					<a
           style={{
             color: themeSettingsGlobal.COD_COLOR_1
           }}
            onClick={() => handleSelectDetails(record)}
          >
            Detalles
          </a>
				</>
			)
		}
	];

	const handleSelectDetails = record => {
		setProductoCurrentDetails(record);
		setVisibleModalInfoProducto(true);
	}

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

  const validaCambioPrecio = async () => {
    try {
      const {
        data: { success, data },
      } = await httpClient.post('posventa/validaCambioPrecio', {
        codGrupoCia: '001',
        codLocal: '001',
        secUsu: user.sec_usu_local
      });

      if (success) {
        setPermiteEditarPrecio(data.trim() === 'N');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showProductosSinStockReserva = (productos = [], pC, pD) => {
    if (productos.length >= 1) info({
      centered: true,
      content: (
        <div>
          <p>Los siguientes productos cuentan sin Stock o sobrepasan la cantidad en Stock Físico:</p>
          <List
            size='small'
            dataSource={productos}
            itemLayout='horizontal'
            renderItem={item => (
              <List.Item>
                {item.COD_PRODUCTO} - {item.DESCRIPCION}
              </List.Item>
            )}
          />
          <p>Cambie sus cantidades...</p>
        </div>
      ),
      title: 'Productos Observados',
      okText: 'Aceptar',
      onOk: () => {
        if (pD.length <= 0) {
          warning({
            centered: true,
            content: 'No hay productos seleccionados. Verifique!!!',
          });
          return;
        }
        chargeDetailsModalProducto(pC, pD);
        setVisible(false);
      },
      width: 500
    });
    else {
      chargeDetailsModalProducto(pC, pD);
      setVisible(false);
    }
    //   info({
    //   centered: true,
    //   content: 'Se cargo el pedido en reserva correctamente',
    //   okText: 'Aceptar',
    //   onOk: () => {
    //     if (productosDetalles.length <= 0) {
    //       warning({
    //         centered: true,
    //         content: 'No hay productos seleccionados. Verifique!!!',
    //       });
    //       return;
    //     }
    //     chargeDetailsModalProducto(productosCurrent, productosDetalles);
    //
    //   },
    //   width: 500
    // });
  }

	useEffect(() => {
    validaCambioPrecio();
		getListaProductos();
		getListaEspecialidades();
	}, []);

	useEffect(() => {
		const total = productosDetalles.reduce(
			(previus, current) => parseFloat(current.total) + previus,
			0
		);
		setTotalLabel(total);
		if (productosDetalles.length >= 1) {
			setDataCurrentLabel({
				precio: productosDetalles[productosDetalles.length - 1].pu,
				unidad: productosDetalles[productosDetalles.length - 1].UNIDAD,
			});
		} else {
			setDataCurrentLabel({
				precio: 0,
				unidad: '',
			});
		}
	}, [selectedRowKeys, productosDetalles]);

	return (
		<>
			<Modal
				centered
				width={1100}
				footer={[
          <Button
            style={{
              backgroundColor: themeSettingsGlobal.COD_COLOR_1,
              color: 'white',
            }}
            onClick={() => {
              if (productosDetalles.length <= 0) {
                warning({
                  centered: true,
                  content: 'No hay productos seleccionados. Verifique!!!',
                });
                return;
              }
              chargeDetailsModalProducto(productosCurrent, productosDetalles);
              setVisible(false);
            }}
            disabled={productosDetalles.length <= 0}
          >
            Aceptar
          </Button>,
          (!reserva && user.roles.some(item => item === '909')) && (
            <Button onClick={() => setVisibleModalConsultaReserva(true)}>
              Atención de Reserva
            </Button>
          ),
          <Button form="my-form" htmlType="reset" type="default" onClick={resetEspecialidades}>
            Limpiar Filtro
          </Button>
        ]}
				visible={visible}
				title="Lista de Productos y Precios"
				closeIcon={<MinusOutlined />}
				onCancel={() => {
					// if (productosDetalles.length <= 0)
					// 	warning({
					// 		centered: true,
					// 		content: 'No hay productos seleccionados. Verifique!!!',
					// 	});
					// else
          setVisible(false);
				}}
        className='modal-posventa modal-posventa-productos'
			>
				<Row justify="space-between">
					<Col xl={18} lg={18} md={19} sm={19} xs={20}>
						<Row justify="space-between" style={{ margin: 0 }}>
							<Col span={17}>
								<Form.Item label="Producto">
									<Input
										size="large"
										onChange={e => settextSearch(e.target.value.toUpperCase())}
										value={textSearch}
										disabled={loadingProductos}
										placeholder="Ejm: CORONA METAL PORCELANA II"
										onKeyUp={e => {
											if (e.key === 'Enter') {
												console.log(e.target.value);
												buttonRef.current.click();

											}
										}}
									/>
								</Form.Item>
							</Col>
							<Col span={6}>
								<Row style={{ flexDirection: 'column' }}>
									<Button
										ref={buttonRef}
										htmlType="submit"
										form="my-form"
										size="small"
										disabled={textSearch.trim() === ''}
										style={{
											backgroundColor: themeSettingsGlobal.COD_COLOR_1,
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
											backgroundColor: themeSettingsGlobal.COD_COLOR_1,
											color: 'white',
										}}
										onClick={() => {
                      setVisibleModalDatosPedido(true);
                      setGrabarPedido(false);
                    }}
									>
										Datos Pedido
									</Button>
								</Row>
							</Col>
						</Row>
						<Row justify="space-between">
							<Col span={13}>
								<Row justify="space-between" style={{ margin: 0 }}>
									Unidad: {dataCurrentLabel.unidad}
								</Row>
								<Row justify="space-between">
									<Col span={12}>
										<span>Precio: S/. {Number(dataCurrentLabel.precio).toFixed(2)}</span>
									</Col>
									<Col span={12}>
										<Input size="small" placeholder="Stock adic.:" />
									</Col>
								</Row>
							</Col>
							<Col span={7}>
								<Row justify="space-between" style={{ margin: 0 }}>
									<span>Items:</span>
									<span>{selectedRowKeys.length}</span>
								</Row>
								<Row justify="space-between" style={{ margin: 0 }}>
									<span>Total Venta: S/.</span>
									<span>{totalLabel.toFixed(2)}</span>
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
              scroll={{
                y: 270
              }}
						/>
					</Col>

					<Col xl={6} lg={6} md={5} sm={5} xs={4}>
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
						<div style={{ height: 400, overflowY: 'auto', overflowX: 'hidden' }}>
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
			{visibleModalCantidad && (
				<ModalSeleccionProducto
					cancelProductoSelected={cancelProductoSelected}
					aceptedProductoSelected={aceptedProductoSelected}
					visible={visibleModalCantidad}
					productoCurrent={productoCurrent}
					productosCurrent={productosCurrent}
					setProductoCurrent={setProductoCurrent}
          permiteEditarPrecio={permiteEditarPrecio}
				/>
			)}
			{visibleModalInfoProducto ? (
				<ModalInfoProducto
					visible={visibleModalInfoProducto}
					setVisible={setVisibleModalInfoProducto}
					productoCurrent={productoCurrentDetails}
				/>
			) : null}
      {(visibleModalConsultaReserva && !reserva && user.roles.some(item => item === '909')) && (
        <ModalConsultaReserva
          visible={visibleModalConsultaReserva}
          setVisible={setVisibleModalConsultaReserva}
          setClienteCurrent={setClienteCurrent}
          setMedicoCurrent={setMedicoCurrent}
          setPacienteCurrent={setPacienteCurrent}
          setTipoVenta={setTipoVenta}
          setDataReservaFinally={setDataReservaFinally}
          setProductosCurrent={setProductosCurrent}
          setProductosDetalles={setProductosDetalles}
          setSelectedRowKeys={setSelectedRowKeys}
          showProductosSinStockReserva={showProductosSinStockReserva}
          setDataReservaCab={setDataReserva}
        />
      )}
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
				tipoVenta={tipoVenta}
				setTipoVenta={setTipoVenta}
			/>
		</>
	);
}

export default ModalListaProductos;