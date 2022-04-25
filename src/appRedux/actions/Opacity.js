import { types } from "../types/types"

export const setOpacity = (opacity) => {
    return {
        type: types.setOpacity,
        payload: opacity,
    }
}

export const limpiarOpacity = () => {
    return {
        type: types.limpiarOpacity,
    }
}