import moment from 'moment';
import Barcode from 'react-barcode';

export const ImpresionImagenes = ({
	fechaActual,
	medico,
	cmp,
	especialidad,
	paciente,
	historiaClinica,
	dni,
	fechaNacimiento,
	codMedico,
	estados,
	firma,
}) => {
	const fff = moment(fechaNacimiento.format('YYYY-MM-DD'), 'YYYY-MM-DD');

	const an = moment().diff(fechaNacimiento.format('YYYY-MM-DD'), 'years');
	let mes = moment().diff(fechaNacimiento.format('YYYY-MM-DD'), 'months');
	mes = mes % 12;
	const abc = fff.add(an * 12 + mes, 'months');
	let dia = moment().diff(abc.format('YYYY-MM-DD'), 'days');

	const estadoImagen = estados.imagenes.dataProcedimiento;
	const recomendacion = estados.imagenes.recomendacion;

	return (
		<div>
			<div style={{ textAlign: 'center', fontSize: 18, marginBottom: 15, marginTop: 15 }}>
				<b>Ordenes para imagenes</b>
			</div>
			<div>
				<b>FECHA ANTENCIÓN : </b> {fechaActual} <br />
				<b>MEDICO : </b> {medico}
				<br />
				<b>CMP : </b> COLEGIO MEDICO DEL PERU {cmp}
				<br />
				<b>ESPECILIDAD : </b> {especialidad}
				<br />
				---------------------------------------------------------------
				<br />
				<b>PACIENTE : </b> <br />
				{paciente}
				<br />
				H.C.: {historiaClinica} DNI - {dni}
				<br />
				{an} años {mes} meses {dia} días
				<div style={{ fontSize: 8 }}>
					-----------------------------------------------------------------------------------
					<br />
					<div style={{ width: '60%', float: 'left' }}>SERVICIO</div>{' '}
					<div style={{ width: '35%', float: 'right' }}>ESPECIALIDAD</div>
					<br />
					-----------------------------------------------------------------------------------
					<br />
					{estadoImagen.map(e => (
						<div key={e.key}>
							<div style={{ width: '60%', float: 'left' }}>{e.COD_PROD + ' - ' + e.DESC_PROD} </div>
							<div style={{ width: '35%', float: 'right' }}> {e.NOM_LAB}</div>
							<br />
						</div>
					))}
				</div>
				<br />
				<div style={{ textAlign: 'center', marginTop: 10, marginBottom: 10 }}>INDICACIONES</div>
				{recomendacion}
				<br />
				{/* ---------------------------------------------------------------- */}
				{/* <br /> */}
				{/* ---------------------------------------------------------------- */}
				{/* <br /> */}
				<div
					style={{ marginTop: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
				>
					<img src={firma} style={{ width: '55%' }} />
				</div>
				<div style={{ textAlign: 'center' }}>
					------------------------------------------- <br />
					Sello / Firma / Codigo Profesiona
				</div>
				<div style={{ marginLeft: -15 }}>
					<Barcode value={'*' + codMedico + '*'} format="CODE128" height={58} width={2} />
				</div>
			</div>
		</div>
	);
};
export const ImpresionLaboratorio = ({
	fechaActual,
	medico,
	cmp,
	especialidad,
	paciente,
	historiaClinica,
	dni,
	fechaNacimiento,
	codMedico,
	estados,
	firma,
}) => {
	const fff = moment(fechaNacimiento.format('YYYY-MM-DD'), 'YYYY-MM-DD');

	const an = moment().diff(fechaNacimiento.format('YYYY-MM-DD'), 'years');
	let mes = moment().diff(fechaNacimiento.format('YYYY-MM-DD'), 'months');
	mes = mes % 12;
	const abc = fff.add(an * 12 + mes, 'months');
	let dia = moment().diff(abc.format('YYYY-MM-DD'), 'days');

	const estadoLaboratorio = estados.laboratorio.dataProcedimiento;
	const recomendacion = estados.laboratorio.recomendacion;

	return (
		<div>
			<div style={{ textAlign: 'center', fontSize: 18, marginBottom: 15, marginTop: 15 }}>
				<b>Ordenes para Laboratorio</b>
			</div>
			<div>
				<b>FECHA ANTENCIÓN : </b> {fechaActual} <br />
				<b>MEDICO : </b> {medico}
				<br />
				<b>CMP : </b> COLEGIO MEDICO DEL PERU {cmp}
				<br />
				<b>ESPECILIDAD : </b> {especialidad}
				<br />
				---------------------------------------------------------------
				<br />
				<b>PACIENTE : </b> <br />
				{paciente}
				<br />
				H.C.: {historiaClinica} DNI - {dni}
				<br />
				{an} años {mes} meses {dia} días
				<div style={{ fontSize: 8 }}>
					-----------------------------------------------------------------------------------
					<br />
					<div style={{ width: '60%', float: 'left' }}>SERVICIO</div>{' '}
					<div style={{ width: '35%', float: 'right' }}>ESPECIALIDAD</div>
					<br />
					-----------------------------------------------------------------------------------
					<br />
					{estadoLaboratorio.map(e => (
						<div key={e.key}>
							<div style={{ width: '60%', float: 'left' }}>{e.COD_PROD + ' - ' + e.DESC_PROD} </div>
							<div style={{ width: '35%', float: 'right' }}> {e.NOM_LAB}</div>
							<br />
						</div>
					))}
				</div>
				<br />
				<br />
				<div style={{ textAlign: 'center', marginTop: 10, marginBottom: 10 }}>INDICACIONES</div>
				{recomendacion}
				{/* ----------------------------------------------------------------
				<br />
				---------------------------------------------------------------- */}
				<br />
				<div
					style={{ marginTop: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
				>
					<img src={firma} style={{ width: '55%' }} />
				</div>
				<div style={{ textAlign: 'center' }}>
					------------------------------------------- <br />
					Sello / Firma / Codigo Profesional
				</div>
				<div style={{ marginLeft: -15 }}>
					<Barcode value={'*' + codMedico + '*'} format="CODE128" height={58} width={2} />
				</div>
			</div>
		</div>
	);
};
export const ImpresionProcedimientos = ({
	fechaActual,
	medico,
	cmp,
	especialidad,
	paciente,
	historiaClinica,
	dni,
	fechaNacimiento,
	codMedico,
	estados,
	firma,
}) => {
	const fff = moment(fechaNacimiento.format('YYYY-MM-DD'), 'YYYY-MM-DD');

	const an = moment().diff(fechaNacimiento.format('YYYY-MM-DD'), 'years');
	let mes = moment().diff(fechaNacimiento.format('YYYY-MM-DD'), 'months');
	mes = mes % 12;
	const abc = fff.add(an * 12 + mes, 'months');
	let dia = moment().diff(abc.format('YYYY-MM-DD'), 'days');

	const estadoProcedimiento = estados.procedimientoReducer.dataProcedimiento;
	const recomendacionProcedimiento = estados.procedimientoReducer.recomendacion;
	const estadoProcedimeintoInterconsultas = estados.procedimientoInterconsulta.dataProcedimiento;
	const recomendacionProcedimientoInterconsulta = estados.procedimientoInterconsulta.recomendacion;

	const dataDiagnostico = estados.diagnostico;

	return (
		<div>
			<div style={{ textAlign: 'center', fontSize: 18, marginBottom: 15, marginTop: 15 }}>
				<b>Ordenes Procedimientos</b> <br />
				<b>y/o Consultas</b>
			</div>
			<div>
				<b>FECHA ANTENCIÓN : </b> {fechaActual} <br />
				<b>MEDICO : </b> {medico}
				<br />
				<b>CMP : </b> COLEGIO MEDICO DEL PERU {cmp}
				<br />
				<b>ESPECILIDAD : </b> {especialidad}
				<br />
				---------------------------------------------------------------
				<br />
				<b>PACIENTE : </b> <br />
				{paciente}
				<br />
				H.C.: {historiaClinica} DNI - {dni}
				<br />
				{an} años {mes} meses {dia} días
				<div style={{ textAlign: 'center', marginTop: 10, marginBottom: 3 }}>CONSULTAS</div>
				<div style={{ fontSize: 8 }}>
					-----------------------------------------------------------------------------------
					<br />
					<div style={{ width: '60%', float: 'left' }}>SERVICIO</div>{' '}
					<div style={{ width: '35%', float: 'right' }}>ESPECIALIDAD</div>
					<br />
					-----------------------------------------------------------------------------------
					<br />
					{estadoProcedimiento.map(e => (
						<div key={e.key}>
							<div style={{ width: '60%', float: 'left' }}>{e.COD_PROD + ' - ' + e.DESC_PROD} </div>
							<div style={{ width: '35%', float: 'right' }}> {e.NOM_LAB}</div>
							<br />
						</div>
					))}
					<br />
				</div>
				<div style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }}>
					<div>INDICACIONES CONSULTA</div>
				</div>
				<div style={{ marginBottom: 2 }}>{recomendacionProcedimiento}</div>
				----------------------------------------------------------------
				{/* ---------------------------------------------------------------- */}
				<br />
				<div>
					<div style={{ textAlign: 'center', marginTop: 20, marginBottom: 3 }}>INTERCONSULTAS</div>
				</div>
				<div style={{ fontSize: 8 }}>
					-----------------------------------------------------------------------------------
					<br />
					<div style={{ width: '60%', float: 'left' }}>SERVICIO</div>{' '}
					<div style={{ width: '35%', float: 'right' }}>ESPECIALIDAD</div>
					<br />
					-----------------------------------------------------------------------------------
					<br />
					{estadoProcedimeintoInterconsultas.map(e => (
						<div key={e.key}>
							<div style={{ width: '60%', float: 'left' }}>{e.COD_PROD + ' - ' + e.DESC_PROD} </div>
							<div style={{ width: '35%', float: 'right' }}> {e.NOM_LAB}</div>
							<br />
						</div>
					))}
				</div>
				<div style={{ textAlign: 'center', marginTop: 60, marginBottom: 10 }}>
					<div>INDICACIONES INTERCONSULTA</div>
				</div>
				{recomendacionProcedimientoInterconsulta}
				{/* ----------------------------------------------------------------
				<br />
				---------------------------------------------------------------- */}
				<br />
				<div style={{ fontSize: 8, marginTop: 10 }}>
					<b>DIAGNÓSTICO</b>
				</div>
				----------------------------------------------------------------
				<br />
				<div style={{ fontSize: 8 }}>
					{dataDiagnostico.map(e => (
						<div key={e.key}>
							{e.cie + ' - ' + e.diagnostico}
							<br />
						</div>
					))}
					<div
						style={{
							marginTop: 50,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<img src={firma} style={{ width: '55%' }} />
					</div>
					<div style={{ textAlign: 'center' }}>
						------------------------------------------- <br />
						Sello / Firma / Codigo Profesional
					</div>
					<div style={{ marginLeft: -15 }}>
						<Barcode value={'*' + codMedico + '*'} format="CODE128" height={58} width={2} />
					</div>
				</div>
			</div>
		</div>
	);
};
export const ImpresionTratamientos = ({
	fechaActual,
	medico,
	cmp,
	especialidad,
	paciente,
	historiaClinica,
	dni,
	fechaNacimiento,
	codMedico,
	estados,
	firma,
}) => {

	const fff = moment(fechaNacimiento.format('YYYY-MM-DD'), 'YYYY-MM-DD');

	const an = moment().diff(fechaNacimiento.format('YYYY-MM-DD'), 'years');
	let mes = moment().diff(fechaNacimiento.format('YYYY-MM-DD'), 'months');
	mes = mes % 12;
	const abc = fff.add(an * 12 + mes, 'months');
	let dia = moment().diff(abc.format('YYYY-MM-DD'), 'days');

	const estadoTratamientos = estados.tratamientoDetalle;
	const dataDiagnostico = estados.diagnostico;

	return (
		<div>
			<div style={{ textAlign: 'center', fontSize: 18, marginBottom: 15, marginTop: 15 }}>
				<b>RECETA UNICA</b> <br />
				<b>ESTANDARIZADA</b>
			</div>
			<div>
				<b>FECHA ANTENCIÓN : </b> {fechaActual} <br />
				<b>MEDICO : </b> {medico}
				<br />
				<b>CMP : </b> COLEGIO MEDICO DEL PERU {cmp}
				<br />
				<b>ESPECILIDAD : </b> {especialidad}
				<br />
				---------------------------------------------------------------
				<br />
				<b>PACIENTE : </b> <br />
				{paciente}
				<br />
				H.C.: {historiaClinica} DNI - {dni}
				<br />
				{an} años {mes} meses {dia} días
				<div style={{ fontSize: 8 }}>
					-----------------------------------------------------------------------------------
					<br />
					<div style={{ width: '60%', float: 'left' }}>DIAGNÓSTICO</div> <br />
					-----------------------------------------------------------------------------------
					{dataDiagnostico.map(e => (
						<div key={e.key}>
							{e.cie + ' - ' + e.diagnostico}
							<br />
						</div>
					))}
					<br />
				</div>
				<div>
					<div style={{ textAlign: 'center', marginTop: 20, marginBottom: 3 }}>INDICACIONES</div>
				</div>
				<div style={{ fontSize: 8 }}>
					-----------------------------------------------------------------------------------
					<br />
					{estadoTratamientos.map(e => (
						<div key={e.key} style={{ paddingBottom: 7 }}>
							<div style={{ paddingBottom: 2 }}>
								(GENÉRICO) / MEDICAMENTO:&nbsp;&nbsp;{e.descprod}
							</div>{' '}
							{/* <div style={{ paddingBottom: 2}}>{e.descprod}</div>{' '} */}
							<div style={{ paddingBottom: 2 }}>VIA ADMINISTRACIÓN:&nbsp;&nbsp;{e.etiquetaVia}</div>
							{/* <div style={{ paddingBottom: 2}}>{e.etiquetaVia}</div> */}
							<div style={{ paddingBottom: 2 }}>FREC. (VEZ x DIA):&nbsp;&nbsp;{e.frecuencia}</div>
							{/* <div style={{ paddingBottom: 2}}>{e.frecuencia + ' x ' + e.duracion}</div> */}
							<div style={{ paddingBottom: 2 }}>DURA. (DIA):&nbsp;&nbsp;{e.duracion}</div>
							{/* <div style={{ paddingBottom: 2}}>{e.duracion}</div> */}
							<div style={{ paddingBottom: 2 }}>
								RECOMEND. APLICAR:&nbsp;&nbsp;{e.recomendacionAplicar}
							</div>
						</div>
					))}
					<br />
					<div
						style={{
							marginTop: 50,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<img src={firma} style={{ width: '55%' }} />
					</div>
					<div style={{ textAlign: 'center' }}>
						------------------------------------------- <br />
						Sello / Firma / Codigo Profesional
					</div>
					<div style={{ marginLeft: -15 }}>
						<Barcode value={'*' + codMedico + '*'} format="CODE128" height={58} width={2} />
					</div>
				</div>
			</div>
		</div>
	);
};
