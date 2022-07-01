import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row, Select,
  Table
} from 'antd';
import { httpClient } from '../../../util/Api';
import { openNotification } from '../../../util/util';

function ModalListaMedicos({ visible, setVisible, setMedicoCurrent }) {
  const [data, setData] = useState([]);
  const [dataFiltered, setDataFiltered] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [cmpCurrent, setCmpCurrent] = useState('');
  const [nombreCmp, setNombreCmp] = useState('');
  const [filaActual, setFilaActual] = useState({});
  const [visibleModalUpsertMedico, setVisibleModalUpsertMedico] = useState(false);

  const columns = [
    {
      title: 'CMP',
      dataIndex: 'CMP',
      key: 'CMP',
    },
    {
      title: 'Nombre Completo',
      dataIndex: 'NOMBRE_COMPLETO',
      key: 'NOMBRE_COMPLETO',
      width: '400px',
    },
    {
      title: 'Referencia',
      dataIndex: 'DESC_REFERENCIA',
      key: 'DESC_REFERENCIA'
    },
  ];

  const traerDataMedicos = useCallback(() => {
    setLoadingData(true);
    httpClient.get('posventa/getMedicosPosVenta')
      .then(response => {
        if (response.data.success) setData(response.data.data);
        setLoadingData(false);
      });
  }, []);

  const handleFilter = () => {
    setDataFiltered(
      data.filter(item => item.NOMBRE_COMPLETO.toUpperCase().includes(nombreCmp.toUpperCase()) || item.CMP === nombreCmp));
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setCmpCurrent(selectedRows[0].CMP);
      setFilaActual(selectedRows[0])
    }
  };

  const handleAcepted = () => {
    openNotification('Ingreso Médico', 'Médico agregado correctamente');
    setMedicoCurrent(filaActual);
    setVisible(false);
  }

  useEffect(() => {
    traerDataMedicos();
  }, [])

  useEffect(() => {
    setDataFiltered(data);
  }, [data])

  return (
    <>
      <Modal
        centered
        width={900}
        visible={visible}
        title='Lista de Médicos'
        className='modal-custom'
        onCancel={() => setVisible(false)}
        footer={[
          <Button onClick={() => setVisibleModalUpsertMedico(true)}>Crear</Button>,
          <Button disabled={!cmpCurrent}>Modificar</Button>,
          <Button disabled={!cmpCurrent} onClick={handleAcepted}>Seleccionar</Button>,
          <Button onClick={() => setVisible(false)}>Cerrar</Button>
        ]}
      >
        <Row>
          <Col span={14}>
            <Form.Item label='Nombre ó CMP' style={{margin: 0, padding: 5}}>
              <Input
                onChange={e => setNombreCmp(e.target.value)}
                style={{width: 380}}
                value={nombreCmp}
                disabled={loadingData}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Button
              disabled={loadingData}
              style={{marginTop: 5, background: '#0169aa', color: '#fff'}}
              onClick={handleFilter}
            >
              Filtrar
            </Button>
          </Col>
          <Col span={24}>
            <Form.Item label='Relacion de medicos' style={{margin: 0, padding: 5}}>
              <Input size='large' style={{width: 730}} disabled />
            </Form.Item>
          </Col>
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
          dataSource={dataFiltered}
        />
      </Modal>

      <ModalMantenimientoMedico
        visible={visibleModalUpsertMedico}
        setVisible={setVisibleModalUpsertMedico}
      />
    </>
  );
}

function ModalMantenimientoMedico({ visible, setVisible }) {
  const [dataList, setDataList] = useState([]);

  const traerListaReferencia = () => {
    httpClient.get('posventa/getListaReferencias')
      .then(response => {
        if (response.data.success) setDataList(response.data.data);
      })
      .catch(e => console.error(e));
  }

  useEffect(() => {
    traerListaReferencia();
  }, [])
  return (
    <Modal
      centered
      width={500}
      visible={visible}
      title='Mantenimiento Médico'
      onCancel={() => setVisible(false)}
      footer={[
        <Button onClick={() => setVisible(false)}>Cerrar</Button>,
        <Button style={{background: '#0169aa', color: '#fff' }}>Grabar</Button>
      ]}
    >
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Form.Item label='CMP' style={{margin: 0}}>
          <Input size='small' />
        </Form.Item>
        <Form.Item label='Nombre' style={{margin: 0}}>
          <Input size='small' />
        </Form.Item>
        <Form.Item label='Apellido Pat.' style={{margin: 0}}>
          <Input size='small' />
        </Form.Item>
        <Form.Item label='Apellido Mat.' style={{margin: 0}}>
          <Input size='small' />
        </Form.Item>
        <Form.Item label='Referencia' style={{margin: 0}}>
          <Select value={''} size='small'>
            <Select.Option value=''>Seleccionar Referencia</Select.Option>
            {dataList.map(item => (
              <Select.Option value={item.value} key={item.key} >{item.DESCRIPCION}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ModalListaMedicos;
