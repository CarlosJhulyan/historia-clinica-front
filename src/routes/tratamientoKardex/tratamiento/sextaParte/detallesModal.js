import { Button, Checkbox, Col, Form, Input, Modal, Row, Table } from 'antd';
import React, { createRef, useEffect, useState } from 'react';
import { HorarioModal } from './horarioModal';

export const DetallesModal = ({ abrir, setAbrir, data }) => {
	const formRef = createRef();

	const [cambio, setCambio] = useState(false);
	const [dataVieja, setDataVieja] = useState([]);
	const [dataNueva, setDataNueva] = useState(data);
	const [abrirModalHorario, setAbrirModalHorario] = useState();
	const [dataModalHorario, setDataModalHorario] = useState();

	useEffect(() => {
		setDataVieja(data.filter(element => element.estado === '1'));
		setDataNueva(data.filter(element => element.estado !== '1'));
	}, [data]);

	const columns = [
		{
			title: 'Código',
			dataIndex: 'codprod',
			key: 'Código',
			width: '10%',
			render: (text, record) => {
				return <span>{text || record.codProducto}</span>;
			},
		},
		{
			title: 'Producto',
			dataIndex: 'descprod',
			key: 'Producto',
			width: '10%',
			render: (text, record) => {
				return <span>{text || record.producto}</span>;
			},
		},
		{
			title: 'Frecuencia',
			dataIndex: 'tratamiento',
			key: 'Tratamiento',
			width: '10%',
			render: (text, record) => {
				const resultado = 24 / parseInt(record.frecuencia);
				return <span>C/{resultado} horas</span>;
			},
		},
		{
			title: 'Duracion',
			dataIndex: 'duracion',
			key: 'Duracion',
			width: '10%',
			render: (text, record) => {
				return <span>{text === '1' ? 'Solo un día' : text + ' días'}</span>;
			},
		},
		{
			title: 'Via Adm.',
			dataIndex: 'etiquetaVia',
			key: 'ViaAdm.',
			width: '10%',
			render: (text, record) => {
				return <span>{text || record.etiqueta_via}</span>;
			},
		},

		{
			title: 'Horario',
			dataIndex: 'Horario',
			key: 'Horario',
			width: '10%',
			render: (text, record) => {
				return (
					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<Button
							type="primary"
							onClick={() => {
								setAbrirModalHorario(true);
								setDataModalHorario(record);
							}}
							style={{ margin: '0' }}
						>
							Horario
						</Button>
					</div>
				);
			},
		},
	];

	return (
		<>
			<Modal
				title="Detalles"
				visible={abrir}
				footer={false}
				onCancel={() => setAbrir(false)}
				width={'70%'}
			>
				{dataVieja.length > 0 ? (
					<>
						<div style={{ width: '100%', margin: '0 20px 20px 20px', fontSize: '20px' }}>
							Anterior
						</div>
						<Table
							className="gx-table-responsive"
							columns={columns}
							dataSource={dataVieja}
							pagination={false}
						/>
						<div style={{ width: '100%', margin: '20px', fontSize: '20px' }}>Nuevo</div>
						<Table
							className="gx-table-responsive"
							columns={columns}
							dataSource={dataNueva}
							pagination={false}
						/>
					</>
				) : (
					<Table
						className="gx-table-responsive"
						columns={columns}
						dataSource={dataNueva}
						pagination={false}
					/>
				)}
				{abrirModalHorario && (
					<HorarioModal
						abrir={abrirModalHorario}
						setAbrir={setAbrirModalHorario}
						dataModal={dataModalHorario}
					/>
				)}
			</Modal>
		</>
	);
};
