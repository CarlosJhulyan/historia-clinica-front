import { Button, Col, Modal, Row } from 'antd';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { httpClient } from '../../../util/Api';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import Barcode from 'react-barcode';

import { openNotification } from '../../../util/util';
import { numberToLetter } from '../../../util/numberToletters';
import logoHeader from '../../../assets/posventa/logo-biensalud.jpg';

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

const ModalImpresionTermica = ({
                                 visible,
                                 setVisible,
                                 numPedVta,
                                 clienteCurrent,
                                 medicoCurrent,
                                 pacienteCurrent,
                                 user,
                                 dataDetalle
}) => {
  const [dataImprimir, setDataImprimir] = useState([]);
  // const [dataDetalle, setDataDetalle] = useState([]);
  const impresionRef = useRef();
  const [iniciando, setIniciando] = useState(true);
  const [codigo, setCodigo] = useState('');
  const handlePrint = useReactToPrint({
    content: () => impresionRef.current,
    pageStyle: pageStyle,
  });
  const dataInitFetch = {
    codGrupoCia: '001',
    codLocal: '001',
  };

  const impCompElect = async () => {
    try {
      const {
        data: { data, success, message },
      } = await httpClient.post('posventa/impCompReservaWS', {
        codGrupoCia: '001',
        codLocal: '001',
        numPedVta,
      });
      if (success) {
        return data;
      } else openNotification('Comprobante electrónico', message, 'Warning');
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
  console.log(dataDetalle);
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

  const imprimirDetalle = async (secCompPago) => {
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
    } catch (e) {
      console.error(e);
    }
  };

  const inicial = async () => {
    setIniciando(true);
    const idDocumento = await impCompElect();
    if (!idDocumento) {
      setIniciando(false);
      return;
    }
    const dataImp = await obtieneDocImprimirWs(idDocumento);
    setDataImprimir(dataImp);
    // const secComp = await obtieneNumCompPagoImpr();
    // const detalle = await imprimirDetalle(secComp);
    // setDataDetalle(detalle);
    setIniciando(false);
    await clearCacheImprimirWs(idDocumento);
  };

  useEffect(() => {
    inicial();
  }, []);

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

      setCodigo(respuesta[2].VALOR);
    }
  }, [dataImprimir]);

  const dia = pacienteCurrent.FEC_NAC_CLI.substring(0, 2);
  const mes = pacienteCurrent.FEC_NAC_CLI.substring(3, 5);
  const anio = pacienteCurrent.FEC_NAC_CLI.substring(6, 10);
  const fechaNacimiento = new Date(mes + '/' + dia + '/' + anio);

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
        <div style={{ width: '100%', textAlign: 'center', marginBottom: 10 }}>
          <img src={logoHeader} alt="lopotipo-biensalud" />
        </div>
        <div style={{ width: '100%', textAlign: 'center', fontSize: 20 }}>RESERVA</div>
        <br />
        <div>
          {dataImprimir && (
            <>
              <div>{dataImprimir.length > 0 ? dataImprimir[3].VALOR : ''} </div>
              <br/>
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
              <div>{dataImprimir.length > 0 ? dataImprimir[17].VALOR : ''} </div>
              <div>{dataImprimir.length > 0 ? dataImprimir[18].VALOR : ''} </div>
              <div>{dataImprimir.length > 0 ? dataImprimir[19].VALOR : ''} </div>
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
              {element.CODIGO}
            </Col>
            <Col xs={8} style={{ padding: 0 }}>
              {element.DESCRIPCION + ' ' + element.MARCA}
            </Col>
            <Col xs={3} style={{ padding: 0 }}>
              {element.cantidad}
            </Col>
            <Col xs={3} style={{ padding: 0 }}>
              {element.PRECIO_LISTA}
            </Col>
            <Col xs={3} style={{ padding: 0 }}>
              {element.PRECIO_VENTA_DSCTO}
            </Col>
            <Col xs={3} style={{ padding: 0, textAlign: 'end' }}>
              {element.total}
            </Col>
          </Row>
        ))}
        <div>-------------------------------------------------------</div>
        <div>IMPORTE TOTAL: S/ {Number(dataDetalle.reduce((prev, current) => prev + Number(current.total), 0)).toFixed(2)}</div>
        <div style={{fontSize:9}}>SON: {numberToLetter(Number(dataDetalle.reduce((prev, current) => prev + Number(current.total), 0)))}</div>
        <div>NOMBRE DE CLIENTE: {clienteCurrent.CLIENTE}</div>
        <div>DNI CLIENTE: {clienteCurrent.NUM_DOCUMENTO}</div>
        <div>DIRECCION: {clienteCurrent.DIRECCION}</div>
        <br/>
        <div>Por favor de acercarse a caja con esta impresión.</div>
        <div>Presentando el Documento de Identidad del paciente.</div>
        <div>Esta reserva con el dia sugerido esta sujeto a disponibilidad indicada por administración.</div>
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

export default ModalImpresionTermica;
