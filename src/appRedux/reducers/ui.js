import { types } from "../types/types"

const initialState = {
    inputRequired: false,
    filtroEspecialidad: [],
}

const UiReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.setMsgRequired:
            return {
                ...state,
                inputRequired: action.payload
            }

        case types.setFiltroEspecialidad:
            return {
                ...state,
                filtroEspecialidad: action.payload
            }

        case types.setClearUI:
            return {
                ...state,
                inputRequired: false,
                filtroEspecialidad: []
            }

        default:
            return state;
    }
}

export default UiReducer;