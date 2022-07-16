import { Button, Card, Form, Input, Row, Switch, Table } from 'antd';
import { useEffect, useState } from 'react';
import { httpClient } from '../../../util/Api';
import ModalUpsertMedico from './modalUpsertMedico';
import { SearchOutlined } from '@ant-design/icons';

const GestionarMedicos = () => {
  const [data, setData] = useState();
  const [loadingData, setLoadingData] = useState(false);
  const [visibleModalUpsert, setVisibleModalUpsert] = useState(false);

  const defMedicos = async()=>{
    setLoadingData(true);
    const respuesta = await httpClient.get('posventa/getMedicosPosVenta');
    console.log(respuesta);
    setData(respuesta.data.data);
    setLoadingData(false);
  }

  const columns=[
    {
      title: 'CMP',
      dataIndex: 'CMP',
      key: 'CMP',
    },
    {
      title: 'NOMBRE',
      dataIndex: 'NOMBRE',
      key:'NOMBRE',
    },
    {
      title: 'AP. PATERNO',
      dataIndex: 'APE_PAT',
      key:'APE_PAT',
    },
    {
      title: 'AP. MATERNO',
      dataIndex: 'APE_MAT',
      key: 'APE_MAT',
    },
    {
      title: 'ESPECIALIDAD',
      dataIndex:'DESC_REFERENCIA',
      key:'DESC_REFERENCIA',
    },
    {
      title: 'Estado',
      dataIndex: 'state',
      key: 'estado',
      render: (estado) => (
        <Switch  />
      )
    }
  ]

  useEffect(()=>{
      defMedicos();
  },[]);

  return (
    <>
      <Card
        title='Gestionar Médicos'
        extra={
          <>
            <Button
              type='primary'
              onClick={() => setVisibleModalUpsert(true)}
            >
              <SearchOutlined />
            </Button>
            <Button
              type='primary'
              onClick={() => setVisibleModalUpsert(true)}
            >
              Crear
            </Button>
          </>
        }
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
        />
      }
    </>
  );
}


export default GestionarMedicos;
