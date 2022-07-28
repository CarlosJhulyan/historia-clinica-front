import React, {
	createRef,
	useCallback,
	useEffect,
	useMemo,
	useState
} from 'react';

import {
	Col,
	DatePicker,
	Form,
	Input,
	Modal,
	Row,
	Select,
	Spin,
	notification,
	Button
} from 'antd';

import {
	DNI_REGEX,
	EDAD_REGEX,
	TELEFONO_REGEX,
	TEXTO_REGEX,
	CORREO_REGEX
} from '../../util/constants';
import moment from 'moment';
import { httpClient } from '../../util/Api';
import { getDepartamentos, getProvincias, getDistritos } from '../../util/Ubigeo';
import { useSelector } from 'react-redux';

const ModaDetalles = (props) => {
	const {
		abrirModal,
		setAbrirModal,
		codPaciente,
		isModalEdit,
		tipoDocumento,
		tipoPariente,
		estadoCivil,
		traerDatos
	} = props;
	const formatoFecha = 'DD/MM/yyyy';
	const { Option } = Select;
	const [isModalVisibleConfirm, setIsModalVisibleConfirm] = useState(false);
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const [estado, setEstado] = useState({
		SEXO_CLI: 'M',
		COD_TIP_DOCUMENTO: '01',
		COD_TIP_DOC_ACOM: '06',
		USU_CREA_PACIENTE: 'WEB_SERVICE_HC',
		EDAD_CLI: '0',
		COD_PACIENTE: '0',
		NRO_HC_ACTUAL: '',
		ESTADO_CIVIL: '180',
		NUM_DOCUMENTO: '',
		FEC_NAC_CLI: '',
		APE_PATERNO: '',
		APE_MATERNO: '',
		NOMBRE: '',
		DIR_CLI: '',
		COD_TIP_ACOM: '177'
	});
	const [botonModal, setBotonModal] = useState(false);
	const [loadingFetch, setLoadingFetch] = useState(false);
	const [loadingDataFetch, setLoadingDataFetch] = useState(false);
	const [dateFormat, setDateFormat] = useState('');
	const formRef = createRef();

	const datosPaciente = useMemo(() => {
		return {
			codGrupoCia: '001',
			codPaciente,
		};
	}, [codPaciente]);

  const showModalConfirm = () => {
		if (fieldsVoid()) {
			const isFieldValidating = formRef.current.getFieldsError().every(error => error.errors.length <= 0);
			if (isFieldValidating) {
				setIsModalVisibleConfirm(true);
			} else {
				formRef.current.getFieldsError().map(error => {
					if (error.errors.length >= 1) {
						openNotification('warning', 'Campo inválido', error.errors[0]);
					}
				})
			}
		}
  };

  const handleCancel = () => {
    setIsModalVisibleConfirm(false);
  };

	const openNotification = (type, message, description) => {
		notification[type]({
			message,
			description,
		});
	};
	const handleChangeDni = (e) => {
		if (e.target.value.length < 9) {
			formRef.current.setFieldsValue({ numeroDoc: e.target.value });
			setEstado({ ...estado, NUM_DOCUMENTO: e.target.value });
		} else {
			formRef.current.setFieldsValue({ numeroDoc: estado.NUM_DOCUMENTO });
		}
	};
	const handleChangeDniFamiliar = (e) => {
		const NUM_DOC_ACOM = e.target.value;
		if (NUM_DOC_ACOM.length < 9) {
			formRef.current.setFieldsValue({ numDocAcom: NUM_DOC_ACOM });
			setEstado({ ...estado, NUM_DOC_ACOM });
		} else {
			formRef.current.setFieldsValue({ numDocAcom: estado.NUM_DOC_ACOM });
		}
	};
	const handleChangeFechaNacimiento = (e) => {
		if (e) {
			setEstado({ ...estado, FEC_NAC_CLI: moment(e?._d).format(formatoFecha) });
			setDateFormat(e);
		}
	};
	const handleChangeEdad = (e) => {
		const EDAD_CLI = e.target.value;
		if (EDAD_CLI.length < 4) {
			formRef.current.setFieldsValue({ edad: EDAD_CLI });
			setEstado({ ...estado, EDAD_CLI });
		} else {
			formRef.current.setFieldsValue({ edad: estado.EDAD_CLI });
		}
	};
	const handleChangeSexo = (value) => setEstado({ ...estado, SEXO_CLI: value });
	const handleChangeTipoDocumentoAcom = (value) => setEstado({ ...estado, COD_TIP_DOC_ACOM: value });
	const handleChangeTipoAcom = (value) => setEstado({ ...estado, COD_TIP_ACOM: value });

	const handleChangeTelefono = (e) => {
		const FONO_CLI = e.target.value;
		if (FONO_CLI.length < 10) {
			formRef.current.setFieldsValue({ fono: FONO_CLI });
			setEstado({ ...estado, FONO_CLI });
		} else formRef.current.setFieldsValue({ fono: estado.FONO_CLI });
	};

	const handleChangeCelular = e => {
		const CELL_CLI = e.target.value;
		if (CELL_CLI.length < 10) {
			formRef.current.setFieldsValue({ celu: CELL_CLI });
			setEstado({ ...estado, CELL_CLI });
		} else formRef.current.setFieldsValue({ celu: estado.CELL_CLI });
	}

	const handleChangeEmail = e => {
		const EMAIL = e.target.value;
		formRef.current.setFieldsValue({ e_mail: EMAIL });
		setEstado({ ...estado, EMAIL });
	}

	const handleChangeDep = value => setEstado({ ...estado, DEP_UBIGEO: value });
	const handleChangeProv = value => setEstado({ ...estado, PRV_UBIGEO: value });
	const handleChangeDis = value => setEstado({ ...estado, DIS_UBIGEO: value });
	const handleChangeTextUpper = e => setEstado({ ...estado, [e.target.name]: e.target.value.toUpperCase() });

	const handleChangeCodTipoDoc = (e) => setEstado({ ...estado, COD_TIP_DOCUMENTO: e });
	const handleChangeEstadoCivil = (value) => setEstado({ ...estado, ESTADO_CIVIL: value });

	const traerDatosPaciente = useCallback(async () => {
		setLoadingDataFetch(true);
		try {
			const { data } = await httpClient.post(`/pacientes/getPaciente`, datosPaciente);
			data.data.COD_LOCAL_ANTECENDENTE = data.data.COD_LOCAL_ANTECENDENTE === null ? '001' : data.data.COD_LOCAL_ANTECENDENTE;
			data.data.SECUENCIA_ANTECEDENTE = data.data.SECUENCIA_ANTECEDENTE === null ? '0' : data.data.SECUENCIA_ANTECEDENTE;
			setEstado({
				...estado,
				...data.data,
				USU_CREA_PACIENTE: JSON.parse(localStorage.getItem('token')).usuario,
				EDAD_CLI: moment(data.data.FEC_NAC_CLI, formatoFecha).fromNow().substring(5, 8).trim()
			});
			setDateFormat(moment(data.data?.FEC_NAC_CLI, 'DD/MM/yyyy'));
			setBotonModal(false);
		} catch (e) {
			openNotification('error', 'Error Datos Paciente', 'No se pudo traer los datos del paciente, intente de nuevo.')
		}
		setLoadingDataFetch(false);
	}, [datosPaciente, estado]);

	useEffect(() => {
		if (codPaciente && isModalEdit) {
			traerDatosPaciente();
		}
	}, [codPaciente, isModalEdit]);

	useEffect(() => {
		formRef.current?.setFieldsValue({
			numeroDoc: estado.NUM_DOCUMENTO,
			numDocAcom: estado.NUM_DOC_ACOM,
			edad: moment(estado.FEC_NAC_CLI, formatoFecha).fromNow().substring(5, 8).trim(),
			fono: estado.FONO_CLI,
			celu: estado.CELL_CLI,
			e_mail: estado.EMAIL
		});
	}, [
		estado.NUM_DOCUMENTO,
		estado.NUM_DOC_ACOM,
		formRef,
		estado.FEC_NAC_CLI,
		estado.FONO_CLI,
		estado.CELL_CLI,
		estado.EMAIL
	]);


	const upsertPaciente = async () => {
		setLoadingFetch(true);
		try {
			const { data } = await httpClient.post(`/pacientes/upsertPaciente`, estado);
			if (data.success) {
				setAbrirModal(false);
				openNotification('success', 'Acción exitosa', data.message);
				if (isModalEdit) {
					traerDatos(false);
				}
			} else {
				openNotification('warning', 'Ocurio un problema', data.message);
			}
			setLoadingFetch(false);
			setIsModalVisibleConfirm(false);
		} catch (e) {
			openNotification('error', 'Ocurrio un error', e.message);
		}
	}

	const fieldsVoid = () => {
		if (!estado.COD_TIP_DOCUMENTO) openNotification('warning', 'Dato faltante', 'Seleccione el tipo de documento');
		else if (estado.NUM_DOCUMENTO.trim() === '') openNotification('warning', 'Dato faltante', 'Ingrese el DNI');
		else if (estado.FEC_NAC_CLI.trim() === '') openNotification('warning', 'Dato faltante', 'Seleccione la fecha de nacimiento');
		else if (estado.SEXO_CLI.trim() === '') openNotification('warning', 'Dato faltante', 'Seleccione el sexo');
		else if (estado.APE_PATERNO.trim() === '') openNotification('warning', 'Dato faltante', 'Apellido Paterno obligatorio');
		else if (estado.APE_MATERNO.trim() === '') openNotification('warning', 'Dato faltante', 'Apellido Materno obligatorio');
		else if (estado.NOMBRE.trim() === '') openNotification('warning', 'Dato faltante', 'Nombres obligatorio');
		else if (estado.ESTADO_CIVIL.trim() === '') openNotification('warning', 'Dato faltante', 'Seleccione el estado civil');
		else if (!estado.DEP_UBIGEO) openNotification('warning', 'Dato faltante', 'Seleccione el departamento');
		else if (!estado.PRV_UBIGEO) openNotification('warning', 'Dato faltante', 'Seleccione la provincia');
		else if (!estado.DIS_UBIGEO) openNotification('warning', 'Dato faltante', 'Seleccione el distrito');
		else if (estado.DIR_CLI.trim() === '') openNotification('warning', 'Dato faltante', 'Dirección obligatoria');
		else if (estado.COD_TIP_ACOM.trim() === '') openNotification('warning', 'Dato faltante', 'Seleccione el tipo del acompañante');
		else if (estado.COD_TIP_DOC_ACOM.trim() === '') openNotification('warning', 'Dato faltante', 'Seleccione el tipo de documento del acompañante');
		else return true;
		return false;
	}

	const handleCloseModal = () => {
		setAbrirModal(false);
	}

	return (
		<>
			<Modal
        centered
				width={900}
				footer={[
					<Button disabled={loadingDataFetch} onClick={() => handleCloseModal()}>
						Cancelar
					</Button>,
					<Button
            loading={loadingDataFetch}
            onClick={() => {
						  showModalConfirm();
					  }}
            style={{
              background: themeSettingsGlobal.COD_COLOR_1,
              color: '#fff'
            }}
          >
						{
							isModalEdit ? 'Modificar' : 'Registrar'
						}
					</Button>
				]}
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
						<div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px' }}>Datos del paciente:</div>
						<div
							style={{
								gridArea: '1 / 2 / 2 / 3',
								display: 'flex',
								flexDirection: 'row-reverse',
							}}
						>
							{
								isModalEdit ? `Nº Historia Clínica: ${estado.NRO_HC_ACTUAL}` : 'Nuevo Paciente'
							}
						</div>
					</div>
				}
				visible={abrirModal}
				okButtonProps={{
					disabled: botonModal,
				}}
				onCancel={() => handleCloseModal()}
			>
				{loadingDataFetch ?
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<Spin tip="Cargando" />
					</div> :
					<Form ref={formRef} layout="vertical" initialValues={estado}>
					<Row
						style={{
							flexDirection: 'row',
							marginTop: -15,
							marginBottom: 15,
						}}
					>
						<Col lg={5} md={10} sm={8} xs={24}>
							<Form.Item
								label="Tipo de documento"
								rules={[
									{
										required: false,
										message: 'Seleccione el tipo de documento',
									},
								]}
							>
								<Select
									name="COD_TIP_DOCUMENTO"
									value={estado.COD_TIP_DOCUMENTO.trim()}
									placeholder="Seleccione"
									onChange={handleChangeCodTipoDoc}
								>
									{
										tipoDocumento.map(element =>
											<Option key={element.key} value={element.COD_DOCUMENTO}>
												{element.DESCRIPCION}
											</Option>
											)
									}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={6} md={7} sm={8} xs={24}>
							<Form.Item
								label="DNI"
								name='numeroDoc'
								rules={[
									{
										required: true,
										pattern: DNI_REGEX,
										message: 'Ingrese un DNI válido',
									},
								]}
							>
								<Input
									type="number"
									name="NUM_DOCUMENTO"
									value={estado.NUM_DOCUMENTO}
									placeholder="Ingrese el DNI"
									onChange={handleChangeDni}
									style={{ width: '100% ' }}
								/>
							</Form.Item>
						</Col>
						<Col lg={5} md={7} sm={12} xs={24}>
							<Form.Item
								label="Fecha de Nacimiento"
								rules={[
									{
										required: true,
										message: 'Ingrese una fecha de nacimiento',
									},
								]}
							>
								<DatePicker
									name="FEC_NAC_CLI"
									value={dateFormat}
									placeholder="Ingrese la fecha"
									className="gx-mb-3 gx-w-100"
									onChange={handleChangeFechaNacimiento}
									format={formatoFecha}
								/>
							</Form.Item>
						</Col>
						<Col lg={3} md={12} sm={8} xs={9}>
							<Form.Item
								label="Edad"
								name='edad'
								rules={[
									{
										required: false,
										pattern: EDAD_REGEX,
										message: 'Ingrese una edad válida',
									},
								]}
							>
								<Input
									name="EDAD_CLI"
									value={estado.EDAD_CLI}
									disabled
									type="number" onChange={handleChangeEdad} />
							</Form.Item>
						</Col>
						<Col lg={5} md={12} sm={8} xs={15}>
							<Form.Item
								label="Sexo"
								rules={[
									{
										required: false,
										message: 'Seleccione un sexo',
									},
								]}
							>
								<Select
									placeholder="Seleccione"
									onChange={handleChangeSexo}
									value={estado?.SEXO_CLI.toUpperCase()}
									name="SEXO_CLI"
										>
									<Option value="M">Hombre</Option>
									<Option value="F">Mujer</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row
						style={{
							flexDirection: 'row',
							marginTop: -15,
							marginBottom: 15,
						}}
					>
						<Col lg={7} md={12} sm={12} xs={24}>
							<Form.Item
								fieldKey='APE_PATERNO'
								label="Apellido Paterno"
								rules={[
									{
										required: true,
										pattern: TEXTO_REGEX,
										message: 'Ingrese un nombre válido',
									},
								]}
							>
								<Input
									value={estado.APE_PATERNO}
									name="APE_PATERNO"
									type="text"
									placeholder="Ingrese el apellido paterno del paciente"
									onChange={handleChangeTextUpper}
								/>
							</Form.Item>
						</Col>
						<Col lg={7} md={12} sm={12} xs={24}>
							<Form.Item
								label="Apellido Materno"
								rules={[
									{
										required: true,
										pattern: TEXTO_REGEX,
										message: 'Ingrese un nombre válido',
									},
								]}
							>
								<Input
									value={estado.APE_MATERNO}
									name="APE_MATERNO"
									type="text"
									placeholder="Ingrese el apellido materno del paciente"
									onChange={handleChangeTextUpper}
								/>
							</Form.Item>
						</Col>
						<Col lg={10} md={12} sm={12} xs={24}>
							<Form.Item
								label="Nombres"
								rules={[
									{
										required: true,
										pattern: TEXTO_REGEX,
										message: 'Ingrese un nombre válido',
									},
								]}
							>
								<Input
									value={estado.NOMBRE}
									type="text"
									name='NOMBRE'
									placeholder="Ingrese los nombres del paciente"
									onChange={handleChangeTextUpper}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row
						style={{
							flexDirection: 'row',
							marginTop: -15,
							marginBottom: 15,
						}}
					>
						<Col lg={4} md={12} sm={8} xs={24}>
							<Form.Item
								label="Estado civil"
								rules={[
									{
										required: false,
										message: 'Seleccione el tipo de documento',
									},
								]}
							>
								<Select
									name="ESTADO_CIVIL"
									value={estado.ESTADO_CIVIL.trim()}
									placeholder="Seleccione"
									onChange={handleChangeEstadoCivil}
								>
									{
										estadoCivil.map(element =>
											<Option key={element.key} value={element.COD_EST_CIVIL}>
												{element.DESCRIPCION}
											</Option>
											)
									}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={5} md={12} sm={12} xs={24}>
							<Form.Item
								label="Telefono"
								name='fono'
								rules={[
									{
										required: false,
										pattern: TELEFONO_REGEX,
										message: 'Ingrese un telefono válido',
									},
								]}
							>
								<Input
									name="FONO_CLI"
									type="number"
									value={estado.FONO_CLI}
									onChange={handleChangeTelefono}
									placeholder="912345678"
									style={{ width: '100% ' }}
								/>
							</Form.Item>
						</Col>
						<Col lg={5} md={12} sm={12} xs={24}>
							<Form.Item
								label="Celular"
								name='celu'
								rules={[
									{
										required: false,
										pattern: TELEFONO_REGEX,
										message: 'Ingrese un celular válido',
									},
								]}
							>
								<Input
									name="CELL_CLI"
									value={estado.CELL_CLI}
									type="number"
									onChange={handleChangeCelular}
									placeholder="912345678"
									style={{ width: '100% ' }}
								/>
							</Form.Item>
						</Col>
						<Col lg={10} md={12} sm={12} xs={24}>
							<Form.Item
								label="E-mail"
								name='e_mail'
								rules={[
									{
										required: false,
										pattern: CORREO_REGEX,
										message: 'Ingrese un correo válido',
									},
								]}
							>
								<Input
									name="EMAIL"
									value={estado.EMAIL}
									type="text"
									placeholder="Ingrese el correo del paciente"
									onChange={handleChangeEmail}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row
						style={{
							flexDirection: 'row',
							marginTop: -15,
							marginBottom: 15,
						}}
					>
						<Col lg={4} md={12} sm={8} xs={24}>
							<Form.Item
								label="Departamento"
								rules={[
									{
										required: true,
										message: 'Seleccione el departamento',
									},
								]}
							>
								<Select
									name="DEP_UBIGEO"
									value={estado.DEP_UBIGEO}
									showSearch
									placeholder="Selecione un departamento"
									optionFilterProp="children"
									onChange={handleChangeDep}
									filterOption={(input, option) =>
										option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
									}
								>
									{getDepartamentos().map((element) => {
										return (
											<Option key={element.ubigeo} value={element.ubigeo}>
												{element.nombre}
											</Option>
										);
									})}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={5} md={12} sm={12} xs={24}>
							<Form.Item
								label="Provincia"
								rules={[
									{
										required: true,
										message: 'Seleccione una provincia',
									},
								]}
							>
								<Select
									name="PRV_UBIGEO"
									value={estado.PRV_UBIGEO}
									showSearch
									placeholder="Selecione una provincia"
									optionFilterProp="children"
									onChange={handleChangeProv}
									filterOption={(input, option) =>
										option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
									}
								>
									{getProvincias(estado.DEP_UBIGEO).map((element) => {
										return (
											<Option key={element.ubigeo} value={element.ubigeo}>
												{element.nombre}
											</Option>
										);
									})}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={7} md={12} sm={12} xs={24}>
							<Form.Item
								label="Distrito"
								rules={[
									{
										required: true,
										message: 'Seleccione un distrito',
									},
								]}
							>
								<Select
									name="DIS_UBIGEO"
									value={estado.DIS_UBIGEO}
									showSearch
									placeholder="Selecione un distrito"
									optionFilterProp="children"
									onChange={handleChangeDis}
									filterOption={(input, option) =>
										option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
									}
								>
									{getDistritos(estado.DEP_UBIGEO, estado.PRV_UBIGEO).map((element) => {
										return (
											<Option key={element.ubigeo} value={element.ubigeo}>
												{element.nombre}
											</Option>
										);
									})}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={8} md={12} sm={12} xs={24}>
							<Form.Item
								label="Dirección"
								rules={[
									{
										required:true,
										pattern: TEXTO_REGEX,
										message: 'Ingrese una dirección',
									},
								]}
							>
								<Input
									name="DIR_CLI"
									value={estado.DIR_CLI}
									type="text"
									onChange={handleChangeTextUpper}
									placeholder="Ingrese una dirección"
								/>
							</Form.Item>
						</Col>
					</Row>

					<Row
						style={{
							flexDirection: 'row',
							marginTop: -15,
							marginBottom: 15,
						}}
					>
						<Col lg={3} md={12} sm={8} xs={24}>
							<Form.Item
								label="Acompañante"
								rules={[
									{
										required: false,
										message: 'Seleccione el tipo de documento',
									},
								]}
							>
								<Select
									name="COD_TIP_ACOM"
									value={estado.COD_TIP_ACOM}
									placeholder="Seleccione" onChange={handleChangeTipoAcom}>
									{tipoPariente.map((e) => (
										<Option key={e.key} value={e.key}>
											{e.DESCRIPCION}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={11} md={12} sm={12} xs={24}>
							<Form.Item
								label="Nombre y Apellidos del acompañante"
								rules={[
									{
										pattern: TEXTO_REGEX,
										message: 'Ingrese un nombre válido',
									},
								]}
							>
								<Input
									name="NOM_ACOM"
									value={estado.NOM_ACOM}
									type="text"
									onChange={handleChangeTextUpper}
									placeholder="Ingrese el nombre y apellidos del familiar"
								/>
							</Form.Item>
						</Col>
						<Col lg={5} md={12} sm={8} xs={24}>
							<Form.Item
								label="Tipo de documento"
								rules={[
									{
										required: false,
										message: 'Seleccione el tipo de documento',
									},
								]}
							>
								<Select
									name="COD_TIP_DOC_ACOM"
									value={estado.COD_TIP_DOC_ACOM.trim()}
									placeholder="Seleccione"
									onChange={handleChangeTipoDocumentoAcom}
								>
									{
										tipoDocumento.map(element =>
											<Option key={element.key} value={element.COD_DOCUMENTO}>
												{element.DESCRIPCION}
											</Option>
											)
									}
								</Select>
							</Form.Item>
						</Col>
						<Col lg={5} md={5} sm={12} xs={24}>
							<Form.Item
								label="DNI"
								name='numDocAcom'
								rules={[
									{
										pattern: DNI_REGEX,
										message: 'Ingrese un DNI de acompañante válido',
									},
								]}
							>
								<Input
									name="NUM_DOC_ACOM"
									value={estado.NUM_DOC_ACOM}
									type="number"
									placeholder="Ingrese el DNI del familiar"
									onChange={handleChangeDniFamiliar}
									style={{ width: '100% ' }}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>
				}
			</Modal>

			<Modal
				title="Confirmación"
				visible={isModalVisibleConfirm}
				onCancel={handleCancel}
				footer={[
					<Button
						disabled={loadingFetch}
						onClick={handleCancel}>
							Cambiar datos
					</Button>,
					<Button
						onClick={async () => {
							upsertPaciente();
						}}
						loading={loadingFetch}
            style={{
              background: themeSettingsGlobal.COD_COLOR_1,
              color: '#fff'
            }}
          >
							{isModalEdit ? 'Modificar' : 'Registrar'}
					</Button>,
				]}>
        <p>¿Esta seguro que quiere {isModalEdit ? 'modificar' : 'registrar'} este paciente? Asegúrese que los datos estan correctos</p>
      </Modal>
		</>
	);
};
export default ModaDetalles;
