import React, { createRef, useState, useEffect } from 'react';
import { Col, DatePicker, Form, Modal, Input, Row, Select, Button, Table, Divider } from 'antd';
import ModalTratamiento from './modalTratamiento';
import moment from 'moment';
import ModalEditarTratamiento from './modalEditar';
import { useDispatch, useSelector } from 'react-redux';
import {
	setCabeceraReceta,
	setTratamiento,
	setTratamientoCabeceraDetalle,
} from '../../../../appRedux/actions/menu/tratamiento';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const SeptimaParte = ({ datosModal }) => {
	const dispatch = useDispatch();

	const [abrirModal, setAbrirModal] = useState(false);
	const [estadoBtn, setEstadoBtn] = useState(true);
	const [estadoVia, setEstadoVia] = useState(false);
	const [modalEditar, setModalEditar] = useState(false);

	const [estadoCabecera, setEstadoCabecera] = useState([]);
	const [dataEditar, setDataEditar] = useState([]);

	const { historiaClinica, visualizar } = useSelector(state => state.helpers);

	//Combos
	const dataTratamiento = useSelector(state => state.combosReducer.dataTratamiento);
	const viaAdministracion = useSelector(state => state.combosReducer.viaAdministracion);

	//obsTratamiento
	//const obsTratamiento = useSelector((state) => state.tratamiento.indicacionesgen);

	//REDUX TRATAMIENTO
	const dataSource = useSelector(state => state.tratamientoDetalle);
	const tratamientoCabeceraReceta = useSelector(state => state.tratamientoCabeceraReceta);
	const tratamiento = useSelector(state => state.tratamiento);

	console.log('TRATAMIENTOOOOOOOOOOOOOOO:', dataSource);
	//estado tipo via admin
	const [tipoVia, setTipoVia] = useState([]);

	//estado de la tabla
	const setDataSource = data => {
		dispatch(setTratamientoCabeceraDetalle(data));
	};

	// referencia del formulario
	const formRef = createRef();
	const formRef2 = createRef();

	// estado form 2
	const [dataForm2, setDataForm2] = useState({
		validezreceta: '',
		indicacionesgen: '',
	});

	const editar = record => {
		setModalEditar(true);
		setDataEditar(record);
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

	const quitarItem = record => {
		const filtredData = dataSource.filter(item => item.codprod !== record.codprod);
		setDataSource(filtredData);
	};

	const columns = [
		{
			title: 'Cod.',
			dataIndex: 'codprod',
			width: 100,
		},
		{
			title: 'Producto',
			dataIndex: 'descprod',
		},
		{
			title: 'Tratamiento',
			dataIndex: 'tratamiento',
		},

		{
			title: 'Via Adm.',
			dataIndex: 'etiquetaVia',
		},
		{
			title: 'Dosis',
			dataIndex: 'dosis',
		},
		{
			title: 'Cantidad',
			dataIndex: 'cantidad',
		},

		{
			title: '',
			key: 'actions',
			width: 100,
			align: 'center',
			render: (text, record) => (
				<span>
					<span
						className="gx-link"
						style={{ display: historiaClinica || visualizar ? 'none' : 'inline' }}
					>
						<i
							onClick={() => editar(record)}
							className="icon icon-edit"
							style={{ fontSize: 20, color: 'green' }}
						/>
					</span>
					<Divider type="vertical" />
					<span
						className="gx-link"
						style={{ display: historiaClinica || visualizar ? 'none' : 'inline' }}
					>
						<i
							onClick={() => confirm(record)}
							className="icon icon-trash"
							style={{ fontSize: 20, color: 'red' }}
						/>
					</span>
				</span>
			),
		},
	];

	console.log(
		'DATA TRATAMIENTOOOO:',
		dataTratamiento.filter(item => item.IND_CALCULO_TRAT_HC === 'N')
	);

	/****************************FORM 1 *********************************/
	const buscarTratamiento = () => setAbrirModal(true);

	const handleDatos = value => {
		setAbrirModal(false);

		dataTratamiento.map(element => {
			if (element.key == value.estado) {
				console.log('TRATAMIENTO SELECCIONADO:', element);
				handleChangeTratamiento(element);
			}
		});
	};

	const handleChangeTratamiento = value => {
		formRef.current.setFieldsValue({ producto: value.DESC_PROD });

		setEstadoCabecera({
			...estadoCabecera,
			key: value.COD_PROD,
			codprod: value.COD_PROD,
			descprod: value.DESC_PROD,
			rucempresa: value.RUC,
			valfrac: value.VAL_FRAC,
			unidvta: value.UNIDAD,
			calculo: value.IND_CALCULO_TRAT_HC,
		});
	};

	const onChangeFrecuencia = value => {
		formRef.current.setFieldsValue({ frecuencia: value.target.value });
		//setEstado({ ...estado, frecuencia: value.target.value });
		setEstadoCabecera({ ...estadoCabecera, frecuencia: value.target.value });
	};

	const onChangeDuracion = value => {
		formRef.current.setFieldsValue({ duracion: value.target.value });
		//setEstado({ ...estado, duracion: value.target.value });
		setEstadoCabecera({ ...estadoCabecera, duracion: value.target.value });
	};

	const onChangeTipoVia = value => {
		/* console.log("VALUE VIA:,", value); */
		/* setEstadoVia(false); */
		const result = viaAdministracion.filter(via => via.CODIGO === value);
		const etiquetaVia = result[0].ETIQUETA;
		/* if (etiquetaVia === 'VIA ORAL' || etiquetaVia === 'VIA OPTICA') {
			setEstadoVia(true);
		} else {
			setEstadoVia(false);
		} */

		formRef.current.setFieldsValue({ via: value });
		//setEstado({ ...estado, viaadministracion: value });
		setEstadoCabecera({
			...estadoCabecera,
			viaadministracion: value,
			etiquetaVia: etiquetaVia,
		});
	};

	const onChangeDosis = value => {
		formRef.current.setFieldsValue({ dosis: value.target.value });
		//setEstado({ ...estado, dosis: value.target.value });
		setEstadoCabecera({ ...estadoCabecera, dosis: value.target.value });
	};

	const onChangeCantidad = value => {
		formRef.current.setFieldsValue({ cantidad: value.target.value });
		//setEstado({ ...estado, cantidad: value.target.value });
		setEstadoCabecera({ ...estadoCabecera, cantidad: value.target.value });
	};

	const onChangeRecomendacionAplicar = value => {
		formRef.current.setFieldsValue({ recomendacionAplicar: value.target.value });
		setEstadoCabecera({ ...estadoCabecera, recomendacionAplicar: value.target.value });
	};

	useEffect(() => {
		dispatch(
			setCabeceraReceta({
				...tratamientoCabeceraReceta,
				cantitems: dataSource.length,
			})
		);
	}, [dataSource]);

	//Agregando form 1 a la tabla
	const onClickAgregar = () => {
		let tratamiento;
		console.log('AAAAA:', estadoCabecera);

		if (estadoCabecera) {
			if (estadoCabecera.frecuencia && estadoCabecera.duracion) {
				tratamiento =
					estadoCabecera.frecuencia + ' veces al dia x ' + estadoCabecera.duracion + ' Dias';
			} else {
				tratamiento = '';
			}

			setDataSource([
				...dataSource,
				{
					...estadoCabecera,
					tratamiento: tratamiento,
				},
			]);

			setEstadoCabecera({});
			formRef.current.setFieldsValue({
				producto: '',
				frecuencia: '',
				duracion: '',
				via: '',
				dosis: '',
				cantidad: '',
				recomendacionAplicar: '',
			});
		}
	};

	/****************************FORM 2 *********************************/

	const onChangeReceta = value => {
		let fechaActual = moment().add('days', value.target.value);
		setDataForm2({ ...dataForm2, validez: value.target.value });

		const fecha = fechaActual.format('DD/MM/YYYY');

		dispatch(
			setTratamiento({
				...tratamiento,
				validezreceta: fecha,
			})
		);

		onChangeFecha(fechaActual);
		formRef2.current.setFieldsValue({ validez: value.target.value });
	};

	const onChangeFecha = e => {
		console.log('VER FECHA:', e);
		const fecha = e.format('DD/MM/YYYY');
		setDataForm2({ ...dataForm2, validezreceta: fecha });

		dispatch(
			setCabeceraReceta({
				...tratamientoCabeceraReceta,
				fechavigencia: fecha,
			})
		);

		formRef2.current.setFieldsValue({ validezreceta: e });
	};

	const onChangeRecomendacion = value => {
		setDataForm2({ ...dataForm2, indicacionesgen: value.target.value });
		dispatch(
			setTratamiento({
				...tratamiento,
				indicacionesgen: value.target.value,
			})
		);
		formRef2.current.setFieldsValue({ indicacionesgen: value.target.value });
	};

	const [dataActualizada, setDataActualizada] = useState(null);

	useEffect(() => {
		if (dataActualizada !== null) {
			const map = dataSource.filter(data => data.codprod !== dataActualizada.codprod);
			map.push(dataActualizada);
			setDataSource(map);
		} else {
			console.log('No hay data');
		}
	}, [dataActualizada]);

	//USEEFFECTS

	useEffect(() => {
		if (tratamiento.indicacionesgen) {
			formRef2.current.setFieldsValue({ indicacionesgen: tratamiento.indicacionesgen });
			/* const data = {
				validezreceta: dataForm2.validezreceta,
				indicacionesgen: tratamiento.indicacionesgen,
			};
			dispatch(setTratamiento(data)); */
		}
	}, [tratamiento.indicacionesgen]);

	useEffect(() => {
		if (viaAdministracion) {
			const opc = [];
			viaAdministracion.forEach(element => {
				opc.push(
					<Select.Option key={element.CODIGO} value={element.CODIGO}>
						{element.ETIQUETA}
					</Select.Option>
				);
			});
			setTipoVia(opc);
		}
	}, [viaAdministracion]);

	useEffect(() => {
		if (
			estadoCabecera.codprod &&
			estadoCabecera.frecuencia &&
			estadoCabecera.duracion &&
			estadoCabecera.viaadministracion &&
			estadoCabecera.dosis &&
			estadoCabecera.recomendacionAplicar
		) {
			setEstadoBtn(false);
		} else if (
			estadoCabecera.codprod &&
			estadoCabecera.viaadministracion &&
			estadoCabecera.dosis &&
			estadoCabecera.cantidad &&
			estadoCabecera.recomendacionAplicar
		) {
			setEstadoBtn(false);
		} else {
			setEstadoBtn(true);
		}
	}, [
		estadoCabecera.codprod,
		estadoCabecera.frecuencia,
		estadoCabecera.duracion,
		estadoCabecera.viaadministracion,
		estadoCabecera.dosis,
		estadoCabecera.cantidad,
		estadoCabecera.recomendacionAplicar,
	]);

	/* useEffect(() => {
		if (estadoCabecera.calculo) {
			//setEstadoBtn(false);
			formRef.current.setFieldsValue({ cantidad: 1 });
			setEstadoCabecera({ ...estadoCabecera, cantidad: 1 });
		} else {
			//setEstadoBtn(true);
			formRef.current.setFieldsValue({ cantidad: 0 });
			setEstadoCabecera({ ...estadoCabecera, cantidad: null });
		}
	}, [estadoVia, estadoCabecera.duracion, estadoCabecera.frecuencia]); */

	useEffect(() => {
		if (estadoCabecera.calculo === 'S') {
			if (estadoCabecera.duracion && estadoCabecera.frecuencia) {
				setEstadoCabecera({
					...estadoCabecera,
					cantidad: estadoCabecera.duracion * estadoCabecera.frecuencia,
				});
				formRef.current.setFieldsValue({
					cantidad: estadoCabecera.duracion * estadoCabecera.frecuencia,
				});
			} else {
				setEstadoCabecera({ ...estadoCabecera, cantidad: null });
				formRef.current.setFieldsValue({ cantidad: 0 });
			}
		}

		if (estadoCabecera.calculo === 'N') {
			formRef.current.setFieldsValue({ cantidad: 1 });
			setEstadoCabecera({ ...estadoCabecera, cantidad: 1 });
			/* if (estadoCabecera.duracion && estadoCabecera.frecuencia) {
				formRef.current.setFieldsValue({ cantidad: 1 });
				setEstadoCabecera({ ...estadoCabecera, cantidad: 1 });
			}  else {
				formRef.current.setFieldsValue({ cantidad: 0 });
				setEstadoCabecera({ ...estadoCabecera, cantidad: null });
			}  */
		}
	}, [estadoCabecera.calculo, estadoCabecera.duracion, estadoCabecera.frecuencia]);

	/* useEffect(() => {
		if (dataForm2.validezreceta !== '' && dataForm2.indicacionesgen !== '') {
			dispatch(setTratamiento(dataForm2));
		}
	}, [dataForm2, dispatch]);
 */
	return (
		<>
			<Form ref={formRef} layout="vertical">
				<Row style={{ flexDirection: 'row', paddingTop: '20px' }}>
					<Col lg={18} md={18} sm={16} xs={24}>
						<Form.Item name="producto" label="Tratamiento">
							<Input disabled onChange={handleChangeTratamiento} />
						</Form.Item>
					</Col>
					<Col lg={6} md={6} sm={8} xs={24}>
						<Form.Item style={{ marginTop: '25px' }}>
							<Button
								disabled={historiaClinica | visualizar}
								className="gx-mb-0"
								type="default"
								// htmlType="submit"
								style={{ width: '100% ' }}
								onClick={() => buscarTratamiento()}
							>
								Buscar tratamiento
							</Button>
						</Form.Item>
					</Col>
				</Row>

				<Row style={{ flexDirection: 'row', paddingTop: '20px' }}>
					<Col lg={6} md={6} sm={8} xs={24}>
						<Form.Item name="via" label="Via Administración">
							<Select
								disabled={historiaClinica | visualizar}
								placeholder="Seleccione"
								//defaultValue={tipoVia}
								onChange={e => onChangeTipoVia(e)}
							>
								{tipoVia}
							</Select>
						</Form.Item>
					</Col>
					<Col lg={4} md={6} sm={8} xs={24}>
						<Form.Item name="frecuencia" label="Frecuencia (x día)">
							<Input
								disabled={historiaClinica | visualizar}
								onChange={e => onChangeFrecuencia(e)}
								type="number"
								style={{ width: '100% ' }}
							/>
						</Form.Item>
					</Col>
					<Col lg={4} md={6} sm={8} xs={24}>
						<Form.Item name="duracion" label="Duración (días)">
							<Input
								disabled={historiaClinica | visualizar}
								onChange={e => onChangeDuracion(e)}
								type="number"
								style={{ width: '100% ' }}
							/>
						</Form.Item>
					</Col>

					<Col lg={6} md={6} sm={8} xs={24}>
						<Form.Item name="dosis" label="Dosis">
							<Input
								disabled={historiaClinica | visualizar}
								onChange={e => onChangeDosis(e)}
								type="text"
								style={{ width: '100% ' }}
							/>
						</Form.Item>
					</Col>
					<Col lg={4} md={6} sm={8} xs={24}>
						<Form.Item name="cantidad" label="Cantidad">
							<Input
								disabled={historiaClinica | visualizar}
								onChange={e => onChangeCantidad(e)}
								type="number"
								style={{ width: '100% ' }}
							/>
						</Form.Item>
					</Col>

					<Col lg={20} md={6} sm={8} xs={24}>
						<Form.Item name="recomendacionAplicar" label="Recomendación a Aplicar">
							<Input.TextArea
								disabled={historiaClinica | visualizar}
								onChange={e => onChangeRecomendacionAplicar(e)}
								type="text"
								style={{ width: '100% ' }}
							/>
						</Form.Item>
					</Col>
					<Col lg={4} md={18} sm={8} xs={24}>
						<Form.Item style={{ marginTop: '25px' }}>
							<Button
								className="gx-mb-0"
								onClick={() => onClickAgregar()}
								type="default"
								disabled={estadoBtn}
								htmlType="submit"
								style={{ width: '100% ' }}
							>
								Agregar
							</Button>
						</Form.Item>
					</Col>
				</Row>
				<Row style={{ flexDirection: 'row', paddingTop: '20px' }}>
					<Col lg={24} md={24} sm={24} xs={24}>
						<Table className="gx-table-responsive" columns={columns} dataSource={dataSource} />
						<br />
						<br />
					</Col>
				</Row>
			</Form>

			{/* FORM 2  */}
			<Form ref={formRef2} layout="vertical" initialValues={dataForm2}>
				<Row style={{ flexDirection: 'row', paddingTop: '20px' }}>
					<Col lg={5} md={12} sm={12} xs={24}>
						<Form.Item
							name="validez"
							label="Validez de Receta (días)"
							rules={[
								{
									required: true,
									message: 'Ingrese una validez',
								},
							]}
						>
							<Input
								disabled={historiaClinica | visualizar}
								type="number"
								onChange={e => onChangeReceta(e)}
								style={{ width: '100% ' }}
							/>
						</Form.Item>
					</Col>
					<Col lg={5} md={12} sm={12} xs={24}>
						<Form.Item
							name="validezreceta"
							label="Fecha"
							rules={[
								{
									required: true,
									message: 'Ingrese una fecha',
								},
							]}
						>
							<DatePicker
								disabled
								onChange={e => onChangeFecha(e)}
								placeholder="Ingrese la fecha"
								className="gx-mb-3 gx-w-100"
							/>
						</Form.Item>
					</Col>
					<Col lg={14} md={24} sm={24} xs={24}>
						<Form.Item
							name="indicacionesgen"
							label="Recomendaciones Generales"
							rules={[
								{
									required: true,
									message: 'Ingrese recomendaciones válidas',
								},
							]}
						>
							<Input.TextArea
								disabled={historiaClinica | visualizar}
								onChange={onChangeRecomendacion}
								rows={4}
							/>
						</Form.Item>
					</Col>
				</Row>

				{abrirModal ? (
					<ModalTratamiento
						abrirModal={abrirModal}
						setAbrirModal={setAbrirModal}
						dataTratamiento={dataTratamiento}
						handleDatos={handleDatos}
						datosModal={datosModal}
					/>
				) : null}

				{modalEditar ? (
					<ModalEditarTratamiento
						setDataActualizada={setDataActualizada}
						setDataEditar={setDataEditar}
						dataTratamiento={dataTratamiento}
						modalEditar={modalEditar}
						setModalEditar={setModalEditar}
						viaAdministracion={viaAdministracion}
						dataEditar={dataEditar}
					/>
				) : null}
			</Form>
		</>
	);
};
export default SeptimaParte;
