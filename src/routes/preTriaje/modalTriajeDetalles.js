import React, {
  useEffect,
  useState,
  useCallback
} from 'react';
import {
  Form,
  Modal,
  Spin,
} from 'antd';

function ModalTriajeDetalles({
                               visible,
                               setVisible,
                               filaActual
                             }) {
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState(filaActual);

  const formItemLayout = {
    labelCol: {
      sm: { span: 12 },
    },
    wrapperCol: {
      sm: { span: 12 },
    },
  };

  return (
    <Modal
      title='Detalles Triaje'
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={false}
      centered
      width={400}
    >
      {loadingData ? (
        <div style={{ textAlign: 'center' }}>
          <Spin tip='Cargando detalles de triaje' />
        </div>
      ) : (
        <Form {...formItemLayout} style={{ width: '100%' }}>
          <Form.Item label='P. Arterial'>
            <span>{data.pa_1} x {data.pa_2}</span> MMHG.
          </Form.Item>
          <Form.Item label='F. Resporatoria'>
            <span>{data.fr}</span> X'.
          </Form.Item>
          <Form.Item label='F. Cardiaca'>
            <span>{data.fc}</span> X'.
          </Form.Item>
          <Form.Item label='Temperatura'>
            <span>{data.temp}</span> °C.
          </Form.Item>
          <Form.Item label='Peso'>
            <span>{data.peso}</span> Kg.
          </Form.Item>
          <Form.Item label='Talla'>
            <span>{data.talla}</span> cms.
          </Form.Item>
          <Form.Item label='Saturacion O2'>
            <span>{data.saturacion_oxigeno}</span> %
          </Form.Item>
        </Form>
      )}

    </Modal>
  )
}

export default ModalTriajeDetalles;
