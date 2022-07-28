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
import ModalAsignacionRoles from './modalAsignacionRoles';
import { useSelector } from 'react-redux';

const GestionarUsuarios = () => {
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
  const [usersData, setUsersData] = useState([]);
  const [usersDataFiltered, setUsersDataFiltered] = useState([]);
  const [estadoUsuarios, setEstadoUsuarios] = useState('A');
  const [searchText, setSearchText] = useState('');
  const [loadingUsersData, setLoadingUsersData] = useState(false);
  const [loadingChangeEstado, setLoadingChangeEstado] = useState(false);
  const [disabledAll, setDisabledAll] = useState(false);
  const [visibleUpsertUsuario, setVisibleUpsertUsuario] = useState(false);
  const [visibleModalRoles, setVisibleModalRoles] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentUsuario, setCurrentUsuario] = useState();
  const [loadingListaRoles, setLoadingListaRoles] = useState(false);
  const [listaRoles, setListaRoles] = useState([]);
  const dataFetchInit = {
    codGrupoCia: '001',
    codLocal: '001'
  }
  const { authAdmin } = useAuth();

  const getListaRoles = () => {
    httpClient.get('admin/getTodosRolesUsuario')
      .then(({ data: { success, data } }) => {
        if (success) setListaRoles(data);
      })
      .catch(e => console.error(e));
  }

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
      setCurrentUsuario(selectedRows[0]);
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
      secUsu: currentUsuario.key,
      codUsu: authAdmin.login_usu
    })

    if (success) {
      openNotification('Cambio de estado', message);
      setCurrentUsuario(null);
      setSelectedRowKeys([]);
      getUsers();
    } else openNotification('Cambio de estado', message, 'Warning');
    setLoadingChangeEstado(false);
  }

  const handleSearchInTable = () => {
    setUsersDataFiltered(usersData.filter(item => item.APE_PAT.includes(searchText)));
  }

  useEffect(() => {
    getUsers();
  }, [estadoUsuarios]);

  useEffect(() => {
    setUsersDataFiltered(usersData);
  }, [usersData]);

  useEffect(() => {
    getListaRoles();
  }, []);

  return (
    <>
      <Card
        title='Listado de Usuarios Activos'
      >
        <Row style={{backgroundColor: themeSettingsGlobal.COD_COLOR_1}} align='middle'>
          <Col
            span={12}
            style={{
              color:'#fff',
              fontSize:15}}
          >
            LOCAL: 001 - Humanidad SUR
          </Col>
          <Col span={12} style={{height:'auto'}}>
            <Form.Item
              label='APELLIDO PATERNO'
              style={{margin:0, alignItems:'center'}}
              className='usuarios-activos'
            >
              <Input.Search
                onSearch={handleSearchInTable}
                style={{marginTop:5,marginBottom:6}}
                onChange={e => setSearchText(e.target.value.toUpperCase())}
                value={searchText}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row style={{marginTop:10}}>
          <Col span={24}>
            <Table
              rowSelection={{
                type: 'radio',
                ...rowSelection,
              }}
              // title={() => <Row style={{backgroundColor: '#0169aa'}} align='middle'><span>Relación de Usuarios:</span></Row>}
              loading={loadingUsersData}
              dataSource={usersDataFiltered}
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
                backgroundColor: themeSettingsGlobal.COD_COLOR_1,
                color: '#fff',
              }}
              onClick={() => {
                setCurrentUsuario(null);
                setSelectedRowKeys([]);
                setVisibleUpsertUsuario(true);
              }}
            >
              Crear
            </Button>
            <Button
              disabled={disabledAll || selectedRowKeys.length === 0}
              style={{
                backgroundColor: themeSettingsGlobal.COD_COLOR_1,
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
                backgroundColor: themeSettingsGlobal.COD_COLOR_1,
                color: '#fff',
              }}
              onClick={handleActivaDescativaUsuario}
              loading={loadingChangeEstado}
            >
              Activar/Desactivar
            </Button>
            <Button
              disabled={disabledAll  || selectedRowKeys.length === 0}
              style={{
                backgroundColor: themeSettingsGlobal.COD_COLOR_1,
                color: '#fff',
              }}
              onClick={() => setVisibleModalRoles(true)}
            >
              Roles Asignados
            </Button>
            <Button
              disabled={disabledAll}
              style={{
                backgroundColor: themeSettingsGlobal.COD_COLOR_1,
                color: '#fff',
              }}
              onClick={() => setEstadoUsuarios('')}
            >
              Ver Todos
            </Button>
          </Col>
        </Row>
      </Card>

      {visibleUpsertUsuario && (
        <ModalUpsertUsuario
          dataFetchInit={dataFetchInit}
          visible={visibleUpsertUsuario}
          setVisible={setVisibleUpsertUsuario}
          currentUsuario={currentUsuario}
          getUsers={getUsers}
        />
      )}

      {visibleModalRoles && (
        <ModalAsignacionRoles
          visible={visibleModalRoles}
          setVisible={setVisibleModalRoles}
          dataFetchInit={dataFetchInit}
          lista={listaRoles}
          loadingLista={loadingListaRoles}
          currentUsuario={currentUsuario}
        />
      )}
    </>
  );
}

export default GestionarUsuarios;
