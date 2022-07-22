import React, {
  useEffect,
  useState
} from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Table
} from 'antd';
import { httpClient } from '../../../util/Api';
import ModalUpsertUsuario from './modalUpsertUsuario';
import { useAuth } from '../../../authentication';
import { openNotification } from '../../../util/util';

const GestionarUsuarios = () => {
  const [usersData, setUsersData] = useState([]);
  const [estadoUsuarios, setEstadoUsuarios] = useState('A');
  const [searchText, setSearchText] = useState('');
  const [loadingUsersData, setLoadingUsersData] = useState(false);
  const [loadingChangeEstado, setLoadingChangeEstado] = useState(false);
  const [disabledAll, setDisabledAll] = useState(false);
  const [visibleUpsertUsuario, setVisibleUpsertUsuario] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentCliente, setCurrentCliente] = useState();
  const dataFetchInit = {
    codGrupoCia: '001',
    codLocal: '001'
  }
  const { authAdmin } = useAuth();

  const columnsDataUsers = [
    {
      title: 'Nro. Sec.',
      key: 'SEC_USU_LOCAL',
      dataIndex: 'SEC_USU_LOCAL'
    },
    {
      title: 'Ap. Paterno',
      key: 'APE_PAT',
      dataIndex: 'APE_PAT'
    },
    {
      title: 'Ap. Materno',
      key: 'APE_MAT',
      dataIndex: 'APE_MAT'
    },
    {
      title: 'Nombres',
      key: 'NOMBRE',
      dataIndex: 'NOMBRE'
    },
    {
      title: 'Id. Usuario',
      key: 'USUARIO',
      dataIndex: 'USUARIO'
    },
    {
      title: 'Estado',
      key: 'ESTADO',
      dataIndex: 'ESTADO'
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setCurrentCliente(selectedRows[0]);
    },
    selectedRowKeys
  };

  const getUsers = () => {
    setLoadingUsersData(true);
    setDisabledAll(true);
    httpClient
      .post('admin/getUsuariosActivosInactivos', {
        ...dataFetchInit,
        codEstado: estadoUsuarios
      })
      .then(({ data: { success, data } }) => {
        if (success) setUsersData(data);
        setDisabledAll(false);
        setLoadingUsersData(false);
      })
      .catch(e => console.error(e));
  }

  const handleActivaDescativaUsuario = async () => {
    setLoadingChangeEstado(true);
    const {
      data: { success, message }
    } = await httpClient.post('admin/changeEstadoUsuario', {
      ...dataFetchInit,
      secUsu: currentCliente.key,
      codUsu: authAdmin.login_usu
    })

    if (success) {
      openNotification('Cambio de estado', message);
      getUsers();
    } else openNotification('Cambio de estado', message, 'Warning');
    setLoadingChangeEstado(false);
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Card
        title='Listado de Usuarios Activos'
      >
        <Row style={{backgroundColor: '#0169aa'}} align='middle'>
          <Col span={12} style={{color:'#fff',fontSize:15}}>
            LOCAL: 001 - Humanidad SUR
          </Col>
          <Col span={12} style={{height:'auto'}}>
            <Form.Item
              label='APELLIDO PATERNO'
              style={{margin:0, alignItems:'center'}}
              className='usuarios-activos'
            >
              <Input.Search
                style={{marginTop:5,marginBottom:5}}
                onChange={e => setSearchText(e.target.value.toUpperCase())}
                value={searchText}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              rowSelection={{
                type: 'radio',
                ...rowSelection,
              }}
              // title={() => <Row style={{backgroundColor: '#0169aa'}} align='middle'><span>Relación de Usuarios:</span></Row>}
              loading={loadingUsersData}
              dataSource={usersData}
              columns={columnsDataUsers}
              size='small'
              className="gx-table-responsive"
            />
          </Col>
        </Row>
        <Row style={{height:25}}>
          <Col span={24}>
            <Button
              disabled={disabledAll}
              style={{
                backgroundColor: '#0169aa',
                color: '#fff',
              }}
              onClick={() => {
                setCurrentCliente(null);
                setSelectedRowKeys([]);
                setVisibleUpsertUsuario(true);
              }}
            >
              Crear
            </Button>
            <Button
              disabled={disabledAll || selectedRowKeys.length === 0}
              style={{
                backgroundColor: '#0169aa',
                color: '#fff',
              }}
              onClick={() => {
                setVisibleUpsertUsuario(true);
              }}
            >
              Modificar
            </Button>
            <Button
              disabled={disabledAll || selectedRowKeys.length === 0}
              style={{
                backgroundColor: '#0169aa',
                color: '#fff',
              }}
              onClick={handleActivaDescativaUsuario}
              loading={loadingChangeEstado}
            >
              Activar/Desactivar
            </Button>
            {/*<Button*/}
            {/*  disabled={disabledAll}*/}
            {/*  style={{*/}
            {/*    backgroundColor: '#0169aa',*/}
            {/*    color: '#fff',*/}
            {/*  }}*/}
            {/*>*/}
            {/*  Roles ASignados*/}
            {/*</Button>*/}
            {/*<Button*/}
            {/*  disabled={disabledAll}*/}
            {/*  style={{*/}
            {/*    backgroundColor: '#0169aa',*/}
            {/*    color: '#fff',*/}
            {/*  }}*/}
            {/*>*/}
            {/*  Ver Todos*/}
            {/*</Button>*/}
          </Col>
        </Row>
      </Card>

      {visibleUpsertUsuario && (
        <ModalUpsertUsuario
          dataFetchInit={dataFetchInit}
          visible={visibleUpsertUsuario}
          setVisible={setVisibleUpsertUsuario}
          currentCliente={currentCliente}
          getUsers={getUsers}
        />
      )}
    </>
  );
}

export default GestionarUsuarios;
