import { opciones } from "../../models/opciones";

import { estado, defectosDesarrolloEsmalteTipo, fracturaTipo, giroversionTipo, movilidadPatologicaTipo, posicionDentariaTipo, tratamientoPulparTipo, cariesDentalTipo, coronaTipo, restauracionDefinitivaTipo } from '../../constants/Odontograma';
import { obtenerInicioFin } from "../../models/Diente";
import { OrtoFijoFinalBuenEstado, OrtoFijoFinalMalEstado, OrtoFijoInicioBuenEstado, OrtoFijoInicioMalEstado, OrtoFijoPuenteBuenEstado, OrtoFijoPuenteMalEstado } from "../../components/figurasInicioFin/OrtoFijo";
import { OrtoRemovibleBuenEstado, OrtoRemovibleMalEstado } from "../../components/figurasInicioFin/OrtoRemovible";
import { EdentuloTotal } from "../../components/figurasInicioFin/EdentuloTotal";
import { ProtesisFijaFinalBuenEstado, ProtesisFijaFinalMalEstado, ProtesisFijaInicioBuenEstado, ProtesisFijaInicioMalEstado, ProtesisFijaPuenteBuenEstado, ProtesisFijaPuenteMalEstado } from "../../components/figurasInicioFin/ProtesisFija";
import { ProtesisRemovibleBuenEstado, ProtesisRemovibleMalEstado } from "../../components/figurasInicioFin/ProtesisRemovible";
import { ProtesisTotalBuenEstado, ProtesisTotalMalEstado } from "../../components/figurasInicioFin/ProtesisTotal";
import { SiglasEstado } from "../../components/siglas/SiglasEstado";
export const dibujarDientes = (claseDiente, posicion) => {

    const estructura = (tipo) => {
        return {
            tipoDiente: tipo,
            imagenes: [],
            figurasInicioFin: [],
            figurasInicioFinEnDiente: [],

            //ORTO FIJO
            ortoFijoInicioBuenEstado: false,
            ortoFijoPuenteBuenEstado: false,
            ortoFijoFinalBuenEstado: false,

            ortoFijoInicioMalEstado: false,
            ortoFijoPuenteMalEstado: false,
            ortoFijoFinalMalEstado: false,
            //ORTO REMOVIBLE
            ortoRemovibleBuenEstado: false,
            ortoRemovibleMalEstado: false,

            siglas: [],

            //CARIES DENTALES
            tipoMB: {
                activo: false,
            },
            tipoCE: {
                activo: false,
            },
            tipoCD: {
                activo: false

            },
            tipoCDP: {
                activo: false,
            },
            //CORONA
            cMetalica: {
                activo: false,
            },
            cFenestrada: {
                activo: false,
            },
            cMetal: {
                activo: false,
            },
            cVeneer: {
                activo: false,
            },
            cJacket: {
                activo: false,
            },

            //CORONA TEMPORAL            
            coronaTemporal: {
                activo: false,
            },

            //<I-A
            //  <DEFECTOS
            hipoplasia: {
                activo: false,
            },
            hipoMineralizacion: {
                activo: false,
            },
            opacidadesEsmalte: {
                activo: false,
            },
            decoloracionEsmalte: {
                activo: false,
            },
            fluorosis: {
                activo: false,
            },
            //  DEFECTOS>
            diastema: false,
            fosasFisurasProfundas: false,
            espigonMunonBuenEstado: false,
            espigonMunonMalEstado: false,

            fracturaIncisal: false,
            fracturaCoronal: false,
            fracturaRaiz: false,

            // ortoFijoPuente: false,
            fusion: false,
            geminasion: false,

            giroversionMesial: false,
            giroversionDistal: false,

            impactacion: false,
            implanteDentalBuenEstado: false,
            implanteDentalMalEstado: false,
            //I-A/>

            /*L-P*/
            macrodoncia: false,
            microdoncia: false,

            //movilidad patologica
            movilidadM1: {
                activo: false,
            },
            movilidadM2: {
                activo: false,
            },
            movilidadM3: {
                activo: false,
            },
            movilidadM4: {
                activo: false,
            },
            movilidadM5: {
                activo: false,
            },

            //posicion dentaria
            mesializado: {
                activo: false,
            },
            distalizado: {
                activo: false,
            },
            vetibularizado: {
                activo: false,
            },
            palatinizado: {
                activo: false,
            },
            lingualizado: {
                activo: false,
            },
            //

            dentariaAusente: false,
            dentariaEctopica: false,
            dentariaClavija: false,
            erupcion: false,
            dentariaExtruida: false,
            dentariaIntruida: false,
            dentariaSupernumeraria: false,
            protesisFija: false,
            protesisRemovible: false,
            protesisTotal: false,

            /* R-T */

            remanenteRadicular: false,
            transposicion: false,
            superficieDesgastada: false,

            //  TRATAMIENTO PULPAR
            tratamientoConductos: {
                activo: false
            },
            pulpectomia: {
                activo: false
            },
            pulpotomia: {
                activo: false,
            },

            //RESTAURACION DEFINITIVA
            amalgama: {
                activo: false,
            },
            resina: {
                activo: false,
            },
            ionomero: {
                activo: false,
            },
            incrutacion: {
                activo: false,
            },
            incrustacion: {
                activo: false,
            },
            carilla: {
                activo: false,
            },
            //
            sellantes: false,
        };
    }

    const objDienteModelo = {
        18: {
            ...estructura('tipo1')
        },
        17: {
            ...estructura('tipo1'),
        },
        16: {
            ...estructura('tipo1')
        },
        15: {
            ...estructura('tipo1')
        },
        14: {
            ...estructura('tipo1')
        },
        13: {
            ...estructura('tipo2')
        },
        12: {
            ...estructura('tipo2')
        },
        11: {
            ...estructura('tipo2')
        },
        21: {
            ...estructura('tipo2')
        },
        22: {
            ...estructura('tipo2')
        },
        23: {
            ...estructura('tipo2')
        },
        24: {
            ...estructura('tipo1')
        },
        25: {
            ...estructura('tipo1')
        },
        26: {
            ...estructura('tipo1')
        },
        27: {
            ...estructura('tipo1')
        },
        28: {
            ...estructura('tipo1')
        },
        // niños
        55: {
            ...estructura('tipo1')
        },
        54: {
            ...estructura('tipo1')
        },
        53: {
            ...estructura('tipo2')
        },
        52: {
            ...estructura('tipo2')
        },
        51: {
            ...estructura('tipo2')
        },
        61: {
            ...estructura('tipo2')
        },
        62: {
            ...estructura('tipo2')
        },
        63: {
            ...estructura('tipo2')
        },
        64: {
            ...estructura('tipo1')
        },
        65: {
            ...estructura('tipo1')
        },

        85: {
            ...estructura('tipo1')
        },
        84: {
            ...estructura('tipo1')
        },
        83: {
            ...estructura('tipo2')
        },

        82: {
            ...estructura('tipo2')
        },
        81: {
            ...estructura('tipo2')
        },

        71: {
            ...estructura('tipo2')
        },

        72: {
            ...estructura('tipo2')
        },
        73: {
            ...estructura('tipo2')
        },
        74: {
            ...estructura('tipo1')
        },
        75: {
            ...estructura('tipo1')
        },
        48: {
            ...estructura('tipo1')
        },
        47: {
            ...estructura('tipo1')
        },
        46: {
            ...estructura('tipo1')
        },
        45: {
            ...estructura('tipo1')
        },
        44: {
            ...estructura('tipo1')
        },
        43: {
            ...estructura('tipo2')
        },
        42: {
            ...estructura('tipo2')
        },
        41: {
            ...estructura('tipo2')
        },
        31: {
            ...estructura('tipo2')
        },
        32: {
            ...estructura('tipo2')
        },
        33: {
            ...estructura('tipo2')
        },
        34: {
            ...estructura('tipo1')
        },
        35: {
            ...estructura('tipo1')
        },
        36: {
            ...estructura('tipo1')
        },
        37: {
            ...estructura('tipo1')
        },
        38: {
            ...estructura('tipo1')
        },
    };

    const objDiente = objDienteModelo;

    // let ortoFijosIniciales = [];
    // let ortoFijosFinales = [];
    // RECORREMOS LAS OPCIONES DE LA CLASE

    //recuperar el inicio y fin luego dibujar en los demas que estan dentro de ese rango

    for (const key in claseDiente) {



        if (claseDiente.hasOwnProperty.call(claseDiente, key)) {
            const element = claseDiente[key];

            //VERIFICAR SI EL ELEMENTO ES PUENTE DE UN INICIO Y FIN
            // console.log('ELEMENTO: ', element);
            // if (key === 'ortoFijo') {

            //     esPuenteOrtoFijo(element);
            // }
            // VERIFICAMOS QUE LA CLASE DIENTE NO ESTE VACIA
            if (element.length > 0) {


                // console.log('ELEMENT DE DIBUJAR DIENTE', element)
                // RECORREMOES TODOS LOS ITEMS DENTRO DE CADA UNO DE LOS ELEMENTEMOS DE LAS OPCIONES DE LA CLASE
                element.forEach(elementoArray => {
                    
                    const tipoDiente = objDiente[elementoArray['diente']]['tipoDiente'];
                    let imagenes = objDiente[elementoArray['diente']]['imagenes'];
                    let siglas = objDiente[elementoArray['diente']]['siglas'];


                    let figuras = [];
                    let figurasEnDiente = [];
                    let figurasFin = [];
                    let figurasEnDienteFin = [];
                    try {
                        figuras = objDiente[elementoArray['diente']]['figurasInicioFin'];
                        figurasEnDiente = objDiente[elementoArray['diente']]['figurasInicioFinEnDiente'];
                        figurasFin = objDiente[elementoArray['fin']]['figurasInicioFin'];
                        figurasEnDienteFin = objDiente[elementoArray['fin']]['figurasInicioFinEnDiente'];
                    } catch (e) {
                        // console.log('');
                    }
                    // VERICICAMOS QUE TIPO DE HALLAZGO EXISTE
                    // console.log("HOLA SOY EL KEY:", key);
                    const esEstadoBueno = elementoArray['estado'] === estado.bueno;
                    const { indexInicio, indexFin, listaIndexPuente, esInvertido } = obtenerInicioFin(elementoArray['diente'], elementoArray['fin']);
                    switch (key) {
                        case 'aparatoOrtoFijo':
                            if (esEstadoBueno) {
                                console.log('ESTADO BUENOOOOOOOO ');
                                figuras = [...figuras, <OrtoFijoInicioBuenEstado />];
                                figurasFin = [...figurasFin, <OrtoFijoFinalBuenEstado />];
                            } else {
                                figuras = [...figuras, <OrtoFijoInicioMalEstado />];
                                figurasFin = [...figurasFin, <OrtoFijoFinalMalEstado />];
                            }
                            objDiente[elementoArray['diente']]['figurasInicioFin'] = figuras;
                            objDiente[elementoArray['fin']]['figurasInicioFin'] = figurasFin;
                            for (let index = indexInicio + 1; index < indexFin; index++) {
                                const indexPuente = listaIndexPuente[index];
                                const compPuente = esEstadoBueno ? <OrtoFijoPuenteBuenEstado /> : <OrtoFijoPuenteMalEstado />;
                                objDiente[indexPuente]['figurasInicioFin'] = [...objDiente[indexPuente]['figurasInicioFin'], compPuente];
                            }
                            break;
                        case 'aparatoOrtoRemovible':
                            if (esEstadoBueno) {
                                figuras = [...figuras, <OrtoRemovibleBuenEstado invertir={esInvertido} />];
                                figurasFin = [...figurasFin, <OrtoRemovibleBuenEstado invertir={esInvertido} />];
                            } else {
                                figuras = [...figuras, <OrtoRemovibleMalEstado invertir={esInvertido} />];
                                figurasFin = [...figurasFin, <OrtoRemovibleMalEstado invertir={esInvertido} />];
                            }
                            objDiente[elementoArray['diente']]['figurasInicioFin'] = figuras;
                            objDiente[elementoArray['fin']]['figurasInicioFin'] = figurasFin;
                            for (let index = indexInicio + 1; index < indexFin; index++) {
                                const indexPuente = listaIndexPuente[index];
                                const compPuente = esEstadoBueno ? <OrtoRemovibleBuenEstado invertir={esInvertido} /> : <OrtoRemovibleMalEstado invertir={esInvertido} />;
                                objDiente[indexPuente]['figurasInicioFin'] = [...objDiente[indexPuente]['figurasInicioFin'], compPuente];
                            }
                            break;
                        case 'edentuloTotal':
                            figurasEnDiente = [...figurasEnDiente, <EdentuloTotal esInvertido={esInvertido} />];
                            figurasEnDienteFin = [...figurasEnDienteFin, <EdentuloTotal esInvertido={esInvertido} />];
                            objDiente[elementoArray['diente']]['figurasInicioFinEnDiente'] = figurasEnDiente;
                            objDiente[elementoArray['fin']]['figurasInicioFinEnDiente'] = figurasEnDienteFin;
                            for (let index = indexInicio + 1; index < indexFin; index++) {
                                const indexPuente = listaIndexPuente[index];
                                objDiente[indexPuente]['figurasInicioFinEnDiente'] = [...objDiente[indexPuente]['figurasInicioFinEnDiente'], <EdentuloTotal esInvertido={esInvertido} />];
                            }
                            break;
                        case 'protesisFija':
                            if (esEstadoBueno) {
                                figuras = [...figuras, <ProtesisFijaInicioBuenEstado esInvertido={esInvertido} />];
                                figurasFin = [...figurasFin, <ProtesisFijaFinalBuenEstado esInvertido={esInvertido} />];
                            } else {
                                figuras = [...figuras, <ProtesisFijaInicioMalEstado esInvertido={esInvertido} />];
                                figurasFin = [...figurasFin, <ProtesisFijaFinalMalEstado esInvertido={esInvertido} />];
                            }
                            objDiente[elementoArray['diente']]['figurasInicioFin'] = figuras;
                            objDiente[elementoArray['fin']]['figurasInicioFin'] = figurasFin;
                            for (let index = indexInicio + 1; index < indexFin; index++) {
                                const indexPuente = listaIndexPuente[index];
                                const compPuente = esEstadoBueno ? <ProtesisFijaPuenteBuenEstado esInvertido={esInvertido} /> : <ProtesisFijaPuenteMalEstado esInvertido={esInvertido} />;
                                objDiente[indexPuente]['figurasInicioFin'] = [...objDiente[indexPuente]['figurasInicioFin'], compPuente];
                            }
                            break;
                        case 'protesisRemovible':
                            if (esEstadoBueno) {
                                figuras = [...figuras, <ProtesisRemovibleBuenEstado />];
                                figurasFin = [...figurasFin, <ProtesisRemovibleBuenEstado />];
                            } else {
                                figuras = [...figuras, <ProtesisRemovibleMalEstado />];
                                figurasFin = [...figurasFin, <ProtesisRemovibleMalEstado />];
                            }
                            objDiente[elementoArray['diente']]['figurasInicioFin'] = figuras;
                            objDiente[elementoArray['fin']]['figurasInicioFin'] = figurasFin;
                            for (let index = indexInicio + 1; index < indexFin; index++) {
                                const indexPuente = listaIndexPuente[index];
                                const compPuente = esEstadoBueno ? <ProtesisRemovibleBuenEstado /> : <ProtesisRemovibleMalEstado />;
                                objDiente[indexPuente]['figurasInicioFin'] = [...objDiente[indexPuente]['figurasInicioFin'], compPuente];
                            }
                            break;
                        case 'protesisTotal':
                            console.log('ES INVERTIDOOOOOOOO', esInvertido);
                            if (esEstadoBueno) {
                                figurasEnDiente = [...figurasEnDiente, <ProtesisTotalBuenEstado esInvertido={esInvertido} />];
                                figurasEnDienteFin = [...figurasEnDienteFin, <ProtesisTotalBuenEstado esInvertido={esInvertido} />];
                            } else {
                                figurasEnDiente = [...figurasEnDiente, <ProtesisTotalMalEstado esInvertido={esInvertido} />];
                                figurasEnDienteFin = [...figurasEnDienteFin, <ProtesisTotalMalEstado esInvertido={esInvertido} />];
                            }
                            objDiente[elementoArray['diente']]['figurasInicioFinEnDiente'] = figurasEnDiente;
                            objDiente[elementoArray['fin']]['figurasInicioFinEnDiente'] = figurasEnDienteFin;
                            for (let index = indexInicio + 1; index < indexFin; index++) {
                                const indexPuente = listaIndexPuente[index];
                                const compPuente = esEstadoBueno ? <ProtesisTotalBuenEstado esInvertido={esInvertido} /> : <ProtesisTotalMalEstado esInvertido={esInvertido} />;
                                objDiente[indexPuente]['figurasInicioFinEnDiente'] = [...objDiente[indexPuente]['figurasInicioFinEnDiente'], compPuente];
                            }
                            break;
                        /*A-I*/
                        case 'cariesDental':
                            // VERIFICAMOS SI LOS DIENES SON DE LA PARTE SUPERIOR O INFERIOR
                            if (posicion === "superior" || posicion === "inferior") {

                                console.log('POSICION!!!!!', posicion);
                                const cariesActivo = { activo: true, tipo: elementoArray['tipo'] };

                                switch (elementoArray['tipo']) {
                                    case cariesDentalTipo.mb:
                                        objDiente[elementoArray['diente']]['tipoMB'] = cariesActivo;
                                        break;

                                    case cariesDentalTipo.ce:
                                        objDiente[elementoArray['diente']]['tipoCE'] = cariesActivo;
                                        break;

                                    case cariesDentalTipo.cd:
                                        objDiente[elementoArray['diente']]['tipoCD'] = cariesActivo;
                                        break;

                                    case cariesDentalTipo.cdp:
                                        objDiente[elementoArray['diente']]['tipoCDP'] = cariesActivo;
                                        break;

                                    default:
                                        break;
                                }

                                // OPCIONES POR CADA DIENTE
                                if (elementoArray['partes']['distal']) {
                                    imagenes = [...imagenes, opciones[key]['imagenes'][posicion][tipoDiente]['distal']];
                                }
                                if (elementoArray['partes']['mesial']) {
                                    imagenes = [...imagenes, opciones[key]['imagenes'][posicion][tipoDiente]['mesial']];
                                }
                                if (elementoArray['partes']['oclusal']) {
                                    imagenes = [...imagenes, opciones[key]['imagenes'][posicion][tipoDiente]['oclusal']];
                                }
                                if (elementoArray['partes']['palatino']) {
                                    imagenes = [...imagenes, opciones[key]['imagenes'][posicion][tipoDiente]['palatino']];
                                }
                                if (elementoArray['partes']['vestibular']) {
                                    imagenes = [...imagenes, opciones[key]['imagenes'][posicion][tipoDiente]['vestibular']];
                                }
                                // console.log("abc2 ", imagenes);
                                objDiente[elementoArray['diente']]['imagenes'] = [...imagenes];
                                // console.log("mapa", objDiente);
                            } else {
                                // TIPO DE DIENTE INFERIOR
                            }
                            break;
                        case 'corona':
                            if (posicion === "superior" || posicion === "inferior") {
                                const coronaActivo = { activo: true, tipo: elementoArray['tipo'], estado: elementoArray['estado'] };
                                switch (elementoArray['tipo']) {
                                    case coronaTipo.cm:
                                        siglas = [...siglas, <SiglasEstado buenEstado={elementoArray['estado'] === estado.bueno} siglas={elementoArray['tipo']} />];
                                        objDiente[elementoArray['diente']]['cMetalica'] = coronaActivo;
                                        objDiente[elementoArray['diente']]['siglas'] = [...siglas];
                                        break;

                                    case coronaTipo.cf:
                                        siglas = [...siglas, <SiglasEstado buenEstado={elementoArray['estado'] === estado.bueno} siglas={elementoArray['tipo']} />];
                                        objDiente[elementoArray['diente']]['cFenestrada'] = coronaActivo;
                                        objDiente[elementoArray['diente']]['siglas'] = [...siglas];
                                        break;

                                    case coronaTipo.cmc:
                                        siglas = [...siglas, <SiglasEstado buenEstado={elementoArray['estado'] === estado.bueno} siglas={elementoArray['tipo']} />];
                                        objDiente[elementoArray['diente']]['cMetal'] = coronaActivo;
                                        objDiente[elementoArray['diente']]['siglas'] = [...siglas];
                                        break;

                                    case coronaTipo.cv:
                                        siglas = [...siglas, <SiglasEstado buenEstado={elementoArray['estado'] === estado.bueno} siglas={elementoArray['tipo']} />];
                                        objDiente[elementoArray['diente']]['cVeneer'] = coronaActivo;
                                        objDiente[elementoArray['diente']]['siglas'] = [...siglas];
                                        break;

                                    case coronaTipo.cj:
                                        siglas = [...siglas, <SiglasEstado buenEstado={elementoArray['estado'] === estado.bueno} siglas={elementoArray['tipo']} />];
                                        objDiente[elementoArray['diente']]['cJacket'] = coronaActivo;
                                        objDiente[elementoArray['diente']]['siglas'] = [...siglas];
                                        break;

                                    default:
                                        break;
                                }

                                if (elementoArray['estado'] === estado.malo) {
                                    imagenes = [...imagenes, opciones[key]['imagenes'][posicion]['mal_estado']];
                                }
                                if (elementoArray['estado'] === estado.bueno) {
                                    imagenes = [...imagenes, opciones[key]['imagenes'][posicion]['buen_estado']];
                                }
                                objDiente[elementoArray['diente']]['imagenes'] = [...imagenes];
                                // console.log("mapa", objDiente);
                            } else {
                                // TIPO DE DIENTE INFERIOR
                            }
                            break;
                        case 'coronaTemporal':
                            if (posicion === "superior" || posicion === "inferior") {
                                const coronaTemporalActivo = { activo: true, estado: elementoArray['estado'] };
                                objDiente[elementoArray['diente']]['coronaTemporal'] = coronaTemporalActivo;

                                siglas = [...siglas, <SiglasEstado buenEstado={elementoArray['estado'] === estado.bueno} siglas='CT' />];
                                objDiente[elementoArray['diente']]['siglas'] = [...siglas];


                                if (elementoArray['estado'] === estado.malo) {
                                    imagenes = [...imagenes, opciones[key]['imagenes'][posicion]['mal_estado']];
                                }
                                if (elementoArray['estado'] === estado.bueno) {
                                    imagenes = [...imagenes, opciones[key]['imagenes'][posicion]['buen_estado']];
                                }
                                objDiente[elementoArray['diente']]['imagenes'] = [...imagenes];
                                // console.log("mapa", objDiente);
                            } else {
                                // TIPO DE DIENTE INFERIOR
                            }
                            break;

                        case 'defectosDesarrolloEsmalte':
                            if (posicion === "superior" || posicion === "inferior") {
                                const defectoActivo = { activo: true, tipo: elementoArray['tipo'], estado: elementoArray['estado'], };
                                switch (elementoArray['tipo']) {
                                    case defectosDesarrolloEsmalteTipo.d:
                                        siglas = [...siglas, <SiglasEstado buenEstado={elementoArray['estado'] === estado.bueno} siglas={elementoArray['tipo']} />];
                                        objDiente[elementoArray['diente']]['siglas'] = [...siglas];
                                        objDiente[elementoArray['diente']]['decoloracionEsmalte'] = defectoActivo;
                                        break;

                                    case defectosDesarrolloEsmalteTipo.fluorosis:
                                        siglas = [...siglas, <SiglasEstado buenEstado={elementoArray['estado'] === estado.bueno} siglas={elementoArray['tipo']} />];
                                        objDiente[elementoArray['diente']]['siglas'] = [...siglas];
                                        objDiente[elementoArray['diente']]['fluorosis'] = defectoActivo;
                                        break;

                                    case defectosDesarrolloEsmalteTipo.hm:
                                        siglas = [...siglas, <SiglasEstado buenEstado={elementoArray['estado'] === estado.bueno} siglas={elementoArray['tipo']} />];
                                        objDiente[elementoArray['diente']]['siglas'] = [...siglas];
                                        objDiente[elementoArray['diente']]['hipoMineralizacion'] = defectoActivo;
                                        break;

                                    case defectosDesarrolloEsmalteTipo.hp:
                                        siglas = [...siglas, <SiglasEstado buenEstado={elementoArray['estado'] === estado.bueno} siglas={elementoArray['tipo']} />];
                                        objDiente[elementoArray['diente']]['siglas'] = [...siglas];
                                        objDiente[elementoArray['diente']]['hipoplasia'] = defectoActivo;
                                        break;

                                    case defectosDesarrolloEsmalteTipo.o:
                                        siglas = [...siglas, <SiglasEstado buenEstado={elementoArray['estado'] === estado.bueno} siglas={elementoArray['tipo']} />];
                                        objDiente[elementoArray['diente']]['siglas'] = [...siglas];
                                        objDiente[elementoArray['diente']]['opacidadesEsmalte'] = defectoActivo;
                                        break;
                                    default:
                                        break;
                                }
                                // if (elementoArray['tipo'] === ) { }
                                // if (objDiente[elementoArray['diente']]['hipoplasia']) { }
                                // console.log('DEFECTOS DESARROLLO ESMALTE', elementoArray);
                            } else {
                                // TIPO DE DIENTE INFERIOR
                            }
                            break;

                        case 'diastema':
                            if (posicion === "superior" || posicion === "inferior") {
                                objDiente[elementoArray['diente']]['diastema'] = true;
                                // console.log("mapa", objDiente);
                            } else {
                                // TIPO DE DIENTE INFERIOR
                            }
                            break;
                        case 'fosasFisurasProfundas':
                            if (posicion === "superior" || posicion === "inferior") {
                                objDiente[elementoArray['diente']]['fosasFisurasProfundas'] = true;
                                // console.log("mapa", objDiente);
                            } else {
                                // TIPO DE DIENTE INFERIOR
                            }
                            break;

                        case 'espigonMunon':
                            if (posicion === "superior" || posicion === "inferior") {
                                if (elementoArray['estado'] === estado.bueno) {
                                    objDiente[elementoArray['diente']]['espigonMunonBuenEstado'] = true;
                                    objDiente[elementoArray['diente']]['espigonMunonMalEstado'] = false;
                                } else if (elementoArray['estado'] === estado.malo) {
                                    objDiente[elementoArray['diente']]['espigonMunonBuenEstado'] = false;
                                    objDiente[elementoArray['diente']]['espigonMunonMalEstado'] = true;
                                }
                            } else {
                                // TIPO DE DIENTE INFERIOR
                            }
                            break;
                        case 'fractura':
                            if (posicion === "superior" || posicion === "inferior") {
                                switch (elementoArray['tipo']) {
                                    case fracturaTipo.coronal:
                                        objDiente[elementoArray['diente']]['fracturaCoronal'] = true;
                                        break;
                                    case fracturaTipo.incisal:
                                        objDiente[elementoArray['diente']]['fracturaIncisal'] = true;
                                        break;
                                    case fracturaTipo.raizCoronal:
                                        objDiente[elementoArray['diente']]['fracturaRaiz'] = true;
                                        break;
                                    default:
                                        break;
                                }
                            } else {
                                // TIPO DE DIENTE INFERIOR
                            }
                            break;
                        case 'fusion':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                objDiente[elementoArray['diente']]['fusion'] = true;
                            }
                            break;
                        case 'geminasion':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                objDiente[elementoArray['diente']]['geminasion'] = true;
                            }
                            break;
                        case 'giroversion':
                            if (posicion === 'superior' || posicion === 'inferior') {

                                switch (elementoArray['tipo']) {
                                    case giroversionTipo.distal:
                                        objDiente[elementoArray['diente']]['giroversionDistal'] = true;
                                        break;
                                    case giroversionTipo.mesial:
                                        objDiente[elementoArray['diente']]['giroversionMesial'] = true;
                                        break;
                                    default:
                                        break;
                                }
                            }
                            break;
                        case 'impactacion':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                objDiente[elementoArray['diente']]['impactacion'] = true;
                            }
                            break;
                        case 'implanteDental':
                            if (posicion === 'superior' || posicion === 'inferior') {

                                if (elementoArray['estado'] === estado.malo) {
                                    objDiente[elementoArray['diente']]['implanteDentalMalEstado'] = true;
                                }
                                if (elementoArray['estado'] === estado.bueno) {
                                    objDiente[elementoArray['diente']]['implanteDentalBuenEstado'] = true;
                                }
                            }
                            break;
                        /*L-P*/
                        case 'macrodoncia':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                objDiente[elementoArray['diente']]['macrodoncia'] = true;
                            }
                            break;

                        case 'microdoncia':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                objDiente[elementoArray['diente']]['microdoncia'] = true;
                            }
                            break;

                        case 'movilidadPatologica':
                            if (posicion === "superior" || posicion === "inferior") {
                                const movilidadActivo = { activo: true, tipo: elementoArray['tipo'] };

                                switch (elementoArray['tipo']) {
                                    case movilidadPatologicaTipo.m1:
                                        objDiente[elementoArray['diente']]['movilidadM1'] = movilidadActivo;
                                        break;

                                    case movilidadPatologicaTipo.m2:
                                        objDiente[elementoArray['diente']]['movilidadM2'] = movilidadActivo;
                                        break;

                                    case movilidadPatologicaTipo.m3:
                                        objDiente[elementoArray['diente']]['movilidadM3'] = movilidadActivo;
                                        break;

                                    case movilidadPatologicaTipo.m4:
                                        objDiente[elementoArray['diente']]['movilidadM4'] = movilidadActivo;
                                        break;

                                    case movilidadPatologicaTipo.m5:
                                        objDiente[elementoArray['diente']]['movilidadM5'] = movilidadActivo;
                                        break;

                                    default:
                                        break;
                                }

                            } else {
                                // TIPO DE DIENTE INFERIOR
                            }
                            break;

                        case 'piezaDentariaAusente':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                objDiente[elementoArray['diente']]['dentariaAusente'] = true;
                            }
                            break;

                        case 'piezaDentariaEctopica':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                objDiente[elementoArray['diente']]['dentariaEctopica'] = true;
                            }
                            break;

                        case 'piezaDentariaClavija':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                objDiente[elementoArray['diente']]['dentariaClavija'] = true;
                            }
                            break;

                        case 'piezaDentariaErupcion':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                objDiente[elementoArray['diente']]['erupcion'] = true;
                            }
                            break;


                        case 'piezaDentariaExtruida':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                objDiente[elementoArray['diente']]['dentariaExtruida'] = true;
                            }
                            break;



                        case 'piezaDentariaIntruida':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                objDiente[elementoArray['diente']]['dentariaIntruida'] = true;
                            }
                            break;

                        case 'piezaDentariaSupernumeraria':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                objDiente[elementoArray['diente']]['dentariaSupernumeraria'] = true;
                            }
                            break;

                        case 'posicionDentaria':
                            if (posicion === "superior" || posicion === "inferior") {
                                const posicionDentariaActivo = { activo: true, tipo: elementoArray['tipo'] };

                                switch (elementoArray['tipo']) {
                                    case posicionDentariaTipo.m:
                                        objDiente[elementoArray['diente']]['mesializado'] = posicionDentariaActivo;
                                        break;

                                    case posicionDentariaTipo.d:
                                        objDiente[elementoArray['diente']]['distalizado'] = posicionDentariaActivo;
                                        break;

                                    case posicionDentariaTipo.v:
                                        objDiente[elementoArray['diente']]['vetibularizado'] = posicionDentariaActivo;
                                        break;

                                    case posicionDentariaTipo.p:
                                        objDiente[elementoArray['diente']]['palatinizado'] = posicionDentariaActivo;
                                        break;

                                    case posicionDentariaTipo.l:
                                        objDiente[elementoArray['diente']]['lingualizado'] = posicionDentariaActivo;
                                        break;

                                    default:
                                        break;
                                }

                            } else {
                                // TIPO DE DIENTE INFERIOR
                            }
                            break;


                        /* R-T */
                        case 'remanenteRadicular':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                objDiente[elementoArray['diente']]['remanenteRadicular'] = true;
                            }
                            break;

                        case 'transposicion':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                objDiente[elementoArray['diente']]['transposicion'] = true;
                            }
                            break;

                        case 'superficieDesgastada':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                objDiente[elementoArray['diente']]['superficieDesgastada'] = true;
                            }
                            break;

                        case 'tratamientoPulpar':
                            if (posicion === "superior" || posicion === "inferior") {
                                const tratamientoActivo = { activo: true, tipo: elementoArray['tipo'], estado: elementoArray['estado'], };
                                switch (elementoArray['tipo']) {
                                    case tratamientoPulparTipo.tc:
                                        objDiente[elementoArray['diente']]['tratamientoConductos'] = tratamientoActivo;
                                        break;

                                    case tratamientoPulparTipo.pc:
                                        objDiente[elementoArray['diente']]['pulpectomia'] = tratamientoActivo;
                                        break;

                                    case tratamientoPulparTipo.pp:
                                        objDiente[elementoArray['diente']]['pulpotomia'] = tratamientoActivo;

                                        if (elementoArray['estado'] === estado.malo) {
                                            imagenes = [...imagenes, opciones[key]['imagenes'][posicion]['mal_estado']];
                                        }
                                        if (elementoArray['estado'] === estado.bueno) {
                                            imagenes = [...imagenes, opciones[key]['imagenes'][posicion]['buen_estado']];
                                        }

                                        break;
                                    default:
                                        break;
                                }
                                objDiente[elementoArray['diente']]['imagenes'] = [...imagenes];
                            } else {
                                // TIPO DE DIENTE INFERIOR
                            }
                            break;
                        case 'restauracionDefinitiva':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                const path = opciones[key]['imagenes'][posicion];
                                const pathBuenEstado = path[`${tipoDiente}_azul`];
                                const pathMalEstado = path[`${tipoDiente}_rojo`];

                                const restauracionActivo = { activo: true, tipo: elementoArray['tipo'] };
                                switch (elementoArray['tipo']) {
                                    case restauracionDefinitivaTipo.am:
                                        objDiente[elementoArray['diente']]['amalgama'] = restauracionActivo;
                                        break;

                                    case restauracionDefinitivaTipo.r:
                                        objDiente[elementoArray['diente']]['resina'] = restauracionActivo;
                                        break

                                    case restauracionDefinitivaTipo.iv:
                                        objDiente[elementoArray['diente']]['ionomero'] = restauracionActivo;
                                        break

                                    case restauracionDefinitivaTipo.im:
                                        objDiente[elementoArray['diente']]['incrutacion'] = restauracionActivo;
                                        break

                                    case restauracionDefinitivaTipo.ie:
                                        objDiente[elementoArray['diente']]['incrustacion'] = restauracionActivo;
                                        break

                                    case restauracionDefinitivaTipo.c:
                                        objDiente[elementoArray['diente']]['carilla'] = restauracionActivo;
                                        break

                                    default:
                                        break;
                                }

                                // OPCIONES POR CADA DIENTE
                                if (elementoArray['partes']['distal']) {
                                    if (elementoArray['partes']['distal']['estado'] === estado.bueno) {
                                        // console.log('pathBuenEstado', pathBuenEstado);
                                        imagenes = [...imagenes, pathBuenEstado['distal']];
                                    }
                                    if (elementoArray['partes']['distal']['estado'] === estado.malo) {
                                        // console.log('pathMalEstado', pathMalEstado);
                                        imagenes = [...imagenes, pathMalEstado['distal']];
                                    }
                                }
                                if (elementoArray['partes']['mesial']) {
                                    if (elementoArray['partes']['mesial']['estado'] === estado.bueno) {
                                        imagenes = [...imagenes, pathBuenEstado['mesial']];
                                    }
                                    if (elementoArray['partes']['mesial']['estado'] === estado.malo) {
                                        imagenes = [...imagenes, pathMalEstado['mesial']];
                                    }
                                }
                                if (elementoArray['partes']['oclusal']) {
                                    if (elementoArray['partes']['oclusal']['estado'] === estado.bueno) {
                                        imagenes = [...imagenes, pathBuenEstado['oclusal']];
                                    }
                                    if (elementoArray['partes']['oclusal']['estado'] === estado.malo) {
                                        imagenes = [...imagenes, pathMalEstado['oclusal']];
                                    }
                                }
                                if (elementoArray['partes']['palatino']) {
                                    if (elementoArray['partes']['palatino']['estado'] === estado.bueno) {
                                        imagenes = [...imagenes, pathBuenEstado['palatino']];
                                    }
                                    if (elementoArray['partes']['palatino']['estado'] === estado.malo) {
                                        imagenes = [...imagenes, pathMalEstado['palatino']];
                                    }
                                }
                                if (elementoArray['partes']['vestibular']) {
                                    if (elementoArray['partes']['vestibular']['estado'] === estado.bueno) {
                                        imagenes = [...imagenes, pathBuenEstado['vestibular']];
                                    }
                                    if (elementoArray['partes']['vestibular']['estado'] === estado.malo) {
                                        imagenes = [...imagenes, pathMalEstado['vestibular']];
                                    }
                                }
                                objDiente[elementoArray['diente']]['imagenes'] = [...imagenes];
                            }
                            break;
                        case 'restauracionTemporal':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                const path = opciones[key]['imagenes'][posicion];
                                // const pathBuenEstado = path[`${tipoDiente}_azul`];
                                const pathMalEstado = path[`${tipoDiente}_rojo`];
                                // OPCIONES POR CADA DIENTE
                                if (elementoArray['partes']['distal']) {
                                    // console.log('pathMalEstado', pathMalEstado);
                                    imagenes = [...imagenes, pathMalEstado['distal']];

                                }
                                if (elementoArray['partes']['mesial']) {
                                    imagenes = [...imagenes, pathMalEstado['mesial']];

                                }
                                if (elementoArray['partes']['oclusal']) {
                                    imagenes = [...imagenes, pathMalEstado['oclusal']];

                                }
                                if (elementoArray['partes']['palatino']) {
                                    imagenes = [...imagenes, pathMalEstado['palatino']];

                                }
                                if (elementoArray['partes']['vestibular']) {
                                    imagenes = [...imagenes, pathMalEstado['vestibular']];

                                }
                                objDiente[elementoArray['diente']]['imagenes'] = [...imagenes];
                            }
                            break;
                        case 'sellantes':
                            if (posicion === 'superior' || posicion === 'inferior') {
                                const path = opciones[key]['imagenes'][posicion];
                                const pathBuenEstado = path[`${tipoDiente}_azul`];
                                const pathMalEstado = path[`${tipoDiente}_rojo`];

                                objDiente[elementoArray['diente']]['sellantes'] = true;

                                // OPCIONES POR CADA DIENTE
                                if (elementoArray['partes']['distal']) {
                                    if (elementoArray['partes']['distal']['estado'] === estado.bueno) {
                                        // console.log('pathBuenEstado', pathBuenEstado);
                                        imagenes = [...imagenes, pathBuenEstado['distal']];
                                    }
                                    if (elementoArray['partes']['distal']['estado'] === estado.malo) {
                                        // console.log('pathMalEstado', pathMalEstado);
                                        imagenes = [...imagenes, pathMalEstado['distal']];
                                    }
                                }
                                if (elementoArray['partes']['mesial']) {
                                    if (elementoArray['partes']['mesial']['estado'] === estado.bueno) {
                                        imagenes = [...imagenes, pathBuenEstado['mesial']];
                                    }
                                    if (elementoArray['partes']['mesial']['estado'] === estado.malo) {
                                        imagenes = [...imagenes, pathMalEstado['mesial']];
                                    }
                                }
                                if (elementoArray['partes']['oclusal']) {
                                    if (elementoArray['partes']['oclusal']['estado'] === estado.bueno) {
                                        imagenes = [...imagenes, pathBuenEstado['oclusal']];
                                    }
                                    if (elementoArray['partes']['oclusal']['estado'] === estado.malo) {
                                        imagenes = [...imagenes, pathMalEstado['oclusal']];
                                    }
                                }
                                if (elementoArray['partes']['palatino']) {
                                    if (elementoArray['partes']['palatino']['estado'] === estado.bueno) {
                                        imagenes = [...imagenes, pathBuenEstado['palatino']];
                                    }
                                    if (elementoArray['partes']['palatino']['estado'] === estado.malo) {
                                        imagenes = [...imagenes, pathMalEstado['palatino']];
                                    }
                                }
                                if (elementoArray['partes']['vestibular']) {
                                    if (elementoArray['partes']['vestibular']['estado'] === estado.bueno) {
                                        imagenes = [...imagenes, pathBuenEstado['vestibular']];
                                    }
                                    if (elementoArray['partes']['vestibular']['estado'] === estado.malo) {
                                        imagenes = [...imagenes, pathMalEstado['vestibular']];
                                    }
                                }
                                objDiente[elementoArray['diente']]['imagenes'] = [...imagenes];
                            }
                            break;
                        default:
                            break;
                    }
                });
            }


        }
    }


    return objDiente;
}


const esPuenteOrtoFijo = (ortoFijo) => {
    console.log('ELEMENTO DEMO: ', ortoFijo);
}