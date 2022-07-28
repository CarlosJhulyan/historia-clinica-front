import React, { useState, createRef, useMemo } from 'react';
import { Checkbox, Col, Modal, Row, Form, AutoComplete, notification, Divider, Radio, Button } from 'antd';
import { httpClient } from '../../../util/Api';
import { notificaciones, openNotification } from '../../../util/util';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ModalAsignacion = ({
                           abrirModal,
                           setAbrirModal,
                           filaActual,
                           modulos,
                           traerUsuarios,
                           numDocumento,
                           setNumDocumento
}) => {
	const formRef = createRef();
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const onChange = e => {
		console.log(e);
		setValores(e);
	};
	const [valores, setValores] = useState(filaActual ? obtenerValores(filaActual.modulos) : []);
	const [loading, setLoading] = useState(false);

	const [valueCMP, setValueCMP] = useState('');
	const [optionsCMP, setOptionsCMP] = useState([]);
	const [valueNOM, setValueNOM] = useState('');
	const [optionsNOM, setOptionsNOM] = useState([]);

	const [areaDesignada, setAreaDesignada] = useState('1');
	const opcionesHC = crearOpcionesHC(modulos);
	const opcionesHospi = crearOpcionesHospi(modulos);

	const [cod, setCod] = useState('');

	const token = JSON.parse(localStorage.getItem('token'));
	const tokenAdmin = JSON.parse(localStorage.getItem('token-admin'));

	const handleChangeAreaDesignada = (e) => {
    setAreaDesignada(e.target.value);
  }

	const [cancelSource, setCancelSource] = useState(axios.CancelToken.source());
	const [peticion, setPeticion] = useState(false);

	const guardarAssignacion = async () => {
		try {
			const repuesta = await httpClient.post('modulos/asignaModulos', {
				codMedico: filaActual ? filaActual.cod_medico : cod,
				modulos: valores,
				codMedico1: tokenAdmin.login_usu,
			});
			setAbrirModal(false);
			notificaciones('Modulos asignado correctamente.', 'success');
			return repuesta.data;
		} catch (error) {
			throw error;
		}
	};

	const onSearchCMP = async searchText => {
		var cmp = formRef.current.getFieldValue('num_cmp');
		if (cmp ? cmp.length >= 2 : false) {
			setPeticion(true);
			setOptionsCMP();
			const respuesta = await httpClient.post(
				'modulos/getDataMedicos',
				{
					num_cmp: cmp,
					des_nom_medico: '',
				},
				{ cancelToken: cancelSource.token }
			);
			var array1 = respuesta.data.data;
			for (let i = 0; i < array1.length; i++) {
				array1[i].key = array1[i].cod_medico;
				array1[i].value = array1[i].cod_medico;
				array1[i].label = array1[i].num_cmp;
			}
			setOptionsNOM();
			setOptionsCMP(array1);
		} else {
			if (peticion) {
				cancelSource.cancel('CMP Cancelado');
				setCancelSource(axios.CancelToken.source());
			}
		}
	};

	const onSearchNOM = async searchText => {
		var nombre = formRef.current.getFieldValue('des_nom_medico');
		if (nombre ? nombre.length >= 4 : false) {
			setPeticion(true);
			setOptionsNOM();
			const respuesta = await httpClient.post(
				'modulos/getDataMedicos',
				{
					num_cmp: '',
					des_nom_medico: nombre,
				},
				{ cancelToken: cancelSource.token }
			);
			var array2 = respuesta.data.data;
			console.log(respuesta.data.data);
			for (let i = 0; i < array2.length; i++) {
				array2[i].key = array2[i].cod_medico;
				array2[i].value = array2[i].cod_medico;
				array2[i].label = (
					<div>
						{array2[i].des_nom_medico}
						<div style={{ color: '#a3a3a3' }}>{' ' + array2[i].des_ape_medico}</div>
					</div>
				);
			}
			setOptionsCMP();
			setOptionsNOM(array2);
		} else {
			if (peticion) {
				cancelSource.cancel('NOM ancelado');
				setCancelSource(axios.CancelToken.source());
			}
		}
	};

	const onSelectCMP = data => {
		optionsCMP.forEach(element => {
      if (!element.num_doc_iden || element.num_doc_iden === null || element.num_doc_iden.trim() === '') {
        openNotification('Asignación de modulos', 'El médico no cuenta con un número de documento de identidad asignado.', 'Warning');
        setNumDocumento('');
      }
			if (element.key === data) {
				formRef.current.setFieldsValue({
					num_cmp: element.num_cmp,
					des_nom_medico: `${element.des_nom_medico + ' ' + element.des_ape_medico}`,
				});
        setNumDocumento(element.num_doc_iden);
			}
		});
		setCod(data);
		setValueCMP(data);
	};

	const onSelectNOM = data => {
		optionsNOM.forEach(element => {
      if (element.num_doc_iden || element.num_doc_iden === null || element.num_doc_iden.trim() !== '') {
        openNotification('Asignación de modulos', 'El médico no cuenta con un número de documento de identidad asignado.', 'Warning');
        setNumDocumento('');
      }
			if (element.key === data) {
				formRef.current.setFieldsValue({
					num_cmp: element.num_cmp,
					des_nom_medico: `${element.des_nom_medico + ' ' + element.des_ape_medico}`,
				});
        setNumDocumento(element.num_doc_iden);
			}
		});
		setCod(data);
		setValueNOM(data);
	};

	const onChangeCMP = data => {
		if (data.length <= 3) {
			setOptionsCMP([]);
		}
	};

	const onChangeNOM = data => {
		if (data.length <= 3) {
			setOptionsNOM([]);
		}
	};

	return (
		<Modal
			footer={[
        <Button onClick={() => setAbrirModal(false)}>
          Cancelar
        </Button>,
        <Button
          onClick={async () => {
            if (numDocumento) {
              if (filaActual) {
                if (valores.length >= 1) {
                  setLoading(true);
                  await guardarAssignacion();
                  await traerUsuarios();
                  setLoading(false);
                } else {
                  notificaciones('Debe asignar almenos 1 módulo.', 'Alerta');
                }
              } else {
                if (cod !== '') {
                  if (valores.length >= 1) {
                    setLoading(true);
                    const respuesta = await guardarAssignacion();
                    if (respuesta?.success) {
                      await traerUsuarios();
                      setLoading(false);
                      setAbrirModal(false);
                      notificaciones('Completado!');
                    } else {
                      notificaciones('El codigo del medico es incorrecto.', 'Alerta');
                      setLoading(false);
                    }
                  } else {
                    notificaciones('Debe asignar almenos 1 módulo.', 'Alerta');
                  }
                } else {
                  notificaciones('Debe ingresar un código de médico', 'Alerta');
                }
              }
            } else notificaciones('Se debe asignar un número de documento al médico', 'Alerta');
          }}
          style={{
            background: themeSettingsGlobal.COD_COLOR_1,
            color: '#fff'
          }}
        >
          Aceptar
        </Button>
      ]}
			confirmLoading={loading}
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
					<div style={{ gridArea: '1 / 1 / 2 / 2', fontSize: '22px' }}>
						{filaActual ? 'Modulos' : 'Agregar Médico'}
					</div>
				</div>
			}
			visible={abrirModal}
			onCancel={() => setAbrirModal(false)}
		>
			{filaActual ? null : (
				<div style={{ paddingLeft: 15, paddingRight: 15, marginBottom: 25 }}>
					<Form ref={formRef} layout="vertical">
						<Row style={{ flexDirection: 'row' }}>
							<Col sm={10} xs={24} style={{ paddingLeft: '0px' }}>
								<Form.Item name="num_cmp">
									<AutoComplete
										value={valueCMP}
										options={optionsCMP}
										onSearch={onSearchCMP}
										onSelect={onSelectCMP}
										onChange={onChangeCMP}
										style={{ width: '100%' }}
										placeholder="Ingrese el CMP"
										// notFoundContent={optionsCMP ? <Spin size="small" /> : null}
									/>
								</Form.Item>
							</Col>
							<Col sm={14} xs={24} style={{ paddingRight: '0px' }}>
								<Form.Item name="des_nom_medico">
									<AutoComplete
										value={valueNOM}
										options={optionsNOM}
										onSearch={onSearchNOM}
										onSelect={onSelectNOM}
										onChange={onChangeNOM}
										style={{ width: '100%' }}
										placeholder="Ingrese el nombre del medico"
										// notFoundContent={optionsCMP ? <Spin size="small" /> : null}
									/>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</div>
			)}
			<div style={{ textAlign: 'center', marginBottom: 30 }}>
				<Radio.Group
					value={areaDesignada}
					// size="small"
					onChange={handleChangeAreaDesignada}
					buttonStyle="solid">
						<Radio.Button
              style={{
                background: areaDesignada === '1' && themeSettingsGlobal.COD_COLOR_1
              }}
              value="1"
            >
              Historia clinica
            </Radio.Button>
						<Radio.Button
              style={{
                background: areaDesignada === '2' && themeSettingsGlobal.COD_COLOR_1
              }}
              value="2"
            >
              Hospitalización
            </Radio.Button>
				</Radio.Group>
			</div>
			<Checkbox.Group style={{ paddingLeft: 15 }} onChange={onChange} value={valores}>
				<Row>{areaDesignada === '1' ? opcionesHC : opcionesHospi}</Row>
			</Checkbox.Group>
		</Modal>
	);
};

const crearOpcionesHC = (modulos) => (
	<>
		{
			modulos.map(modulo => modulo.hc === '1' && (
				<Col key={modulo.id_modulo} span={24}>
					<Checkbox value={modulo.id_modulo}>{modulo.nombre_modulo}</Checkbox>
				</Col>
			))
		}
	</>
);

const crearOpcionesHospi = (modulos) => (
	<>
		{
			modulos.map(modulo => (modulo.hs === '1' && modulo.id_modulo !== '4' && modulo.id_modulo !== '15') && (
				<Col key={modulo.id_modulo} span={24}>
					<Checkbox value={modulo.id_modulo}>{modulo.nombre_modulo}</Checkbox>
				</Col>
			))
		}
	</>
);

const obtenerValores = modulos => {
	const valores = [];
	for (const key in modulos) {
		if (Object.hasOwnProperty.call(modulos, key)) {
			// const element = modulos[key];
			valores.push(key.toString());
		}
	}
	return valores;
};

export default ModalAsignacion;
