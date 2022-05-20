import { Button, Card, Form, AutoComplete, DatePicker, Table, Input } from 'antd';
import { createRef, useEffect, useMemo, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { httpClient } from '../../../../util/Api';
import moment from 'moment';
import { DetallesModal } from './detallesModal';

const SextaParte = ({ historia }) => {
	const [data, setData] = useState([]);
	const [modal, setModal] = useState(false);
	const [dataModal, setDataModal] = useState();
	const [loading, setLoading] = useState(false);

	const traerHistorial = async () => {
		setLoading(true);
		const response = await httpClient.post(`/kardex/getHistorialKardex`, { hc: historia.hc });
		setData(response.data.data);
		setLoading(false);
	};

	useEffect(() => {
		traerHistorial();
	}, []);

	const columns = [
		{
			title: 'Fecha',
			dataIndex: 'fecha',
			key: 'fecha',
			width: '15%',
			render: (text, record) => {
				return <span>{moment(text).format('HH:mm DD/MM/YYYY')}</span>;
			},
		},
		{
			title: 'Código de Medico',
			dataIndex: 'cod_med',
			key: 'cod_med',
			width: '20%',
		},
		{
			title: 'Medico',
			dataIndex: 'nom_med',
			key: 'nom_med',
			width: '35%',
		},
		{
			title: 'Acción',
			dataIndex: 'accion',
			key: 'accion',
			width: '25%',
		},
		{
			title: 'Detalles',
			dataIndex: 'detalles',
			key: 'detalles',
			width: '5%',
			render: (text, record) => {
				return (
					<Button
						type="primary"
						style={{ margin: '0' }}
						onClick={() => {
							setModal(true);
							setDataModal(JSON.parse(text));
						}}
					>
						Detalles
					</Button>
				);
			},
		},
	];

	return (
		<div style={{ width: '100%' }}>
			<div>
				<Table
					className="gx-table-responsive"
					columns={columns}
					dataSource={data}
					loading={loading}
				/>
			</div>
			{modal && <DetallesModal abrir={modal} setAbrir={setModal} data={dataModal} />}
			<ToastContainer pauseOnHover={false} />
		</div>
	);
};
export default SextaParte;
