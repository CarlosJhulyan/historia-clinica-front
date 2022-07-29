import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { httpClient } from '../../../util/Api';
import { onClickRetroceder } from '../../../util/util';
import DetallesPaciente from './detalles';
import { useSelector } from 'react-redux';

const ModalVisualizar = ({ visualizar, setVisualizar, data, setBtnVisualizar }) => {
	const [datosModalVisualizar, setDatosModalVisualizar] = useState(null);
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);

	const traerDatosModal = async () => {
		setBtnVisualizar(true);
		const resp = await httpClient.post(`/pacientes/getPaciente`, {
			codGrupoCia: data.COD_GRUPO_CIA,
			codPaciente: data.COD_PACIENTE,
		});

		const getAlergia = await httpClient.post(`/pacientes/getAlergias`, {
			codGrupoCia: data.COD_GRUPO_CIA,
			codPaciente: data.COD_PACIENTE,
		});

		console.log("RESP ALERGIA234: ", getAlergia)
		if (getAlergia.data.data.length > 0) {
			resp.data.data.alergias = getAlergia.data.data[0].alergias;
			resp.data.data.otros = getAlergia.data.data[0].otros;
			/* resp.data.data = [...getAlergia.data.data[0], ...resp.data.data,]; */
		}


		console.log('Datos Modal Visualizar 1:', resp.data.data);
		console.log('Datos Modal Visualizar 2:', data);


		/* CODIGO LOCAL */
		/* resp.data.data.FEC_NAC_CLI = moment(resp.data.data.FEC_NAC_CLI, format); */
		resp.data.data.COD_LOCAL_ANTECENDENTE = resp.data.data.COD_LOCAL_ANTECENDENTE === null ? '001' : resp.data.data.COD_LOCAL_ANTECENDENTE;
		resp.data.data.SECUENCIA_ANTECEDENTE = resp.data.data.SECUENCIA_ANTECEDENTE === null ? '0' : resp.data.data.SECUENCIA_ANTECEDENTE;
		resp.data.data.NUM_ATEN_MED = data.NUM_ATEN_MED;
		resp.data.data.COD_CIA = data.COD_CIA;
		/* resp.data.data.alergias = ''; */
		resp.data.data.EDAD = data.EDAD
		resp.data.data.dataMedico = data;


		/* CODIGO LOCAL */
		setDatosModalVisualizar({ estado: { ...resp.data.data } });
		setBtnVisualizar(false);
	};

	useEffect(() => {
		traerDatosModal();
	}, []);

	if (datosModalVisualizar !== null) {
		return (
			<>
        <Modal
          width={1100}
          visible={visualizar}
          cancelText="Salir"
          cancelButtonProps={{
            type: "default",
            style: {background:themeSettingsGlobal.COD_COLOR_1, color: '#fff', border:'none'}
          }}
          onCancel={() => {
            setVisualizar(false);
            onClickRetroceder();
          }}
          okButtonProps={{ hidden: true }}>
          <DetallesPaciente datosModal={datosModalVisualizar}></DetallesPaciente>
        </Modal>
      </>
		);
	} else {
		return null;
	}
};

export default ModalVisualizar;
