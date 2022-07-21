import { Button, Col, Modal, Row } from 'antd';
import { useRef, useState } from 'react';
import { useEffect } from 'react';

import ReactToPrint, { useReactToPrint } from 'react-to-print';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'react-qr-code';

import logoHeader from '../../assets/posventa/biensalud-logo.png';
import DecimalFormat from 'decimal-format';
import { numberToLetter } from '../../util/numberToletters';
import { httpClient } from '../../util/Api';
import { baseUrl, baseUrlImage } from '../../config/backend';
import ModalLoading from '../../util/modalLoading';

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

const ModalComprobante = ({
	visible,
	setVisible,
	dataImprimir,
	dataDetalle,
	dataCabecera,
	newDocumento,
}) => {
	const [visibleModalComprobante, setVisibleModalComprobante] = useState(false);
	const [loadingData, setLoadingData] = useState(false);

	const generarComprobante = async () => {
		setLoadingData(true);
		const response = await httpClient.post('/posventa/generaReporteNotaCredito', {
			codGrupoCia: '001',
			codLocal: '001',
			numPedVta: newDocumento,
		});

		const detalles = await httpClient.post('/posventa/impDetalleNota', {
			codGrupoCia: '001',
			codLocal: '001',
			numPedVta: newDocumento,
		});

		console.log(response.data.data);
		await modifyPdf(baseUrlImage + '/documentos/notas/' + response.data.data, detalles.data.data);
		setLoadingData(false);
	};

	async function modifyPdf(url, detalles) {
		const nombre = url.split('/');
		console.log(nombre);
		const existingPdfBytes = await fetch(
			baseUrl + '/posventa/downloadComprobanteNota?nombreArchivo=' + nombre[nombre.length - 1]
		).then(res => res.arrayBuffer());

		const pdfDoc = await PDFDocument.load(existingPdfBytes);
		const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
		const fontSize = 8;

		const pages = pdfDoc.getPages();
		const firstPage = pages[0];
		// const { width, height } = firstPage.getSize();
		let inicio = 570;
		detalles.forEach((item, index) => {
			let tam = 15;

			console.log('item', item);
			if (item[3].length > 49) {
				tam = 25;
			}

			const text = item[0];
			const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
			const text1 = item[1];
			const textWidth1 = helveticaFont.widthOfTextAtSize(text, fontSize);
			const text2 = item[2];
			const textWidth2 = helveticaFont.widthOfTextAtSize(text, fontSize);
			const text3 = item[3];
			const textWidth3 = helveticaFont.widthOfTextAtSize(text, fontSize);
			const text4 = item[4];
			const textWidth4 = helveticaFont.widthOfTextAtSize(text, fontSize);
			const text5 = item[5];
			const textWidth5 = helveticaFont.widthOfTextAtSize(text, fontSize);

			firstPage.drawText(text, {
				x: 25 + 19 - textWidth,
				y: inicio,
				size: fontSize,
				font: helveticaFont,
				color: rgb(0, 0, 0),
				maxWidth: 19,
				lineHeight: 10,
			});

			firstPage.drawText(text1, {
				x: 70 + 19 - textWidth1,
				y: inicio,
				size: fontSize,
				font: helveticaFont,
				color: rgb(0, 0, 0),
				maxWidth: 19,
				lineHeight: 10,
			});

			firstPage.drawText(text2, {
				x: 125 + 19 - textWidth2,
				y: inicio,
				size: fontSize,
				font: helveticaFont,
				color: rgb(0, 0, 0),
				maxWidth: 19,
				lineHeight: 10,
			});

			firstPage.drawText(text3, {
				x: 190,
				y: inicio,
				size: fontSize,
				font: helveticaFont,
				color: rgb(0, 0, 0),
				maxWidth: 220,
				lineHeight: 10,
			});

			firstPage.drawText(text4, {
				x: 460 + 19 - textWidth4,
				y: inicio,
				size: fontSize,
				font: helveticaFont,
				color: rgb(0, 0, 0),
				maxWidth: 19,
				lineHeight: 10,
			});

			firstPage.drawText(text5, {
				x: 512 + 19 - textWidth5,
				y: inicio,
				size: fontSize,
				font: helveticaFont,
				color: rgb(0, 0, 0),
				maxWidth: 19,
				lineHeight: 10,
			});

			inicio = inicio - tam;
		});

		const pdfBytes = await pdfDoc.save();
		const blob = new Blob([pdfBytes], { type: 'application/pdf' });

		// DESCARGAR EL PDF
		// const u = URL.createObjectURL(blob);
		// const link = document.createElement('a');
		// link.href = u;
		// link.download = 'test.pdf';
		// link.click();

		const data = new FormData();

		data.append('nombreComprobante', nombre[nombre.length - 1]);
		data.append('pdf', blob);

		await httpClient.post('/posventa/subirComprobanteNota', data);

		window.open(url, '_blank');
	}

	return (
		<>
			<Modal
				centered
				closable={false}
				visible={visible}
				title="Comprobantes"
				onCancel={() => {
					setVisible(false);
				}}
				footer={[<Button onClick={() => setVisible(false)}>Salir</Button>]}
			>
				<Row justify="space-between">
					<Col span={12}>
						<Button
							onClick={() => {
								generarComprobante();
							}}
							block
						>
							Formato A4
						</Button>
					</Col>
					<Col span={12}>
						<Button
							onClick={() => {
								setVisibleModalComprobante(true);
							}}
							block
						>
							Formato Ticket
						</Button>
					</Col>
				</Row>
				{loadingData ? <ModalLoading></ModalLoading> : null}
			</Modal>
			{visibleModalComprobante && (
				<Modalticket
					visible={visibleModalComprobante}
					setVisible={setVisibleModalComprobante}
					dataImprimir={dataImprimir}
					dataDetalle={dataDetalle}
					dataCabecera={dataCabecera}
				></Modalticket>
			)}
		</>
	);
};

