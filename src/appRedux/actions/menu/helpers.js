import { types } from "../../types/types";

export const setHistoriaClinica = (bool) => ({
    type: types.setHistoriaClinica,
    payload: bool
});

export const setHistoriaAntecedentes = (bool) => ({
    type: types.setHistoriaAntecedentes,
    payload: bool
});

export const setVisualizarOn = (bool) => ({
    type: types.setVisualizar,
    payload: bool
});

export const setLimpiarHistoriaClinica = () => ({
    type: types.setLimpiarHistoriaClinica,
});

export const setLimpiarHistoriaAntecedentes = () => ({
    type: types.setLimpiarHistoriaAntecedentes,
});

export const setLimpiarVisualizar = () => ({
    type: types.setLimpiarVisualizar,
});
