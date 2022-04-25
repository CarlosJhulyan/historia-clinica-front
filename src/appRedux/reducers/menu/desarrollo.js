import { types } from "../../types/types";


const desarrollo = {
    relatoMedico: '',
    conclusion: '',
    observaciones: '',
};


export const desarrolloReducer = (state = desarrollo, action) => {
    switch (action.type) {

        case types.setDesarrolloAction:
            return action.payload;

        case types.limpiarDesarrolloAction:
            return desarrollo;

        default:
            return state;
    }
}
