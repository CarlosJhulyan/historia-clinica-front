import { useEffect, useState } from "react";
import { httpClient } from "../../../util/Api";
import { Button, Card, Table, Row, Col, Form, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { openNotification } from '../../../util/util';


const AsignacionMedicos = () => {

    const [data, setData] = useState([]);

    const [valueSearch, setValueSearch] = useState('');
    const [loadingData, setLoadingData] = useState(false);
    const [currentMedico, setCurrentMedico] = useState();
    const [loadingSearh, setLoadingSearch] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const [visibleModalUpsert, setVisibleModalUpsert] = useState(false);

    const findMedicos = async (values) => {
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


    const defData = async () => {

        const response = await httpClient.get('/admin/searchAsignaMedicos');
        console.log(response);
        setData(response.data.data);
    }

    useEffect(() => {

        defData();
    }, [])

    const handleEditAsignacion = (record) => {
        setCurrentMedico(record);
        console.log(record);

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
            key: 'NOMBRES',

        },
        {
            title: 'APELLIDOS',
            dataIndex: 'APELLIDOS',
            key: 'APELLIDOS',
        },
        {
            title: 'CONSULTORIO',
            dataIndex: 'CONSULTORIO',
            key: 'CONSULTORIO'
        },
        {
            title: 'BUS',
            dataIndex: 'BUS',
            key: 'BUS',
        },
        {
            title: 'EDITAR',
            dataIndex: 'key',
            key: 'key',
            render: (key, record) => (
                <Button
                    style={{
                        background: "#04B0AD"
                    }}
                    onClick={e => handleEditAsignacion(record)}>
                    <p style={{
                        color: "white"
                    }}>
                        Editar
                    </p>
                </Button>
            )
        },
        {
            title: 'ELIMINAR',
            dataIndex: 'key',
            key: 'key',
            render: () => (
                <Button
                    style={{
                        background: "#EB5353"
                    }}
                >
                    <p style={{
                        color: "white"
                    }}>
                        Eliminar
                    </p>
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
                            Asignar Médico
                        </Col>
                        <Col span={9}>
                            <Form id='form-search' onFinish={findMedicos}>
                                <Form.Item
                                    name='valor'
                                    style={{ margin: 0, padding: 0 }}
                                    rules={[{ required: true }]}
                                >
                                    <Input
                                        placeholder='CMP o nombres'
                                        onChange={e => setValueSearch(e.target.value.toUpperCase())}
                                    />
                                </Form.Item>
                            </Form>
                        </Col>
                        <Col span={8}>
                            <Row justify="end" align="middle">
                                <Button
                                    type='primary'
                                    style={{ margin: 0 }}
                                    form='form-search'
                                    htmlType='submit'
                                    loading={loadingSearh}

                                >
                                    <SearchOutlined />
                                </Button>
                                <Button
                                    type='primary'
                                    style={{ margin: 0, marginLeft: 20, marginRight: 20 }}
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

        </>
    );

}

export default AsignacionMedicos;