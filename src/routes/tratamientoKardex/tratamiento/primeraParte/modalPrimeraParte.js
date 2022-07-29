import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import confirm from 'antd/lib/modal/confirm';
import React, { createRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { httpClient } from '../../../../util/Api';
import { notificaciones } from '../../../../util/util';
import ModalTratamiento from './modalTratamiento';

export const ModalPrimeraParte = ({ abrirModal, setAbrirModal, data, TraerDatos, historia }) => {
	const formRef = createRef();
	const token = JSON.parse(localStorage.getItem('token'));
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const [modalTratamiento, setModalTratamiento] = useState(false);

	const [dataEditar, setDataEditar] = useState(data);
	const [tipoVia, setTipoVia] = useState([]);

	// Combos
	const viaAdministracion = useSelector(state => state.combosReducer.viaAdministracion);
	const dataTratamiento = useSelector(state => state.combosReducer.dataTratamiento);

	useEffect(() => {
		if (dataEditar) {
			console.log('DATA EDITAR: ', dataEditar);
			formRef.current.setFieldsValue({
				codprod: dataEditar.codprod || dataEditar.codigo_producto,
				descprod: dataEditar.descprod || dataEditar.producto,
				via: dataEditar.viaadministracion || dataEditar.via_administracion,
				dosis: dataEditar.dosis,
				frecuencia: dataEditar.frecuencia,
				duracion: dataEditar.duracion,
				cantidad: dataEditar.cantidad,
				hora: dataEditar.HoraAdministrada,
				razon: dataEditar.razon,
			});
		}
	}, [dataEditar]);

	useEffect(() => {
		if (dataEditar.duracion && dataEditar.frecuencia) {
			setDataEditar({ ...dataEditar, cantidad: dataEditar.duracion * dataEditar.frecuencia });
			formRef.current.setFieldsValue({ cantidad: dataEditar.duracion * dataEditar.frecuencia });
		}
	}, [dataEditar.duracion, dataEditar.frecuencia]);

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

	const onChangeDosis = e => {
		formRef.current.setFieldsValue({ dosis: e.target.value });
		setDataEditar({ ...dataEditar, dosis: e.target.value });
	};

	const onChangeDuracion = value => {
		formRef.current.setFieldsValue({ duracion: value.target.value });
		setDataEditar({ ...dataEditar, duracion: value.target.value });
	};

	const onChangeCantidad = e => {
		formRef.current.setFieldsValue({ cantidad: e.target.value });
		setDataEditar({ ...dataEditar, cantidad: e.target.value });
	};

	const onChangeFrecuencia = e => {
		formRef.current.setFieldsValue({ frecuencia: e.target.value });
		setDataEditar({ ...dataEditar, frecuencia: e.target.value });
	};

	const onChangeMotivo = e => {
		setDataEditar({ ...dataEditar, razon: e.target.value });
		formRef.current.setFieldsValue({ razon: e.target.value });
	};

	const GuardarModificacion = async () => {
		var validator = true;
		console.log('data', data);
		console.log('dataEditar', dataEditar);
		const arreglo = [];
		arreglo.push({
			codProducto: data.codprod || data.codigo_producto,
			producto: data.descprod || data.producto,
			viaAdministracion: data.viaadministracion || data.via_administracion,
			etiquetaVia: data.etiquetaVia || data.etiqueta_via,
			dosis: data.dosis,
			cantidad: data.cantidad,
			duracion: data.duracion,
			frecuencia: data.frecuencia,
			estado: '1',
			horario: data.horarios,
		});
		arreglo.push({
			codProducto: dataEditar.codprod || dataEditar.codigo_producto,
			producto: dataEditar.descprod || dataEditar.producto,
			viaAdministracion: dataEditar.viaadministracion || dataEditar.via_administracion,
			etiquetaVia: dataEditar.etiquetaVia || dataEditar.etiqueta_via,
			dosis: dataEditar.dosis,
			cantidad: dataEditar.cantidad,
			duracion: dataEditar.duracion,
			frecuencia: dataEditar.frecuencia,
			estado: '2',
			horario: [],
		});
		const body = {
			codMedico: token.cod_medico,
			nomMedico: token.des_nom_medico + ' ' + token.des_ape_medico,
			codPaciente: historia.codPaciente,
			nomPaciente: historia.nombrePaciente,
			hc: historia.hc,
			tratamiento: arreglo,
			accion: 'Cambio de tratamiento',
		};
		if (validator) {
			var response = {};
			// if (editar) {
			// 	body.id = editar;
			// response = await httpClient.post('kardex/updateKardex', body);
			// } else {
			response = await httpClient.post('kardex/setKardexTratamiento', body);
			// }
			if (response.data.success) {
				notificaciones('Completado!');
				TraerDatos();
				setAbrirModal(false);
			} else {
				notificaciones(response.message, 'Alerta');
			}
		} else {
			notificaciones('Debe llenar todos los campos', 'Alerta');
			console.error('Completar datos');
		}
	};

	function showConfirm() {
		confirm({
			title: '¿Está seguro de solicitar la modificación?',
			icon: <ExclamationCircleOutlined />,
			content: 'El médico encargado tendrá que aceptar el tratamiento',
			cancelText: 'Cancelar',
			okText: 'Solicitar modificación',
			onOk() {
				GuardarModificacion();
			},
			onCancel() {
				// setAbrir(false);
			},
		});
	}

	return (
		<>
			<Modal
				title="Solicitar la Modificación del Tratamiento"
				visible={abrirModal}
				onOk={showConfirm}
				onCancel={() => setAbrirModal(false)}
				okText="Confirmar"
				cancelText="Cancelar"
        okType='default'
        okButtonProps={{
          style: {background:themeSettingsGlobal.COD_COLOR_1, color: '#fff', border:'none'}
        }}
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

						<Col lg={10} md={6} sm={8} xs={24}>
							<Form.Item name="via" label="Via Administración">
								<Select placeholder="Seleccione" onChange={e => onChangeTipoVia(e)}>
									{tipoVia}
								</Select>
							</Form.Item>
						</Col>

						<Col lg={14} md={6} sm={8} xs={24}>
							<Form.Item name="dosis" label="Dosis">
								<Input onChange={e => onChangeDosis(e)} type="text" />
							</Form.Item>
						</Col>

						<Col lg={8} md={6} sm={8} xs={24}>
							<Form.Item name="frecuencia" label="Frecuencia (x día)">
								<Input
									//disabled={estadoVia}
									onChange={e => onChangeFrecuencia(e)}
									type="number"
									style={{ width: '100% ' }}
								/>
							</Form.Item>
						</Col>

						<Col lg={8} md={6} sm={8} xs={24}>
							<Form.Item name="duracion" label="Duración (días)">
								<Input
									//disabled={estadoVia}
									onChange={e => onChangeDuracion(e)}
									type="number"
								/>
							</Form.Item>
						</Col>

						<Col lg={8} md={6} sm={8} xs={24}>
							<Form.Item name="cantidad" label="Cantidad">
								<Input onChange={e => onChangeCantidad(e)} type="number" />
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
