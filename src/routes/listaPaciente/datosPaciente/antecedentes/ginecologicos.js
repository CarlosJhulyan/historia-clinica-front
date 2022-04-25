import React, { useEffect, useState } from 'react';
import { Col, Form, Row, Input, Select, Button, Checkbox, DatePicker } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
	setGCicloMenstruacion,
	setGDisminorrea,
	setGFechaFpp,
	setGFechaFup,
	setGFechaFur,
	setGMac,
	setGMamografia,
	setGMenarquia,
	setGNroCesareas,
	setGNroGestacion,
	setGOtros,
	setGPap,
	setGPariedad,
	setGRcMenstruacion,
	setGReglaRegular,
	setGRS,
} from '../../../../appRedux/actions/menu/antecedentes';
const Ginecologicos = () => {
	const { TextArea } = Input;
	const [form] = Form.useForm();
	const dataGinecologicos = useSelector((state) => state.antecedentesGineco);
	const dispatch = useDispatch();
	const { historiaAntecedentes, visualizar } = useSelector(state => state.helpers)

	const formatoFecha = 'DD/MM/YYYY';

	const handleChangeRegular = (e) => {
		dispatch(setGReglaRegular(e.target.checked ? 'S' : 'N'));
	};
	const handleChangeDisminorrea = (e) => {
		dispatch(setGDisminorrea(e.target.checked ? 'S' : 'N'));
	};
	const handleChangeP1 = (e) => {
		dispatch(
			setGPariedad(
				e.target.value +
				'-' +
				form.getFieldValue('p2') +
				'-' +
				form.getFieldValue('p3') +
				'-' +
				form.getFieldValue('p4')
			)
		);
	};
	const handleChangeP2 = (e) => {
		dispatch(
			setGPariedad(
				form.getFieldValue('p1') +
				'-' +
				e.target.value +
				'-' +
				form.getFieldValue('p3') +
				'-' +
				form.getFieldValue('p4')
			)
		);
	};
	const handleChangeP3 = (e) => {
		dispatch(
			setGPariedad(
				form.getFieldValue('p1') +
				'-' +
				form.getFieldValue('p2') +
				'-' +
				e.target.value +
				'-' +
				form.getFieldValue('p4')
			)
		);
	};
	const handleChangeP4 = (e) => {
		dispatch(
			setGPariedad(
				form.getFieldValue('p1') +
				'-' +
				form.getFieldValue('p2') +
				'-' +
				form.getFieldValue('p3') +
				'-' +
				e.target.value
			)
		);
	};
	const handleChangeNroGestaciones = (e) => {
		dispatch(setGNroGestacion(e.target.value));
	};
	const handleChangeNroCesareas = (e) => {
		dispatch(setGNroCesareas(e.target.value));
	};
	const handleChangeMenarquia = (e) => {
		dispatch(setGMenarquia(e.target.value));
	};
	const handleChangeRC1 = (e) => {
		dispatch(setGRcMenstruacion(e.target.value));
	};
	const handleChangeRC2 = (e) => {
		dispatch(setGCicloMenstruacion(e.target.value));
	};
	const handleChangeRS = (e) => {
		dispatch(setGRS(e.target.value));
	};
	const handleChangeFUR = (e) => {
		dispatch(setGFechaFur(moment(e._d).format(formatoFecha)));
	};
	const handleChangeFPP = (e) => {
		dispatch(setGFechaFpp(moment(e._d).format(formatoFecha)));
	};
	const handleChangeFUP = (e) => {
		dispatch(setGFechaFup(moment(e._d).format(formatoFecha)));
	};
	const handleChangeMAC = (e) => {
		dispatch(setGMac(e.target.value));
	};
	const handleChangePAP = (e) => {
		dispatch(setGPap(e.target.value));
	};
	const handleChangeMamografia = (e) => {
		dispatch(setGMamografia(e.target.value));
	};
	const handleChangeOtros = (e) => {
		dispatch(setGOtros(e.target.value));
	};

	useEffect(() => {
		const abc = { ...dataGinecologicos };

		abc.fechaFpp = abc.fechaFpp === '' || abc.fechaFpp === null ? '' : moment(abc.fechaFpp, 'DD/MM/YYYY');
		abc.fechaFup = abc.fechaFup === '' || abc.fechaFup === null ? '' : moment(abc.fechaFup, 'DD/MM/YYYY');
		abc.fechaFur = abc.fechaFur === '' || abc.fechaFur === null ? '' : moment(abc.fechaFur, 'DD/MM/YYYY');

		abc.indReglaRegular = abc.indReglaRegular === 'S' ? true : false;
		abc.disminorrea = abc.disminorrea === 'S' ? true : false;

		const par = abc.pariedad === null ? '---' : abc.pariedad.split('-');

		form.setFieldsValue({ ...abc, p1: par[0], p2: par[1], p3: par[2], p4: par[3] });
	}, [dataGinecologicos]);

	return (
		<Form layout="vertical" form={form}>
			<h4 style={{ padding: '20px 0 15px 25px', textTransform: 'uppercase' }}>
				<b>Ginegológicos</b>
			</h4>
			<Row style={{ flexDirection: 'row', paddingLeft: '30px' }}>
				<Col xxl={6} xl={6} lg={14} md={24} sm={15} xs={24}>
					<Form.Item
						name="edadMenarquia"
						label="Menarquía"
						rules={[
							{
								required: false,
								message: 'Ingrese una menarquia válida',
							},
						]}
					>
						<Input disabled={historiaAntecedentes | visualizar} type="number" onChange={handleChangeMenarquia} style={{ width: '100% ' }} />
					</Form.Item>
				</Col>
				<Col xxl={6} xl={6} lg={12} md={24} sm={15} xs={24}>
					<Form.Item
						name="indReglaRegular"
						rules={[
							{
								required: false,
								message: 'Seleccione el lugar',
							},
						]}
						valuePropName="checked"
					>
						<Checkbox
							disabled={historiaAntecedentes | visualizar}
							onChange={(e) => handleChangeRegular(e)}
						// checked={antecedentes['ginecologicos'].indReglaRegular === 'S' ? true : false}
						>
							¿Regla Regular?
						</Checkbox>
					</Form.Item>
				</Col>
				<Col xxl={6} xl={6} lg={14} md={24} sm={15} xs={24}>
					<Input.Group>
						R.Catamenial (+3/28)
						<Row style={{ flexDirection: 'row', padding: '8px 0 0 0' }}>
							<Col xs={9} style={{ flexDirection: 'row', padding: '0px' }}>
								<Form.Item
									name="rcMenstruacion"
									// label="R.Catamenial (+3/28)"
									style={{ height: '100% ' }}
								>
									<Input disabled={historiaAntecedentes | visualizar} type="number" onChange={handleChangeRC1} style={{ width: '90% ', alignSelf: 'center' }} />
								</Form.Item>
							</Col>
							<Col xxl={2} xl={3} lg={3} md={3} sm={3} xs={3} style={{ alignSelf: 'start', paddingTop: '8px' }}>
								/
							</Col>
							<Col xs={9} style={{ flexDirection: 'row', padding: '0px' }}>
								<Form.Item
									name="cicloMenstruacion"
									// label="."
									style={{ height: '100% ' }}
								>
									<Input disabled={historiaAntecedentes | visualizar} type="number" onChange={handleChangeRC2} style={{ width: '90% ', alignSelf: 'center' }} />
								</Form.Item>
							</Col>
						</Row>
					</Input.Group>
				</Col>
				<Col xxl={6} xl={6} lg={14} md={24} sm={15} xs={24}>
					<Form.Item
						name="rs"
						label="RS"
						rules={[
							{
								required: false,
								message: 'Ingrese un rs válido',
							},
						]}
					>
						<Input disabled={historiaAntecedentes | visualizar} type="number" onChange={handleChangeRS} style={{ width: '100% ' }} />
					</Form.Item>
				</Col>
				<Col xxl={6} xl={6} lg={14} md={24} sm={15} xs={24}>
					<Form.Item
						name="fechaFur"
						label="FUR"
						rules={[
							{
								required: false,
								message: 'Ingrese un FUR válido',
							},
						]}
					>
						<DatePicker
							disabled={historiaAntecedentes | visualizar}
							placeholder="Ingrese la fecha"
							className="gx-mb-3 gx-w-100"
							onChange={handleChangeFUR}
							format={formatoFecha}
						/>
					</Form.Item>
				</Col>
				<Col xxl={6} xl={6} lg={14} md={24} sm={15} xs={24}>
					<Form.Item
						name="fechaFpp"
						label="FPP"
						rules={[
							{
								required: false,
								message: 'Ingrese un FPP válido',
							},
						]}
					>
						<DatePicker
							disabled={historiaAntecedentes | visualizar}
							placeholder="Ingrese la fecha"
							className="gx-mb-3 gx-w-100"
							onChange={handleChangeFPP}
							format={formatoFecha}
						/>
					</Form.Item>
				</Col>
				<Col xxl={6} xl={6} lg={12} md={24} sm={15} xs={24}>
					<Form.Item
						name="disminorrea"
						rules={[
							{
								required: false,
								message: 'Seleccione disminorrea',
							},
						]}
						valuePropName="checked"
					>
						<Checkbox
							disabled={historiaAntecedentes | visualizar}
							onChange={(e) => handleChangeDisminorrea(e)}
						// checked={antecedentes['ginecologicos'].disminorrea === 'S' ? true : false}
						>
							Disminorrea
						</Checkbox>
					</Form.Item>
				</Col>
				<Col xxl={6} xl={6} lg={14} md={24} sm={15} xs={24}>
					<Form.Item
						name="nroGestaciones"
						label="#Gestaciones"
						rules={[
							{
								required: false,
								message: 'Ingrese un número válido',
							},
						]}
					>
						<Input disabled={historiaAntecedentes | visualizar} type="number" onChange={handleChangeNroGestaciones} style={{ width: '100% ' }} />
					</Form.Item>
				</Col>
				<Col xxl={6} xl={6} lg={14} md={24} sm={15} xs={24}>
					<Form.Item
						name="fechaFup"
						label="FUP"
						rules={[
							{
								required: false,
								message: 'Ingrese un FUP válido',
							},
						]}
					>
						<DatePicker
							disabled={historiaAntecedentes | visualizar}
							placeholder="Ingrese la fecha"
							className="gx-mb-3 gx-w-100"
							onChange={handleChangeFUP}
							format={formatoFecha}
						/>
					</Form.Item>
				</Col>
				<Col xxl={8} xl={10} lg={14} md={24} sm={15} xs={24}>
					<Input.Group>
						Pariedad
						<Row style={{ flexDirection: 'row', padding: '8px 0 0 0' }}>
							<Col xs={6} style={{ flexDirection: 'row', padding: '0px' }}>
								<Form.Item name="p1" style={{ height: '100% ' }}>
									<Input disabled={historiaAntecedentes | visualizar} type="number" onChange={handleChangeP1} style={{ width: '90% ', alignSelf: 'center' }} />
								</Form.Item>
							</Col>
							<Col xs={6} style={{ flexDirection: 'row', padding: '0px' }}>
								<Form.Item name="p2" style={{ height: '100% ' }}>
									<Input disabled={historiaAntecedentes | visualizar} type="number" onChange={handleChangeP2} style={{ width: '90% ', alignSelf: 'center' }} />
								</Form.Item>
							</Col>
							<Col xs={6} style={{ flexDirection: 'row', padding: '0px' }}>
								<Form.Item name="p3" style={{ height: '100% ' }}>
									<Input disabled={historiaAntecedentes | visualizar} type="number" onChange={handleChangeP3} style={{ width: '90% ', alignSelf: 'center' }} />
								</Form.Item>
							</Col>
							<Col xs={6} style={{ flexDirection: 'row', padding: '0px' }}>
								<Form.Item name="p4" style={{ height: '100% ' }}>
									<Input disabled={historiaAntecedentes | visualizar} type="number" onChange={handleChangeP4} style={{ width: '90% ', alignSelf: 'center' }} />
								</Form.Item>
							</Col>
						</Row>
					</Input.Group>
				</Col>
				<Col xxl={6} xl={6} lg={14} md={24} sm={15} xs={24}>
					<Form.Item
						name="nroCesareas"
						label="#Cesáreas"
						rules={[
							{
								required: false,
								message: 'Ingrese un número válido',
							},
						]}
					>
						<Input disabled={historiaAntecedentes | visualizar} type="number" onChange={handleChangeNroCesareas} style={{ width: '100% ' }} />
					</Form.Item>
				</Col>
				<Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
					<Form.Item name="pap" label="PAP">
						<TextArea disabled={historiaAntecedentes | visualizar} type="text" cols="50" rows="4" onChange={handleChangePAP} />
					</Form.Item>
				</Col>
				<Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
					<Form.Item name="mamografia" label="Mamografía">
						<TextArea disabled={historiaAntecedentes | visualizar} type="text" cols="50" rows="4" onChange={handleChangeMamografia} />
					</Form.Item>
				</Col>
				<Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
					<Form.Item
						name="mac"
						label="MAC"
						rules={[
							{
								required: false,
								message: 'Ingrese un MAC válido',
							},
						]}
					>
						<Input disabled={historiaAntecedentes | visualizar} type="text" onChange={handleChangeMAC} />
					</Form.Item>
				</Col>
				<Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
					<Form.Item
						name="otros"
						label="Otros"
						rules={[
							{
								required: false,
								message: 'Ingrese un Otros válido',
							},
						]}
					>
						<Input disabled={historiaAntecedentes | visualizar} type="text" onChange={handleChangeOtros} />
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};

export default Ginecologicos;
