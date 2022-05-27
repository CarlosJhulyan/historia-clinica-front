import React, {
  useEffect,
  useState
} from 'react';
import { 
  Card,
  Button,
  Table,
  // Popconfirm,
  Spin,
} from 'antd';

import { openNotification } from '../../util/util';
import { httpClient } from '../../util/Api';

import ModalListaEspera from './modalListaEspera';
import ModalAtencionMedica from './modalAtencionMedica';
import ModalBusquedaPedido from './modalBusquedaPedido';
import ModalBusquedaComprobante from './modalBusquedaComprobante';
import ModalBusquedaOrden from './modalBusquedaOrden';

function AdmisionConsulta() {  
  const [abrirModalManual, setAbrirModalManual] = useState(false);
  const [abrirModalOrden, setAbrirModalOrden] = useState(false);
  const [abrirModalPedido, setAbrirModalPedido] = useState(false);
  const [abrirModalConsulta, setAbrirModalConsulta] = useState(false);
  const [abrirModalListaEspera, setAbrirModalListaEspera] = useState(false);

  const [dataCabecera, setDataCabecera] = useState([{}]);
  const [dataDetalles, setDataDetalles] = useState([{}]);
  const [dataComprobantesPago, setDataComprobantesPago] = useState([]);
  const [dataEspecialidades, setDataEspecialidades] = useState([]);
  const [dataConsultorios, setDataConsultorios] = useState(['1']);
  
  const [pedidoFound, setPedidoFound] = useState(false);
  // const [consultaConfirmada, setConsultaConfirmada] = useState(true);

  const [loadingData, setLoadingData] = useState(false);
  const [loadingDataConsultorio, setLoadingDataConsultorio] = useState(false);
  // const [loadingConfirmar, setLoadingConfirmar] = useState(false);

  const [dataSend, setDataSend] = useState({
    NUM_PEDIDO: '',
    NUM_ORDEN: '',
    TIPO_COMP_PAGO: '01',
    NUM_COMP: '',
    SERIE_COMP: '',
    NUM_COMPROBANTE: '',
    FECHA: '',
    FECHA_FORMAT: null,
    MONTO: '',
    COD_ESPECIALIDAD: '1',
    COD_BUS: '1',
    COD_MEDICO: '',
    NOM_MEDICO: '',
    USU_CREA: JSON.parse(localStorage.getItem('token')).usuario,
    ESTADO: 'T'
  });

  const [modulos, setModulos] = useState([]);

  const handleChangeText = e => {
    setDataSend({
      ...dataSend,
      [e.target.name]: e.target.value
    });
  }

  const cabeceraColumn = [
    {
      title: 'Pedido',
      dataIndex: 'key'
    },
    {
      title: 'Fecha',
      dataIndex: 'FECHA'
    },
    {
      title: 'Total S/',
      dataIndex: 'MONTO'
    },
    {
      title: 'Documento',
      dataIndex: 'NUM_DOCUMENTO'
    },
    {
      title: 'Paciente',
      dataIndex: 'PACIENTE'
    },
    {
      title: 'Cajero',
      dataIndex: 'CAJERO'
    },
    {
      title: 'Fecha Recepción',
      dataIndex: 'FEC_PENDIENTE',
      key: 'FEC_PENDIENTE',
      render: (fecha) => (
        <span>{fecha?.trim().length === 0 ? '-' : fecha}</span>
      )
    },
    {
      title: 'Fecha Env. Consu.',
      dataIndex: 'FEC_ENVIO_CONSULTA',
      key: 'FEC_ENVIO_CONSULTA',
      render: (fecha) => (
        <span>{fecha?.trim().length === 0 ? '-' : fecha}</span>
      )
    },
    {
      title: 'Fecha Ini. Consu.',
      dataIndex: 'FEC_INI_CONSULTA',
      key: 'FEC_INI_CONSULTA',
      render: (fecha) => (
        <span>{fecha?.trim().length === 0 ? '-' : fecha}</span>
      )
    },
    {
      title: 'Fecha Fin. Consu.',
      dataIndex: 'FEC_FIN_CONSULTA',
      key: 'FEC_FIN_CONSULTA',
      render: (fecha) => (
        <span>{fecha?.trim().length === 0 ? '-' : fecha}</span>
      )
    },
  ];

  const detallesColumn = [
    {
      title: 'Código',
      dataIndex: 'key'
    },
    {
      title: 'Descripción',
      dataIndex: 'DESCRIPCION'
    },
    {
      title: 'Unidad',
      dataIndex: 'UNIDAD'
    },
    {
      title: 'Pre. Vta.',
      dataIndex: 'PRE_VTA'
    },
    {
      title: 'Cantidad',
      dataIndex: 'CANTIDAD'
    },
    {
      title: 'Total',
      dataIndex: 'TOTAL'
    },
    {
      title: 'Especialidad',
      dataIndex: 'ESPECIALIDAD'
    },
  ];

  const traerPedido = async (numPedido) => {
    setLoadingData(true);
    try {
      const responseCabecera = await httpClient.post('pedido/getPedidoCabecera', { NUM_PEDIDO: numPedido || dataSend.NUM_PEDIDO });
      const responseDetalles = await httpClient.post('pedido/getPedidoDetalles', { NUM_PEDIDO: numPedido || dataSend.NUM_PEDIDO });
      if (!responseCabecera.data.success || !responseDetalles.data.success) {
        openNotification('Pedido', responseCabecera.data.message, 'Warning');
        setDataCabecera([{}]);
        setDataDetalles([{}]);
        setPedidoFound(false);
      } else {
        setDataCabecera(responseCabecera.data.data);
        setDataDetalles(responseDetalles.data.data);
        setDataSend({ ...dataSend, COD_PACIENTE: responseCabecera.data.data[0].COD_PACIENTE });
        setAbrirModalPedido(false);
        setPedidoFound(true);
      }
    } catch (error) {
      openNotification('Pedido', 'Error en la petición', 'Alerta');
      setPedidoFound(false);
    }
    setLoadingData(false);
  }

  const traerComprobantesPago = async () => {
    try {
      const { data: { data = [] } } = await httpClient.post('comprobante/getComprobantesPago');
      setDataComprobantesPago(data);
    } catch (error) {
      console.error(error);
    }
  }

  const traerConsultorios = async (id = '1') => {
    setLoadingDataConsultorio(true);
    try {
      const { data: { data = [], success } } = await httpClient.post('atencionMedica/getConsultorios', { COD_ESPECIALIDAD: id });
      if (success) {
        setDataConsultorios(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoadingDataConsultorio(false);
  }

  const traerEspecialidades = async () => {
    try {
      const { data: { data = [], success } } = await httpClient.post('atencionMedica/getEspecialidades');
      if (success) {
        setDataEspecialidades(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const getModulosConsultaMedica = async () => {
    try {
      const { data: { data = [], success } } = await httpClient.post('atencionMedica/getTipoConsultaModulos');
      if (success) {
        setModulos(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await traerComprobantesPago();
      await traerEspecialidades();
      await traerConsultorios();
      await getModulosConsultaMedica();
    }
    fetchData();
  }, [])

  return (
    <div>
      <Card
        title={
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '250px auto',
              gridTemplateRows: '1fr',
              gridColumnGap: '0px',
              gridRowGap: '0px'
            }}
          >
            <div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px', paddingTop: '20px' }}>Admisión Consulta</div>
            <div
              style={{
                gridArea: '1 / 2 / 2 / 3',
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '15px',
                justifyContent: 'flex-end',
                flexWrap: 'wrap'
              }}
            >
              {
                modulos.length ? (
                  <>
                    {
                      modulos[1].llave_tab_gral === 'S' &&
                        <Button
                          onClick={() => setAbrirModalPedido(true)}
                          type='primary'>
                            Buscar pedido
                        </Button>
                    }
                    {
                      modulos[2].llave_tab_gral === 'S' &&
                        <Button
                          onClick={() => setAbrirModalOrden(true)}
                          type='primary'>
                            Buscar orden
                        </Button>
                    }
                    {
                      modulos[0].llave_tab_gral === 'S' &&
                        <Button
                          onClick={() => setAbrirModalManual(true)}
                          type='default'>
                            Buscar comprobante manual.
                        </Button>
                    }
                  </>
                ) : <Spin />
              }
              {
                pedidoFound &&
                (
                  // consultaConfirmada ?
                  <Button
                    onClick={() => setAbrirModalConsulta(true)}
                    type='default'>
                      Confirmar recepción
                  </Button> 
                  // :
                  // <Popconfirm
                  // placement="bottomRight"
                  // title='¿Está seguro de confirmar recepción?'
                  // // onConfirm={() => confirmarRecepcion()}
                  // okText="De acuerdo"
                  // cancelText="No"
                  // >
                  //   <Button type='primary' loading={loadingConfirmar}>
                  //       Confirmar recepción
                  //   </Button>
                  // </Popconfirm>
                )
              }
              {/* <Button
                onClick={() => setAbrirModalListaEspera(true)}
                type='default'>
                  Lista de espera
              </Button> */}
            </div>
          </div>
        }
      >
        
      </Card>
      <Table
        className="gx-table-responsive"
        style={{ marginBottom: 30 }}
        title={() => <span>Cabecera Pedido</span>} 
        size='small'
        dataSource={dataCabecera}
        pagination={false}
        columns={cabeceraColumn} />
      <Table
        className="gx-table-responsive"
        pagination={false}
        dataSource={dataDetalles}
        title={() => <span>Detalles Pedido</span>} 
        size='small' 
        columns={detallesColumn} 
      />

      <ModalBusquedaOrden
        abrirModalOrden={abrirModalOrden}
        dataSend={dataSend}
        handleChangeText={handleChangeText}
        loadingData={loadingData}
        setAbrirModalOrden={setAbrirModalOrden}
        setDataCabecera={setDataCabecera}
        setDataDetalles={setDataDetalles}
        setDataSend={setDataSend}
        setLoadingData={setLoadingData}
        setPedidoFound={setPedidoFound}
      />

      <ModalBusquedaComprobante
        abrirModalManual={abrirModalManual}
        dataSend={dataSend}
        handleChangeText={handleChangeText}
        loadingData={loadingData}
        setDataSend={setDataSend}
        setAbrirModalManual={setAbrirModalManual}
        setLoadingData={setLoadingData}
        traerPedido={traerPedido}
        dataComprobantesPago={dataComprobantesPago}
      />

      <ModalBusquedaPedido
        abrirModalPedido={abrirModalPedido}
        dataSend={dataSend}
        handleChangeText={handleChangeText}
        loadingData={loadingData}
        setAbrirModalPedido={setAbrirModalPedido}
        traerPedido={traerPedido}
      />

      <ModalAtencionMedica
        dataConsultorios={dataConsultorios}
        dataEspecialidades={dataEspecialidades}
        abrirModalConsulta={abrirModalConsulta}
        setAbrirModalConsulta={setAbrirModalConsulta}
        traerConsultorios={traerConsultorios}
        setDataSend={setDataSend}
        dataSend={dataSend}
        loadingDataConsultorio={loadingDataConsultorio}
        setDataCabecera={setDataCabecera}
        setDataDetalles={setDataDetalles}
        setPedidoFound={setPedidoFound}
      />

      <ModalListaEspera
        traerConsultorios={traerConsultorios}
        dataConsultorios={dataConsultorios}
        dataEspecialidades={dataEspecialidades}
        loadingDataConsultorio={loadingDataConsultorio}
        setVisible={setAbrirModalListaEspera}
        visible={abrirModalListaEspera}
      />
    </div>
  )
}

export default AdmisionConsulta;