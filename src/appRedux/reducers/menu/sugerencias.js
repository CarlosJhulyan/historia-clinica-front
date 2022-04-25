import { types } from "../../types/types";

const initialState = {
    tratamiento: [],
    procedimiento: [],
    imagenes: [],
    laboratorio: [],
    interconsultas: [],
};


export const sugerenciaReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.setSugerenciaTratamiento:
            return {
                ...state,
                tratamiento: action.payload,
            };
        case types.setSugerenciaProcedimiento:
            return {
                ...state,
                procedimiento: action.payload,
            };

        case types.setSugerenciaInterProcedimiento:
            return {
                ...state,
                interconsultas: action.payload,
            };

        case types.setSugerenciaImagenes:
            return {
                ...state,
                imagenes: action.payload,
            };
        case types.setSugerenciaLaboratorio:
            return {
                ...state,
                laboratorio: action.payload,
            };
        default:
            return state;
    }
}



