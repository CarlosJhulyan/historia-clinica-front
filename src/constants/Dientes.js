import Canino from "../components/Dientes/caninos";
import Incisivos from "../components/Dientes/incisivos";
import Molar from "../components/Dientes/molares";
import MolarInv from "../components/Dientes-Inv/molarInv";
import PremolarInv from "../components/Dientes-Inv/premolarInv";
import CaninoInv from "../components/Dientes-Inv/caninoInv";
import IncisivosInv from "../components/Dientes-Inv/incisivosInv";
import PremolarLlenoTipoUno from "../components/Dientes/premolares/premolar-lleno/raiz-1";
import PremolarLlenoTipoDos from "../components/Dientes/premolares/premolar-lleno/raiz-2";
import PremolarVacioTipoUno from "../components/Dientes/premolares/premolar-vacio/raiz-1";
import PremolarVacioTipoDos from "../components/Dientes/premolares/premolar-vacio/raiz-2";
import { DIENTE_CANINO, DIENTE_CANINO_INV, DIENTE_INCISIVO, DIENTE_INCISIVO_INV, DIENTE_MOLAR, DIENTE_MOLAR_INV, DIENTE_PREMOLAR_INV, DIENTE_PREMOLAR_LLENO_DOS, DIENTE_PREMOLAR_LLENO_UNO, DIENTE_PREMOLAR_VACIO_DOS, DIENTE_PREMOLAR_VACIO_UNO } from "./TipoDiente";

export const DIENTES = {
    [DIENTE_MOLAR]: <Molar />,
    [DIENTE_CANINO]: <Canino />,
    [DIENTE_PREMOLAR_VACIO_DOS]: <PremolarVacioTipoDos />,
    [DIENTE_PREMOLAR_VACIO_UNO]: <PremolarVacioTipoUno />,
    [DIENTE_INCISIVO]: <Incisivos />,
    [DIENTE_PREMOLAR_LLENO_DOS]: <PremolarLlenoTipoDos />,
    [DIENTE_PREMOLAR_LLENO_UNO]: <PremolarLlenoTipoUno />,

    [DIENTE_MOLAR_INV]: <MolarInv />,
    [DIENTE_CANINO_INV]: <CaninoInv />,
    [DIENTE_PREMOLAR_INV]: <PremolarInv />,
    [DIENTE_INCISIVO_INV]: <IncisivosInv />,
};
export const DIENTES_ADULTO_SUPERIOR = [
    {
        index: 18,
        tipoDiente: DIENTE_MOLAR,
        dibujoDiente: DIENTES[DIENTE_MOLAR]
    },
    {
        index: 17,
        tipoDiente: DIENTE_MOLAR,
        dibujoDiente: DIENTES[DIENTE_MOLAR]
    },
    {
        index: 16,
        tipoDiente: DIENTE_MOLAR,
        dibujoDiente: DIENTES[DIENTE_MOLAR]
    },
    {
        index: 15,
        tipoDiente: DIENTE_PREMOLAR_VACIO_UNO,
        dibujoDiente: DIENTES[DIENTE_PREMOLAR_VACIO_UNO]
    },
    {
        index: 14,
        tipoDiente: DIENTE_PREMOLAR_VACIO_DOS,
        dibujoDiente: DIENTES[DIENTE_PREMOLAR_VACIO_DOS]
    },
    {
        index: 13,
        tipoDiente: DIENTE_CANINO,
        dibujoDiente: DIENTES[DIENTE_CANINO]
    },
    {
        index: 12,
        tipoDiente: DIENTE_INCISIVO,
        dibujoDiente: DIENTES[DIENTE_INCISIVO]
    },

    {
        index: 11,
        tipoDiente: DIENTE_INCISIVO,
        dibujoDiente: DIENTES[DIENTE_INCISIVO]
    },
    {
        index: 21,
        tipoDiente: DIENTE_INCISIVO,
        dibujoDiente: DIENTES[DIENTE_INCISIVO]
    },
    {
        index: 22,
        tipoDiente: DIENTE_INCISIVO,
        dibujoDiente: DIENTES[DIENTE_INCISIVO]
    },
    {
        index: 23,
        tipoDiente: DIENTE_CANINO,
        dibujoDiente: DIENTES[DIENTE_CANINO]
    },
    {
        index: 24,
        tipoDiente: DIENTE_PREMOLAR_LLENO_DOS,
        dibujoDiente: DIENTES[DIENTE_PREMOLAR_LLENO_DOS]
    },
    {
        index: 25,
        tipoDiente: DIENTE_PREMOLAR_LLENO_UNO,
        dibujoDiente: DIENTES[DIENTE_PREMOLAR_LLENO_UNO]
    },
    {
        index: 26,
        tipoDiente: DIENTE_MOLAR,
        dibujoDiente: DIENTES[DIENTE_MOLAR]
    },
    {
        index: 27,
        tipoDiente: DIENTE_MOLAR,
        dibujoDiente: DIENTES[DIENTE_MOLAR]
    },
    {
        index: 28,
        tipoDiente: DIENTE_MOLAR,
        dibujoDiente: DIENTES[DIENTE_MOLAR]
    },
];

