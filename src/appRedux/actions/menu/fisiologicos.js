import { types } from '../../types/types';


export const setFisiologicos = (objData) => {
    return {
        type: types.setFisiologicos,
        payload: objData,
    };
};

