import React, { createRef, useEffect, useState } from 'react';
import { Row, Col, Select, Modal, Form, Input } from 'antd';
import ModalTratamiento from './modalTratamiento';
import { useSelector } from 'react-redux';

const ModalEditarTratamiento = ({ modalEditar, setDataActualizada, dataTratamiento, setModalEditar, dataEditar }) => {

	//filtrar codigo del dataEditar con el codigo del dataTratamiento si el IND_CALCULO_TRAT_HC es igual a S entonces multiplicar el valor de frecuencia por duracion





	const formRef = createRef();

	const viaAdministracion = useSelector((state) => state.combosReducer.viaAdministracion);
	const [tipoVia, setTipoVia] = useState([]);

	const [abrirModal, setAbrirModal] = useState(false);
	const [estadoVia, setEstadoVia] = useState(false);

	const [data, setData] = useState(dataEditar);

	/* 
		useEffect(() => {
			if (dataEditar) {
				if (dataEditar.etiquetaVia === 'VIA ORAL' || dataEditar.etiquetaVia === 'VIA OPTICA') {
					setEstadoVia(true);
				} else {
					setEstadoVia(false);
				}
			}
		}, [dataEditar]); */

	useEffect(() => {
		if (viaAdministracion) {
			const opc = [];
			viaAdministracion.forEach((element) => {
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
		if (data.calculo === "S") {
			if (data.duracion && data.frecuencia) {
				setData({ ...data, cantidad: data.duracion * data.frecuencia });
				formRef.current.setFieldsValue({ cantidad: data.duracion * data.frecuencia });
			}
		}
	}, [data.duracion, data.frecuencia]);

	const handleDatos = (value) => {
		setAbrirModal(false);
		dataTratamiento.forEach((element) => {
			if (element.key == value.estado) {

				handleChangeTratamiento(element);
			}
		});
	};

	const handleChangeTratamiento = (e) => {
		formRef.current.setFieldsValue({ descprod: e.DESC_PROD });
		setData({
			...data,
			cod_prod: e.COD_PROD,
			descprod: e.DESC_PROD,
		});
	};

	const onChangeTipoVia = (value) => {
		/* setEstadoVia(false); */
		const result = viaAdministracion.filter((via) => via.CODIGO === value);
		const etiquetaVia = result[0].ETIQUETA;
		/* 
				if (etiquetaVia === 'VIA ORAL' || etiquetaVia === 'VIA OPTICA') {
					setEstadoVia(true);
				} else {
					setEstadoVia(false);
				}
		 */
		formRef.current.setFieldsValue({ via: value });
		setData({
			...data,
			viaadministracion: value,
			etiquetaVia: etiquetaVia,
		});
	};

	const onChangeDosis = (e) => {
		formRef.current.setFieldsValue({ dosis: e.target.value });
		setData({ ...data, dosis: e.target.value });
	};

	const onChangeFrecuencia = (value) => {
		formRef.current.setFieldsValue({ frecuencia: value.target.value });
		setData({ ...data, frecuencia: value.target.value });
	};

	const onChangeDuracion = (value) => {
		formRef.current.setFieldsValue({ duracion: value.target.value });
		setData({ ...data, duracion: value.target.value });
	};

	const onChangeCantidad = (e) => {
		formRef.current.setFieldsValue({ cantidad: e.target.value });
		setData({ ...data, cantidad: e.target.value });
	};

	const onChangeRecomendacionAplicar = (value) => {
		formRef.current.setFieldsValue({ recomendacionAplicar: value.target.value });
		setData({ ...data, recomendacionAplicar: value.target.value });
	};

	const guardarData = () => {
		let tratamiento;
		if (data) {
			if (data.frecuencia && data.duracion) {
				tratamiento = data.frecuencia + ' veces al dia x ' + data.duracion + ' Dias';
			} else {
				tratamiento = '';
			}
			setDataActualizada({
				...data,
				tratamiento: tratamiento,
			});
		}
		setModalEditar(false);
	};

	useEffect(() => {
		if (!data.calculo) {
			const filtro = dataTratamiento.filter(item => item.COD_PROD === dataEditar.codprod)[0].IND_CALCULO_TRAT_HC;
			data.calculo = filtro;

		}
		
	}, [data, dataEditar])

	return (
		<div>
			<Modal
				title={<div style={{ fontSize: '22px' }}>Editar Tratamiento</div>}
				visible={modalEditar}
				onOk={() => guardarData()}
				okText="Guardar"
				cancelText="Cancelar"
				onCancel={() => setModalEditar(false)}
			>
				<Form ref={formRef} layout="vertical" initialValues={dataEditar}>
					<Row style={{ flexDirection: 'row' }}>
						<Col lg={24} md={15} sm={15} xs={24}>
							<Form.Item name="descprod" label="Tratamiento">
								<Input onChange={handleChangeTratamiento} disabled />
							</Form.Item>
						</Col>
						<Col lg={10} md={6} sm={8} xs={24}>
							<Form.Item name="etiquetaVia" label="Via Administración">
								<Select placeholder="Seleccione" onChange={(e) => onChangeTipoVia(e)}>
									{tipoVia}
								</Select>
							</Form.Item>
						</Col>

						<Col lg={14} md={6} sm={8} xs={24}>
							<Form.Item name="dosis" label="Dosis">
								<Input onChange={(e) => onChangeDosis(e)} type="text" />
							</Form.Item>
						</Col>

						<Col lg={8} md={6} sm={8} xs={24}>
							<Form.Item name="frecuencia" label="Frecuencia (x día)">
								<Input
									//disabled={estadoVia}
									onChange={(e) => onChangeFrecuencia(e)}
									type="number"
									style={{ width: '100% ' }}
								/>
							</Form.Item>
						</Col>

						<Col lg={8} md={6} sm={8} xs={24}>
							<Form.Item name="duracion" label="Duración (días)">
								<Input
									//disabled={estadoVia}
									onChange={(e) => onChangeDuracion(e)}
									type="number"
								/>
							</Form.Item>
						</Col>

						<Col lg={8} md={6} sm={8} xs={24}>
							<Form.Item name="cantidad" label="Cantidad">
								<Input onChange={(e) => onChangeCantidad(e)} type="number" />
							</Form.Item>
						</Col>

						<Col lg={24} md={6} sm={8} xs={24}>
							<Form.Item name="recomendacionAplicar" label="Recomendación a Aplicar">
								<Input.TextArea
									//disabled={estadoVia}
									onChange={(e) => onChangeRecomendacionAplicar(e)}
									type="text"
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
			{abrirModal ? (
				<ModalTratamiento
					abrirModal={abrirModal}
					setAbrirModal={setAbrirModal}
					dataTratamiento={dataTratamiento}
					handleDatos={handleDatos}
				/>
			) : null}
		</div>
	);
};

export default ModalEditarTratamiento;
