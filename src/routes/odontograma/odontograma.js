import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Dropdown, Row, Spin, Menu as MenuColapsable, Typography } from 'antd';
import Menu from './MenuOdonto';
import DientesAdultoSuperior from './adultoSuperior';
import DientesInfanteSuperior from './infanteSuperior';
import DientesAdultoInferior from './adultoInferior';
import DientesInfanteInferior from './infanteInferior';
import { DienteAdulto } from '../../models/DienteAdulto';
import { httpClient } from '../../util/Api';
import './styles.css';
import { actualizar_diente, setEstadoOdonotograma } from '../../appRedux/actions';
import { ListaOdontograma } from '../historialOdontograma';
import { MenuOutlined } from '@ant-design/icons';
import domtoimage from 'dom-to-image';
import { Diente } from '../../models/Diente';

export const Odontograma = ({
	historial,
	datosModal,
	odontograma,
	setEstado,
	estado,
}) => {

	const [valorScala, setValorScala] = useState(1.0);

	const dispatch = useDispatch();
	const dientePrueba = useSelector((state) => state.dientePrueba);
	const estadosOdontograma = dientePrueba.estadoOdontograma;
	const [verHistorial, setVerHistorial] = useState(false);

	const setEstadosOdontograma = (data) => {
		dispatch(setEstadoOdonotograma(data));
	};

	const { Title } = Typography;

	const [datosHistorial, setDatosHistorial] = useState(null);

	const [cargando, setCargando] = useState(true);

	//Función para disparar las acciones con las funciones del actions.

	//Instancia del Diente.
	const diente = new DienteAdulto();

	// Set del diente para que se pueda editar.
	let diente2 = diente;

	//Obtener el estado del diente reducer.

	const v = useSelector((state) => state.dientePrueba.diente);
	diente2.importar(v);


	const usuario = JSON.parse(sessionStorage.getItem('token'));

	// console.log(odontograma);

	console.log(datosModal);

	// const obtenerData = async (tipo) => {
	//   const body = {
	//     COD_PACIENTE: datosModal.estado.COD_PACIENTE,
	//     COD_GRUPO_CIA: datosModal.estado.COD_GRUPO_CIA,
	//     COD_MEDICO: usuario.cod_medico
	//   };
	//   const { data } = await httpClient.post(`/odontograma/` + tipo, body);
	//   return data;
	// }

	useEffect(() => {
		console.log('ASDASD', estadosOdontograma);
		switch (estadosOdontograma) {
			case 'inicial':
				obtenerOdontoInicial();
				break;
			case 'evolutivo':
				obtenerOdontoEvolutivo();
				break;
			case 'historial':
				const diente = new Diente();
				dispatch(actualizar_diente(diente.exportar()));
				setDatosHistorial(null);
				setCargando(false);
				break;
			default:
				break;
		}
	}, [estadosOdontograma]);

	useEffect(() => {
		// obtenerData('inicial').then(a => {

		//   console.log('dataInicial', a);

		// });

		// obtenerOdontoInicial();
		// if (tipoOdonto) {
		// } else {
		//   setDienteInicial({});
		//   const data1 = diente2.exportar();
		//   dispatch(actualizar_diente(data1));
		// }

		// setDienteInicial({})
		// obtenerData().then(result => {
		//   console.log("Result:", result);
		//   COD_GRUPO_CIA
		//     console.log('DIENTEEEEEEE', JSON.stringify(result.data));
		//     setDienteInicial(result.data);

		//     diente2.importar(JSON.stringify(result.data));
		//     const data1 = diente2.exportar();
		//     console.log('EXPORTAR', data1);
		//     dispatch(actualizar_diente(data1));
		//   } else {
		//     setDienteInicial({});
		//     const data1 = diente2.exportar();
		//     console.log('EXPORTAR', data1);
		//     dispatch(actualizar_diente(data1));
		//   }

		//   return (() => {
		//     dispatch(actualizar_diente(''));
		//   });
		// });

		window.addEventListener('resize', escalar);
		return () => window.removeEventListener('resize', escalar);
	}, []);

	useEffect(() => {
		// if (cargando) {
		setTimeout(escalar, 100);
		// }
	}, [cargando]);

	const escalar = () => {
		const clientWidth = document.getElementById(historial ? 'contenedor_odonto_hist' : 'contenedor_odonto').clientWidth;
		// const clientHeigth = document.getElementById(historial ? 'contenedor_odonto_hist' : 'contenedor_odonto').clientHeigth;

		if (clientWidth !== 0) {
			if (clientWidth < 990) {
				console.log('es menor', clientWidth);
				setValorScala(clientWidth / 1050);
			} else {
				setValorScala(1.0);
			}
		}
	};

	const enviarData = async () => {
		// const dataExportada = diente2.exportar();
		console.log('CARGANDO API');
		const body = {
			COD_PACIENTE: '0010260788',
			COD_GRUPO_CIA: '001',
			COD_MEDICO: '0000026144',
			data: diente2,
		};

		const data = await httpClient.post(`/odontograma/registrar`, body);
		console.log('RESPUESTA API', data);
	};

	const obtenerOdontoInicial = async () => {
		setCargando(true);

		setEstadosOdontograma('inicial');
		const body = {
			COD_PACIENTE: datosModal.estado.COD_PACIENTE,
			COD_GRUPO_CIA: datosModal.estado.COD_GRUPO_CIA,
			COD_MEDICO: usuario.cod_medico,
		};
		const { data } = await httpClient.post('/odontograma/inicial', body);

		if (data.success && data.data) {
			// setDienteInicial(data.data.datosOdontograma);
			diente2.importar(JSON.stringify(data.data.datosOdontograma));
			const data1 = diente2.exportar();
			dispatch(actualizar_diente(data1));
			setCargando(false);
			setEstado({
				especificaciones: data.data.especificaciones,
				observaciones: data.data.observaciones,
			});
		} else {
			// setDienteInicial({});
			const data1 = diente2.exportar();
			dispatch(actualizar_diente(data1));
			setCargando(false);
		}
	};

	const obtenerOdontoHistorial = async (dd) => {
		// setEstadosOdontograma('historial');
		setCargando(true);
		setDatosHistorial(dd);

		const { data } = await httpClient.get('/odontograma/detalle/' + dd.key);

		if (data.success && data.data) {
			// setDienteInicial(data.data.datosOdontograma);
			diente2.importar(JSON.stringify(data.data.datosOdontograma));
			const data1 = diente2.exportar();
			dispatch(actualizar_diente(data1));
			setCargando(false);
			setEstado({
				especificaciones: data.data.especificaciones,
				observaciones: data.data.observaciones,
			});
		} else {
			// setDienteInicial({});
			const data1 = diente2.exportar();
			dispatch(actualizar_diente(data1));
			setCargando(false);
		}
	};

	const obtenerOdontoEvolutivo = async () => {
		setCargando(true);
		setEstadosOdontograma('evolutivo');
		const body = {
			COD_PACIENTE: datosModal.estado.COD_PACIENTE,
			COD_GRUPO_CIA: datosModal.estado.COD_GRUPO_CIA,
			COD_MEDICO: usuario.cod_medico,
		};
		const { data } = await httpClient.post('/odontograma/final', body);
		if (data.success && data.data) {
			// setDienteInicial(data.data.datosOdontograma);
			diente2.importar(JSON.stringify(data.data.datosOdontograma));
			const data1 = diente2.exportar();
			dispatch(actualizar_diente(data1));
			setCargando(false);
			setEstado({
				especificaciones: data.data.especificaciones,
				observaciones: data.data.observaciones,
			});
		} else {
			// setDienteInicial({});
			const data1 = diente2.exportar();
			dispatch(actualizar_diente(data1));
			setCargando(false);
		}
	};

	const [imagen, setImagen] = useState(null);

	const capturar = async () => {
		const dataUrl = await domtoimage.toPng(document.getElementById('odontograma'), { quality: 1, bgcolor: '#fff' });
		var img = new Image();
		img.src = dataUrl;
		setImagen(img.src);
	};

	return (
		<div>
			<Row style={{ paddingTop: '30px' }} className="row-odontograma">
				<Col lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 40 }}>
					<div>
						<Row style={{ justifyContent: 'space-between' }}>
							{historial ? (
								<Col lg={20} md={24} sm={24} xs={24} style={{ textAlign: 'center' }}>
									<Title level={3}>
										Odontograma{' '}
										{historial
											? datosHistorial !== null
												? datosHistorial.fecha + ' - ' + datosHistorial.medico
												: ''
											: estadosOdontograma === 'inicial'
												? 'Inicial'
												: 'Evolutivo'}
									</Title>
								</Col>
							) : (
								<Col lg={16} md={16} sm={14} xs={24} style={{ textAlign: 'center' }}>
									<Title level={3}>
										Odontograma{' '}
										{historial
											? datosHistorial !== null
												? datosHistorial.fecha + ' - ' + datosHistorial.medico
												: ''
											: estadosOdontograma === 'inicial'
												? 'Inicial'
												: 'Evolutivo'}
									</Title>
								</Col>
							)}

							{historial
								?
								<Col lg={4} md={8} sm={10} xs={24}>
									<div style={{ marginTop: 5 }}>
										<div>
											{/* <span className="gx-link ant-dropdown-link">
												VER HISTORIAL
											</span> */}
											<Button style={{ backgroundColor: '#F60F5B', color: '#fff' }} onClick={() => setVerHistorial(true)}>
												VER HISTORIAL
											</Button>
										</div>
									</div>
								</Col>
								: (
									<Col lg={8} md={8} sm={10} xs={24} style={{ textAlign: 'right' }}>
										<div style={{ marginTop: 5, marginLeft: 6 }}>
											<Dropdown
												trigger={['click']}
												overlay={
													<MenuColapsable>
														<MenuColapsable.Item onClick={() => obtenerOdontoInicial()} key="Odontograma.Inicial">
															{/* <i className="icon icon-thumb-up" /> */} Odontograma Inicial
														</MenuColapsable.Item>
														<MenuColapsable.Item onClick={() => obtenerOdontoEvolutivo()} key="Odontograma.Evolutivo">
															{/* <i className="icon icon-thumbs-down" /> */} Odontograma Evolutivo
														</MenuColapsable.Item>
													</MenuColapsable>
												}
											>
												<div>
													<span className="gx-link ant-dropdown-link">
														SELECCIONE ODONTOGRAMA &nbsp; &nbsp; <MenuOutlined style={{ fontSize: '19px' }} />{' '}
														&nbsp;&nbsp;&nbsp;
													</span>
												</div>
											</Dropdown>
										</div>
									</Col>
								)}
						</Row>
					</div>
				</Col>

				<>
					<Col
						lg={historial ? 24 : 17}
						md={24}
						sm={24}
						xs={24}
						className="contenedor-odontograma"
						id={historial ? 'contenedor_odonto_hist' : 'contenedor_odonto'}
						style={{ height: 930 * valorScala }}
					>
						{cargando ? (
							<div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
								<Spin tip="Cargando" />
							</div>
						) : (
							<div
								className="width-odontograma"
								style={{ transform: 'scale(' + valorScala + ')', transformOrigin: 'top' }}
								id="odontograma"
							>
								<div style={{ paddingTop: '50px' }}>
									<DientesAdultoSuperior />
								</div>
								<div style={{ paddingTop: '50px' }}>
									<DientesInfanteSuperior />
								</div>
								<div style={{ paddingTop: '50px' }}>
									<DientesInfanteInferior />
								</div>
								<div style={{ paddingTop: '50px' }}>
									<DientesAdultoInferior />
								</div>
							</div>
						)}
					</Col>

					<Col lg={7} md={24} sm={24} xs={24}>
						{historial ? (
							<ListaOdontograma
								verHistorial={verHistorial}
								setVerHistorial={setVerHistorial}
								cargando={cargando}
								estadosOdontograma={estadosOdontograma}
								obtenerOdontoHistorial={obtenerOdontoHistorial}
								datosModal={datosModal}
								estado={estado}
								setEstado={setEstado}

							/>
						) : (
							<Menu fff={capturar} imagen={imagen} setImagen={setImagen} />
						)}
					</Col>
				</>
			</Row>
			<br />
		</div>
	);
};
