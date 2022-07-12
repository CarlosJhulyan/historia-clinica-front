import React from 'react';

import { Card, Form, Row, Button, AutoComplete, Col } from 'antd';

const AsignarHorario = () => {
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
			<Form
				// ref={formSearch}
				layout="vertical"
			>
				<Row
					justify="start"
					style={{
						gap: '20px 80px',
						marginLeft: 10,
						marginBottom: 10,
					}}
				>
					<Col>
						<Form.Item name="codPaciente" label="Nombre">
							<AutoComplete
								// disabled={disabledAll}
								// value={valueCOD}
								// options={optionsCOD}
								// onSearch={onSearchCOD}
								// onSelect={onSelectCOD}
								// onChange={onChangeCOD}
								style={{ width: '100%' }}
								placeholder="Nombre de Producto"
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Card>
	);
};

export default AsignarHorario;
