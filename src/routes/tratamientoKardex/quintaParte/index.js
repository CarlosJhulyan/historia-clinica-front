import { Button, Card, Form, AutoComplete, DatePicker, Table, Input } from 'antd';
import { createRef, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';

const QuintaParte = ({ data }) => {
	const formSearch = useMemo(() => createRef(), []);

	const columns = [
		{
			title: 'Código',
			dataIndex: 'Código',
			key: 'Código',
			width: '10%',
		},
		{
			title: 'Medicamento',
			dataIndex: 'Medicamento',
			key: 'Medicamento',
			width: '10%',
		},
		{
			title: 'Estado',
			dataIndex: 'Estado',
			key: 'Estado',
			width: '10%',
		},
		{
			title: 'Motivo',
			dataIndex: 'Motivo',
			key: 'Motivo',
			width: '10%',
		},
	];

	return (
		<div style={{ width: '100%' }}>
			<br />
			<Card
				title={
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'start',
							gap: '10%',
							flexDirection: 'row',
							width: '100%',
							margin: '10px',
						}}
					>
						<div style={{ fontSize: '22px' }}>
							<div style={{ display: 'flex', marginLeft: '20px', alignItems: 'center' }}>
								Cambios de medicamentos
							</div>
						</div>
					</div>
				}
			>
				<div>
					<Table
						className="gx-table-responsive"
						columns={columns}
						/* 	dataSource={data}
						loading={loading} */
					/>
				</div>
				<ToastContainer pauseOnHover={false} />
			</Card>
		</div>
	);
};
export default QuintaParte;
