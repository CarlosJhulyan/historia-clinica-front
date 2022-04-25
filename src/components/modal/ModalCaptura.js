import { Modal } from 'antd';
import React from 'react';

export const ModalCaptura = ({ modalCapturar, setImagen, imagen }) => {

    const downloadImage = () => {
        var link = document.createElement('a');
        link.download = 'odontograma.png';
        link.href = imagen;
        link.click();
        console.log('Guardandoooooooooooooo');
        setImagen(null);
    }

    return (
        <Modal
            title="Odontograma Capturado"
            visible={modalCapturar}
            onOk={() => downloadImage()}
            okText="Guardar"
            cancelText="Cancelar"
            onCancel={() => setImagen(null)}
            width="60%">

            <img src={imagen} alt="img"></img>

        </Modal>
    )
}
