import { Button, Card, Form, AutoComplete, DatePicker, Table, Input } from 'antd';
import { createRef, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';

const CuartaParte = ({ data }) => {
	const formSearch = useMemo(() => createRef(), []);

	const columns = [
		{
			title: 'Código',
			dataIndex: 'Código',
			key: 'Código',
			width: '10%',
		},
		{
			title: 'Tratamiento',
			dataIndex: 'Tratamiento',
			key: 'Tratamiento',
			width: '10%',
		},
		{
			title: 'Fecha',
			dataIndex: 'Fecha',
			key: 'Fecha',
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
						}}
					>
						<div style={{ fontSize: '22px' }}>
							<div style={{ display: 'flex', marginLeft: '20px', alignItems: 'center' }}>
								Registro de Fecha:
							</div>
						</div>
						<div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
							<div
								style={{
									gridArea: '1 / 2 / 2 / 3',
									display: 'flex',
									flexDirection: 'row-reverse',
									width: '100%',
									margin: 0,
									// padding: 0
								}}
							>
								<Form
									ref={formSearch}
									style={{
										width: '100%',
										display: 'flex',
										alignItems: 'center',
										flexDirection: 'row',
										gap: '20px',
									}}
								>
									<Form.Item name="nombrePaciente" style={{ width: '100%', margin: 0 }}>
										<AutoComplete
											/* 	value={valueNOM}
											options={optionsNOM}
											onSearch={onSearchNOM}
											onSelect={onSelectNOM}
											onChange={onChangeNOM} */
											style={{ width: '100%' }}
											placeholder="Medicamento"
										/>
									</Form.Item>
								</Form>
							</div>
						</div>
						<div
							style={{
								marginRight: '20px',
								gridArea: '1 / 3 / 3 / 4',
								display: 'flex',
								flexDirection: 'row-reverse',
								paddingTop: '15px',
								gap: '20px',
							}}
						>
							<Button
								/* loading={loading} */
								size="large"
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									backgroundColor: '#04B0AD',
									color: 'white',
								}}
								/* 	onClick={() => buscarHistorial()}
								disabled={btnBuscar} */
							>
								Guardar
							</Button>
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
export default CuartaParte;
