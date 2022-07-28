import React, { useCallback, useEffect, useState } from 'react';
import { Card, Button, DatePicker, Spin, Input, Form, Row, Col, Select, Tooltip, Modal } from 'antd';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { httpClient } from '../../../../util/Api';
import ModalAsignar from './ModalAsignar';
import ModalEditar from './ModalEditar';
import ReactExport from 'react-export-excel';
import { ClearOutlined } from '@ant-design/icons';
import { convertir24hrsa12hrs, openNotification } from '../../../../util/util';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { useSelector } from 'react-redux';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const localizer = momentLocalizer(moment);
//Cambiar el idioma
moment.locale('es', {
	months:
		'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
			'_'
		),
	monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
	weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
	weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
	weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_'),
});

const messages = {
	month: 'Mes',
	week: 'Semana',
	day: 'Dia',
	today: 'Hoy',
	previous: 'Anterior',
	next: 'Siguiente',
};

const ConsultarHorario = () => {
  const { confirm } = Modal;
	const [events, setEvents] = useState([]);
	const [dataFormat, setDataFormat] = useState({});
	const [visibleModalAsignar, setVisibleModalAsignar] = useState(false);
	const [loading, setLoading] = useState(false);
	const [visibleModalEditar, setVisibleModalEditar] = useState(false);
	const [currentMes, setCurrentMes] = useState(moment().month() + 1);
	const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
	const [datePicker, setDatePicker] = useState(new Date());
	const [medico, setMedico] = useState({});
	const [currentEspecialidad, setCurrentEspecialidad] = useState('');
	const [dataEspecialidades, setDataEspecialidades] = useState([]);
	const [currentMedico, setCurrentMedico] = useState('');
	const [dataMedicos, setDataMedicos] = useState([]);
	const [mensaje, setMensaje] = useState('');
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);

  const DragAndDropCalendar = withDragAndDrop(Calendar)

	const traerEspeciliades = async () => {
		const response = await httpClient.post('horarios/obtenerEspecialidad');
		if (response.data.success) {
			setDataEspecialidades(response.data.data);
		}
	};

	const traerMedicos = async () => {
		const response = await httpClient.post('horarios/getMedicoByEspecialidad', {
			especialidad_id: currentEspecialidad,
		});
		if (response.data.success) {
			if (response.data.data && !response.data.data.length > 0) {
				setMensaje('No hay medicos disponibles para esta especialidad');
			} else {
				setMensaje('');
			}
			setDataMedicos(response.data.data);
		}
	};

  const handleEventDrop = useCallback((e) => {
    const horario = {
      horaInicio: e.event.hora_inicio,
      horaFin: e.event.hora_fin,
      id: e.event.id_horario,
      fecha: e.start
    }

    if (moment(e.event.fecha, 'yyyy-MM-DD').format('DD/MM/yyyy') === moment(e.start).format('DD/MM/yyyy')) return;

    confirm({
      content: (
        <>
          <p>Se cambiara el horario de la fecha {moment(e.event.fecha, 'yyyy-MM-DD').format('DD/MM/yyyy')} hacia {moment(e.start).format('DD/MM/yyyy')}</p>
        </>
      ),
      cancelText: 'Cancelar',
      okText: 'Cambiar',
      onOk: async () => {
        await guardarHorario(horario);
      },
      onCancel: () => {},
      centered: true
    });
  }, []);

  const handleEventDragStart = useCallback((event) => {
    // console.log('DRAG', event);
  }, []);

  const guardarHorario = async (horario) => {
    const response = await httpClient.post('/horarios/editarHorario', horario);
    if (response.data.success) {
      traerData();
    } else {
      openNotification('Error', response.data.message, 'Alerta');
    }
  };

	useEffect(() => {
		traerMedicos();
	}, [currentEspecialidad]);

	const agregarEvento = data => {
		var aux = [];
		data.forEach(element => {
			// console.log(element);
			var start = new Date(
				moment(element.fecha).format('YYYY'),
				Number(moment(element.fecha).format('MM')) - 1,
				moment(element.fecha).format('DD'),
				element.hora_inicio.split(':')[0],
				element.hora_inicio.split(':')[1]
			);
			var end = new Date(
				moment(element.fecha).format('YYYY'),
				Number(moment(element.fecha).format('MM')) - 1,
				moment(element.fecha).format('DD'),
				element.hora_fin.split(':')[0],
				element.hora_fin.split(':')[1]
			);

			aux.push({
				...element,
				title: (
					<>
						<div
							style={{
								textOverflow: 'ellipsis',
								display: 'block',
								whiteSpace: 'nowrap',
								overflow: 'hidden',
							}}
						>
							{element.nombre_medico}
						</div>
						<p style={{ margin: 0 }}>{element.especialidad}</p>
						<p style={{ margin: 0 }}>
							{convertir24hrsa12hrs(element.hora_inicio) +
								' - ' +
								convertir24hrsa12hrs(element.hora_fin)}
						</p>
					</>
				),
				start,
				end,
				id: element.id_horario,
				turno: () => {
					const horaInicio = Number(moment(element.hora_inicio, 'HH:mm').format('H'));
					const horaFin = Number(moment(element.hora_fin, 'HH:mm').format('H'));
					let horaInicioLabel = '';
					let horaFinLabel = '';

					if (horaInicio >= 0 && horaInicio < 8) horaInicioLabel = 'Mañana';
					else if (horaInicio >= 8 && horaInicio < 16) horaInicioLabel = 'Tarde';
					else if (horaInicio >= 16 && horaInicio < 24) horaInicioLabel = 'Noche';
					if (horaFin >= 0 && horaFin < 8) horaFinLabel = 'Mañana';
					else if (horaFin >= 8 && horaFin < 16) horaFinLabel = 'Tarde';
					else if (horaFin >= 16 && horaFin < 24) horaFinLabel = 'Noche';
					return horaInicioLabel === horaFinLabel
						? horaInicioLabel
						: `${horaInicioLabel} - ${horaFinLabel}`;
				},
			});
		});
		setEvents([...aux]);
	};

	const mostrarModalDetalle = record => {
		setMedico(record);
		setVisibleModalEditar(true);
	};

	const traerData = async () => {
		const response = await httpClient.post('/horarios/getHorarioFecha', {
			mes: currentMes,
			medico: currentMedico,
			especialidad: currentEspecialidad,
		});
		agregarEvento(response.data.data);
	};


	useEffect(() => {
		if (datePicker) {
			setCurrentMes(moment(datePicker).month() + 1);
			setFechaSeleccionada(datePicker);
		}
	}, [datePicker]);

	useEffect(() => {
    const asyncronized = async () => {
      setLoading(true);
      await traerData();
      setLoading(false);
      traerEspeciliades();
    }
		asyncronized();
	}, []);

	useEffect(() => {
		const dataNew = {};
		events.forEach(item => {
			if (Object.keys(dataNew).find(x => x === item.especialidad)) {
				dataNew[item.especialidad] = [...dataNew[item.especialidad], item];
			} else {
				dataNew[item.especialidad] = [item];
			}
		});
		setDataFormat(dataNew);
	}, [events]);

	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue({ fecha: moment(datePicker) });
		traerData();
		console.log('aaaaaa');
	}, [currentMedico, currentEspecialidad, currentMes]);

	return (
		<Card
			title={
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: '10px',
					}}
				>
					<div
						style={{
							width: '50%',
							fontSize: '22px',
							marginTop: '15px',
						}}
					>
						Horario
					</div>
					<div
						style={{
							width: '50%',
							display: 'flex',
							justifyContent: 'right',
						}}
					>
						<ExcelFile
							element={
								<Button
									style={{
										backgroundColor: 'blue',
										color: 'white',
										marginTop: '10px',
									}}
								>
									Exportar
								</Button>
							}
						>
							{Object.keys(dataFormat).map(item => (
								<ExcelSheet data={dataFormat[item]} name={item}>
									<ExcelColumn label="ESPECIALIDAD" value="especialidad" />
									<ExcelColumn label="DOCTOR A CARGO" value="nombre_medico" />
									<ExcelColumn label="FECHA" value="fecha" />
									<ExcelColumn
										label="HORARIO DE ATENCIÓN"
										value={col =>
											`${moment(col.hora_inicio, 'HH:mm').format('hh a')} a ${moment(
												col.hora_fin,
												'HH:mm'
											).format('hh a')}`
										}
									/>
									<ExcelColumn
										label="TURNO"
										value={col => `${col.turno()}`}
										style={{
											alignment: {
												vertical: 'center',
												horizontal: 'center',
											},
											font: { sz: '12', bold: true },
										}}
									/>
									{/*<ExcelColumn label="REQUISITOS PARA CONSULTAS" value={(col) => ``}/>*/}
								</ExcelSheet>
							))}
						</ExcelFile>
						<Button
							style={{
                background: themeSettingsGlobal.COD_COLOR_1,
                color: '#fff',
								marginTop: '10px',
								marginLeft: 20,
							}}
							onClick={() => {
								setVisibleModalAsignar(true);
							}}
						>
							Agregar Disponibildiad
						</Button>
					</div>
				</div>
			}
		>
			<div className="gx-main-content">
				<div
					style={{
						width: '100%',
						marginBottom: '20px',
					}}
				>
					<Form form={form}>
						<Row>
							<Col xs={24} md={12} xxl={8} style={{ paddingLeft: 30, paddingRight: 30 }}>
								<Form.Item name="fecha" label="Mes">
									<DatePicker
										picker={'month'}
										style={{ width: '100%' }}
										value={moment(datePicker)}
										onChange={e => {
											setDatePicker(new Date(e.format('YYYY-MM-DD')));
										}}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={12} xxl={8} style={{ paddingLeft: 30, paddingRight: 30 }}>
								<Row>
									<Col xs={20}>
										<Form.Item name="especialidad" label="Especialidad">
											<Select
												onChange={value => {
													setCurrentEspecialidad(value);
													setCurrentMedico('');
													setDataMedicos([]);
												}}
												value={currentEspecialidad}
											>
												{dataEspecialidades.map(item => (
													<Select.Option key={item.key} value={item.value}>
														{item.descripcion}
													</Select.Option>
												))}
											</Select>
										</Form.Item>
									</Col>
									<Col xs={4}>
										<Tooltip title="Limpiar">
											<Button
												icon={<ClearOutlined />}
												onClick={() => {
													setCurrentEspecialidad('');
													setCurrentMedico('');
													setDataMedicos([]);
													form.setFieldsValue({ especialidad: '', medico: '' });
												}}
											/>
										</Tooltip>
									</Col>
								</Row>
							</Col>
							<Col xs={24} md={12} xxl={8} style={{ paddingLeft: 30, paddingRight: 30 }}>
								<Row>
									<Col xs={20}>
										<Form.Item name="medico" label="Medico">
											<Select
												onChange={setCurrentMedico}
												value={currentMedico}
												disabled={mensaje !== ''}
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
									<Col xs={4}>
										<Tooltip title="Limpiar">
											<Button
												icon={<ClearOutlined />}
												onClick={() => {
													setCurrentMedico('');
													form.setFieldsValue({ medico: '' });
												}}
											/>
										</Tooltip>
									</Col>
								</Row>
							</Col>
						</Row>
					</Form>
				</div>
				<div className="gx-rbc-calendar">
					{loading ? (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								flexDirection: 'column',
								height: '500px',
							}}
						>
							<Spin tip="Cargando" />
						</div>
					) : (
						<DragAndDropCalendar
							popup
							events={[...events]}
							toolbar={true}
							step={60}
							messages={messages}
							localizer={localizer}
							onNavigate={date => {
								setCurrentMes(date.getMonth() + 1);
								setDatePicker(new Date(moment(date).format('YYYY-MM-DD')));
							}}
							views={{ month: true }}
							onSelectEvent={event => mostrarModalDetalle(event)}
							date={fechaSeleccionada}
              onEventDrop={handleEventDrop}
              onDragStart={handleEventDragStart}
              backgroundEvents='#000'
						/>
					)}
				</div>
				{visibleModalAsignar ? (
					<ModalAsignar
						visibleModal={visibleModalAsignar}
						setVisibleModal={setVisibleModalAsignar}
						traerData={traerData}
					/>
				) : null}
				{visibleModalEditar ? (
					<ModalEditar
						medico={medico}
						visibleModal={visibleModalEditar}
						setVisibleModal={setVisibleModalEditar}
						traerData={traerData}
					/>
				) : null}
			</div>
		</Card>
	);
};

export default ConsultarHorario;
