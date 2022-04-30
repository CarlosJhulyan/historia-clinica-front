import React, { 
  useState, 
  useCallback,
  useEffect
} from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Radio,
  Steps
} from 'antd';
import {
  SearchOutlined
} from '@ant-design/icons'

import { httpClient } from '../../util/Api';
import ModalDetalles from '../registroPaciente/modalDetalles';

function ModalTicketAtencion({
  setAbrirModal,
  abrirModal
}) {
  const { Step } = Steps;
  const [current, setCurrent] = React.useState(0);
  const [abrirModalNew, setAbrirModalNew] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState([]);
	const [tipoPariente, setTipoPariente] = useState([]);
	const [estadoCivil, setEstadoCivil] = useState([]);
  const [areaDesignada, setAreaDesignada] = useState('H');

  const traerTipoDocumento = useCallback(async () => {
		const acomp = {
			codGrupoCia: '001',
		};
		const { data: { data = [] } } = await httpClient.post('/pacientes/getTipoDoc', acomp);
		setTipoDocumento(data);
	}, []);

	const traerTipoParientes = useCallback(async () => {
		const acomp = {
			codGrupoCia: '001',
		};
		const { data: { data = [] } } = await httpClient.post('/pacientes/getTipoAcomp', acomp);
		setTipoPariente(data);
	}, []);

	const traerEstadoCivil = useCallback(async () => {
		const acomp = {
			codGrupoCia: '001',
		};
		const { data: { data = [] } } = await httpClient.post('/pacientes/getEstadoCivil', acomp);
		setEstadoCivil(data);
	}, []);

  const handleChangeAreaDesignada = (e) => {
    setAreaDesignada(e.target.value);
  }

  useEffect(() => {
    traerEstadoCivil();
    traerTipoDocumento();
    traerTipoParientes();
  }, [])

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: 'Generar',
      content: (
        <Form style={{ width: '100%' }}>
          <Form.Item label='Ingreso Paciente'>
            <Input.Group compact>
              <Input
                placeholder='Buscar por DNI'
                style={{ width: 'calc(100% - 160px)' }} />
              <Button>
                <SearchOutlined />
              </Button>
              <Button
                onClick={() => setAbrirModalNew(true)}
                type="primary">
                  Crear Nuevo
              </Button>
            </Input.Group>
          </Form.Item>
          <Form.Item
            style={{ textAlign: 'right' }}
            label='Area Designada'>
              <Radio.Group 
                value={areaDesignada} 
                // size="small"
                onChange={handleChangeAreaDesignada}
                buttonStyle="solid">
                  <Radio.Button value="H">Hospitalización</Radio.Button>
                  <Radio.Button value="E">Emergencia</Radio.Button>
                  <Radio.Button value="U">UCI</Radio.Button>
                  <Radio.Button value="S">SOP</Radio.Button>
              </Radio.Group>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Triaje',
      content: 'triaje',
    }
  ];
  
  return (
    <>
      <Modal 
        width="600px"
        closable={false}
        okText="Generar"
        cancelText="Cancelar"
        title={
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: '1fr',
              gridColumnGap: '0px',
              gridRowGap: '0px',
              marginRight: '5%',
            }}
          >
            <div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px' }}>Generar Ticket de Atención</div>
          </div>
        }
        visible={abrirModal}
        onOk={async () => {
          
        }}
        onCancel={() => setAbrirModal(false)}
      >
         <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div style={{ 
          minHeight: '200px',
          paddingTop: '40px',
          textAlign: 'center',
          borderRadius: '2px' }}>
            {steps[current].content}
        </div>
        <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Siguiente
          </Button>
        )}
        {/* {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )} */}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Anterior
          </Button>
        )}
      </div>
      </Modal>

      {abrirModalNew ? (
				<ModalDetalles
					abrirModal={abrirModalNew}
					setAbrirModal={setAbrirModalNew}
					isModalEdit={false}
          tipoDocumento={tipoDocumento}
					estadoCivil={estadoCivil}
					tipoPariente={tipoPariente}
				/>
			) : null}
    </>
  )
}

export default ModalTicketAtencion;