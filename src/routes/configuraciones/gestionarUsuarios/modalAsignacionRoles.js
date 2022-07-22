import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Descriptions, Modal, Row, Table } from 'antd';
import { httpClient } from '../../../util/Api';
import { openNotification } from '../../../util/util';
import { useAuth } from '../../../authentication';

const ModalAsignacionRoles = ({
                                visible,
                                setVisible,
                                currentUsuario,
                                dataFetchInit,
                                lista,
                                loadingLista
}) => {
  const { authAdmin } = useAuth();
  const [loadingAsignados, setLoadingAsignados] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys,
    columnTitle: 'Sel',
    columnWidth: '40px'
  };

  const getRolesUsuario = () => {
    setLoadingAsignados(true);
    httpClient.post('admin/getRolesUsuario', {
      ...dataFetchInit,
      secUsu: currentUsuario.key
    })
      .then(({ data: { success, data, message } }) => {
        if (success) {
          setSelectedRowKeys(data.map(item => item.key));
        } else openNotification('Roles de usuario', message, 'Warning');
        setLoadingAsignados(false);
      })
      .catch(e => console.error(e));
  }

  const cleanRolesAsignados = async (data) => {
    try {
      const {
        data: { success }
      } = await httpClient.post('admin/cleanRolesUsuario', data);
      return success;
    } catch (e) {
      console.error(e);
    }
  }

  const asignaRol = async (data) => {
    try {
      const {
        data: { message, success }
      } = await httpClient.post('admin/setRolUsuario', data);
      if (!success) openNotification('Roles', message, 'Warning');
      return success;
    } catch (e) {
      console.error(e);
    }
  }

  const handleAsignaRolesUsuario = async () => {
    setLoadingFetch(true);
    const dataFetch = {
      ...dataFetchInit,
      usuCrea: authAdmin.login_usu,
      secUsu: currentUsuario.key
    }

    const rolesEliminados = await cleanRolesAsignados(dataFetch);
    if (!rolesEliminados) {
      setLoadingFetch(false);
      return;
    }

    let finished = true;
    for (const codRol of selectedRowKeys) {
      const success = await asignaRol({
        ...dataFetch,
        codRol
      });
      if (!success) {
        setLoadingFetch(false);
        finished = false;
      }
    }
    if (finished) {
      openNotification('Roles','Se asigno los roles al usuario');
      setVisible(false);
    }
    setLoadingFetch(false);
  }

  const columns = [
    {
      title: 'Código',
      dataIndex: 'COD_ROL',
      key: 'COD_ROL',
      sorter: (a, b) => a.COD_ROL - b.COD_ROL,
      width: 90,
      align: 'center'
    },
    {
      title: 'Descripción de rol',
      dataIndex: 'DESC_ROL',
      key: 'DESC_ROL',
    },
  ]

  useEffect(() => {
    getRolesUsuario();
  }, [currentUsuario])

  return (
    <>
      <Modal
        width={600}
        centered
        visible={visible}
        onCancel={() => {
          if (!loadingFetch) setVisible(false)
        }}
        title='Lista de Roles Asignados'
        footer={[
          <Button
            style={{background: '#0169aa', color:'#fff'}}
            disabled={loadingAsignados || loadingLista}
            onClick={handleAsignaRolesUsuario}
            loading={loadingFetch}
          >
            Asignar Roles
          </Button>,
          <Button
            disabled={loadingAsignados || loadingLista || loadingFetch}
            onClick={() => setVisible(false)}
          >
            Salir
          </Button>,
        ]}
      >
        <Row>
          <Col span={24}>
            <Card size='small' style={{margin:0}}>
              <Descriptions>
                <Descriptions.Item
                  label='Nro. Sec'
                  span={3}
                >
                  {currentUsuario.key}
                </Descriptions.Item>
                <Descriptions.Item
                  label='Usuario'
                  span={3}
                  style={{padding:0}}
                >
                  {currentUsuario.NOMBRE}, {currentUsuario.APE_PAT} {currentUsuario.APE_MAT}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              title={() => <Row><Col style={{backgroundColor: '#0169aa', color:'#fff', padding: 10}} span={24}>Relación de Roles Asignados</Col></Row>}
              rowSelection={{
                type: 'select',
                ...rowSelection,
              }}
              size='small'
              columns={columns}
              dataSource={lista}
              loading={loadingAsignados || loadingLista}
              pagination={false}
              scroll={{
                y: 250
              }}
            />
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default ModalAsignacionRoles;
