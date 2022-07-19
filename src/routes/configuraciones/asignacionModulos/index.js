import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Table, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { httpClient } from '../../../util/Api';
import ModalAsignacion from './modalAsignacion';

const AsignacionModulos = () => {
	const [data, setData] = useState();
	const [modulos, setModulos] = useState();
	const [abrirModal, setAbrirModal] = useState(false);
  const [bloquearBoton, setBloquearBoton] = useState(false);
	const [filaActual, setFilaActual] = useState(null);
  const [numDocumento, setNumDocumento] = useState('');

	const traerUsuarios = async () => {
		const respuesta = await httpClient.post('modulos/getMedicosModulos');
		setData(respuesta.data.data);
	};

	const traerModulos = async () => {
		const respuesta = await httpClient.post('modulos/getModulos');
		setModulos(respuesta.data.data);
	};

	useEffect(() => {
    cargarDatainicial();
	}, []);

  const cargarDatainicial = async () => {
    setBloquearBoton(true);
    await traerUsuarios();
    await  traerModulos();
    setBloquearBoton(false);
  }

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
			record[dataIndex]
				? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
				: '',
	});

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
	};

	const handleReset = clearFilters => {
		clearFilters();
	};

	const columns = [
		{
			title: 'CMP',
			dataIndex: 'num_cmp',
			key: 'num_cmp',
			...getColumnSearchProps('num_cmp'),
		},
		{
			title: 'DNI',
			dataIndex: 'num_doc_iden',
			key: 'num_doc_iden',
			...getColumnSearchProps('num_doc_iden'),
		},
		{
			title: 'Nombres',
			dataIndex: 'des_nom_medico',
			key: 'nombres',
			...getColumnSearchProps('des_nom_medico'),
		},
		{
			title: 'Apellidos',
			dataIndex: 'des_ape_medico',
			key: 'apellidos',
			...getColumnSearchProps('des_ape_medico'),
		},
		{
			title: 'Modulos',
			dataIndex: 'modulos',
			key: 'modulos',
			render: record => {
				const registros = [];
				for (const key in modulos) {
					if (Object.hasOwnProperty.call(modulos, key)) {
						const element = modulos[key];

						for (const llave in record) {
							if (Object.hasOwnProperty.call(record, llave)) {
								const valor = record[llave];

								if (element.id_modulo === llave) {
									registros.push(
										<span>
											- {valor}
											<br></br>{' '}
										</span>
									);
								}
							}
						}
					}
				}
				return registros;
			},
		},
		{
			title: 'Acciones',
			key: 'acciones',
			render: record => (
				<span>{<Button onClick={() => mostrarModal(record)}>Asignar</Button>}</span>
			),
		},
	];

	const mostrarModal = record => {
    setNumDocumento(record.num_doc_iden);
		setFilaActual(record);
		setAbrirModal(true);
	};

	return (
		<Card
			title={
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(2, 1fr)',
						gridTemplateRows: '1fr',
						gridColumnGap: '0px',
						gridRowGap: '0px',
						marginRight: '5%',
					}}
				>
					<div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px', paddingTop: '20px' }}>
						Médicos Asignados
					</div>
					<div
						style={{
							gridArea: '1 / 2 / 2 / 3',
							display: 'flex',
							flexDirection: 'row-reverse',
							paddingTop: '15px',
						}}
					>
						<Button
							onClick={() => {
								setFilaActual(null);
								setAbrirModal(true);
                setNumDocumento('');
							}}
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
							type="primary"
              disabled={bloquearBoton}
						>
							Agregar Médico
						</Button>
					</div>
				</div>
			}
		>
			<Table
				className="gx-table-responsive"
				columns={columns}
				dataSource={data}
				loading={data === undefined}
			/>
			{abrirModal ? (
				<ModalAsignacion
					abrirModal={abrirModal}
					setAbrirModal={setAbrirModal}
					filaActual={filaActual}
					traerUsuarios={traerUsuarios}
					modulos={modulos}
          numDocumento={numDocumento}
          setNumDocumento={setNumDocumento}
				></ModalAsignacion>
			) : null}
			<ToastContainer pauseOnHover={false} />
		</Card>
	);
};

export default AsignacionModulos;
