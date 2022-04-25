import React, { useEffect, useState } from 'react';
import { 
  Table 
} from 'antd';
import { httpClient } from '../../../util/Api';

export default function LegendSpecialtyWeight() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
			title: 'DESCRIPCION',
			dataIndex: 'DESCRIPCION',
			key: 'DESCRIPCION',
      render: (x) => (
        <span>{x.toUpperCase()}</span>
      )
		},
		{
			title: 'PESO',
			dataIndex: 'PESO',
			key: 'PESO',
		}
  ];

  const traerDatos = async () => {
    setLoading(true);
    try {
      const { data } = await httpClient.post('auditoria/getPesoEspecialidades', {});
      const dataFormat = data.data.map(x => {
        return {
          ...x,
          key: x.ID
        }
      });
      setData(dataFormat);
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    traerDatos();
  }, [])

  return (
    <Table
      title={() => 
        <h3 style={{ textAlign: 'center', margin: 0 }}>Leyenda Puntaje por Formulario</h3>}
      bordered
      size='small'
      pagination={false}
      columns={columns}
      dataSource={data}
      loading={loading} />
  )
}
