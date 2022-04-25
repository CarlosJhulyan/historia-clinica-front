import { Col, Button, Form, Input, Modal, Row, Space, Spin, Table } from "antd";
import React, { createRef, useEffect, useState, } from "react";
import { SearchOutlined } from '@ant-design/icons';
import { actualizarLaboratorio } from "../apis";

const ModalLaboratorio = ({ datosModal, abrirModal, setAbrirModal, handleDatos, lab, dataSource }) => {

    const dataGlobal = {
        codGrupoCia: datosModal.estado.COD_GRUPO_CIA,
        codLocal: datosModal.estado.COD_LOCAL_ANTECENDENTE,
    }
    const [estado, setEstado] = useState();
    const [medicamentos, setMedicamentos] = useState();
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
            if (lab) {
                setMedicamentos(lab);
                setBotonModal(false);
            }
        }
    }, [abrirModal, medicamentos, lab]);

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
            title: "DESCRIPCIÓN",
            dataIndex: "DESC_PROD",
            key: 'descripcion',
            ...getColumnSearchProps('DESC_PROD'),
        },
        {
            title: "EMPRESA",
            dataIndex: "NOM_LAB",
            key: 'empresa',
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
        await actualizarLaboratorio(dataGlobal)
        setBtnActualizar(false);
    };

    return (
        <>
            <Modal
                width="70%"
                okText="Guardar"
                cancelText="Cancelar"
                title={
                    <div style={{ fontSize: "22px" }}>
                        Laboratorio
                    </div>
                }
                visible={abrirModal}
                onOk={() => handleDatos({ estado })}
                okButtonProps={{
                    disabled: botonModal
                }}
                onCancel={() => setAbrirModal(false)}
            >
                {medicamentos === undefined ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Spin tip="Cargando" />
                    </div>
                ) : (
                    <Form ref={formRef} layout="vertical" initialValues={estado}>
                        <Row
                            style={{ flexDirection: "row" }}>
                            <Col lg={24} md={24} sm={24} xs={24}>
                                <Table
                                    className="gx-table-responsive"
                                    columns={columns}
                                    loading={btnActualizar}
                                    dataSource={medicamentos}
                                    rowSelection={{ type: 'check', ...rowSelection }}
                                    size="small"
                                    pagination={{ pageSize: 25 }}
                                    scroll={{ y: 300 }}
                                />
                            </Col>
                            <Col lg={24} md={24} sm={24} xs={24} style={{ alignItems: 'flex-end', display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="primary" disabled={btnActualizar} onClick={() => onClickActualizarModal()}>Actualizar Laboratorio</Button>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Modal>
        </>
    );
};
export default ModalLaboratorio;
