import { Button, Card, Col, Form, Input, Row, Switch, Table } from 'antd';
import { useEffect, useState } from 'react';
import { httpClient } from '../../../util/Api';
import ModalUpsertMedico from './modalUpsertMedico';
import { SearchOutlined } from '@ant-design/icons';
import { openNotification } from '../../../util/util';
import { useSelector } from 'react-redux';

const GestionarMedicos = () => {
  const admin = JSON.parse(localStorage.getItem('token-admin'));
  const [data, setData] = useState([]);
  const [valueSearch, setValueSearch] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSearh, setLoadingSearch] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState({});
  const [currentMedico, setCurrentMedico] = useState();
  const [visibleModalUpsert, setVisibleModalUpsert] = useState(false);
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);

  const searchMedicos = async (values) =>{
    if (values.valor.trim() === '') {
      openNotification('Médico', 'El campo de búsqueda esta vacio', 'Warning');
      return;
    }
    setLoadingSearch(true);
    const respuesta = await httpClient.post('admin/searchMedicos', {
      valor: values.valor.toUpperCase()
    });
    setData(respuesta.data.data);
    setLoadingSearch(false);
  }

  const handleChangeStatus = (e, record) => {
    setLoadingUpdate(true);
    setCurrentUpdate(record);
    httpClient.post('/admin/updateStatusMedico', {
      cmp: record.CMP,
      valor: record.ESTADO === '1' ? '0' : '1',
      codUsu: admin.sec_usu_local
    })
      .then(({ data }) => {
        if (data.success) openNotification('Médicos', data.message);
        setLoadingUpdate(false);
        setLoadingData(true);
        searchMedicos({valor: valueSearch})
          .then(() => {
            setLoadingData(false);
          });
      })
      .catch(e => console.error(e));
  }

  const handleEditMedico = (record) => {
    setCurrentMedico(record);
    setVisibleModalUpsert(true);
  }

  const columns = [
    {
      title: 'CMP',
      dataIndex: 'CMP',
      key: 'CMP',
    },
    {
      title: 'NOMBRE',
      dataIndex: 'NOMBRES',
      key:'NOMBRES',
    },
    {
      title: 'APELLIDOS',
      dataIndex: 'APELLIDOS',
      key:'APELLIDOS',
    },
    {
      title: 'ESPECIALIDAD',
      dataIndex:'ESPECIALIDAD',
      key:'ESPECIALIDAD',
    },
    {
      title: 'COLEGIO',
      dataIndex:'TIPO_COLEGIO',
      key:'TIPO_COLEGIO',
    },
    {
      title: 'HABILITADO',
      dataIndex: 'ESTADO',
      key: 'ESTADO',
      render: (estado, record) => (
        <Switch
          // checkedChildren={record.EQUIV_ESTADO}
          // unCheckedChildren={record.EQUIV_ESTADO}
          checked={estado === '1'}
          loading={loadingUpdate && currentUpdate.key === record.key}
          onClick={e => handleChangeStatus(e, record)}
        />
      )
    },
    {
      title: 'EDITAR',
      dataIndex: 'key',
      key: 'key',
      render: (key, record) => (
        <Button onClick={e => handleEditMedico(record)}>
          Editar
        </Button>
      )
    }
  ]

  return (
    <>
      <Card
        title={(
          <Row justify='space-between' align='middle'>
            <Col span={5}>
              Gestionar Médico
            </Col>
            <Col span={9}>
              <Form id='form-search' onFinish={searchMedicos}>
                <Form.Item
                  name='valor'
                  style={{margin:0,padding:0}}
                  rules={[{required:true}]}
                >
                  <Input
                    placeholder='CMP o nombres'
                    onChange={e => setValueSearch(e.target.value.toUpperCase())}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col span={8}>
              <Row justify='end' align='middle'>
                <Button
                  style={{
                    margin:0,
                    background: themeSettingsGlobal.COD_COLOR_1,
                    color: '#fff',
                  }}
                  form='form-search'
                  htmlType='submit'
                  loading={loadingSearh}
                >
                  <SearchOutlined />
                </Button>
                <Button
                  style={{
                    margin:0,
                    marginLeft: 20,
                    marginRight:20,
                    background: themeSettingsGlobal.COD_COLOR_1,
                    color: '#fff'
                  }}
                  onClick={() => {
                    setCurrentMedico();
                    setVisibleModalUpsert(true);
                  }}
                >
                  Crear
                </Button>
              </Row>
            </Col>
          </Row>
        )}
      >
        <Table
          className="gx-table-responsive"
          columns={columns}
          dataSource={data}
          loading={loadingData}
        />
      </Card>

      {visibleModalUpsert &&
        <ModalUpsertMedico
          visible={visibleModalUpsert}
          setVisible={setVisibleModalUpsert}
          currentMedico={currentMedico}
        />
      }
    </>
  );
}


export default GestionarMedicos;
