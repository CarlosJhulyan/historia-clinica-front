import { Button, Col, Form, Input, Modal, Row, Select, Table } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { httpClient } from '../../../../util/Api';
import { notificaciones, openNotification } from '../../../../util/util';

function ModalListaMedicos({ visible, setVisible, setMedicoCurrent }) {
	const [data, setData] = useState([]);
	const [dataFiltered, setDataFiltered] = useState([]);
	const [loadingData, setLoadingData] = useState(false);
	const [cmpCurrent, setCmpCurrent] = useState('');
	const [nombreCmp, setNombreCmp] = useState('');
	const [filaActual, setFilaActual] = useState({});
	const [visibleModalUpsertMedico, setVisibleModalUpsertMedico] = useState(false);
	const [editarMedico, setEditarMedico] = useState(false);

	const columns = [
		{
			title: 'CMP',
			dataIndex: 'CMP',
			key: 'CMP',
		},
		{
			title: 'Nombre Completo',
			dataIndex: 'NOMBRE_COMPLETO',
			key: 'NOMBRE_COMPLETO',
			width: '400px',
		},
		{
			title: 'Referencia',
			dataIndex: 'DESC_REFERENCIA',
			key: 'DESC_REFERENCIA',
		},
	];

	const traerDataMedicos = useCallback(() => {
		setLoadingData(true);
		httpClient.get('posventa/getMedicosPosVenta').then(response => {
			if (response.data.success) setData(response.data.data);
			setLoadingData(false);
		});
	}, []);

	const handleFilter = () => {
		setDataFiltered(
			data.filter(
				item =>
					item.NOMBRE_COMPLETO.toUpperCase().includes(nombreCmp.toUpperCase()) ||
					item.CMP === nombreCmp
			)
		);
	};

	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			setCmpCurrent(selectedRows[0].CMP);
			setFilaActual(selectedRows[0]);
		},
	};

	const handleAcepted = () => {
		openNotification('Correcto', 'Médico agregado correctamente');
		setMedicoCurrent(filaActual);
		setVisible(false);
	};

	useEffect(() => {
		traerDataMedicos();
	}, []);

	useEffect(() => {
		setDataFiltered(data);
	}, [data]);

	return (
		<>
			<Modal
				centered
				width={900}
				visible={visible}
				title="Lista de Médicos"
				className="modal-custom"
				onCancel={() => setVisible(false)}
				footer={[
					// <Button
					// 	onClick={() => {
					// 		setVisibleModalUpsertMedico(true);
					// 		setEditarMedico(false);
					// 	}}
					// >
					// 	Crear
					// </Button>,
					// <Button
					// 	onClick={() => {
					// 		setVisibleModalUpsertMedico(true);
					// 		setEditarMedico(true);
					// 	}}
					// 	disabled={!cmpCurrent}
					// >
					// 	Modificar
					// </Button>,
					<Button disabled={!cmpCurrent} onClick={handleAcepted}>
						Seleccionar
					</Button>,
					<Button onClick={() => setVisible(false)}>Cerrar</Button>,
				]}
			>
				<Row>
					<Col span={14}>
						<Form.Item label="Nombre ó CMP" style={{ margin: 0, padding: 5 }}>
							<Input
								onChange={e => setNombreCmp(e.target.value)}
								style={{ width: 380 }}
								value={nombreCmp}
								disabled={loadingData}
							/>
						</Form.Item>
					</Col>
					<Col span={4}>
						<Button
							disabled={loadingData}
							style={{ marginTop: 5, background: '#0169aa', color: '#fff' }}
							onClick={handleFilter}
						>
							Filtrar
						</Button>
					</Col>
				</Row>
				<Table
					style={{ marginRight: 10, marginLeft: 10 }}
					rowSelection={{
						type: 'radio',
						...rowSelection,
					}}
					className="gx-table-responsive"
					columns={columns}
					size="small"
					loading={loadingData}
					dataSource={dataFiltered}
				/>
			</Modal>

			{visibleModalUpsertMedico ? (
				<ModalMantenimientoMedico
					visible={visibleModalUpsertMedico}
					setVisible={setVisibleModalUpsertMedico}
					traerDataMedicos={traerDataMedicos}
					filaActual={filaActual}
					editarMedico={editarMedico}
				/>
			) : null}
			<ToastContainer pauseOnHover={false} />
		</>
	);
}

