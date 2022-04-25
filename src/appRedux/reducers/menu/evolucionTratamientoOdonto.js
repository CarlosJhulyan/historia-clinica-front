import { types } from '../../types/types';


const evolucionTratamiento = [];

export const evolucionTratamientoOdontoReducer = (state = evolucionTratamiento, action) => {
    switch (action.type) {
        case types.setEvolucionTratamientoOdonto:
            return action.payload;

        case types.limpiarEvolucionTratamientoOdonto:
            return [];

        default:
            return state;
    }
};

const registrosEvolucion = [];

export const registrosEvolucionOdontoReducer = (state = registrosEvolucion, { type, payload }) => {
    switch (type) {
        case types.setRegistrosEvolucionOdonto:
            return payload;

        case types.limpiarRegistrosEvolucionOdonto:
            return [];

        default:
            return state;
    }
};
