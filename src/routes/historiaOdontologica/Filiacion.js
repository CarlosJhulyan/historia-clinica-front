import React, { createRef, useState, useEffect, useCallback } from 'react';
import { Col, Collapse, DatePicker, Form, Input, Row, Select, TimePicker } from 'antd';
import moment from 'moment';
import { DNI_REGEX, EDAD_REGEX, TELEFONO_REGEX, TEXTO_REGEX } from '../../util/constants';

const Filiacion = (props) => {
	const { datosModal, filaActual } = props;
	const fechaActual = new Date();
	const formatoFecha = 'DD/MM/YYYY';
	const { Option } = Select;
	// Los datos iniciales son los del modal
	// const estadoInicial = {
	//   nombrePaciente: "",
	//   dniPaciente: "",
	//   fechaNacimiento: moment('20/01/2000', formatoFecha),
	//   sexo: "",
	//   edadPaciente: "",
	//   nombreFamiliar: "",
	//   dniFamiliar: "",
	//   parentesco: "",
	//   telefono: "",
	//   fechaAtencion: moment(fechaActual, formatoFecha),
	//   horaAtencion: moment('12:30', 'HH:mm'),
	// };
	const [estado, setEstado] = useState();
	// referencia del formulario
	const formRef = createRef();

	const Panel = Collapse.Panel;

	console.log('filiacion: ', datosModal);
	//Setteos
	const handleChangeNombrePaciente = (e) => setEstado({ ...estado, PACIENTE: e.target.value });
	const handleChangeDni = (e) => {
		// Validar tamaño
		if (e.target.value.length < 9) {
			// Seteamos el valor si cumple la condicion
			formRef.current.setFieldsValue({ NUM_DOCUMENTO: e.target.value });
			setEstado({ ...estado, NUM_DOCUMENTO: e.target.value });
		} else {
			// ignoramos el nuevo valor y seguimos pasando el valor del estado sin modificar
			formRef.current.setFieldsValue({ NUM_DOCUMENTO: estado.NUM_DOCUMENTO });
		}
	};
	const handleChangeDniFamiliar = (e) => {
		const NUM_DOC_ACOM = e.target.value;
		if (NUM_DOC_ACOM.length < 9) {
			formRef.current.setFieldsValue({ NUM_DOC_ACOM });
			setEstado({ ...estado, NUM_DOC_ACOM });
		} else {
			formRef.current.setFieldsValue({ NUM_DOC_ACOM: estado.NUM_DOC_ACOM });
		}
	};
	const handleChangeFechaNacimiento = (e) => setEstado({ ...estado, FECHA_NAC_CLI: e });
	const handleChangeEdad = (e) => {
		const EDAD = e.target.value;
		if (EDAD.length < 4) {
			formRef.current.setFieldsValue({ EDAD });
			setEstado({ ...estado, EDAD });
		} else {
			formRef.current.setFieldsValue({ EDAD: estado.EDAD });
		}
	};
	const handleChangeSexo = (e) => setEstado({ ...estado, SEXO_CLI: e });
	const handleChangeNombreFamiliar = (e) => setEstado({ ...estado, NOM_ACOM: e.target.value });

	const handleChangeParentesco = (e) => setEstado({ ...estado, COD_TIP_ACOM: e.target.value });
	const handleChangeTelefono = (e) => {
		const FONO_CLI = e.target.value;
		if (FONO_CLI.length < 10) {
			formRef.current.setFieldsValue({ FONO_CLI });
			setEstado({ ...estado, FONO_CLI });
		} else {
			formRef.current.setFieldsValue({ FONO_CLI: estado.FONO_CLI });
		}
	};

	const handleChangeFechaAtencion = (e) => {
		console.log(estado.fechaAtencion);
	};

	const handleChangeHoraAtencion = (e) => {
		console.log(e);
	};

	//Validar

	//Enviar
	useEffect(() => {
		if (datosModal) {
			setEstado({
				...datosModal.estado,
				FECHA: moment(datosModal.estado.FECHA, formatoFecha),
				HORA: moment(datosModal.estado.HORA, 'HH:mm'),
			});
			console.log('DGFSJDFGJDFHJDFJGDFGJDFGJDFGJDFGJ', datosModal.estado);
			formRef.current.setFieldsValue(datosModal.estado);
		}
	}, [datosModal, setEstado]);

	console.log('Estado: ', estado);
	return (
		<Collapse defaultActiveKey={['1']}>
			<Panel header="1.FILIACION" key="1">
				<Form ref={formRef} layout="vertical" initialValues={estado}>
					<Row style={{ flexDirection: 'row' }}>
						<Col lg={12} md={12} sm={12} xs={24}>
							<Form.Item
								name="PACIENTE"
								label="Nombre y Apellidos"
								rules={[
									{
										required: true,
										pattern: TEXTO_REGEX,
										message: 'Ingrese un nombre válido',
									},
								]}
							>
								<Input
									type="text"
									placeholder="Ingrese el nombre y apellidos del paciente"
									onChange={handleChangeNombrePaciente}
								/>
							</Form.Item>
						</Col>
						<Col lg={5} md={5} sm={8} xs={24}>
							<Form.Item
								name="NUM_DOCUMENTO"
								label="DNI"
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
									placeholder="Ingrese el DNI"
									onChange={handleChangeDni}
									style={{ width: '100% ' }}
									value={datosModal ? datosModal.NUM_DOCUMENTO : null}
								/>
							</Form.Item>
						</Col>
						<Col lg={7} md={7} sm={12} xs={24}>
							<Form.Item
								name="FEC_NAC_CLI"
								label="Fecha de Nacimiento"
								rules={[
									{
										required: true,
										message: 'Ingrese una fecha de nacimiento',
									},
								]}
							>
								<DatePicker
									placeholder="Ingrese la fecha"
									className="gx-mb-3 gx-w-100"
									onChange={handleChangeFechaNacimiento}
									format={formatoFecha}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row style={{ flexDirection: 'row', marginTop: -15, marginBottom: 15 }}>
						<Col lg={5} md={12} sm={8} xs={12}>
							<Form.Item
								name="SEXO_CLI"
								label="Sexo"
								rules={[
									{
										required: true,
										message: 'Seleccione un sexo',
									},
								]}
							>
								<Select placeholder="Seleccione" onChange={handleChangeSexo}>
									<Option value="m">Hombre</Option>
									<Option value="f">Mujer</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col lg={5} md={12} sm={8} xs={12}>
							<Form.Item
								name="EDAD"
								label="Edad"
								rules={[
									{
										required: true,
										pattern: EDAD_REGEX,
										message: 'Ingrese una edad válida',
									},
								]}
							>
								<Input type="number" onChange={handleChangeEdad} style={{ width: '100% ' }} placeholder="35" />
							</Form.Item>
						</Col>
					</Row>
					<Row style={{ flexDirection: 'row' }}>
						<Col lg={12} md={12} sm={12} xs={24}>
							<Form.Item
								name="NOM_ACOM"
								label="Nombre y Apellidos del familiar"
								rules={[
									{
										pattern: TEXTO_REGEX,
										message: 'Ingrese un nombre válido',
									},
								]}
							>
								<Input
									type="text"
									onChange={handleChangeNombreFamiliar}
									placeholder="Ingrese el nombre y apellidos del familiar"
								/>
							</Form.Item>
						</Col>
						<Col lg={5} md={5} sm={12} xs={24}>
							<Form.Item
								name="NUM_DOC_ACOM"
								label="DNI"
								rules={[
									{
										pattern: DNI_REGEX,
										message: 'Ingrese un DNI válido',
									},
								]}
							>
								<Input
									type="number"
									placeholder="Ingrese el DNI del familiar"
									onChange={handleChangeDniFamiliar}
									style={{ width: '100% ' }}
								/>
							</Form.Item>
						</Col>
						<Col lg={7} md={7} sm={12} xs={24}>
							<Form.Item
								label="Parentesco"
								name="COD_TIP_ACOM"
								rules={[
									{
										pattern: TEXTO_REGEX,
										message: 'Ingrese un parentesco válido',
									},
								]}
							>
								<Input type="text" onChange={handleChangeParentesco} placeholder="Ingrese el parentesco" />
							</Form.Item>
						</Col>

						<Col lg={6} md={12} sm={12} xs={24}>
							<Form.Item
								name="FONO_CLI"
								label="Telefono"
								rules={[
									{
										required: true,
										pattern: TELEFONO_REGEX,
										message: 'Ingrese un telefono válido',
									},
								]}
							>
								<Input
									type="number"
									onChange={handleChangeTelefono}
									placeholder="912345678"
									style={{ width: '100% ' }}
								/>
							</Form.Item>
						</Col>
						<Col lg={6} md={12} sm={8} xs={24}>
							<Form.Item
								label="Fecha de Atención"
								name="FECrHA"
								rules={[
									{
										required: true,
										message: 'Ingrese una fecha de atención',
									},
								]}
							>
								<DatePicker
									placeholder="Ingrese la fecha de atención"
									className="gx-mb-3 gx-w-100"
									onChange={handleChangeFechaAtencion}
									format={formatoFecha}
								/>
							</Form.Item>
						</Col>
						<Col lg={6} md={24} sm={8} xs={24}>
							<Form.Item
								name="HORrA"
								label="Hora de Atención"
								rules={[
									{
										required: true,
										message: 'Ingrese una hora de atención',
									},
								]}
							>
								<TimePicker
									placeholder="Ingrese la hora de atención"
									onChange={handleChangeHoraAtencion}
									format="HH:mm"
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Panel>
		</Collapse>
	);
};
export default Filiacion;
