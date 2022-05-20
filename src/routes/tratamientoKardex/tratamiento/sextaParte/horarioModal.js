import { Button, Checkbox, Col, Form, Input, Modal, Row, Table } from 'antd';
import React, { createRef, useEffect, useState } from 'react';
import Moment from 'moment';

export const HorarioModal = ({ abrir, setAbrir, dataModal }) => {
	const formRef = createRef();

	const [horario, setHorario] = useState([]);
	const [seleccionados, setSeleccionados] = useState([]);

	useEffect(() => {
		if (dataModal.horario) {
			if (dataModal.horario.length > 0) {
				const arreglo = [];
				const activos = [];
				dataModal.horario.forEach(h => {
					arreglo.push({
						label: Moment(h.hora).format('HH:mm DD/MM/YYYY'),
						value: Moment(h.hora).format('HH:mm DD/MM/YYYY'),
					});
					console.log(h);
					if (h.administrado === 1 || h.administrado === '1') {
						activos.push(Moment(h.hora).format('HH:mm DD/MM/YYYY'));
					}
				});
				//Ordenar por hora
				arreglo.sort((a, b) => {
					return Moment(a.value, 'HH:mm DD/MM/YYYY').diff(Moment(b.value, 'HH:mm DD/MM/YYYY'));
				});
				setSeleccionados(activos);
				setHorario(arreglo);
			}
		}
	}, []);

	return (
		<>
			<Modal
				title="Detalles"
				visible={abrir}
				footer={false}
				onCancel={() => setAbrir(false)}
				width={'20%'}
			>
				<Row style={{ flexDirection: 'row', margin: '0 0 10px 10px' }}>
					{horario.length > 0 ? (
						<Col lg={24} md={6} sm={8} xs={24}>
							<div
								style={{
									width: '100%',
									margin: '0px 0 10px 0',
								}}
							>
								Horario
							</div>
							<Checkbox.Group options={horario} defaultValue={seleccionados} disabled />
						</Col>
					) : (
						'No existe el horario'
					)}
				</Row>
			</Modal>
		</>
	);
};
