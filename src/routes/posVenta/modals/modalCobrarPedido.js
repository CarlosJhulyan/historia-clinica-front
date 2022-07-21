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
	Radio,
	Row,
	Select,
	Space,
	Spin,
	Table,
} from 'antd';
import ModalListaMedicos from './modalListaMedicos';
import ModalListaPacientes from './modalListaPacientes';
import ModalListaClientes from './modalListaClientes';
import Doctor from '../../../assets/posventa/doctor.png';
import Paciente from '../../../assets/posventa/paciente.png';
import { httpClient } from '../../../util/Api';
import { openNotification } from '../../../util/util';
import { useAuth } from '../../../authentication';
import ModalLoading from '../../../util/modalLoading';
import ModalComprobante from './modalComprobante';
import ModalTicket from './modalTicket';
import { baseUrl, baseUrlImage } from '../../../config/backend';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function ModalCobrarPedido({
	visible,
	setVisible,
	medicoCurrent,
	clienteCurrent,
	pacienteCurrent,
	setClienteCurrent,
	setMedicoCurrent,
	setPacienteCurrent,
	dataFetch,
	cNumPedVta_in,
	dataCabeceraPed,
	tipoVenta,
	getFechaMovCaja,
	setTipoVenta,
	clearDataFinallyMain,
}) {
	const { info, confirm } = Modal;
	const [visibleModalMedicos, setVisibleModalMedicos] = useState(false);
	const [visibleModalPacientes, setVisibleModalPacientes] = useState(false);
	const [visibleModalCliente, setVisibleModalCliente] = useState(false);
	const [visibleModalSeleccion, setVisibleModalSeleccion] = useState(false);
	const [visibleModalComprobante, setVisibleModalComprobante] = useState(false);
	const [visibleModalOrdenes, setVisibleModalOrdenes] = useState(false);
	const [dataMontos, setDataMontos] = useState([]);
	const [formaPagoCurrent, setFormaPagoCurrent] = useState({});
	const [montoCurrent, setMontoCurrent] = useState(0.0);
	const [totalMonto, setTotalMonto] = useState(0.0);
	const [numeroOperacion, setNumeroOperacion] = useState('');
	const [valTipoMoneda, setValTipoMoneda] = useState('1');
	const [loadingDataInitial, setLoadingDataInitial] = useState(true);
	const [secCompPago, setSecCompPago] = useState('');
	const dataInitFetch = {
		codGrupoCia: '001',
		codLocal: '001',
	};

	const [listaCajaEspecialidad, setListaCajaEspecialidad] = useState([{}]);
	const [listaCajaDetEspecialidad, setListaCajaDetEspecialidad] = useState([{}]);
	const [formasPagoSinConvenio, setFormasPagoSinConvenio] = useState([{}]);
	const [listaTipoMoneda, setListaTipoMoneda] = useState([]);

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
		setLoadingDataInitial(true);
		// await procesaPedidoEspecialidad(); // Llamado al final del grabado de pedido
		await getTiposMoneda();
		await cargaListaCajaDetEspecialidad();
		await getFormasPagoSinConvenio();
		await cargaListaCajaEspecialidad();
		setLoadingDataInitial(false);
	};

	const handleCobrarPedido = async () => {
		setLoadingCobrar(true);

		const stockValido = await validarStockPedido();

		if (stockValido === 'S') {
			await grabarInicioFinCobro('I');

			// Validar si la caja de usuario esta acorde a la fecha
			const isFechaValida = await getFechaMovCaja();

			if (!isFechaValida) {
				showModalInfo(
					'Ud ha esperado mucho tiempo, ya es un NUEVO DIA, vuelva a abrir una NUEVA CAJA.',
					async () => {
						await anularPedidoPendiente();
						clearDataAll();
					}
				);
				setLoadingCobrar(false);
				return;
			}

			// Si pedido mayor a 1 o menor a 1 no pasa si es 1 PASA
			const infoPedidoCurrrent = await obtenerInfoPedido();
			if (infoPedidoCurrrent.length < 1) {
				showModalInfo('El Pedido No existe o No se encuentra pendiente de pago', async () => {
					clearDataAll();
				});
				setLoadingCobrar(false);
				return;
			} else if (infoPedidoCurrrent.length > 1) {
				showModalInfo(
					'Se encontro mas de un pedido.\n Ponganse en contacto con el area de Sistemas.',
					async () => {
						clearDataAll();
					}
				);
				setLoadingCobrar(false);
				return;
			}

			/**
			 * SI EL ESTADO DEL PEDIDO ES C -> MENSAJE PEDIDO COBRADO
			 * SI EL ESTADO DEL PEDIDO ES N -> MENSAJE PEDIDO ANULADO
			 * SI EL ESTADO DEL PEDIDO ES S -> MENSAJE PEDIDO PENDIENTE DE IMPRESION
			 * SI EL ESTADO DEL PEDIDO ES P -> PASAR AL SIGUIENTE FLUJO
			 */
			// Verificar el estado del pedido
			const estadoPedido = await verificaEstadoPedido();

			if (estadoPedido === 'P') {
				// Validar las formas de pago que existan
				const formasPago = await getFormasPagoSinConvenio();
				for (const item of dataMontos) {
					const formaValid = formasPago.find(x => x.key === item.key);
					if (!formaValid) {
						console.log('No paso la validacion de', item.key);
						setLoadingCobrar(false);
						return;
					}
				}

				// Valida monto ingresado que no sea letra o que no se a 0
				const montoValidado = validarMontoTotal();

				if (!montoValidado) return;

        let formaPagoInvalidate = false;
				for (const item of dataMontos) {
					await cajGrabNewFormPagoPedido(item);
					const validar = await cajFVerificaPedForPag();
					if (validar === 'ERROR') {
						openNotification(
							'Error',
							'El pedido no puede ser cobrado.\n Los totales de formas de pago y cabecera no coinciden. \n Comuníquese con el Operador de Sistemas inmediatamente.\n NO CIERRE LA VENTANA.',
							'Alerta'
						);
						setLoadingCobrar(false);
						formaPagoInvalidate = false;
					}
				}

        if (formaPagoInvalidate) return;

        // // Valida caja abierta
				// const isCajaAbierta = await getFechaMovCaja();
				// if (!isCajaAbierta) {
				//   showModalInfo('La fecha de apertura y la fecha del sistema no concuerdan, ABRA UNA NUEVO DIA', async () => {
				//     await anularPedidoPendiente();
				//     clearDataAll();
				//   })
				//   return;
				// }

				// Actualiza los datos del pedido para el cliente
				await actualizaCliPedido();

				// Graba el pedido
				const response = await cajCobraPedido();

				if (response.trim() === 'EXITO') {
					await grabarInicioFinCobro('F');

					await actualizaEstadoPedido();
					await obtieneNumCompPagoImpr();
					await setDatosCompElectronico();
					await asignarHoraSugerida();
					openNotification('Cobro de pedido', 'Se realizó con éxito el cobro');
					setVisibleModalSeleccion(true);
				}
			} else if (estadoPedido === 'C') {
				showModalInfo('Pedido ya cobrado', setLoadingCobrar(false));
				return;
			} else if (estadoPedido === 'N') {
				showModalInfo('Pedido ya anulado', setLoadingCobrar(false));
				return;
			} else if (estadoPedido === 'S') {
				showModalInfo('Pedido pendiente de impresión', setLoadingCobrar(false));
				return;
			}
		} else {
			openNotification(
				'Error',
				'Porque no hay stock suficiente para poder generarlo, Existe un Problema en la fracción de producto',
				'Alerta'
			);
		}
		setLoadingCobrar(false);
	};

	const validarMontoTotal = () => {
		if (String(totalMonto).length == 0 || totalMonto <= 0 || String(totalMonto).trim() === '') {
			openNotification('Monto', 'Ingrese un monto valido', 'warning');
			setDataMontos([]);
			return false;
		} else return true;
	};

	const showModalInfo = (message, callback) => {
		info({
			title: 'Mensaje del Sistema',
			width: 500,
			content: message,
			centered: true,
			okText: 'Aceptar',
			onOk: async () => {
				await callback();
				setLoadingCobrar(false);
			},
			okButtonProps: {
				style: {
					background: '#0169aa',
					color: '#fff',
				},
			},
		});
	};

	const grabarInicioFinCobro = async tipoTmp => {
		try {
			const {
				data: { success, message },
			} = await httpClient.post('posventa/grabaInicioFinCobro', {
				...dataInitFetch,
				numPedido: dataCabeceraPed.cNumPedVta_in,
				tipoTmp,
			});
			if (success) {
			}
			console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const obtieneNumCompPagoImpr = async () => {
		try {
			const respuesta = await infoDetalleAgrupacion();

			for (const item of respuesta) {
				setSecCompPago(item.SEC_COMP_PAGO);
				const {
					data: { data, success, message },
				} = await httpClient.post('posventa/obtieneNumCompPagoImpr', {
					...dataInitFetch,
					numPed: dataCabeceraPed.cNumPedVta_in,
					secCompPago: item.SEC_COMP_PAGO,
					secImprLocal: tipoVenta === '01' ? '7' : '9',
				});
				if (success) {
					// return data;
				}
				console.log(message);
			}
		} catch (e) {
			console.error(e);
		}
	};

	const actualizaEstadoPedido = async () => {
		try {
			const {
				data: { success, message },
			} = await httpClient.post('posventa/actualizaEstadoPedido', {
				...dataInitFetch,
				numPedVta: dataCabeceraPed.cNumPedVta_in,
				estPedVta: 'C',
				usuModPedVtaCab: user.usu_mod_usu_local,
			});
			if (success) {
			}
			console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const infoDetalleAgrupacion = async () => {
		try {
			const {
				data: { data, success, message },
			} = await httpClient.post('posventa/infoDetalleAgrupacion', {
				...dataInitFetch,
				numPedVta: dataCabeceraPed.cNumPedVta_in,
			});
			if (success) {
				return data;
			}
			console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const setDatosCompElectronico = async () => {
		try {
			const {
				data: { success, message },
			} = await httpClient.post('posventa/setDatosCompElectronico', {
				...dataInitFetch,
				cNumPedVta_in: dataCabeceraPed.cNumPedVta_in,
			});
			if (success) {
			}
			console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const asignarHoraSugerida = async () => {
		try {
			const {
				data: { success, message },
			} = await httpClient.post('posventa/asignarHoraSugerida', {
				...dataInitFetch,
				cNumPedVta_in: dataCabeceraPed.cNumPedVta_in,
			});
			if (success) {
			}
			console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const actualizaCliPedido = async () => {
		try {
			const {
				data: { success, message },
			} = await httpClient.post('posventa/actualizaCliPedido', {
				...dataInitFetch,
				cNumPedVta_in: dataCabeceraPed.cNumPedVta_in,
				cCodCliLocal_in: clienteCurrent.COD_CLI,
				cNomCliPed_in: clienteCurrent.CLIENTE,
				cDirCliLocal_in: clienteCurrent.DIRECCION,
				cRucCliPed_in: clienteCurrent.NUM_DOCUMENTO,
				cUsuModPedVtaCab_in: user.login_usu,
			});
			if (success) {
			}
			console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const anularPedidoPendiente = async () => {
		try {
			const {
				data: { success, message },
			} = await httpClient.post('posventa/anulaPedidoPendiente', {
				...dataInitFetch,
				cNumPedVta: dataCabeceraPed.cNumPedVta_in,
				vIdUsu_in: '',
				cModulo_in: '',
			});
			if (success) {
			}
			console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const obtenerInfoPedido = async () => {
		try {
			const {
				data: { success, message, data },
			} = await httpClient.post('posventa/obtenerInfoPedido', {
				...dataInitFetch,
				cNumPedDiario_in: dataCabeceraPed.cNumPedDiario_in,
				cFecPedVta_in: '',
			});
			if (success) {
				return data;
			}
			console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const clearDataAll = () => {
		setVisible(false);
		setVisibleModalSeleccion(false);
		clearDataFinallyMain();
	};

	// const validaSiFacturaElectronica = async () => {
	// 	try {
	// 		const {
	// 			data: { success, message, data },
	// 		} = await httpClient.post('posventa/validaSiFacturaElectronica', {
	// 			...dataInitFetch,
	// 		});
	// 		if (success) {
	// 			console.log(message);
	// 			return data;
	// 		}
	// 	} catch (e) {
	// 		console.error(e);
	// 	}
	// };

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

	// const procesaPedidoEspecialidad = async () => {
	// 	try {
	// 		const {
	// 			data: { success, message },
	// 		} = await httpClient.post('/posventa/procesaPedidoEspecialidad', {
	// 			...dataFetch,
	// 			cNumPedVta_in,
	// 		});
	// 		if (success) console.log(message);
	// 	} catch (e) {
	// 		console.error(e);
	// 	}
	// };

	const cargaListaCajaEspecialidad = async () => {
		try {
			const {
				data: { data, success, message },
			} = await httpClient.post('/posventa/cargaListaCajaEspecialidad', {
				...dataFetch,
				cNumPedVta_in,
			});
			if (success)
				setListaCajaEspecialidad(
					data.map((item, index) => {
						return {
							...item,
							key: index,
						};
					})
				);
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
				secMovCaja: await getSecuenciaMovCaja(),
				codNumera: COD_NUMERA_SEC_COMP_PAGO,
				tipCompPago: tipoVenta,
				codMotKardex: MOT_KARDEX_VENTA_NORMAL,
				tipDocKardex: '01',
				codNumeraKardex: COD_NUMERA_SEC_KARDEX,
				usuCreaCompPago: user.usu_mod_usu_local,
				// descDetalleForPago: 'Codigo , Descripcion , Moneda , Monto , Total , Vuelto <BR>00001 , EFECTIVO SOLES , SOLES , 90.00 , 90.00 , 0.00<BR>'
				descDetalleForPago: '',
				permiteCampana: 'N',
				dni: dataCabeceraPed.cRucCliPedVta_in,
				numCompPagoImpr: '',
			});
			if (success) return data;
			else openNotification('Caj cobra pedido', message);
			console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const getSecuenciaMovCaja = async () => {
		try {
			const {
				data: { data, success, message },
			} = await httpClient.post('/posventa/getSecuenciaMovCaja', {
				...dataInitFetch,
				numCajaPago: await getCajaDispoUsuario(),
			});
			if (success) return data;
			else console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const getCajaDispoUsuario = async () => {
		try {
			const {
				data: { data, success, message },
			} = await httpClient.post('/posventa/getCajaDispoUsuario', {
				...dataInitFetch,
				secUsu: user.sec_usu_local,
			});
			if (success) return data;
			else console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const cajGrabNewFormPagoPedido = async item => {
		try {
			const {
				data: { data, success, message },
			} = await httpClient.post('/posventa/cajGrabNewFormPagoPedido', {
				...dataInitFetch,
				codFormaPago: item.key,
				numPedido: cNumPedVta_in,
				imPago:
					item.key !== '00001'
						? item.monto
						: item.monto - (totalMonto - Number(dataCabeceraPed.nValNetoPedVta_in)).toFixed(2),
				tipMoneda: '01',
				valTipCambio: dataCabeceraPed.nValTipCambioPedVta_in,
				valVuelto:
					item.key === '00001'
						? (totalMonto - Number(dataCabeceraPed.nValNetoPedVta_in)).toFixed(2)
						: 0,
				imTotalPago: item.monto,
				numTarj: '',
				fecVencTarj: '',
				nomTarj: '',
				canCupon: '0',
				usuCreaFormaPagoPed: user.usu_mod_usu_local,
				dni: '',
				codAtori: '',
				lote: '.',
				numOperacion: '.',
				secFormaPago: '1',
			});
			if (success) return data;
			else console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const cajFVerificaPedForPag = async () => {
		try {
			const {
				data: { data, success, message },
			} = await httpClient.post('/posventa/cajFVerificaPedForPag', {
				...dataFetch,
				cNumPedVta: cNumPedVta_in,
			});
			if (success) return data;
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
			if (success) {
				setFormasPagoSinConvenio(data);
				return data;
			} else console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const getTiposMoneda = async () => {
		try {
			const {
				data: { data, success, message },
			} = await httpClient.get('/posventa/getTiposMoneda');
			if (success) {
				setListaTipoMoneda(data);
			} else console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const columnsEspecialidad = [
		{
			title: 'Especialidad',
			dataIndex: 'NOM_LAB',
			key: 'NOM_LAB',
		},
		{
			title: '.',
			dataIndex: 'EST_PED_VTA',
			key: 'EST_PED_VTA',
		},
		{
			title: 'Total',
			dataIndex: 'VAL_NETO_PED_VTA',
			key: 'VAL_NETO_PED_VTA',
			align: 'right',
			render: VAL_NETO_PED_VTA => <span>S/. {VAL_NETO_PED_VTA}</span>,
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
			render: monto => <span>{monto && `S/. ${monto}`}</span>,
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
			dataIndex: 'cod_prod',
			key: 'cod_prod',
		},
		{
			title: 'Descripción',
			dataIndex: 'desc_prod',
			key: 'desc_prod',
		},
		{
			title: 'Pre. Vta.',
			dataIndex: 'val_prec_vta',
			key: 'val_prec_vta',
			align: 'right',
			render: val_prec_vta => <span>S/. {val_prec_vta}</span>,
		},
		{
			title: 'Cantidad',
			dataIndex: 'cant_atendida',
			key: 'cant_atendida',
			align: 'right',
		},
		{
			title: 'Total',
			dataIndex: 'val_prec_total',
			key: 'val_prec_total',
			align: 'right',
			render: val_prec_total => <span>S/. {val_prec_total}</span>,
		},
	];

	return (
		<>
			<Modal
				visible={visible}
				// onCancel={() => setVisible(false)}
				closable={false}
				centered
				title="Cobrar Pedido"
				className="modal-posventa"
				width={1100}
				footer={[
          <Button
            onClick={() => {
              confirm({
                content:
                  '¿Esta seguro de retirar los métodos de pago ingresados en el cobro ?',
                okText: 'Aceptar',
                cancelText: 'Cancelar',
                centered: true,
                onOk: () => {
                  setDataMontos([]);
                },
                onCancel: () => {},
              });
            }}
            disabled={dataMontos.length === 0 || cNumPedVta_in.trim() === ''}
          >
            Limpiar
          </Button>,
          <Button
            style={{ backgroundColor: '#0169aa', color: 'white' }}
            disabled={totalMonto - Number(dataCabeceraPed.nValNetoPedVta_in) < 0}
            loading={loadingCobrar}
            onClick={handleCobrarPedido}
          >
            Aceptar
          </Button>
        ]}
			>
				<Row style={{ marginTop: 0, marginLeft: 0, marginRight: 0 }}>
					<Col xl={8} lg={8} md={24} sm={24} xs={24} style={{ marginBottom: 10 }}>
						<Table
							columns={columnsEspecialidad}
							dataSource={listaCajaEspecialidad}
							pagination={false}
							size="small"
							bordered
						/>
					</Col>
					<Col xl={16} lg={16} md={24} sm={24} xs={24}>
						<Table
							columns={columnsProductos}
							dataSource={listaCajaDetEspecialidad}
							// pagination={false}
							size="small"
							bordered
							pagination={{
								pageSize: 1,
							}}
						/>
					</Col>
				</Row>
				<Row style={{ background: '#0169aa', margin: 0 }} justify="center">
					<Col span={20} style={{ color: '#0169aa', height: 1 }}></Col>
				</Row>
				<Row style={{ marginLeft: 0, marginRight: 0, marginTop: 5 }}>
					<Col xl={11} lg={10} md={9} sm={24} xs={24}>
						<Row>
							<Col span={6}>
								<Button
									block
									onClick={() => setVisibleModalMedicos(true)}
									style={{ display: 'block', height: 'auto', padding: 10, margin: 0, marginBottom: 3 }}
								>
									<img src={Doctor} />
								</Button>
							</Col>
              <Col span={18} style={{padding:0}}>
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
									style={{ display: 'block', height: 'auto', padding: 10, margin:0 }}
								>
									<img src={Paciente} />
								</Button>
							</Col>
							<Col span={18} style={{padding:0}}>
								<h5>Datos de Paciente</h5>
								<Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
									<Row>
                    <Col span={11} style={{padding:0}}>
                      <Form.Item label="DNI" style={{ margin: 0 }}>
                        <Input disabled size="small" value={pacienteCurrent.NUM_DOCUMENTO} />
                      </Form.Item>
                    </Col>
                    <Col span={13} style={{paddingLeft:0}}>
                      <Form.Item label="Nacimiento" style={{ margin: 0 }}>
                        <Input disabled size="small" value={pacienteCurrent.FEC_NAC_CLI} />
                      </Form.Item>
                    </Col>
                  </Row>
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
						<Row justify="center" style={{ marginTop: 10, marginBottom: 10 }}>
							<Col>
								<Radio.Group value={tipoVenta} onChange={e => setTipoVenta(e.target.value)}>
									<Space direction="horizontal">
										<Radio disabled value="05">
											Ticket
										</Radio>
										<Radio value="01">Boleta</Radio>
										<Radio value="02">Factura</Radio>
									</Space>
								</Radio.Group>
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
					<Col xl={13} lg={14} md={15} sm={24} xs={24}>
						<Row style={{ marginBottom: 2 }}>
							<Descriptions className="description-boleta">
								<Descriptions.Item span={1} label="BOLETA"></Descriptions.Item>
								<Descriptions.Item span={1} label={clienteCurrent.TIP_DOCUMENTO === '01' ? 'DNI' : 'RUC'}>
									{dataCabeceraPed.cRucCliPedVta_in}
								</Descriptions.Item>
                <Descriptions.Item span={1} label='Tipo de cambio S/'>
                  {dataCabeceraPed.nValTipCambioPedVta_in}
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
										dataCabeceraPed.nValNetoPedVta_in / dataCabeceraPed.nValTipCambioPedVta_in
									).toFixed(2)}
								</Descriptions.Item>
							</Descriptions>
						</Row>
						<Row>
							<Col span={8} style={{ padding: 0, paddingRight: 10 }}>
                {/*<Row className="div-tipo-cambio">*/}
                {/*  <Col span={12}>Formas de Pago</Col>*/}
                {/*</Row>*/}
								<List
									size="small"
									bordered
									style={{ overflowY: 'auto', margin: 0 }}
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
								<Form size='small'>
									<Row style={{ marginTop: 10 }}>
										<Col span={10} style={{ marginRight: 10 }}>
											<Form.Item label="Moneda">
												<Select value={valTipoMoneda}>
													{listaTipoMoneda.map(item => (
														<Select.Option key={item.cod_moneda} value={item.cod_moneda}>
															{item.des_moneda}
														</Select.Option>
													))}
												</Select>
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
                          size='middle'
													onClick={() => {
														setDataMontos(oldData => {
															let existe = false;
															oldData.forEach(item => {
																if (item.key === formaPagoCurrent.key) {
																	item.monto = parseInt(item.monto) + parseInt(montoCurrent);
																	existe = true;
																}
															});

															if (!existe) {
																const temp = {
																	monto: montoCurrent,
																	forma: formaPagoCurrent.DESC_CORTA_FORMA_PAGO,
																	key: formaPagoCurrent.key,
																	opera: numeroOperacion,
																};
																return [...oldData, temp];
															}
															return [...oldData];
														});
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
									dataSource={dataMontos.length === 0 ? [{}] : dataMontos}
                  scroll={{
                    y: 95
                  }}
								/>
							</Col>
							<Col span={10} style={{ marginBottom: 20 }}>
								<Descriptions className="total-pagar-desc" style={{ height:145 }}>
									<Descriptions.Item span={3} label="TOTAL A PAGAR S/.">
										{Number(dataCabeceraPed.nValNetoPedVta_in).toFixed(2)}
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
									{/*<Button>% Descuento</Button>*/}

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
			{visibleModalPacientes ? (
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
			{loadingCobrar || loadingDataInitial ? <ModalLoading></ModalLoading> : null}
			{visibleModalComprobante ? (
				<ModalComprobante
					visible={visibleModalComprobante}
					setVisible={setVisibleModalComprobante}
					numPedVta={cNumPedVta_in}
					secCompPago={secCompPago}
					clienteCurrent={clienteCurrent}
					tipoVenta={tipoVenta}
				></ModalComprobante>
			) : null}

			{visibleModalSeleccion && (
				<ModalSeleccionImpresion
					tipoVenta={tipoVenta}
					visibleModalSeleccion={visibleModalSeleccion}
					setVisibleModalComprobante={setVisibleModalComprobante}
					clearDataAll={clearDataAll}
					setVisibleModalOrdenes={setVisibleModalOrdenes}
					visibleModalOrdenes={visibleModalOrdenes}
					user={user}
					pacienteCurrent={pacienteCurrent}
					secCompPago={secCompPago}
					clienteCurrent={clienteCurrent}
					medicoCurrent={medicoCurrent}
					cNumPedVta_in={cNumPedVta_in}
				/>
			)}
		</>
	);
}

const ModalSeleccionImpresion = ({
	visibleModalSeleccion,
	clearDataAll,
	tipoVenta,
	setVisibleModalOrdenes,
	visibleModalOrdenes,
	user,
	pacienteCurrent,
	secCompPago,
	clienteCurrent,
	medicoCurrent,
	cNumPedVta_in,
	setVisibleModalComprobante,
}) => {
	const { confirm } = Modal;
	const [visibleModalComprobanteMenu, setVisibleModalComprobanteMenu] = useState(false);

	return (
		<>
			<Modal
				centered
				closable={false}
				visible={visibleModalSeleccion}
				title="Impresión"
				footer={[
					<Button
						onClick={() => {
							confirm({
								content: '¿Quiere salir? Asegurese de haber impreso sus comprobantes.',
								okText: 'Salir',
								cancelText: 'Cancelar',
								onOk: () => {
									clearDataAll();
								},
								centered: true,
							});
						}}
					>
						Salir
					</Button>,
				]}
			>
				<Row justify="space-between">
					<Col span={11}>
						<Button onClick={() => setVisibleModalComprobanteMenu(true)} block>
							{tipoVenta === '01' ? 'Boleta' : 'Factura'} electrónica
						</Button>
					</Col>
					<Col span={11}>
						<Button onClick={() => setVisibleModalOrdenes(true)} block>
							Ticket de atención
						</Button>
					</Col>
				</Row>
			</Modal>

			{visibleModalOrdenes && (
				<ModalOrdenes
					visible={visibleModalOrdenes}
					setVisible={setVisibleModalOrdenes}
					user={user}
					pacienteCurrent={pacienteCurrent}
					secCompPago={secCompPago}
					clienteCurrent={clienteCurrent}
					medicoCurrent={medicoCurrent}
					cNumPedVta_in={cNumPedVta_in}
				/>
			)}

			{visibleModalComprobanteMenu && (
				<ModalComprobanteMenu
					setVisible={setVisibleModalComprobanteMenu}
					cNumPedVta_in={cNumPedVta_in}
					visible={visibleModalComprobanteMenu}
					setVisibleModalComprobante={setVisibleModalComprobante}
				></ModalComprobanteMenu>
			)}
		</>
	);
};

const ModalComprobanteMenu = ({
	visible,
	setVisible,
	setVisibleModalComprobante,
	cNumPedVta_in,
}) => {
	const [loadingData, setLoadingData] = useState(false);

	async function modifyPdf(url, detalles) {
		const nombre = url.split('/');
    console.log(nombre);
		const existingPdfBytes = await fetch(
			baseUrl + '/posventa/downloadComprobante?nombreArchivo=' + nombre[nombre.length - 1]
		).then(res => res.arrayBuffer());

		const pdfDoc = await PDFDocument.load(existingPdfBytes);
		const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
		const fontSize = 8;

		const pages = pdfDoc.getPages();
		const firstPage = pages[0];
		// const { width, height } = firstPage.getSize();
		let inicio = 590;

		detalles.forEach((item, index) => {
			let tam = 15;

			if (item[3].length > 49) {
				tam = 25;
			}

			const text = item[0];
			const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
			const text1 = item[1];
			const textWidth1 = helveticaFont.widthOfTextAtSize(text, fontSize);
			const text2 = item[2];
			const textWidth2 = helveticaFont.widthOfTextAtSize(text, fontSize);
			const text3 = item[3];
			const textWidth3 = helveticaFont.widthOfTextAtSize(text, fontSize);
			const text4 = item[4];
			const textWidth4 = helveticaFont.widthOfTextAtSize(text, fontSize);
			const text5 = item[5];
			const textWidth5 = helveticaFont.widthOfTextAtSize(text, fontSize);

			firstPage.drawText(text, {
				x: 25 + 19 - textWidth,
				y: inicio,
				size: fontSize,
				font: helveticaFont,
				color: rgb(0, 0, 0),
				maxWidth: 19,
				lineHeight: 10,
			});

			firstPage.drawText(text1, {
				x: 70 + 19 - textWidth1,
				y: inicio,
				size: fontSize,
				font: helveticaFont,
				color: rgb(0, 0, 0),
				maxWidth: 19,
				lineHeight: 10,
			});

			firstPage.drawText(text2, {
				x: 125 + 19 - textWidth2,
				y: inicio,
				size: fontSize,
				font: helveticaFont,
				color: rgb(0, 0, 0),
				maxWidth: 19,
				lineHeight: 10,
			});

			firstPage.drawText(text3, {
				x: 190,
				y: inicio,
				size: fontSize,
				font: helveticaFont,
				color: rgb(0, 0, 0),
				maxWidth: 220,
				lineHeight: 10,
			});

			firstPage.drawText(text4, {
				x: 460 + 19 - textWidth4,
				y: inicio,
				size: fontSize,
				font: helveticaFont,
				color: rgb(0, 0, 0),
				maxWidth: 19,
				lineHeight: 10,
			});

			firstPage.drawText(text5, {
				x: 512 + 19 - textWidth5,
				y: inicio,
				size: fontSize,
				font: helveticaFont,
				color: rgb(0, 0, 0),
				maxWidth: 19,
				lineHeight: 10,
			});

			inicio = inicio - tam;
		});

		const pdfBytes = await pdfDoc.save();
		const blob = new Blob([pdfBytes], { type: 'application/pdf' });

		// DESCARGAR EL PDF
		// const u = URL.createObjectURL(blob);
		// const link = document.createElement('a');
		// link.href = u;
		// link.download = 'test.pdf';
		// link.click();

		const data = new FormData();

		data.append('nombreComprobante', nombre[nombre.length - 1]);
		data.append('pdf', blob);

		await httpClient.post('/posventa/subirComprobante', data);

		window.open(url, '_blank');
	}

	const generarComprobante = async () => {
		setLoadingData(true);
		const response = await httpClient.post('/posventa/generarReporte', {
			codGrupoCia: '001',
			codLocal: '001',
			numPedVta: cNumPedVta_in,
		});

		const detalles = await httpClient.post('/posventa/impDetalle', {
			codGrupoCia: '001',
			codLocal: '001',
			numPedVta: cNumPedVta_in,
		});

		console.log(response.data.data);
		await modifyPdf(baseUrlImage + '/documentos/' + response.data.data, detalles.data.data);
		setLoadingData(false);
	};

	return (
		<Modal
			centered
			closable={false}
			visible={visible}
			title="Comprobantes"
			onCancel={() => {
				if (!loadingData) setVisible(false);
			}}
			footer={[
				<Button disabled={loadingData} onClick={() => setVisible(false)}>
					Salir
				</Button>,
			]}
		>
			<Row justify="space-between">
				<Col span={12}>
					<Button
						onClick={() => {
							generarComprobante();
						}}
						block
					>
						Formato A4
					</Button>
				</Col>
				<Col span={12}>
					<Button
						onClick={() => {
							setVisibleModalComprobante(true);
						}}
						block
					>
						Formato Ticket
					</Button>
				</Col>
			</Row>
			{loadingData ? <ModalLoading></ModalLoading> : null}
		</Modal>
	);
};

const ModalOrdenes = ({
	visible,
	setVisible,
	cNumPedVta_in,
	user,
	pacienteCurrent,
	secCompPago,
	clienteCurrent,
	medicoCurrent,
}) => {
	const [numOrdenes, setNumOrdenes] = useState([]);
	const [numOrdenCurrent, setNumOrdenCurrent] = useState();
	const [visibleModal, setVisibleModal] = useState(false);
	const [loadingData, setLoadintData] = useState(false);

	const getnumOrdenVta = async () => {
		setLoadintData(true);
		try {
			const {
				data: { success, message, data },
			} = await httpClient.post('posventa/getnumOrdenVta', {
				codGrupoCia: '001',
				codLocal: '001',
				numPedVta: cNumPedVta_in,
			});
			if (success) setNumOrdenes(data);
			console.log(message);
		} catch (e) {
			console.error(e);
		}
		setLoadintData(false);
	};

	useEffect(() => {
		getnumOrdenVta();
	}, []);

	return (
		<>
			<Modal
				centered
				closable={false}
				visible={visible}
				title="Tickets de atención"
				onCancel={() => {
					if (!loadingData) setVisible(false);
				}}
				footer={[
					<Button disabled={loadingData} onClick={() => setVisible(false)}>
						Salir
					</Button>,
				]}
			>
				<Row justify="space-between">
					{numOrdenes.map(item => (
						<>
							<Col span={12} key={item.NUM_ORDEN_VTA}>
								<Button
									onClick={() => {
										setNumOrdenCurrent(item.NUM_ORDEN_VTA);
										setVisibleModal(true);
									}}
									block
								>
									Orden # {item.NUM_ORDEN_VTA}
								</Button>
							</Col>
						</>
					))}
				</Row>

				{visibleModal ? (
					<ModalTicket
						numOrdenVta={numOrdenCurrent}
						visible={visibleModal}
						setVisible={setVisibleModal}
						numPedVta={cNumPedVta_in}
						secCompPago={secCompPago}
						clienteCurrent={clienteCurrent}
						medicoCurrent={medicoCurrent}
						pacienteCurrent={pacienteCurrent}
						user={user}
					/>
				) : null}
			</Modal>
		</>
	);
};

export default ModalCobrarPedido;
