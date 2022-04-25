import React, { createRef, useState, useEffect, useCallback } from 'react';
import { Col, Form, Row, Button, Modal, Select, Table, Spin } from 'antd';
import { httpClient } from '../../../../util/Api';

import { notification } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setAntecedentesPatologicos } from '../../../../appRedux/actions/menu/antecedentes';

const Patologicos = () => {

	const dispatch = useDispatch();

	const dataDiagnostico = useSelector((state) => state.combosReducer.dataDiagnostico);
	const { historiaAntecedentes, visualizar } = useSelector(state => state.helpers);

	const { Option } = Select;

	const [flag, setFlag] = useState(true);

	const [diagnostico, setDiagnostico] = useState([]);

	const [estadoCabecera, setEstadoCabecera] = useState([]);

	//REDUX
	const dataSource = useSelector((state) => state.antecedentesPatologicos);

	const setDataSource = (data) => {
		dispatch(setAntecedentesPatologicos(data));
	};

	const [estadoBtn, setEstadoBtn] = useState(true);

	const formRef = createRef();

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

	const quitarItem = (record) => {
		const filtredData = dataSource.filter((item) => item.cod_diagnostico !== record.cod_diagnostico);
		setDataSource(filtredData);
	}

	const columnsPatologia = [
		{
			title: 'CIE',
			dataIndex: 'cod_cie_10',
			width: 100,
		},
		{
			title: 'Descripción',
			dataIndex: 'des_diagnostico',
		},
		{
			title: '',
			key: 'borrar',
			width: 100,
			align: 'center',
			render: (e, record) => (
				<Button
					disabled={historiaAntecedentes | visualizar}
					className="gx-btn-danger"
					style={{ margin: '0px', padding: '4px 10px 0 10px' }}
					onClick={() => {
						confirm(record);
					}}
				>
					{' '}
					<i className="icon icon-trash" />
				</Button>
			),
		},
	];

	const handleChangeDiagnostico = (value) => {
		dataDiagnostico.map((element) => {
			if (element.COD_DIAGNOSTICO == value) {
				setDiagnostico({
					...diagnostico,
					cod: element.COD_DIAGNOSTICO,
					cie: element.COD_CIE_10,
					diagnostico: element.DES_DIAGNOSTICO,
				});
				setEstadoCabecera({
					...estadoCabecera,
					key: element.COD_DIAGNOSTICO,
					cod_diagnostico: element.COD_DIAGNOSTICO,
					cod_cie_10: element.COD_CIE_10,
					des_diagnostico: element.DES_DIAGNOSTICO,
				});

				formRef.current.setFieldsValue({ cie: element.COD_DIAGNOSTICO, diagnostico: element.COD_DIAGNOSTICO });
				setEstadoBtn(false);
			}
		});
	};

	const agregarDiagnostico = useCallback(async () => {
		let existe = false;

		if (dataSource.length > 0) {
			dataSource.forEach((element) => {
				if (element.cod_diagnostico === diagnostico.cod) {
					existe = true;
				}
			});
		}

		if (!existe) {
			setEstadoBtn(true);
			setDataSource([
				...dataSource,
				{
					...estadoCabecera,
				},
			]);

			formRef.current.setFieldsValue({ cie: '', diagnostico: '' });
			openNotification();
		} else {
			openNotificationExiste();
		}
	});

	const openNotificationExiste = () => {
		const key = `open${Date.now()}`;
		notification.open({
			duration: 2,
			style: { color: '#52c41a' },
			icon: <CheckCircleOutlined />,
			message: 'Patologico Existente',
			description: 'El diagnostico patologico ya existe',
			key,
		});
	};

	const openNotification = () => {
		const key = `open${Date.now()}`;
		notification.open({
			duration: 2,
			style: { color: '#52c41a' },
			icon: <CheckCircleOutlined />,
			message: 'Patologico guardado',
			description: 'Se han registrado los datos',
			key,
		});
	};

	return (
		<Form layout="vertical" ref={formRef}>
			<h4 style={{ padding: '20px 0 15px 25px', textTransform: 'uppercase' }}>
				<b>Patológicos</b>
			</h4>
			{flag ? (
				<Row style={{ flexDirection: 'row', paddingLeft: '30px', paddingRight: '30px' }}>
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
								disabled={historiaAntecedentes | visualizar}
								showSearch
								style={{ width: '100%' }}
								placeholder="Codigo"
								optionFilterProp="children"
								onChange={handleChangeDiagnostico}
								filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
							>
								{dataDiagnostico.map((element) => {
									return (
										<Option key={element.COD_DIAGNOSTICO} value={element.COD_DIAGNOSTICO}>
											{element.COD_CIE_10}
										</Option>
									);
								})}
							</Select>
						</Form.Item>
					</Col>
					<Col xl={18} lg={18} md={24} sm={24} xs={24}>
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
								disabled={historiaAntecedentes | visualizar}
								showSearch
								style={{ width: '100%' }}
								placeholder="Diagnostico"
								optionFilterProp="children"
								onChange={handleChangeDiagnostico}
								filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
							>
								{dataDiagnostico.map((element) => {
									return (
										<Option key={element.COD_DIAGNOSTICO} value={element.COD_DIAGNOSTICO}>
											{element.DES_DIAGNOSTICO}
										</Option>
									);
								})}
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

					<Col lg={24} md={24} sm={24} xs={24}>
						<Table
							className="gx-table-responsive"
							columns={columnsPatologia}
							dataSource={dataSource}
							pagination={{ pageSize: 5 }}
						/>
					</Col>
				</Row>
			) : (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Spin tip="Cargando" />
				</div>
			)}
		</Form>
	);
};

export default Patologicos;
