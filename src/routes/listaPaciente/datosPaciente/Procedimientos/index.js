import { Button, Col, Row, Form, Input, Table, Modal } from 'antd';
import React, { createRef, useEffect, useState } from 'react';
import ModalProcedimiento from './modalProcedimiento';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setConsultasProcedimientos } from '../../../../appRedux/actions/menu/procedimiento';

export const Procedemientos = ({ datosModal }) => {
	const dispatch = useDispatch();
	const formRef = createRef();
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const procedimientoReducer = useSelector(state => state.procedimientoReducer);
	const obsProcedimiento = procedimientoReducer.recomendacion;
	const proc = useSelector(state => state.combosReducer.dataProcedimiento);
	console.log("PROOOOOOOOOOOOOOOOOOOOOOO", proc);
	const { historiaClinica , visualizar } = useSelector(state => state.helpers)


	const [abrirModal, setAbrirModal] = useState(false);
	const dataProcedimiento = procedimientoReducer.dataProcedimiento;

	const setDataProcedimiento = data => {
		dispatch(
			setConsultasProcedimientos({
				...procedimientoReducer,
				dataProcedimiento: data,
			})
		);
	};

	const especialidad = JSON.parse(localStorage.getItem('token'));
	//Agregar vcalidacion colum : tip_proceso = P
	const procedimiento = proc?.filter(procedimiento => procedimiento.TIP_PROCESO === 'P');
	console.log("PROCEDIMIENTO FILTRADO: ", procedimiento)


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
		if (dataProcedimiento) {
			const borrar = dataProcedimiento.filter(
				(thing, index, self) => index === self.findIndex(t => t.COD_PROD === thing.COD_PROD)
			);
			setDataProcedimiento(borrar);
		}
	}, [obsProcedimiento]);

	const onChangeRecomendacion = e => {
		dispatch(
			setConsultasProcedimientos({
				...procedimientoReducer,
				recomendacion: e.target.value,
			})
		);
	};

	const buscarLab = () => setAbrirModal(true);

	const handleDatos = value => {
		setAbrirModal(false);
		if (value.estado) {
			setDataProcedimiento([...procedimiento.filter(item => value.estado.includes(item.key))]);
		}
	};

	const quitarItem = e => {
		const filtredData = dataProcedimiento.filter(element => element.COD_PROD !== e.COD_PROD);
		setDataProcedimiento(filtredData);
	};

	// useEffect(() => {
	// 	dispatch(
	// 		setConsultasProcedimientos({
	// 			...procedimientoReducer,
	// 			dataProcedimiento: dataProcedimiento,
	// 		})
	// 	);
	// }, [dataProcedimiento]);

	console.log('Data Procedimiento DAVIDDDDD', dataProcedimiento);

	return (
		<Form ref={formRef} layout="vertical">
			<Row style={{ flexDirection: 'row', paddingTop: '20px' }}>
				<Col lg={24} md={24} sm={24} xs={24}>
					<Table className="gx-table-responsive" columns={columns} dataSource={dataProcedimiento} />
				</Col>
			</Row>
			<Row style={{ display: 'flex', flexDirection: 'row-reverse', paddingTop: '20px' }}>
				<Col lg={6} md={6} sm={6} xs={24}>
					<Form.Item>
						<Button
							disabled={historiaClinica | visualizar}
							className="gx-mb-0"
							style={{
                width: '100%',
                background: themeSettingsGlobal.COD_COLOR_1,
                color: '#fff'
              }}
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
					dataSource={dataProcedimiento}
				/>
			) : null}
		</Form>
	);
};
