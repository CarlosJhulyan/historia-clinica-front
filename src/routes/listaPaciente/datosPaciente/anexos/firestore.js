import React, { createRef, useEffect, useState } from 'react';
import { Col, Form, Input, Row, Button, Table, Modal } from 'antd';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import { notificaciones, openNotification } from '../../../../util/util';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';
import ReactWebMediaPlayer from 'react-web-media-player';
import { useDispatch, useSelector } from 'react-redux';
import { setAnexosAction } from '../../../../appRedux/actions/menu/anexos';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const AnexosFirestore = ({ datosModal }) => {
	// const data = useSelector((state) => state.anexo);

	//*Estado de la tabla
	const [estado, setEstado] = useState({
		observaciones: '',
		archivo: null,
	});

	// const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
	const [btnGuardar, setBtnGuardar] = useState(true);
	const [anexos, setAnexos] = useState([]);

	const [imagenActual, setImagenActual] = useState('');
	const [modalVideo, setModalVideo] = useState(null);

	useEffect(() => {
		if (estado.archivo !== null && estado.observaciones !== '') {
			setBtnGuardar(false);
		} else {
			setBtnGuardar(true);
		}
	}, [estado]);

	const changeHandler = (event) => {
		if (event.target.files[0]) {
			// setArchivoSeleccionado(event.target.files[0]);
			setEstado({ ...estado, archivo: event.target.files[0] });
		} else {
			setEstado({ ...estado, archivo: null });
			// setArchivoSeleccionado(null);
		}
	};

	const changeObservaciones = (e) => {
		setEstado({ ...estado, observaciones: e.target.value });
	};

	function confirm(e) {
		Modal.confirm({
			title: '¿Desea eliminar este registro?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si, Eliminar Registro',
			cancelText: 'No, Cancelar',
			onOk: () => {
				eliminar(e);
			},
		});
	}

	const eliminar = async (e) => {
		const filtredData = anexos.filter((item) => item.url !== e.url);
		await firestore.collection('anexos_odonto').add({
			date: Date.now(),
			anexos: [...filtredData],
			id: datosModal.estado.COD_CIA + datosModal.estado.COD_GRUPO_CIA + datosModal.estado.COD_PACIENTE,
		});
	};

	const storage = firebase.storage();
	const firestore = firebase.firestore();

	useEffect(() => {
		firestore
			.collection('anexos_odonto')
			.where('id', '==', datosModal.estado.COD_CIA + datosModal.estado.COD_GRUPO_CIA + datosModal.estado.COD_PACIENTE)
			.onSnapshot((querySnapshot) => {
				firestore
					.collection('anexos_odonto')
					.where(
						'id',
						'==',
						datosModal.estado.COD_CIA + datosModal.estado.COD_GRUPO_CIA + datosModal.estado.COD_PACIENTE
					)
					.orderBy('date', 'desc')
					.limit(1)
					.get()
					.then((e) => {
						const aaa = [...e.docs[0].data()['anexos']];
						const sss = aaa.map((w) => ({ ...w, key: w.url }));
						setAnexos([...sss]);
					})
					.catch((e) => {
						console.log('error', e);
					});
			});
	}, []);

	//*Referencia del formulario
	const formRef = createRef();
	const [form] = Form.useForm();

	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'nombreArchivo',
		},
		{
			title: 'Observacion',
			dataIndex: 'observacion',
		},
		{
			title: 'Acciones',
			key: 'borrar',
			width: 200,
			render: (e) => {
				const text = e.nombreArchivo.split('.');
				const formato = text[text.length - 1];
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
								title={e.nombreArchivo}
								visible
								onOk={() => setModalVideo(null)}
								okText="Cerrar"
								cancelText={null}
								onCancel={() => setModalVideo(null)}
								footer={[
									<Button key="back" onClick={() => setModalVideo(null)}>
										Cerrar
									</Button>,
								]}
								width="60%"
							>
								<ReactWebMediaPlayer width="100%" title={e.nombreArchivo} video={e.url} thumbnail="" />
							</Modal>
						);
						setModalVideo(aa);
					};
				} else {
					tipo = 'imagenes';
					accion = () => {
						console.log('imagenes');
						setImagenActual(e.url);
					};
				}

				return (
					<div>
						<Button
							className="gx-btn-danger"
							style={{ margin: '0px', padding: '4px 10px 0 10px' }}
							onClick={async () => {
								confirm(e);
							}}
						>
							<i className="icon icon-trash" />
						</Button>
						<Button
							className="gx-btn-cyan"
							style={{ margin: '0px', marginLeft: 10 }}
							onClick={accion}
							href={tipo === 'documento' ? e.url : null}
							download={tipo === 'documento' ? true : false}
						>
							{tipo === 'documento' ? 'DESCARGAR' : 'VER'}
						</Button>
					</div>
				);
			},
		},
	];

	const guardarAnexo = () => {
		setBtnGuardar(true);
		const refArchivo = storage.ref(
			'archivosOdonto/' +
				datosModal.estado.COD_CIA +
				datosModal.estado.COD_GRUPO_CIA +
				datosModal.estado.COD_PACIENTE +
				'/' +
				estado.archivo.name
		);
		const task = refArchivo.put(estado.archivo);
		task.on(
			'state_changed',
			(snapshot) => {},
			(error) => {
				setBtnGuardar(false);
				notificaciones('Por favor vuelva a intentar', 'Alerta', '');
				//openNotification('Error al guardar', 'Por favor vuelva a intentar', 'Alerta');
			},
			async () => {
				const url = await task.snapshot.ref.getDownloadURL();
				const aaa = [...anexos];
				aaa.push({ observacion: form.getFieldValue('observaciones'), nombreArchivo: estado.archivo.name, url });
				console.log(aaa);
				await firestore.collection('anexos_odonto').add({
					date: Date.now(),
					anexos: [...aaa],
					id: datosModal.estado.COD_CIA + datosModal.estado.COD_GRUPO_CIA + datosModal.estado.COD_PACIENTE,
				});
				// setAnexos(aaa);
				notificaciones('El Anexo se guardó correctamente', '', '');
				//openNotification('Anexo guardado', 'El anexo se guardo correctamente', '');
				form.setFieldsValue({ observaciones: '', archivo: null });
				setBtnGuardar(false);
			}
		);
	};

	return (
		<Form ref={formRef} layout="vertical" initialValues={estado} form={form}>
			<Row style={{ flexDirection: 'row', paddingTop: '20px' }}>
				<Col lg={14} md={14} sm={14} xs={24}>
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
							onChange={changeObservaciones}
							// onChange={onChange}
							rows={4}
						/>
					</Form.Item>
				</Col>
				<Col lg={6} md={6} sm={10} xs={24} style={{ display: 'flex', justifyContent: 'start', alignItems: 'start' }}>
					<Form.Item name="archivo" label="Anexo">
						<Input
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
						onClick={guardarAnexo}
						disabled={btnGuardar}
					>
						Guardar anexo
					</Button>
				</Col>
			</Row>
			<Row style={{ flexDirection: 'row', paddingTop: '10px' }}>
				<Col lg={24} md={24} sm={24} xs={24}>
					<Table className="gx-table-responsive" columns={columns} dataSource={anexos} />
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
	);
};
export default AnexosFirestore;
