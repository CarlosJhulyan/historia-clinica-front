import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import React, { createRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ModalTratamiento from './modalTratamiento';

export const ModalPrimeraParte = ({ abrirModal, setAbrirModal, data }) => {
	const formRef = createRef();

	const [modalTratamiento, setModalTratamiento] = useState(false);

	const [dataEditar, setDataEditar] = useState(data[0]);
	const [tipoVia, setTipoVia] = useState([]);

	// Combos
	const viaAdministracion = useSelector(state => state.combosReducer.viaAdministracion);
	const dataTratamiento = useSelector(state => state.combosReducer.dataTratamiento);

	useEffect(() => {
		if (dataEditar) {
			console.log('DATA EDITAR: ', dataEditar);
			formRef.current.setFieldsValue({
				codprod: dataEditar.codprod,
				descprod: dataEditar.descprod,
				via: dataEditar.viaadministracion,
				frecuencia: dataEditar.frecuencia,
				hora: dataEditar.HoraAdministrada,
				razon: dataEditar.razon,
			});
		}
	}, [dataEditar]);

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

	const handleDatos = value => {
		setModalTratamiento(false);
		dataTratamiento.map(element => {
			if (element.key == value.estado) {
				console.log('TRATAMIENTO SELECCIONADO:', element);
				handleChangeTratamiento(element);
			}
		});
	};

	const handleChangeTratamiento = value => {
		formRef.current.setFieldsValue({ producto: value.DESC_PROD });
		setDataEditar({
			...dataEditar,
			codprod: value.COD_PROD,
			descprod: value.DESC_PROD,
		});
	};

	const onChangeTipoVia = value => {
		const result = viaAdministracion.filter(via => via.CODIGO === value);
		const etiquetaVia = result[0].ETIQUETA;
		formRef.current.setFieldsValue({ via: value });
		setDataEditar({
			...dataEditar,
			etiquetaVia: etiquetaVia,
			viaadministracion: value,
		});
	};

	const onChangeProducto = value => {};

	const onChangeFrecuencia = value => {};

	const onChangeHora = value => {
		setDataEditar({
			...dataEditar,
			HoraAdministrada: value.target.value,
		});

		formRef.current.setFieldsValue({ hora: value.target.value });
	};

	const onChangeMotivo = e => {
		setDataEditar({ ...dataEditar, razon: e.target.value });
		formRef.current.setFieldsValue({ razon: e.target.value });
	};

	return (
		<>
			<Modal
				title="Solicitar la Modificación del Tratamiento"
				visible={abrirModal}
				onOk={() => setAbrirModal(false)}
				onCancel={() => setAbrirModal(false)}
				okText="Confirmar"
				cancelText="Cancelar"
			>
				<Form ref={formRef} layout="vertical">
					<Row style={{ flexDirection: 'row' }}>
						<Col lg={15} md={6} sm={8} xs={24}>
							<Form.Item name="descprod" label="Producto">
								<Input disabled onChange={e => onChangeProducto(e)} type="text" />
							</Form.Item>
						</Col>

						<Col lg={9} md={6} sm={8} xs={24}>
							<Form.Item style={{ marginTop: '25px' }}>
								<Button
									className="gx-mb-0"
									type="default"
									// htmlType="submit"
									onClick={() => setModalTratamiento(true)}
								>
									Buscar Producto
								</Button>
							</Form.Item>
						</Col>

						<Col lg={24} md={6} sm={8} xs={24}>
							<Form.Item name="via" label="Via Administración">
								<Select placeholder="Seleccione" onChange={e => onChangeTipoVia(e)}>
									{tipoVia}
								</Select>
							</Form.Item>
						</Col>

						<Col lg={12} md={6} sm={8} xs={24}>
							<Form.Item name="frecuencia" label="Frecuencia (x día)">
								<Input
									onChange={e => onChangeFrecuencia(e)}
									type="number"
									style={{ width: '100% ' }}
								/>
							</Form.Item>
						</Col>

						<Col lg={12} md={6} sm={8} xs={24}>
							<Form.Item name="hora" label="Hora Administrada">
								<Input onChange={e => onChangeHora(e)} type="time" />
							</Form.Item>
						</Col>

						<Col lg={24} md={6} sm={8} xs={24}>
							<Form.Item name="razon" label="Motivo">
								<Input.TextArea
									onChange={onChangeMotivo}
									placeholder="Ingrese el motivo"
									autosize={{ minRows: 2, maxRows: 6 }}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>

			{modalTratamiento && (
				<ModalTratamiento
					abrirModal={modalTratamiento}
					setAbrirModal={setModalTratamiento}
					dataTratamiento={dataTratamiento}
					handleDatos={handleDatos}
				/>
			)}
		</>
	);
};
