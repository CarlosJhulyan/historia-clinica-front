import { types } from "../../types/types";

export const getLaboratorioAction = (objData) => {
    return {
        type: types.getLaboratorioAction,
        payload: objData
    }
}
export const setLaboratorioAction = (objData) => {
    console.log("Set Laboratorio: ", objData);
    return {
        type: types.setLaboratorioAction,
        payload: objData
    }
}

export const limpiarLaboratorio = () => {
    return {
        type: types.limpiarLaboratorio
    }
}