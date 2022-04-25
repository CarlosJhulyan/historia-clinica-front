import React, { createRef, useState, useEffect } from 'react';
import { Button, Col, Form, Input, Row, Table, Modal } from 'antd';

import { httpClient } from '../../../util/Api';
import { useDispatch, useSelector } from 'react-redux';

import { setEvolucionTratamiento, setRegistrosEvolucion } from '../../../appRedux/actions/menu/evolucionTratamiento';
import { notificaciones, openNotification } from '../../../util/util';
import { traerEvolucionTratamiento } from './apis';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const EvolucionTratamiento = ({ datosModal }) => {
	const dataEvolucionTratamientoRedux = useSelector((state) => state.evolucionTratamiento);
	const registrosEvolucion = useSelector((state) => state.registrosEvolucion);
	const [btnLoading, setBtnLoading] = useState(true);
	const [dataLoading, setDataLoading] = useState(true);

	const { historiaClinica, visualizar } = useSelector(state => state.helpers);

	const [datos, setDatos] = useState({
		plan: '',
		descripcion: '',
	});

	const codMedico = JSON.parse(localStorage.getItem('token'));

	// referencia del formulario
	const formRef = createRef();
	const dispatch = useDispatch();

	const dataEvolucionTratamiento = () => {
		return dataEvolucionTratamientoRedux.map((e) => ({
			...e,
			key: e.id_datos_tratamiento,
		}));
	};

	function confirmAdd() {
		Modal.confirm({
			title: '¿Desea guardar todos los campos?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si, Guardar',
			cancelText: 'No, Cancelar',
			onOk: () => {
				notificaciones('', 'Promesa', {
					promesa: guardar,
					ok: 'Registro guardado correctamente',
					error: 'Alerta al guardar, Por favor vuelva a intentarlo',
					pendiente: 'Guardando Tratameinto',
				});
				// guardar();
			},
		});
	}

	function confirm(e) {
		Modal.confirm({
			title: '¿Desea eliminar este registro?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si, Eliminar Registro',
			cancelText: 'No, Cancelar',
			onOk: () => {
				notificaciones('', 'Promesa', {
					promesa: eliminar,
					ok: 'Registro eliminado correctamente',
					error: 'Alerta al eliminar, Por favor vuelva a intentarlo',
					pendiente: 'Eliminando Tratamiento',
					parametros: [e],
				});
			},
		});
	}

	const eliminar = async (record) => {
		const data = {
			id: record.id_datos_tratamiento,
		};
		const respuesta = await httpClient.post('/consulta/deleteEvolucionTratamiento', data);
		if (respuesta.data.success) {
			// openNotification('Operacion Exitosa', 'El registro se elimino correctamente', '');
			await traerEvolucionTratamiento({
				codGrupoCia: datosModal.estado.COD_GRUPO_CIA,
				codPaciente: datosModal.estado.COD_PACIENTE,
			});
		} else {
			throw 'Por favor vuelva a intentarlo';
			// openNotification('Fallo al eliminar', 'Por favor vuelva a intentarlo', 'Alerta');
		}
	};

	const columns = [
		{
			title: 'Fecha',
			dataIndex: 'fecha',
			width: 200,
		},
		{
			title: 'Plan del tratamiento',
			dataIndex: 'plan_tratamiento',
		},
		{
			title: 'Descripción del procedimiento',
			dataIndex: 'descripcion_tratamiento',
		},
		{
			title: 'Medico',
			dataIndex: 'nombre_medico',
		},
		{
			title: 'Especialidad',
			dataIndex: 'especialidad',
		},
		{
			title: '',
			key: 'borrar',
			width: 100,
			align: 'center',
			render: (text, record) => {
				let existe = false;

				registrosEvolucion.forEach((e) => {
					if (e === record.id_datos_tratamiento) {
						existe = true;
					}
				});

				if (existe) {
					return (
						<div style={{ display: 'flex', justifyContent: 'center' }}>
							<Button
								disabled={historiaClinica | visualizar}
								className="gx-btn-danger"
								style={{ margin: '0px', padding: '4px 10px 10px' }}
								onClick={() => {
									confirm(record);
								}}
							>
								<i className="icon icon-trash" />
							</Button>
						</div>
					);
				} else {
					return <div></div>;
				}
			},
		},
	];

	const handleTratamiento = (value) => {
		setDatos({ ...datos, plan: value.target.value });
		formRef.current.setFieldsValue({ plan: value.target.value });
	};

	const handleDescripcion = (value) => {
		setDatos({ ...datos, descripcion: value.target.value });
		formRef.current.setFieldsValue({ descripcion: value.target.value });
	};

	console.log("EVOL TRATAMIENTO:", datosModal.estado);

	const guardar = async () => {
		formRef.current.setFieldsValue({ plan: '', descripcion: '' });
		const data = {
			codGrupoCia: datosModal.estado.COD_GRUPO_CIA,
			codPaciente: datosModal.estado.COD_PACIENTE,
			nroAtencion: datosModal.estado.NUM_ATEN_MED, //revisarr123123
			codMedico: codMedico.cod_medico,
			plan: datos.plan,
			descripcion: datos.descripcion,
			nombreMedico: codMedico.des_ape_medico + ', ' + codMedico.des_nom_medico,
			especialidad: codMedico.des_especialidad,
		};

		setBtnLoading(true);
		const respuesta = await httpClient.post('/consulta/setEvolucionTratamiento', data);
		console.log('RESP:', respuesta);

		if (respuesta.data.success) {
			await traerEvolucionTratamiento({
				codGrupoCia: datosModal.estado.COD_GRUPO_CIA,
				codPaciente: datosModal.estado.COD_PACIENTE,
				nroAtencion: datosModal.estado.NUM_ATEN_MED,

			});
			setBtnLoading(false);
			// openNotification('Registro guardado correctamente', '', '');
			const arrayTemporal = [...registrosEvolucion];
			arrayTemporal.push(respuesta.data.data);
			console.log('array temporal', arrayTemporal);
			dispatch(setRegistrosEvolucion([...arrayTemporal]));
		} else {
			throw 'Por favor vuelva a intentarlo';
			// openNotification('Error al guardar', 'Por favor vuelva a intentarlo', 'Alerta');
		}
	};

	useEffect(() => {
		if (datos.plan !== '' && datos.descripcion !== '') {
			setBtnLoading(false);
		} else {
			setBtnLoading(true);
		}
	}, [datos]);

	useEffect(() => {
		if (dataEvolucionTratamientoRedux.length > 0) {
			setDataLoading(false);
		} else {
			setDataLoading(true);
		}
	}, [dataEvolucionTratamientoRedux.length]);
	return (
		<Form ref={formRef} layout="vertical">
			<Row style={{ flexDirection: 'row' }}>
				<Col xl={12} lg={24} md={24} sm={24} xs={24}>
					<h4 style={{ padding: '20px 0 5px 0px', textTransform: 'uppercase' }}>
						<b>Plan de tratamiento</b>
					</h4>
					<Form.Item
						name="plan"
						label="Plan de tratamiento"
						rules={[
							{
								required: true,
								message: 'Ingrese un plan válida',
							},
						]}
					>
						<Input.TextArea disabled={historiaClinica | visualizar} onChange={handleTratamiento} rows={4} />
					</Form.Item>
				</Col>
				<Col xl={12} lg={24} md={24} sm={24} xs={24}>
					<h4 style={{ padding: '20px 0 5px 0px', textTransform: 'uppercase' }}>
						<b>Evolución Tratamiento</b>
					</h4>
					<Form.Item
						name="descripcion"
						label="Descripcion del procedimiento"
						rules={[
							{
								required: true,
								message: 'Ingrese una descripcion válida',
							},
						]}
					>
						<Input.TextArea disabled={historiaClinica | visualizar} onChange={handleDescripcion} rows={4} />
					</Form.Item>
				</Col>
				<div
					style={{
						width: '100%',
						display: 'flex',
						justifyContent: 'flex-end',
						paddingRight: 15,
						paddingTop: 5,
						paddingBottom: 15,
					}}
				>
					<Button type="primary" disabled={btnLoading} onClick={confirmAdd}>
						Guardar registro
					</Button>
				</div>

				<Col lg={24} md={24} sm={24} xs={24}>
					<Table
						className="gx-table-responsive"
						dataSource={dataEvolucionTratamiento()}
						//loading={dataLoading}
						columns={columns}
					/>
				</Col>
			</Row>
		</Form>
	);
};
export default EvolucionTratamiento;
