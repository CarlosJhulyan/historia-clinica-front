import React, { useEffect, useState } from 'react';
import {
	Button,
	Card,
	Col,
	Descriptions,
	Divider,
	Form,
	Input,
	List,
	Modal,
	Row,
	Table,
} from 'antd';
import ModalListaMedicos from './modalListaMedicos';
import ModalListaPacientes from './modalListaPacientes';
import ModalListaClientes from './modalListaClientes';
import Doctor from '../../../assets/posventa/doctor.png';
import Paciente from '../../../assets/posventa/paciente.png';
import { httpClient } from '../../../util/Api';
import { notificaciones, openNotification } from '../../../util/util';
import { useAuth } from '../../../authentication';

function ModalCobrarPedido({
	visible,
	setVisible,
	medicoCurrent,
	clienteCurrent,
	pacienteCurrent,
	setClienteCurrent,
	setMedicoCurrent,
	setPacienteCurrent,
	productos,
	dataFetch,
	cNumPedVta_in,
	dataCabeceraPed,
	tipoVenta,
}) {
	const [visibleModalMedicos, setVisibleModalMedicos] = useState(false);
	const [visibleModalPacientes, setVisibleModalPacientes] = useState(false);
	const [visibleModalCliente, setVisibleModalCliente] = useState(false);
	const [dataMontos, setDataMontos] = useState([]);
	const [formaPagoCurrent, setFormaPagoCurrent] = useState({});
	const [montoCurrent, setMontoCurrent] = useState(0.0);
	const [totalMonto, setTotalMonto] = useState(0.0);
	const [numeroOperacion, setNumeroOperacion] = useState('');

	const dataInitFetch = {
		codGrupoCia: '001',
		codLocal: '001',
	};

	const [listaCajaEspecialidad, setListaCajaEspecialidad] = useState(null);
	const [listaCajaDetEspecialidad, setListaCajaDetEspecialidad] = useState(null);
	const [formasPagoSinConvenio, setFormasPagoSinConvenio] = useState([{}]);

	const [loadingCobrar, setLoadingCobrar] = useState(false);
	const {
		authUser: { data: user },
	} = useAuth();

	const COD_NUMERA_SEC_COMP_PAGO = '015';
	const MOT_KARDEX_VENTA_NORMAL = '001';
	const COD_NUMERA_SEC_KARDEX = '016';
	const TIP_DOC_KARDEX_VENTA = '016';

	useEffect(() => {
		inicializar();
	}, [cNumPedVta_in]);

	useEffect(() => {
		const total = dataMontos.reduce((prev, current) => {
			if (current.monto) return Number(current.monto) + prev;
			else return 0 + prev;
		}, 0);
		setTotalMonto(total);
	}, [dataMontos]);

	const inicializar = async () => {
		await procesaPedidoEspecialidad();
		await cargaListaCajaDetEspecialidad();
		await getFormasPagoSinConvenio();
		await cargaListaCajaEspecialidad();
	};

	const handleCobrarPedido = async () => {
		const stockValido = await validarStockPedido();

		if (stockValido === 'S') {
			await grabarInicioCobro();

			/**
			 * SI EL ESTADO DEL PEDIDO ES C -> MENSAJE PEDIDO COBRADO
			 * SI EL ESTADO DEL PEDIDO ES N -> MENSAJE PEDIDO ANULADO
			 * SI EL ESTADO DEL PEDIDO ES S -> MENSAJE PEDIDO PENDIENTE DE IMPRESION
			 * SI EL ESTADO DEL PEDIDO ES P -> PASAR AL SIGUIENTE FLUJO
			 */
			const estadoPedido = await verificaEstadoPedido();

			if (estadoPedido === 'P') {


			}

			// const isFacturaElectronica = await validaSiFacturaElectronica();

			// if (isFacturaElectronica === 'S') {
			// }
		} else {
			openNotification(
				'Error',
				'Porque no hay stock suficiente para poder generarlo, Existe un Problema en la fracción de producto',
				'Alerta'
			);
		}

		// TODO: Continuar con el cobro de pedido
	};

	const grabarInicioCobro = async () => {
		try {
			const {
				data: { success, message },
			} = await httpClient.post('posventa/grabaInicioCobro', {
				...dataInitFetch,
				numPedido: dataCabeceraPed.cNumPedVta_in,
				tipoTmp: 'I',
			});
			if (success) {
				console.log(message);
			}
		} catch (e) {
			console.error(e);
		}
	};

	const validaSiFacturaElectronica = async () => {
		try {
			const {
				data: { success, message, data },
			} = await httpClient.post('posventa/validaSiFacturaElectronica', {
				...dataInitFetch,
			});
			if (success) {
				console.log(message);
				return data;
			}
		} catch (e) {
			console.error(e);
		}
	};

	const verificaEstadoPedido = async () => {
		try {
			const {
				data: { success, message, data },
			} = await httpClient.post('posventa/verificaEstadoPedido', {
				...dataInitFetch,
				numPedido: dataCabeceraPed.cNumPedVta_in,
			});
			if (success) {
				console.log(message);
				return data;
			}
		} catch (e) {
			console.error(e);
		}
	};

	const validarStockPedido = async () => {
		try {
			const {
				data: { success, message, data },
			} = await httpClient.post('posventa/validaStockPedido', {
				...dataInitFetch,
				numPedido: dataCabeceraPed.cNumPedVta_in,
			});
			if (success) {
				console.log(message);
				return data;
			}
		} catch (e) {
			console.error(e);
		}
	};

	const procesaPedidoEspecialidad = async () => {
		try {
			const {
				data: { success, message },
			} = await httpClient.post('/posventa/procesaPedidoEspecialidad', {
				...dataFetch,
				cNumPedVta_in,
			});
			if (success) console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const cargaListaCajaEspecialidad = async () => {
		try {
			const {
				data: { data, success, message },
			} = await httpClient.post('/posventa/cargaListaCajaEspecialidad', {
				...dataFetch,
				cNumPedVta_in,
			});
			if (success) setListaCajaEspecialidad(data);
			else console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const cajCobraPedido = async () => {
		try {
			const {
				data: { data, success, message },
			} = await httpClient.post('/posventa/cajCobraPedido', {
				...dataInitFetch,
				numPedido: dataCabeceraPed.cNumPedVta_in,
				// secMovCaja,
				codNumera: COD_NUMERA_SEC_COMP_PAGO,
				tipCompPago: tipoVenta,
				codMotKardex: MOT_KARDEX_VENTA_NORMAL,
				tipDocKardex: TIP_DOC_KARDEX_VENTA,
				codNumeraKardex: COD_NUMERA_SEC_KARDEX,
				usuCreaCompPago:user.sec_usu_local,
				// descDetalleForPago,
				// permiteCampana,
				// dni,
				// numCompPagoImpr,
			});
			if (success) setListaCajaEspecialidad(data);
			else console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const cargaListaCajaDetEspecialidad = async () => {
		try {
			const {
				data: { data, success, message },
			} = await httpClient.post('/posventa/cargaListaCajaDetEspecialidad', {
				...dataFetch,
				cNumPedVta_in,
			});
			if (success) setListaCajaDetEspecialidad(data);
			else console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const getFormasPagoSinConvenio = async () => {
		try {
			const {
				data: { data, success, message },
			} = await httpClient.post('/posventa/getFormasPagoSinConvenio', {
				...dataFetch,
				indConvenio: '',
				codConvenio: '',
				codCliente: clienteCurrent.COD_CLI,
				numPed: cNumPedVta_in,
			});
			console.log(data, message);
			if (success) {
				setFormasPagoSinConvenio(data);
			} else console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const cobraPedido = async () => {
		try {
			const {
				data: { data, success, message },
			} = await httpClient.post('/posventa/cobraPedido', {
				codGrupoCia: '',
				codLocal: '',
				cNumPedVta_in: '',
				cSecMovCaja_in: '',
				cCodNumera_in: '',
				cTipCompPago_in: tipoVenta,
				cCodMotKardex_in: '',
				cTipDocKardex_in: '',
				cCodNumeraKardex_in: '',
				cUsuCreaCompPago_in: '',
				cDescDetalleForPago_in: '',
				cPermiteCampana: '',
				cDni_in: '',
				cNumCompPagoImpr_in: '',
			});
			if (success) setFormasPagoSinConvenio(data);
			else console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const columnsEspecialidad = [
		{
			title: 'Especialidad',
			dataIndex: 'ESPECIALIDAD',
			key: 'ESPECIALIDAD',
		},
		{
			title: '.',
			dataIndex: 'P',
			key: 'P',
		},
		{
			title: 'Total',
			dataIndex: 'TOTAL',
			key: 'TOTAL',
			align: 'right',
		},
	];

	const columnsFormaPago = [
		{
			title: 'Forma de Pago',
			dataIndex: 'forma',
			key: 'forma',
		},
		{
			title: 'Total',
			dataIndex: 'monto',
			key: 'monto',
		},
		{
			title: 'Nº Operación',
			dataIndex: 'opera',
			key: 'opera',
		},
	];

	const columnsProductos = [
		{
			title: 'Código',
			dataIndex: 'CODIGO',
			key: 'CODIGO',
		},
		{
			title: 'Descripción',
			dataIndex: 'DESCRIPCION',
			key: 'DESCRIPCION',
		},
		{
			title: 'Pre. Vta.',
			dataIndex: 'pu',
			key: 'pu',
			align: 'right',
		},
		{
			title: 'Cantidad',
			dataIndex: 'cantidad',
			key: 'cantidad',
			align: 'right',
		},
		{
			title: 'Total',
			dataIndex: 'total',
			key: 'total',
			align: 'right',
		},
	];

	return (
		<>
			<Modal
				visible={visible}
				onCancel={() => setVisible(false)}
				centered
				title="Cobrar Pedido"
				className="modal-custom"
				width={1200}
				footer={false}
			>
				<Row style={{ marginTop: 10, marginLeft: 0, marginRight: 0 }}>
					<Col span={8}>
						<Table
							columns={columnsEspecialidad}
							dataSource={[
								{
									key: 1,
									TOTAL: '12.00',
									ESPECIALIDAD: 'VENTA',
									P: 'P',
								},
							]}
							pagination={false}
							size="small"
							bordered
						/>
					</Col>
					<Col span={16}>
						<Table
							columns={columnsProductos}
							dataSource={productos.length === 0 ? [{}] : productos}
							// pagination={false}
							size="small"
							bordered
							pagination={{
								pageSize: 4,
							}}
						/>
					</Col>
				</Row>
				<Row style={{ background: '#0169aa', margin: 0 }} justify="center">
					<Col span={20} style={{ color: '#0169aa' }}>
						s
					</Col>
				</Row>
				<Row style={{ marginLeft: 0, marginRight: 0, marginTop: 10 }}>
					<Col span={11}>
						<Row>
							<Col span={6}>
								<Button
									block
									onClick={() => setVisibleModalMedicos(true)}
									style={{ display: 'block', height: 'auto', padding: 10 }}
								>
									<img src={Doctor} />
								</Button>
							</Col>
							<Col span={18}>
								<h5>Datos de Medico</h5>
								<Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
									<Form.Item label="CMP" style={{ margin: 0 }}>
										<Input disabled size="small" value={medicoCurrent.CMP} />
									</Form.Item>
									<Form.Item label="Nombre Completo" style={{ margin: 0 }}>
										<Input disabled size="small" value={medicoCurrent.NOMBRE_COMPLETO} />
									</Form.Item>
								</Form>
							</Col>
						</Row>
						<Row>
							<Col span={6}>
								<Button
									block
									onClick={() => setVisibleModalPacientes(true)}
									style={{ display: 'block', height: 'auto', padding: 10 }}
								>
									<img src={Paciente} />
								</Button>
							</Col>
							<Col span={18}>
								<h5>Datos de Paciente</h5>
								<Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
									<Form.Item label="DNI" style={{ margin: 0 }}>
										<Input disabled size="small" value={pacienteCurrent.NUM_DOCUMENTO} />
									</Form.Item>
									<Form.Item label="Nacimiento" style={{ margin: 0 }}>
										<Input disabled size="small" value={pacienteCurrent.FEC_NAC_CLI} />
									</Form.Item>
									<Form.Item label="Nombres" style={{ margin: 0 }}>
										<Input disabled size="small" value={pacienteCurrent.NOMBRE} />
									</Form.Item>
									<Form.Item label="Apellidos" style={{ margin: 0 }}>
										<Input
											disabled
											size="small"
											value={`${pacienteCurrent.APE_PATERNO ? pacienteCurrent.APE_PATERNO : ''} ${
												pacienteCurrent.APE_MATERNO ? pacienteCurrent.APE_MATERNO : ''
											}`}
										/>
									</Form.Item>
								</Form>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<h5>Datos Comprobante</h5>
								<Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
									<Form.Item label="Documento" style={{ margin: 0 }}>
										<Input
											style={{ cursor: 'pointer' }}
											addonAfter={
												<span onClick={() => setVisibleModalCliente(true)}>
													Seleccionar Cliente
												</span>
											}
											size="small"
											disabled
											value={clienteCurrent.NUM_DOCUMENTO}
										/>
									</Form.Item>
									<Form.Item label="Nombres" style={{ margin: 0 }}>
										<Input size="small" disabled value={clienteCurrent.CLIENTE} />
									</Form.Item>
									<Form.Item label="Dirección" style={{ margin: 0 }}>
										<Input size="small" disabled value={clienteCurrent.DIRECCION} />
									</Form.Item>
									<Form.Item label="Email" style={{ margin: 0 }}>
										<Input size="small" disabled value={clienteCurrent.CORREO} />
									</Form.Item>
								</Form>
							</Col>
						</Row>
					</Col>
					<Col span={13}>
						<Row style={{ marginBottom: 5 }}>
							<Descriptions className="description-boleta">
								<Descriptions.Item span={1} label="BOLETA"></Descriptions.Item>
								<Descriptions.Item span={2} label="RUC">
									{dataCabeceraPed.cRucCliPedVta_in}
								</Descriptions.Item>
								<Descriptions.Item span={4} label="Cliente">
									{dataCabeceraPed.cNomCliPedVta_in}
								</Descriptions.Item>
								<Descriptions.Item span={1} label="Pedido">
									<Input
										size="small"
										style={{ width: 100 }}
										value={dataCabeceraPed.cNumPedDiario_in}
									/>
								</Descriptions.Item>
								<Descriptions.Item label="TOTAL VENTA S/.">
									{Number(dataCabeceraPed.nValNetoPedVta_in).toFixed(2)}
								</Descriptions.Item>
								<Descriptions.Item label="US$">
									{(
										dataCabeceraPed.nValTipCambioPedVta_in * dataCabeceraPed.nValNetoPedVta_in
									).toFixed(2)}
								</Descriptions.Item>
							</Descriptions>
						</Row>
						<Row className="div-tipo-cambio">
							<Col span={12}>Formas de Pago</Col>
							<Col span={12}>Tipo de cambio 3.34</Col>
						</Row>
						<Row>
							<Col span={8} style={{ padding: 0, paddingRight: 10 }}>
								<List
									size="small"
									bordered
									style={{ height: 140, overflowY: 'auto', margin: 0 }}
									dataSource={formasPagoSinConvenio}
									renderItem={item => (
										<List.Item
											key={item.key}
											onClick={() => {
												setFormaPagoCurrent(item);
												if (
													(item.COD_FORMA_PAGO === '00003' || item.COD_FORMA_PAGO === '00006') &&
													totalMonto < Number(dataCabeceraPed.nValNetoPedVta_in)
												) {
													const total = dataMontos.reduce((prev, current) => {
														if (current.monto) return Number(current.monto) + prev;
														else return 0 + prev;
													}, 0);
													setTotalMonto(total);
													setMontoCurrent(Number(dataCabeceraPed.nValNetoPedVta_in) - total);
												} else {
													setMontoCurrent(0);
												}
											}}
											style={{
												cursor: 'pointer',
												color:
													formaPagoCurrent.COD_FORMA_PAGO === item.COD_FORMA_PAGO
														? '#0169aa'
														: '#000',
												background:
													formaPagoCurrent.COD_FORMA_PAGO === item.COD_FORMA_PAGO
														? 'rgba(1,105,170,0.12)'
														: '#fff',
											}}
										>
											{item.DESC_CORTA_FORMA_PAGO}
										</List.Item>
									)}
								/>
							</Col>
							<Col span={16}>
								<Form>
									<Row style={{ marginTop: 10 }}>
										<Col span={10} style={{ marginRight: 10 }}>
											<Form.Item label="Moneda">
												<Input disabled value={'SOLES'} />
											</Form.Item>
										</Col>
										<Col span={13}>
											<Form.Item label="Nº Operación">
												<Input
													value={numeroOperacion}
													onChange={e => setNumeroOperacion(e.target.value)}
												/>
											</Form.Item>
										</Col>
									</Row>
									<Row>
										<Col span={10} style={{ marginRight: 10 }}>
											<Form.Item label="Monto">
												<Input
													min={0}
													type="number"
													value={montoCurrent}
													disabled={!formaPagoCurrent.key}
													onChange={e => setMontoCurrent(e.target.value)}
												/>
											</Form.Item>
										</Col>
									</Row>
									<Row>
										<Col span={10} style={{ marginRight: 10 }}>
											<Form.Item>
												<Button
													onClick={() => {
														setDataMontos([
															...dataMontos,
															{
																monto: montoCurrent,
																forma: formaPagoCurrent.DESC_CORTA_FORMA_PAGO,
																key: formaPagoCurrent.key,
																opera: numeroOperacion,
															},
														]);
														setMontoCurrent(0);
														setNumeroOperacion('');
													}}
													block
													disabled={montoCurrent <= 0}
												>
													Adicionar
												</Button>
											</Form.Item>
										</Col>
									</Row>
								</Form>
							</Col>
						</Row>
						<Row>
							<Col span={14}>
								<Table
									columns={columnsFormaPago}
									size="small"
									pagination={false}
									dataSource={dataMontos}
								/>
							</Col>
							<Col span={10} style={{ marginBottom: 20 }}>
								<Descriptions className="total-pagar-desc" style={{ height: '100%' }}>
									<Descriptions.Item span={3} label="TOTAL A PAGAR S/.">
										{dataCabeceraPed.nValNetoPedVta_in}
									</Descriptions.Item>
									<Descriptions.Item span={3} label="Vuelto S/.">
										{totalMonto - Number(dataCabeceraPed.nValNetoPedVta_in) >= 0
											? (totalMonto - Number(dataCabeceraPed.nValNetoPedVta_in)).toFixed(2)
											: (0).toFixed(2)}
									</Descriptions.Item>
								</Descriptions>
							</Col>
							<Col span={24}>
								<Row justify="end" style={{ marginRight: 5 }}>
									<Button>% Descuento</Button>
									<Button
										onClick={() => {
											setDataMontos([]);
										}}
									>
										Limpiar
									</Button>
									<Button
										style={{ backgroundColor: '#0169aa', color: 'white' }}
										disabled={totalMonto - Number(dataCabeceraPed.nValNetoPedVta_in) < 0}
										loading={loadingCobrar}
										onClick={handleCobrarPedido}
									>
										Aceptar
									</Button>
								</Row>
							</Col>
						</Row>
					</Col>
				</Row>
			</Modal>
			{visibleModalMedicos ? (
				<ModalListaMedicos
					setVisible={setVisibleModalMedicos}
					visible={visibleModalMedicos}
					setMedicoCurrent={setMedicoCurrent}
				/>
			) : null}
			{visibleModalCliente ? (
				<ModalListaPacientes
					visible={visibleModalPacientes}
					setVisible={setVisibleModalPacientes}
					setPacienteCurrent={setPacienteCurrent}
				/>
			) : null}
			{visibleModalCliente ? (
				<ModalListaClientes
					visible={visibleModalCliente}
					setVisible={setVisibleModalCliente}
					setClienteCurrent={setClienteCurrent}
				/>
			) : null}
		</>
	);
}

export default ModalCobrarPedido;
