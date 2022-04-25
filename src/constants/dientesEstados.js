import { Diente } from "../models/Diente"

const diente = new Diente();

const valorInicial = diente.exportar();

export const dientesEstados = {
    inicial: valorInicial,
    evolutivo: valorInicial,
    historial: valorInicial,
    actual: '',
}