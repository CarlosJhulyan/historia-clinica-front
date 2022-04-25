import { CheckCircleOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, notification, Space } from 'antd';
import { toast } from 'react-toastify';
import { limpiarAnexo } from '../appRedux/actions/menu/anexos';
import {
	limpiarAntecedentesFisiologicos,
	limpiarAntecedentesGenerales,
	limpiarAntecedentesGineco,
	limpiarAntecedentesPatologicos,
	limpiarAntecedentesPatologicosFamiliares,
	limpiarOtros,
} from '../appRedux/actions/menu/antecedentes';
import { limpiarDesarrolloAction } from '../appRedux/actions/menu/desarrollo';
import { limpiarDiagnosticoAction } from '../appRedux/actions/menu/diagnostico';
import { limpiarEnfermedadActual } from '../appRedux/actions/menu/enfermedadActual';
import {
	limpiarEvolucionTratamiento,
	limpiarRegistrosEvolucion,
} from '../appRedux/actions/menu/evolucionTratamiento';
import { limpiarExamenClinico } from '../appRedux/actions/menu/examenClinico';
import {
	limpiarEstadoFisico,
	limpiarFuncionesVitales,
} from '../appRedux/actions/menu/examenFisico';
import { setLimpiarHistoriaClinica, setLimpiarVisualizar } from '../appRedux/actions/menu/helpers';
import { limpiarImagenes } from '../appRedux/actions/menu/imagenes';
import { limpiarLaboratorio } from '../appRedux/actions/menu/laboratorio';
import { limpiarPestañas } from '../appRedux/actions/menu/pestañas';
import {
	limpiarProcedimientoInterconsultaReducer,
	limpiarProcedimientoReducer,
} from '../appRedux/actions/menu/procedimiento';
import {
	limpiarCabeceraReceta,
	limpiarTratamientoCabeceraDetalle,
	limpiarTratamientoReducer,
} from '../appRedux/actions/menu/tratamiento';
import { limpiarOpacity } from '../appRedux/actions/Opacity';
import { setClearUI } from '../appRedux/actions/ui';
import store from '../appRedux/store';

export const openNotification = (titulo, texto, tipo) => {
	const key = `open${Date.now()}`;
	notification.open({
		duration: 2,
		style: { color: tipo === 'Alerta' ? 'red' : '#52c41a' },
		icon: tipo === 'Alerta' ? <CloseCircleOutlined /> : <CheckCircleOutlined />,

		message: titulo,
		description: texto,
		key,
	});
};

export const notificaciones = (texto, tipo, objeto) => {
	switch (tipo) {
		case 'Alerta':
			toast.error(texto, { theme: 'colored' });
			break;
		case 'Promesa':
			if (objeto.parametros) {
				toast.promise(
					() => objeto.promesa(...objeto.parametros),
					{
						pending: objeto.pendiente,
						success: objeto.ok,
						error: objeto.error,
					},
					{ theme: 'colored' }
				);
			} else {
				toast.promise(
					() => objeto.promesa(),
					{
						pending: objeto.pendiente,
						success: objeto.ok,
						error: objeto.error,
					},
					{ theme: 'colored' }
				);
			}
			break;

		default:
			toast.success(texto, { theme: 'colored' });
			break;
	}
};

export const onClickRetroceder = () => {
	//Limpiar Data
	store.dispatch(limpiarDiagnosticoAction());
	store.dispatch(limpiarAnexo());
	store.dispatch(limpiarAntecedentesGenerales());
	store.dispatch(limpiarAntecedentesFisiologicos());
	store.dispatch(limpiarAntecedentesGineco());
	store.dispatch(limpiarAntecedentesPatologicos());
	store.dispatch(limpiarAntecedentesPatologicosFamiliares());
	store.dispatch(limpiarOtros());
	store.dispatch(limpiarDesarrolloAction());
	store.dispatch(limpiarEnfermedadActual());
	store.dispatch(limpiarEvolucionTratamiento());
	store.dispatch(limpiarRegistrosEvolucion());
	store.dispatch(limpiarExamenClinico());
	store.dispatch(limpiarFuncionesVitales());
	store.dispatch(limpiarEstadoFisico());
	store.dispatch(limpiarImagenes());
	store.dispatch(limpiarLaboratorio());
	store.dispatch(limpiarPestañas());
	store.dispatch(limpiarProcedimientoReducer());
	store.dispatch(limpiarProcedimientoInterconsultaReducer());
	store.dispatch(limpiarTratamientoCabeceraDetalle());
	store.dispatch(limpiarTratamientoReducer());
	store.dispatch(limpiarCabeceraReceta());
	store.dispatch(limpiarOpacity());
	store.dispatch(setLimpiarHistoriaClinica());
	store.dispatch(setClearUI());
	store.dispatch(setLimpiarVisualizar());
};

const handleSearch = (selectedKeys, confirm, dataIndex) => confirm();
const handleReset = clearFilters => clearFilters();

export const getColumnSearchProps = dataIndex => ({
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
