import React, {
  useEffect,
  useState
} from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Spin
} from 'antd';
import CloseBox from '../../../assets/posventa/close-box.png';
import OpenBox from '../../../assets/posventa/open-box.png';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { httpClient } from '../../../util/Api';
import { useAuth } from '../../../authentication';
import { openNotification } from '../../../util/util';
import moment from 'moment';
import ModalLoading from '../../../util/modalLoading';

function MovimientosCajaReserva() {
  const { confirm } = Modal;
  const {
    authUser: { data: user },
  } = useAuth();
  const [infoComprobanteBoleta, setInfoComprobanteBoleta] = useState({});
  const [infoComprobanteFactura, setInfoComprobanteFactura] = useState({});
  const [visibleModalAperturaCierre, setVisibleModalAperturaCierre] = useState(false);
  const [numCaja, setNumCaja] = useState('');
  const [optionsBoleta, setOptionsBoleta] = useState([]);
  const [optionsFactura, setOptionsFactura] = useState([]);
  const [fechaApertura, setFechaApertura] = useState();
  const [turnoCaja, setTurnoCaja] = useState('');
  const [loadingDataInit, setLoadingDataInit] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingValid, setLoadingValid] = useState(false);
  const [diaVenta, setDiaVenta] = useState(moment().format('DD/MM/yyyy'));
  const { Option } = Select;

  const dataFetch = {
    codGrupoCia: '001',
    codLocal: '001',
  };
  const TIP_NUMERA_MOV_CAJA = '010';

  const handleCerrarCaja = async () => {
    setLoadingValid(true);
    setVisibleModalAperturaCierre(true);
    const validado = await validaOperacionCaja('MC');
    setLoadingValid(false);
    if (validado)
      confirm({
          icon: <ExclamationCircleOutlined />,
          content: '¿Está seguro que desea efectuar la operación? Esto puede tomar unos segundos.',
          onOk: async () => {
            setLoadingData(true);
            if (validado) {
              await obtenerValorComprobanteBoleta();
              await obtenerValorComprobanteFactura();
              const data = await obtenerMovApertura(numCaja);
              if (data) {
                const desbloqueado = await bloqueoCaja(data.secCaja);
                if (desbloqueado) {
                  await procesaDatosArqueo(data.secCaja, data.numCaja);
                }
              } else {
                setVisibleModalAperturaCierre(false);
                openNotification('Pos Venta', 'No hay datos', 'Warning');
              }
              setLoadingData(false);
            }
          },
          onCancel() {
            Modal.destroyAll();
            setVisibleModalAperturaCierre(false);
          },
          cancelText: 'Cancelar',
          okText: 'Continuar',
          centered: true,
        }
      );
    else {
      setVisibleModalAperturaCierre(false);
    }
  }

  const handleAbrirCaja = async () => {
    setLoadingValid(true);
    setVisibleModalAperturaCierre(true);
    const validado = await validaOperacionCaja('MA');
    setLoadingValid(false);
    if (validado)
      confirm({
          icon: <ExclamationCircleOutlined />,
          content: '¿Está seguro que desea efectuar la operación?',
          onOk: async () => {
            setLoadingData(true);
            if (validado) {
              await registraMovimientoApertura(numCaja);
            }
            setLoadingData(false);
          },
          onCancel() {
            Modal.destroyAll();
            setVisibleModalAperturaCierre(false);
          },
          cancelText: 'Cancelar',
          okText: 'Continuar',
          centered: true,
        }
      );
    else setVisibleModalAperturaCierre(false);
  }

  const validaOperacionCaja = async (tipOp) => {
    try {
      const { data: { success, message } } = await httpClient.post('posventa/validaOperacionCaja', {
        ...dataFetch,
        secUsu: user.sec_usu_local,
        tipOp
      });

      if (success) {
        openNotification('Pos Venta', message + '. Puede continuar...');
        return true;
      } else {
        openNotification('Pos Venta', message, 'Warning');
        return false;
      };
    } catch (e) {
      console.error('Error en la validacion de operacion caja', e);
    }
  }

  const obtenerValorComprobanteBoleta = async () => {
    try {
      const { data: { data, success } } = await httpClient.post('posventa/getValorCompBoleta', {
        ...dataFetch,
        serieLocalBoleta: optionsBoleta[0].NUM_SERIE
      })
      if (success) {
        setInfoComprobanteBoleta(data[0]);
      }
    } catch (e) {
      console.error('Error al obtener valor de comprobante de boleta', e);
    }
  }

  const obtenerBoletas = async () => {
    try {
      const { data: { data, success } } = await httpClient.post('posventa/getSeriesBoleta', dataFetch)
      if (success) {
        setOptionsBoleta(data);
      }
    } catch (e) {
      console.error('Error al obtener boletas', e);
    }
  }

  const obtenerValorComprobanteFactura = async () => {
    try {
      const { data: { data, success } } = await httpClient.post('posventa/getValorCompFactura', {
        ...dataFetch,
        serieLocalFactura: optionsFactura[0].NUM_SERIE
      })
      if (success) {
        setInfoComprobanteFactura(data[0]);
      }
    } catch (e) {
      console.error('Error al obtener valor de comprobante de factura', e);
    }
  }

  const obtenerFacturas = async () => {
    try {
      const { data: { data, success } } = await httpClient.post('posventa/getSeriesFactura', dataFetch)
      if (success) {
        setOptionsFactura(data);
      }
    } catch (e) {
      console.error('Error al obtener facturas', e);
    }
  }

  const obtenerNumeroCaja = async () => {
    try {
      const { data: { success, data: result } } = await httpClient.post('posventa/getCajaDispoUsuario', {
        ...dataFetch,
        secUsu: user.sec_usu_local
      });
      if (success) {
        setNumCaja(result);
        return result;
      };
    } catch (e) {
      console.error(e);
    }
  }

  const obtenerFechaAperturaCaja = async (numCaja) => {
    try {
      const { data: { success, data: result } } = await httpClient.post('posventa/getFechaApertura', {
        ...dataFetch,
        numCaja
      });
      if (success) setFechaApertura(result);
    } catch (e) {
      console.error('Error al traer la fecha de apertura', e);
    }
  }

  const obtenerTurnoActualCaja = async (numCaja) => {
    try {
      const { data: { success, data: result } } = await httpClient.post('posventa/getTurnoActualCaja', {
        ...dataFetch,
        numCaja
      });
      if (success) setTurnoCaja(result);
    } catch (e) {
      console.error('Error al traer la fecha de apertura', e);
    }
  }

  const obtenerMovApertura = async (numCaja) => {
    try {
      const { data: { data, success: successMov } } = await httpClient.post('posventa/getMovApertura', {
        ...dataFetch,
        numCaja
      });
      if (successMov) {
        return {
          numCaja,
          secCaja: data
        }
      } else return null;
    } catch (e) {
      console.error('Error al obtener movimientos apertura', e);
    }
  }

  const bloqueoCaja = async (secCaja) => {
    try {
      const { data: { success } } = await httpClient.post('posventa/setBloqueoCaja', {
        ...dataFetch,
        secCaja
      });
      return success;
    } catch (e) {
      console.error('Error al bloquear caja', e);
    }
  }

  const procesaDatosArqueo = async (secCaja, numCaja) => {
    try {
      const { data: { success, message, data } } = await httpClient.post('posventa/procesarDatosArqueo', {
        ...dataFetch,
        secCaja,
        tipOp: 'MC',
        tipMov: 'C',
        numCaja,
        secUsu: user.sec_usu_local,
        idUsu: user.login_usu,
      });

      if (success) {
        await registrarTransaccionNumera('Cierre Caja');
      }
      setVisibleModalAperturaCierre(false);
      Modal.destroyAll();
    } catch (e) {
      console.error('Error al procesar datos arqueo', e);
    }
  }

  const registraMovimientoApertura = async (numCaja) => {
    try {
      const { data: { success, message } } = await httpClient.post('posventa/setRegistraMovimientoAper', {
        ...dataFetch,
        numCaja,
        secUsu: user.sec_usu_local,
        codUsu: user.login_usu,
      });

      if (success) {
        await registrarTransaccionNumera(message, 'Apertura Caja');
      }
      setVisibleModalAperturaCierre(false);
      Modal.destroyAll();
    } catch (e) {
      console.error('Error al procesar datos arqueo', e);
    }
  }

  const registrarTransaccionNumera = async (message, titulo) => {
    try {
      const { data: { success } } = await httpClient.post('posventa/updateNumera', {
        ...dataFetch,
        idUsu: user.login_usu,
        codNumera: TIP_NUMERA_MOV_CAJA,
      });

      if (success) {
        await httpClient.post('posventa/aceptarTransaccion', {});
        openNotification(titulo, message);
      } else {
        openNotification(titulo, message, 'Warning');
      }
    } catch (e) {
      console.error('Error al procesar los datos para aceptar la transaccion', e);
    }
  }

  const prefixSelectorBoleta = (
    <Form.Item noStyle>
      <Select style={{ width: 140 }} value={'901'} disabled>
        {optionsBoleta.map(item => (
          <Option key={item.NUM_SERIE.trim()} value={item.NUM_SERIE.trim()}>{item.NUM_SERIE}</Option>
        ))}
      </Select>
    </Form.Item>
  );

  const prefixSelectorFactura = (
    <Form.Item noStyle>
      <Select style={{ width: 140 }} disabled value={'903'}>
        {optionsFactura.map(item => (
          <Option key={item.NUM_SERIE.trim()} value={item.NUM_SERIE.trim()}>{item.NUM_SERIE}</Option>
        ))}
      </Select>
    </Form.Item>
  );

  useEffect(() => {
    const chargeData = async () => {
      setLoadingDataInit(true);
      const numCaja = await obtenerNumeroCaja();
      await obtenerFacturas();
      await obtenerBoletas();
      await obtenerFechaAperturaCaja(numCaja);
      await obtenerTurnoActualCaja(numCaja);
      setLoadingDataInit(false);
    }
    chargeData();
  }, []);

  return (
    <>
      <Card title={
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '280px auto 100px',
            gridTemplateRows: '1fr',
            gridColumnGap: '0px',
            gridRowGap: '0px',
            overflowX: 'auto'
          }}
        >
          <div style={{
            gridArea: '1 / 1 / 2 / 2',
            fontSize: '22px',
            marginTop: '15px'
          }}>
            Movimientos de Caja
          </div>
          <div
            style={{
              gridArea: '1 / 2 / 2 / 3',
              display: 'flex',
              flexDirection: 'row-reverse',
            }}
          >
          </div>
        </div>
      }>
        <Row justify='center'>
          <Col xl={5} lg={6} md={7} sm={7} xs={8} style={{ textAlign: 'center' }}>
            <Button
              onClick={handleAbrirCaja}
              loading={loadingDataInit}
              style={{
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Image
                src={OpenBox}
                preview={false}
              />
              Aperturar Caja
            </Button>
          </Col>
          <Col xl={5} lg={6} md={7} sm={7} xs={8} style={{ textAlign: 'center' }}>
            <Button
              loading={loadingDataInit}
              onClick={handleCerrarCaja}
              style={{
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Image
                src={CloseBox}
                preview={false}
              />
              Cerrar Caja
            </Button>
          </Col>
        </Row>
      </Card>
      <Modal
        visible={visibleModalAperturaCierre}
        title='Apertura/Cierre'
        footer={false}
        centered
        // onCancel={() => setVisibleModalAperturaCierre(false)}
      >
        <Form
          name="data-apertura-cierre"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 15 }}
          autoComplete="off"
        >
          <Form.Item
            label="Usuario"
          >
            <Input value={user?.login_usu} disabled />
          </Form.Item>
          <Row justify='end'>
            <Col span={9}>
              <Form.Item
                label="Caja"
              >
                <Input value={numCaja} disabled />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label="Turno"
              >
                <Input value={turnoCaja} disabled />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Fecha de apertura"
          >
            <Input value={fechaApertura} disabled />
          </Form.Item>
          <Form.Item
            label="Dia de venta"
          >
            <Input value={diaVenta} disabled />
          </Form.Item>

          <Form.Item
            label="Boleta"
          >
            <Input disabled addonBefore={prefixSelectorBoleta} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Factura"
          >
            <Input disabled addonBefore={prefixSelectorFactura} style={{ width: '100%' }} />
          </Form.Item>
          {loadingValid && <Spin style={{
            position: 'absolute',
            top: '0',
            right: '-16px',
            borderRadius: '5px',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.18)'
          }} />}
        </Form>
      </Modal>
      {loadingData ? <ModalLoading></ModalLoading> : null}
    </>
  );
}

export default MovimientosCajaReserva;
