import React, { Fragment } from 'react';
import { 
  Card,
  Row,
  Col
} from 'antd';
import { StarOutlined } from '@ant-design/icons';

export default function LegendRanking() {
  // const columns = [
	// 	{
	// 		title: 'VALOR',
	// 		dataIndex: 'value',
	// 		key: 'value',
	// 	},
  //   {
	// 		title: 'PUNTUACION',
	// 		dataIndex: 'ranking',
	// 		key: 'ranking',
  //     render: (ranking) => (
  //       ranking.map(item => (
  //         <StarOutlined style={{ color: '#D1D100' }} />
  //       ))
  //     )
	// 	},
  // ];
  
  const data = [
    {
      key: 1,
      ranking: [1],
      value: '0-20',
    },
    {
      key: 2,
      ranking: [1,2],
      value: '21-49',
    },
    {
      key: 3,
      ranking: [1,2,3],
      value: '50-70',
    },
    {
      key: 4,
      ranking: [1,2,3,4],
      value: '70-90',
    },
    {
      key: 5,
      ranking: [1,2,3,4,5],
      value: '90',
    }
  ]

  return (
    <Card className='card-legend-ranking'>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tr>
        {
          data.map(item => (
            <Fragment key={item.key}>
              <td style={{ 
                width: '80px', 
                margin: '0 20px', 
                textAlign: 'center',
                borderRight: '1px solid #eee',
                borderLeft: '1px solid #eee' }}>
                  {item.value}
              </td>
              <td style={{
                padding: '8px',
                textAlign: 'center' }}>
                {
                  item.ranking.map(() => (
                    <StarOutlined style={{ color: '#D1D100' }} />
                  ))
                }
              </td>
            </Fragment>
          ))
        }
        </tr>
      </table>
    </Card>
  )
}
