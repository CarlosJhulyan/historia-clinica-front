import React, {
  useState
} from 'react';
import { 
  AutoComplete,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
} from 'antd';
import axios from 'axios';
import { httpClient } from '../../util/Api';
import { openNotification } from '../../util/util';


function ModalAtencionMedica({
  setAbrirModalConsulta,
  dataConsultorios,
  dataEspecialidades,
  abrirModalConsulta,
  traerConsultorios,
  setDataSend,
  dataSend,
  loadingDataConsultorio,
  setDataCabecera,
  setDataDetalles,
  setPedidoFound
}) {
  const { Option } = Select;
  const [valueCOD, setValueCOD] = useState('');
  const [optionsCOD, setOptionsCOD] = useState([]);
  const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());
  const [peticion, setPeticion] = useState(false);
  const [loadingInsertarConsultaMedica, setLoadingInsertarConsultaMedica] = useState(false);
  const [abrirModalConfirmacion, setAbrirModalConfirmacion] = useState(false);

  const handleChangeEspecialidad = e => {
    traerConsultorios(e);
    setDataSend({
      ...dataSend,
      COD_ESPECIALIDAD: e,
      COD_BUS: ''
    });
  }

  const handleChangeConsultorio = e => {
    setDataSend({
      ...dataSend,
      COD_BUS: e
    });
  }

  const onSelectCOD = data => {
		optionsCOD.forEach(element => {
			if (element.key === data) {
				setDataSend({
          ...dataSend,
					COD_MEDICO: element.cod_medico,
					NOM_MEDICO: `${element.des_nom_medico + ' ' + element.des_ape_medico}`,
				});
			}
      setValueCOD(element.num_cmp);
		});
	};

  const onChangeCOD = data => {
    setValueCOD(data);
		if (data.length <= 3) {
			setOptionsCOD([]);
		}
	};

  const onSearchCOD = async (data) => {
		var cod = data;
		if (cod ? cod.length >= 4 : false) {
			setPeticion(true);
			setOptionsCOD();
			const respuesta = await httpClient.post(
				'modulos/getDataMedicos',
				{
					num_cmp: cod,
					des_nom_medico: '',
				},
				{ cancelToken: cancelSource.token }
			);
			var array1 = respuesta.data.data;
			for (let i = 0; i < array1.length; i++) {
				if (array1[i].asignado === '0') {
					delete array1[i];
				} else {
					array1[i].key = array1[i].cod_medico;
					array1[i].value = array1[i].cod_medico;
					array1[i].label = (
						<div>
							{array1[i].num_cmp}
							<div style={{ color: '#a3a3a3' }}>{array1[i].des_ape_medico}</div>
						</div>
					);
				}
			}
			setOptionsCOD(array1);
		} else {
			if (peticion) {
				cancelSource.cancel('COD Cancelado');
				setCancelSource(axios.CancelToken.source());
			}
		}
	};

  const insertarConsultaMedica = async () => {
    setLoadingInsertarConsultaMedica(true);
    try {
      const { data: { data: atencionMedica = '', success, message } } = await httpClient.post('atencionMedica/setConsultaMedica', dataSend);
      if (success) {
        openNotification('Atención Médica', message + ': ' + atencionMedica);
        setDataCabecera([{}]);
        setDataDetalles([{}]);
        setPedidoFound(false);
        setAbrirModalConfirmacion(false);
        setAbrirModalConsulta(false);
      } else {
        openNotification('Atención Médica', message, 'Warning');
      }
    } catch (error) {
      console.error(error);
    }
    setLoadingInsertarConsultaMedica(false);
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
    },
  };

  return (
    <>
      <Modal
        title='Datos Consulta Médica'
        closable={false}
        okText='Aceptar'
        cancelText='Salir'
        centered
        onCancel={() => setAbrirModalConsulta(false)}
        onOk={() => setAbrirModalConfirmacion(true)}
        width={600}
        visible={abrirModalConsulta}>
          <Form {...formItemLayout}>
            <Form.Item
              name="numComprobante"
              label="Médico"
            >
              <Input.Group>
                <Row gutter={24}>
                  <Col span={8}>
                  <AutoComplete
                    value={valueCOD}
                    options={optionsCOD}
                    onSearch={onSearchCOD}
                    onSelect={onSelectCOD}
                    onChange={onChangeCOD}
                    style={{ width: '100%' }}
                  />
                  </Col>
                  <Col span={16}>
                    <Input 
                      name='NOM_MEDICO'
                      disabled
                      value={dataSend.NOM_MEDICO} />
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
            <Form.Item
              label="Especialidad"
            >
              <Select onChange={handleChangeEspecialidad} value={dataSend.COD_ESPECIALIDAD}>
                {
                  dataEspecialidades.map((item) => (
                    <Option key={item.key} value={item.value}>{item.descripcion}</Option>
                  ))
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="Consultorio"
            >
              <Select disabled={loadingDataConsultorio} loading={loadingDataConsultorio} onChange={handleChangeConsultorio} value={dataSend.COD_BUS}>
              {
                  dataConsultorios.map((item) => (
                    <Option key={item.key} value={item.value}>{item.descripcion}</Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Form>
      </Modal>
      <Modal
        centered
        width={350}
        closable={false}
        title='Confirmación'
        onCancel={() => setAbrirModalConfirmacion(false)}
        onOk={() => insertarConsultaMedica()}
        okButtonProps={{
          loading: loadingInsertarConsultaMedica,
        }}
        cancelButtonProps={{
          disabled: loadingInsertarConsultaMedica,
        }}
        visible={abrirModalConfirmacion}>
          ¿Desea grabar la solicitud de atención?
      </Modal>
    </>
  )
}

export default ModalAtencionMedica