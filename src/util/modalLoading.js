import Modal from '@mui/material/Modal';
import git from '../assets/loadingGif/cargando.gif';

function ModalLoading() {
	return (
		<Modal
			open={true}
			onClose={() => {}}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<div
					style={{
						height: 120,
						width: 120,
						backgroundColor: 'white',
						borderRadius: 60,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<img src={git} alt="cargando" />
				</div>
			</div>
		</Modal>
	);
}

export default ModalLoading;
