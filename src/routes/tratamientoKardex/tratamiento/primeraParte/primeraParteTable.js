import { Button, Card, Table, Input } from 'antd';
import { createRef, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { ModalHorario } from './modalHorario';

const PrimeraParteTable = ({ setAbrirModal, setDataModal, historia, editar, TraerDatos }) => {
	const dataTratamiento = useSelector(state => state.kardexTratamientoDetalle);

	const [data, setData] = useState([]);
	const [abrirModalHorario, setAbrirModalHorario] = useState();
	const [dataModalHorario, setDataModalHorario] = useState();

	useEffect(() => {
		if (editar && editar.tratamientos.length > 0) {
			console.log(editar.tratamientos, dataTratamiento);
			const aux = [];
			editar.tratamientos.forEach(e => {
				if (e.estado !== '1') {
					aux.push(e);
				}
			});
			dataTratamiento.forEach(t => {
				if (!editar.tratamientos.find(e => e.codigo_producto === t.codprod)) {
					aux.push(t);
				}
			});
			setData(aux);
		} else if (dataTratamiento.length > 0) {
			setData(dataTratamiento);
		} else {
			setData([]);
		}
	}, [editar, dataTratamiento]);

	const columns = [
		{
			title: 'Código',
			dataIndex: 'codprod',
			key: 'Código',
			width: '10%',
			render: (text, record) => {
				return <span>{text || record.codigo_producto}</span>;
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
		// {
		// 	title: 'HoraAdministrada',
		// 	dataIndex: 'HoraAdministrada',
		// 	key: 'HoraAdministrada',
		// 	width: '10%',
		// 	render: (text, record) => {
		// 		console.log('RECORDING: ', record);

		// 		return (
		// 			<Input
		// 				type="time"
		// 				value={record.HoraAdministrada}
		// 				onChange={e => {
		// 					setData(
		// 						data.map(element => {
		// 							if (element.codprod === record.codprod) {
		// 								element.HoraAdministrada = e.target.value;
		// 							}
		// 							return element;
		// 						})
		// 					);
		// 				}}
		// 			/>
		// 		);
		// 	},
		// },

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
		{
			title: 'Editar',
			dataIndex: 'Editar',
			key: 'Editar',
			width: '10%',
			render: (text, record) => {
				return (
					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<Button
							type={record.estado === '2' ? 'default' : 'primary'}
							onClick={() => {
								setAbrirModal(true);
								setDataModal(record);
							}}
							style={{ margin: '0' }}
							disabled={record.estado === '2'}
						>
							{record.estado === '2' ? 'Pendiente' : 'Modificar'}
						</Button>
					</div>
				);
			},
		},
	];

	return (
		<>
			<div style={{ width: '100%' }}>
				<div>
					<Table
						className="gx-table-responsive"
						columns={columns}
						dataSource={data}
						/* 	loading={loading} */
					/>
				</div>
				{abrirModalHorario && (
					<ModalHorario
						abrir={abrirModalHorario}
						setAbrir={setAbrirModalHorario}
						dataModal={dataModalHorario}
						data={data}
						setData={setData}
						historia={historia}
						TraerDatos={TraerDatos}
					/>
				)}
				<ToastContainer pauseOnHover={false} />
			</div>
		</>
	);
};
export default PrimeraParteTable;
