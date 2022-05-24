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

import { useAuth } from '../../authentication';
import { useHistory } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import ModalListaEspera from '../admisionConsulta/modalListaEspera';

const ListaPaciente = () => {
	const [abrirModal, setAbrirModal] = useState(false);
	const [filaActual, setFilaActual] = useState({});
	const [data, setData] = useState();
	const [datosModal, setDatosModal] = useState({});
	const [dataInicialCargada, setDataInicialCargada] = useState(false);
	const [mostrarListaPaciente, setMostrarListaPaciente] = useState(true);
	const [state, setState] = useState();
	const [dataLoading, setDataLoading] = useState(false);
	const { userSignOut } = useAuth();
	const [dataConsultorios, setDataConsultorios] = useState(['1']);
	const [dataEspecialidades, setDataEspecialidades] = useState([]);
	const [loadingDataConsultorio, setLoadingDataConsultorio] = useState(false);
	const [abrirModalListaEspera, setAbrirModalListaEspera] = useState(false);

	const datos = useMemo(() => {
		return {
			codGrupoCia: '001',
			codEstado: '2',
			codMedico: JSON.parse(localStorage.getItem('token')).cod_medico,
			consultorio: JSON.parse(localStorage.getItem('token')).id_consultorio,
			bus: JSON.parse(localStorage.getItem('token')).id_bus,
		};
	}, []);

	const traerDatos = useCallback(async () => {
		setDataLoading(true);
		try {
			const { data } = await httpClient.post(`/pacientes`, datos);
			setData(data.data);
		} catch (e) {
			setData([]);
		}
		setDataInicialCargada(true);
		setDataLoading(false);
	}, [datos]);

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
	}, [dataInicialCargada, traerDatos]);

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
			title: 'Número HC',
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
			title: 'Estado',
			dataIndex: 'ESTADO',
			key: 'estado',
			...getColumnSearchProps('ESTADO'),

		},
		{
			title: 'Acción',
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

	const traerConsultorios = async (id = '1') => {
    setLoadingDataConsultorio(true);
    try {
      const { data: { data = [], success } } = await httpClient.post('atencionMedica/getConsultorios', { COD_ESPECIALIDAD: id });
      if (success) {
        setDataConsultorios(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoadingDataConsultorio(false);
  }

  const traerEspecialidades = async () => {
    try {
      const { data: { data = [], success } } = await httpClient.post('atencionMedica/getEspecialidades');
      if (success) {
        setDataEspecialidades(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

	useEffect(() => {
		traerEspecialidades();
	}, [])

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
								<Button
									onClick={() => setAbrirModalListaEspera(true)}
									type='default'>
										Lista de espera
								</Button>
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

			<ModalListaEspera
        traerConsultorios={traerConsultorios}
        dataConsultorios={dataConsultorios}
        dataEspecialidades={dataEspecialidades}
        loadingDataConsultorio={loadingDataConsultorio}
        setVisible={setAbrirModalListaEspera}
        visible={abrirModalListaEspera}/>
		</>
	);
};

export default ListaPaciente;
