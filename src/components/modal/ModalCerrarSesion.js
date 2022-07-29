import { CheckCircleOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import moment from 'moment';
import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useHistory } from 'react-router';
import { useAuth } from '../../authentication';
import { useSelector } from 'react-redux';

export const ModalCerrarSesion = ({ modalCerar, setModalCerrar, cerrarSesion }) => {
	const { userSignOut } = useAuth();
	const history = useHistory();

	const onConfirmAtendido = () => {
		setModalCerrar(false);
	};

	const onLogoutClick = () => {
		userSignOut(() => {
			history.push('/');
		});
	};

	return (
		<>
			<SweetAlert
				title="ESTAS APUNTO DE CERRA SESIÓN?"
				show={modalCerar}
				style={{
					width: '30%',
				}}
				warning
				showCancel={modalCerar}
				cancelBtnText="Quedarme"
				onCancel={() => onConfirmAtendido()}
				confirmBtnText="¡Irme de paseo!"
				onConfirm={() => {
					onLogoutClick();
					cerrarSesion();
				}}
			>
				¡SI DESEA PUEDE PERMANCES EN LA PAGINA!
			</SweetAlert>
		</>
	);
};
