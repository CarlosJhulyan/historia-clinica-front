import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row, Table } from 'antd';
import { httpClient } from '../../../util/Api';

function ModalInfoProducto({ visible, setVisible, productoCurrent }) {
	const [loadingDetalles, setLoadingDetalles] = useState(false);
	const [loadingListaFrac, setLoadingListaFrac] = useState(false);
	const [producto, setProducto] = useState({});
	const [detalles, setDetalles] = useState([]);

	const columns = [
		{
			title: 'Código',
			key: 'COD_PRINC_ACT',
			dataIndex: 'COD_PRINC_ACT',
		},
		{
			title: 'Descripción',
			key: 'DESC_PRINC_ACT',
			dataIndex: 'DESC_PRINC_ACT',
		},
	];

	const getPrincActProd = () => {
		setLoadingDetalles(true);
		httpClient
			.post('posventa/getPrincActProd', {
				codGrupoCia: '001',
				codProd: productoCurrent.CODIGO,
			})
			.then(response => {
				if (response.data.success && response.data.data) setDetalles(response.data.data);
				setLoadingDetalles(false);
			})
			.catch(e => console.error(e));
	};

	const getInfoComplProd = () => {
		setLoadingListaFrac(true);
		httpClient
			.post('posventa/getInfoComplProd', {
				codGrupoCia: '001',
				codLocal: '001',
				cIndVerificaSug: 'S',
				codProd: productoCurrent.CODIGO,
			})
			.then(response => {
				if (response.data.success) setProducto(response.data.data[0]);
				setLoadingListaFrac(false);
			})
			.catch(e => console.error(e));
	};

	useEffect(() => {
		if (productoCurrent.CODIGO) {
			if (visible) {
				getPrincActProd();
				getInfoComplProd();
			}
		}
	}, [visible]);

	return (
		<Modal
			title="Detalle de Producto"
			visible={visible}
			onCancel={() => setVisible(false)}
			footer={[
				<Button
					disabled={loadingDetalles || loadingListaFrac}
					onClick={() => {
						setVisible(false);
					}}
				>
					Cerrar
				</Button>,
			]}
			width={450}
			centered
			// className="modal-custom"
			closable={false}
		>
			<div
				style={{
					backgroundColor: '#0169aa',
					color: 'white',
					display: 'flex',
					flexDirection: 'row',
					marginBottom: 10,
					padding: '20px',
					gap: '20px',
				}}
			>
				<div>Stock del Producto al {producto && producto.stk_Prod_Fecha_Actual}</div>
				<div>{producto && producto.stk_Prod} unidades</div>
			</div>
			<Row style={{ margin: 0 }}>
				<Col sm={24} md={24} style={{ marginTop: 20 }}>
					<Row
						justify="space-between"
						style={{ marginBottom: 20, marginLeft: 10, marginRight: 10 }}
					>
						<Col>Código: {productoCurrent && productoCurrent.CODIGO}</Col>
						<Col>Zan: {producto && producto.indZan}</Col>
					</Row>
					<Row
						justify="space-between"
						style={{ marginBottom: 20, marginLeft: 10, marginRight: 10 }}
					>
						<Col>Descripción: {productoCurrent && productoCurrent.DESCRIPCION}</Col>
					</Row>
					<Row
						justify="space-between"
						style={{ marginBottom: 20, marginLeft: 10, marginRight: 10 }}
					>
						<Col>Laboratorio: {productoCurrent && productoCurrent.MARCA}</Col>
					</Row>
					<Row
						justify="space-between"
						style={{ marginBottom: 20, marginLeft: 10, marginRight: 10 }}
					>
						<Col>Unidad: {producto && producto.unid_Vta}</Col>
					</Row>
					<Row
						justify="space-between"
						style={{ marginBottom: 40, marginLeft: 10, marginRight: 10 }}
					>
						<Col>Precio Venta: S/{producto && producto.val_Prec_Vta}</Col>
						{/* <Col>Marca: {producto.MARCA}</Col> */}
					</Row>
					<Row>
						<Table
							columns={columns}
							pagination={false}
							bordered
							dataSource={detalles}
							loading={loadingListaFrac}
							size="small"
							style={{ width: '100%' }}
						/>
					</Row>
				</Col>
			</Row>
		</Modal>
	);
}

export default ModalInfoProducto;
