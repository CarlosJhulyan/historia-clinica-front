import { types } from '../types/types';

export const setDataGlobal = (obj) => {
    return {
        type: types.setDataGlobal,
        payload: obj,
    };
};