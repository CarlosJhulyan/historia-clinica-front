import { types } from "../../types/types";

const initState = [
    /* {
        COD_TIPO_FISIO: '',
        OPCION_OTRO: '',
    } */
]


export const fisiologicosReducer = (state = initState, action) => {
    switch (action.type) {
        case types.setFisiologicos:
            return action.payload;

        default:
            return state;
    }
}