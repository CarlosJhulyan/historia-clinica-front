import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Table
} from 'antd';
import { httpClient } from '../../../util/Api';
import { openNotification } from '../../../util/util';
import ModalLoading from '../../../util/modalLoading';
import { useSelector } from 'react-redux';

const ModalListaReservas = ({
                              visible,
                              setVisible,
                              handleSearchDatosPacienteReserva,
                              loading,
                              setLoading,
}) => {
  const { confirm } = Modal;
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
  const [dataList, setDataList] = useState([]);
  const [dataListFiltered, setDataListFiltered] = useState([]);
  const [loadingDataList, setLoadingDataList] = useState(false);
  const [currentPedido, setCurrentPedido] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [loadingDetalles, setLoadingDetalles] = useState(false);
  const [dataReserva, setDataReserva] = useState([]);
  const [textSearch, setTextSearch] = useState([]);
  const [messageShow, setMessageShow] = useState(false);

  const handleGetDatalist = async (values) => {
    const datafetch = {
      ...values,
      codGrupoCia: '001',
      codLocal: '001',
      fechaInicio: values.fecha[0].format('DD/MM/yyyy'),
      fechaFin: values.fecha[1].format('DD/MM/yyyy'),
    }
    setLoadingDataList(true);
    const {
      data: { data, success }
    } = await httpClient.post('posventa/getListaDatosReserva', datafetch);
    if (success) setDataList(data);
    setLoadingDataList(false);
  }

  const columns = [
    {
      title: 'Correlativo',
      dataIndex: 'NUM_PEDIDO_VTA',
      key: 'NUM_PEDIDO_VTA',
      sorter: (a, b) => a.NUM_PEDIDO_VTA - b.NUM_PEDIDO_VTA,
    },
    {
      title: 'Fecha',
      dataIndex: 'FECHA_PEDIDO_VTA',
      key: 'FECHA_PEDIDO_VTA',
    },
    {
      title: 'CLIENTE',
      dataIndex: 'NOM_CLI',
      key: 'NOM_CLI',
    },
    {
      title: 'DNI-RUC',
      dataIndex: 'DNI',
      key: 'DNI',
      sorter: (a, b) => a.DNI - b.DNI,
    },
    {
      title: 'Monto',
      dataIndex: 'VAL_NETO',
      key: 'VAL_NETO',
      align: 'right',
      render: (monto) => <span>S/ {monto}</span>
    },
  ];

  const getDetallesPedido = async () => {
    try {
      setModalDetalles(true);
      setLoadingDetalles(true);
      if (currentPedido) {
        const {
          data: { data, success, message }
        } = await httpClient.post('posventa/getListaDetalles', {
          codGrupoCia: '001',
          codLocal: '001',
          numPedido: currentPedido.NUM_PEDIDO_VTA
        });
        if (success) setDataReserva(data);
        else openNotification('Lista Reservas', message, 'Warning');
      }
      setLoadingDetalles(false);
    } catch (e) {
      console.error(e);
    }
  }

  const columnsDetalles = [
    {
      title: 'Especialidad',
      dataIndex: 'ESPECIALIDAD',
      key: 'ESPECIALIDAD',
    },
    {
      title: 'Código',
      dataIndex: 'CODIGO',
      key: 'CODIGO',
    },
    {
      title: 'Descripción',
      dataIndex: 'DESCRIPCION',
      key: 'DESCRIPCION',
    },
    {
      title: 'Unidad',
      dataIndex: 'UNIDAD',
      key: 'UNIDAD',
    },
    {
      title: 'Cantidad',
      dataIndex: 'CANTIDAD',
      key: 'CANTIDAD',
    },
    {
      title: 'S/ Prec.Unit',
      dataIndex: 'PRECIO_UNI',
      key: 'PRECIO_UNI',
    },
    {
      title: 'S/ Total',
      dataIndex: 'TOTAL',
      key: 'TOTAL',
    },
  ];

  useEffect(() => {
    setDataListFiltered(dataList);
  }, [dataList]);

  return (
    <>
      <Modal
        className='modal-posventa'
        visible={visible}
        onCancel={() => !loadingDataList && setVisible(false)}
        width={1100}
        title='Lista Reservas'
        centered
        footer={[
          <Button onClick={() => !loadingDataList && setVisible(false)}>
            Cerrar
          </Button>,
          <Button
            disabled={!currentPedido || loadingDataList}
            loading={loadingDetalles}
            onClick={getDetallesPedido}
          >
            Ver Detalles
          </Button>,
          <Button
            disabled
          >
            Imprimir
          </Button>,
          <Button
            style={{
              backgroundColor: themeSettingsGlobal.COD_COLOR_1,
              color: 'white',
            }}
            disabled={!currentPedido || loadingDataList}
            onClick={async () => {
              if (currentPedido) {
                confirm({
                  content: '¿Está seguro de seleccionar la reserva?',
                  onOk: async () => {
                    setVisible(false);
                    setLoading(true);
                    await handleSearchDatosPacienteReserva(currentPedido.NUM_PEDIDO_VTA);
                    setLoading(false);
                  },
                  okText: 'Aceptar',
                  cancelText: 'Cancelar',
                  centered: true
                });
              } else openNotification('Lista Reservas', 'Seleccione un pedido', 'Warning');
            }}
            loading={loading}
          >
            Procesar
          </Button>,
        ]}
      >
        <Form
          labelCol={{
            span:8
          }}
          wrapperCol={{
            span:16
          }}
          onFinish={handleGetDatalist}
        >
          <Row>
            <Col span={10}>
              <Form.Item
                name='documento'
                label='DNI/RUC/OTROS'
                // rules={[{required:true}]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name='fecha'
                label='Periodo'
                rules={[{required:true}]}
              >
                <DatePicker.RangePicker
                  format='DD/MM/yyyy'
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button
                block
                htmlType='submit'
                style={{
                  backgroundColor: themeSettingsGlobal.COD_COLOR_1,
                  color: 'white',
                }}
                loading={loadingDataList}
              >
                Buscar
              </Button>
            </Col>
          </Row>
        </Form>
        <Row
          justify='center'
          style={{
            backgroundColor:themeSettingsGlobal.COD_COLOR_1,
            paddingTop:10,
            paddingBottom:10,
            color:'#fff',
          }}
        >
          <Col
            span={20}
          >
            <Form.Item
              label='Cliente o RUC'
              className='usuarios-activos'
              style={{margin:0}}
            >
              <Input.Search
                value={textSearch}
                onChange={e => {
                  const text = e.target.value.toUpperCase();
                  setTextSearch(text);
                }}
                style={{margin:0}}
                onSearch={e => {
                  const text = textSearch;
                  if (isNaN(Number(text))) {
                    const dataFilter = dataList.filter(item => item.NOM_CLI.includes(text));
                    setDataListFiltered(dataFilter);
                    if (dataFilter.length === 0 ) setMessageShow(true);
                    else setMessageShow(false);
                  } else {
                    const dataFilter = dataList.filter(item => item.DNI.includes(text));
                    setDataListFiltered(dataFilter);
                    if (dataFilter.length === 0 ) setMessageShow(true);
                    else setMessageShow(false);
                  }
                }}
              />
              {messageShow && <span style={{color:'#fff'}}>
                No se encontraron datos para el filtro ingresado
              </span>}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              rowSelection={{
                type: 'radio',
                onChange: (seletedRowKeys, selectedRows) => {
                  setSelectedRowKeys(seletedRowKeys);
                  setCurrentPedido(selectedRows[0]);
                },
                selectedRowKeys
              }}
              columns={columns}
              dataSource={dataListFiltered}
              size='small'
              pagination={{
                pageSize: 6
              }}
            />
          </Col>
        </Row>
      </Modal>

      {modalDetalles && (
        <Modal
          centered
          width={1100}
          visible={modalDetalles}
          onCancel={() => !loadingDetalles && setModalDetalles(false)}
          title='Detalles de pedido'
          footer={false}
        >
          <Row>
            <Col span={24}>
              <Table
                dataSource={dataReserva}
                columns={columnsDetalles}
                size='small'
                pagination={{
                  pageSize:5
                }}
                loading={loadingDetalles}
              />
            </Col>
          </Row>
        </Modal>
      )}

      {loading ? <ModalLoading></ModalLoading> : null}
    </>
  );
}

export default ModalListaReservas;
