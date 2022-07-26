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
import React, { createRef, useCallback, useEffect, useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { httpClient } from '../../../util/Api';
import ModalDetalles from '../../registroPaciente/modalDetalles';
import ModalTriaje from '../../registroPaciente/modalTriaje';
import moment from 'moment';
import { notificaciones, openNotification } from '../../../util/util';
import { useSelector } from 'react-redux';

const { Option } = Select;

const ModalListaPacientes = ({ visible, setVisible, setPacienteCurrent, setClienteCurrent }) => {
	const { confirm } = Modal;
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const [abrirModal, setAbrirModal] = useState(false);
	const [abrirModalTriaje, setAbrirModalTriaje] = useState(false);
	const [visibleModalCreateClient, setVisibleModalCreateClient] = useState(false);
	const [filaActual, setFilaActual] = useState({});
	const [data, setData] = useState();
	const [loadingData, setLoadingData] = useState(false);
	const [datosModal, setDatosModal] = useState({});
	const [mostrarListaPaciente, setMostrarListaPaciente] = useState(true);
	const [codEditarPaciente, setCodEditarPaciente] = useState(null);
	const [isModalEdit, setIsModalEdit] = useState(false);
	const [tipoDocumento, setTipoDocumento] = useState([]);
	const [tipoPariente, setTipoPariente] = useState([]);
	const [estadoCivil, setEstadoCivil] = useState([]);
	const [loadingDataSelect, setLoadingDataSelect] = useState(false);
	const [pacienteActual, setPacienteActual] = useState({});

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
    form.setFieldsValue({
      DOC_TIP_DOCUMENTO: '01'
    });
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

	const [form] = Form.useForm();

	const traerDatos = useCallback(
		async (noMessage = 'false', values) => {
			setLoadingData(true);
			try {
				const { data } = await httpClient.post(`/pacientes/searchPacientes`, {
          ...datosSearch,
          ...values
        });
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
				</Space>
			</div>
		),
		filterIcon: filtered => <SearchOutlined style={{ color: filtered ? themeSettingsGlobal.COD_COLOR_1 : undefined }} />,
		onFilter: (value, record) =>
			record[dataIndex]
				? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
				: '',
	});

	const handleSearch = async (values) => {
		if (dataValida()) {
			const dataOld = data;
			await traerDatos('false', values);
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

	const traerDatosPaciente = async () => {
		setLoadingDataSelect(true);
		try {
			const {
				data: { data, success },
			} = await httpClient.post(`/pacientes/getPaciente`, {
				codGrupoCia: '001',
				codPaciente: codEditarPaciente,
			});

			if (success) {
				setPacienteCurrent(data);
				const edad = Math.round(
					moment().diff(moment(data.FEC_NAC_CLI, 'DD/MM/yyyy'), 'years', true)
				);

				if (edad >= 18) {
					const existe = await existeCliente(data.NUM_DOCUMENTO);
					if (!existe) return;

					if (existe === 'S') {
						// INSERTAR DATOS CON EL COD_CLI
						const cliente = await traerDataClientesPorDocumento(data.NUM_DOCUMENTO);
						openNotification('success', 'Ingreso Paciente', 'Paciente agregado correctamente');
						setClienteCurrent(cliente);
						setVisible(false);
					} else {
						// ABRIR MODAL PARA INSERTAR DATOS DE CLIENTE
						confirm({
							content: 'El paciente no esta registrado como cliente, ¿Quiere continuar?',
							onOk: () => {
								setPacienteActual(data);
								setVisibleModalCreateClient(true);
							},
							okText: 'Continuar',
							cancelText: 'Atrás',
							centered: true,
						});
					}
				} else {
					confirm({
						content:
							'El paciente es MENOR de edad, por favor seleccioné un cliente apoderado o tutor.',
						okCancel: false,
						okText: 'Aceptar',
            centered: true,
					});
					setVisible(false);
				}
			}
		} catch (e) {
			openNotification(
				'error',
				'Error Datos Paciente',
				'No se pudo traer los datos del paciente, intente de nuevo.'
			);
		}
		setLoadingDataSelect(false);
	};

	const traerDataClientesPorDocumento = async numDoc => {
		const {
			data: { success, data },
		} = await httpClient.post('posventa/getClientesDocPosVenta', {
			codGrupoCia: '001',
			codLocal: '001',
			documento: numDoc,
		});

		if (success) return data[0];
	};

	const existeCliente = async numDoc => {
		try {
			const {
				data: { data, success },
			} = await httpClient.post('posventa/existeCliente', {
				numDoc,
			});
			if (success) return data.trim();
		} catch (e) {
			console.error(e);
		}
	};

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

	// useEffect(() => {
	// 	const abc = form.getFieldsValue();
	// 	console.log(abc);
	// 	form.setFieldsValue({
	// 		paterno: abc.paterno?.toUpperCase().trim(),
	// 	});
	// }, [form]);

	return (
		<>
			<Modal
				centered
				width={1100}
				visible={visible}
				title="Ingrese Datos de Paciente"
				className="modal-posventa"
				onCancel={() => setVisible(false)}
				footer={[
					<Button
						style={{
							background: '#36AE7C',
						}}
						onClick={() => mostrarModal()}
					>
						<p style={{ color: 'white' }}>Nuevo Paciente</p>
					</Button>,
					<Button disabled={!codEditarPaciente} onClick={() => mostrarModalEditar()}>
						Modificar Paciente
					</Button>,
					// <Button disabled={!codEditarPaciente} onClick={() => setAbrirModalTriaje(true)}>Editar Pre Triaje</Button>,
					<Button
						loading={loadingDataSelect}
						disabled={!codEditarPaciente}
						onClick={() => traerDatosPaciente()}
					>
						Seleccionar Paciente
					</Button>,
					<Button
						style={{
							background: '#EB5353',
						}}
						onClick={() => setVisible(false)}
					>
						<p style={{ color: 'white' }}>Cerrar</p>
					</Button>,
				]}
			>
				<Form
					layout="vertical"
					form={form}
					onFinish={handleSearch}
          onFieldsChange={(e) => {
            form.setFieldsValue({
              [e[0].name]: e[0].value?.toUpperCase()
            });
          }}
				>
					<Row
						style={{
							flexDirection: 'row',
							paddingLeft: '5px',
							paddingRight: '5px',
							marginTop: '10px',
						}}
					>
						<Col lg={6} md={8} sm={12} xs={24}>
							<Form.Item name="DOC_TIP_DOCUMENTO" label="Tipo">
								<Select
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
								name="NUM_DOCUMENTO"
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
								htmlType="submit"
								disabled={!dataValida()}
								style={{ width: '100%', marginTop: '25px', background: themeSettingsGlobal.COD_COLOR_1, color: '#fff' }}
							>
								Buscar
							</Button>
						</Col>
					</Row>
					<Row style={{ flexDirection: 'row', paddingLeft: '5px', paddingRight: '5px' }}>
						<Col lg={6} md={8} sm={12} xs={24}>
							<Form.Item name="APE_PATERNO" label="Apellido Paterno">
								<Input onChange={handleChangeApePaterno} />
							</Form.Item>
						</Col>
						<Col lg={6} md={8} sm={12} xs={24}>
							<Form.Item name="APE_MATERNO" label="Apellido Materno">
								<Input onChange={handleChangeApeMaterno} />
							</Form.Item>
						</Col>
						<Col lg={6} md={8} sm={12} xs={24}>
							<Form.Item name="NOMBRE" label="Nombres">
								<Input onChange={handleChangeNombres} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
				<Divider plain></Divider>
				<Table
					style={{ marginRight: 10, marginLeft: 10 }}
					className="gx-table-responsive"
					columns={columns}
					dataSource={data}
					rowSelection={{
						type: 'radio',
						...rowSelection,
					}}
					loading={loadingData}
          scroll={{
            y: 210
          }}
          size='small'
				/>
			</Modal>

			{visibleModalCreateClient && (
				<ModalNewCliente
					setVisible={setVisibleModalCreateClient}
					visible={visibleModalCreateClient}
					currentPaciente={pacienteActual}
					setVisibleModalSeleccion={setVisible}
					setClienteCurrent={setClienteCurrent}
					traerDataClientesPorDocumento={traerDataClientesPorDocumento}
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
		</>
	);
};

function ModalNewCliente({
	visible,
	setVisible,
	currentPaciente,
	setVisibleModalSeleccion,
	traerDataClientesPorDocumento,
	setClienteCurrent,
}) {
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [natural, setNatural] = useState(currentPaciente.COD_TIP_DOCUMENTO !== '01');

	useEffect(() => {
		form.setFieldsValue({
			documento: currentPaciente.NUM_DOCUMENTO,
			telefono: currentPaciente.CELL_CLI,
			correo: currentPaciente.CORREO,
			nombre: currentPaciente.NOMBRE,
			apellidoP: currentPaciente.APE_PATERNO,
			apellidoM: currentPaciente.APE_MATERNO,
			direccion: currentPaciente.DIR_CLI,
			razonSocial: currentPaciente.TIP_DOCUMENTO,
		});
	}, []);

	const guardar = async () => {
		const token = JSON.parse(localStorage.getItem('token'));
		const { documento, telefono, correo, nombre, apellidoP, apellidoM, direccion, razonSocial } =
			form.getFieldsValue();

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

		setLoading(true);

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

		const cliente = await traerDataClientesPorDocumento(documento);
		openNotification('success', 'Ingreso Paciente y cliente', 'Paciente agregado correctamente');
		setClienteCurrent(cliente);
		setLoading(false);
		setVisible(false);
		setVisibleModalSeleccion(false);
	};

	return (
		<Modal
			centered
			width={700}
			visible={visible}
			closable={false}
			title="Nuevo Cliente"
			footer={[
				<Button onClick={() => setVisible(false)}>Cancelar</Button>,
				<Button
					htmlType="submit"
					style={{ background: themeSettingsGlobal.COD_COLOR_1, color: '#fff' }}
					form="form-new-cliente"
					loading={loading}
				>
					Grabar
				</Button>,
			]}
		>
			<Form
				id="form-new-cliente"
				form={form}
				labelCol={{ span: 7 }}
				wrapperCol={{ span: 17 }}
				onFinish={guardar}
			>
				<Row>
					<Col span={12}>
						<Form.Item
							name="documento"
							label="DNI o RUC"
							style={{ margin: 0 }}
							rules={[{ required: true, max: 11, min: 8 }]}
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
							<Input size="small" />
						</Form.Item>
						<Form.Item name="apellidoP" label="Ape. Pat" style={{ margin: 0 }}>
							<Input size="small" />
						</Form.Item>
						<Form.Item name="apellidoM" label="Ape. Mat" style={{ margin: 0 }}>
							<Input size="small" />
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
							<Input size="small" disabled={natural} />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
}

export default ModalListaPacientes;
