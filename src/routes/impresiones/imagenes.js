import { Row, Col, Divider } from 'antd';
import rojo from '../../assets/impresiones/rojo.jpg';
import azul from '../../assets/impresiones/azul.jpg';
import { useSelector } from 'react-redux';

export const ImpresionImagen = ({ datosModal, firma, cmp }) => {
	const fuente = 17;
	const espacios = 35;
	const backgroundRojo = '#FF9999';
	const backgroundAzul = '#CCCCCC';

	console.log('DAAAAAATAAAAAAAAAAAA7777777777:', datosModal);
	console.log('FIIIIIIIIIIIIIIIRMAA4:', firma);

	const sinRegistro = 'No hay indicaciones';

	//Data del Redux
	const { tipo } = useSelector(state => state.anexo);
	const { dataProcedimiento, recomendacion } = useSelector(state => state.imagenes);
	const tratamiento = useSelector(state => state.tratamiento);

	return (
		<div>
			<div id="pagina1">
				<div style={{ position: 'relative' }}>
					<img alt="hoja membreatada" src={tipo === 'N' ? rojo : azul}></img>

					<div
						style={{
							position: 'absolute',
							top: 170,
							left: 16,
							fontSize: fuente,
							width: '1208px',
							paddingLeft: 16,
							paddingRight: 16,
						}}
					>
						<div style={{ width: '100%', textAlign: 'center', paddingRight: 50 }}>
							<strong style={{ fontSize: '30px' }}>IMÁGENES</strong>
						</div>
						<Row style={{ marginTop: 20 }}>
							<Col xs={8}>
								<strong>OA : </strong> {datosModal.estado.dataMedico.NUM_ATEN_MED}
							</Col>
							<Col xs={8}>
								<strong>FECHA : </strong> {datosModal.estado.dataMedico.FEC_CREA}
							</Col>
							<Col xs={8}>
								<strong>HORA : </strong> {datosModal.estado.dataMedico.FEC_CREA_HORA}
							</Col>
						</Row>

						<Row style={{ marginTop: espacios - 10 }}>
							<Col xs={24}>
								<strong>PACIENTE :</strong> {datosModal.estado.NUM_DOCUMENTO} -{' '}
								{datosModal.estado.dataMedico.NOMBRE}
							</Col>
						</Row>
						<Row style={{ marginTop: espacios - 10 }}>
							<Col xs={16}>
								<strong>TITULAR : </strong> {datosModal.estado.dataMedico.NOMBRE}
							</Col>
							<Col xs={8}>
								<strong>VIGENCIA : </strong>
								{datosModal.estado.dataMedico.FEC_CREA}{' '}
								{tratamiento.validezreceta !== '' ? ' AL ' + tratamiento.validezreceta : ''}
							</Col>
						</Row>
						<Row style={{ marginTop: espacios - 10 }}>
							<Col xs={12}>
								<strong>MÉDICO :</strong> {cmp !== '' ? cmp + ' - ' : ''}{' '}
								{datosModal.estado.dataMedico.MEDICO}
							</Col>
						</Row>
						<Row
							style={{
								marginTop: espacios + 10,
								marginBottom: espacios,
								paddingTop: 10,
								paddingBottom: 10,
								backgroundColor: tipo === 'N' ? backgroundRojo : backgroundAzul,
							}}
						>
							<Col xs={24}>
								<strong>- DETALLES</strong>
							</Col>
						</Row>

						{/* ------------------------------------ IMAGENES------------------------------------*/}
						{dataProcedimiento.length > 0 ? (
							dataProcedimiento.map((proc, index) => {
								if (index <= 7) {
									return (
										<div>
											<Row style={{ marginTop: espacios - 20, marginLeft: 30 }}>
												<Col xs={4}>
													<strong style={{ fontWeight: 600 }}>CÓDIGO: </strong>
												</Col>
												<Col xs={8}>
													<strong style={{ fontWeight: 600 }}>DESCRIPCIÓN: </strong>
												</Col>
												<Col xs={6}>
													<strong style={{ fontWeight: 600 }}>LABORATORIO: </strong>
												</Col>
												<Col xs={6}>
													<strong style={{ fontWeight: 600 }}>RUC: </strong>
												</Col>
											</Row>
											<Row style={{ marginTop: espacios - 20, marginLeft: 30 }}>
												<Col xs={4}>{proc.COD_PROD}</Col>
												<Col xs={8}>{proc.DESC_PROD}</Col>
												<Col xs={6}>{proc.NOM_LAB}</Col>
												<Col xs={6}>{proc.RUC}</Col>
											</Row>
											<DividerPersonalizado espacios={espacios} />
										</div>
									);
								} else {
									return null;
								}
							})
						) : (
							<Row style={{ marginTop: espacios, marginLeft: 10 }}>
								<Col xs={24}>
									<strong>NO SE ENCONTRARON LABORATORIOS</strong>
								</Col>
							</Row>
						)}

						{recomendacion.length > 0 && (
							<Row style={{ marginTop: espacios, marginLeft: 10 }}>
								<Col xs={24}>
									<strong>RECOMENDACIONES GENERALES</strong>
								</Col>
								<Col xs={24}>- {recomendacion.trim() !== '' ? recomendacion : sinRegistro}</Col>
							</Row>
						)}
					</div>

					{dataProcedimiento.length > 0 && dataProcedimiento.length <= 8 && (
						<div style={{ position: 'absolute', bottom: 250, width: '100%' }}>
							<Row
								style={{
									display: 'flex',
									flexDirection: 'row',
									padding: 5,
									textAlign: 'center',
									width: '35%',
									marginLeft: 'auto',
									marginRight: 'auto',
								}}
							>
								<Col xs={24}>
									<img alt="firma" src={firma} style={{ width: '200px' }} />
								</Col>
								<Col xs={24}>
									<h3 style={{ borderTop: '2px solid #000' }}>
										<strong>MÉDICO: </strong>
										{datosModal.estado.dataMedico.MEDICO}{' '}
									</h3>
								</Col>
							</Row>
						</div>
					)}
				</div>
			</div>

			{dataProcedimiento.length > 8 && (
				<div id="pagina2">
					<div style={{ position: 'relative' }}>
						<img alt="hoja membreatada" src={tipo === 'N' ? rojo : azul} />
						<div
							style={{
								position: 'absolute',
								top: 170,
								left: 16,
								fontSize: fuente,
								width: '1208px',
								paddingLeft: 16,
								paddingRight: 16,
							}}
						>
							<div
								style={{
									width: '100%',
									textAlign: 'center',
									paddingRight: 50,
									marginBottom: espacios,
								}}
							>
								<strong style={{ fontSize: '30px' }}>IMÁGENES</strong>
							</div>

							{dataProcedimiento.length > 8 ? (
								dataProcedimiento.map((proc, index) => {
									console.log('INDEX LAB 2:', index);
									if (index > 7 && index <= 17) {
										return (
											<div>
												<Row style={{ marginTop: espacios - 20, marginLeft: 30 }}>
													<Col xs={4}>
														<strong style={{ fontWeight: 600 }}>CÓDIGO: </strong>
													</Col>
													<Col xs={8}>
														<strong style={{ fontWeight: 600 }}>DESCRIPCIÓN: </strong>
													</Col>
													<Col xs={6}>
														<strong style={{ fontWeight: 600 }}>LABORATORIO: </strong>
													</Col>
													<Col xs={6}>
														<strong style={{ fontWeight: 600 }}>RUC: </strong>
													</Col>
												</Row>
												<Row style={{ marginTop: espacios - 20, marginLeft: 30 }}>
													<Col xs={4}>{proc.COD_PROD}</Col>
													<Col xs={8}>{proc.DESC_PROD}</Col>
													<Col xs={6}>{proc.NOM_LAB}</Col>
													<Col xs={6}>{proc.RUC}</Col>
												</Row>
												<DividerPersonalizado espacios={espacios} />
											</div>
										);
									} else {
										return null;
									}
								})
							) : (
								<Row style={{ marginTop: espacios, marginLeft: 10 }}>
									<Col xs={24}>
										<strong>NO SE ENCONTRARON LABORATORIOS</strong>
									</Col>
								</Row>
							)}

							{recomendacion.length > 0 && (
								<Row style={{ marginTop: espacios, marginLeft: 10 }}>
									<Col xs={24}>
										<strong>RECOMENDACIONES GENERALES</strong>
									</Col>
									<Col xs={24}>- {recomendacion.trim() !== '' ? recomendacion : sinRegistro}</Col>
								</Row>
							)}
						</div>
						{dataProcedimiento.length > 8 && dataProcedimiento.length <= 18 && (
							<div style={{ position: 'absolute', bottom: 250, width: '100%' }}>
								<Row
									style={{
										display: 'flex',
										flexDirection: 'row',
										padding: 5,
										textAlign: 'center',
										width: '35%',
										marginLeft: 'auto',
										marginRight: 'auto',
									}}
								>
									<Col xs={24}>
										<img alt="firma" src={firma} style={{ width: '200px' }} />
									</Col>
									<Col xs={24}>
										<h3 style={{ borderTop: '2px solid #000' }}>
											<strong>MÉDICO: </strong>
											{datosModal.estado.dataMedico.MEDICO}{' '}
										</h3>
									</Col>
								</Row>
							</div>
						)}
					</div>
				</div>
			)}

			{dataProcedimiento.length > 18 && (
				<div id="pagina3">
					<div style={{ position: 'relative' }}>
						<img alt="hoja membreatada" src={tipo === 'N' ? rojo : azul} />
						<div
							style={{
								position: 'absolute',
								top: 170,
								left: 16,
								fontSize: fuente,
								width: '1208px',
								paddingLeft: 16,
								paddingRight: 16,
							}}
						>
							<div
								style={{
									width: '100%',
									textAlign: 'center',
									paddingRight: 50,
									marginBottom: espacios,
								}}
							>
								<strong style={{ fontSize: '30px' }}>IMÁGENES</strong>
							</div>

							{dataProcedimiento.length > 18 ? (
								dataProcedimiento.map((proc, index) => {
									console.log('INDEX LAB 2:', index);
									if (index > 17 && index <= 27) {
										return (
											<div>
												<Row style={{ marginTop: espacios - 20, marginLeft: 30 }}>
													<Col xs={4}>
														<strong style={{ fontWeight: 600 }}>CÓDIGO: </strong>
													</Col>
													<Col xs={8}>
														<strong style={{ fontWeight: 600 }}>DESCRIPCIÓN: </strong>
													</Col>
													<Col xs={6}>
														<strong style={{ fontWeight: 600 }}>LABORATORIO: </strong>
													</Col>
													<Col xs={6}>
														<strong style={{ fontWeight: 600 }}>RUC: </strong>
													</Col>
												</Row>
												<Row style={{ marginTop: espacios - 20, marginLeft: 30 }}>
													<Col xs={4}>{proc.COD_PROD}</Col>
													<Col xs={8}>{proc.DESC_PROD}</Col>
													<Col xs={6}>{proc.NOM_LAB}</Col>
													<Col xs={6}>{proc.RUC}</Col>
												</Row>
												<DividerPersonalizado espacios={espacios} />
											</div>
										);
									} else {
										return null;
									}
								})
							) : (
								<Row style={{ marginTop: espacios, marginLeft: 10 }}>
									<Col xs={24}>
										<strong>NO SE ENCONTRARON LABORATORIOS</strong>
									</Col>
								</Row>
							)}

							{recomendacion.length > 0 && (
								<Row style={{ marginTop: espacios, marginLeft: 10 }}>
									<Col xs={24}>
										<strong>RECOMENDACIONES GENERALES</strong>
									</Col>
									<Col xs={24}>- {recomendacion.trim() !== '' ? recomendacion : sinRegistro}</Col>
								</Row>
							)}
						</div>
						{dataProcedimiento.length > 18 && dataProcedimiento.length <= 28 && (
							<div style={{ position: 'absolute', bottom: 250, width: '100%' }}>
								<Row
									style={{
										display: 'flex',
										flexDirection: 'row',
										padding: 5,
										textAlign: 'center',
										width: '35%',
										marginLeft: 'auto',
										marginRight: 'auto',
									}}
								>
									<Col xs={24}>
										<img alt="firma" src={firma} style={{ width: '200px' }} />
									</Col>
									<Col xs={24}>
										<h3 style={{ borderTop: '2px solid #000' }}>
											<strong>MÉDICO: </strong>
											{datosModal.estado.dataMedico.MEDICO}{' '}
										</h3>
									</Col>
								</Row>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

const DividerPersonalizado = ({ espacios }) => {
	return (
		<Col xs={24} style={{ textAling: 'center', paddingTop: espacios - 30 }}>
			<Divider style={{ borderTop: '3px dashed rgba(0, 0, 0, 0.55)' }}></Divider>
		</Col>
	);
};