const Modalticket = ({ visible, setVisible, dataImprimir, dataDetalle, dataCabecera }) => {
	const impresionRef = useRef();

	const handlePrint = useReactToPrint({
		content: () => impresionRef.current,
		pageStyle: pageStyle,
	});

	const df = new DecimalFormat('#,##0.00');

	useEffect(() => {}, []);

	const [totalPagar, setTotalPagar] = useState('');
	const [opGrabada, setOpGrabada] = useState('');
	const [igv, setIgv] = useState('');
	const [importeTotal, setImporteTotal] = useState('');
	const [qr, setQr] = useState('');

	useEffect(() => {
		console.log('dataImprimir', dataImprimir);
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
			title={'Nota de credito'}
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
						<div>{dataImprimir.length > 0 ? dataImprimir[9].VALOR : ''} </div>
						<div>{dataImprimir.length > 0 ? dataImprimir[10].VALOR : ''} </div>
						<div>{dataImprimir.length > 0 ? dataImprimir[11].VALOR : ''} </div>
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
				<div>SON: {numberToLetter(Number(importeTotal))}</div>
				<div>NOMBRE DE CLIENTE: {dataCabecera[0].CLIENTE}</div>
				<div>DNI CLIENTE: {dataCabecera[0].RUC}</div>
				{/* <div>DIRECCION: {'clienteCurrent.DIRECCION'}</div> */}
				<br />
				<div style={{ width: '100%', textAlign: 'center' }}>
					{dataImprimir && (
						<>{dataImprimir.length > 0 ? <QRCode key={qr} value={qr} size={100} /> : ''} </>
					)}
				</div>
				<br />
				<div style={{ textAlign: 'justify' }}>
					Conserve su impresion de la NOTA DE CREDITO ELECTRONICA. No se aceptan devoluciones de
					dinero. Cambio de mercadería solo en esta permitido en las 48 horas siguientes a la
					compra. Indispensable presentar este documento.
				</div>
				<br />
				<div>----------------------------------------------------------------</div>
				<div style={{ width: '100%', textAlign: 'center' }}>
					{dataImprimir && (
						<>{dataImprimir.length > 0 ? dataImprimir[dataImprimir.length - 11].VALOR : ''} </>
					)}
				</div>
				<div>----------------------------------------------------------------</div>
				<div style={{ width: '100%', textAlign: 'center' }}>DATOS DEL CLIENTE</div>
				<br />
				<div>NOMBRE: ____________________________________________</div>
				<br />
				<div>DNI: ____________________________________________</div>
				<br />
				<br />
				<br />
				<div>FIRMA: ____________________________________________</div>
			</div>
			<div style={{ margin: 10, display: 'flex', justifyContent: 'center' }}>
				<Button
					// disabled={iniciando}
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

export default ModalComprobante;
