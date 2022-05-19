import React, { createRef, useState, useEffect } from 'react';
import { Button, Col, Collapse, DatePicker, Form, Input, Row, Select, TimePicker, Typography } from 'antd';
import { Odontograma } from '../../odontograma/odontograma';
import { useDispatch, useSelector } from 'react-redux';
import { httpClient } from '../../../util/Api';
import { DienteAdulto } from '../../../models/DienteAdulto';
import { SaveOutlined } from '@ant-design/icons';
import { ModalGuardar } from '../../../components/modal/ModalGuardar';

const Odonto = (props) => {
	const { datosModal, valorScala, setValorScala, setEstadosOdontograma, estadosOdontograma } = props;

	const [estado, setEstado] = useState({ especificaciones: '', observaciones: '' });
	const [modalGuardar, setModalGuardar] = useState(false);

	//  const [habilitarCambio, setHabilitarCambio] = useState(false);

	// referencia del formulario
	const formRef = createRef();

	//Setteos
	const handleEspecificaciones = (value) => {
		formRef.current.setFieldsValue({ especificaciones: value.target.value });
		setEstado({ ...estado, especificaciones: value.target.value });
	};

	const handleObservaciones = (value) => {
		formRef.current.setFieldsValue({ observaciones: value.target.value });
		setEstado({ ...estado, observaciones: value.target.value });
	};

	const dispatch = useDispatch();

	const usuario = JSON.parse(localStorage.getItem('token'));

	//DATA DEL DIENTE
	const diente = new DienteAdulto();
	let diente2 = diente;
	const estadoDiente = useSelector((state) => state.dientePrueba.diente);
	diente2.importar(estadoDiente);

	//REGISTRAR DIENTE
	const registrarDatos = async () => {
		const body = {
			COD_PACIENTE: datosModal.estado.COD_PACIENTE,
			COD_GRUPO_CIA: datosModal.estado.COD_GRUPO_CIA,
			COD_MEDICO: usuario.cod_medico,
			DETALLES: 'aaaa',
			OBSERVACIONES: estado.observaciones,
			ESPECIFICACIONES: estado.especificaciones,
			data: diente2,
		};
		console.log('BODY::: ', body);
		const data = await httpClient.post(`/odontograma/registrar`, body);
		console.log('DATA:::', data);
	};

	useEffect(() => {
		if (estado.observaciones !== '' && estado.especificaciones !== '') {
			formRef.current.setFieldsValue({ especificaciones: estado.especificaciones });
			formRef.current.setFieldsValue({ observaciones: estado.observaciones });
		}
	}, [estado]);

	console.log('DATAAAAAAAAAAAAAAAAAAAAAA:', estado);

	const { Title } = Typography;

	return (
		<>
			<Odontograma
				datosModal={datosModal}
				// estadosOdontograma={estadosOdontograma}
				setEstado={setEstado}
				// setEstadosOdontograma={setEstadosOdontograma}
				valorScala={valorScala}
				setValorScala={setValorScala}
				estado={estado}
			/>

			<Form style={{}} ref={formRef} layout="vertical" initialValues={estado}>
				<Row style={{ flexDirection: 'row' }}>
					<Col lg={12} md={12} sm={24} xs={24} style={{ marginTop: 30 }}>
						<Form.Item layout="vertical" name="especificaciones" label={<Title level={4}>Especificaciones</Title>}>
							<Input.TextArea rows="5" onChange={handleEspecificaciones} />
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={24} xs={24} style={{ marginTop: 30 }}>
						<Form.Item layout="vertical" name="observaciones" label={<Title level={4}>Observaciones</Title>}>
							<Input.TextArea rows="5" onChange={handleObservaciones} />
						</Form.Item>
					</Col>
					<Col lg={24} md={24} sm={24} xs={24} style={{ marginTop: 30 }}>
						<Button
							size="large"
							type="primary"
							style={{ width: '100%', height: '50px', fontSize: '23px' }}
							onClick={() => setModalGuardar(true)}
							icon={<SaveOutlined />}
						>
							<span>Guardar Odontograma</span>
						</Button>
					</Col>
				</Row>
			</Form>

			{modalGuardar ? (
				<ModalGuardar modalGuardar={modalGuardar} setModalGuardar={setModalGuardar} registrarDatos={registrarDatos} />
			) : null}
		</>
	);
};
export default Odonto;
