import React, { createRef, useState, useEffect, useCallback } from 'react';
import { Col, Form, Row, Input, Button, Modal, Select, Table, Spin, notification } from 'antd';
import { httpClient } from '../../../../util/Api';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import { setAntecedentesPatologicosFamiliares } from '../../../../appRedux/actions/menu/antecedentes';

const PatologicosFamiliares = () => {
	const { Option } = Select;
	const dispatch = useDispatch();

	const dataDiagnostico = useSelector((state) => state.combosReducer.dataDiagnostico);
	const { historiaAntecedentes, visualizar } = useSelector(state => state.helpers);


	const [flag, setFlag] = useState(true);

	const [diagnostico, setDiagnostico] = useState([]);

	const [estadoCabecera, setEstadoCabecera] = useState([]);

	//REDUX
	const dataSource = useSelector((state) => state.antecedentesPatologicosFamiliares);

	const setDataSource = (data) => {
		dispatch(setAntecedentesPatologicosFamiliares(data));
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

	const quitarItem = (e) => {
		const filtredData = dataSource.filter((item) => item.cod_diagnostico !== e.cod_diagnostico);
		setDataSource(filtredData);
	}

	const columnsPatologiaFam = [
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
			title: 'Parentesco',
			dataIndex: 'parentesco',
		},
		{
			title: '',
			key: 'borrar',
			width: 100,
			align: 'center',
			render: (e) => (
				<Button
					disabled={historiaAntecedentes | visualizar}
					className="gx-btn-danger"
					style={{ margin: '0px', padding: '4px 10px 0 10px' }}
					onClick={() => {

						confirm(e)
					}}
				>
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
					parentesco: diagnostico.parentesco,
				});

				formRef.current.setFieldsValue({ cie: element.COD_DIAGNOSTICO, diagnostico: element.COD_DIAGNOSTICO });
				setEstadoBtn(false);
			}
		});
	};

	console.log(diagnostico);

	const handleChangeParentesco = (value) => {
		setDiagnostico({ ...diagnostico, parentesco: value.target.value });
		setEstadoCabecera({
			...estadoCabecera,
			parentesco: diagnostico.parentesco,
		});
		formRef.current.setFieldsValue({ parentesco: value.target.value });
		setEstadoBtn(false);
	};

	useEffect(() => {
		if (diagnostico.cod && diagnostico.cie && diagnostico.parentesco) {
			setEstadoBtn(false);
		} else {
			setEstadoBtn(true);
		}
	}, [diagnostico.cod, diagnostico.cie, diagnostico.parentesco]);

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

			formRef.current.setFieldsValue({ cie: '', diagnostico: '', parentesco: '' });

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
			message: 'Patologico Familiar guardado',
			description: 'Se han registrado los datos',
			key,
		});
	};

	return (
		<Form layout="vertical" ref={formRef}>
			<h4 style={{ padding: '20px 0 15px 25px', textTransform: 'uppercase' }}>
				<b>Patológicos Familiares</b>
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
					<Col xl={6} lg={18} md={16} sm={24} xs={24}>
						<Form.Item
							name="parentesco"
							label="Parentesco"
							rules={[
								{
									required: false,
									message: 'Ingrese un parentesco válido',
								},
							]}
						>
							<Input disabled={historiaAntecedentes | visualizar}
								type="text" placeholder="Ingrese el parentesco" onChange={handleChangeParentesco} />
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
							columns={columnsPatologiaFam}
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

export default PatologicosFamiliares;
