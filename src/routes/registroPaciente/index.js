import {
	Button,
	Card,
	Table,
	Modal,
	Input,
	Space,
	Form,
	Divider,
	Row,
	Col,
	Select,
	notification,
} from 'antd';
import React, { createRef, useCallback, useEffect, useMemo, useState } from 'react';
import ModalDetalles from './modalDetalles';
import { httpClient } from '../../util/Api';
import DatosPaciente from '../listaPaciente/datosPaciente';

import { useIdleTimer } from 'react-idle-timer';
import { useAuth } from '../../authentication';
import { useHistory } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { SearchOutlined } from '@ant-design/icons';
import ModalTriaje from './modalTriaje';

const { Option } = Select;

const RegistroPaciente = () => {
	const [abrirModal, setAbrirModal] = useState(false);
	const [abrirModalTriaje, setAbrirModalTriaje] = useState(false);
	const [filaActual, setFilaActual] = useState({});
	const [data, setData] = useState();
	const [loadingData, setLoadingData] = useState(false);
	const [datosModal, setDatosModal] = useState({});
	const [mostrarListaPaciente, setMostrarListaPaciente] = useState(true);
	const [sesionCerrada, setSesionCerrada] = useState(false);
	const [codEditarPaciente, setCodEditarPaciente] = useState(null);
	const [isModalEdit, setIsModalEdit] = useState(false);
	const [tipoDocumento, setTipoDocumento] = useState([]);
	const [tipoPariente, setTipoPariente] = useState([]);
	const [estadoCivil, setEstadoCivil] = useState([]);

	const openNotification = (type, message, description) => {
		notification[type]({
			message,
			description,
		});
	};

	const [datosSearch, setDatosSearch] = useState({
		APE_PATERNO: '',
		APE_MATERNO: '',
		NOMBRE: '',
		DOC_TIP_DOCUMENTO: '01',
		NUM_DOCUMENTO: '',
	});

	const traerTipoDocumento = useCallback(async () => {
		const acomp = {
			codGrupoCia: '001',
		};
		const respuesta = await httpClient.post('/pacientes/getTipoDoc', acomp);
		setTipoDocumento(respuesta.data.data);
	}, []);

	const traerTipoParientes = useCallback(async () => {
		const acomp = {
			codGrupoCia: '001',
		};
		const respuesta = await httpClient.post('/pacientes/getTipoAcomp', acomp);
		setTipoPariente(respuesta.data.data);
	}, []);

	const traerEstadoCivil = useCallback(async () => {
		const acomp = {
			codGrupoCia: '001',
		};
		const respuesta = await httpClient.post('/pacientes/getEstadoCivil', acomp);
		setEstadoCivil(respuesta.data.data);
	}, []);

	const { userSignOut } = useAuth();
	const history = useHistory();

	const [form] = Form.useForm();

	const traerDatos = useCallback(
		async (noMessage = 'false') => {
			setLoadingData(true);
			try {
				const { data } = await httpClient.post(`/pacientes/searchPacientes`, datosSearch);
				setData(data.data);
				if (noMessage) openNotification('success', 'Búsqueda', data.message);
			} catch (e) {
				openNotification('error', 'Búsqueda', data.message);
				setData([]);
			}
			setLoadingData(false);
		},
		[datosSearch, data?.message]
	);

	const actualizarDatos = async () => {
		setData(undefined);
		await traerDatos();
	};

	const mostrarModal = record => {
		setIsModalEdit(false);
		setFilaActual(record);
		setAbrirModal(true);
	};

	const mostrarModalEditar = () => {
		setIsModalEdit(true);
		setAbrirModal(true);
	};

	const dataValida = () => {
		return (
			datosSearch.APE_MATERNO.trim() !== '' ||
			datosSearch.APE_MATERNO.trim() !== '' ||
			datosSearch.APE_PATERNO.trim() !== '' ||
			datosSearch.NOMBRE.trim() !== '' ||
			datosSearch.NUM_DOCUMENTO.trim() !== ''
		);
	};

	const getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					placeholder={`Buscar ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Buscar
					</Button>
					<Button onClick={() => handleReset()} size="small" style={{ width: 90 }}>
						Reiniciar
					</Button>
				</Space>
			</div>
		),
		filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
		onFilter: (value, record) =>
			record[dataIndex]
				? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
				: '',
	});

	const handleSearch = async () => {
		if (dataValida()) {
			const dataOld = data;
			await traerDatos();
			if (dataOld !== data) {
				setCodEditarPaciente(false);
			}
		} else {
			openNotification(
				'warning',
				'Advertencia de búsqueda',
				'Complete cualquiera de los campos para hacer la búsqueda.'
			);
		}
	};

	const handleReset = () => {};

	useEffect(() => {
		traerTipoDocumento();
		traerEstadoCivil();
		traerTipoParientes();
	}, []);

	const handleChangeTipoDocumento = value =>
		setDatosSearch({ ...datosSearch, DOC_TIP_DOCUMENTO: value });
	const handleChangeNombres = e => setDatosSearch({ ...datosSearch, NOMBRE: e.target.value });
	const handleChangeApePaterno = e =>
		setDatosSearch({ ...datosSearch, APE_PATERNO: e.target.value });
	const handleChangeApeMaterno = e =>
		setDatosSearch({ ...datosSearch, APE_MATERNO: e.target.value });
	const handleChangeNumDocumento = e =>
		setDatosSearch({ ...datosSearch, NUM_DOCUMENTO: e.target.value });

	const columns = [
		{
			title: 'Tip.Doc',
			dataIndex: 'DOC_TIP_DOCUMENTO',
			key: 'DOC_TIP_DOCUMENTO',
		},
		{
			title: 'Num.Doc',
			dataIndex: 'NUM_DOCUMENTO',
			key: 'NUM_DOCUMENTO',
			...getColumnSearchProps('NUM_DOCUMENTO'),
		},
		{
			title: 'Ape.Pat',
			dataIndex: 'APE_PATERNO',
			key: 'APE_PATERNO',
			...getColumnSearchProps('APE_PATERNO'),
		},
		{
			title: 'Ape.Mat',
			dataIndex: 'APE_MATERNO',
			key: 'APE_MATERNO',
			...getColumnSearchProps('APE_MATERNO'),
		},
		{
			title: 'Nombre',
			dataIndex: 'NOMBRE',
			key: 'NOMBRE',
			...getColumnSearchProps('NOMBRE'),
		},
		{
			title: 'Estado',
			dataIndex: 'ESTADO',
			key: 'ESTADO',
		},
	];

	const handleDatos = data => {
		setAbrirModal(false);
		setDatosModal(data);
		setMostrarListaPaciente(false);
	};

	const { getRemainingTime, getLastActiveTime } = useIdleTimer({
		timeout: 1000 * 60 * 60,
		onIdle: event => {
			if (!sesionCerrada) {
				Modal.confirm({
					title: 'Tu sesión ha expirado',
					content: (
						<div>
							<p>
								Permaneció mucho tiempo inactivo. <br /> Por favor vuelva a Iniciar Sesión.
							</p>
						</div>
					),
					onOk() {
						userSignOut(() => {
							history.push('/');
						});
					},
					onCancel() {
						setSesionCerrada(false);
					},
					cancelText: 'Quedarme Aqui',
					okText: 'Aceptar',
				});
				setSesionCerrada(true);
			}
		},
		onActive: event => {},
		onAction: event => {},
		debounce: 500,
	});

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			setCodEditarPaciente(selectedRows[0].key);
			setIsModalEdit(true);
		},
		getCheckboxProps: record => ({
			disabled: record.name === 'Disabled User',
			name: record.name,
		}),
	};

	return (
		<>
			{mostrarListaPaciente ? (
				<Card
					title={
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(2, 1fr)',
								gridTemplateRows: '1fr',
								gridColumnGap: '0px',
								gridRowGap: '0px',
								marginRight: '5%',
							}}
						>
							<div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px', paddingTop: '20px' }}>
								Registro de Pacientes
							</div>
							<div
								style={{
									gridArea: '1 / 2 / 2 / 3',
									display: 'flex',
									flexDirection: 'row-reverse',
									paddingTop: '15px',
								}}
							></div>
						</div>
					}
				>
					<Form
						layout="vertical"
						form={form}
						onSubmitCapture={handleSearch}
						onValuesChange={(changedValues, allValues) => {
							// UPPERCASE
							form.setFieldsValue({
								paterno: allValues.paterno?.toUpperCase().trim(),
								materno: allValues.materno?.toUpperCase().trim(),
								nombre: allValues.nombre?.toUpperCase().trim(),
							});
						}}
					>
						<Row style={{ flexDirection: 'row', paddingLeft: '5px', paddingRight: '5px' }}>
							<Col lg={6} md={8} sm={12} xs={24}>
								<Form.Item name="tipo" label="Tipo">
									<Select
										name="DOC_TIP_DOCUMENTO"
										value={datosSearch.DOC_TIP_DOCUMENTO}
										style={{ width: '100%' }}
										placeholder="Seleccione"
										loading={tipoDocumento.length <= 0}
										disabled={tipoDocumento.length <= 0}
										onChange={handleChangeTipoDocumento}
									>
										{tipoDocumento.map(element => (
											<Option key={element.key} value={element.COD_DOCUMENTO}>
												{element.DESCRIPCION}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>

							<Col lg={8} md={8} sm={12} xs={24}>
								<Form.Item
									name="numero"
									label="Número de documento"
									rules={[
										{
											len: 8,
											message: 'DNI invalido',
										},
									]}
								>
									<Input type="number" onChange={handleChangeNumDocumento} />
								</Form.Item>
							</Col>

							<Col lg={4} md={8} sm={12} xs={24}>
								<Button
									loading={loadingData}
									type="primary"
									htmlType="submit"
									disabled={!dataValida()}
									style={{ width: '100%', marginTop: '25px' }}
								>
									Buscar
								</Button>
							</Col>
						</Row>
						<Row style={{ flexDirection: 'row', paddingLeft: '5px', paddingRight: '5px' }}>
							<Col lg={6} md={8} sm={12} xs={24}>
								<Form.Item name="paterno" label="Apellido Paterno">
									<Input onChange={handleChangeApePaterno} />
								</Form.Item>
							</Col>
							<Col lg={6} md={8} sm={12} xs={24}>
								<Form.Item name="materno" label="Apellido Materno">
									<Input onChange={handleChangeApeMaterno} />
								</Form.Item>
							</Col>
							<Col lg={6} md={8} sm={12} xs={24}>
								<Form.Item name="nombre" label="Nombres">
									<Input onChange={handleChangeNombres} />
								</Form.Item>
							</Col>
						</Row>
					</Form>
					<Divider plain></Divider>
					<Table
						className="gx-table-responsive"
						columns={columns}
						dataSource={data}
						rowSelection={{
							type: 'radio',
							...rowSelection,
						}}
						loading={loadingData}
					/>
					<Divider plain></Divider>
					<Button type="primary" onClick={() => mostrarModal()}>
						Nuevo Paciente
					</Button>
					<Button type="primary" disabled={!codEditarPaciente} onClick={() => mostrarModalEditar()}>
						Mod Paciente
					</Button>
					<Button
						type="primary"
						disabled={!codEditarPaciente}
						onClick={() => setAbrirModalTriaje(true)}
					>
						Editar Pre triaje
					</Button>
					{/* <Button type="primary" disabled={!codEditarPaciente} onClick={() => {}}>Activar/Desactivar</Button> */}
					{/* <Button type="primary" onClick={() => {}}>Imprimir</Button>
					<Button type="primary" onClick={() => {}}>Ver histórico atenciones</Button>
					<Button type="primary" onClick={() => {}}>Resultados Lab. Pacientes</Button>
					<Button type="primary" onClick={() => {}}>Seleccionar pacientes</Button> */}
				</Card>
			) : (
				<DatosPaciente
					datosModal={datosModal}
					setMostrarListaPaciente={setMostrarListaPaciente}
					traerDatos={traerDatos}
				/>
			)}

			{abrirModal ? (
				<ModalDetalles
					abrirModal={abrirModal}
					setAbrirModal={setAbrirModal}
					filaActual={filaActual}
					handleDatos={handleDatos}
					codPaciente={codEditarPaciente}
					setCodEditarPaciente={setCodEditarPaciente}
					isModalEdit={isModalEdit}
					setIsModalEdit={setIsModalEdit}
					tipoDocumento={tipoDocumento}
					estadoCivil={estadoCivil}
					tipoPariente={tipoPariente}
					traerDatos={traerDatos}
				/>
			) : null}

			{abrirModalTriaje ? (
				<ModalTriaje
					visibleModal={abrirModalTriaje}
					setVisibleModal={setAbrirModalTriaje}
					codPaciente={codEditarPaciente}
				/>
			) : null}

			<ToastContainer pauseOnHover={false} />
		</>
	);
};

export default RegistroPaciente;
