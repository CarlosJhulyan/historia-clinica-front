import { types } from "../../types/types";

export const getDesarrolloAction = (objData) => {
    return {
        type: types.getDesarrolloAction,
        payload: objData
    }
}
export const setDesarrolloAction = (objData) => {
    console.log("Set Desarrollo: ", objData);
    return {
        type: types.setDesarrolloAction,
        payload: objData
    }
}

export const limpiarDesarrolloAction = () => {
    return {
        type: types.limpiarDesarrolloAction
    }
}
