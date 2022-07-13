import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { httpClient } from '../../../../util/Api';
import ModalAsignar from './ModalAsignar';
import ModalEditar from './ModalEditar';

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
	const [visibleModalAsignar, setVisibleModalAsignar] = useState(false);
	const [visibleModalEditar, setVisibleModalEditar] = useState(false);
	const [currentMes, setCurrentMes] = useState(moment().month() + 1);
	const [medico, setMedico] = useState({});

	const agregarEvento = data => {
		var aux = [];
		data.forEach(element => {
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
			});
		});
		setEvents([...aux]);
	};

	const mostrarModalDetalle = record => {
		// TODO: MOSTRAR EL MODAL DE DETALLE
		setMedico(record);
		setVisibleModalEditar(true);
		console.log(record);
	};

	const traerData = async () => {
		const response = await httpClient.post('/horarios/getHorarioFecha', {
			mes: currentMes,
		});

		console.log(response.data.data);
		agregarEvento(response.data.data);
	};

	useEffect(() => {
		traerData();
	}, [currentMes]);

	useEffect(() => {
		traerData();
	}, []);

	console.log('events', events);

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
						<Button
							style={{
								backgroundColor: 'blue',
								color: 'white',
								marginTop: '10px',
							}}
						>
							Exportar
						</Button>
						<Button
							style={{
								backgroundColor: '#04B0AD',
								color: 'white',
								marginTop: '10px',
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
				<div className="gx-rbc-calendar">
					<Calendar
						popup
						events={[...events]}
						toolbar={true}
						step={60}
						messages={messages}
						localizer={localizer}
						onNavigate={date => {
							setCurrentMes(date.getMonth() + 1);
						}}
						views={{ month: true }}
						onSelectEvent={event => mostrarModalDetalle(event)}
						defaultDate={new Date()}
					/>
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
