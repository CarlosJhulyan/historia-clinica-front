import { Button, Card, Form, Input, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { httpClient } from '../../util/Api';
import { openNotification } from '../../util/util';
import ModalBusquedaComprobante from './modalBusquedaComprobante';

const AnulacionPedidosCompletos = () => {
	const [abrirModalManual, setAbrirModalManual] = useState(true);
	const [abrirModalPedido, setAbrirModalPedido] = useState(false);
	const [loadingData, setLoadingData] = useState(false);
	const [pedidoFound, setPedidoFound] = useState(false);
	const [dataComprobantesPago, setDataComprobantesPago] = useState([]);
	const [dataCabecera, setDataCabecera] = useState([]);
	const [dataDetalles, setDataDetalles] = useState([]);
	const [dataSend, setDataSend] = useState({
		NUM_PEDIDO: '',
		NUM_ORDEN: '',
		TIPO_COMP_PAGO: '01',
		NUM_COMP: '',
		SERIE_COMP: '',
		NUM_COMPROBANTE: '',
		FECHA: '',
		FECHA_FORMAT: null,
		MONTO: '',
		COD_ESPECIALIDAD: '1',
		COD_BUS: '1',
		COD_MEDICO: '',
		NOM_MEDICO: '',
		USU_CREA: JSON.parse(localStorage.getItem('token')).data?.login_usu,
		ESTADO: 'T',
	});

	const cabeceraColumn = [
		{
			title: 'Pedido',
			dataIndex: 'key',
		},
		{
			title: 'Fecha',
			dataIndex: 'FECHA',
		},
		{
			title: 'Total S/',
			dataIndex: 'MONTO',
		},
		{
			title: 'R.U.C.',
			dataIndex: 'NUM_DOCUMENTO',
		},
		{
			title: 'Cliente',
			dataIndex: 'CLIENTE',
		},
		{
			title: 'Cajero',
			dataIndex: 'CAJERO',
		},
		{
			title: 'Convenio',
			dataIndex: 'CONVENIO',
		},
	];

	const detallesColumn = [
		{
			title: 'Código',
			dataIndex: 'key',
		},
		{
			title: 'Descripción',
			dataIndex: 'DESCRIPCION',
		},
		{
			title: 'Unidad',
			dataIndex: 'UNIDAD',
		},
		{
			title: 'Pre. Vta.',
			dataIndex: 'PRE_VTA',
		},
		{
			title: 'Cantidad',
			dataIndex: 'CANTIDAD',
		},
		{
			title: 'Total',
			dataIndex: 'TOTAL',
		},
	];

	const handleChangeText = e => {
		setDataSend({
			...dataSend,
			[e.target.name]: e.target.value,
		});
	};

	const traerPedido = async numPedido => {
		setLoadingData(true);
		try {
			const responseCabecera = await httpClient.post('pedido/getPedidoCabecera', {
				NUM_PEDIDO: numPedido || dataSend.NUM_PEDIDO,
			});
			const responseDetalles = await httpClient.post('pedido/getPedidoDetalles', {
				NUM_PEDIDO: numPedido || dataSend.NUM_PEDIDO,
			});
			if (!responseCabecera.data.success || !responseDetalles.data.success) {
				openNotification('Pedido', responseCabecera.data.message, 'Warning');
				setDataCabecera([{}]);
				setDataDetalles([{}]);
				setPedidoFound(false);
			} else {
				setDataCabecera(responseCabecera.data.data);
				setDataDetalles(responseDetalles.data.data);
				setDataSend({ ...dataSend, COD_PACIENTE: responseCabecera.data.data[0].COD_PACIENTE });
				setAbrirModalPedido(false);
				setPedidoFound(true);
			}
		} catch (error) {
			openNotification('Pedido', 'Error en la petición', 'Alerta');
			setPedidoFound(false);
		}
		setLoadingData(false);
	};

	const traerComprobantesPago = async () => {
		try {
			const {
				data: { data = [] },
			} = await httpClient.post('comprobante/getComprobantesPago');
			setDataComprobantesPago(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			await traerComprobantesPago();
			// await traerEspecialidades();
			// await traerConsultorios();
			// await getModulosConsultaMedica();
		};
		fetchData();
	}, []);

	return (
		<>
			<Card
				title={
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: '10px',
						}}
					>
						<div
							style={{
								width: '50%',
								fontSize: '22px',
								// marginTop: '15px',
							}}
						>
							Anulacion de Pedidos
						</div>
						{/* <div
							style={{
								width: '50%',
								display: 'flex',
								justifyContent: 'right',
							}}
						>
							<Button
								style={{
									backgroundColor: '#04B0AD',
									color: 'white',
									marginTop: '10px',
									marginLeft: 20,
								}}
							>
								ABC
							</Button>
						</div> */}
					</div>
				}
			>
				<div
					className="gx-main-content"
					style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
				>
					<Form
						layout="horizontal"
						style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center' }}
					>
						<Form.Item name="correlativo" label="Correlativo" style={{ width: '300px', margin: 0 }}>
							<Input
								type="text"
								// value={hallazgo}
							/>
						</Form.Item>
						<Form.Item name="monto" label="Monto" style={{ width: '300px', margin: 0 }}>
							<Input
								type="number"
								// value={hallazgo}
							/>
						</Form.Item>
						<Button className="gx-mb-0" type="primary">
							Buscar
						</Button>
					</Form>
					<Table
						className="gx-table-responsive"
						style={{ marginBottom: 30 }}
						title={() => <span>Cabecera Pedido</span>}
						size="small"
						dataSource={dataCabecera}
						pagination={false}
						columns={cabeceraColumn}
					/>
					<Table
						className="gx-table-responsive"
						pagination={false}
						dataSource={dataDetalles}
						title={() => <span>Detalles Pedido</span>}
						size="small"
						columns={detallesColumn}
					/>
				</div>
			</Card>
			<ModalBusquedaComprobante
				abrirModalManual={abrirModalManual}
				dataSend={dataSend}
				handleChangeText={handleChangeText}
				loadingData={loadingData}
				setDataSend={setDataSend}
				setAbrirModalManual={setAbrirModalManual}
				setLoadingData={setLoadingData}
				traerPedido={traerPedido}
				dataComprobantesPago={dataComprobantesPago}
			/>
		</>
	);
};

export default AnulacionPedidosCompletos;
