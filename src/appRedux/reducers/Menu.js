import { types } from "../types/types"

const initialState = {
    seleccion: false,
    opcion: { hallazgo: '', tipo: '', estado: '' },
    inicioFin: false,
    //opcion: "Esmalte-HP-Buen Estado",
}

const MenuReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.seleccion_sin_estado:
            return {
                ...state,
                seleccion: true,
                opcion: action.payload.opcion,
                inicioFin: false,
            }
        case types.seleccion_inicio_fin:
            return {
                ...state,
                seleccion: true,
                opcion: action.payload.opcion,
                inicioFin: true,
            }




        /*  case types.seleccion_buen_estado:
             return {
                 ...state,
                 seleccion: true,
                 estado: true,
                 opcion: action.payload.opcion
             } */

        /*  case types.seleccion_mal_estado:
             return {
                 ...state,
                 seleccion: true,
                 estado: false,
                 opcion: action.payload.opcion
             }
  */
        case types.quitar_seleccion:
            return initialState;

        default:
            return state;
    }
}

export default MenuReducer;