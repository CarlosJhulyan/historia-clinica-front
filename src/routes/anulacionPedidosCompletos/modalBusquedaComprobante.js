import React from 'react';
import { Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd';
import moment from 'moment';
import { openNotification } from '../../util/util';
import { httpClient } from '../../util/Api';

function ModalBusquedaComprobante({
	setLoadingData,
	dataSend,
	setDataSend,
	traerPedido,
	handleChangeText,
	loadingData,
	setAbrirModalManual,
	abrirModalManual,
	dataComprobantesPago,
}) {
	const { Option } = Select;

	const handleChangeTipoComp = e => {
		setDataSend({
			...dataSend,
			TIPO_COMP_PAGO: e,
		});
	};

	const handleChangeCalendar = (e = moment()) => {
		setDataSend({
			...dataSend,
			FECHA_FORMAT: e,
			FECHA: e ? moment(e._d).format('DD/MM/yyyy') : '',
		});
	};

	const traerCorrelativoMontoNeto = async () => {
		setLoadingData(true);
		const dataFormat = {
			cCodGrupoCia_in: '001',
			cCod_Local_in: '001',
			cTipo_Comp_in: dataSend.TIPO_COMP_PAGO,
			cMonto_Neto_in: dataSend.MONTO,
			cNum_Comp_Pago_in: dataSend.SERIE_COMP.toUpperCase() + dataSend.NUM_COMP,
		};

		try {
			const correlativo = await httpClient.post('posventa/getCorrelativoMontoNeto', dataFormat);
			if (correlativo.data.success) {
				const arrayData = correlativo.data.data.split(';');

				const verificaProdVirtuales = await httpClient.post('posventa/cajVerificaProdVirtuales', {
					cCodGrupoCia_in: '001',
					cCodLocal_in: '001',
					cNumPedVta_in: arrayData[0],
					// MONTO: data.MONTO.trim(),
				});
				//TODO: pendiente de endpoints
				// const verificaPedido = await httpClient.post('posventa/verificaPedido', {
				// 	cCodGrupoCia_in: '001',
				// 	cCodLocal_in: '001',
				// 	correlativo: arrayData[0],
				// 	monto: arrayData[1].trim(),
				// });
				// console.log(verificaPedido);
				// setDataSend({
				// 	...dataSend,
				// 	MONTO: arrayData[1].trim(),
				// 	FECHA: arrayData[2],
				// 	FECHA_FORMAT: moment(arrayData[2], 'DD/MM/yyyy'),
				// 	NUM_PEDIDO: arrayData[0],
				// });

				// if (verificaProdVirtuales.data.success) {
				// 	await traerPedido(arrayData[0]);
				// 	openNotification('Pedido', verificaProdVirtuales.data.message);
				// } else {
				// 	openNotification('Pedido', verificaProdVirtuales.data.message, 'Warning');
				// }
			} else {
				openNotification('Comprobante', correlativo.data.message, 'Warning');
			}
		} catch (error) {
			console.error(error);
		}
		setLoadingData(false);
	};

	const formItemLayout = {
		labelCol: {
			xs: { span: 24 },
			sm: { span: 7 },
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 17 },
		},
	};

	return (
		<Modal
			title="Consulta de Correlativo Comprobante"
			closable={false}
			okText="Aceptar"
			cancelText="Salir"
			centered
			onCancel={() => setAbrirModalManual(false)}
			onOk={() => traerCorrelativoMontoNeto()}
			okButtonProps={{
				loading: loadingData,
			}}
			cancelButtonProps={{
				disabled: loadingData,
			}}
			visible={abrirModalManual}
		>
			<Form {...formItemLayout}>
				<Form.Item label="Tipo Comprobante" name="tipo_comprobante">
					<Select onChange={handleChangeTipoComp} value={dataSend.TIPO_COMP_PAGO}>
						{dataComprobantesPago.map(item => (
							<Option key={item.key} value={item.value}>
								{item.descripcion}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					label="Nro. Comprobante"
					name="num_comprobante"
					// rules={[
					//   {
					//     required: true,
					//     message: 'Este campo es requerido',
					//   },
					// ]}
				>
					<Input.Group>
						<Row gutter={24}>
							<Col span={7}>
								<Input onChange={handleChangeText} name="SERIE_COMP" value={dataSend.SERIE_COMP} />
							</Col>
							<Col span={17}>
								<Input onChange={handleChangeText} name="NUM_COMP" value={dataSend.NUM_COMP} />
							</Col>
						</Row>
					</Input.Group>
				</Form.Item>
				<Form.Item
					label="Monto"
					name="monto"
					// rules={[
					//   {
					//     required: true,
					//     message: 'Este campo es requerido',
					//   },
					// ]}
				>
					<Input
						onChange={handleChangeText}
						value={dataSend.MONTO}
						type="number"
						name="MONTO"
						prefix="S/"
					/>
				</Form.Item>
				{/* <Form.Item
            label="Fecha"
            // rules={[
            //   {
            //     required: true,
            //     message: 'Este campo es requerido',
            //   },
            // ]}
          >
            <DatePicker
              onChange={handleChangeCalendar}
              name='FECHA_FORMAT'
              value={dataSend.FECHA_FORMAT}
              format='DD/MM/yyyy'
              placeholder='dd/mm/yyyy' 
              style={{ width: '100%' }} />
          </Form.Item> */}
			</Form>
		</Modal>
	);
}

export default ModalBusquedaComprobante;