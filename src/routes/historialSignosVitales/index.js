import React from 'react';
import { ToastContainer } from 'react-toastify';

import Cuadro from './cuadro';

const HistorialSignosVitales = () => {
	return (
		<>
			<Cuadro />
			<ToastContainer pauseOnHover={false} />
		</>
	);
};

export default HistorialSignosVitales;
