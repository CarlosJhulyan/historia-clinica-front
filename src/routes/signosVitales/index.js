import React, { createRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Divider, Input, Form, AutoComplete, Row, Col, DatePicker } from 'antd';
// import ModalDetalles from './modalDetalles';
// import ModalAsignacion from './modalAsignacion';
import { notificaciones } from '../../util/util';
import { httpClient } from '../../util/Api';
import Moment from 'moment';
import axios from 'axios';
import { datosEnviar, funn } from '../../constants/datosEnviar';

import { useIdleTimer } from 'react-idle-timer';
import { useAuth } from '../../authentication';
import { useHistory } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { SearchOutlined } from '@ant-design/icons';

import Formulario from './formulario';

const SignosVitales = () => {
	return (
		<>
			<Formulario />

			<ToastContainer pauseOnHover={false} />
		</>
	);
};

export default SignosVitales;
