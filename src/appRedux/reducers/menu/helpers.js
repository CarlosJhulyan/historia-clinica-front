import { types } from "../../types/types";

const initialState = {
    historiaClinica: false,
    historiaAntecedentes: false,
    visualizar: false,
}

export const HelpersReducer = (state = initialState, action) => {
    switch (action.type) {

        case types.setHistoriaClinica:
            return {
                ...state,
                historiaClinica: action.payload,
            }

        case types.setHistoriaAntecedentes:
            return {
                ...state,
                historiaAntecedentes: action.payload,
            }

        case types.setVisualizar:
            return {
                ...state,
                visualizar: action.payload,
            }

        case types.setLimpiarHistoriaClinica:
            return {
                ...state,
                historiaClinica: false,
            }

        case types.setLimpiarHistoriaAntecedentes:
            return {
                ...state,
                historiaAntecedentes: false,
            }

        case types.setLimpiarVisualizar:
            return {
                ...state,
                visualizar: false,
            }

        default:
            return state;
    }
}
