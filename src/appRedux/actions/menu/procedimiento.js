import { types } from "../../types/types";

export const getConsultasProcedimientos = (objData) => {
    return {
        type: types.getConsultasProcedimientos,
        payload: objData
    }
}
export const setConsultasProcedimientos = (objData) => {
    console.log("Set Procedimmientos: ", objData);
    return {
        type: types.setConsultasProcedimientos,
        payload: objData
    }
}

export const setInterconsultasProcedimiento = (objData) => {
    return {
        type: types.setInterconsultasProcedimientos,
        payload: objData
    }
}

export const limpiarProcedimientoReducer = () => {
    return {
        type: types.limpiarProcedimientoReducer
    }
}


export const limpiarProcedimientoInterconsultaReducer = () => {
    return {
        type: types.limpiarProcedimientoInterconsultaReducer,
    }
}