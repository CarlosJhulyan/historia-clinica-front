import { types } from "../types/types";

const dataGlobal = {
    codGrupoCia: '',
    codLocal: '',
    codCia: '',
    nroAtencion: '',
    codPaciente: '',
    secuenciaAntecedente: '',
};

export const dataGlobalReducer = (state = dataGlobal, action) => {
    switch (action.type) {
        case types.setDataGlobal:
            return action.payload;
            
        default:
            return state;
    }
}


