import { types } from "../types/types"

const estadoInicial = true;


export const opacityReducer = (state = estadoInicial, action) => {
    switch (action.type) {

        case types.setOpacity:
            return action.payload;

        case types.limpiarOpacity:
            return estadoInicial;

        default:
            return state
    }
}