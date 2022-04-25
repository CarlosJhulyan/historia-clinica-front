import { types } from "../../types/types";

const defaultState = {
    viaAdministracion: [],
    curso: [],
    tipoInformante: [],
    apetito: [],
    sueno: [],
    deposicion: [],
    sed: [],
    orina: [],
    estadoGeneral: [],
    tipoDiagnostico: [],
    prenatales: [],
    parto: [],
    inmunizaciones: [],
    habitosNocivos: [],
    dataProcedimiento: [],
    dataLaboratorio: [],
    dataImagenes: [],
    dataTratamiento: [],
    dataDiagnostico: [],
}

export const combosReducer = (state = defaultState, action) => {
    switch (action.type) {

        //REDUCER VIA ADMIN
        // case types.getComboViaAdmin:
        //     return { ...state.viaAdministracion }

        case types.setComboViaAdmin:
            return {
                ...state,
                viaAdministracion: action.payload
            }


        //REDUCER CURSO
        // case types.getComboCurso:
        //     return { ...state.curso }

        case types.setComboCurso:
            return {
                ...state,
                curso: action.payload
            }

        //REDUCER TIPO INFORMANTE
        // case types.getComboTipoInformante:
        //     return { ...state.tipoInformante }

        case types.setComboTipoInformante:
            return {
                ...state,
                tipoInformante: action.payload
            }

        //REDUCER APETITO
        // case types.getComboApetito:
        //     return { ...state.apetito }

        case types.setComboApetito:
            return {
                ...state,
                apetito: action.payload
            }

        //REDUCER SUEÑO
        // case types.getComboSueno:
        //     return { ...state.sueno }

        case types.setComboSueno:
            return {
                ...state,
                sueno: action.payload
            }

        //REDUCER DEPOSICION
        // case types.getComboDeposicion:
        //     return { ...state.deposicion }

        case types.setComboDeposicion:
            return {
                ...state,
                deposicion: action.payload
            }

        //REDUCER SED
        // case types.getComboSed:
        //     return { ...state.sed }

        case types.setComboSed:
            return {
                ...state,
                sed: action.payload
            }

        //REDUCER ORINA
        // case types.getComboOrina:
        //     return { ...state.orina }

        case types.setComboOrina:
            return {
                ...state,
                orina: action.payload
            }

        //REDUCER ESTADO GENERAL
        // case types.getComboEstadoGeneral:
        //     return { ...state.estadoGeneral }

        case types.setComboEstadoGeneral:
            return {
                ...state,
                estadoGeneral: action.payload
            }

        //REDUCER TIPO DIAGNOSTICO
        // case types.getComboTipoDiagnostico:
        //     return { ...state.tipoDiagnostico }

        case types.setComboTipoDiagnostico:
            return {
                ...state,
                tipoDiagnostico: action.payload
            }

        //REDUCER PRENATALES
        // case types.getComboPrenatales:
        //     return { ...state.prenatales }

        case types.setComboPrenatales:
            return {
                ...state,
                prenatales: action.payload
            }

        //REDUCER PARTO
        // case types.getComboParto:
        //     return { ...state.parto }

        case types.setComboParto:
            return {
                ...state,
                parto: action.payload
            }

        //REDUCER INMUNIZACIONES
        // case types.getComboInmunizaciones:
        //     return { ...state.inmunizaciones }

        case types.setComboInmunizaciones:
            return {
                ...state,
                inmunizaciones: action.payload
            }


        case types.setComboHabitosNocivos:
            return {
                ...state,
                habitosNocivos: action.payload
            }

        //Data Procedimientos
        case types.setDataProcedimiento:
            return {
                ...state,
                dataProcedimiento: action.payload
            }

        case types.setDataLaboratorio:
            return {
                ...state,
                dataLaboratorio: action.payload
            }

        case types.setDataImagenes:
            return {
                ...state,
                dataImagenes: action.payload
            }

        case types.setDataTratamientos:
            return {
                ...state,
                dataTratamiento: action.payload
            }

        case types.setDataDiagnostico:
            return {
                ...state,
                dataDiagnostico: action.payload
            }


        default:
            return state;
    }
}
