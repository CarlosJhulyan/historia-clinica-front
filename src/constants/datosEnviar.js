import moment from "moment";
const fechaActual = moment().format('YYYY-MM-DD HH:mm:ss');

export const datosEnviar = {
    codPaciente: null,
    codGrupoCia: null,
    codCia: null,
    codMedico: null,
    codLocal: null,
    numAtencion: null,
    enfermedadActual: {},
    estadoFisico: {},
    triaje: {},
    diagnostico: {},
    cabeceraReceta: {
        cantitems: [],
        fechavigencia: ''
    },
    cabeceraDetalle: [],
    tratamiento: {
        validezreceta: '', /* fecha: '', */
        indicacionesgen: '',
    },
    estadoConsulta: {
        codestadonew: ''
    },
    evolucionTratamiento: {
        FECHA: null,
        PLAN: null,
        DESCRIPCION: null,
    },
    antecedentes: {
        fecha: fechaActual,
        diabetes: 'NO',
        tuberculosis: 'NO',
        anemia: 'NO',
        fiebre_reumatica: 'NO',
        enfermedad_cardiovascular: 'NO',
        enfermedad_renal: 'NO',
        enfermedad_hepaticas: 'NO',
        reaccion_anormal_local: 'NO',
        reaccion_anormal_drogas: 'NO',
        hemorragias: 'NO',
        alergia_penecilina: 'NO',
        otras: 'NO',
    },
    estomatologico: {
        fecha: fechaActual,
        cara: 'N',
        cuello: 'N',
        piel: 'N',
        ganglios: 'N',
        atm: 'N',
        labios: 'N',
        carrillos: 'N',
        fondo_surco: 'N',
        periodonto: 'N',
        zona_retromolar: 'N',
        saliva: 'N',
        glandulas_salivales: 'N',
        lengua: 'N',
        paladar_duro: 'N',
        paladar_blando: 'N',
        piso_boca: 'N',
        orofaringe: 'N',
        indice_higiene_oral: 'N',
        hendidura_gingival: 'N',
        vitalidad_palpar: 'N',
        odusion: 'N',
        guia_anterior: 'N',
        interferencias: 'N',
        contacto_prematuro: 'N',
        rebordes_alveolare: 'N',
        tuberosidades: 'N',
    },
    laboratorio: {

    },
    consultasProcedimientos: {

    },
    imagenes: {
    }
}

export const funn = {
    ff: null
};

export const desarrollo = {
    relatoMedico: '',
    conclusion: '',
    observaciones: '',
};

export const antecedentes = {
    generales: {
        medicamentos: '',
        ram: '',
        ocupacionales: '',
    },
    fisiologicos: {
        prenatales: [],
        otrosPrenatales: '',
        parto: [],
        inmunizaciones: [],
        otrosInmunizaciones: '',
    },
    ginecologicos: {
        edadMenarquia: '',
        rcMentruacion: '',
        cicloMenstruacion: '',
        fechaFur: '',
        fechaFpp: '',
        rs: '',
        disminorrea: 'N',
        nroGestaciones: '',
        paridad: '',
        fechaFup: '',
        nroCesareas: '',
        pap: '',
        mamografia: '',
        mac: '',
        otros: '',
        indReglaRegular: 'N',
    }
}