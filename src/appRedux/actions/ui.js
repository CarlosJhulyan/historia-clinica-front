import { types } from '../types/types';

export const setMsgRequired = (obj) => {
    return {
        type: types.setMsgRequired,
        payload: obj,
    };
};

export const setFiltroEspecialidad = (obj) => {
    return {
        type: types.setFiltroEspecialidad,
        payload: obj,
    };
};

export const setClearUI = () => ({
    type: types.setClearUI
})


