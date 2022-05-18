import React, { createRef, useEffect, useState } from 'react';
import { Col, Button, Form, Input, Modal, Row, Space, Spin, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { actualizarProcedimientos } from '../apis';

const ModalProcedimiento = ({
	abrirModal,
	setAbrirModal,
	handleDatos,
	procedimiento,
	dataSource,
	tipo,
	datosModal,
}) => {
	const dataGlobal = {
		codGrupoCia: datosModal.estado.COD_GRUPO_CIA,
		codLocal: datosModal.estado.COD_LOCAL_ANTECENDENTE,
	};

	const [estado, setEstado] = useState();
	const [medicamentos, setMedicamentos] = useState();
	const [botonModal, setBotonModal] = useState(true);
	const [btnActualizar, setBtnActualizar] = useState(false);

	const formRef = createRef();

	const rowSelection = {
		onChange: selectedRows => {
			setEstado(selectedRows);
		},
		selectedRowKeys: estado,
	};

	useEffect(() => {
		if (abrirModal) {
			if (dataSource?.length > 0) {
				const a = dataSource.map(data => data.key);
				setEstado(a);
			}
			if (procedimiento) {
				setMedicamentos(procedimiento);
				setBotonModal(false);
			}
		}
	}, [abrirModal, medicamentos, procedimiento]);

	const getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					placeholder={`Buscar`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button

						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Buscar
					</Button>
					<Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
						Reiniciar
					</Button>
				</Space>
			</div>
		),
		filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
		onFilter: (value, record) =>
			record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
	});

	const columns = [
		{
			title: 'DESCRIPCIÓN',
			dataIndex: 'DESC_PROD',
			key: 'descripcion',
			...getColumnSearchProps('DESC_PROD'),
		},
		{
			title: 'ESPECIALIDAD',
			dataIndex: 'NOM_LAB',
			key: 'NOM_LAB',
			...getColumnSearchProps('NOM_LAB'),
		},
	];
	const columns2 = [
		{
			title: 'DESCRIPCIÓN',
			dataIndex: 'DESC_PROD',
			key: 'descripcion',
			...getColumnSearchProps('DESC_PROD'),
		},
		{
			title: 'ESPECIALIDAD',
			dataIndex: 'NOM_LAB',
			key: 'NOM_LAB',
			...getColumnSearchProps('NOM_LAB'),
		},
	];

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
	};

	const handleReset = clearFilters => {
		clearFilters();
	};

	const onClickActualizarModal = async () => {
		setBtnActualizar(true);
		await actualizarProcedimientos(dataGlobal);
		setBtnActualizar(false);
	};

	const usuario = JSON.parse(sessionStorage.getItem('token'));

	return (
		<>
			<Modal
				width="50%"
				title={<div style={{ fontSize: '22px' }}>Procedimientos</div>}
				visible={abrirModal}
				okText="Agregar"
				cancelText="Cancelar"
				onOk={() => handleDatos({ estado })}
				okButtonProps={{
					disabled: botonModal,
				}}
				onCancel={() => setAbrirModal(false)}
			>
				{medicamentos === undefined ? (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<Spin tip="Cargando" />
					</div>
				) : (
					<Form ref={formRef} layout="vertical" initialValues={estado}>
						<Row style={{ flexDirection: 'row' }}>
							<Col lg={24} md={24} sm={24} xs={24}>
								<Table
									locale={{
										emptyText: (
											<div style={{ marginTop: 20, marginBottom: 20 }}>
												{usuario.des_especialidad === null ? 'El Medico no tiene especialidad' : 'No hay Datos'}
											</div>
										),
									}}
									loading={btnActualizar}
									className="gx-table-responsive"
									columns={tipo === 'INTERCONSULTA' ? columns2 : columns}
									dataSource={medicamentos}
									rowSelection={{ type: 'check', ...rowSelection }}
									size="small"
									pagination={{ pageSize: 25 }}
									scroll={{ y: 300 }}
								/>
							</Col>
							<Col
								lg={24}
								md={24}
								sm={24}
								xs={24}
								style={{ alignItems: 'flex-end', display: 'flex', justifyContent: 'flex-end' }}
							>
								{usuario.des_especialidad !== null ? (
									<Button type="primary" disabled={btnActualizar} onClick={() => onClickActualizarModal()}>
										Actualizar Procedimientos
									</Button>
								) : null}
							</Col>
						</Row>
					</Form>
				)}
			</Modal>
		</>
	);
};

export default ModalProcedimiento;
