import { Modal } from 'antd'
import React from 'react'

export const ModalDiagnostico = ({ modalDiagnostico, setModalDiagnostico, setTabDefault }) => {
    return (
        <Modal
            title="Alerta al Guardar"
            okText="Aceptar"
            cancelText="Cancelar"
            visible={modalDiagnostico}
            onCancel={() => setModalDiagnostico(false)}
            onOk={() => {
                setTabDefault("3")
                setModalDiagnostico(false)
            }}
        >
            Dr(a). No ha llenado la sección de Diagnostico (CIE10).
            Es obligatorio el llenado de este para finalizar la consulta.
        </Modal>


    )
}
