import { Button, Col, Modal, Row } from 'antd';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { httpClient } from '../../../util/Api';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import QRCode from 'react-qr-code';

import logoHeader from '../../../assets/posventa/biensalud-logo.png';
import { numberToLetter } from '../../../util/numberToletters';
import DecimalFormat from 'decimal-format';
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
	secCompPago,
	clienteCurrent,
}) => {
	const [dataImprimir, setDataImprimir] = useState([]);
	const [dataDetalle, setDataDetalle] = useState([]);
	const [dataMetodosPago, setDataMetodosPago] = useState([]);
	const impresionRef = useRef();
	const [iniciando, setIniciando] = useState(true);
	const handlePrint = useReactToPrint({
		content: () => impresionRef.current,
		pageStyle: pageStyle,
	});

	const df = new DecimalFormat('#,##0.00');

	const impCompElect = async (numOrden) => {
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
        numOrden
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

  const getnumOrdenVta = async () => {
    try {
      const {
        data: { success, message, data },
      } = await httpClient.post('posventa/getnumOrdenVta', {
        codGrupoCia: '001',
        codLocal: '001',
        numPedVta,
      });
      if (success) return data.NUM_ORDEN;
      console.log(message);
    } catch (e) {
      console.error(e);
    }
  };

	const inicial = async () => {
		setIniciando(true);
    const numOrden = await getnumOrdenVta();
		const idDocumento = await impCompElect(numOrden);
    if (!idDocumento) {
      setIniciando(false);
      return;
    }
		const dataImp = await obtieneDocImprimirWs(idDocumento);
		setDataImprimir(dataImp);
		// const detalle = await imprimirDetalle();
		// setDataDetalle(detalle);
		// const metodosPago = await getMetodosPago();
		// setDataMetodosPago(metodosPago);
		setIniciando(false);
		await clearCacheImprimirWs(idDocumento);
	};

	useEffect(() => {
		inicial();
	}, []);

	const [totalPagar, setTotalPagar] = useState('');
	const [opGrabada, setOpGrabada] = useState('');
	const [igv, setIgv] = useState('');
	const [importeTotal, setImporteTotal] = useState('');
	const [qr, setQr] = useState('');

	useEffect(() => {
		const posicion = 3;
		const hasta = 14;
		const dataTotales = [];
		let iii = 0;
		let ii = 0;

		dataImprimir.forEach(element => {
			if (element.VALOR === '---------------------------------------------------------------') {
				ii++;
			}
			if (ii >= posicion && iii <= hasta) {
				dataTotales.push(element.VALOR);
				iii++;
			}
		});

		if (dataTotales.length > 0) {
			setTotalPagar(dataTotales[1].split('S/')[1].trim());
			setOpGrabada(dataTotales[3].split('S/')[1].trim());
			setIgv(dataTotales[4].split('S/')[1].trim());
			setImporteTotal(dataTotales[5].split('S/')[1].trim());
			dataImprimir.forEach(element => {
				if (element.VALOR.split('|').length > 3) {
					setQr(element.VALOR.trim());
				}
			});
		}
		console.log('dataTotales', dataTotales);
	}, [dataImprimir]);

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
				style={{ display: 'flex', flexDirection: 'column', padding: 10, fontSize: 10 }}
			>
				{/* {imprimir} */}
				<div style={{ width: '100%', textAlign: 'center', marginBottom: 10 }}>
					<img src={logoHeader} alt="lopotipo-biensalud" />
				</div>
				<div style={{ width: '100%', textAlign: 'center' }}>
					CONSORCIO SALUD LIMA SUR - RUC: 20555875828
				</div>
				<div style={{ width: '100%', textAlign: 'center' }}>PR GRAL MIGUEL IGLESIAS NRO. 997</div>
				<div style={{ width: '100%', textAlign: 'center' }}>
					LIMA - LIMA - SAN JUAN DE MIRAFLORES
				</div>
				<div style={{ width: '100%', textAlign: 'center' }}>TELF.: 7178060</div>
				<div
					style={{
						width: '100%',
						textAlign: 'center',
						textDecoration: 'underline',
						fontWeight: 600,
					}}
				>
					001 - Humanidad SUR
				</div>
				<br />
        {dataImprimir && (
          <>
            <div>{dataImprimir.length > 0 ? dataImprimir[7].VALOR : ''} </div>
            <div>{dataImprimir.length > 0 ? dataImprimir[8].VALOR : ''} </div>
          </>
        )}
				<div>----------------------------------------------------------------</div>
				<Row style={{ width: '100%', margin: 0, textAlign: 'start', fontSize: 9 }}>
					<Col xs={4} style={{ padding: 0 }}>
						CODIGO
					</Col>
					<Col xs={6} style={{ padding: 0 }}>
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
					<Col xs={5} style={{ padding: 0, textAlign: 'end' }}>
						IMPORTE
					</Col>
				</Row>
				<div>----------------------------------------------------------------</div>
				{dataDetalle.map((element, index) => (
					<Row key={index} style={{ width: '100%', margin: 0, textAlign: 'start', fontSize: 9 }}>
						<Col xs={4} style={{ padding: 0 }}>
							{element.COD_PROD}
						</Col>
						<Col xs={6} style={{ padding: 0 }}>
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
						<Col xs={5} style={{ padding: 0, textAlign: 'end' }}>
							{element.SUBTOTAL}
						</Col>
					</Row>
				))}
				<div>----------------------------------------------------------------</div>
				<Row style={{ width: '100%', margin: 0, textAlign: 'end' }}>
					<Col xs={18} style={{ padding: 0 }}>
						TOTAL A PAGAR: S/
					</Col>
					<Col xs={6} style={{ padding: 0 }}>
						{totalPagar}
					</Col>
				</Row>
				<div>----------------------------------------------------------------</div>

				<Row style={{ width: '100%', margin: 0, textAlign: 'end' }}>
					<Col xs={18} style={{ padding: 0 }}>
						OP.GRAVADAS: S/
					</Col>
					<Col xs={6} style={{ padding: 0 }}>
						{opGrabada}
					</Col>
				</Row>
				<Row style={{ width: '100%', margin: 0, textAlign: 'end' }}>
					<Col xs={18} style={{ padding: 0 }}>
						IGV-18%: S/
					</Col>
					<Col xs={6} style={{ padding: 0 }}>
						{igv}
					</Col>
				</Row>
				<Row style={{ width: '100%', margin: 0, textAlign: 'end' }}>
					<Col xs={18} style={{ padding: 0 }}>
						IMPORTE TOTAL: S/
					</Col>
					<Col xs={6} style={{ padding: 0 }}>
						{importeTotal}
					</Col>
				</Row>
				<div>----------------------------------------------------------------</div>
				{dataMetodosPago.map(item => (
					<>
						<Row key={item.COD_FORMA_PAGO} style={{ width: '100%', margin: 0, textAlign: 'end' }}>
							<Col xs={18} style={{ padding: 0 }}>
								{item.DESC_FORMA_PAGO}
							</Col>
							<Col xs={6} style={{ padding: 0 }}>
								{item.IMP_PAGO}
							</Col>
						</Row>
					</>
				))}
				{/*<Row style={{ width: '100%', margin: 0, textAlign: 'end' }}>*/}
				{/*	<Col xs={18} style={{ padding: 0 }}>*/}
				{/*		EFECTIVO SOLES*/}
				{/*	</Col>*/}
				{/*	<Col xs={6} style={{ padding: 0 }}>*/}
				{/*		{efectivoSoles}*/}
				{/*	</Col>*/}
				{/*</Row>*/}
				<Row style={{ width: '100%', margin: 0, textAlign: 'end' }}>
					<Col xs={18} style={{ padding: 0 }}>
						VUELTO: S/
					</Col>
					<Col xs={6} style={{ padding: 0 }}>
						{df.format(
							Number(
								dataMetodosPago.reduce((prev, current) => {
									return Number(current.VUELTO.replace(',', '')) + prev;
								}, 0)
							)
						)}
					</Col>
				</Row>
				{/*<Row style={{ width: '100%', margin: 0, textAlign: 'end' }}>*/}
				{/*	<Col xs={18} style={{ padding: 0 }}>*/}
				{/*		VUELTO: S/*/}
				{/*	</Col>*/}
				{/*	<Col xs={6} style={{ padding: 0 }}>*/}
				{/*		{vuelto}*/}
				{/*	</Col>*/}
				{/*</Row>*/}
				<br />
				{/*<div>{dataImprimir.length > 0 ? texto : ''} </div>*/}
				<div>SON: {numberToLetter(Number(importeTotal))}</div>
				{/*<div>{dataImprimir.length > 0 ? nombreCliente : ''} </div>*/}
				{/*<div>{dataImprimir.length > 0 ? dni : ''} </div>*/}
				{/*<div>{dataImprimir.length > 0 ? direccion : ''} </div>*/}
				<div>NOMBRE DE CLIENTE: {clienteCurrent.CLIENTE}</div>
				<div>DNI CLIENTE: {clienteCurrent.NUM_DOCUMENTO}</div>
				<div>DIRECCION: {clienteCurrent.DIRECCION}</div>
				<br />
				<div style={{ width: '100%', textAlign: 'center' }}>
          {dataImprimir && (
            <>
              {dataImprimir.length > 0 ? <QRCode key={qr} value={qr} size={100} /> : ''}{' '}
            </>
          )}
				</div>
				<br />
				<div style={{ textAlign: 'justify' }}>
					Conserve su impresion de la BOLETA ELECTRONICA. No se aceptan devoluciones de dinero.
					Cambio de mercadería solo en esta permitido en las 48 horas siguientes a la compra.
					Indispensable presentar este documento.
				</div>
				<br />
				<div style={{ width: '100%', textAlign: 'center' }}>
          {dataImprimir && (
            <>
              {dataImprimir.length > 0 ? dataImprimir[dataImprimir.length - 1].VALOR : ''}{' '}
            </>
          )}
				</div>
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
