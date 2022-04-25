import { types } from '../../types/types';

export const setEvolucionTratamientoOdonto = (objData) => {
    return {
        type: types.setEvolucionTratamientoOdonto,
        payload: objData,
    };
};


export const limpiarEvolucionTratamientoOdonto = () => {
    return {
        type: types.limpiarEvolucionTratamientoOdonto,
    };
};


export const setRegistrosEvolucionOdonto = (objData) => {
    return {
        type: types.setRegistrosEvolucionOdonto,
        payload: objData,
    };
};

export const limpiarRegistrosEvolucionOdonto = () => {
    return {
        type: types.limpiarRegistrosEvolucionOdonto,
    };
}
