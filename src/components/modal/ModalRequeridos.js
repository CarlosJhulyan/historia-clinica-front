import { Modal } from 'antd'
import React from 'react'

export const ModalRequeridos = ({ modalRequeridos, setModalRequeridos, setTabDefault }) => {
    return (
        <Modal
            title="Alerta al Guardar"
            okText="Aceptar"
            cancelText="Cancelar"
            visible={modalRequeridos}
            onCancel={() => setModalRequeridos(false)}
            onOk={() => {
                //setTabDefault("3")
                setModalRequeridos(false)
            }}
        >
            Dr(a). Por favor completar los campos requeridos en Enfermedad Actual y Examen Fisico
        </Modal>


    )
}
