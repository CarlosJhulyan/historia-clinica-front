import { Button, Col, Form, Input, Modal, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { httpClient } from '../../../../util/Api';
import Lightbox from 'react-awesome-lightbox';
import ReactWebMediaPlayer from 'react-web-media-player';
import { urlImagen } from '../../../../config/backend';
import { notificaciones, openNotification } from '../../../../util/util';
import { traerAnexo } from '../apis';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ModalBusqueda } from './modalBusqueda';

const AnexosLocal = ({ datosModal }) => {
	const [form] = Form.useForm();

	const anexos = useSelector((estado) => estado.anexo);
	const { historiaClinica, visualizar } = useSelector(state => state.helpers);

	const [imagenActual, setImagenActual] = useState('');
	const [modalVideo, setModalVideo] = useState(null);
	const [modalBuscar, setModalBuscar] = useState(false);

	const [estado, setEstado] = useState({
		observaciones: '',
		archivo: null,
	});
	const [btnGuardar, setBtnGuardar] = useState(true);
	const dataAnexos = anexos.data.map((e) => ({ ...e, url: urlImagen + e.ruta_local }));

	// const [dataAnexos, setDataAnexos] = useState([]);

	const changeObservaciones = (e) => {
		setEstado({ ...estado, observaciones: e.target.value });
	};

	const changeHandler = (event) => {
		if (event.target.files[0]) {
			setEstado({ ...estado, archivo: event.target.files[0] });
		} else {
			setEstado({ ...estado, archivo: null });
		}
	};

	function confirm(e) {
		Modal.confirm({
			title: '¿Desea eliminar este registro?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si, Eliminar Registro',
			cancelText: 'No, Cancelar',
			onOk: () => {
				notificaciones('', 'Promesa', {
					promesa: eliminarAnexo,
					ok: 'Registro eliminado correctamente',
					error: 'Alerta al eliminar, Por favor vuelva a intentarlo',
					pendiente: 'Eliminando Anexo',
					parametros: [e],
				});
			},
		});
	}

	const eliminarAnexo = async (a) => {
		const respuesta = await httpClient.post('/anexos/deleteAnexos', { codAnexo: a.cod_anexo });
		if (respuesta.data.success) {
			await traerAnexo({ nroAtencion: datosModal.estado.NUM_ATEN_MED });
			//openNotification('Registro Eliminado', '', '');
		} else {
			throw 'Por favor vuelva a intentarlo';
			//openNotification('Error al eliminar el registro', 'Por favor vuelva a intentarlo', 'Alerta');
		}
	};

	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'nom_file',
		},
		{
			title: 'Observacion',
			dataIndex: 'obs_anexo',
		},
		{
			title: 'Acciones',
			key: 'borrar',
			width: 200,
			render: (eee) => {
				console.log("EEEEEEEEEEEEEEEEEEEE1:", eee)
				const formato = eee.ext_file.trim();
				let accion;
				let tipo;
				if (
					formato === 'doc' ||
					formato === 'DOC' ||
					formato === 'docx' ||
					formato === 'DOCX' ||
					formato === 'pdf' ||
					formato === 'PDF'
				) {
					tipo = 'documento';
					accion = () => {
						console.log('documento');
					};
				} else if (formato === 'mp4') {
					tipo = 'multimedia';
					accion = () => {
						console.log('multimedia');
						const aa = (
							<Modal
								title={eee.nom_file}
								visible
								onOk={() => setModalVideo(null)}
								okText="Cerrar"
								cancelText={null}
								onCancel={() => setModalVideo(null)}
								footer={[
									<Button disabled={historiaClinica | visualizar} key="back" onClick={() => setModalVideo(null)}>
										Cerrar
									</Button>,
								]}
								width="60%"
							>
								<ReactWebMediaPlayer width="100%" title={eee.nom_file} video={eee.url} thumbnail="" />
							</Modal>
						);
						setModalVideo(aa);
					};
				} else {
					tipo = 'imagenes';
					accion = () => {
						console.log('imagenes');
						setImagenActual(eee.url);
					};
				}

				return (
					<div>
						<Button
							disabled={historiaClinica | visualizar}
							className="gx-btn-danger"
							style={{ margin: '0px', padding: '4px 10px 0 10px' }}
							onClick={async () => {
								confirm(eee);
								// const filtredData = anexos.filter((item) => item.url !== eee.url);
								// await firestore.collection('anexos_odonto').add({
								// 	date: Date.now(),
								// 	anexos: [...filtredData],
								// 	id: datosModal.estado.COD_CIA + datosModal.estado.COD_GRUPO_CIA + datosModal.estado.COD_PACIENTE,
								// });
							}}
						>
							<i className="icon icon-trash" />
						</Button>
						<Button
							/* disabled={historiaClinica | visualizar} */
							className="gx-btn-cyan"
							style={{ margin: '0px', marginLeft: 10 }}
							onClick={accion}
							href={tipo === 'documento' ? eee.url : null}
							download={tipo === 'documento' ? true : false}
						>
							{tipo === 'documento' ? 'DESCARGAR' : 'VER'}
						</Button>
					</div>
				);
			},
		},
	];

	useEffect(() => {
		if (estado.archivo !== null && estado.observaciones !== '') {
			setBtnGuardar(false);
		} else {
			setBtnGuardar(true);
		}
	}, [estado]);

	function confirmAdd() {
		Modal.confirm({
			title: '¿Desea guardar todos los campos?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si, Guardar',
			cancelText: 'No, Cancelar',
			onOk: () => {
				notificaciones('', 'Promesa', {
					promesa: guardarAnexo,
					ok: 'Registro guardado correctamente',
					error: 'Alerta al guardar, Por favor vuelva a intentarlo',
					pendiente: 'Guardando Anexo',
				});
				// guardar();
			},
		});
	}



	const guardarAnexo = async () => {
		const codMedico = JSON.parse(sessionStorage.getItem('token'));

		const dataForm = new FormData();
		dataForm.append('codGrupoCia', datosModal.estado.COD_GRUPO_CIA);
		dataForm.append('codCia', datosModal.estado.COD_CIA);
		dataForm.append('codLocal', datosModal.estado.COD_LOCAL_ANTECENDENTE);
		dataForm.append('obsAnexo', estado.observaciones);
		dataForm.append('codMedico', codMedico.cod_medico);
		dataForm.append('numAtendMed', datosModal.estado.NUM_ATEN_MED);
		dataForm.append('imagen', estado.archivo);

		const respuesta = await httpClient.post('/grabarAnexos/GrabarAnexos', dataForm);

		if (respuesta.data.success) {
			await traerAnexo({ nroAtencion: datosModal.estado.NUM_ATEN_MED });
			//notificaciones('Registro ingresado', '', '');
			//openNotification('Registro Ingresado', '', '');
		} else {
			throw 'Por favor vuelva a intentarlo';
			//notificaciones('Por favor vuelva a intentarlo', 'Alerta', '');
			//openNotification('Error al guardar el anexo', 'Por favor vuelva a intentarlo', 'Alerta');
		}
	};

	return (
		<>
			<Form layout="vertical" initialValues={{ observaciones: '' }} form={form}>
				<Row style={{ flexDirection: 'row', paddingTop: '20px' }}>
					<Col lg={10} md={14} sm={14} xs={24}>
						<Form.Item
							name="observaciones"
							label="Observaciones"
							rules={[
								{
									required: false,
									message: 'Ingrese observaciones válidas',
								},
							]}
						>
							<Input.TextArea
								disabled={historiaClinica | visualizar}
								onChange={changeObservaciones}
								// onChange={onChange}
								rows={4}
							/>
						</Form.Item>
					</Col>
					<Col lg={6} md={6} sm={10} xs={24} style={{ display: 'flex', justifyContent: 'start', alignItems: 'start' }}>
						<Form.Item name="archivo" label="Anexo">
							<Input
								disabled={historiaClinica | visualizar}
								type="file"
								onChange={changeHandler}
								accept="image/jpeg, image/png, video/mp4, application/pdf, application/msword,.docx"
							></Input>
						</Form.Item>
					</Col>
					<Col
						xl={3}
						lg={4}
						md={4}
						sm={24}
						xs={24}
						style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
					>
						<Button
							className="gx-mb-0"
							type="primary"
							htmlType="submit"
							style={{
								height: 'auto',
								width: '95%',
								lineHeight: '1.5em',
								wordWrap: 'break-word',
								whiteSpace: 'break-spaces',
								padding: '10px',
								marginTop: '10px',
							}}
							onClick={confirmAdd}
							disabled={btnGuardar}
						>
							Guardar anexo
						</Button>
					</Col>
					<Col
						xl={3}
						lg={4}
						md={4}
						sm={24}
						xs={24}
						style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
					>
						<Button
							disabled={visualizar}
							className="gx-mb-0"
							type="primary"
							htmlType="submit"
							style={{
								height: 'auto',
								width: '95%',
								lineHeight: '1.5em',
								wordWrap: 'break-word',
								whiteSpace: 'break-spaces',
								padding: '10px',
								marginTop: '10px',
							}}
							onClick={() => setModalBuscar(true)}
						>
							Buscar anexo
						</Button>
					</Col>

				</Row>
				<Row style={{ flexDirection: 'row', paddingTop: '10px' }}>
					<Col lg={24} md={24} sm={24} xs={24}>
						<Table className="gx-table-responsive" columns={columns} dataSource={dataAnexos} />
					</Col>
				</Row>
				{imagenActual !== '' ? (
					<Lightbox
						showTitle={false}
						onClose={() => setImagenActual('')}
						image={imagenActual}
						title="Image Title"
					></Lightbox>
				) : null}
				{modalVideo}
			</Form>
			{
				modalBuscar
					? <ModalBusqueda datosModal={datosModal} modalBuscar={modalBuscar} setModalBuscar={setModalBuscar} />
					: null
			}
		</>
	);
};

export default AnexosLocal;
