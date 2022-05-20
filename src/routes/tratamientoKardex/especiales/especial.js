import { useEffect, useState } from 'react';
import TablaEspeciales from './tabla/tabla';
import ModalImagenes from '../../listaPaciente/datosPaciente/imagenes/modalImagenes';
import ModalLaboratorio from '../../listaPaciente/datosPaciente/Laboratorio/modalLaboratorio';
import { useDispatch, useSelector } from 'react-redux';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import confirm from 'antd/lib/modal/confirm';

const Especiales = ({ historia, editar, TraerDatos, datosModal }) => {
	const dispatch = useDispatch();

	const [data, setData] = useState([]);

	const [abrirModalImagenes, setAbrirModalImagenes] = useState(false);
	const [abrirModalLaboratorio, setAbrirModalLaboratorio] = useState(false);

	const imagenes = useSelector(state => state.imagenes);
	const laboratorio = useSelector(state => state.laboratorio);

	const dataImagenes = useSelector(state => state.combosReducer.dataImagenes);
	const dataLaboratorio = useSelector(state => state.combosReducer.dataLaboratorio);

	const dataImganesSource = imagenes.dataProcedimiento;
	const dataLaboratorioSource = laboratorio.dataProcedimiento;

	const setDataImagnesSource = d => {
		const aux = [];
		data.forEach(element => {
			aux.push(element);
		});
		d.forEach(element => {
			element.tipo = 'Imagen';
			aux.push(element);
		});
		setData(aux);
	};

	const setDataLaboratorioSource = d => {
		const aux = [];
		data.forEach(element => {
			aux.push(element);
		});
		d.forEach(element => {
			element.tipo = 'Laboratorio';
			aux.push(element);
		});
		setData(aux);
	};

	function confirmLab(data) {
		confirm({
			title: '¿Está seguro de agregar el laboratorio?',
			icon: <ExclamationCircleOutlined />,
			content: 'Se agregará el laboratorio al listado de procedimientos',
			cancelText: 'Cancelar',
			okText: 'Agregar laboratorio',
			onOk() {
				setDataLaboratorioSource(data);
			},
			onCancel() {
				// setAbrir(false);
			},
		});
	}

	function confirmImg(data) {
		confirm({
			title: '¿Está seguro de agregar la imagen?',
			icon: <ExclamationCircleOutlined />,
			content: 'Se agregará la imagen al listado de procedimientos',
			cancelText: 'Cancelar',
			okText: 'Agregar imagen',
			onOk() {
				setDataImagnesSource(data);
			},
			onCancel() {
				// setAbrir(false);
			},
		});
	}

	const handleDatosLaboratorio = value => {
		setAbrirModalLaboratorio(false);
		if (value.estado) {
			confirmLab([...dataLaboratorio.filter(item => value.estado.includes(item.key))]);
		}
	};

	const handleDatosImagenes = value => {
		setAbrirModalImagenes(false);
		if (value.estado) {
			confirmImg([...dataImagenes.filter(item => value.estado.includes(item.key))]);
		}
	};

	return (
		<>
			<TablaEspeciales
				historia={historia}
				editar={editar}
				data={data}
				setData={setData}
				TraerDatos={TraerDatos}
				setAbrirModalImagenes={setAbrirModalImagenes}
				setAbrirModalLaboratorio={setAbrirModalLaboratorio}
			/>
			{abrirModalImagenes ? (
				<ModalImagenes
					abrirModal={abrirModalImagenes}
					setAbrirModal={setAbrirModalImagenes}
					datosModal={datosModal}
					dataImagenes={dataImagenes}
					handleDatos={handleDatosImagenes}
					dataSource={dataImganesSource}
				/>
			) : null}
			{abrirModalLaboratorio ? (
				<ModalLaboratorio
					abrirModal={abrirModalLaboratorio}
					setAbrirModal={setAbrirModalLaboratorio}
					datosModal={datosModal}
					lab={dataLaboratorio}
					handleDatos={handleDatosLaboratorio}
					dataSource={dataLaboratorioSource}
				/>
			) : null}
		</>
	);
};

export default Especiales;
