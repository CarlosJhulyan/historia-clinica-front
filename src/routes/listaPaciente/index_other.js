import React, { 
	useCallback, 
	useEffect, 
	useMemo, 
	useState 
} from 'react';
import { 
	Button, 
	Card, 
	Table, 
	Modal, 
	Input, 
	Space,
	Radio,
	Form
} from 'antd';
import ModalDetalles from './modalDetalles';
import { httpClient } from '../../util/Api';
import DatosPaciente from './datosPaciente/index';
import moment from 'moment';
import { datosEnviar, funn } from '../../constants/datosEnviar';

import { useIdleTimer } from 'react-idle-timer';
import { useAuth } from '../../authentication';
import { useHistory } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const ListaPaciente = () => {
	const [abrirModal, setAbrirModal] = useState(false);
	const [filaActual, setFilaActual] = useState({});
	const [data, setData] = useState();
	const [codEstado, setCodEstado] = useState('2');
	const [datosModal, setDatosModal] = useState({});
	const [dataInicialCargada, setDataInicialCargada] = useState(false);
	const [mostrarListaPaciente, setMostrarListaPaciente] = useState(true);
	const [sesionCerrada, setSesionCerrada] = useState(false);
	const [state, setState] = useState();
	const [dataLoading, setDataLoading] = useState(false);
	const { userSignOut } = useAuth();
	const history = useHistory();

	const datos = useMemo(() => {
		return {
			codGrupoCia: '001',
			codEstado,
			codMedico: JSON.parse(localStorage.getItem('token')).cod_medico,
			consultorio: JSON.parse(localStorage.getItem('token')).id_consultorio,
			bus: JSON.parse(localStorage.getItem('token')).id_bus,
		};
	}, [codEstado]);

	const traerDatos = useCallback(async () => {
		setDataLoading(true);
		try {
			const { data } = await httpClient.post(`/pacientes`, { ...datos, codEstado });
			setData(data.data);
		} catch (e) {
			setData([]);
		}
		setDataInicialCargada(true);
		setDataLoading(false);
	}, [codEstado, datos]);

	const actualizarDatos = async () => {
		setData(undefined);
		await traerDatos();
	};

	const mostrarModal = (record) => {
		setFilaActual(record);
		setAbrirModal(true);
	};

	useEffect(() => {
		traerDatos();
	
		const fechaActual = moment().format('YYYY-MM-DD');
		datosEnviar.evolucionTratamiento['FECHA'] = fechaActual;

		funn.ff = setMostrarListaPaciente;
	}, [dataInicialCargada, traerDatos, codEstado]);

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

	const columns = [
		{
			title: 'Fecha',
			dataIndex: 'FECHA',
			key: 'fecha'
		},
		{
			title: 'Hora',
			dataIndex: 'HORA',
			key: 'hora'
		},
		{
			title: 'Especialidad',
			dataIndex: 'ESPECIALIDAD',
			key: 'especialidad'
		},
		{
			title: 'N??mero HC',
			dataIndex: 'COD_PACIENTE',
			key: 'hc',
			...getColumnSearchProps('COD_PACIENTE'),

		},
		{
			title: 'Paciente',
			dataIndex: 'PACIENTE',
			key: 'paciente',
			...getColumnSearchProps('PACIENTE'),

		},
		{
			title: 'Edad',
			dataIndex: 'EDAD',
			key: 'edad'
		},
		{
			title: 'Area asignada',
			dataIndex: 'ASIGNADO',
			key: 'asignado',
			render: (asignado) => (
				<>
					{asignado === '1' && <span>HOSPITALIZACION</span>}
					{asignado === '2' && <span>EMERGENCIA</span>}
				</>
			)
		},
		{
			title: 'Acci??n',
			key: 'action',
			render: (record) => (
				<span>
					<Button onClick={() => mostrarModal(record)}>Detalles</Button>
				</span>
			),
		},
	];

	const handleDatos = (data) => {
		setAbrirModal(false);
		setDatosModal(data);
		setMostrarListaPaciente(false);
	};

	const { getRemainingTime, getLastActiveTime } = useIdleTimer({
		timeout: 1000 * 60 * 60,
		onIdle: (event) => {
			if (!sesionCerrada) {
				Modal.confirm({
					title: 'Tu sesi??n ha expirado',
					content: (
						<div>
							<p>
								Permaneci?? mucho tiempo inactivo. <br /> Por favor vuelva a Iniciar Sesi??n.
							</p>
						</div>
					),
					onOk() {
						userSignOut(() => {
							history.push('/');
						});
					},
					onCancel() {
						setSesionCerrada(false);
					},
					cancelText: 'Quedarme Aqui',
					okText: 'Aceptar',
				});
				setSesionCerrada(true);
			}
		},
		onActive: (event) => { },
		onAction: (event) => { },
		debounce: 500,
	});

	const handleChangeCodeStatus = e => {
		setCodEstado(e.target.value);
	}

	return (
		<>
			{mostrarListaPaciente ? (
				<Card
					title={
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '250px auto',
								gridTemplateRows: '1fr',
								gridColumnGap: '0px',
								gridRowGap: '0px',
								overflowX: 'auto'
							}}
						>
							<div style={{ gridArea: '1 / 1 / 1 / 2', fontSize: '22px', paddingTop: '20px' }}>Lista de Pacientes</div>
							<div
								style={{
									gridArea: '1 / 2 / 2 / 3',
									display: 'flex',
									flexDirection: 'row-reverse',
									paddingTop: '15px',
									gap: '50px'
								}}
							>
								<Button
									disabled={dataLoading}
									onClick={actualizarDatos}
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									Actualizar
								</Button>
								<Form.Item 
										style={{ width: '430px' }} 
										label='Filtrar por'>
									<Radio.Group
										value={codEstado}
										onChange={handleChangeCodeStatus}
										disabled={dataLoading}
										buttonStyle="solid">
											<Radio.Button value="1">Hospitalizaci??n</Radio.Button>
											<Radio.Button value="2">Emergencia</Radio.Button>
											<Radio.Button value="3">UCI</Radio.Button>
											<Radio.Button value="4">SOP</Radio.Button>
									</Radio.Group>
								</Form.Item>
							</div>
						</div>
					}
				>
					<Table 
						className="gx-table-responsive" 
						columns={columns} 
						dataSource={data} 
						loading={dataLoading} />
				</Card>
			) : (
				<DatosPaciente setDatosModal={setDatosModal} datosModal={datosModal} setMostrarListaPaciente={setMostrarListaPaciente} traerDatos={traerDatos} />
			)}

			{abrirModal ? (
				<ModalDetalles
					abrirModal={abrirModal}
					setAbrirModal={setAbrirModal}
					filaActual={filaActual}
					handleDatos={handleDatos}
				/>
			) : null}

			<ToastContainer pauseOnHover={false} />
		</>
	);
};

export default ListaPaciente;
