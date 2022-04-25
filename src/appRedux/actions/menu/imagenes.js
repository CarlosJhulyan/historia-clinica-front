import { types } from "../../types/types";

export const getImagenesAction = (objData) => {
    return {
        type: types.getImagenesAction,
        payload: objData
    }
}
export const setImagenesAction = (objData) => {
    console.log("Set Imagenes: ", objData);
    return {
        type: types.setImagenesAction,
        payload: objData
    }
}

export const limpiarImagenes = () => {
    return {
        type: types.limpiarImagenes
    }
}