import { Button, Col, Modal, Row } from 'antd';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { httpClient } from '../../../util/Api';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import Barcode from 'react-barcode';

import { openNotification } from '../../../util/util';

const pageStyle = `
@page {

	margin: 2.5;
}

@media all {
	.pagebreak {
	display: none;
	}
}

@media print {
	.pagebreak {
	page-break-before: always;
	}
}
`;

const ModalTicket = ({
                       visible,
                       setVisible,
                       numPedVta,
                       numOrdenVta,
                       secCompPago,
                       clienteCurrent,
                       medicoCurrent,
                       pacienteCurrent,
                       user,
}) => {
	const [dataImprimir, setDataImprimir] = useState([]);
	const [dataDetalle, setDataDetalle] = useState([]);
	const impresionRef = useRef();
	const [iniciando, setIniciando] = useState(true);
	const [codigo, setCodigo] = useState('');
	const handlePrint = useReactToPrint({
		content: () => impresionRef.current,
		pageStyle: pageStyle,
	});

	//const df = new DecimalFormat('#,##0.00');

	const impCompElect = async numOrden => {
		try {
			const {
				data: { data, success, message },
			} = await httpClient.post('posventa/impCompElect', {
				codGrupoCia: '001',
				codLocal: '001',
				numPedVta,
				secCompPago,
				version: 'v1.0.0 GA20140514',
				reimpresion: 'N',
				valorAhorro: '',
				docTarjetaPtos: '',
				numOrden,
			});
			if (success) {
				return data;
			} else openNotification('Comprobante electrónico', message, 'Warning');
			console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const obtieneDocImprimirWs = async idDocumento => {
		try {
			const {
				data: { data, success, message },
			} = await httpClient.post('posventa/obtieneDocImprimirWs', {
				IdDocumento: idDocumento,
			});
			if (success) {
				return data;
			} else openNotification('Comprobante electronico', message, 'Warning');
			console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const clearCacheImprimirWs = async idDocumento => {
		try {
			const {
				data: { success, message },
			} = await httpClient.post('posventa/clearCacheImprimirWs', {
				IdDocumento: idDocumento,
			});
			if (success) {
			}
			console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const imprimirDetalle = async () => {
		try {
			const {
				data: { data, success, message },
			} = await httpClient.post('posventa/imprimirDetalle', {
				codGrupoCia: '001',
				codLocal: '001',
				numPedVta,
				secCompPago,
			});
			if (success) {
				return data;
			}
			console.log(message);
		} catch (e) {
			console.error(e);
		}
	};

	const inicial = async () => {
		setIniciando(true);
		// const numOrden = await getnumOrdenVta();
		const idDocumento = await impCompElect(numOrdenVta);
		if (!idDocumento) {
			setIniciando(false);
			return;
		}
		const dataImp = await obtieneDocImprimirWs(idDocumento);
		setDataImprimir(dataImp);
		const detalle = await imprimirDetalle();
		setDataDetalle(detalle);
		// const metodosPago = await getMetodosPago();
		// setDataMetodosPago(metodosPago);
		setIniciando(false);
		await clearCacheImprimirWs(idDocumento);
	};

	useEffect(() => {
		inicial();
	}, [numOrdenVta]);

	useEffect(() => {
		if (dataImprimir.length > 0) {
			const respuesta = [];
			let point = false;
			dataImprimir.forEach(element => {
				if (element.VALOR.split('Atendido por :')[1]) {
					point = true;
				}
				if (point) respuesta.push(element);
			});
			console.log('respuesta', respuesta);
			setCodigo(respuesta[2].VALOR);
		}
	}, [dataImprimir]);

	const dia = pacienteCurrent.FEC_NAC_CLI.substring(0, 2);
	const mes = pacienteCurrent.FEC_NAC_CLI.substring(3, 5);
	const anio = pacienteCurrent.FEC_NAC_CLI.substring(6, 10);
	const fechaNacimiento = new Date(mes + '/' + dia + '/' + anio);
	console.log(fechaNacimiento);
	const fechaActual = new Date();
	// restar años completos
	const edad = Math.floor((fechaActual - fechaNacimiento) / (1000 * 60 * 60 * 24 * 365));

	return (
		<Modal
			centered
			width={270}
			footer={false}
			visible={visible}
			title={`Ticket de atención`}
			className="modal-custom"
			onCancel={() => {}}
			closable={false}
		>
			<div
				ref={impresionRef}
				style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 10,
          fontSize: 10,
          lineHeight: 0.9
      }}
        className='font-ticket'
			>
				{/* {imprimir} */}
				{/* <div style={{ width: '100%', textAlign: 'center', marginBottom: 10 }}>
					<img src={logoHeader} alt="lopotipo-biensalud" />
				</div> */}
				<div style={{ width: '100%', textAlign: 'center', fontSize: 25 }}>ENTREGAR PARA SU ATENCIÓN</div>
				<br />
				<div>
					{dataImprimir && (
						<>
							<div style={{fontSize:22}}>{dataImprimir.length > 0 ? dataImprimir[4].VALOR : ''} </div>
							<div style={{fontSize:12}}>{dataImprimir.length > 0 ? dataImprimir[5].VALOR : ''} </div>
              <div>{dataImprimir.length > 0 ? dataImprimir[6].VALOR : ''} </div>
							<br />
							<div>{dataImprimir.length > 0 ? dataImprimir[7].VALOR : ''} </div>
              <div>{dataImprimir.length > 0 ? dataImprimir[8].VALOR : ''} </div>
							<br />
							<div>{dataImprimir.length > 0 ? dataImprimir[9].VALOR : ''} </div>
							<div>{dataImprimir.length > 0 ? dataImprimir[10].VALOR : ''} </div>
							<div>{dataImprimir.length > 0 ? dataImprimir[11].VALOR.substring(0,55) : ''} </div>
              <div>{dataImprimir.length > 0 && dataImprimir[12].VALOR.length < 55 ? dataImprimir[12].VALOR.substring(0,55) : ''} </div>
						</>
					)}
				</div>

				<div>-------------------------------------------------------</div>
				<Row style={{ width: '100%', margin: 0, textAlign: 'start', fontSize: 9 }}>
					<Col xs={4} style={{ padding: 0 }}>
						CODIGO
					</Col>
					<Col xs={8} style={{ padding: 0 }}>
						DESCRIPCION
					</Col>
					<Col xs={3} style={{ padding: 0 }}>
						CANT.
					</Col>
					<Col xs={3} style={{ padding: 0 }}>
						P.UNIT.
					</Col>
					<Col xs={3} style={{ padding: 0 }}>
						DSCTO.
					</Col>
					<Col xs={3} style={{ padding: 0, textAlign: 'end' }}>
						IMPORTE
					</Col>
				</Row>
				<div>-------------------------------------------------------</div>
				{dataDetalle.map((element, index) => (
					<Row key={index} style={{ width: '100%', margin: 0, textAlign: 'start', fontSize: 9 }}>
						<Col xs={4} style={{ padding: 0 }}>
							{element.COD_PROD}
						</Col>
						<Col xs={8} style={{ padding: 0 }}>
							{element.DESCRIPCION + ' ' + element.LAB}
						</Col>
						<Col xs={3} style={{ padding: 0 }}>
							{element.CANT}
						</Col>
						<Col xs={3} style={{ padding: 0 }}>
							{element.PREC_UNIT}
						</Col>
						<Col xs={3} style={{ padding: 0 }}>
							{element.DESCTO}
						</Col>
						<Col xs={3} style={{ padding: 0, textAlign: 'end' }}>
							{element.SUBTOTAL}
						</Col>
					</Row>
				))}
				<div>-------------------------------------------------------</div>
				<br />
				<div>NOMBRE DE CLIENTE: {clienteCurrent.CLIENTE}</div>
				<div>DNI CLIENTE: {clienteCurrent.NUM_DOCUMENTO}</div>
				<div>DIRECCION: {clienteCurrent.DIRECCION}</div>
				<br />
        <div style={{fontSize:12}}>--- DATOS DE MEDICO ---</div>
        <br />
        <div>{medicoCurrent.CMP + ' - ' + medicoCurrent.NOMBRE_COMPLETO}</div>
        <br />
        <div style={{fontSize:12}}>--- DATOS DE PACIENTE ---</div>
				<br />
        <div style={{fontSize:11}}>N° HC {pacienteCurrent.COD_PACIENTE}</div>
        <div style={{fontSize:11}}>DNI - {pacienteCurrent.NUM_DOCUMENTO}</div>
        <div style={{fontSize:11}}>
          {pacienteCurrent.NOMBRE} {pacienteCurrent.APE_PATERNO} {pacienteCurrent.APE_MATERNO}
        </div>
        <div style={{fontSize:11}}>FECHA NACIMIENTO : {pacienteCurrent.FEC_NAC_CLI}</div>
        <div>EDAD: {edad} años</div>
				<br />
				<div>-------------------------------------------------------</div>
				<div
					style={{ width: '100%', textAlign: 'center', marginBottom: 10, padding: 0, margin: 0 }}
				>
					ATENDIDO POR : {user.nom_usu.trim()}
				</div>
				<div>-------------------------------------------------------</div>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Barcode
            width={0.9}
            height={50}
            value={codigo}
            fontSize={10}
          />
        </div>
				{/*<div style={{ width: '100%', textAlign: 'center' }}>*{codigo}*</div>*/}
				<div>-------------------------------------------------------</div>
				<br />
				<div style={{ width: '100%', textAlign: 'center', marginBottom: 10 }}>
					Entregar esta orden a la técnica responsable de cada consultorio
				</div>
				<br />
				<div style={{ width: '100%', textAlign: 'center', marginBottom: 10 }}>
					OBS: Debido al COVID19, el aforo de HUMANIDAD SUR está siendo modificado. Espere con
					calma, pronto el doctor atenderá su consulta a detalle.
				</div>
				<br />
				<div>-------------------------------------------------------</div>
				<div style={{ width: '100%', textAlign: 'center', marginBottom: 10 }}>DATOS DE TRIAJE</div>
				<br />
				<Row style={{ width: '100%', margin: 0, textAlign: 'start', fontSize: 9 }}>
					<Col xs={12} style={{ padding: 0 }}>
						Temperatura:
					</Col>
					<Col xs={11} style={{ padding: 0, textAlign: 'end' }}>
						__________ C°
					</Col>
				</Row>
				<br />
				<br />
				<Row style={{ width: '100%', margin: 0, textAlign: 'start', fontSize: 9 }}>
					<Col xs={9} style={{ padding: 0 }}>
						Presión Arterial :
					</Col>
					<Col xs={14} style={{ padding: 0, textAlign: 'end' }}>
						__________ / _________ MMHG.
					</Col>
				</Row>
				<br />
				<br />
				<Row style={{ width: '100%', margin: 0, textAlign: 'start', fontSize: 9 }}>
					<Col xs={12} style={{ padding: 0 }}>
						Peso:
					</Col>
					<Col xs={11} style={{ padding: 0, textAlign: 'end' }}>
						__________ Kg.
					</Col>
				</Row>
				<br />
				<br />
				<Row style={{ width: '100%', margin: 0, textAlign: 'start', fontSize: 9 }}>
					<Col xs={12} style={{ padding: 0 }}>
						Saturación de Oxígeno:
					</Col>
					<Col xs={11} style={{ padding: 0, textAlign: 'end' }}>
						___________ %
					</Col>
				</Row>
				<br />
				<br />
				<Row style={{ width: '100%', margin: 0, textAlign: 'start', fontSize: 9 }}>
					<Col xs={12} style={{ padding: 0 }}>
						Frecuencia Cardiáca :
					</Col>
					<Col xs={11} style={{ padding: 0, textAlign: 'end' }}>
						___________ X°
					</Col>
				</Row>
				<div> </div>
				<br />
				<br />
			</div>
			<div style={{ margin: 10, display: 'flex', justifyContent: 'center' }}>
				<Button
					disabled={iniciando}
					type="primary"
					onClick={() => {
						setVisible(false);
						handlePrint();
					}}
				>
					Imprimir
				</Button>
			</div>
		</Modal>
	);
};

export default ModalTicket;
