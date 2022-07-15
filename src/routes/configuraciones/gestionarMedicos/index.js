import { Button, Card, Input, Table, Space } from 'antd';
import Title from 'antd/lib/skeleton/Title';
import { useEffect, useState } from 'react';
import { httpClient } from '../../../util/Api';

const GestionarMedicos = () => {
    const [data, setData] = useState();

    const defMedicos = async()=>{
        const respuesta = await httpClient.get('posventa/getMedicosPosVenta');
        console.log(respuesta);
        setData(respuesta.data.data);
    }

    const columns=[
        {
            title: 'CMP',
            dataIndex: 'CMP',
            key: 'CMP',
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
            title: 'REFERENCIA',
            dataIndex:'DESC_REFERENCIA',
            key:'DESC_REFERENCIA',
        },
        {
            title: 'REFERENCIA 2',
            dataIndex:'TIP_REFERENCIA',
            key:'TIP_REFERENCIA',
            
        }

    ]

    useEffect(()=>{        
        defMedicos();
    },[]);

    return (
        <>

            <Table
                className="gx-table-responsive"
                columns={columns}
                dataSource={data}
            />

            

        </>
    );
}


export default GestionarMedicos;