import { types } from "../types/types"

export const quitar_seleccion = () => ({
    type: types.quitar_seleccion
})

export const seleccion_sin_estado = (nombreOpcion) => ({
    type: types.seleccion_sin_estado,
    payload: {
        opcion: nombreOpcion
    }
})

export const seleccion_inicio_fin = (nombreOpcion) => ({
    type: types.seleccion_inicio_fin,
    payload: {
        opcion: nombreOpcion
    }
})

/* export const seleccion_buen_estado = (nombreOpcion) => ({
    type: types.seleccion_buen_estado,
    payload: {
        opcion: nombreOpcion
    }
})

export const seleccion_mal_estado = (nombreOpcion) => ({
    type: types.seleccion_buen_estado,
    payload: {
        opcion: nombreOpcion
    }
}) */