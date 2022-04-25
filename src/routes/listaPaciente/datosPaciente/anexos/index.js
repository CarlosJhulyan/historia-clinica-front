import { useSelector } from 'react-redux';
import AnexosFirestore from './firestore';
import AnexosLocal from './local';

const Anexos = ({ datosModal }) => {
	const anexo = useSelector(state => state.anexo);

	const tipoAnexo = anexo.tipo;

	return (
		<div>
			{tipoAnexo !== 'local' ? (
				<AnexosFirestore datosModal={datosModal}></AnexosFirestore>
			) : (
				<AnexosLocal datosModal={datosModal}></AnexosLocal>
			)}
		</div>
	);
};

export default Anexos;
