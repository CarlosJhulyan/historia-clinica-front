import React, { useEffect, useState } from 'react';
import { Card, Form, AutoComplete, Button, Table, Divider, Row, Modal, Descriptions, Col, Input } from 'antd';
import moment from 'moment';
import ModalListaProductos from './modalListas/modalListaProductos';
import { httpClient } from '../../util/Api';
import ModalDatosPedido from './modals/modalDatosPedido';
import ModalCobrarPedido from './modals/modalCobrarPedido';
import { openNotification } from '../../util/util';
import { useAuth } from '../../authentication';
import DecimalFormat from 'decimal-format';
import ModalSeleccionProducto from './modals/modalSeleccionProducto';

function GenerarPedido() {
	const { info } = Modal;
	const [modal, contextHolder] = Modal.useModal();
	const [visibleModal, setVisibleModal] = useState(false);
	const [disabledAll, setDisabledAll] = useState(true);
	const [loadingData, setLoadingData] = useState(true);
	const token = JSON.parse(localStorage.getItem('token'));
	const [data, setData] = useState([]);
  const [dataFiltered, setDataFiltered] = useState([]);
	const [visibleModalDatosPedido, setVisibleModalDatosPedido] = useState(false);
	const [visibleModalCobrarPedido, setVisibleModalCobrarPedido] = useState(false);
  const [visibleModalCambiarCantidad, setVisibleModalCambiarCantidad] = useState(false);
	const [loadingGrabarPedido, setLoadingGrabarPedido] = useState(false);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [selectedRows, setSelectedRows] = useState([]);
	const [productosDetalles, setProductosDetalles] = useState([]);
	const [productosCurrent, setProductosCurrent] = useState([]);
  const [textSearch, setTextSearch] = useState('');
	const [cNumPedVta_in, setCNumPedVta_in] = useState('');
	const [tipoVenta, setTipoVenta] = useState('01');
  const [ultimoPedidoDiario, setUltimoPedidoDiario] = useState('____');

	const {
		authUser: { data: user },
	} = useAuth();
	const { confirm } = Modal;
	const [numCaja, setNumCaja] = useState('');
	const [grabarPedido, setGrabarPedido] = useState(false);
	const [fechaSistema, setFechaSistema] = useState(false);

	const dataFetch = {
		codGrupoCia: '001',
		codLocal: '001',
	};

	const COD_NUMERA_PEDIDO = '007';
	const COD_NUMERA_PEDIDO_DIARIO = '009';
	const TIPO_PEDIDO_VENTA_MESON = '01';
	const TIPO_COMP_PEDIDO = '01';
	const TIPO_CONVENIO = 'N';
	const DISTRIBUCION_GRATUITA = 'N';
	const ESTADO_PEDIDO_PENDIENTE = 'P';
	const ESTADO_PEDIDO_DETALLE_ACTIVO = 'A';
	const VALOR_TIPO_CAMBIO = 3.34;
	const IND_PROD_SIMPLE = 1;
	const IND_PROD_PROM = 2;
	const RES_ORIG_PROD = 19;
	const RES_CANT_XDIA = 23;
	const RES_CANT_DIAS = 24;

	// ESTADOS DEL MODAL DATOS PEDIDOS
	const [pacienteCurrent, setPacienteCurrent] = useState({});
	const [medicoCurrent, setMedicoCurrent] = useState({});
	const [clienteCurrent, setClienteCurrent] = useState({});

	const df = new DecimalFormat('#,##0.0#');

	const [dataDetallesFinally, setDataDetallesFinally] = useState({
		total: 0,
		totalDolar: 0,
		items: 0,
		tipoCambio: 3.34,
	});

	const [dataFetchCabecera, setDataFetchCabecera] = useState({
		cCodGrupoCia_in: '001',
		cCodLocal_in: '001',
		cNumPedVta_in: '',
		cCodCliLocal_in: '',
		cSecMovCaja_in: '', // VACIO
		nValBrutoPedVta_in: '', // VACIO
		nValNetoPedVta_in: '',
		nValRedondeoPedVta_in: '',
		nValIgvPedVta_in: '',
		nValDctoPedVta_in: '', // VACIO
		cTipPedVta_in: TIPO_PEDIDO_VENTA_MESON,
		nValTipCambioPedVta_in: VALOR_TIPO_CAMBIO,
		cNumPedDiario_in: '',
		nCantItemsPedVta_in: 0,
		cEstPedVta_in: ESTADO_PEDIDO_PENDIENTE,
		cTipCompPago_in: TIPO_COMP_PEDIDO,
		cNomCliPedVta_in: '',
		cDirCliPedVta_in: '',
		cRucCliPedVta_in: '',
		cUsuCreaPedVtaCab_in: user.login_usu,
		cIndDistrGratuita_in: DISTRIBUCION_GRATUITA,
		cIndPedidoConvenio_in: TIPO_CONVENIO,
		cCodConvenio_in: '',
		cCodUsuLocal_in: user.sec_usu_local,
		cIndUsoEfectivo_in: '',
		cIndUsoTarjeta_in: '',
		cCodForma_Tarjeta_in: '',
		cColegioMedico_in: '',
		cCodCliente_in: '',
		cIndConvBTLMF: 'N',
		cCodSolicitud: '',
		cNumCmp: '',
		cNombreMedico: '',
		cRecetaCodCia: '',
		cRecetaCodLocal: '',
		cRecetaNumero: '',
		cIndSoat: '',
		cDNI_PACIENTE: '',
		cNumCmp_asociado: '',
		cNombreMedico_asociado: '',
		cCodPaciente: '',
		cIDRef: '',
		cDescRef: '',
		cNumCmp_visitador: '',
		cNombreMedico_visitador: '',
		cIndCotizacion: 'N',
		cIndReserva: 'N',
		cCodCiaReserva: 'N',
		cCodLocalReserva: 'N',
		cCodPedidoReserva: 'N',
    cIsWeb: 'S',
	});

	const dataFetchDetalle = {
		cCodGrupoCia_in: '001',
		cCodLocal_in: '001',
		cNumPedVta_in: '',
		nSecPedVtaDet_in: '',
		cCodProd_in: '',
		nCantAtendida_in: '',
		nValPrecVta_in: '',
		nValPrecTotal_in: '',
		nPorcDcto1_in: '',
		nPorcDcto2_in: '0.0',
		nPorcDcto3_in: '0.0',
		nPorcDctoTotal_in: '',
		cEstPedVtaDet_in: ESTADO_PEDIDO_DETALLE_ACTIVO,
		nValTotalBono_in: '',
		nValFrac_in: '',
		nSecCompPago_in: '',
		cSecUsuLocal_in: user.sec_usu_local,
		nValPrecLista_in: '',
		nValIgv_in: '',
		cUnidVta_in: '',
		cNumTelRecarga_in: '',
		cUsuCreaPedVtaDet_in: user.login_usu,
		nValPrecPub: '',
		cCodProm_in: '',
		cIndOrigen_in: '1', // RES_ORIG_PROD,
		nCantxDia_in: '', //RES_CANT_XDIA,
		nCantDias_in: '', //RES_CANT_DIAS,
		nAhorroPack: '',
		cSecResp_in: '',
		vNumLoteProd_in: '',
	};

	const guardarDatosPedidoCabecera = async () => {
		setLoadingGrabarPedido(true);
		try {
			const cajaAbierta = await getFechaMovCaja();
			if (!cajaAbierta) {
				console.log('No hay caja abierta');
			}
			console.log('caja abierta');
			const dataLocalCabecera = {
				...dataFetchCabecera,
			};
			// Cargando los numeros de pedido
			dataLocalCabecera.cNumPedVta_in = await getNuSecNumeracion('007', 10);
			dataLocalCabecera.cCodCliLocal_in = clienteCurrent.COD_CLI;
      dataLocalCabecera.cTipCompPago_in = tipoVenta;
			dataLocalCabecera.cNumPedDiario_in = await getNumeraPedidoDiario(false, false);
			dataLocalCabecera.cSecMovCaja_in = await obtenerMovApertura();
			// Valores de pedido
			// dataLocalCabecera.nValBrutoPedVta_in = 0.0;
			// dataLocalCabecera.nValNetoPedVta_in = dataDetallesFinally.total;
			// dataLocalCabecera.nValRedondeoPedVta_in = 0.0;
			// dataLocalCabecera.nValIgvPedVta_in = Number(dataDetallesFinally.total) * 0.18;
			// dataLocalCabecera.nValDctoPedVta_in = 0.0;
			dataLocalCabecera.nValBrutoPedVta_in = await getPrecioRedondeado(0.0);
			dataLocalCabecera.nValNetoPedVta_in = await getPrecioRedondeado(dataDetallesFinally.total);
			dataLocalCabecera.nValRedondeoPedVta_in = await getPrecioRedondeado(0.0);
			dataLocalCabecera.nValIgvPedVta_in = await getPrecioRedondeado(
				Number(dataDetallesFinally.total) * 0.18
			);
			dataLocalCabecera.nValDctoPedVta_in = await getPrecioRedondeado(0.0);
			dataLocalCabecera.nCantItemsPedVta_in = data.length;

			// Datos cliente
			dataLocalCabecera.cNomCliPedVta_in = clienteCurrent.CLIENTE;
			dataLocalCabecera.cDirCliPedVta_in = clienteCurrent.DIRECCION;
			dataLocalCabecera.cRucCliPedVta_in = clienteCurrent.NUM_DOCUMENTO;
			dataLocalCabecera.cCodCliente_in = '';

			// dataLocalCabecera.cColegioMedico_in = ''; //
			// dataLocalCabecera.cCodCliente_in = ''; //
			// dataLocalCabecera.cIndConvBTLMF = 'N';

			// Datos medico
			dataLocalCabecera.cNumCmp = medicoCurrent.CMP;
			dataLocalCabecera.cNombreMedico = medicoCurrent.NOMBRE_COMPLETO;

			dataLocalCabecera.cIndSoat = 'N';

			// DAtos paciente
			dataLocalCabecera.cDNI_PACIENTE = pacienteCurrent.NUM_DOCUMENTO;
			dataLocalCabecera.cCodPaciente = pacienteCurrent.COD_PACIENTE;

			// Datos de hospital
			dataLocalCabecera.cIDRef = medicoCurrent.TIP_REFERENCIA;
			dataLocalCabecera.cDescRef = medicoCurrent.DESC_REFERENCIA;

			await grabarPedidoFinally(dataLocalCabecera);
			setDataFetchCabecera(dataLocalCabecera);
			let index = 0;
			for (const item of data) {
				await guardarPedidoDetalle(item, index, IND_PROD_SIMPLE, dataLocalCabecera.cNumPedVta_in);
				index++;
			}

			//----------------------------------------------------
			await updateNumeracionSinComit(COD_NUMERA_PEDIDO);
			await updateNumeracionSinComit(COD_NUMERA_PEDIDO_DIARIO);
			// ---
			await validarValorVentaNeto(dataLocalCabecera.cNumPedVta_in);
			// --
			await procesaPedidoEspecialidad(dataLocalCabecera.cNumPedVta_in);
			setCNumPedVta_in(dataLocalCabecera.cNumPedVta_in);
			datosPedidoAceptar();
			setLoadingGrabarPedido(false);
		} catch (e) {
			console.error(e);
			setLoadingGrabarPedido(false);
		}
	};

	const updateNumeracionSinComit = async cod_numera => {
		try {
			const {
				data: { success, message },
			} = await httpClient.post('/posventa/updateNumeracionSinCommit', {
				...dataFetch,
				pCoNumeracion: cod_numera,
				vIdUsu: user.sec_usu_local,
			});
			if (success) console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const validarValorVentaNeto = async cNumPedVta_in => {
		try {
			const {
				data: { success, message },
			} = await httpClient.post('/posventa/validarValorVentaNeto', {
				...dataFetch,
				is_cotizacion: false,
				cNumPedVta_in,
			});
			if (success) console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const procesaPedidoEspecialidad = async cNumPedVta_in => {
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

	const guardarPedidoDetalle = async (item, pFila, tipo, cNumPedVta_in) => {
		const dataLocalDetalle = {
			...dataFetchDetalle,
		};
		dataLocalDetalle.cNumPedVta_in = cNumPedVta_in;
		dataLocalDetalle.nSecPedVtaDet_in = String(pFila + 1);
		dataLocalDetalle.cCodProd_in = item.CODIGO;
		dataLocalDetalle.nCantAtendida_in = item.cantidad;
		dataLocalDetalle.nValPrecTotal_in = item.total;
		dataLocalDetalle.nValPrecVta_in = df.format(item.PRECIO);

		dataLocalDetalle.nPorcDcto1_in = '0.0';
		dataLocalDetalle.nPorcDctoTotal_in = '0.0';
		dataLocalDetalle.nValTotalBono_in = '0';

		dataLocalDetalle.nValFrac_in = item.VAL_FRAC.trim();
		dataLocalDetalle.nValPrecLista_in = item.PRECIO_LISTA.trim();
		dataLocalDetalle.nValIgv_in = '18';
		dataLocalDetalle.cUnidVta_in = item.UNIDAD.trim();

		let posSevRespaldo = 0;
		if (tipo === IND_PROD_SIMPLE) posSevRespaldo = 26;
		else if (tipo === IND_PROD_PROM) posSevRespaldo = 24;

		dataLocalDetalle.nValPrecPub = df.format(item.PRECIO);
		dataLocalDetalle.cSecResp_in = posSevRespaldo;
		dataLocalDetalle.vNumLoteProd_in = 'S/L';

		console.log(dataLocalDetalle);
		await grabarPedidoDetalle(dataLocalDetalle);
	};

	const grabarPedidoDetalle = async data => {
		try {
			const {
				data: { success, message },
			} = await httpClient.post('posventa/grabarPedidoDetalle', data);
			if (success) console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const getNuSecNumeracion = async (pCoNumeracion, pLength) => {
		try {
			const {
				data: { data, success },
			} = await httpClient.post('posventa/getNumeracion', {
				...dataFetch,
				codNumera: pCoNumeracion,
			});
			if (success) {
				return completeWithSymbol(data, pLength, '0', 'I');
			} else {
				console.log('Error al obtener numeracion');
			}
		} catch (e) {
			console.error(e);
		}
	};

	const grabarPedidoFinally = async dataABC => {
		try {
			const {
				data: { data, success, message },
			} = await httpClient.post('/posventa/grabarPedidoCabecera', dataABC);
			if (success) {
				console.log(data);
				openNotification('Cabecera', 'Pedido grabado');
			} else {
				openNotification('Cabecera', message, 'warning');
			}
			console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const getPrecioRedondeado = async valorPrecio => {
		try {
			const {
				data: { data, success },
			} = await httpClient.post('posventa/getPrecioRedondeado', {
				valorPrecio,
			});
			return data;
		} catch (e) {
			console.error(e);
		}
	};

	const obtenerMovApertura = async () => {
		try {
			const {
				data: { data, success: successMov },
			} = await httpClient.post('posventa/getMovApertura', {
				...dataFetch,
				numCaja,
			});
			if (successMov) {
				return data;
			} else return null;
		} catch (e) {
			console.error('Error al obtener movimientos apertura', e);
		}
	};

	const getFechaModPedido = async (cotiza, reserva) => {
		const COD_NUMERA_COTIZA_DIARIO = '088';
		const COD_NUMERA_RESERVA_DIARIO = '090';

		try {
			const {
				data: { data, success, message },
			} = await httpClient.post('posventa/getFechaModNumeraPed', {
				...dataFetch,
				codNumera: cotiza
					? COD_NUMERA_COTIZA_DIARIO
					: reserva
					? COD_NUMERA_RESERVA_DIARIO
					: COD_NUMERA_PEDIDO_DIARIO,
			});
			if (success) return data;
			else console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

  const getUltimoPedidoDiario = async () => {
    try {
      const {
        data: { success, data }
      } = await httpClient.post('posventa/getUltimoPedidoDiario', {
        ...dataFetch,
        secUsu: user.sec_usu_local
      });
      if (success) setUltimoPedidoDiario(data);
    } catch (e) {
      console.error(e);
    }
  }

	const completeWithSymbol = (pValue, pLength, pSymbol, pAlign) => {
		let tempString = pValue;
		const temp = pValue.length;
		for (let i = temp; i < pLength; ++i) {
			if (pAlign.trim().toUpperCase() === 'I') {
				tempString = pSymbol + tempString;
			} else {
				tempString += pSymbol;
			}
		}
		return tempString;
	};

	const inicializaNumeracionNoCommit = async pCoNumeracion => {
		try {
			const {
				data: { data, success },
			} = await httpClient.post('posventa/inicializaNumeracionSinCommit', {
				...dataFetch,
				pCoNumeracion,
				vIdUsu: user.sec_usu_local,
			});
			if (success) {
				return data;
			}
		} catch (e) {
			console.error(e);
		}
	};

	const getNumeraPedidoDiario = async (cotiza, reserva) => {
		const COD_NUMERA_COTIZA_DIARIO = '088';
		const COD_NUMERA_RESERVA_DIARIO = '090';

		let feModNumeracion = await getFechaModPedido(cotiza, reserva);
		let feHoyDia = fechaSistema;
		let numPedDiario = '';
		if (!(feModNumeracion.trim().length > 0)) {
			console.log('Ultima Fecha Modificacion de Numeración Diaria del Pedido NO ES VALIDA !!!');
		} else {
			feHoyDia = feHoyDia.trim().substring(0, 2);
			feModNumeracion = feModNumeracion.trim().substring(0, 2);
			if (parseInt(feHoyDia) !== parseInt(feModNumeracion)) {
				if (cotiza) {
					inicializaNumeracionNoCommit(COD_NUMERA_COTIZA_DIARIO);
				} else {
					if (reserva) {
						inicializaNumeracionNoCommit(COD_NUMERA_RESERVA_DIARIO);
					} else {
						inicializaNumeracionNoCommit(COD_NUMERA_PEDIDO_DIARIO);
					}
				}
				numPedDiario = '0001';
			} else {
				if (cotiza) {
					numPedDiario = await getNuSecNumeracion(COD_NUMERA_COTIZA_DIARIO, 4);
				} else {
					if (reserva) {
						numPedDiario = await getNuSecNumeracion(COD_NUMERA_RESERVA_DIARIO, 4);
					} else {
						numPedDiario = await getNuSecNumeracion(COD_NUMERA_PEDIDO_DIARIO, 4);
					}
				}
			}
		}
		return numPedDiario;
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
			width: '350px',
		},
		{
			title: 'Unidad',
			dataIndex: 'UNIDAD',
			key: 'UNIDAD',
		},
		{
			title: 'Precio',
			dataIndex: 'PRECIO',
			key: 'PRECIO',
			align: 'right',
		},
		{
			title: 'Cantidad',
			dataIndex: 'cantidad',
			key: 'cantidad',
			align: 'right',
		},
		{
			title: '%Dscto',
			dataIndex: 'descuento',
			key: 'descuento',
			align: 'right',
		},
		{
			title: 'Precio Venta',
			dataIndex: 'pu',
			key: 'pu',
			align: 'right',
      render: (pu) => <span>{Number(pu).toFixed(2)}</span>
		},
		{
			title: 'Total',
			dataIndex: 'total',
			key: 'total',
			align: 'right',
		},
	];

	const chargeDetailsModalProducto = (productos, detalles) => {
		const dataFinally = productos.map(product => {
			const abc = detalles.find(detail => detail.key === product.key);
			return {
				...product,
				...detalles.find(detail => detail.key === product.key),
				total: parseFloat(abc.total).toFixed(2),
			};
		});
		setData(dataFinally);
		const total = dataFinally.reduce((previus, current) => parseFloat(current.total) + previus, 0);
		setDataDetallesFinally({
			tipoCambio: 3.34,
			items: dataFinally.length,
			total,
			totalDolar: total / 3.34,
		});
	};

	const getFechaMovCaja = async () => {
		let respuesta;

		const codGrupoCia = '001';
		const codLocal = '001';
		setLoadingData(true);
		try {
			const {
				data: { success, data: result },
			} = await httpClient.post('posventa/getCajaDispoUsuario', {
				codGrupoCia,
				codLocal,
				secUsu: token.data.sec_usu_local,
			});
			if (success) {
				const {
					data: { success: successFechaMov, data: fechaMovCaja, message },
				} = await httpClient.post('posventa/getFechaMovCaja', {
					codGrupoCia,
					codLocal,
					numCaja: result,
				});

				const {
					data: { success: successFechaSistema, data: fechaSistema },
				} = await httpClient.get('posventa/getFechaHoraDB');

				if (
					fechaMovCaja.length > 0 &&
					fechaMovCaja.substring(0, 5) !== fechaSistema.substring(0, 5)
				) {
					showModal(
						'Debe CERRAR su caja para empezar un NUEVO DIA.\n La fecha actual no coincide con la Fecha de Apertura de Caja.'
					);
					setDisabledAll(true);
					respuesta = false;
				} else {
					setDisabledAll(false);
					respuesta = true;
				}
				setFechaSistema(fechaSistema);
				setLoadingData(false);
				setNumCaja(result);
				return respuesta;
			} else {
				return false;
			}
		} catch (e) {
			showModal('Error al obtener la fecha de movimiento de caja');
		}
	};

	const showModal = message => {
		modal.info({
			title: 'Sistema',
			content: <>{message}</>,
			okText: 'Aceptar',
			centered: true,
		});
	};

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
			setSelectedRows(selectedRows);
		},
		selectedRowKeys: selectedRows.map(item => {
			return item.key;
		}),
	};

	const clearDataFinally = () => {

    confirm({
      content: '¿Desea hacer una venta al mismo paciente?',
      okText: 'Continuar',
      cancelText: 'Nueva venta',
      onOk: () => {
        getUltimoPedidoDiario();
      },
      onCancel: () => {
        setCNumPedVta_in('');
        setVisibleModal(false);
        setTipoVenta('01');
        setVisibleModalDatosPedido(false);
        setProductosDetalles([]);
        setProductosCurrent([]);
        setSelectedRowKeys([]);
        setData([]);
        setSelectedRows([]);
        setClienteCurrent({});
        setMedicoCurrent({});
        setPacienteCurrent({});
        getUltimoPedidoDiario();
      },
      centered: true
    });
	};

	const validaOperacionCaja = async tipOp => {
		try {
			const {
				data: { success, message },
			} = await httpClient.post('posventa/validaOperacionCaja', {
				...dataFetch,
				secUsu: user.sec_usu_local,
				tipOp,
			});

			if (!success) {
				return true;
			} else {
        confirm({
          title: 'Mensaje del Sistema',
          content: 'Abra una nueva caja para continuar...',
          okCancel: false,
          onOk: () => {},
          okText: 'Aceptar',
          centered: true
        });
				return false;
			}
		} catch (e) {
			console.error('Error en la validacion de operacion caja', e);
		}
	};

	const datosPedidoAceptar = () => {
		info({
			title: 'Mensaje del Sistema',
			width: 500,
			content: (
				<>
					<Divider />
					<Descriptions size="small">
						<Descriptions.Item
							span={3}
							label="EL PEDIDO SERA REGISTRADO PARA EL MÉDICO"
						></Descriptions.Item>
						<Descriptions.Item span={3} label="CMP">
							{medicoCurrent.CMP}
						</Descriptions.Item>
						<Descriptions.Item span={3} label="NOMBRES COMPLETOS">
							{medicoCurrent.NOMBRE_COMPLETO}
						</Descriptions.Item>
					</Descriptions>
					<Divider />
					<Descriptions size="small">
						<Descriptions.Item span={3} label="Y PARA EL PACIENTE"></Descriptions.Item>
						<Descriptions.Item span={3} label="DNI">
							{pacienteCurrent.NUM_DOCUMENTO}
						</Descriptions.Item>
						<Descriptions.Item span={3} label="NOMBRES">
							{pacienteCurrent.NOMBRE}
						</Descriptions.Item>
						<Descriptions.Item span={3} label="APELLIDOS">
							{pacienteCurrent.APE_PATERNO} {pacienteCurrent.APE_MATERNO}
						</Descriptions.Item>
					</Descriptions>
				</>
			),
			centered: true,
			okText: 'Aceptar',
			onOk: () => {
				if (grabarPedido) setVisibleModalCobrarPedido(true);
			},
			okButtonProps: {
				style: {
					background: '#0169aa',
					color: '#fff',
				},
			},
		});
	};

  const cancelProductoSelected = () => {
    setVisibleModalCambiarCantidad(false);
  };

  const aceptedProductoSelected = (key, newData) => {
    const newDataFormat = data.map(item => {
      if (key === item.key) return {
        ...item,
        ...newData,
        total: parseFloat(newData.total).toFixed(2),
      }
      else return item;
    })
    setData(newDataFormat);
    const total = newDataFormat.reduce((previus, current) => parseFloat(current.total) + previus, 0);
    setDataDetallesFinally({
      tipoCambio: 3.34,
      items: newDataFormat.length,
      total,
      totalDolar: total / 3.34,
    });
    setVisibleModalCambiarCantidad(false);
    setProductosDetalles(productosDetalles.map(item => {
      if (key === item.key) return {
        ...item,
        ...newData,
      }
      else return item;
    }));
  }

	useEffect(() => {
		const chargeDataAsync = async () => {
			const valido = await validaOperacionCaja('MA');
			if (valido) {
        const validoFecha = await getFechaMovCaja();
        if (validoFecha) {
          await getUltimoPedidoDiario();
          setVisibleModal(true);
        }
      }
			else {
				setDisabledAll(true);
				setLoadingData(false);
			}
		};
		chargeDataAsync();
	}, []);

  useEffect(() => {
    setDataFiltered(data.filter(item => {
      return item.DESCRIPCION.toUpperCase().includes(textSearch.toUpperCase());
    }));

  }, [textSearch]);

  useEffect(() => {
    setDataFiltered(data);
  }, [data]);

	return (
		<>
			<Card
				title={
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: '280px auto 100px',
							gridTemplateRows: '1fr',
							gridColumnGap: '0px',
							gridRowGap: '0px',
							overflowX: 'auto',
						}}
					>
						<div
							style={{
								gridArea: '1 / 1 / 2 / 2',
								fontSize: '22px',
								marginTop: '15px',
							}}
						>
							Generar Pedido
						</div>
						<div
							style={{
								gridArea: '1 / 2 / 2 / 3',
								display: 'flex',
								flexDirection: 'row-reverse',
							}}
						>
							<Form
								// ref={formSearch}
								style={{
									width: '100%',
									display: 'flex',
									alignItems: 'center',
									flexDirection: 'row',
									gap: '10px',
								}}
							>
								<Form.Item style={{ width: '30%', margin: 0 }}>
									<Input
                    disabled={disabledAll || data.length <= 0}
										value={textSearch}
										onChange={e => setTextSearch(e.target.value.toUpperCase())}
										style={{ width: '100%' }}
										placeholder="Nombre de Producto"
									/>
								</Form.Item>
							</Form>
						</div>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								flexDirection: 'row-reverse',
							}}
						>
							{/* <Button
                // loading={loading}
                style={{
                  backgroundColor: '#04B0AD',
                  color: 'white',
                  marginTop: '10px'
                }}
                // onClick={() => buscarHistorial()}
                // disabled={btnBuscar}
              >
                <SearchOutlined />
              </Button> */}
							<Button
								// loading={loading}
								style={{
									backgroundColor: '#0169aa',
									color: 'white',
									marginTop: '10px',
								}}
								onClick={() => {
									setGrabarPedido(false);
									setVisibleModalDatosPedido(true);
								}}
								disabled={disabledAll}
							>
								Datos Atención
							</Button>
							<Button
								style={{
									backgroundColor: '#0169aa',
									color: 'white',
									marginTop: '10px',
                  marginRight: 20
								}}
								onClick={() => {
                  if (data.length > 0) confirm({
                    content: 'Continuar con el anterior o nueva selección',
                    onOk: () => {
                      setVisibleModal(true);
                    },
                    onCancel: () => {
                      setProductosCurrent([]);
                      setSelectedRowKeys([]);
                      setProductosDetalles([]);
                      setData([]);
                      setSelectedRows([]);
                      setVisibleModal(true);
                    },
                    cancelText: 'Nueva Selección',
                    okText: 'Continuar',
                    centered: true
                  })
                  else setVisibleModal(true);
                }}
								disabled={disabledAll}
								loading={loadingData}
							>
								Lista
							</Button>
						</div>
					</div>
				}
			>
				<Row
					justify="start"
					style={{
						gap: '20px 80px',
						marginLeft: 10,
						marginBottom: 10,
					}}
				>
					<span>Fecha: {moment().format('DD/MM/yyyy')}</span>
					<span>Tipo Cambio: {dataDetallesFinally.tipoCambio}</span>
					<span>Vendedor: {JSON.parse(localStorage.getItem('token'))?.data.login_usu}</span>
					<span>Ult. Pedido: {ultimoPedidoDiario.trim() === '0000' ? '____' : ultimoPedidoDiario}</span>
				</Row>
				<Row
					style={{
						marginLeft: 10,
						marginBottom: 20,
					}}
				>
					Relacion de Productos: {dataDetallesFinally.items} items
				</Row>
				{/* <Divider /> */}
				<Table
					rowSelection={{
						type: 'radio',
						...rowSelection,
					}}
					loading={loadingData}
					className="gx-table-responsive"
					columns={columns}
					dataSource={dataFiltered}
					pagination={{
						pageSize: 5,
					}}
					footer={() => (
						<Row
							justify="start"
							style={{
								gap: '20px 80px',
								marginLeft: 10,
								// marginBottom: 20,
								fontWeight: 'bold',
							}}
						>
							<span>Red. S/. 0.00</span>
							<span>I.G.V.: S/. {(dataDetallesFinally.total * 0.18).toFixed(2)}</span>
							<span>TOTAL: S/. {dataDetallesFinally.total.toFixed(2)}</span>
							<span>US: $ {dataDetallesFinally.totalDolar.toFixed(2)}</span>
						</Row>
					)}
					// loading={tableLoading}
				/>
				<div
					style={{
						marginTop: 20,
					}}
				>
					<Button
						disabled={disabledAll || data.length <= 0}
						style={{
							backgroundColor: '#0169aa',
							color: '#fff',
						}}
						// onClick={handleGrabarPedido}
						onClick={() => {
							setGrabarPedido(true);
							setVisibleModalDatosPedido(true);
						}}
					>
						Grabar
					</Button>
					<Button
						disabled={disabledAll || data.length <= 0 || selectedRows.length === 0}
						style={{
							backgroundColor: '#0169aa',
							color: '#fff',
						}}
						onClick={() => {
							setVisibleModalCambiarCantidad(true);
						}}
					>
						Cambiar Cantidad
					</Button>
					<Button
            disabled={disabledAll || data.length <= 0 || selectedRows.length === 0}
						style={{
							backgroundColor: '#0169aa',
							color: '#fff',
						}}
						onClick={() => {
							confirm({
								content: '¿Esta seguro de borrar el producto?',
								onOk: () => {
                  const newData = data.filter(item => item.key !== selectedRows[0].key);
                  setData(newData);
                  const total = newData.reduce((previus, current) => parseFloat(current.total) + previus, 0);
                  setDataDetallesFinally({
                    tipoCambio: 3.34,
                    items: newData.length,
                    total,
                    totalDolar: total / 3.34,
                  });
                  setSelectedRowKeys(selectedRowKeys.filter(item => item !== selectedRows[0].key));
                  setProductosDetalles(productosDetalles.filter(item => item.key !== selectedRows[0].key));
                  setProductosCurrent(productosCurrent.filter(item => item.key !== selectedRows[0].key));
                  setSelectedRows([]);
								},
								centered: true,
								okText: 'Continuar',
								cancelText: 'Cancelar',
							});
						}}
					>
						Borrar
					</Button>
					{/* <Button
						disabled={disabledAll}
						style={{
							backgroundColor: '#0169aa',
							color: '#fff',
						}}
					>
						Cotizar
					</Button> */}
				</div>
			</Card>
			<ModalListaProductos
				visible={visibleModal}
				setVisible={setVisibleModal}
				chargeDetailsModalProducto={chargeDetailsModalProducto}
				pacienteCurrent={pacienteCurrent}
				setPacienteCurrent={setPacienteCurrent}
				medicoCurrent={medicoCurrent}
				setMedicoCurrent={setMedicoCurrent}
				clienteCurrent={clienteCurrent}
				datosPedidoAceptar={datosPedidoAceptar}
				setClienteCurrent={setClienteCurrent}
				tipoVenta={tipoVenta}
				setTipoVenta={setTipoVenta}
				selectedRowKeys={selectedRowKeys}
				setSelectedRowKeys={setSelectedRowKeys}
				productosDetalles={productosDetalles}
				setProductosDetalles={setProductosDetalles}
				productosCurrent={productosCurrent}
				setProductosCurrent={setProductosCurrent}
        setGrabarPedido={setGrabarPedido}
			/>
			<ModalDatosPedido
				visibleDatosPedidoAceptar={datosPedidoAceptar}
				visible={visibleModalDatosPedido}
				setVisible={setVisibleModalDatosPedido}
				pacienteCurrent={pacienteCurrent}
				setPacienteCurrent={setPacienteCurrent}
				medicoCurrent={medicoCurrent}
				setMedicoCurrent={setMedicoCurrent}
				clienteCurrent={clienteCurrent}
				setClienteCurrent={setClienteCurrent}
				grabarPedido={grabarPedido}
				guardarDatosPedidoCabecera={guardarDatosPedidoCabecera}
				loadingGrabarPedido={loadingGrabarPedido}
				tipoVenta={tipoVenta}
				setTipoVenta={setTipoVenta}
			/>
			{visibleModalCobrarPedido ? (
				<ModalCobrarPedido
					setVisible={setVisibleModalCobrarPedido}
					visible={visibleModalCobrarPedido}
					pacienteCurrent={pacienteCurrent}
					setPacienteCurrent={setPacienteCurrent}
					medicoCurrent={medicoCurrent}
					setMedicoCurrent={setMedicoCurrent}
					clienteCurrent={clienteCurrent}
					setClienteCurrent={setClienteCurrent}
					dataFetch={dataFetch}
					cNumPedVta_in={cNumPedVta_in}
					dataCabeceraPed={dataFetchCabecera}
					tipoVenta={tipoVenta}
					getFechaMovCaja={getFechaMovCaja}
					setTipoVenta={setTipoVenta}
					clearDataFinallyMain={clearDataFinally}
				/>
			) : null}

      {visibleModalCambiarCantidad && (
        <ModalSeleccionProducto
          visible={visibleModalCambiarCantidad}
          productoCurrent={selectedRows[0]}
          setVisible={setVisibleModalCambiarCantidad}
          cancelProductoSelected={cancelProductoSelected}
          aceptedProductoSelected={aceptedProductoSelected}
        />
      )}
			{contextHolder}
		</>
	);
}

export default GenerarPedido;
