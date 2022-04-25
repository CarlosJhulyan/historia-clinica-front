import { types } from "../../types/types";

const initialState = {
    //actual: 'consultaMedica',
    actual: '',
}


export const pestañasReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.setPestañas:
            return {
                ...state,
                actual: action.payload
            }

        case types.limpiarPestañas:
            return {
                ...state,
                actual: ''
            }

        default:
            return state;
    }
}