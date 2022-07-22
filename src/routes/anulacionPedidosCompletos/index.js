import { Button, Card, Form, Input, Table, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { httpClient } from '../../util/Api';
import ModalBusquedaComprobante from './modalBusquedaComprobante';
import ModalNotaPedio from './modalNotaPedido';

const AnulacionPedidosCompletos = () => {
	const [abrirModalManual, setAbrirModalManual] = useState(true);
	const [loadingData, setLoadingData] = useState(false);
	const [dataComprobantesPago, setDataComprobantesPago] = useState([]);
	const [dataCabecera, setDataCabecera] = useState([]);
	const [dataDetalles, setDataDetalles] = useState([]);
	const [abrirModalNotaPedido, setAbrirModalNotaPedido] = useState(false);
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
	const [dataVenta, setDataVenta] = useState({ cNumPedVta: '', cNumComp: '', cTipComp: '' });

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
			dataIndex: 'TOTAL',
		},
		{
			title: 'R.U.C.',
			dataIndex: 'RUC',
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
			dataIndex: 'CODIGO',
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
			dataIndex: 'PRE_VENTA',
		},
		{
			title: 'Cantidad',
			dataIndex: 'CANT',
		},
		{
			title: 'Total',
			dataIndex: 'TOTAL',
		},
	];

  const clearAll = () => {
    setDataCabecera([]);
    setDataDetalles([]);
    setAbrirModalNotaPedido(false);
    setAbrirModalManual(false);
    refForm.resetFields();
  }

	const handleChangeText = e => {
		setDataSend({
			...dataSend,
			[e.target.name]: e.target.value,
		});
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
		};
		fetchData();
	}, []);

	const [refForm] = Form.useForm();

	useEffect(() => {
		refForm.setFieldsValue({ correlativo: dataCabecera[0]?.key, monto: dataCabecera[0]?.TOTAL });
		console.log('dataCabecera', dataCabecera);
		console.log('form', refForm.getFieldsValue());
    refForm.resetFields();
	}, [dataCabecera]);

	const info = () => {
		Modal.info({
			title: 'Mensaje del sistema',
			content: (
				<div>
					<p>Se anulará dicho pedido, pero se generará una solicitud de Nota de Crédito.</p>
				</div>
			),
			onOk() {
				setAbrirModalNotaPedido(true);
			},
		});
	};

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
					</div>
				}
			>
				<div
					className="gx-main-content"
					style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
				>
					<Form
						form={refForm}
						layout="horizontal"
						style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center' }}
					>
						<Form.Item name="correlativo" label="Correlativo" style={{ width: '300px', margin: 0 }}>
							<Input type="text" disabled />
						</Form.Item>
						<Form.Item name="monto" label="Monto" style={{ width: '300px', margin: 0 }}>
							<Input type="text" disabled />
						</Form.Item>
						<Button className="gx-mb-0" type="primary" onClick={() => setAbrirModalManual(true)}>
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
				<div style={{ marginTop: 20 }}>
					<Button
            className="gx-mb-0"
            type="primary"
            onClick={info}
            disabled={dataCabecera.length <= 0}
          >
						Anular
					</Button>
					<Button className="gx-mb-0" type="primary" onClick={() => clearAll()}>
						Limpiar
					</Button>
				</div>
			</Card>
			{abrirModalManual ? (
				<ModalBusquedaComprobante
					abrirModalManual={abrirModalManual}
					dataSend={dataSend}
					handleChangeText={handleChangeText}
					loadingData={loadingData}
					setDataSend={setDataSend}
					setAbrirModalManual={setAbrirModalManual}
					setLoadingData={setLoadingData}
					dataComprobantesPago={dataComprobantesPago}
					setDataCabecera={setDataCabecera}
					setDataDetalles={setDataDetalles}
					setDataVenta={setDataVenta}
				/>
			) : null}
			{abrirModalNotaPedido ? (
				<ModalNotaPedio
					visible={abrirModalNotaPedido}
					setVisible={setAbrirModalNotaPedido}
					dataVenta={dataVenta}
					dataCabecera={dataCabecera}
          clearAll={clearAll}
				/>
			) : null}
		</>
	);
};

export default AnulacionPedidosCompletos;
