import { Col, Form, Input, Row, Button, Table, Modal } from 'antd';
import React, { createRef, useEffect, useState } from 'react';
import ModalImagenes from './modalImagenes';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setImagenesAction } from '../../../../appRedux/actions/menu/imagenes';


export const Imagenes = ({ datosModal }) => {
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const dispatch = useDispatch();
	const formRef = createRef();
	const imagenes = useSelector(state => state.imagenes);
	const obsImagen = imagenes.recomendacion;
	const dataImagenes = useSelector(state => state.combosReducer.dataImagenes);
	const [abrirModal, setAbrirModal] = useState(false);
	const { historiaClinica , visualizar } = useSelector(state => state.helpers)

	const dataImganesSource = imagenes.dataProcedimiento;

	const setDataImagnesSource = data => {
		dispatch(
			setImagenesAction({
				...imagenes,
				dataProcedimiento: data,
			})
		);
	};

	function confirm(e) {
		Modal.confirm({
			title: '¿Desea eliminar este registro?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si, Eliminar Registro',
			cancelText: 'No, Cancelar',
			onOk: () => {
				quitarItem(e);
			},
		});
	}

	const columns = [
		{
			title: 'Descripción',
			dataIndex: 'DESC_PROD',
		},
		{
			title: 'Especialidad',
			dataIndex: 'NOM_LAB',
			width: '30%',
		},
		{
			title: '',
			key: 'borrar',
			width: 100,
			align: 'center',
			render: e => (
				<Button
					disabled={historiaClinica | visualizar}
					className="gx-btn-danger"
					style={{ margin: '0px', padding: '4px 10px 0 10px' }}
					onClick={() => {
						confirm(e);
					}}
				>
					<i className="icon icon-trash" />
				</Button>
			),
		},
	];

	useEffect(() => {
		if (obsImagen) {
			formRef.current.setFieldsValue({ diagnostico: obsImagen });
		}
		if (dataImganesSource) {
			const borrar = dataImganesSource.filter(
				(thing, index, self) => index === self.findIndex(t => t.COD_PROD === thing.COD_PROD)
			);
			setDataImagnesSource(borrar);
		}
	}, [obsImagen]);

	const onChangeRecomendacion = value => {
		dispatch(
			setImagenesAction({
				...imagenes,
				recomendacion: value.target.value,
			})
		);
	};

	const buscarImagenes = () => setAbrirModal(true);

	const handleDatos = value => {
		setAbrirModal(false);
		if (value.estado) {
			setDataImagnesSource([...dataImagenes.filter(item => value.estado.includes(item.key))]);
		}
	};

	const quitarItem = e => {
		const filtredData = dataImganesSource.filter(element => element.COD_PROD !== e.COD_PROD);
		setDataImagnesSource(filtredData);
	};

	useEffect(() => {
		if (dataImganesSource?.length > 0) {
			dispatch(
				setImagenesAction({
					...imagenes,
					dataProcedimiento: dataImganesSource,
				})
			);
		} else {
			dispatch(
				setImagenesAction({
					...imagenes,
					dataProcedimiento: dataImganesSource,
				})
			);
		}
	}, [dataImganesSource]);




	return (
		<Form ref={formRef} layout="vertical">
			<Row style={{ flexDirection: 'row', paddingTop: '20px' }}>
				<Col lg={24} md={24} sm={24} xs={24}>
					<Table className="gx-table-responsive" columns={columns} dataSource={dataImganesSource} />
				</Col>
			</Row>
			<Row style={{ display: 'flex', flexDirection: 'row-reverse', paddingTop: '20px' }}>
				<Col lg={6} md={6} sm={6} xs={24}>
					<Form.Item>
						<Button
							disabled={historiaClinica | visualizar}
							className="gx-mb-0"
							style={{
                width: '100% ',
                background: themeSettingsGlobal.COD_COLOR_1,
                color: '#fff'
              }}
							icon={<SearchOutlined />}
							onClick={() => buscarImagenes()}
						>
							Buscar Imagenes
						</Button>
					</Form.Item>
				</Col>
			</Row>
			<Row style={{ flexDirection: 'row', paddingTop: '20px' }}>
				<Col lg={24} md={24} sm={24} xs={24}>
					<Form.Item
						name="diagnostico"
						label="Recomendaciones Generales"
						rules={[
							{
								required: true,
								message: 'Ingrese recomendaciones válidas',
							},
						]}
					>
						<Input.TextArea disabled={historiaClinica | visualizar}
							onChange={onChangeRecomendacion} rows={4} />
					</Form.Item>
				</Col>

			</Row>
			{abrirModal ? (
				<ModalImagenes
					datosModal={datosModal}
					abrirModal={abrirModal}
					setAbrirModal={setAbrirModal}
					dataImagenes={dataImagenes}
					handleDatos={handleDatos}
					dataSource={dataImganesSource}
				/>
			) : null}
		</Form>
	);
};
