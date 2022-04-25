import React, { createRef, useEffect, useState } from 'react';
import { Col, Button, Form, Input, Modal, Row, Space, Spin, Table } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { actualizarImagenes } from '../apis';

const ModalImagenes = ({ datosModal, abrirModal, setAbrirModal, handleDatos, dataImagenes, dataSource }) => {

    const dataGlobal = {
        codGrupoCia: datosModal.estado.COD_GRUPO_CIA,
        codLocal: datosModal.estado.COD_LOCAL_ANTECENDENTE,
    }

    const [estado, setEstado] = useState();
    const [imagenes, setImagenes] = useState();
    const [botonModal, setBotonModal] = useState(true);
    const [btnActualizar, setBtnActualizar] = useState(false);

    const formRef = createRef();

    const rowSelection = {
        onChange: (selectedRows) => {
            setEstado(selectedRows);
        },
        selectedRowKeys: estado,
    };

    useEffect(() => {
        if (abrirModal) {
            if (dataSource?.length > 0) {
                const a = dataSource.map(data => data.key);
                setEstado(a);
            }
            if (dataImagenes) {
                setImagenes(dataImagenes);
                setBotonModal(false);
            }
        }
    }, [abrirModal, imagenes, dataImagenes]);

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Buscar`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Buscar
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reiniciar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
    });

    const columns = [
        {
            title: "Cod.",
            dataIndex: 'COD_PROD',
            key: 'cod_prod',
            width: 140,
            ...getColumnSearchProps('COD_PROD'),
        },
        {
            title: "Descripción",
            dataIndex: 'DESC_PROD',
            key: 'descripcion',
            ...getColumnSearchProps('DESC_PROD'),

        },
        {
            title: "Especialidad",
            dataIndex: 'NOM_LAB',
            key: 'especialidad',
            ...getColumnSearchProps('NOM_LAB'),

        },
    ];

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const handleReset = clearFilters => {
        clearFilters();
    };

    const onClickActualizarModal = async () => {
        setBtnActualizar(true);
        await actualizarImagenes(dataGlobal)
        setBtnActualizar(false);
    };

    return (
        <>
            <Modal
                width="70%"
                title={
                    <div style={{ fontSize: "22px" }}>
                        Imagenes
                    </div>
                }
                okText="Agregar"
                cancelText="Cancelar"
                visible={abrirModal}
                onOk={() => handleDatos({ estado })}
                okButtonProps={{
                    disabled: botonModal
                }}
                onCancel={() => setAbrirModal(false)}
            >
                {imagenes === undefined ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Spin tip="Cargando" />
                    </div>
                ) : (
                    <Form ref={formRef} layout="vertical" initialValues={estado}>
                        <Row style={{ flexDirection: "row" }}>
                            <Col lg={24} md={24} sm={24} xs={24}>
                                <Table
                                    className="gx-table-responsive"
                                    columns={columns}
                                    loading={btnActualizar}
                                    dataSource={imagenes}
                                    rowSelection={{ type: 'check', ...rowSelection }}
                                    size="small"
                                    pagination={{ pageSize: 25 }}
                                    scroll={{ y: 300 }}
                                />
                            </Col>
                            <Col lg={24} md={24} sm={24} xs={24} style={{ alignItems: 'flex-end', display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="primary" disabled={btnActualizar} onClick={() => onClickActualizarModal()}>Actualizar Imagenes</Button>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Modal>
        </>
    )
}

export default ModalImagenes;