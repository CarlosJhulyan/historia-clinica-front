import { useEffect } from 'react';
import { httpClient } from '../../../util/Api';
import PrimeraPartePrueba from './primeraPartePrueba';
import TabTratamiento from './tratamiento';

const PrimeraParte = ({ data }) => {
	useEffect(() => {
		traerCombos();
	}, []);

	const traerCombos = async () => {
		const dataGlobal = [];

		const getVia = await httpClient.get('/combo/maestro');
		const responseVia = await getVia.data.data;
		/* store.dispatch(setComboViaAdmin(responseVia.viaAdministracion)); */

		const getTratamientos = await httpClient.post(`/tratamientos`, {
			codGrupoCia: dataGlobal.codGrupoCia,
			codLocal: dataGlobal.codLocal,
		});

		const responseTratamientos = await getTratamientos.data.data;
		/* store.dispatch(setDataTratamientos(data)); */
	};

	return (
		<div style={{ width: '100%' }}>
			{/* <TabTratamiento /> */}
			<PrimeraPartePrueba />
		</div>
	);
};
export default PrimeraParte;
