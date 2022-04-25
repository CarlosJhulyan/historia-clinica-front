import { types } from "../../types/types";

export const getDiagnosticoAction = (objData) => {
    return {
        type: types.getDiagnosticoAction,
        payload: objData
    }
}
export const setDiagnosticoAction = (objData) => {
    console.log("Set Diagnostico: ", objData);
    return {
        type: types.setDiagnosticoAction,
        payload: objData
    }
}

export const limpiarDiagnosticoAction = () => {
    console.log("Limpiar Diagnostico");
    return {
        type: types.limpiarDiagnosticoAction,
    }
}


