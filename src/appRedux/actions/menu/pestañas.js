import { types } from "../../types/types"

export const setPestañas = (data) => {
    return {
        type: types.setPestañas,
        payload: data
    }
}


export const limpiarPestañas = () => {
    return {
        type: types.limpiarPestañas
    }
}

