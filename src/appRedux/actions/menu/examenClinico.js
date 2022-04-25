import { types } from "../../types/types"

export const getEstomatologico = (objData) => {
    return {
        type: types.getEstomatologico,
        payload: objData
    }
}

export const setEstomatologico = (objData) => {
    console.log("SET ESTOMATO:", objData);
    return {
        type: types.setEstomatologico,
        payload: objData
    }
}

export const limpiarExamenClinico = () => {
    return {
        type: types.limpiarExamenClinico
    }
}