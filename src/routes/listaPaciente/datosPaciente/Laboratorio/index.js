import { Button, Col, Row, Form, Input, Table, Modal } from 'antd';
import React, { createRef, useEffect, useState } from 'react';
import ModalLaboratorio from './modalLaboratorio';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setLaboratorioAction } from '../../../../appRedux/actions/menu/laboratorio';

export const Laboratorio = ({ datosModal }) => {
	const dispatch = useDispatch();
	const formRef = createRef();

	const laboratorio = useSelector(state => state.laboratorio);
	const obsLaboratorio = laboratorio.recomendacion
	const dataLaboratorio = useSelector(state => state.combosReducer.dataLaboratorio);

	const [abrirModal, setAbrirModal] = useState(false);

	const dataLaboratorioSource = laboratorio.dataProcedimiento;
	const { historiaClinica , visualizar } = useSelector(state => state.helpers)


	const setDataLaboratorioSource = data => {
		dispatch(
			setLaboratorioAction({
				...laboratorio,
				dataProcedimiento: data,
			})
		);
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

	const columns = [
		{
			title: 'Descripción',
			dataIndex: 'DESC_PROD',
		},
		{
			title: 'Especialidad',
			dataIndex: 'NOM_LAB',
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
		if (obsLaboratorio) {
			formRef.current.setFieldsValue({ diagnostico: obsLaboratorio });
		}
		if (dataLaboratorioSource) {
			const borrar = dataLaboratorioSource.filter(
				(thing, index, self) => index === self.findIndex(t => t.COD_PROD === thing.COD_PROD)
			);
			setDataLaboratorioSource(borrar);
		}
	}, [obsLaboratorio]);

	/* useEffect(() => {
		if (dataSource.length > 0) {
			if (recomendaciones.recomendacion) {
				const data = {
					dataProcedimiento: dataSource,
					recomendacion: recomendaciones.recomendacion,
				};
				dispatch(setLaboratorioAction(data));
			}
		} else {
			//TODO: alerta o mensaje console.log('No hay');
		}
	}, [dataSource, recomendaciones, dispatch, obsLaboratorio]); */

	const onChangeRecomendacion = e => {
		dispatch(
			setLaboratorioAction({
				...laboratorio,
				recomendacion: e.target.value,
			})
		);
	};

	//datosEnviar.laboratorio['dataLaboratorio'] = dataSource;

	const buscarLab = () => setAbrirModal(true);

	const handleDatos = value => {
		setAbrirModal(false);
		if (value.estado) {
			setDataLaboratorioSource([...dataLaboratorio.filter(item => value.estado.includes(item.key))]);
		}
	};

	const quitarItem = e => {
		const filtredData = dataLaboratorioSource.filter(element => element.COD_PROD !== e.COD_PROD);
		setDataLaboratorioSource(filtredData);
	};

	useEffect(() => {
		if (dataLaboratorioSource?.length > 0) {
			dispatch(
				setLaboratorioAction({
					...laboratorio,
					dataProcedimiento: dataLaboratorioSource,
				})
			);
		} else {
			dispatch(
				setLaboratorioAction({
					...laboratorio,
					dataProcedimiento: dataLaboratorioSource,
				})
			);
		}
	}, [dataLaboratorioSource]);

	return (
		<Form ref={formRef} layout="vertical">
			<Row style={{ flexDirection: 'row', paddingTop: '20px' }}>
				<Col lg={24} md={24} sm={24} xs={24}>
					<Table className="gx-table-responsive" columns={columns} dataSource={dataLaboratorioSource} />
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
							Buscar en Laboratorio
						</Button>
					</Form.Item>
				</Col>
			</Row>
			<Row style={{ flexDirection: 'row', paddingTop: '20px' }}>
				<Col lg={24} md={24} sm={24} xs={24}>
					<Form.Item
						name="diagnostico"
						label="Recomendaciones Generales"
						rules={[
							{
								required: true,
								message: 'Ingrese recomendaciones válidas',
							},
						]}
					>
						<Input.TextArea disabled={historiaClinica | visualizar}
							onChange={onChangeRecomendacion} rows={4} />
					</Form.Item>
				</Col>
			</Row>
			{abrirModal ? (
				<ModalLaboratorio
					datosModal={datosModal}
					abrirModal={abrirModal}
					setAbrirModal={setAbrirModal}
					lab={dataLaboratorio}
					handleDatos={handleDatos}
					dataSource={dataLaboratorioSource}
				/>
			) : null}
		</Form>
	);
};
