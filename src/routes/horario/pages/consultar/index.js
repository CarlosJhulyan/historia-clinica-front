import React, { useEffect, useState } from 'react';
import { Card, Button, DatePicker, Spin } from 'antd';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { httpClient } from '../../../../util/Api';
import ModalAsignar from './ModalAsignar';
import ModalEditar from './ModalEditar';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import ReactExport from 'react-export-excel';
import { baseUrl, baseUrlImage } from '../../../../config/backend';

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
	const [events, setEvents] = useState([]);
	const [dataFormat, setDataFormat] = useState({});
	const [visibleModalAsignar, setVisibleModalAsignar] = useState(false);
	const [loading, setLoading] = useState(false);
	const [visibleModalEditar, setVisibleModalEditar] = useState(false);
	const [currentMes, setCurrentMes] = useState(moment().month() + 1);
	const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
	const [datePicker, setDatePicker] = useState(new Date());
	const [medico, setMedico] = useState({});
	console.log(fechaSeleccionada);
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
						<p>{element.hora_inicio + ' - ' + element.hora_fin}</p>
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
		// TODO: MOSTRAR EL MODAL DE DETALLE
		setMedico(record);
		setVisibleModalEditar(true);
		// console.log(record);
	};

	const traerData = async () => {
		setLoading(true);
		const response = await httpClient.post('/horarios/getHorarioFecha', {
			mes: currentMes,
		});

		// console.log(response.data.data);
		agregarEvento(response.data.data);
		setLoading(false);
	};

	useEffect(() => {
		traerData();
	}, [currentMes]);

	useEffect(() => {
		if (datePicker) {
			setCurrentMes(moment(datePicker).month() + 1);
			setFechaSeleccionada(datePicker);
		}
	}, [datePicker]);

	useEffect(() => {
		traerData();
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
		console.log(dataNew);
		setDataFormat(dataNew);
	}, [events]);

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
								backgroundColor: '#04B0AD',
								color: 'white',
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
						display: 'flex',
						flexDirection: 'row-reverse',
						width: '100%',
						marginBottom: '20px',
					}}
				>
					<DatePicker
						picker={'month'}
						style={{ width: '200px' }}
						value={moment(datePicker)}
						onChange={e => {
							setDatePicker(new Date(e.format('YYYY-MM-DD')));
						}}
					/>
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
						<Calendar
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
