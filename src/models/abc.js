import {
    cariesDentalTipo, estado, coronaTipo, defectosDesarrolloEsmalteTipo,
    fracturaTipo, giroversionTipo, movilidadPatologicaTipo, posicionDentariaTipo,
    restauracionDefinitivaTipo, tratamientoPulparTipo
} from "../constants/Odontograma";


const data = {
    aparatoOrtoFijo: [
        {
            estado: estado.malo,
            diente: 40,
            fin: 42,
            diagnostico: "diagnostico"
        }
    ],
    aparatoOrtoRemovible: [
        {
            estado: estado.bueno,
            diente: 40,
            fin: 42,
            diagnostico: "diagnostico"
        }
    ],
    cariesDental: [
        {
            tipo: cariesDentalTipo.cd,
            partes: {
                vestibular: false,
                palatino: false,
                distal: true,
                mesial: false,
            },
            diente: 71,
            diagnostico: "diagnostico"
        }
    ],
    corona: [
        {
            tipo: coronaTipo.cmc,
            estado: estado.malo,
            diente: 71,
            diagnostico: "diagnostico"
        }
    ],
    coronaTemporal: [
        {
            estado: estado.bueno,
            diente: 42,
            diagnostico: "diagnostico"
        }
    ],
    defectosDesarrolloEsmalte: [
        {
            tipo: defectosDesarrolloEsmalteTipo.fluorosis,
            estado: estado.bueno,
            diente: 71,
            diagnostico: "diagnostico"
        }
    ],
    diastema: [
        {
            diente: 71,
            diagnostico: "diagnostico"
        }
    ],
    edentuloTotal: [
        {
            diente: 31,
            fin: 35,
            diagnostico: "diagnostico"
        }
    ],
    espigonMunon: [
        {
            estado: estado.bueno,
            diente: 42,
            diagnostico: "diagnostico"
        }
    ],
    fosasFisurasProfundas: [
        {
            diente: 71,
            diagnostico: "diagnostico"
        }
    ],
    fractura: [
        {
            tipo: fracturaTipo.coronal,
            diente: 70,
            diagnostico: "diagnostico"
        }
    ],
    fusion: [
        {
            diente: 71,
            diagnostico: "diagnostico"
        }
    ],
    geminasion: [
        {
            diente: 71,
            diagnostico: "diagnostico"
        }
    ],
    giroversion: [
        {
            tipo: giroversionTipo.distal,
            diente: 41,
            diagnostico: "diagnostico",
        }
    ],
    impactacion: [
        {
            diente: 71,
            diagnostico: "diagnostico"
        }
    ],
    implanteDental: [
        {
            estado: estado.bueno,
            diente: 42,
            diagnostico: "diagnostico"
        }
    ],
    /* L - P */
    macrodoncia: [
        {
            diente: 71,
            diagnostico: "diagnostico"
        }
    ],
    microdoncia: [
        {
            diente: 41,
            diagnostico: "diagnostico"
        }
    ],
    movilidadPatologica: [
        {
            tipo: movilidadPatologicaTipo.m1,
            diente: 14,
            diagnostico: "diagnostico"
        }
    ],
    piezaDentariaAusente: [
        {
            diente: 51,
            diagnostico: "diagnostico"
        }
    ],
    piezaDentariaEctopica: [
        {
            diente: 81,
            diagnostico: "diagnostico"
        }
    ],
    piezaDentariaClavija: [
        {
            diente: 11,
            diagnostico: "diagnostico"
        }
    ],
    piezaDentariaErupcion: [
        {
            diente: 41,
            diagnostico: "diagnostico"
        }
    ],
    piezaDentariaExtruida: [
        {
            diente: 31,
            diagnostico: "diagnostico"
        }
    ],
    piezaDentariaIntruida: [
        {
            diente: 81,
            diagnostico: "diagnostico"
        }
    ],
    piezaDentariaSupernumeraria: [
        {
            diente: 21,
            diagnostico: "diagnostico"
        }
    ],
    posicionDentaria: [
        {
            tipo: posicionDentariaTipo.m,
            diente: 31,
            diagnostico: "diagnostico"
        }
    ],
    protesisFija: [
        {
            estado: estado.bueno,
            diente: 12,
            fin: 16,
            diagnostico: "diagnostico"
        }
    ],
    protesisRemovible: [
        {
            estado: estado.malo,
            diente: 19,
            fin: 22,
            diagnostico: "diagnostico"
        }
    ],
    protesisTotal: [
        {
            estado: estado.bueno,
            diente: 17,
            fin: 20,
            diagnostico: "diagnostico"
        }
    ],
    /* R - T */
    remanenteRadicular: [
        {
            diente: 71,
            diagnostico: "diagnostico"
        }
    ],
    restauracionDefinitiva: [
        {
            tipo: restauracionDefinitivaTipo.am,
            partes: {
                vestibular: {
                    activo: true,
                    estado: estado.malo
                },
                palatino: {
                    activo: false,
                    estado: null
                },
                distal: {
                    activo: true,
                    estado: estado.malo
                },
                mesial: {
                    activo: false,
                    estado: null
                },
                oclusal: {
                    activo: false,
                    estado: null
                }
            },
            diente: 70,
            diagnostico: "diagnostico"

        }
    ],
    restauracionTemporal: [
        {
            partes: {
                vestibular: true,
                palatino: false,
                distal: false,
                mesial: false
            },
            diente: 73,
            diagnostico: "diagnostico"
        }
    ],

    sellantes: [
        {
            partes: {
                vestibular: {
                    activo: true,
                    estado: estado.malo
                },
                palatino: {
                    activo: false,
                    estado: null
                },
                distal: {
                    activo: false,
                    estado: null
                },
                mesial: {
                    activo: false,
                    estado: null
                },
                oclusal: {
                    activo: false,
                    estado: null
                },
            },
            diente: 16,
            diagnostico: "diagnostico"
        }
    ],

    superficieDesgastada: [
        {
            diente: 18,
            diagnostico: "diagnostico"
        }
    ],

    transposicion: [
        {
            diente: 12,
            diagnostico: "diagnostico"
        }
    ],

    tratamientoPulpar: [
        {
            tipo: tratamientoPulparTipo.tc,
            estado: estado.bueno,
            diente: 71,
            diagnostico: "diagnostico"
        }
    ],

    detalle: "",
}
