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
			<p style={{ fontSize: 12,marginBottom:0}}><strong >FECHA ANTENCIÓN :</strong> {fechaActual} </p>
				<p style={{ fontSize: 12,marginBottom:0}}><strong >MEDICO : </strong> {medico} </p>
				<p style={{ fontSize: 12,marginBottom:0}}><strong >CMP :</strong> COLEGIO MEDICO DEL PERU {cmp} </p>
				<p style={{ fontSize: 12,marginBottom:0}}><strong >ESPECILIDAD :</strong> {especialidad} </p>
				-------------------------------------------------------	
				<br />
				<p style={{ fontSize: 12,marginBottom:0}}><strong >PACIENTE :</strong> {paciente} </p>
				
				<div style={{ fontSize: 13,marginBottom:0}} >
				H.C.: {historiaClinica} DNI - {dni}
				<br />
				{an} años {mes} meses {dia} días
				</div>
			
				<div style={{ fontSize: 12,marginBottom: 20 }}>
				-------------------------------------------------------
					<br />
					<div style={{ width: '60%', float: 'left' }}>SERVICIO</div>{' '}
					<div style={{ width: '35%', float: 'right' }}>ESPECIALIDAD</div>
					<br />
					-------------------------------------------------------
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
				<div style={{ fontSize: 12,textAlign: 'center', marginTop: 10, marginBottom: 10 }}>INDICACIONES</div>
				<div style={{ fontSize: 12}}>
				{recomendacion}
				</div>
				<br />
				{/* ---------------------------------------------------------------- */}
				{/* <br /> */}
				{/* ---------------------------------------------------------------- */}
				{/* <br /> */}
				<div
					style={{ fontSize: 12,marginTop: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
			    <p style={{ fontSize: 12,marginBottom:0}}><strong >FECHA ANTENCIÓN :</strong> {fechaActual} </p>
				<p style={{ fontSize: 12,marginBottom:0}}><strong >MEDICO : </strong> {medico} </p>
				<p style={{ fontSize: 12,marginBottom:0}}><strong >CMP :</strong> COLEGIO MEDICO DEL PERU {cmp} </p>
				<p style={{ fontSize: 12,marginBottom:0}}><strong >ESPECILIDAD :</strong> {especialidad} </p>
				-------------------------------------------------------	
				<br />
				
				<p style={{ fontSize: 12,marginBottom:0}}><strong >PACIENTE :</strong> {paciente} </p>
				
				<div style={{ fontSize: 13,marginBottom:0}} >
					H.C.: {historiaClinica} DNI - {dni}
					<br />
					{an} años {mes} meses {dia} días
				</div>
				
				<div style={{ fontSize: 12,marginBottom: 10 }}>
					-------------------------------------------------------
					<br />
					<div style={{ width: '60%', float: 'left' }}>SERVICIO</div>{' '}
					<div style={{ width: '35%', float: 'right' }}>ESPECIALIDAD</div>
					<br />
					-------------------------------------------------------
					<br />

					<div style={{ marginTop:10,display:'inline-block' }}>
					{estadoLaboratorio.map(e => (
						<div  key={e.key}>
							<div style={{marginBottom:15, fontSize: 12, width: '62%', float: 'left' }}>{e.COD_PROD + ' - ' + e.DESC_PROD} </div>
							<div style={{ fontSize: 12,width: '37%', float: 'right' }}> {e.NOM_LAB}</div>
							<br />
						</div>
					))}
					</div>
					
				</div>
				<div style={{fontSize: 12,marginBottom: 10,display:'inline-block',textAlign: 'center'}}>
				-------------------------------------------------------
				
				INDICACIONES
				<br></br>
				-------------------------------------------------------
				
				</div>			
				

				<div style={{fontSize: 12,marginTop: 20,marginBottom: 10}}>
				
				{recomendacion}
				</div>
				{/* ----------------------------------------------------------------
				<br />
				---------------------------------------------------------------- */}
				<br />
				<br></br>
				<div
					style={{fontSize: 12, marginTop: 20,marginBottom:20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
				>
					<img src={firma} style={{ width: '55%' }} />
				</div>
				<div style={{ textAlign: 'center' ,fontSize: 12, marginTop: 60,marginBottom:20}}>
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
			<p style={{ fontSize: 12,marginBottom:0}}><strong >FECHA ANTENCIÓN :</strong> {fechaActual} </p>
				<p style={{ fontSize: 12,marginBottom:0}}><strong >MEDICO : </strong> {medico} </p>
				<p style={{ fontSize: 12,marginBottom:0}}><strong >CMP :</strong> COLEGIO MEDICO DEL PERU {cmp} </p>
				<p style={{ fontSize: 12,marginBottom:0}}><strong >ESPECILIDAD :</strong> {especialidad} </p>	
				-------------------------------------------------------
				<br />
				<p style={{ fontSize: 12,marginBottom:0}}><strong >PACIENTE :</strong> {paciente} </p>
				
				<div style={{ fontSize: 13,marginBottom:0}} >
				H.C.: {historiaClinica} DNI - {dni}
				<br />
				{an} años {mes} meses {dia} días
				</div>
				
				<div style={{ fontSize: 12,textAlign: 'center', marginTop: 10, marginBottom: 3 }}>CONSULTAS</div>
				<div style={{ fontSize: 12,marginBottom: 10 }}>
				-------------------------------------------------------
					<br />
					<div style={{ width: '60%', float: 'left' }}>SERVICIO</div>{' '}
					<div style={{ width: '35%', float: 'right' }}>ESPECIALIDAD</div>
					<br />
					-------------------------------------------------------
					<br />
					{estadoProcedimiento.map(e => (
						<div key={e.key}>
							<div style={{marginBottom: 10, width: '60%', float: 'left' }}>{e.COD_PROD + ' - ' + e.DESC_PROD} </div>
							<div style={{ width: '35%', float: 'right' }}> {e.NOM_LAB}</div>
							<br />
						</div>
						
					))}
					<br />
				</div>
				<div style={{ display:'inline-block',fontSize: 12, textAlign: 'center', marginTop: 15, marginBottom: 10 }}>
					<div>INDICACIONES CONSULTA</div>
					-------------------------------------------------------
				</div>
				<div style={{ fontSize: 12,marginBottom: 2 }}>{recomendacionProcedimiento}
				
				</div>
				
				{/* ---------------------------------------------------------------- */}
				<br />
				<div>
					<div style={{ fontSize: 12, textAlign: 'center', marginTop: 20, marginBottom: 3 }}>INTERCONSULTAS</div>
				</div>
				<div style={{ fontSize: 12 }}>
				-------------------------------------------------------
					<br />
					<div style={{ width: '60%', float: 'left' }}>SERVICIO</div>{' '}
					<div style={{ width: '35%', float: 'right' }}>ESPECIALIDAD</div>
					<br />
					
					-------------------------------------------------------
					<br />
					{estadoProcedimeintoInterconsultas.map(e => (
						<div key={e.key}>
							<div style={{ width: '60%', float: 'left' }}>{e.COD_PROD + ' - ' + e.DESC_PROD} </div>
							<div style={{ width: '35%', float: 'right' }}> {e.NOM_LAB}</div>
							<br />
						</div>
					))}
				</div>
				<div style={{ fontSize: 12,textAlign: 'center', marginTop: 60, marginBottom: 10 }}>
					<div>INDICACIONES INTERCONSULTA</div>
					
					-------------------------------------------------------
				</div>
				<div style={{ fontSize: 12}}>
				{recomendacionProcedimientoInterconsulta}
				</div>
				{/* ----------------------------------------------------------------
				<br />
				---------------------------------------------------------------- */}
				<br />
				<div style={{ fontSize: 12, marginTop: 10 }}>
					<b>DIAGNÓSTICO</b>
					<br></br>
					-------------------------------------------------------
				</div>
				
				<br />
				<div style={{ fontSize: 12}}>
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
				<p style={{ fontSize: 12,marginBottom:0}}><strong >FECHA ANTENCIÓN :</strong> {fechaActual} </p>
				<p style={{ fontSize: 12,marginBottom:0}}><strong >MEDICO : </strong> {medico} </p>
				<p style={{ fontSize: 12,marginBottom:0}}><strong >CMP :</strong> COLEGIO MEDICO DEL PERU {cmp} </p>
				<p style={{ fontSize: 12,marginBottom:0}}><strong >ESPECILIDAD :</strong> {especialidad} </p>
				-------------------------------------------------------	
				<br />
				<p style={{ fontSize: 12,marginBottom:0}}><strong >PACIENTE :</strong> {paciente} </p>
				
				<div style={{ fontSize: 13,marginBottom:0}} >
				H.C.: {historiaClinica} DNI - {dni}
				<br />
				{an} años {mes} meses {dia} días
				</div>
			
				<div style={{ fontSize: 12 }}>
					-------------------------------------------------------
					<br />
					<p style={{ fontSize: 12,marginBottom:0}}><strong>DIAGNÓSTICO</strong></p>
					-------------------------------------------------------
					{dataDiagnostico.map(e => (
						<div key={e.key}>
							{e.cie + ' - ' + e.diagnostico}
							<br />
						</div>
						
					))}
					
				</div>
				<div style={{ fontSize: 12 }}>
					
					-------------------------------------------------------
				<p style={{ fontSize: 12,marginBottom:0}}><strong>INDICACIONES</strong></p>
				</div>
				<div style={{ fontSize: 12 }}>
					-------------------------------------------------------
					<br />
					{estadoTratamientos.map(e => (
						<div key={e.key} style={{ paddingBottom: 7 }}>
							<div style={{ paddingBottom: 2 }}>
								(GENÉRICO) / MEDICAMENTO:&nbsp;&nbsp;{e.descprod}
							</div>{' '}
							{/* <div style={{ paddingBottom: 2}}>{e.descprod}</div>{' '} */}
							<div style={{ paddingBottom: 2 }}>VIA ADMINISTRACIÓN:&nbsp;&nbsp;{e.etiquetaVia}</div>
							{/* <div style={{ paddingBottom: 2}}>{e.etiquetaVia}</div> */}
							<p style={{ paddingBottom: 2, marginBottom:0 }}>FREC. (VEZ x DIA):&nbsp;&nbsp;
							<span style={{ fontSize:14}}>
							{e.frecuencia}
							</span>
							</p>
							{/* <div style={{ paddingBottom: 2}}>{e.frecuencia + ' x ' + e.duracion}</div> */}
							<p style={{ paddingBottom: 2 }}>DURA. (DIA):&nbsp;&nbsp;
							<span style={{ fontSize:14}}>
							{e.duracion}
							</span>
							</p>
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
