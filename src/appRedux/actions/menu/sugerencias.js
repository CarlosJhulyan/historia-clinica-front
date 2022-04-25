import { types } from "../../types/types";

export const setSugerenciaTratamiento = (obj) => {
    return {
        type: types.setSugerenciaTratamiento,
        payload: obj,
    };

}
export const setSugerenciaProcedimiento = (obj) => {
    return {
        type: types.setSugerenciaProcedimiento,
        payload: obj,
    };

}

export const setSugerenciaInterProcedimiento = (obj) => {
    return {
        type: types.setSugerenciaInterProcedimiento,
        payload: obj,
    };

}

export const setSugerenciaImagenes = (obj) => {
    return {
        type: types.setSugerenciaImagenes,
        payload: obj,
    };

}
export const setSugerenciaLaboratorio = (obj) => {
    return {
        type: types.setSugerenciaLaboratorio,
        payload: obj,
    };

}