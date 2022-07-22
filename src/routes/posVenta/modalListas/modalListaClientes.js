import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Modal, Row, Table } from 'antd';
import { httpClient } from '../../../util/Api';
import { notificaciones, openNotification } from '../../../util/util';
import { ToastContainer } from 'react-toastify';

function ModalListaMedicos({ visible, setVisible, setClienteCurrent }) {
	const [data, setData] = useState([]);
	const [loadingData, setLoadingData] = useState(false);
	const [clienteKeyCurrent, setClienteKeyCurrent] = useState('');
	const [clienteSearch, setClienteSearch] = useState('');
	const [filaActual, setFilaActual] = useState({});
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [visibleModalUpsertCliente, setVisibleModalUpsertCliente] = useState(false);
	const [tipo, setTipo] = useState('');
	const buttonRef = useRef();

	const columns = [
		{
			title: 'Tipo docu...',
			dataIndex: 'TIPO_DOC_IDENT',
			key: 'TIPO_DOC_IDENT',
      width: 100
		},
		{
			title: 'Documento',
			dataIndex: 'NUM_DOCUMENTO',
			key: 'NUM_DOCUMENTO',
		},
		{
			title: 'Cliente',
			dataIndex: 'CLIENTE',
			key: 'CLIENTE',
		},
		{
			title: 'Teléfono',
			dataIndex: 'TELEFONO',
			key: 'TELEFONO',
		},
	];

	const traerDataClientesPorNombre = () => {
		setLoadingData(true);
		httpClient
			.post('posventa/getClientesNombrePosVenta', {
				codGrupoCia: '001',
				codLocal: '001',
				palabra: clienteSearch.toUpperCase(),
			})
			.then(response => {
				if (response.data.success) {
					setData(response.data.data);
					openNotification('Lista de Clientes', response.data.message);
				} else {
					openNotification('Lista de Clientes', response.data.message, 'Warning');
				}
				setLoadingData(false);
			})
			.catch(e => console.error(e));
	};

	const traerDataClientesPorDocumento = () => {
		setLoadingData(true);
		httpClient
			.post('posventa/getClientesDocPosVenta', {
				codGrupoCia: '001',
				codLocal: '001',
				documento: clienteSearch,
			})
			.then(response => {
				if (response.data.success) {
					setData(response.data.data);
					openNotification('Lista de Clientes', response.data.message);
				} else {
					openNotification('Lista de Clientes', response.data.message, 'Warning');
				}
				setLoadingData(false);
			})
			.catch(e => console.error(e));
	};

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			setClienteKeyCurrent(selectedRows[0].NUM_DOCUMENTO);
			setFilaActual(selectedRows[0]);
			setSelectedRowKeys(selectedRowKeys);
		},
		selectedRowKeys,
	};

	const handleSearch = () => {
		const isNumber = /^([0-9])*$/.test(clienteSearch);

		if (isNumber) traerDataClientesPorDocumento();
		else traerDataClientesPorNombre();
	};

	const handleClearData = () => {
		setData([]);
		setClienteSearch('');
		setSelectedRowKeys([]);
		setFilaActual({});
		setClienteKeyCurrent('');
		openNotification('Lista de Clientes', 'Lista limpiada');
	};

	const handleAcepted = () => {
		openNotification('Ingreso Cliente', 'Cliente agregado correctamente');
		setClienteCurrent(filaActual);
		setVisible(false);
	};

	return (
		<>
			<Modal
				centered
				width={1100}
				visible={visible}
				title="Lista de Clientes"
				className="modal-posventa"
				onCancel={() => setVisible(false)}
				footer={[
					<Button
						style={{
							background: "#36AE7C"
						}}
						onClick={() => {
							setVisibleModalUpsertCliente(true);
							setTipo('crear');
						}}
					>
						<p
							style={{
								color: "white"
							}}
						>

							Crear
						</p>
					</Button>,
					<Button
						disabled={!clienteKeyCurrent}
						onClick={() => {
							setVisibleModalUpsertCliente(true);
							setTipo('editar');
						}}
					>
						Modificar
					</Button>,
					<Button disabled={!clienteKeyCurrent} onClick={handleAcepted}>
						Seleccionar
					</Button>,
					<Button
						style={{
							background: "#EB5353"
						}}
						onClick={() => setVisible(false)}>
						<p style={{
							color: "white"
						}}>
							Cerrar
						</p>
					</Button>,
				]}
			>
				<Row>
					<Col span={14}>
						<Form.Item label="Cliente / doc." style={{ margin: 0, padding: 5 }}>
							<Input
								onChange={e => setClienteSearch(e.target.value)}
								value={clienteSearch}
								disabled={loadingData}
								onKeyUp={e => {
									if (e.key === 'Enter') {
										buttonRef.current.click();
									}
								}}
							/>
						</Form.Item>
					</Col>
					<Button
						ref={buttonRef}
						disabled={loadingData || clienteSearch.trim() === ''}
						style={{ marginTop: 5, background: '#0169aa', color: '#fff' }}
						loading={loadingData}
						onClick={handleSearch}
					>
						Buscar
					</Button>
					<Button
						disabled={loadingData}
						style={{ marginTop: 5, background: '#0169aa', color: '#fff' }}
					// onClick={traerDataClientesPorNombre}
					>
						Sin Docume...
					</Button>
					<Button
						disabled={loadingData}
						style={{ marginTop: 5, background: '#0169aa', color: '#fff' }}
						onClick={handleClearData}
					>
						Limpiar
					</Button>
				</Row>
				<Table
					style={{ marginRight: 10, marginLeft: 10 }}
					rowSelection={{
						type: 'radio',
						...rowSelection,
					}}
					className="gx-table-responsive"
					columns={columns}
					size="small"
					loading={loadingData}
					dataSource={data}
          scroll={{
            y: 350
          }}
				/>
			</Modal>

			{visibleModalUpsertCliente ? (
				<ModalMantenimientoCliente
					setVisible={setVisibleModalUpsertCliente}
					visible={visibleModalUpsertCliente}
					tipo={tipo}
					filaActual={filaActual}
					setFilaActual={setFilaActual}
					handleSearch={handleSearch}
				/>
			) : null}
			<ToastContainer pauseOnHover={false} />
		</>
	);
}

