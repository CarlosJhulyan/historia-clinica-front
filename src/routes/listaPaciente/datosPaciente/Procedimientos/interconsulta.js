import { Button, Col, Row, Form, Input, Table, Modal } from 'antd';
import React, { createRef, useEffect, useState } from 'react';
import { datosEnviar } from '../../../../constants/datosEnviar';
import ModalProcedimiento from './modalProcedimiento';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setInterconsultasProcedimiento } from '../../../../appRedux/actions/menu/procedimiento';
import { httpClient } from '../../../../util/Api';

export const Interconsultas = ({ datosModal }) => {
	const dispatch = useDispatch();
	const formRef = createRef();

	const procedimientoReducer = useSelector(state => state.procedimientoInterconsulta);
	const obsProcedimiento = procedimientoReducer.recomendacion;
	const proc = useSelector(state => state.combosReducer.dataProcedimiento);

	const [abrirModal, setAbrirModal] = useState(false);
	const dataProcedimientoInterconsulta = procedimientoReducer.dataProcedimiento;
	const { historiaClinica , visualizar } = useSelector(state => state.helpers)

	const setDataProcedimientoInterconsulta = data => {
		dispatch(
			setInterconsultasProcedimiento({
				...procedimientoReducer,
				dataProcedimiento: data,
			})
		);
	};

	const especialidad = JSON.parse(sessionStorage.getItem('token'));
	const procedimiento = proc.filter(procedimiento => procedimiento.NOM_LAB !== especialidad.des_especialidad && procedimiento.TIP_PROCESO === 'C');
	console.log("INTERCONSULTA FILTRADO : ", procedimiento)

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

	const columns = [
		{
			title: 'Descripción',
			dataIndex: 'DESC_PROD',
			key: 'descripcion',
		},
		{
			title: 'Especialidad',
			dataIndex: 'NOM_LAB',
			key: 'especialidad',
			width: '30%',
		},
		{
			title: '',
			key: 'borrar',
			width: 100,
			align: 'center',
			render: e => (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button
						disabled={historiaClinica | visualizar}
						className="gx-btn-danger"
						style={{ margin: '0px', padding: '4px 10px 10px' }}
						onClick={() => {
							confirm(e);
						}}
					>
						<i className="icon icon-trash" />
					</Button>
				</div>
			),
		},
	];

	useEffect(() => {
		if (obsProcedimiento) {
			formRef.current.setFieldsValue({ descripcion: obsProcedimiento });
		}
		if (dataProcedimientoInterconsulta) {
			const borrar = dataProcedimientoInterconsulta.filter(
				(thing, index, self) => index === self.findIndex(t => t.COD_PROD === thing.COD_PROD)
			);
			setDataProcedimientoInterconsulta(borrar);
		}
	}, [obsProcedimiento]);

	const onChangeRecomendacion = e => {
		dispatch(
			setInterconsultasProcedimiento({
				...procedimientoReducer,
				recomendacion: e.target.value,
			})
		);
	};

	const buscarLab = () => setAbrirModal(true);

	const handleDatos = value => {
		setAbrirModal(false);
		if (value.estado) {
			setDataProcedimientoInterconsulta([...procedimiento.filter(item => value.estado.includes(item.key))]);
		}
	};

	const quitarItem = e => {
		const filtredData = dataProcedimientoInterconsulta.filter(element => element.COD_PROD !== e.COD_PROD);
		setDataProcedimientoInterconsulta(filtredData);
	};

	/* const guardar = async () => {
		const dato = {
			codGrupoCia: datosModal.datosModal.estado.COD_GRUPO_CIA,
			codPaciente: datosModal.datosModal.estado.COD_PACIENTE,
			interconsultas: dataProcedimientoInterconsulta,
		};

		console.log(dataProcedimientoInterconsulta);

		const respuesta = await httpClient.post('/pacientes/setInterconsultas', dato);

		console.log('respuesta', respuesta);

		console.log('guardar');
	}; */

	return (
		<Form ref={formRef} layout="vertical">
			<Row style={{ flexDirection: 'row', paddingTop: '20px' }}>
				<Col lg={24} md={24} sm={24} xs={24}>
					<Table className="gx-table-responsive" columns={columns} dataSource={dataProcedimientoInterconsulta} />
				</Col>
			</Row>
			<Row style={{ display: 'flex', flexDirection: 'row-reverse', paddingTop: '20px' }}>
				<Col lg={6} md={6} sm={6} xs={24}>
					<Form.Item>
						<Button
							disabled={historiaClinica | visualizar}
							className="gx-mb-0"
							type="primary"
							style={{ width: '100% ' }}
							onClick={() => buscarLab()}
							icon={<SearchOutlined />}
						>
							Buscar Procedimientos
						</Button>
					</Form.Item>
				</Col>
			</Row>
			<Row style={{ flexDirection: 'row', paddingTop: '20px' }}>
				<Col lg={24} md={24} sm={24} xs={24}>
					<Form.Item
						name="descripcion"
						label="Recomendaciones Generales"
						rules={[
							{
								required: true,
								message: 'Ingrese recomendaciones válidas',
							},
						]}
					>
						<Input.TextArea disabled={historiaClinica | visualizar} onChange={onChangeRecomendacion} rows={4} />
					</Form.Item>
				</Col>
			</Row>
			{abrirModal ? (
				<ModalProcedimiento
					datosModal={datosModal}
					abrirModal={abrirModal}
					setAbrirModal={setAbrirModal}
					procedimiento={procedimiento}
					handleDatos={handleDatos}
					dataSource={dataProcedimientoInterconsulta}
					tipo="INTERCONSULTA"
				/>
			) : null}
			{/* <Button onClick={guardar}>Guardar</Button> */}
		</Form>
	);
};
