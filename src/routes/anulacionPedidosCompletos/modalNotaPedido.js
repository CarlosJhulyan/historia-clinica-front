import { Modal, Input, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useAuth } from '../../authentication';
import { httpClient } from '../../util/Api';

const ModalNotaPedio = ({ visible, setVisible, dataVenta }) => {
	const [dataDetalleNotaCredito, setDataDetalleNotaCredito] = useState([]);
	const [dataListaUsuarios, setDataListaUsuarios] = useState([]);
	// const [dataCabecera, setDataCabecera] = useState('');
	// const [dataDetalles, setDataDetalles] = useState([]);
	const [modalListaUsuarios, setModalListausuarios] = useState(true);
	const [modalMotivo, setModalMotivo] = useState(false);
	const [currentUsuario, setCurrentUsuario] = useState({});
	const [motivo, setMotivo] = useState('');

	const {
		authUser: { data: user },
	} = useAuth();

	const deatlleAnulacion = [
		{
			title: 'Codigo',
			dataIndex: 'CODIGO',
		},
		{
			title: 'Usuario',
			dataIndex: 'USUARIO',
		},
		{
			title: 'Caja',
			dataIndex: 'CAJA',
		},
		{
			title: 'Turno',
			dataIndex: 'TURNO',
		},
	];

	const cabeceraColumn = [
		{
			title: 'Codigo',
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
			title: 'Laboratorio',
			dataIndex: 'ECOGRAFIA',
		},
		{
			title: 'Cantidad',
			dataIndex: 'CANTIDAD',
		},
		{
			title: 'Precio',
			dataIndex: 'PRECIO',
		},
		{
			title: 'Devolucion',
			dataIndex: 'DEVOLUCION',
		},
	];

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			// console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
			setCurrentUsuario(selectedRows[0]);
		},
		getCheckboxProps: record => ({
			disabled: record.name === 'Disabled User',
			name: record.name,
		}),
	};

	const cajListaDetalleNotaCredito = async () => {
		try {
			const {
				data: { data = [] },
			} = await httpClient.post('posventa/cajListaDetalleNotaCredito', {
				cCodGrupoCia: '001',
				cCodLocal: '001',
				cNumPedVta: dataVenta.cNumPedVta,
				cTipComp: '%',
				cNumComp: '%',
			});
			setDataDetalleNotaCredito(data.map(item => ({ ...item, key: item.CODIGO })));
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	};

	const cajAgregarCabNotaCredito = async () => {
		try {
			const {
				data: { data = [] },
			} = await httpClient.post('posventa/cajAgregarCabNotaCredito', {
				cCodGrupoCia: '001',
				cCodLocal: '001',
				cNumVtaAnt: dataVenta.cNumPedVta,
				nTipoCam: '3.34',
				vIdUsu: user.login_usu,
				nNumCajaPago: currentUsuario.CAJA,
				cMotivoAnulacion: motivo,
			});
			await cajAgregarDetNotaCredito(data);
			const da = await fCurLstCompPago();
			let resp = await getNumNC();
			resp = resp.split('@');
			fImpCompElectWS(resp[0], resp[1]);

			console.log(data);
		} catch (error) {
			console.error(error);
		}
	};

	const fImpCompElectWS = async (val1, val2) => {
		try {
			const {
				data: { data = [] },
			} = await httpClient.post('posventa/fImpCompElectWS', {
				cCodGrupoCia: '001',
				cCodLocal: '001',
				cNumPedVta: val1,
				cSecCompPago: val2,
				vVersion: 'v1.0.0GA20221507',
				vReimpresion: 'N',
				valorAhorro: '0',
				cDocTarjetaPtos: '',
			});
			console.log('fImpCompElectWS', data); // TODO: HASTA AQUI QUEDAMOS POR HOY
		} catch (error) {
			console.error(error);
		}
	};

	const cajAgregarDetNotaCredito = async dd => {
		try {
			const {
				data: { data = [] },
			} = await httpClient.post('posventa/cajAgregarDetNotaCredito', {
				cCodGrupoCia: '001',
				cCodLocal: '001',
				cNumVtaAnt: dataVenta.cNumPedVta,
				cNumVta: dd,
				cCodProd: '0',
				nCantProd: '0',
				nTotal: '0.0',
				vIdUsu: user.login_usu,
				nSecDetPed: '0',
				nNumCajaPago: currentUsuario.CAJA,
			});
			console.log('cajAgregarDetNotaCredito', data);
		} catch (error) {
			console.error(error);
		}
	};

	const fCurLstCompPago = async dd => {
		try {
			const {
				data: { data = [] },
			} = await httpClient.post('posventa/fCurLstCompPago', {
				cCodGrupoCia: '001',
				cCodLocal: '001',
				cNumPed: dataVenta.cNumPedVta,
				cSecCompPago: '',
			});
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	};

	const getNumNC = async dd => {
		try {
			const {
				data: { data = [] },
			} = await httpClient.post('posventa/getNumNC', {
				cCodGrupoCia: '001',
				cCodLocal: '001',
				cNumPedVta: dataVenta.cNumPedVta,
			});
			return data;
		} catch (error) {
			console.error(error);
		}
	};

	const cajListaCajaUsuario = async () => {
		try {
			const {
				data: { data = [] },
			} = await httpClient.post('posventa/cajListaCajaUsuario', {
				cCodGrupoCia: '001',
				cCodLocal: '001',
			});
			setDataListaUsuarios(data.map(item => ({ ...item, key: item.CODIGO })));
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		cajListaDetalleNotaCredito();
		cajListaCajaUsuario();
	}, []);

	return (
		<>
			<Modal
				title="Nueva nota de credito"
				width={'80%'}
				closable={false}
				okText="Aceptar"
				cancelText="Salir"
				onOk={() => {
					setModalListausuarios(true);
				}}
				centered
				onCancel={() => setVisible(false)}
				visible={visible}
			>
				<Table
					className="gx-table-responsive"
					style={{ marginBottom: 30 }}
					// title={() => <span>Cabecera Pedido</span>}
					size="small"
					dataSource={dataDetalleNotaCredito}
					pagination={false}
					columns={cabeceraColumn}
				/>
			</Modal>

			{modalListaUsuarios && (
				<Modal
					title="Listas de usuarios y cajas disponibles"
					width={'50%'}
					closable={false}
					okText="Aceptar"
					cancelText="Salir"
					onOk={() => {
						setModalMotivo(true);
					}}
					centered
					onCancel={() => setModalListausuarios(false)}
					visible={visible}
				>
					<Table
						className="gx-table-responsive"
						style={{ marginBottom: 30 }}
						// title={() => <span>Cabecera Pedido</span>}
						rowSelection={{
							type: 'radio',
							...rowSelection,
						}}
						size="small"
						dataSource={dataListaUsuarios}
						pagination={false}
						columns={deatlleAnulacion}
					/>
				</Modal>
			)}

			{modalMotivo && (
				<Modal
					title="Motivo de anulacion"
					width={'50%'}
					closable={false}
					okText="Aceptar"
					cancelText="Salir"
					onOk={() => {
						cajAgregarCabNotaCredito();
						setModalMotivo(false);
					}}
					centered
					onCancel={() => setModalMotivo(false)}
					visible={visible}
				>
					<Input.TextArea
						rows={3}
						onChange={e => {
							setMotivo(e.target.value);
						}}
					/>
				</Modal>
			)}
		</>
	);
};

export default ModalNotaPedio;
