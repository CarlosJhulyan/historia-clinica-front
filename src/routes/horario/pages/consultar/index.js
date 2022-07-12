import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Spin } from 'antd';
import moment from 'moment';

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
	const [data, setData] = useState([]);

	const agregarEvento = data => {
		var aux = [];
		data.map(element => {
			var f = new Date(moment(element.fecha_programada).format('YYYY,MM,DD'));
			aux.push({
				...element,
				title: element.actividad,
				start: f,
				end: f,
			});
		});
		setEvents(aux);
	};

	// const mostrarModalDetalle = record => {
	// 	setAbrirModal(true);
	// 	setDatosModal(record);
	// };

	// useEffect(() => {
	// 	if (state.data.length > 0) {
	// 		setData(state.data);
	// 	}
	// }, [state]);

	useEffect(() => {
		if (data.length >= 1) {
			agregarEvento(data);
		}
	}, [data]);

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
						Mantenedor de Horario
					</div>
					<div
						style={{
							width: '50%',
							display: 'flex',
							justifyContent: 'right',
						}}
					>
						<Button
							// loading={loading}
							style={{
								backgroundColor: '#04B0AD',
								color: 'white',
								marginTop: '10px',
							}}
							// onClick={() => buscarHistorial()}
							// disabled={btnBuscar}
						>
							Guardar
						</Button>
					</div>
				</div>
			}
		>
			<div className="gx-main-content">
				<div className="gx-rbc-calendar">
					{/* {state.loading ? (
						<div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
							<Spin tip="Cargando" />
						</div>
					) : ( */}
					<Calendar
						popup
						events={events}
						toolbar={true}
						step={60}
						messages={messages}
						localizer={localizer}
						views={{ month: true }}
						// onSelectEvent={event => mostrarModalDetalle(event)}
						defaultDate={new Date()}
					/>
					{/* )} */}
				</div>
			</div>
		</Card>
	);
};

export default ConsultarHorario;