function ModalMantenimientoMedico({
	visible,
	setVisible,
	traerDataMedicos,
	filaActual,
	editarMedico,
}) {
	const [dataList, setDataList] = useState([]);
	const [refForm] = Form.useForm();

	const traerListaReferencia = () => {
		httpClient
			.get('posventa/getListaReferencias')
			.then(response => {
				if (response.data.success) setDataList(response.data.data);
			})
			.catch(e => console.error(e));
	};

	useEffect(() => {
		traerListaReferencia();
		console.log(filaActual);
		if (editarMedico) {
			refForm.setFieldsValue({
				cmp: filaActual.CMP,
				nombre: filaActual.NOMBRE,
				apellidoP: filaActual.APE_PAT,
				apellidoM: filaActual.APE_MAT,
				referencia: filaActual.DESC_REFERENCIA,
			});
		} else {
			refForm.setFieldsValue({ referencia: '', nombre: '', apellidoP: '', cmp: '', apellidoM: '' });
		}
	}, []);

	const guardar = async () => {
		const { cmp, apellidoP, apellidoM, referencia, nombre } = refForm.getFieldsValue();
		if (
			cmp === '' ||
			cmp.length !== 5 ||
			apellidoP === '' ||
			apellidoM === '' ||
			referencia === '' ||
			nombre === ''
		) {
			console.log({ cmp, apellidoP, apellidoM, referencia, nombre });
			console.log('error');
			notificaciones('Debe completar todos los campos', 'Alerta');
		} else {
			const funGuardar = async () => {
				await httpClient.post('/posventa/grabarMedico', {
					cmp: parseInt(cmp),
					nombre,
					apellidoP,
					apellidoM,
					referenciaId: dataList.find(item => item.value === referencia).key,
					referencia,
					pCodVisitador: '',
					pNombreVisitador: '',
				});
				setVisible(false);
				traerDataMedicos();
				refForm.setFieldsValue({
					referencia: '',
					nombre: '',
					apellidoP: '',
					cmp: '',
					apellidoM: '',
				});
			};
			console.log('guardar');
			notificaciones('', 'Promesa', {
				pendiente: 'Guardando...',
				ok: 'Guardado correctamente',
				error: 'Error al guardar',
				promesa: funGuardar,
			});
		}
	};

	return (
		<Modal
			centered
			width={500}
			visible={visible}
			title="Mantenimiento Médico"
			onCancel={() => setVisible(false)}
			footer={[
				<Button onClick={() => setVisible(false)}>Cerrar</Button>,
				<Button style={{ background: '#0169aa', color: '#fff' }} onClick={guardar}>
					Grabar
				</Button>,
			]}
		>
			<Form form={refForm} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
				<Form.Item
					name="cmp"
					label="CMP"
					style={{ margin: 0 }}
					rules={[{ required: true, max: 5 }]}
				>
					<Input size="small" type="number" />
				</Form.Item>
				<Form.Item name="nombre" label="Nombre" style={{ margin: 0 }} rules={[{ required: true }]}>
					<Input size="small" />
				</Form.Item>
				<Form.Item
					name="apellidoP"
					label="Apellido Pat."
					style={{ margin: 0 }}
					rules={[{ required: true }]}
				>
					<Input size="small" />
				</Form.Item>
				<Form.Item
					name="apellidoM"
					label="Apellido Mat."
					style={{ margin: 0 }}
					rules={[{ required: true }]}
				>
					<Input size="small" />
				</Form.Item>
				<Form.Item
					name="referencia"
					label="Referencia"
					style={{ margin: 0 }}
					rules={[{ required: true }]}
				>
					<Select size="small" placeholder="Seleccionar Referencia">
						{/* <Select.Option value="">Seleccionar Referencia</Select.Option> */}
						{dataList.map(item => {
							return (
								<Select.Option value={item.value} key={item.key}>
									{item.DESCRIPCION}
								</Select.Option>
							);
						})}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
}

export default ModalListaMedicos;