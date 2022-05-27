import React, {
  useMemo,
  createRef,
	useState,
	useEffect
} from 'react'
import { 
  Card,
  AutoComplete,
  Form,
  Button,
  Input,
	Slider,
	Image,
	Row,
	notification
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import './styles.css';

import { httpClient } from '../../../util/Api';
import { urlImagen } from '../../../config/backend';

function Ingreso() {
  const formSearch = useMemo(() => createRef(), []);
	const formContent = useMemo(() => createRef(), []);
	const [peticion, setPeticion] = useState(false);
	const date = moment().locale('es');

	const [codPaciente, setCodigoPaciente] = useState('');
	const [valueCOD, setValueCOD] = useState('');
	const [optionsCOD, setOptionsCOD] = useState([]);
	const [valueNOM, setValueNOM] = useState('');
	const [optionsNOM, setOptionsNOM] = useState([]);
	const [markTurno, setMarkTurno] = useState([0, 0]);
	const [turno, setTurno] = useState('');
	const [codigoMedico, setCodigoMedico] = useState('');
	const [firma, setFirma] = useState('');
	const [nombreMedico, setNombreMedico] = useState('');
	const [loadingFetch, setLoadingFetch] = useState(false);

	const [dateTime, setDateTime] = useState({
		hours: date.format('H'),
		minutes: date.format('mm'),
		seconds: date.format('ss'),
		indicador: date.format('a'),
	});

	const openNotification = (type, message, description) => {
		notification[type]({
			message,
			description,
		});
	};

	const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());

	const onSearchCOD = async searchText => {
		var cod = formSearch.current.getFieldValue('COD_PACIENTE');
		if (cod ? cod.length >= 4 : false) {
			setPeticion(true);
			setOptionsCOD();
			const { data: { data = [] } } = await httpClient.post(
				'camas/getPacientes',
				{
					codPaciente: cod,
					nombre: '',
				},
				{ cancelToken: cancelSource.token }
			);
			for (let i = 0; i < data.length; i++) {
				if (data[i].asignado === '0') {
					delete data[i];
				} else {
					data[i].key = data[i].cod_paciente;
					data[i].value = data[i].cod_paciente;
					data[i].label = (
						<div>
							{data[i].historia_clinica}
							<div style={{ color: '#a3a3a3' }}>
								{' ' + data[i].ape_pat_cli + ' ' + data[i].ape_mat_cli}
							</div>
						</div>
					);
				}
			}
			setOptionsNOM();
			setOptionsCOD(data);
		} else {
			if (peticion) {
				cancelSource.cancel('COD Cancelado');
				setCancelSource(axios.CancelToken.source());
			}
		}
	};

	const onSelectCOD = data => {
		optionsCOD.forEach(element => {
			if (element.key === data) {
				formSearch.current.setFieldsValue({
					NRO_HC: element.historia_clinica,
					NOM_PACIENTE: `${
						element.nom_cli + ' ' + element.ape_pat_cli + ' ' + element.ape_mat_cli
					}`
				});
				setValueCOD(data);
				setCodigoPaciente(element.cod_paciente);
				setCodigoMedico(element.cod_medico);
				getFirmaMedico(element.cod_medico);
				setNombreMedico(element.des_nom_medico.trim() + ' ' + element.des_ape_medico.trim());
			}
		});
	};

	const onChangeCOD = data => {
		if (data.length <= 3) {
			setOptionsCOD([]);
		}
	};

	const onSearchNOM = async searchText => {
		var nombre = formSearch.current.getFieldValue('NOM_PACIENTE');
		if (nombre ? nombre.length >= 4 : false) {
			setPeticion(true);
			setOptionsNOM();
			const { data: { data = [] } } = await httpClient.post(
				'camas/getPacientes',
				{
					codPaciente: '',
					nombre: nombre,
				},
				{ cancelToken: cancelSource.token }
			);
			for (let i = 0; i < data.length; i++) {
				if (data[i].asignado === '0') {
					delete data[i];
				} else {
					data[i].key = data[i].cod_paciente;
					data[i].value = data[i].cod_paciente;
					data[i].label = (
						<div>
							{data[i].nom_cli}
							<div style={{ color: '#a3a3a3' }}>
								{' ' + data[i].ape_pat_cli + ' ' + data[i].ape_mat_cli}
							</div>
						</div>
					);
				}
			}
			setOptionsCOD();
			setOptionsNOM(data);
		} else {
			if (peticion) {
				cancelSource.cancel('NOM ancelado');
				setCancelSource(axios.CancelToken.source());
			}
		}
	};

	const onSelectNOM = data => {
		optionsNOM.forEach(element => {
			if (element.key === data) {
				formSearch.current.setFieldsValue({
					NRO_HC: element.historia_clinica,
					NOM_PACIENTE: `${
						element.nom_cli + ' ' + element.ape_pat_cli + ' ' + element.ape_mat_cli
					}`
				});
				setValueNOM(data);
				setCodigoPaciente(element.cod_paciente);
				setCodigoMedico(element.cod_medico);
				getFirmaMedico(element.cod_medico);
				setNombreMedico(element.des_nom_medico.trim() + ' ' + element.des_ape_medico.trim());
			}
		});
	};

	const onChangeNOM = data => {
		if (data.length <= 3) {
			setOptionsNOM([]);
		}
	};

	const getFirmaMedico = async (cod_med) => {
		try {
			const { data : { data = [] } } = await httpClient.post('firmas/getFirma', { cod_med });
			setFirma(data[0].url_firma);
		} catch (error) {
			console.log(error);
		}
	}

	const insertarEvolucionEnfermeria = async () => {
		setLoadingFetch(true);
		const dataForm1 = formSearch.current.getFieldsValue();
		const dataForm2 = formContent.current.getFieldsValue();
		const dataFormat = {
			...dataForm1,
			...dataForm2,
			'COD_MEDICO': codigoMedico,
			'NOM_MEDICO': nombreMedico,
			'TURNO': turno,
			'COD_PACIENTE': codPaciente
		}

		const isFieldValidating1 = formSearch.current.getFieldsError().every(error => error.errors.length <= 0);
		const isFieldValidating2 = formContent.current.getFieldsError().every(error => error.errors.length <= 0);
		if (isFieldValidating1 && isFieldValidating2) {
			try {
				const { data : { success, message  } } = await httpClient.post('evolucionEnfermeria/setData', dataFormat);
				if (success) {
					resetValues();
					openNotification('success', 'Registro', message);
				} else {
					openNotification('warning', 'Registro', message);
				}
			} catch (error) {
				openNotification('error', 'Error', 'Error en la petición');
			}
		} else {
			formSearch.current.getFieldsError().map(error => {
				if (error.errors.length >= 1) {
					openNotification('warning', 'Campo inválido', error.errors[0]);
				}
			})
			formContent.current.getFieldsError().map(error => {
				if (error.errors.length >= 1) {
					openNotification('warning', 'Campo inválido', error.errors[0]);
				}
			})
		}
		setLoadingFetch(false);
	}

	const resetValues = () => {
		formSearch.current.setFieldsValue({
			NRO_HC: '',
			NOM_PACIENTE: ''
		});
		formContent.current.setFieldsValue({
			NARRACION_ESTADO: ''
		});
		setFirma('hola');
		setCodigoPaciente('');
		setCodigoMedico('');
		getFirmaMedico('');
		setNombreMedico('');
	}

	useEffect(() => {
		const timer = setInterval(() => {
			const date = moment().locale('es');
			setDateTime({
				hours:
					date.format('H').toString().length !== 1
						? date.format('H')
						: '0' + date.format('H').toString(),
				minutes:
					date.format('mm').toString().length !== 1
						? date.format('mm')
						: '0' + date.format('mm').toString(),
				seconds:
					date.format('ss').toString().length !== 1
						? date.format('ss')
						: '0' + date.format('ss').toString(),
				indicador: date.format('a'),
			});
			const hora = date.format('H');
			if (hora >= 0 && hora < 8) {
				setMarkTurno([0, 33]);
				setTurno('M');
			} else if (hora >= 8 && hora < 16) {
				setMarkTurno([33, 66]);
				setTurno('T');
			} else if (hora >= 16 && hora < 24) {
				setMarkTurno([66, 100]);
				setTurno('N');
			}
		}, 1000);
		return () => clearInterval(timer);
	}, []);	

  return (
    <Card 
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start',
            gap: '5%',
            flexDirection: 'row',
            width: '100%',
						overflowX: 'auto'
          }}
        >
          <div style={{ fontSize: '22px' }}>Ingreso Evolución de Enfermería</div>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
						<div
							style={{
								display: 'flex',
								width: '100%',
							}}
						>
							<Form
								ref={formSearch}
								style={{
									width: '100%',
									display: 'flex',
									alignItems: 'center',
									flexDirection: 'row',
									gap: '20px',
								}}
							>
								<Form.Item
									rules={[
										{
											required: true,
											message: 'Complete la historia clinica del paciente.',
										}
									]}
									name="NRO_HC" 
									style={{ width: '200px', margin: 0 }}>
										<AutoComplete
											value={valueCOD}
											options={optionsCOD}
											onSearch={onSearchCOD}
											onSelect={onSelectCOD}
											onChange={onChangeCOD}
											style={{ width: '100%' }}
											placeholder="Historia Clínica"
										/>
								</Form.Item>
								<Form.Item
									rules={[
										{
											required: true,
											message: 'Complete el nombre del paciente.',
										}
									]}
									name="NOM_PACIENTE" 
									style={{ width: '300px', margin: 0 }}>
										<AutoComplete
											value={valueNOM}
											options={optionsNOM}
											onSearch={onSearchNOM}
											onSelect={onSelectNOM}
											onChange={onChangeNOM}
											style={{ width: '100%' }}
											placeholder="Nombre del paciente"
										/>
								</Form.Item>
							</Form>
						</div>
					</div>
					<div
						style={{
							gridArea: '1 / 3 / 3 / 4',
							display: 'flex',
							flexDirection: 'row-reverse',
							paddingTop: '15px',
						}}
					>
						<Button
							loading={loadingFetch}
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: '#04B0AD',
								color: 'white',
							}}
							onClick={() => insertarEvolucionEnfermeria()}
						>
							Guardar
						</Button>
					</div>
        </div>
      }>
				<Form ref={formContent} layout='vertical'>
					<Form.Item 
						rules={[
							{
								required: true,
								message: 'Complete la narración del estado de paciente.',
							}
						]}
						name='NARRACION_ESTADO' 
						label='Narración del Estado de Paciente'>
						<Input.TextArea
							rows={10}
							maxLength={300}
							placeholder='Ingrese la narración del estado de paciente'></Input.TextArea>
					</Form.Item>
					<div style={{ display: 'grid', gridTemplateColumns: '260px auto' }}>
						<Form.Item>
							<div style={{ margin: 0, padding: 0, width: '100%' }}>
								<div style={{ fontSize: '22px' }}>
									{dateTime.hours}:{dateTime.minutes}:{dateTime.seconds} {dateTime.indicador}
								</div>
								<div>{moment().locale('es').format('dddd, DD [de] MMMM [de] YYYY')}</div>
								<div style={{ fontSize: 20, marginTop: '10px' }}>
									{`Turno ${turno === 'M' ? 'Mañana' : turno === 'T' ? 'Tarde' : turno === 'N' ? 'Noche' : ''}`}
								</div>
							</div>
						</Form.Item>
						<Form.Item label='Firma del Médico'>
							<Row justify='center'>
								<Image
									src={`${urlImagen}${firma}`}
									width={200}
									fallback="data:image/png;base64,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"
								/>
							</Row>
						</Form.Item>
					</div>
				</Form>
    </Card>
  )
}

export default Ingreso;