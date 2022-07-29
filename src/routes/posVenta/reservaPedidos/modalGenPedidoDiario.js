import React, { useState } from 'react';
import { Button, Card, Col, Descriptions, Modal, Row } from 'antd';
import ModalImpresionTermica from './modalImpresionTermica';
import { baseUrl, baseUrlImage } from '../../../config/backend';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { httpClient } from '../../../util/Api';
import ModalLoading from '../../../util/modalLoading';
import moment from 'moment';
import { numberToLetter } from '../../../util/numberToletters';

const ModalGenPedidoDiario = ({
                                visible,
                                dataFetchCabecera,
                                clearDataFinally,
                                clienteCurrent,
                                medicoCurrent,
                                pacienteCurrent,
                                user,
                                tipoVenta,
}) => {
  const [visibleImprimirComprobante, setVisibleImprimirComprobante] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const { confirm } = Modal;
  const modifyPdf = async (url, detalles) => {
    const nombre = url.split('/');
    const existingPdfBytes = await fetch(
      baseUrl + '/posventa/downloadComprobante?nombreArchivo=' + nombre[nombre.length - 1]
    ).then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 8;

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    // const { width, height } = firstPage.getSize();
    let inicio = 550;

    detalles.forEach((item, index) => {
      let tam = 15;

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
    const data = new FormData();

    data.append('nombreComprobante', nombre[nombre.length - 1]);
    data.append('pdf', blob);

    await httpClient.post('/posventa/subirComprobante', data);
    window.open(url, '_blank');
  }

  const generarComprobante = async () => {
    setLoadingData(true);
    const response = await httpClient.post('/posventa/generarReporteReserva', {
      codGrupoCia: '001',
      codLocal: '001',
      rucCliente: dataFetchCabecera.cRucCliPedVta_in,
      fechaDocumento: moment().format('yyyy-MM-DD'),
      montoExonerado: '0',
      montoTotal: Number(dataFetchCabecera.nValNetoPedVta_in).toFixed(2),
      montoIgv: dataFetchCabecera.nValIgvPedVta_in,
      montoGratuito: '0',
      montoInafecto: '0',
      numDocCliente: dataFetchCabecera.cNumPedVta_in,
      razonCliente: dataFetchCabecera.cNomCliPedVta_in,
      montoTotalLetras: numberToLetter(Number(dataFetchCabecera.nValNetoPedVta_in)),
      montoGravado: (Number(dataFetchCabecera.nValNetoPedVta_in)-Number(dataFetchCabecera.nValIgvPedVta_in)).toFixed(2),
      tipComprobante: '01',
      dirClient: dataFetchCabecera.cDirCliPedVta_in,
      fechaEmi: moment().format('yyyy-MM-DD'),
      monPagoDoc: 'Soles',
      nombreMedico: dataFetchCabecera.cNombreMedico,
      cmpMedico: dataFetchCabecera.cNumCmp,
      fechaReserva: moment(dataFetchCabecera.cfecha_reserva, 'DD/MM/yyyy').format('yyyy-MM-DD'),
      horaReserva: moment(dataFetchCabecera.chora_reserva, 'HH:mm').format('hh:mm a'),
    });

    const {
      data: { data: dataDetalles }
    } = await httpClient.post('posventa/getListaDetalles', {
      codGrupoCia: '001',
      codLocal: '001',
      numPedido: dataFetchCabecera.cNumPedVta_in,
    });

    const detalles = dataDetalles.map((item, index) => {
      return {
        0: String(index + 1),
        1: String(Number(item.CANTIDAD).toFixed(3)),
        2: item.UNIDAD,
        3: item.DESCRIPCION,
        4: item.PRECIO_UNI,
        5: item.TOTAL,
      };
    });

    await modifyPdf(baseUrlImage + '/documentos/' + response.data.data, detalles);
    setLoadingData(false);
  };

  return (
    <>
      <Modal
        closable={false}
        centered
        visible={visible}
        title='Generación de pedido diario'
        footer={[
          <Button
            onClick={() => confirm({
              content: 'Asegurese de haber impreso sus documentos',
              okText: 'Continuar',
              cancelText: 'Atrás',
              onOk: () => clearDataFinally(),
              centered: true
            })}
          >
            Aceptar
          </Button>,
          <Button
            onClick={() => setVisibleImprimirComprobante(true)}
          >
            Imprimir Térmica
          </Button>,
          <Button onClick={generarComprobante}>
            Generar PDF
          </Button>
        ]}
      >
        <Row>
          <Col span={16}>
            <Descriptions title="RESERVA" size='middle'>
              <Descriptions.Item label="Nro Reserva" span={3}>
                <span style={{color:'red'}}>{dataFetchCabecera.cNumPedVta_in}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Fecha" span={2}>
                {dataFetchCabecera.cfecha_reserva}
              </Descriptions.Item>
              <Descriptions.Item label="Hora" span={1}>
                {dataFetchCabecera.chora_reserva}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={3}>
                {dataFetchCabecera.cemail_reserva}
              </Descriptions.Item>
              <Descriptions.Item label="Celular" span={3}>
                {dataFetchCabecera.ccelular_reserva}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={8}>
            <Descriptions size='middle' layout='vertical'>
              <Descriptions.Item label='Monto Venta' span={3}>
                <span style={{color:'red', fontSize:20}}>S/. {Number(dataFetchCabecera.nValNetoPedVta_in).toFixed(2)}</span>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Card size='small' style={{margin:0, minHeight:70}}>
          {dataFetchCabecera.cobs_reserva}
        </Card>
      </Modal>

      {visibleImprimirComprobante && (
        <ModalImpresionTermica
          visible={visibleImprimirComprobante}
          setVisible={setVisibleImprimirComprobante}
          clienteCurrent={clienteCurrent}
          medicoCurrent={medicoCurrent}
          pacienteCurrent={pacienteCurrent}
          numPedVta={dataFetchCabecera.cNumPedVta_in}
          user={user}
          secCompPago={dataFetchCabecera.nSecCompPago_in}
          tipoVenta={tipoVenta}
        />
      )}

      {loadingData && <ModalLoading/>}
    </>
  );
}

export default ModalGenPedidoDiario;
