import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import { notification } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";



export const ModalGuardar = ({ modalGuardar, setModalGuardar, registrarDatos }) => {

    const confirmarRegistro = () => {
        setModalGuardar(false);
        registrarDatos();
        openNotification();
    }

    const openNotification = () => {
        const key = `open${Date.now()}`;
        notification.open({
            duration: 2,
            style: { color: '#52c41a' },
            icon: <CheckCircleOutlined />,
            message: 'Guardado Correctamente',
            description: 'Se han guardados los cambios',
            key,
        });
    };


    return (
        <>
            <SweetAlert
                title="¿Desea guardar los cambios del odontograma?"
                show={modalGuardar}
                warning
                showCancel
                cancelBtnText="Cancelar"
                onCancel={() => setModalGuardar(false)}
                confirmBtnText="Aceptar"
                onConfirm={() => confirmarRegistro()}>
            </SweetAlert>
        </>
    )
}
