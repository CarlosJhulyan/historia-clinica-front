import React, { createRef, useState, useEffect } from 'react';
import { message, Col, Select, Form, Spin, Row, Modal, Table, Button, Checkbox } from 'antd';
import { datosEnviar } from '../../../constants/datosEnviar';
import { useDispatch, useSelector } from 'react-redux';
import { setDiagnosticoAction } from '../../../appRedux/actions/menu/diagnostico';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ModalSugerencia } from '../../../components/modal/ModalSugerencia';
import { httpClient } from '../../../util/Api';
import {
	setSugerenciaTratamiento,
	setSugerenciaProcedimiento,
	setSugerenciaImagenes,
	setSugerenciaLaboratorio,
	setSugerenciaInterProcedimiento,
} from '../../../appRedux/actions/menu/sugerencias';

const Diagnostico = ({ datosModal }) => {

	console.log("DATOOS MODAL:", datosModal);
	const { Option } = Select;
	const dispatch = useDispatch();
	const [estadoBtn, setEstadoBtn] = useState(true);
	const [flag, setFlag] = useState(false);
	const [data, setData] = useState([]);
	const [diagnostico, setDiagnostico] = useState([]);
	const [btnSugerencia, setBtnSugerencia] = useState(false);
	const [modalSugerencia, setModalSugerencia] = useState(false);
	const { historiaClinica, visualizar } = useSelector(state => state.helpers);

	const token = JSON.parse(sessionStorage.getItem('token'));



	//Combos
	const tipoDiagnostico = useSelector(state => state.combosReducer.tipoDiagnostico);
	const dataDiagnostico = useSelector(state => state.combosReducer.dataDiagnostico);

	//REDUX
	const dataSource = useSelector(state => state.diagnostico);

	//estado de la tabla
	const setDataSource = data => {
		dispatch(setDiagnosticoAction(data));
		enviarSugerencias(data);
	};

	const enviarSugerencias = data => {
		if (data?.length > 0) {
			httpClient
				.post('/consulta/getSugerencias', {
					diagnosticos: data,
					cod_medico: token.cod_medico
				})
				.then(resp => {
					console.log('REEEEEEEEESPUESTA:', resp);
					if (resp.data.success) {
						dispatch(setSugerenciaTratamiento(resp.data.data.tratamientos));
						dispatch(setSugerenciaProcedimiento(resp.data.data.procedimientos));
						dispatch(setSugerenciaInterProcedimiento(resp.data.data.interconsultas));
						dispatch(setSugerenciaImagenes(resp.data.data.imagenes));
						dispatch(setSugerenciaLaboratorio(resp.data.data.laboratorios));

						if (
							resp.data.data.tratamientos.length !== 0 ||
							resp.data.data.procedimientos.length !== 0 ||
							resp.data.data.interconsultas.length !== 0 ||
							resp.data.data.imagenes.length !== 0 ||
							resp.data.data.laboratorios.length !== 0
						) {
							setBtnSugerencia(true);
						}
					}
				});
		} else {
			console.log('ENVIANDO DATA SUGERENCIAS ERR');
		}
	};

	function confirm(e) {
		Modal.confirm({
			title: '¿Desea eliminar este registro?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si, Eliminar Registro',
			cancelText: 'No, Cancelar',
			onOk: () => {
				quitarItem(e);
			},
		});
	}

	const quitarItem = e => {
		const filtredData = dataSource.filter(item => item.coddiagnostico !== e.coddiagnostico);
		setDataSource(filtredData);
	};

	// referencia del formulario
	const formRef = createRef();
	const columns = [
		{
			title: 'Codigo',
			dataIndex: 'cie',
			width: 100,
		},
		{
			title: 'Descripción',
			dataIndex: 'diagnostico',
		},
		{
			title: 'Tipo',
			dataIndex: 'tipodiagnostico',
		},
		{
			title: '',
			key: 'borrar',
			width: 100,
			align: 'center',
			render: e => (
				<Button
					disabled={historiaClinica | visualizar}
					className="gx-btn-danger"
					style={{ margin: '0px', padding: '4px 10px 0 10px' }}
					onClick={() => {
						confirm(e);
					}}
				>
					<i className="icon icon-trash" />
				</Button>
			),
		},
	];

	const handleChangeDiagnostico = value => {
		data.map(element => {
			if (element.COD_DIAGNOSTICO == value) {
				setDiagnostico({
					...diagnostico,
					coddiagnostico: element.COD_DIAGNOSTICO,
					cie: element.COD_CIE_10,
					diagnostico: element.DES_DIAGNOSTICO,
					secuencia: datosModal.estado.SECUENCIA_ANTECEDENTE,
				});
				formRef.current.setFieldsValue({ cie: element.COD_DIAGNOSTICO, diagnostico: element.COD_DIAGNOSTICO });
			}
		});
	};
	const handleChangeTipo = value => {
		setDiagnostico({
			...diagnostico,
			tipodiagnostico: value === 'P' ? 'PRESUNTIVO' : 'DEFINITIVO',
		});
		formRef.current.setFieldsValue({ tipodiagnostico: value });
	};

	const agregarDiagnostico = () => {
		if (diagnostico.cie && diagnostico.tipodiagnostico) {
			if (dataSource.length >= 1) {
				let existe = false;

				dataSource.map(element => {
					console.log('ELEMENTOOOOOOOOOOOO1:', element);
					console.log('ELEMENTOOOOOOOOOOOO2:', diagnostico);

					if (element.coddiagnostico === diagnostico.coddiagnostico) {
						existe = true;
					}
				});

				if (existe) {
					console.log('VERDADERO');
					message.warning('El registro ya se encuentra en la tabla');
				} else {
					console.log('FALSO');
					const data = { ...diagnostico, key: diagnostico.coddiagnostico };
					//setBtnSugerencia(true);
					setDiagnostico({});
					setDataSource([...dataSource, data]);
					enviarSugerencias();
					formRef.current.setFieldsValue({ cie: null, diagnostico: null, tipodiagnostico: null });
				}
			} else {
				setDiagnostico({});
				formRef.current.setFieldsValue({ cie: null, diagnostico: null, tipodiagnostico: null });
				const data = { ...diagnostico, key: diagnostico.coddiagnostico };
				setDataSource([...dataSource, data]);
				//setBtnSugerencia(true);
			}
		} else {
			message.error('Llene todos los campos');
		}
	};

	useEffect(() => {
		if (dataSource.length === 0) {
			setBtnSugerencia(false);
		}
	}, [dataSource]);

	useEffect(() => {
		if (diagnostico.cie && diagnostico.tipodiagnostico) {
			setEstadoBtn(false);
		} else {
			setEstadoBtn(true);
		}
	}, [diagnostico.cie, diagnostico.tipodiagnostico]);

	useEffect(() => {
		if (dataDiagnostico.length) {
			setData(dataDiagnostico);
			setFlag(true);
		}
	}, [setData, dataDiagnostico]);

	useEffect(() => {
		if (dataSource !== null) {
			console.log('DATA:', dataSource);
			dispatch(setDiagnosticoAction(dataSource));
			datosEnviar.diagnostico = dataSource;
		}
	}, [dataSource]);

	return (
		<>
			<Form
				ref={formRef}
				layout="vertical"
			// initialValues={estado}
			>
				{flag ? (
					<>
						<Row style={{ flexDirection: 'row', textAlign: 'end' }}>
							{btnSugerencia && (
								<Col lg={24}>
									<span style={{ color: '#F60F5B' }}>¡Se encontraron sugerencias para el diagnóstico! </span>
									<Button
										size="small"
										className="gx-mb-0"
										style={{ backgroundColor: '#F60F5B', color: '#fff' }}
										htmlType="submit"
										onClick={() => setModalSugerencia(true)}
									>
										Ver Sugerencias
									</Button>
								</Col>
							)}
						</Row>
						<Row style={{ flexDirection: 'row', paddingTop: '20px' }}>
							<Col xl={3} lg={6} md={24} sm={24} xs={24}>
								<Form.Item
									name="cie"
									label="CIE"
									rules={[
										{
											required: false,
											message: 'Ingrese un codigo válido',
										},
									]}
								>
									<Select
										disabled={historiaClinica | visualizar}
										showSearch
										style={{ width: '100%' }}
										placeholder="Codigo"
										optionFilterProp="children"
										onChange={handleChangeDiagnostico}
										filterOption={(input, option) =>
											option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
										}
									>
										{data
											? data.map(element => {
												return (
													<Option key={element.COD_DIAGNOSTICO} value={element.COD_DIAGNOSTICO}>
														{element.COD_CIE_10}
													</Option>
												);
											})
											: null}
									</Select>
								</Form.Item>
							</Col>
							<Col xl={12} lg={18} md={24} sm={24} xs={24}>
								<Form.Item
									name="diagnostico"
									label="Diagnóstico"
									rules={[
										{
											required: false,
											message: 'Ingrese un diagnostico válido',
										},
									]}
								>
									<Select
										disabled={historiaClinica | visualizar}
										showSearch
										style={{ width: '100%' }}
										placeholder="Diagnostico"
										optionFilterProp="children"
										onChange={handleChangeDiagnostico}
										filterOption={(input, option) =>
											option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
										}
									>
										{data.map(element => {
											return (
												<Option key={element.COD_DIAGNOSTICO} value={element.COD_DIAGNOSTICO}>
													{element.DES_DIAGNOSTICO}
												</Option>
											);
										})}
									</Select>
								</Form.Item>
							</Col>
							<Col xl={6} lg={18} md={16} sm={24} xs={24}>
								<Form.Item
									name="tipodiagnostico"
									label="Tipo"
									rules={[
										{
											required: false,
											message: 'Ingrese un tipo válido',
										},
									]}
								>
									<Select disabled={historiaClinica | visualizar} placeholder="Seleccione" onChange={handleChangeTipo}>
										{tipoDiagnostico
											? tipoDiagnostico.map(element => {
												return (
													<Option key={element.CODIGO} value={element.CODIGO}>
														{element.ETIQUETA}
													</Option>
												);
											})
											: null}
									</Select>
								</Form.Item>
							</Col>
							<Col xl={3} lg={6} md={8} sm={24} xs={24}>
								<Form.Item style={{ marginTop: '25px' }}>
									<Button
										className="gx-mb-0"
										disabled={estadoBtn}
										type="default"
										htmlType="submit"
										style={{ width: '100% ', height: '100%' }}
										onClick={agregarDiagnostico}
									>
										Agregar
									</Button>
								</Form.Item>
							</Col>
							<Col xl={24} lg={24} md={24} sm={24} xs={24}>
								<Table className="gx-table-responsive" columns={columns} dataSource={dataSource} />
							</Col>
						</Row>
					</>
				) : (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<Spin tip="Cargando" />
					</div>
				)}
			</Form>
			{modalSugerencia ? (
				<ModalSugerencia modalSugerencia={modalSugerencia} setModalSugerencia={setModalSugerencia} />
			) : null}
		</>
	);
};
export default Diagnostico;
