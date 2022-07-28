import React, { useEffect, useState } from 'react';
import locale from 'antd/es/date-picker/locale/es_ES';

import {
	Card,
	Form,
	Row,
	Button,
	AutoComplete,
	Col,
	Modal,
	Input,
	TimePicker,
	DatePicker,
	Select,
} from 'antd';
import { openNotification } from '../../../../util/util';
import { httpClient } from '../../../../util/Api';
import { useSelector } from 'react-redux';

const ModalAsignar = ({ visibleModal, setVisibleModal, traerData }) => {
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const [horario, setHorario] = useState();
	const [fecha, setFecha] = useState();
	const [guardando, setGuardando] = useState(false);
	const [dataEspecialidades, setDataEspecialidades] = useState([]);
  const [dataConsultorios, setDataConsultorios] = useState([]);
	const [dataMedicos, setDataMedicos] = useState([]);
	const [currentEspecialidad, setCurrentEspecialidad] = useState('');
  const [currentConsultorio, setCurrentConsultorio] = useState('');
	const [mensaje, setMensaje] = useState('');
	const [currentMedico, setCurrentMedico] = useState('');

  const [loadingEspecialidad, setLoadingEspecialidad] = useState(false);
  const [loadingMedicos, setLoadingMedicos] = useState(false);
  const [loadingConsultorio, setLoadingConsultorio] = useState(false);

	const [form] = Form.useForm();

	const guardarHorario = async () => {
		setGuardando(true);
		if (!horario || !fecha || currentMedico === '' || currentEspecialidad === '' || currentConsultorio === '') {
			openNotification('Error', 'Debe completar todos los campos', 'Alerta');
			setGuardando(false);
			return;
		}

		const medico = dataMedicos.find(medico => medico.num_cmp === currentMedico);
		const response = await httpClient.post('horarios/setHorario', {
			cmp: currentMedico,
			nombreMedico: medico.des_nom_medico + ' ' + medico.des_ape_medico,
			fecha: fecha,
			horaInicio: horario[0].format('HH:mm'),
			horaFin: horario[1].format('HH:mm'),
			especialidad: medico.descripcion,
			idEspecialidad: medico.id_consultorio,
      bus: medico.bus,
      idBus: medico.id_bus
		});
		if (response.data.success) {
			openNotification('Exito', 'Horario asignado correctamente');
		} else {
			openNotification('Error', response.data.message, 'Alerta');
      setGuardando(false);
      return;
		}
		form.resetFields();
		setCurrentMedico('');
		setHorario(null);
		setFecha(null);
		setGuardando(false);
		setVisibleModal(false);
		traerData();
	};

	const traerEspeciliades = async () => {
    setLoadingEspecialidad(true);
		const response = await httpClient.post('horarios/obtenerEspecialidad');
		if (response.data.success) {
			setDataEspecialidades(response.data.data);
		}
    setLoadingEspecialidad(false);
	};

  const traerConsultorios = async (id = '01') => {
    setLoadingConsultorio(true);
    const response = await httpClient.post('atencionMedica/getConsultorios', { COD_ESPECIALIDAD: id });
    if (response.data.success) {
      setDataConsultorios(response.data.data);
    }
    setLoadingConsultorio(false);
  };

	const traerMedicos = async (bus_id) => {
    setLoadingMedicos(true);
		const response = await httpClient.post('horarios/getMedicoByEspecialidad', {
			especialidad_id: currentEspecialidad,
      bus_id
		});
		if (response.data.success) {
			if (response.data.data && !response.data.data.length > 0) {
				setMensaje('No hay medicos disponibles para este consultorio');
			} else {
				setMensaje('');
			}
			setDataMedicos(response.data.data);
		}
    setLoadingMedicos(false);
	};

	useEffect(() => {
		traerEspeciliades();
	}, []);

	return (
		<>
			<Modal
				visible={visibleModal}
				onCancel={() => {
					if (!guardando) {
						setVisibleModal(false);
					}
				}}
				onOk={() => {
					guardarHorario();
				}}
				title="Asignar Horario"
        okType='defaults'
        okButtonProps={{
          style: {background:themeSettingsGlobal.COD_COLOR_1, color: '#fff', border:'none'}
        }}

      >
				<div style={{ padding: 10 }}>
					<Form
            form={form}
            style={{ paddingLeft: 20, paddingRight: 20 }}
            labelCol={{
              span: 8
            }}
            wrapperCol={{
              span: 16
            }}
          >
						<Row>
							<Col span={24}>
								<Form.Item name="especialidad" label="Especialidad">
									<Select
                    onChange={e => {
                      setCurrentEspecialidad(e);
                      traerConsultorios(e);
                    }}
                    value={currentEspecialidad}
                    loading={loadingEspecialidad}
                    disabled={loadingEspecialidad}
                  >
										{dataEspecialidades.map(item => (
											<Select.Option key={item.key} value={item.value}>
												{item.descripcion}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
              <Col span={24}>
                <Form.Item name="consultorio" label="Consultorio">
                  <Select
                    onChange={e => {
                      setCurrentConsultorio(e);
                      form.setFieldsValue({ medico: '' });
                      setCurrentMedico('');
                      traerMedicos(e);
                    }}
                    value={currentConsultorio}
                    loading={loadingConsultorio}
                    disabled={loadingConsultorio}
                  >
                    {dataConsultorios.map(item => (
                      <Select.Option key={item.key} value={item.value}>
                        {item.descripcion}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
						</Row>
						<Row>
							<Col span={24}>
								<Form.Item name="medico" label="Medico">
									<Select
										onChange={setCurrentMedico}
										value={currentMedico}
										disabled={mensaje !== '' || !currentEspecialidad || !currentConsultorio || loadingMedicos}
                    loading={loadingMedicos}
									>
										{dataMedicos.map(item => (
											<Select.Option key={item.num_cmp} value={item.num_cmp}>
												{item.des_nom_medico} {item.des_ape_medico}
											</Select.Option>
										))}
									</Select>
									{mensaje && <div style={{ color: 'red', marginTop: '10px' }}>{mensaje}</div>}
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<Form.Item name="fecha" label="Fecha">
									<DatePicker
										locale={locale}
										style={{ width: '100%' }}
										onChange={data => {
											console.log('data', data);
											setFecha(data);
										}}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col xs={24}>
								<Form.Item name="horario" label="Horario">
									<TimePicker.RangePicker
										placeholder={['Inicio', 'Fin']}
										format="HH:mm"
										style={{ width: '100%' }}
										onChange={data => {
											setHorario(data);
										}}
									/>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</div>
			</Modal>
		</>
	);
};

export default ModalAsignar;
