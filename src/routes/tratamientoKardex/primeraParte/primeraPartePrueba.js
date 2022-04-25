import { Button, Card, Table, Input } from 'antd';
import { createRef, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

const PrimeraPartePrueba = ({ setAbrirModal, setDataModal }) => {
	const dataTratamiento = useSelector(state => state.kardexTratamientoDetalle);

	console.log('DATA TRATAMIENTO: ', dataTratamiento);

	const [data, setData] = useState(dataTratamiento);

	const columns = [
		{
			title: 'Código',
			dataIndex: 'codprod',
			key: 'Código',
			width: '10%',
		},
		{
			title: 'Producto',
			dataIndex: 'descprod',
			key: 'Producto',
			width: '10%',
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
			title: 'Via Adm.',
			dataIndex: 'etiquetaVia',
			key: 'ViaAdm.',
			width: '10%',
		},
		{
			title: 'HoraAdministrada',
			dataIndex: 'HoraAdministrada',
			key: 'HoraAdministrada',
			width: '10%',
			render: (text, record) => {
				console.log('RECORDING: ', record);

				return (
					<Input
						type="time"
						value={record.HoraAdministrada}
						onChange={e => {
							setData(
								data.map(element => {
									if (element.codprod === record.codprod) {
										element.HoraAdministrada = e.target.value;
									}
									return element;
								})
							);
						}}
					/>
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
					<Button
						type="primary"
						onClick={() => {
							setAbrirModal(true);
							setDataModal(data);
						}}
					>
						Modificar
					</Button>
				);
			},
		},
	];

	return (
		<>
			<div style={{ width: '100%' }}>
				<Card>
					<div>
						<Table
							className="gx-table-responsive"
							columns={columns}
							dataSource={data}
							/* 	loading={loading} */
						/>
					</div>
					<ToastContainer pauseOnHover={false} />
				</Card>
			</div>
		</>
	);
};
export default PrimeraPartePrueba;