function ModalMantenimientoCliente({
	visible,
	setVisible,
	tipo,
	filaActual,
	setFilaActual,
	handleSearch,
}) {
	const [form] = Form.useForm();

	const [natural, setNatural] = useState(
		tipo === 'crear' ? true : filaActual.TIP_DOCUMENTO === '01'
	);

	useEffect(() => {
		if (tipo === 'editar') {
			console.log(filaActual);
			form.setFieldsValue({
				documento: filaActual.NUM_DOCUMENTO,
				telefono: filaActual.TELEFONO === '.' ? '' : filaActual.TELEFONO,
				correo: filaActual.CORREO === '.' ? '' : filaActual.CORREO,
				nombre: filaActual.TIP_DOCUMENTO === '02' ? '' : filaActual.NOMBRE,
				apellidoP: filaActual.APE_PAT === '.' ? '' : filaActual.APE_PAT,
				apellidoM: filaActual.APE_MAT === '.' ? '' : filaActual.APE_MAT,
				direccion: filaActual.DIRECCION === '.' ? '' : filaActual.DIRECCION,
				razonSocial: filaActual.TIP_DOCUMENTO === '02' ? filaActual.NOMBRE : '',
			});
		} else {
			form.setFieldsValue({
				documento: '',
				telefono: '',
				correo: '',
				nombre: '',
				apellidoP: '',
				apellidoM: '',
				direccion: '',
				razonSocial: '',
			});
		}
	}, []);

	const guardar = () => {
		const token = JSON.parse(localStorage.getItem('token'));
		const { documento, telefono, correo, nombre, apellidoP, apellidoM, direccion, razonSocial } =
			form.getFieldsValue();
		console.log(documento, telefono, correo, nombre, apellidoP, apellidoM, direccion, razonSocial);

		if (natural) {
			if (documento === '' || nombre === '' || apellidoP === '' || apellidoM === '') {
				notificaciones('Debe completar todos los campos', 'Alerta');
				return;
			}
		} else {
			if (documento === '' || razonSocial === '') {
				notificaciones('Debe completar todos los campos', 'Alerta');
				return;
			}
		}

		let funGuardar = () => { };

		if (tipo === 'editar') {
			funGuardar = async () => {
				await httpClient.post('/posventa/modificarCliente', {
					pNombreCliente: nombre !== '' ? nombre : '.',
					pApellidoPat: apellidoP !== '' ? apellidoP : '.',
					pApellidoMat: apellidoM !== '' ? apellidoM : '.',
					pTipoDocIdent: documento.length > 8 ? '02' : '01',
					pDni: documento,
					pDirCliente: direccion !== '' ? direccion : '.',
					vRazonSocial: razonSocial !== '' ? razonSocial : '.',
					vTelefono: telefono !== '' ? telefono : '.',
					vCorreo: correo !== '' ? correo : '.',
					idUsuarioLogueado: token.data.sec_usu_local,
					pCodCliente: filaActual.COD_CLI,
				});
			};
		} else {
			funGuardar = async () => {
				await httpClient.post('/posventa/grabarCliente', {
					pNombre: nombre !== '' ? nombre : '.',
					pAPellidoPat: apellidoP !== '' ? apellidoP : '.',
					pApellidoMat: apellidoM !== '' ? apellidoM : '.',
					pTipoDocIdent: documento.length > 8 ? '02' : '01',
					pDni: documento,
					pDirCliente: direccion !== '' ? direccion : '.',
					vRazonSocial: razonSocial !== '' ? razonSocial : '.',
					vTelefono: telefono !== '' ? telefono : '.',
					vCorreo: correo !== '' ? correo : '.',
					idUsuarioLogueado: token.data.sec_usu_local,
				});
			};
		}

		setVisible(false);
		form.setFieldsValue({
			documento: '',
			telefono: '',
			correo: '',
			nombre: '',
			apellidoP: '',
			apellidoM: '',
			direccion: '',
			razonSocial: '',
		});
		console.log('guardar');
		notificaciones('', 'Promesa', {
			pendiente: 'Guardando...',
			ok: 'Guardado correctamente',
			error: 'Error al guardar',
			promesa: funGuardar,
		});
		setFilaActual({});
		handleSearch();
	};

	return (
		<Modal
			centered
			width={700}
			visible={visible}
			title="Mantenimiento Cliente"
			onCancel={() => setVisible(false)}
			footer={[
				<Button onClick={() => setVisible(false)}>Cerrar</Button>,
				<Button style={{ background: '#0169aa', color: '#fff' }} onClick={guardar}>
					Grabar
				</Button>,
			]}
		>
			<Form form={form} labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
				<Row>
					<Col span={12}>
						<Form.Item
							name="documento"
							label="DNI o RUC"
							style={{ margin: 0 }}
							rules={[{ required: true }]}
						>
							<Input
								size="small"
								onChange={value => {
									if (value.target.value.length === 11) {
										setNatural(false);
									} else {
										setNatural(true);
									}
								}}
							/>
						</Form.Item>
						<Form.Item name="telefono" label="Teléfono" style={{ margin: 0 }}>
							<Input size="small" />
						</Form.Item>
						<Form.Item name="correo" label="Correo" style={{ margin: 0 }}>
							<Input size="small" />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="nombre" label="Nombre" style={{ margin: 0 }}>
							<Input size="small" disabled={!natural} />
						</Form.Item>
						<Form.Item name="apellidoP" label="Ape. Pat" style={{ margin: 0 }}>
							<Input size="small" disabled={!natural} />
						</Form.Item>
						<Form.Item disabled={!natural} name="apellidoM" label="Ape. Mat" style={{ margin: 0 }}>
							<Input size="small" disabled={!natural} />
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<Form.Item name="direccion" label="Dirección" style={{ margin: 0 }}>
							<Input size="small" />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="razonSocial" label="Razón Social" style={{ margin: 0 }}>
							<Input size="small" />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
}

export default ModalListaMedicos;
