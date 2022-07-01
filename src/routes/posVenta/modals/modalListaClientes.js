import React, {
  useEffect,
  useState
} from 'react';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row, Select,
  Table
} from 'antd';
import { httpClient } from '../../../util/Api';
import { openNotification } from '../../../util/util';

function ModalListaMedicos({ visible, setVisible, setClienteCurrent }) {
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [clienteKeyCurrent, setClienteKeyCurrent] = useState('');
  const [clienteSearch, setClienteSearch] = useState('');
  const [filaActual, setFilaActual] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [visibleModalUpsertCliente, setVisibleModalUpsertCliente] = useState(false);

  const columns = [
    {
      title: 'T...',
      dataIndex: 'TIPO_DOC_IDENT',
      key: 'TIPO_DOC_IDENT',
    },
    {
      title: 'Documento',
      dataIndex: 'NUM_DOCUMENTO',
      key: 'NUM_DOCUMENTO',
    },
    {
      title: 'Cliente',
      dataIndex: 'CLIENTE',
      key: 'CLIENTE'
    },
    {
      title: 'Teléfono',
      dataIndex: 'TELEFONO',
      key: 'TELEFONO'
    },
  ];

  const traerDataClientesPorNombre = () => {
    setLoadingData(true);
    httpClient.post('posventa/getClientesNombrePosVenta', {
      codGrupoCia: '001',
      codLocal: '001',
      palabra: clienteSearch.toUpperCase()
    })
      .then(response => {
        if (response.data.success) {
          setData(response.data.data);
          openNotification('Lista de Clientes', response.data.message);
        } else {
          openNotification('Lista de Clientes', response.data.message, 'Warning');
        }
        setLoadingData(false);
      })
      .catch(e => console.error(e));
  }

  const traerDataClientesPorDocumento = () => {
    setLoadingData(true);
    httpClient.post('posventa/getClientesDocPosVenta', {
      codGrupoCia: '001',
      codLocal: '001',
      documento: clienteSearch
    })
      .then(response => {
        if (response.data.success) {
          setData(response.data.data);
          openNotification('Lista de Clientes', response.data.message);
        } else {
          openNotification('Lista de Clientes', response.data.message, 'Warning');
        }
        setLoadingData(false);
      })
      .catch(e => console.error(e));
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setClienteKeyCurrent(selectedRows[0].NUM_DOCUMENTO);
      setFilaActual(selectedRows[0]);
      setSelectedRowKeys(selectedRowKeys)
    },
    selectedRowKeys
  };

  const handleSearch = () => {
    const isNumber = /^([0-9])*$/.test(clienteSearch);

    if (isNumber) traerDataClientesPorDocumento();
    else traerDataClientesPorNombre();
  }

  const handleClearData = () => {
    setData([]);
    setClienteSearch('');
    setSelectedRowKeys([]);
    setFilaActual({});
    setClienteKeyCurrent('');
    openNotification('Lista de Clientes', 'Lista limpiada');
  }

  const handleAcepted = () => {
    openNotification('Ingreso Cliente', 'Cliente agregado correctamente');
    setClienteCurrent(filaActual);
    setVisible(false);
  }

  return (
    <>
      <Modal
        centered
        width={900}
        visible={visible}
        title='Lista de Clientes'
        className='modal-custom'
        onCancel={() => setVisible(false)}
        footer={[
          <Button onClick={() => setVisibleModalUpsertCliente(true)}>Crear</Button>,
          <Button disabled={!clienteKeyCurrent}>Modificar</Button>,
          <Button disabled={!clienteKeyCurrent} onClick={handleAcepted}>Seleccionar</Button>,
          <Button onClick={() => setVisible(false)}>Cerrar</Button>
        ]}
      >
        <Row>
          <Col span={14}>
            <Form.Item label='Cliente' style={{margin: 0, padding: 5}}>
              <Input
                onChange={e => setClienteSearch(e.target.value)}
                value={clienteSearch}
                disabled={loadingData}
              />
            </Form.Item>
          </Col>
          <Button
            disabled={loadingData || clienteSearch.trim() === ''}
            style={{marginTop: 5, background: '#0169aa', color: '#fff'}}
            loading={loadingData}
            onClick={handleSearch}
          >
            Buscar
          </Button>
          <Button
            disabled={loadingData}
            style={{marginTop: 5, background: '#0169aa', color: '#fff'}}
            // onClick={traerDataClientesPorNombre}
          >
            Sin Docume...
          </Button>
          <Button
            disabled={loadingData}
            style={{marginTop: 5, background: '#0169aa', color: '#fff'}}
            onClick={handleClearData}
          >
            Limpiar
          </Button>
        </Row>
        <Table
          style={{marginRight: 10, marginLeft: 10}}
          rowSelection={{
            type: 'radio',
            ...rowSelection
          }}
          className="gx-table-responsive"
          columns={columns}
          size='small'
          loading={loadingData}
          dataSource={data}
        />
      </Modal>

      <ModalMantenimientoCliente
        setVisible={setVisibleModalUpsertCliente}
        visible={visibleModalUpsertCliente}
      />
    </>
  );
}

function ModalMantenimientoCliente({ visible, setVisible }) {
  return (
    <Modal
      centered
      width={700}
      visible={visible}
      title='Mantenimiento Cliente'
      onCancel={() => setVisible(false)}
      footer={[
        <Button onClick={() => setVisible(false)}>Cerrar</Button>,
        <Button style={{background: '#0169aa', color: '#fff' }}>Grabar</Button>
      ]}
    >
      <Form labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
        <Row>
          <Col span={12}>
            <Form.Item label='DNI o RUC' style={{margin: 0}}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='Teléfono' style={{margin: 0}}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='Correo' style={{margin: 0}}>
              <Input size='small' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Nombre' style={{margin: 0}}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='Ape. Pat' style={{margin: 0}}>
              <Input size='small' />
            </Form.Item>
            <Form.Item label='Ape. Mat' style={{margin: 0}}>
              <Input size='small' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label='Dirección' style={{margin: 0}}>
              <Input size='small' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='Razón Social' style={{margin: 0}}>
              <Input size='small' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default ModalListaMedicos;
