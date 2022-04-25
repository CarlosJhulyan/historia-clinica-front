export const types = {
	//UI
	setMsgRequired: '[UI] setMsgRequired',
	setFiltroEspecialidad: '[UI] setFiltroEspecialidad',
	setClearUI: '[UI] setClearUI',

	setLoginLoading: 'SET_LOGIN_LOADING',
	setHoraImprimible: '[SET] Hora imprimible',

	//SELECCIONAR MENÚ
	seleccion_sin_estado: '[Seleccionar] Sin estado',
	seleccion_buen_estado: '[Seleccionar] Buen estado',
	seleccion_mal_estado: '[Seleccionar] Mal estado',
	quitar_seleccion: '[Sin Seleccion] Quitar Seleccion',

	//OBTENER DIENTES
	listar_hallazgo: '[Listar] get diente',
	agregar_hallazgo: '[Agregar] add diente',
	setEstadoOdonotograma: '[SET] ESTADO ODONTOGRAMA',

	//DATA GLOBAL

	setDataGlobal: '[SET] DATA GLOBAL',

	//MOSTRAR DIENTE - CLASS
	actualizar_diente: '[Actualizar] put diente',
	diente_actual: 'DIENTE_ACTUAL',

	seleccion_inicio_fin: '[Seleccionar] Inicio-Fin',

	//// HC
	setHistoriaClinica: '[SET] HISTORIA CLINICA',
	setHistoriaAntecedentes: '[SET] HISTORIA ANTECEDENTES',
	setVisualizar: '[SET] VISUALIZAR',

	setLimpiarHistoriaClinica: '[SET] LIMPIAR HISTORIA CLINICA',
	setLimpiarHistoriaAntecedentes: '[SET] LIMPIAR HISTORIA ANTECEDENTES',
	setLimpiarVisualizar: '[SET] LIMPIAR VISUALIZAR',

	///////////////////////////////////////////////////////////////////////////
	//ENFERMEDAD ACTUAL
	getEnfermedadActual: '[GET] Obtener Enfermedad Actual',
	setEnfermedadActual: '[SET] Enviar Enfermedad Actual',
	limpiarEnfermedadActual: '[Limpiar] Enfermedad Actual',

	//EXAMEN FISICO
	getAntecedentes: '[GET] Obtener Antecedentes',
	setAntecedentes: '[SET] Enviar Antecedentes',

	getFuncionesVitales: '[GET] Obtener Funciones Vitales',
	setFuncionesVitales: '[SET] Enviar Funciones Vitales',
	limpiarFuncionesVitales: '[Limpiar] Funciones Vitales',

	getIndicadoresA: '[GET] Obtener Indicadores',
	setIndicadoresA: '[SET] Enviar Indicadores',

	getEstadoFisico: '[GET] Obtener Estado Fisico',
	setEstadoFisico: '[SET] Enviar Estado Fisico',
	limpiarEstadoFisico: '[Limpiar] Estado Fisico',

	// EXAMEN CLINICO ESTOMATOLOGICO
	getEstomatologico: '[GET] Obtener Estomatologico',
	setEstomatologico: '[SET] Enviar Estomatologico',
	limpiarExamenClinico: '[CLEAR] Limpiar Examen Clinico',

	// DIAGNOSTICO
	getDiagnosticoAction: '[GET] Obtener Diagnostico',
	setDiagnosticoAction: '[SET] Enviar Diagnostico',
	limpiarDiagnosticoAction: '[CLEAR] Limpiar Diagnostico',

	//EVOLUCION DEL TRATAMIENTO
	getEvolucionTratamiento: '[GET] Obtener Evolucion Tratamiento',
	setEvolucionTratamiento: '[SET] Enviar Evolucion Tratamiento',
	limpiarEvolucionTratamiento: '[CLEAR] Limpiar Evolucion Tratamiento',

	//EVOLUCION DEL TRATAMIENTO ODONTO
	setEvolucionTratamientoOdonto: '[SET] Enviar Evolucion Tratamiento Odonto',
	limpiarEvolucionTratamientoOdonto: '[CLEAR] Limpiar Evolucion Tratamiento Odonto',
	setRegistrosEvolucionOdonto: '[SET] Enviar Registros Evolucion Odonto',
	limpiarRegistrosEvolucionOdonto: '[CLEAR] Limpiar Registros Evolucion Odonto',

	//TRATAMIENTO
	getTratamientoCabecera: '[GET] Obtener Cabecera Tratamiento',
	setTratamientoCabeceraDetalle: '[SET] Enviar Cabecera Tratamiento',
	limpiarTratamientoCabeceraDetalle: '[CLEAR] Limpiar Cabecera Tratamiento',

	getTratamiento: '[GET] Obtener Tratamiento',
	setTratamiento: '[SET] Enviar Tratamiento',
	limpiarTratamientoReducer: '[CLEAR] Limpiar Tratamiento',

	getCabeceraReceta: '[GET] Obtener Cabecera Receta',
	setCabeceraReceta: '[SET] Enviar Cabecera Receta',
	limpiarCabeceraReceta: '[CLEAR] Limpiar Cabecera Receta',

	//ANEXOS
	getAnexosAction: '[GET] Obtener Anexos',
	setAnexosAction: '[SET] Enviar Anexos',
	setTipoAnexo: '[SET] Tipo Anexos',
	limpiarAnexo: '[CLEAR] Limpiar Anexo',

	//CONSULTAS - PROCEDIMIENTOS
	getConsultasProcedimientos: '[GET] Obtener Consultas Procedimientos',
	setConsultasProcedimientos: '[SET] Enviar Consultas Procedimientos',
	limpiarProcedimientoReducer: '[CLEAR] Limpiar Procedimiento',
	setInterconsultasProcedimientos: '[SET]',
	limpiarProcedimientoInterconsultaReducer: '[CLEAR] Limpiar Procedimiento Interconsulta',

	//IMAGENES
	getImagenesAction: '[GET] Obtener Imagenes',
	setImagenesAction: '[SET] Enviar Imagenes',
	limpiarImagenes: '[CLEAR] Limpiar Imagenes',

	//LABORATORIO
	getLaboratorioAction: '[GET] Obtener Laboratorio',
	setLaboratorioAction: '[SET] Enviar Laboratorio',
	limpiarLaboratorio: '[CLEAR] Limpiar Laboratorio',

	//DESARROLLO
	getDesarrolloAction: '[GET] Obtener Desarrollo',
	setDesarrolloAction: '[SET] Enviar Desarrollo',
	limpiarDesarrolloAction: '[CLEAR] Limpiar Desarrollo',

	//COMBOS
	getComboViaAdmin: '[GET] Obtener Combos',
	setComboViaAdmin: '[SET] Enviar Combos',

	getComboCurso: '[GET] Obtener Curso',
	setComboCurso: '[SET] Enviar Curso',

	getComboTipoInformante: '[GET] Obtener Tipo Informante',
	setComboTipoInformante: '[SET] Enviar Tipo Informante',

	getComboApetito: '[GET] Obtener Apetito',
	setComboApetito: '[SET] Enviar Apetito',

	getComboSueno: '[GET] Obtener Sueno',
	setComboSueno: '[SET] Enviar Sueno',

	getComboDeposicion: '[GET] Obtener Deposicion',
	setComboDeposicion: '[SET] Enviar Deposicion',

	getComboSed: '[GET] Obtener Sed',
	setComboSed: '[SET] Enviar Sed',

	getComboOrina: '[GET] Obtener Orina',
	setComboOrina: '[SET] Enviar Orina',

	getComboEstadoGeneral: '[GET] Obtener Estado General',
	setComboEstadoGeneral: '[SET] Enviar Estado General',

	getComboTipoDiagnostico: '[GET] Obtener Tipo Diagnostico',
	setComboTipoDiagnostico: '[SET] Enviar Tipo Diagnostico',

	getComboPrenatales: '[GET] Obtener Prenatales',
	setComboPrenatales: '[SET] Enviar Prenatales',

	getComboParto: '[GET] Obtener Parto',
	setComboParto: '[SET] Enviar Parto',

	getComboInmunizaciones: '[GET] Obtener Inmunizaciones',
	setComboInmunizaciones: '[SET] Enviar Inmunizaciones',

	setComboHabitosNocivos: '[SET] Enviar Habitos Nocivos',

	setDataProcedimiento: '[SET] Enviar Data Procedimiento',

	setDataLaboratorio: '[SET] Enviar Data Laboratorio',

	setDataImagenes: '[SET] Enviar Data Imagenes',

	setDataTratamientos: '[SET] Enviar Data Tratamientos',

	setDataDiagnostico: '[SET] Enviar Data Diagnostico',

	setDataHabitosNocivos: '[SET] Enviar Data Habitos Nocivos',

	//ANTECEDENTES GENERALES
	setGeneralesMedicamentos: '[SET] Enviar Generales Medicamentos',
	setGeneralesRam: '[SET] Enviar Generales Ram',
	setHabitosNocivos: '[SET] Enviar Habitos Nocivos 1',
	setGeneralesOcupacionales: '[SET] Enviar Generales Ocupacionales',
	limpiarAntecedentesGenerales: '[CLEAR] Limpiar Antecedentes Generales',

	//ANTECEDENTES FISIOLOGICOS
	setFisiologicosPrenatales: '[SET] Enviar Fisiologicos Prenatales',
	setFisiologicosParto: '[SET] Enviar Fisiologicos Parto',
	setFisiologicosInmunizaciones: '[SET] Enviar Fisiologicos Inmunizaciones',
	setFisiologicosOtrosPrenatales: '[SET] Enviar Fisiologicos Otros renatales',
	setFisiologicosOtrosInmunizaciones: '[SET] Enviar Fisiologicos Otros Inmunizaciones',
	limpiarAntecedentesFisiologicos: '[CLEAR] Limpiar Antecedentes Fisiologicos',

	setFisiologicos: '[SET] Enviar Fisiologicos',

	//ANTECEDENTES GINECOLOGICOS
	setGMenarquia: '[SET] Enviar Ginecologicos Menarquia',
	setGReglaRegular: '[SET] Enviar Ginecologicos Regla Regular',
	setGRcMenstruacion: '[SET] Enviar Ginecologicos Menstruacion',
	setGCicloMenstruacion: '[SET] Enviar Ginecologicos Ciclo Menstruacion',
	setGRS: '[SET] Enviar Ginecologicos RS',
	setGFechaFur: '[SET] Enviar Ginecologicos Fecha Fur',
	setGFechaFpp: '[SET] Enviar Ginecologicos Fecha Fpp',
	setGDisminorrea: '[SET] Enviar Ginecologicos Disminorrea',
	setGNroGestacion: '[SET] Enviar Ginecologicos Nro Gestacion',
	setGFechaFup: '[SET] Enviar Ginecologicos Fecha Fup',
	setGPariedad: '[SET] Enviar Ginecologicos Pariedad',
	setGNroCesareas: '[SET] Enviar Ginecologicos Nro Cesareas',
	setGPap: '[SET] Enviar Ginecologicos Pap',
	setGMamografia: '[SET] Enviar Ginecologicos Mamografia',
	setGMac: '[SET] Enviar Ginecologicos Mac',
	setGOtros: '[SET] Enviar Ginecologicos Otros',
	limpiarAntecedentesGineco: '[CLEAR] Limpiar Antecedentes Gineco',

	//ANTECEDENTES PATOLOGICOS
	setAntecedentesPatologicos: '[SET] Enviar Data A. Patologicos',
	limpiarAntecedentesPatologicos: '[CLEAR] Limpiar Antecedentes Patologicos',
	setAntecedentesPatologicosFamiliares: '[SET] Enviar Data A. Patoloficos Familiares',
	limpiarAntecedentesPatologicosFamiliares: '[CLEAR] Limpiar Antecedentes Patologicos Familiares',

	//ANTECEDENTES OTROS
	setOtros: '[SET] Enviar Data Otros',
	limpiarOtros: '[CLEAR] Limpiar Otros',

	//TRATAMIENTO EDITABLES
	setRegistrosEvolucion: '[SET] Registros de Evolucion',
	limpiarRegistrosEvolucion: '[CLEAR] Limpiar Registros de Evolucion',

	//DATA
	setData: '[SET] Data Tratamiento',

	//PESTAÑAS
	setPestañas: '[SET] Cambiar Pestañas',
	limpiarPestañas: '[CLEAR] Limpiar Pestañas',

	//OPACITY
	setOpacity: '[SET] Opacity2',
	limpiarOpacity: '[CLEAR] Limpiar Opacity',

	//SUGERENCIAS
	setSugerenciaTratamiento: '[SET] Sugerir Tratamiento',
	setSugerenciaProcedimiento: '[SET] Sugerir Procedimiento',
	setSugerenciaInterProcedimiento: '[SET] Sugerir InterProcedimiento',
	setSugerenciaImagenes: '[SET] Sugerir Imagenes',
	setSugerenciaLaboratorio: '[SET] Sugerir Laboratorio',
};
