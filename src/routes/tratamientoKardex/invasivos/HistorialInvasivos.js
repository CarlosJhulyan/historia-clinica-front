import { Table } from 'antd'
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { httpClient } from '../../../util/Api';

function HistorialInvasivos({historia}) {

    const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
    const codPaciente = historia.codPaciente;

    const traerInvasivos= async () => {
		setLoading(true);
		const response = await httpClient.post(`/kardex/getInvacivos`, { codPaciente});
        console.log(response,'datta');
		setData(response.data.data);
		setLoading(false);
	};

	useEffect(() => {
		traerInvasivos();
	}, []);

	const columns = [
		{
			title: 'Fecha C.V.C',
			dataIndex: 'fecha_cvc',
			key: 'cvc',
            render: (text, record) => {
				return <span>{moment(text).format('DD/MM/YY')}</span>;
			},
		},
		{
			title: 'Fecha T.E.T',
			dataIndex: 'fecha_tet',
			key: 'tet',
            render: (text, record) => {
				return <span>{moment(text).format('DD/MM/YY')}</span>;
			},
		},
		{
			title: 'Fecha Via Periferica',
			dataIndex: 'fecha_via_periferia',
			key: 'via',
            render: (text, record) => {
				return <span>{moment(text).format('DD/MM/YY')}</span>;
			},
		},
		{
			title: 'Motivo',
			dataIndex: 'motivo_via_periferica',
			key: 'motivo',
		},
        {
			title: 'Fecha S.N.G',
			dataIndex: 'fecha_sng',
			key: 'sng',
            render: (text, record) => {
				return <span>{moment(text).format('DD/MM/YY')}</span>;
			},
		},
        {
			title: 'Fecha Foley',
			dataIndex: 'fecha_foley',
			key: 'foley',
            render: (text, record) => {
				return <span>{moment(text).format('DD/MM/YY')}</span>;
			},
		},
	];

    return (
        <div style={{ width: '100%' }}>
            <div>
                <Table
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                />
            </div>
        </div>
    )
}

export default HistorialInvasivos