export const DIENTES_INFANTE_SUPERIOR = [
    {
        index: 55,
        tipoDiente: DIENTE_MOLAR,
        dibujoDiente: DIENTES[DIENTE_MOLAR]
    },
    {
        index: 54,
        tipoDiente: DIENTE_MOLAR,
        dibujoDiente: DIENTES[DIENTE_MOLAR]
    },
    {
        index: 53,
        tipoDiente: DIENTE_CANINO,
        dibujoDiente: DIENTES[DIENTE_CANINO]
    },
    {
        index: 52,
        tipoDiente: DIENTE_INCISIVO,
        dibujoDiente: DIENTES[DIENTE_INCISIVO]
    },
    {
        index: 51,
        tipoDiente: DIENTE_INCISIVO,
        dibujoDiente: DIENTES[DIENTE_INCISIVO]
    },
    {
        index: 61,
        tipoDiente: DIENTE_INCISIVO,
        dibujoDiente: DIENTES[DIENTE_INCISIVO]
    },
    {
        index: 62,
        tipoDiente: DIENTE_INCISIVO,
        dibujoDiente: DIENTES[DIENTE_INCISIVO]
    },

    {
        index: 63,
        tipoDiente: DIENTE_CANINO,
        dibujoDiente: DIENTES[DIENTE_CANINO]
    },
    {
        index: 64,
        tipoDiente: DIENTE_MOLAR,
        dibujoDiente: DIENTES[DIENTE_MOLAR]
    },
    {
        index: 65,
        tipoDiente: DIENTE_MOLAR,
        dibujoDiente: DIENTES[DIENTE_MOLAR]
    },
];

export const DIENTES_INFANTE_INFERIOR = [
    {
        index: 85,
        tipoDiente: DIENTE_MOLAR_INV,
        dibujoDiente: DIENTES[DIENTE_MOLAR_INV]
    },
    {
        index: 84,
        tipoDiente: DIENTE_MOLAR_INV,
        dibujoDiente: DIENTES[DIENTE_MOLAR_INV]
    },
    {
        index: 83,
        tipoDiente: DIENTE_CANINO_INV,
        dibujoDiente: DIENTES[DIENTE_CANINO_INV]
    },
    {
        index: 82,
        tipoDiente: DIENTE_INCISIVO_INV,
        dibujoDiente: DIENTES[DIENTE_INCISIVO_INV]
    },
    {
        index: 81,
        tipoDiente: DIENTE_INCISIVO_INV,
        dibujoDiente: DIENTES[DIENTE_INCISIVO_INV]
    },
    {
        index: 71,
        tipoDiente: DIENTE_INCISIVO_INV,
        dibujoDiente: DIENTES[DIENTE_INCISIVO_INV]
    },
    {
        index: 72,
        tipoDiente: DIENTE_INCISIVO_INV,
        dibujoDiente: DIENTES[DIENTE_INCISIVO_INV]
    },
    {
        index: 73,
        tipoDiente: DIENTE_CANINO_INV,
        dibujoDiente: DIENTES[DIENTE_CANINO_INV]
    },
    {
        index: 74,
        tipoDiente: DIENTE_MOLAR_INV,
        dibujoDiente: DIENTES[DIENTE_MOLAR_INV]
    },
    {
        index: 75,
        tipoDiente: DIENTE_MOLAR_INV,
        dibujoDiente: DIENTES[DIENTE_MOLAR_INV]
    },
];

export const DIENTES_ADULTO_INFERIOR = [
    {
        index: 48,
        tipoDiente: DIENTE_MOLAR_INV,
        dibujoDiente: DIENTES[DIENTE_MOLAR_INV]
    },
    {
        index: 47,
        tipoDiente: DIENTE_MOLAR_INV,
        dibujoDiente: DIENTES[DIENTE_MOLAR_INV]
    },
    {
        index: 46,
        tipoDiente: DIENTE_MOLAR_INV,
        dibujoDiente: DIENTES[DIENTE_MOLAR_INV]
    },
    {
        index: 45,
        tipoDiente: DIENTE_PREMOLAR_INV,
        dibujoDiente: DIENTES[DIENTE_PREMOLAR_INV]
    },
    {
        index: 44,
        tipoDiente: DIENTE_PREMOLAR_INV,
        dibujoDiente: DIENTES[DIENTE_PREMOLAR_INV]
    },
    {
        index: 43,
        tipoDiente: DIENTE_CANINO_INV,
        dibujoDiente: DIENTES[DIENTE_CANINO_INV]
    },
    {
        index: 42,
        tipoDiente: DIENTE_INCISIVO_INV,
        dibujoDiente: DIENTES[DIENTE_INCISIVO_INV]
    },
    {
        index: 41,
        tipoDiente: DIENTE_INCISIVO_INV,
        dibujoDiente: DIENTES[DIENTE_INCISIVO_INV]
    },
    {
        index: 31,
        tipoDiente: DIENTE_INCISIVO_INV,
        dibujoDiente: DIENTES[DIENTE_INCISIVO_INV]
    },
    {
        index: 32,
        tipoDiente: DIENTE_INCISIVO_INV,
        dibujoDiente: DIENTES[DIENTE_INCISIVO_INV]
    },
    {
        index: 33,
        tipoDiente: DIENTE_CANINO_INV,
        dibujoDiente: DIENTES[DIENTE_CANINO_INV]
    },
    {
        index: 34,
        tipoDiente: DIENTE_PREMOLAR_INV,
        dibujoDiente: DIENTES[DIENTE_PREMOLAR_INV]
    },
    {
        index: 35,
        tipoDiente: DIENTE_PREMOLAR_INV,
        dibujoDiente: DIENTES[DIENTE_PREMOLAR_INV]
    },
    {
        index: 36,
        tipoDiente: DIENTE_MOLAR_INV,
        dibujoDiente: DIENTES[DIENTE_MOLAR_INV]
    },
    {
        index: 37,
        tipoDiente: DIENTE_MOLAR_INV,
        dibujoDiente: DIENTES[DIENTE_MOLAR_INV]
    },
    {
        index: 38,
        tipoDiente: DIENTE_MOLAR_INV,
        dibujoDiente: DIENTES[DIENTE_MOLAR_INV]
    },
];