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

const ModalListaReservas = ({
                              visible,
                              setVisible,
                              handleSearchDatosPacienteReserva,
                              loading,
                              setLoading,
}) => {
  const [dataList, setDataList] = useState([]);
  const [loadingDataList, setLoadingDataList] = useState(false);
  const [currentPedido, setCurrentPedido] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
    },
    {
      title: 'Monto',
      dataIndex: 'VAL_NETO',
      key: 'VAL_NETO',
      align: 'right',
      render: (monto) => <span>S/ {monto}</span>
    },
  ];

  useEffect(() => {

  }, []);

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
          >
            Ver Detalles
          </Button>,
          <Button
            disabled={dataList.length <= 0 || loadingDataList}
          >
            Ordenar
          </Button>,
          <Button
            disabled
          >
            Imprimir
          </Button>,
          <Button
            style={{
              backgroundColor: '#0169aa',
              color: 'white',
            }}
            disabled={!currentPedido || loadingDataList}
            onClick={async () => {
              if (currentPedido) {
                setVisible(false);
                setLoading(true);
                await handleSearchDatosPacienteReserva(currentPedido.NUM_PEDIDO_VTA);
                setLoading(false);
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
                rules={[{required:true}]}
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
                  backgroundColor: '#0169aa',
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
            backgroundColor:'#0169aa',
            paddingTop:10,
            paddingBottom:10,
            color:'#fff',
          }}
        >
          <Col
            span={20}
          >
            <Form.Item label='Cliente o RUC' className='usuarios-activos'>
              <Input />
            </Form.Item>
            {/*No se encontraron datos para el filtro ingresado*/}
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
              dataSource={dataList}
              size='small'
              pagination={{
                pageSize: 6
              }}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
}

export default ModalListaReservas;
