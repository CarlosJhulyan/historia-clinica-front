import React, { useState, createRef, useMemo } from 'react';
import { Button, Card, AutoComplete, Form, Input, Space, Table } from 'antd';
import { ToastContainer } from 'react-toastify';
import { httpClient } from '../../util/Api';
import Moment from 'moment';
import axios from 'axios';
import { SearchOutlined } from '@ant-design/icons';
import { ModalBalanceHidrico } from './modalBalance';

const HistorialBalanceHidrico = () => {
	const [state, setState] = useState();

	const [valueCOD, setValueCOD] = useState('');
	const [optionsCOD, setOptionsCOD] = useState([]);
	const [valueNOM, setValueNOM] = useState('');
	const [optionsNOM, setOptionsNOM] = useState([]);

	const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());
	const [peticion, setPeticion] = useState(false);

	const [loading, setLoading] = useState(false);

	const formSearch = useMemo(() => createRef(), []);

	const onSearchCOD = async searchText => {
		var cod = formSearch.current.getFieldValue('codPaciente');
		if (cod ? cod.length >= 4 : false) {
			setPeticion(true);
			setOptionsCOD();
			const respuesta = await httpClient.post(
				'camas/getPacientes',
				{
					codPaciente: cod,
					nombre: '',
				},
				{ cancelToken: cancelSource.token }
			);
			var array1 = respuesta.data.data;
			for (let i = 0; i < array1.length; i++) {
				if (array1[i].asignado === '0') {
					delete array1[i];
				} else {
					array1[i].key = array1[i].cod_paciente;
					array1[i].value = array1[i].cod_paciente;
					array1[i].label = (
						<div>
							{array1[i].historia_clinica}
							<div style={{ color: '#a3a3a3' }}>
								{' ' + array1[i].ape_pat_cli + ' ' + array1[i].ape_mat_cli}
							</div>
						</div>
					);
				}
			}
			setOptionsNOM();
			setOptionsCOD(array1);
		} else {
			if (peticion) {
				cancelSource.cancel('COD Cancelado');
				setCancelSource(axios.CancelToken.source());
			}
		}
	};

	const onSearchNOM = async searchText => {
		var nombre = formSearch.current.getFieldValue('nombrePaciente');
		if (nombre ? nombre.length >= 4 : false) {
			setPeticion(true);
			setOptionsNOM();
			const respuesta = await httpClient.post(
				'camas/getPacientes',
				{
					codPaciente: '',
					nombre: nombre,
				},
				{ cancelToken: cancelSource.token }
			);
			var array2 = respuesta.data.data;
			console.log(respuesta.data.data);
			for (let i = 0; i < array2.length; i++) {
				if (array2[i].asignado === '0') {
					delete array2[i];
				} else {
					array2[i].key = array2[i].cod_paciente;
					array2[i].value = array2[i].cod_paciente;
					array2[i].label = (
						<div>
							{array2[i].nom_cli}
							<div style={{ color: '#a3a3a3' }}>
								{' ' + array2[i].ape_pat_cli + ' ' + array2[i].ape_mat_cli}
							</div>
						</div>
					);
				}
			}
			setOptionsCOD();
			setOptionsNOM(array2);
		} else {
			if (peticion) {
				cancelSource.cancel('NOM ancelado');
				setCancelSource(axios.CancelToken.source());
			}
		}
	};

	const onSelectCOD = data => {
		optionsCOD.forEach(element => {
			if (element.key === data) {
				formSearch.current.setFieldsValue({
					codPaciente: element.historia_clinica,
					nombrePaciente: `${
						element.nom_cli + ' ' + element.ape_pat_cli + ' ' + element.ape_mat_cli
					}`,
				});
				setValueCOD(data);
			}
		});
	};

	const onSelectNOM = data => {
		optionsNOM.forEach(element => {
			if (element.key === data) {
				formSearch.current.setFieldsValue({
					codPaciente: element.historia_clinica,
					nombrePaciente: `${
						element.nom_cli + ' ' + element.ape_pat_cli + ' ' + element.ape_mat_cli
					}`,
				});
				setValueNOM(data);
			}
		});
	};

	const onChangeCOD = data => {
		if (data.length <= 3) {
			setOptionsCOD([]);
		}
	};

	const onChangeNOM = data => {
		if (data.length <= 3) {
			setOptionsNOM([]);
		}
	};

	//LUEKR
	const [dataTable, setDataTable] = useState([]);
	const [mostrarDetalles, setMostrarDetalles] = useState(false);
	const [dataSeleccionada, setDataSeleccionada] = useState({});

	const BuscarBalance = () => {
		setLoading(true);
		const historia_clinica = optionsCOD[0].historia_clinica;
		httpClient
			.post('/balance/getHistoryBalanceHidrico', {
				historiaClinica: historia_clinica,
			})
			.then(({ data }) => {
				const response = data.data;
				setDataTable(response);
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	};

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};

	const handleReset = clearFilters => {
		clearFilters();
		setState({ searchText: '' });
	};

	const getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					placeholder={`Buscar ${dataIndex}`}
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
			record[dataIndex]
				? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
				: '',
	});

	const columns = [
		{
			title: 'Fecha',
			dataIndex: 'fecha',
			key: 'fecha',
			render: record => {
				const fechaParseada = Moment(record, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
				return <span>{fechaParseada}</span>;
			},
			...getColumnSearchProps('fecha'),
		},
		{
			title: 'Peso',
			dataIndex: 'peso',
			key: 'peso',
      render: record => {
					return (
						<div
							style={{
								padding: '10px',
								width: 'fit-content',
							}}
						>
							{record} kg
						</div>
					);
			},
			...getColumnSearchProps('peso'),
		},
		{
			title: 'Diferencia ingresos y egresos',
			dataIndex: 'balance_hidrico',
			key: 'balance_hidrico',
			render: record => {
				if (record) {
					return (
						<div
							style={{
								borderRadius: '10px',
								backgroundColor: '#FE5B5A',
								color: 'white',
								padding: '10px',
								width: 'fit-content',
							}}
						>
							{record}
						</div>
					);
				} else {
					return <div>No tiene</div>;
				}
			},
			...getColumnSearchProps('balance_hidrico'),
		},
		{
			title: 'Action',
			key: 'action',
			render: record => (
				<span>
					<Button
						onClick={() => {
							setDataSeleccionada(record);
							setMostrarDetalles(true);
						}}
					>
						Detalles
					</Button>
				</span>
			),
		},
	];

	//

	return (
		<>
			<Card
				title={
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'start',
							gap: '20%',
							flexDirection: 'row',
							width: '100%',
						}}
					>
						<div style={{ fontSize: '22px' }}>Balance Hídrico</div>
						<div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
							<div
								style={{
									gridArea: '1 / 2 / 2 / 3',
									display: 'flex',
									flexDirection: 'row-reverse',
									width: '100%',
									margin: 0,
								}}
							>
								<Form
									ref={formSearch}
									style={{
										width: '100%',
										display: 'flex',
										alignItems: 'center',
										flexDirection: 'row',
										gap: '20px',
									}}
								>
									<Form.Item name="codPaciente" style={{ width: '50%', margin: 0 }}>
										<AutoComplete
											value={valueCOD}
											options={optionsCOD}
											onSearch={onSearchCOD}
											onSelect={onSelectCOD}
											onChange={onChangeCOD}
											style={{ width: '100%' }}
											placeholder="Historia Clínica"
										/>
									</Form.Item>
									<Form.Item name="nombrePaciente" style={{ width: '100%', margin: 0 }}>
										<AutoComplete
											value={valueNOM}
											options={optionsNOM}
											onSearch={onSearchNOM}
											onSelect={onSelectNOM}
											onChange={onChangeNOM}
											style={{ width: '100%' }}
											placeholder="Nombre del paciente"
										/>
									</Form.Item>
								</Form>
							</div>
						</div>
						<div
							style={{
								gridArea: '1 / 3 / 3 / 4',
								display: 'flex',
								flexDirection: 'row-reverse',
								paddingTop: '15px',
							}}
						>
							<Button
								loading={loading}
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									backgroundColor: '#04B0AD',
									color: 'white',
								}}
								onClick={() => BuscarBalance()}
							>
								Buscar
							</Button>
						</div>
					</div>
				}
			>
				<Table
					className="gx-table-responsive"
					columns={columns}
					dataSource={dataTable}
					loading={loading}
				/>
				<ToastContainer pauseOnHover={false} />
			</Card>

			{mostrarDetalles && (
				<ModalBalanceHidrico
					mostrarDetalles={mostrarDetalles}
					setMostrarDetalles={setMostrarDetalles}
					data={dataSeleccionada}
				/>
			)}
		</>
	);
};

export default HistorialBalanceHidrico;
