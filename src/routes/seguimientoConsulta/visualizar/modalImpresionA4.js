import { Button, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactToPrint from 'react-to-print';
import { ImpresionA4 } from '../../impresiones/a4';
import { ImpresionImagen } from '../../impresiones/imagenes';
import { ImpresionLaboratorio } from '../../impresiones/laboratorio';
import { ImpresionRecetas } from '../../impresiones/recetas';

const pageStyle = `
@page {
    size: 1240px 1754px;
    margin: 0;
}

@media all {
    .pagebreak {
    display: none;
    }
}

@media print {
    .pagebreak {
    page-break-before: always;
    }
}

@media print {
    html, body {
        height: initial !important;
        overflow: initial !important;
        -webkit-print-color-adjust: exact;
    }
}
`;

export const ModalImpresionA4 = ({
	modalImpresionA4,
	setModalImpresionA4,
	datosModal,
	firma,
	cmp,
}) => {
	const imagenes = useSelector(state => state.imagenes);
	const laboratorio = useSelector(state => state.laboratorio);
	const tratamientoDetalle = useSelector(state => state.tratamientoDetalle);
  const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
	const [modalHC, setModalHC] = useState(false);
	const [modalRecetas, setModalRecetas] = useState(false);
	const [modalLaboratorio, setModalLaboratorio] = useState(false);
	const [modalImagenes, setModalImagenes] = useState(false);

	console.log('A4::', {
		datosModal: datosModal,
		imagenes: imagenes,
		laboratorio: laboratorio,
		tratamientoDetalle: tratamientoDetalle,
	});

	const impresionRef = useRef();

	return (
		<>
			<Modal
				title="Imprimir A4"
				cancelButtonProps={{ hidden: true }}
				width={305}
				visible={modalImpresionA4}
				maskClosable={false}
				onCancel={() => setModalImpresionA4(false)}
        okType='default'
        okButtonProps={{
          style: {background:themeSettingsGlobal.COD_COLOR_1, color: '#fff', border:'none'},
          hidden: true
        }}
			>
				<div
					style={{
						width: '100%',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: 15,
					}}
				>
					<div>Historia Clinica</div>
					<div>
						<Button onClick={() => setModalHC(true)} style={{ margin: 0 }}>
							Ver
						</Button>
					</div>
				</div>

				{laboratorio.dataProcedimiento.length > 0 || laboratorio.recomendacion.length > 0 ? (
					<div
						style={{
							width: '100%',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: 15,
						}}
					>
						<div>Laboratorio</div>
						<div>
							<Button onClick={() => setModalLaboratorio(true)} style={{ margin: 0 }}>
								Ver
							</Button>
						</div>
					</div>
				) : null}

				{imagenes.dataProcedimiento.length > 0 || imagenes.recomendacion.length > 0 ? (
					<div
						style={{
							width: '100%',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: 15,
						}}
					>
						<div>Imagenes</div>
						<div>
							<Button onClick={() => setModalImagenes(true)} style={{ margin: 0 }}>
								Ver
							</Button>
						</div>
					</div>
				) : null}

				{tratamientoDetalle.length > 0 ? (
					<div
						style={{
							width: '100%',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: 15,
						}}
					>
						<div>Recetas</div>
						<div>
							<Button onClick={() => setModalRecetas(true)} style={{ margin: 0 }}>
								Ver
							</Button>
						</div>
					</div>
				) : null}
			</Modal>
			{modalHC ? (
				<Modal
					maskClosable={false}
					width="1240px"
					bodyStyle={{ padding: '0px' }}
					visible={modalHC}
					footer={[
						<ReactToPrint
							pageStyle={pageStyle}
							trigger={() =>
                <Button style={{ background: themeSettingsGlobal.COD_COLOR_1, color: '#fff' }}>Imprimir</Button>}
							content={() => impresionRef.current}
						/>,
					]}
					onCancel={() => setModalHC(false)}
				>
					<div ref={impresionRef}>
						<ImpresionA4 firma={firma} datosModal={datosModal} />
					</div>
				</Modal>
			) : null}
			{modalRecetas ? (
				<Modal
					maskClosable={false}
					width="1240px"
					bodyStyle={{ padding: '0px' }}
					visible={modalRecetas}
					footer={[
						<ReactToPrint
							pageStyle={pageStyle}
							trigger={() => <Button style={{	background: themeSettingsGlobal.COD_COLOR_1, color: '#fff'}}>Imprimir</Button>}
							content={() => impresionRef.current}
						/>,
					]}
					onCancel={() => setModalRecetas(false)}
				>
					<div ref={impresionRef}>
						<ImpresionRecetas cmp={cmp} firma={firma} datosModal={datosModal} />
					</div>
				</Modal>
			) : null}
			{modalLaboratorio ? (
				<Modal
					maskClosable={false}
					width="1240px"
					bodyStyle={{ padding: '0px' }}
					visible={modalLaboratorio}
					footer={[
						<ReactToPrint
							pageStyle={pageStyle}
							trigger={() => <Button style={{	background: themeSettingsGlobal.COD_COLOR_1, color: '#fff'}}>Imprimir</Button>}
							content={() => impresionRef.current}
						/>,
					]}
					onCancel={() => setModalLaboratorio(false)}
				>
					<div ref={impresionRef}>
						<ImpresionLaboratorio cmp={cmp} firma={firma} datosModal={datosModal} />
					</div>
				</Modal>
			) : null}
			{modalImagenes ? (
				<Modal
					maskClosable={false}
					width="1240px"
					bodyStyle={{ padding: '0px' }}
					visible={modalImagenes}
					footer={[
						<ReactToPrint
							pageStyle={pageStyle}
							trigger={() => <Button style={{	background: themeSettingsGlobal.COD_COLOR_1, color: '#fff'}}>Imprimir</Button>}
							content={() => impresionRef.current}
						/>,
					]}
					onCancel={() => setModalImagenes(false)}
				>
					<div ref={impresionRef}>
						<ImpresionImagen cmp={cmp} firma={firma} datosModal={datosModal} />
					</div>
				</Modal>
			) : null}
		</>
	);
};
