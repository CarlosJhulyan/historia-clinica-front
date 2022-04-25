import {
  cariesDentalTipo,
  coronaTipo,
  defectosDesarrolloEsmalteTipo,
  enlaceTipo,
  estado as constEstado,
  estado,
  fracturaTipo,
  giroversionTipo,
  movilidadPatologicaTipo,
  posicionDentariaTipo,
  restauracionDefinitivaTipo,
  tratamientoPulparTipo
} from "../constants/Odontograma";
import { opciones } from "./opciones";


export const indexDientesAdultoSuperior = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
export const indexDientesInfanteSuperior = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
export const indexDientesInfanteInferior = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];
export const indexDientesAdultoInferior = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
export class Diente {

  /* A - I*/
  aparatoOrtoFijo = [];
  aparatoOrtoRemovible = [];
  cariesDental = [];
  corona = [];
  coronaTemporal = [];
  defectosDesarrolloEsmalte = [];
  diastema = [];
  edentuloTotal = [];
  espigonMunon = [];
  fosasFisurasProfundas = [];
  fractura = [];
  fusion = [];
  geminasion = [];
  giroversion = [];
  impactacion = [];
  implanteDental = [];
  //* L-P (Bruno)
  macrodoncia = [];
  microdoncia = [];
  movilidadPatologica = [];
  piezaDentariaAusente = [];
  piezaDentariaEctopica = [];
  piezaDentariaClavija = [];
  piezaDentariaErupcion = [];
  piezaDentariaExtruida = [];
  piezaDentariaIntruida = [];
  piezaDentariaSupernumeraria = [];
  posicionDentaria = [];
  protesisFija = [];
  protesisRemovible = [];
  protesisTotal = [];

  /* R - T */
  remanenteRadicular = [];
  restauracionDefinitiva = [];
  restauracionTemporal = [];
  sellantes = [];
  superficieDesgastada = [];
  transposicion = [];
  tratamientoPulpar = [];
  /* DETALLE */
  detalle = "";

  /* ENLACE */
  enlace = [];

  importar(data) {
    if (data !== '') {
      data = JSON.parse(data);
      /* A - I */
      this.aparatoOrtoFijo = data.aparatoOrtoFijo;
      this.aparatoOrtoRemovible = data.aparatoOrtoRemovible;
      this.cariesDental = data.cariesDental;
      this.corona = data.corona;
      this.coronaTemporal = data.coronaTemporal;
      this.defectosDesarrolloEsmalte = data.defectosDesarrolloEsmalte;
      this.diastema = data.diastema;
      this.edentuloTotal = data.edentuloTotal;
      this.espigonMunon = data.espigonMunon;
      this.fosasFisurasProfundas = data.fosasFisurasProfundas;
      this.fractura = data.fractura;
      this.fusion = data.fusion;
      this.geminasion = data.geminasion;
      this.giroversion = data.giroversion;
      this.impactacion = data.impactacion;
      this.implanteDental = data.implanteDental;
      //* R-T (Bruno)
      this.macrodoncia = data.macrodoncia;
      this.microdoncia = data.microdoncia;
      this.movilidadPatologica = data.movilidadPatologica;
      this.piezaDentariaAusente = data.piezaDentariaAusente;
      this.piezaDentariaEctopica = data.piezaDentariaEctopica;
      this.piezaDentariaClavija = data.piezaDentariaClavija;
      this.piezaDentariaErupcion = data.piezaDentariaErupcion;
      this.piezaDentariaExtruida = data.piezaDentariaExtruida;
      this.piezaDentariaIntruida = data.piezaDentariaIntruida;
      this.piezaDentariaSupernumeraria = data.piezaDentariaSupernumeraria;
      this.posicionDentaria = data.posicionDentaria;
      this.protesisFija = data.protesisFija;
      this.protesisRemovible = data.protesisRemovible;
      this.protesisTotal = data.protesisTotal;
      /* R - T */
      this.remanenteRadicular = data.remanenteRadicular;
      this.restauracionDefinitiva = data.restauracionDefinitiva;
      this.restauracionTemporal = data.restauracionTemporal;
      this.sellantes = data.sellantes;
      this.superficieDesgastada = data.superficieDesgastada;
      this.transposicion = data.transposicion;
      this.tratamientoPulpar = data.tratamientoPulpar;
      /* DETALLE */
      this.detalle = data.detalle;
      /* ENLACE */
      this.enlace = data.enlace;
    }

  }

  setAparatoOrtoFijo(aparatoOrtoFijo) {
    const { estado, diente, fin } = aparatoOrtoFijo;
    if ((estado === constEstado.bueno || estado === constEstado.malo) && diente !== 0 && fin !== 0) {
      const { indexInicio, indexFin } = obtenerInicioFin(diente, fin);
      if (indexInicio > indexFin) {
        throw new Error('Aparato OrtoFijo: El index inicio debe ser menor al final');
      } else {
        console.log('set: ', aparatoOrtoFijo);
        this.aparatoOrtoFijo = [...this.aparatoOrtoFijo, aparatoOrtoFijo];
      }
    } else {
      throw new Error('Aparato OrtoFijo: Datos incorrectos');
    }
  }

  /* LUIS*/
  setAparatoOrtoRemovible(aparatoOrtoRemovible) {
    const { estado, diente, fin } = aparatoOrtoRemovible;
    if ((estado === constEstado.bueno || estado === constEstado.malo) && diente !== '' && fin !== '') {
      const { indexInicio, indexFin } = obtenerInicioFin(diente, fin);
      if (indexInicio > indexFin) {
        throw new Error('Aparato OrtoRemovible: El index inicio debe ser menor al final');
      } else {
        this.aparatoOrtoRemovible = [...this.aparatoOrtoRemovible, aparatoOrtoRemovible];
      }
    } else {
      throw new Error('Aparato OrtoRemovible: Datos incorrectos');
    }
  }

  setCariesDental(cariesDental) {
    const { tipo, diente, partes } = cariesDental;
    if (tipo === cariesDentalTipo.mb || tipo === cariesDentalTipo.ce || tipo === cariesDentalTipo.cd || tipo === cariesDentalTipo.cdp) {
      if (diente) {
        if (partes.vestibular || partes.palatino || partes.distal || partes.mesial || partes.oclusal) {

          this.cariesDental = [...this.cariesDental, cariesDental];
        } else {
          throw new Error('Caries Dental: Seleccione una parte del diente');
        }
      } else {
        throw new Error('Caries Dental: Seleccione un diente');
      }
    } else {
      throw new Error('Caries Dental: Seleccione un tipo de caries');
    }
  }

  setCorona(corona) {
    const { tipo, estado, diente } = corona;
    if (
      ((tipo === coronaTipo.cm) && (estado === constEstado.bueno || estado === constEstado.malo)) ||
      ((tipo === coronaTipo.cf) && (estado === constEstado.bueno || estado === constEstado.malo)) ||
      ((tipo === coronaTipo.cmc) && (estado === constEstado.bueno || estado === constEstado.malo)) ||
      ((tipo === coronaTipo.cv) && (estado === constEstado.bueno || estado === constEstado.malo)) ||
      ((tipo === coronaTipo.cj) && (estado === constEstado.bueno || estado === constEstado.malo))
    ) {
      if (diente) {
        this.corona = [...this.corona, corona];
      } else {
        throw new Error('Corona: Seleccione un diente');
      }
    } else {
      throw new Error('Corona: Seleccione un tipo de diente');
    }


  }

  setCoronaTemporal(coronaTemporal) {
    const { estado, diente } = coronaTemporal;
    if (estado === constEstado.bueno || estado === constEstado.malo) {
      if (diente) {
        this.coronaTemporal = [...this.coronaTemporal, coronaTemporal];
      } else {
        throw new Error('Corona Temporal: Seleccione un diente');
      }
    } else {
      throw new Error('Corona Temporal: Seleccione un estado');
    }

  }


  setDefectosDesarrolloEsmalte(defectosDesarrolloEsmalte) {
    const { tipo, estado, diente } = defectosDesarrolloEsmalte;
    if (
      ((tipo === defectosDesarrolloEsmalteTipo.hp) && (estado === constEstado.bueno || estado === constEstado.malo)) ||
      ((tipo === defectosDesarrolloEsmalteTipo.hm) && (estado === constEstado.bueno || estado === constEstado.malo)) ||
      ((tipo === defectosDesarrolloEsmalteTipo.o) && (estado === constEstado.bueno || estado === constEstado.malo)) ||
      ((tipo === defectosDesarrolloEsmalteTipo.d) && (estado === constEstado.bueno || estado === constEstado.malo)) ||
      ((tipo === defectosDesarrolloEsmalteTipo.fluorosis) && (estado === constEstado.bueno || estado === constEstado.malo))
    ) {
      if (diente) {
        this.defectosDesarrolloEsmalte = [...this.defectosDesarrolloEsmalte, defectosDesarrolloEsmalte];
      } else {
        throw new Error('Defectos Desarrollo Esmalte: Seleccione un diente');
      }

    } else {
      throw new Error('Defectos Desarrollo Esmalte: Seleccione un tipo de defectos desarrollo');
    }

  }

  setDiastema(diastema) {
    const { diente } = diastema;
    if (diente) {
      this.diastema = [...this.diastema, diastema];
    } else {
      throw new Error('Diastema: Seleccione un diente');
    }
  }

  setEdentuloTotal(dentalTotal) {
    const { diente, fin } = dentalTotal;
    if (diente !== 0 && fin !== 0) {
      const { indexInicio, indexFin } = obtenerInicioFin(diente, fin);
      if (indexInicio > indexFin) {
        throw new Error('Edentulo Total:: El index inicio debe ser menor al final');
      } else {
        this.edentuloTotal = [...this.edentuloTotal, dentalTotal];
      }
    } else {
      throw new Error('Edentulo Total:: Datos incorrectos');
    }
  }

  setEspigoMunon(espigonMunon) {
    const { estado, diente } = espigonMunon;
    if (estado === constEstado.bueno || estado === constEstado.malo) {
      if (diente) {
        this.espigonMunon = [...this.espigonMunon, espigonMunon];
      } else {
        throw new Error('Espigon Muñon: Seleccione un diente');
      }
    } else {
      throw new Error('Espigon Muñon: Seleccione un etado de diende');
    }
  }

  setFosasFisurasProfundas(fosasFisurasProfundas) {
    const { diente } = fosasFisurasProfundas;
    if (diente) {
      this.fosasFisurasProfundas = [...this.fosasFisurasProfundas, fosasFisurasProfundas];
    } else {
      throw new Error('Fosas Fisuras Profundas: Seleccione un diente');
    }
  }

  setFractura(fractura) {
    const { tipo, diente } = fractura;
    if (tipo === fracturaTipo.coronal || tipo === fracturaTipo.incisal || tipo === fracturaTipo.raizCoronal) {
      if (diente) {
        this.fractura = [...this.fractura, fractura];
      } else {
        throw new Error('Fractura: Seleccione un diente');
      }
    } else {
      throw new Error('Fractura: Seleccione un tipo de fractura');
    }
  }

  setFusion(fusion) {
    const { diente } = fusion;
    if (diente) {
      this.fusion = [...this.fusion, fusion];
    } else {
      throw new Error('Fusion: Seleccione un diente');
    }
  }

  setGeminasion(geminasion) {
    const { diente } = geminasion;
    if (diente) {
      this.geminasion = [...this.geminasion, geminasion];
    } else {
      throw new Error('Geminasion: Seleccione un diente');
    }
  }

  setGiroversion(giroversion) {
    const { tipo, diente } = giroversion;
    if (tipo === giroversionTipo.distal || tipo === giroversionTipo.mesial) {
      if (diente) {
        this.giroversion = [...this.giroversion, giroversion];
      } else {
        throw new Error('Giroversion: Seleccione un diente');
      }
    } else {
      throw new Error('Giroversion: Selecione un tipo de giroversion');
    }
  }

  setImpactacion(impactacion) {
    const { diente } = impactacion;
    if (diente) {
      this.impactacion = [...this.impactacion, impactacion];
    } else {
      throw new Error('Impactacion: Seleccione un diente');
    }
  }

  setImplanteDental(implanteDental) {
    const { estado, diente } = implanteDental;
    if (estado === constEstado.bueno || estado === constEstado.malo) {
      if (diente) {
        this.implanteDental = [...this.implanteDental, implanteDental];
      } else {
        throw new Error('Implante Dental: Seleccione un diente');
      }
    } else {
      throw new Error('Implante Dental: Seleccione un etado del implante dental');

    }
  }

  //* R-T (Bruno)
  setMacrodoncia(macrodoncia) {
    const { diente } = macrodoncia;
    if (diente) {
      this.macrodoncia = [...this.macrodoncia, macrodoncia];
    } else {
      throw new Error('Macrodoncia: Seleccione un diente');
    }
  }

  setMicrodoncia(microdoncia) {
    const { diente } = microdoncia;
    if (diente) {
      this.microdoncia = [...this.microdoncia, microdoncia];
    } else {
      throw new Error('Microdoncia: Seleccione un diente');
    }
  }

  setMovilidadPatologica(movilidadPatologica) {
    const { tipo, diente } = movilidadPatologica;
    if (tipo === movilidadPatologicaTipo.m1 || tipo === movilidadPatologicaTipo.m2 || tipo === movilidadPatologicaTipo.m3 || tipo === movilidadPatologicaTipo.m4 || tipo === movilidadPatologicaTipo.m5) {
      if (diente) {
        this.movilidadPatologica = [...this.movilidadPatologica, movilidadPatologica];
      } else {
        throw new Error('Movilidad Patologica: Seleccione un diente');
      }
    } else {
      throw new Error('Movilidad Patologica: Seleccione un tipo de movilidad patologica');
    }
  }

  setPiezaDentariaAusente(piezaDentariaAusente) {
    const { diente } = piezaDentariaAusente;
    if (diente) {
      this.piezaDentariaAusente = [...this.piezaDentariaAusente, piezaDentariaAusente];
    } else {
      throw new Error('Pieza Dentaria Ausente: Seleccione un diente');
    }
  }

  setPiezaDentariaEctopica(piezaDentariaEctopica) {
    const { diente } = piezaDentariaEctopica;
    if (diente) {
      this.piezaDentariaEctopica = [...this.piezaDentariaEctopica, piezaDentariaEctopica];
    } else {
      throw new Error('Pieza Dentaria Ectopica: Seleccione un diente');
    }
  }

  setPiezaDentariaEnClavija(piezaDentariaClavija) {
    const { diente } = piezaDentariaClavija;
    if (diente) {
      this.piezaDentariaClavija = [...this.piezaDentariaClavija, piezaDentariaClavija];
    } else {
      throw new Error('Pieza Dentaria EnClavija: Seleccione un diente');
    }
  }

  setPiezaDentariaEnErupcion(piezaDentariaErupcion) {
    const { diente } = piezaDentariaErupcion;
    if (diente) {
      this.piezaDentariaErupcion = [...this.piezaDentariaErupcion, piezaDentariaErupcion];
    } else {
      throw new Error('Pieza Dentaria EnErupcion: Seleccione un diente');
    }
  }

  setPiezaDentariaExtruida(piezaDentariaExtruida) {
    const { diente } = piezaDentariaExtruida;
    if (diente) {
      this.piezaDentariaExtruida = [...this.piezaDentariaExtruida, piezaDentariaExtruida];
    } else {
      throw new Error('Pieza Dentaria Extruida: Seleccione un diente');
    }
  }

  setPiezaDentariaIntruida(piezaDentariaIntruida) {
    const { diente } = piezaDentariaIntruida;
    if (diente) {
      this.piezaDentariaIntruida = [...this.piezaDentariaIntruida, piezaDentariaIntruida];
    } else {
      throw new Error('Pieza Dentaria Intruida: Seleccione un diente');
    }
  }

  setPiezaDentariaSupernumeraria(piezaDentariaSupernumeraria) {
    const { diente } = piezaDentariaSupernumeraria;
    if (diente) {
      this.piezaDentariaSupernumeraria = [...this.piezaDentariaSupernumeraria, piezaDentariaSupernumeraria];
    } else {
      throw new Error('Pieza Dentaria Supernumeraria: Seleccione un diente');
    }
  }

  setPosicionDentaria(posicionDentaria) {
    const { tipo, diente } = posicionDentaria;
    if (tipo === posicionDentariaTipo.m || tipo === posicionDentariaTipo.d || tipo === posicionDentariaTipo.v || tipo === posicionDentariaTipo.p || tipo === posicionDentariaTipo.l) {
      if (diente) {
        this.posicionDentaria = [...this.posicionDentaria, posicionDentaria];
      } else {
        throw new Error('Posicion Dentaria: Seleccione un diente');
      }
    } else {
      throw new Error('Posicion Dentaria: Seleccione un tipo de posicion dentaria');
    }
  }

  setProtesisFija(protesisFija) {
    const { estado, diente, fin } = protesisFija;
    if ((estado === constEstado.bueno || estado === constEstado.malo) && diente !== 0 && fin !== 0) {
      const { indexInicio, indexFin } = obtenerInicioFin(diente, fin);
      if (indexInicio > indexFin) {
        throw new Error('Protesis Fija:: El index inicio debe ser menor al final');
      } else {
        this.protesisFija = [...this.protesisFija, protesisFija];
      }
    } else {
      throw new Error('Protesis Fija:: Datos incorrectos');
    }
  }

  setProtesisRemovible(protesisRemovible) {
    const { estado, diente, fin } = protesisRemovible;
    if ((estado === constEstado.bueno || estado === constEstado.malo) && diente !== 0 && fin !== 0) {
      const { indexInicio, indexFin } = obtenerInicioFin(diente, fin);
      if (indexInicio > indexFin) {
        throw new Error('Protesis Removible:: El index inicio debe ser menor al final');
      } else {
        this.protesisRemovible = [...this.protesisRemovible, protesisRemovible];
      }
    } else {
      throw new Error('Protesis Removible:: Datos incorrectos');
    }
  }

  setProtesisTotal(protesisTotal) {
    const { estado, diente, fin } = protesisTotal;
    if ((estado === constEstado.bueno || estado === constEstado.malo) && diente !== 0 && fin !== 0) {
      const { indexInicio, indexFin } = obtenerInicioFin(diente, fin);
      if (indexInicio > indexFin) {
        throw new Error('Protesis Total:: El index inicio debe ser menor al final');
      } else {
        this.protesisTotal = [...this.protesisTotal, protesisTotal];
      }
    } else {
      throw new Error('Protesis Total:: Datos incorrectos');
    }


  }

  /* JUBER */
  setRemanenteRadicular(remanenteRadicular) {
    const { diente } = remanenteRadicular;
    if (diente) {
      this.remanenteRadicular = [...this.remanenteRadicular, remanenteRadicular];
    } else {
      throw new Error('Remanente Radicular: Seleccione un diente');
    }
  }

  setRestauracionDefinitiva(restauracionDefinitiva) {
    const { tipo, diente, partes, /* estado  */ } = restauracionDefinitiva;
    if (tipo === restauracionDefinitivaTipo.am || tipo === restauracionDefinitivaTipo.r || tipo === restauracionDefinitivaTipo.iv || tipo === restauracionDefinitivaTipo.im || tipo === restauracionDefinitivaTipo.ie || tipo === restauracionDefinitivaTipo.c) {
      if (diente) {
        console.log('PARTESSSS', partes);
        console.log('PARTESSSS', Object.keys(partes).length);
        if (Object.keys(partes).length > 0) {
          this.restauracionDefinitiva = [...this.restauracionDefinitiva, restauracionDefinitiva];
        } else {
          throw new Error('Restauracion Definitiva: Seleccione una parte del diente');
        }
        // if (partes.size > 0) {
        // if (estado === constEstado.bueno || estado === constEstado.malo) {
        // } else {
        // throw new Error('Restauracion Definitiva: Seleccione un estado del diente');
        // }
      } else {
        throw new Error('Restauracion Definitiva: Seleccione un diente');
      }
    } else {
      throw new Error('Restauracion Definitiva: Seleccione un tipo de restauracion definitiva');
    }
  }

  setRestauracionTemporal(restauracionTemporal) {
    const { diente, partes } = restauracionTemporal;
    if (diente) {
      if (Object.keys(partes).length > 0) {
        this.restauracionTemporal = [...this.restauracionTemporal, restauracionTemporal];
      } else {
        throw new Error('Restauracion Temporal: Seleccione una parte del diente');
      }
    } else {
      throw new Error('Restauracion Temporal: Seleccione un diente');
    }
  }

  setSellantes(sellantes) {
    const { diente, partes, estado } = sellantes;
    if (diente) {
      if (Object.keys(partes).length > 0) {
        // if (estado === constEstado.bueno || estado === constEstado.malo) {
        this.sellantes = [...this.sellantes, sellantes];
        // } else {
        // throw new Error('Sellantes: Seleccione un estado del diente');
        // }
      } else {
        throw new Error('Sellantes: Seleccione una parte del diente');
      }
    } else {
      throw new Error('Sellantes: Seleccione un diente');
    }
  }

  setSuperficieDesgastada(superficieDesgastada) {
    const { diente } = superficieDesgastada;
    if (diente) {
      this.superficieDesgastada = [...this.superficieDesgastada, superficieDesgastada];
    } else {
      throw new Error('Superficie Desgastada: Seleccione un diente');
    }
  }

  setTransposicion(transposicion) {
    const { diente } = transposicion;
    if (diente) {
      this.transposicion = [...this.transposicion, transposicion];
    } else {
      throw new Error('Transposicion: Seleccione un diente');
    }
  }

  setTratamientoPulpar(tratamientoPulpar) {
    const { tipo, diente, estado } = tratamientoPulpar;
    if (tipo === tratamientoPulparTipo.tc || tipo === tratamientoPulparTipo.pc || tipo === tratamientoPulparTipo.pp) {
      if (estado === constEstado.bueno || estado === constEstado.malo) {
        if (diente) {
          this.tratamientoPulpar = [...this.tratamientoPulpar, tratamientoPulpar];
        } else {
          throw new Error('Tratamiento Pulpar: Seleccione un diente');
        }
      } else {
        throw new Error('Tratamiento Pulpar: Seleccione un estado del diente');
      }
    } else {
      throw new Error('Tratamiento Pulpar: Seleccione un tipo de tratamiento pulpar');
    }
  }

  setDetalle(detalle) {
    this.detalle = detalle;
  }

  setEnlace(enlace) {
    const { tipo } = enlace;
    if (tipo === enlaceTipo.oFijo || tipo === enlaceTipo.oRemovible || tipo === enlaceTipo.eTotal
      || tipo === enlaceTipo.pFija || tipo === enlaceTipo.pRemovible || tipo === enlaceTipo.pTotal) {
      this.enlace = [...this.enlace, enlace];
    }
  }


  // OBTENER DETALLES PARA TODOS LOS DIENTES
  getDetalles(diente, claseDiente) {

    const dataModelo = {
      key: "",
      nombre: "",
      categoria: "",
      diente: "",
      estado: "",
      dibujo: "",
      especificaciones: "",
      dienteFinal: "",
    }

    const dataTotal = [];

    // console.log('dadfadsf', claseDiente);
    for (const key in claseDiente) {
      if (Object.hasOwnProperty.call(claseDiente, key)) {
        const element = claseDiente[key];
        if (element.length > 0) {
          element.forEach((a, b) => {
            console.log('DATAAAA : key ', key, ' : ', a);

            console.log('DIBUJOO : ', a['partes']);
            if (a['diente'] === diente) {
              const exa = {
                key: key + '-' + b,
                nombre: a['tipo'] ? obtenerTextoTipo(a['tipo'], key) : textoOpciones(key),
                categoria: obtenerCategoria(key, a['tipo']),
                diente: diente,
                estado: a['estado'] ? (a['estado'] === estado.bueno ? 'Buen estado' : 'Mal estado') : '',
                dibujo: a['partes'] ? obtenerPartes(a['partes']) : '',
                especificaciones: a['diagnostico'],
                dienteFinal: a['fin'] ? a['fin'] : '',
              };

              console.log('DEMO ', exa);

              dataTotal.push({ ...dataModelo, ...exa });


              // switch (key) {
              //   case 'cariesDental':
              //     const data = { ...dataModelo };
              //     console.log('ddddd', a);
              //     console.log('KEY', key);
              //     data.key = key + '-' + b;
              //     data.nombre = a['tipo'] + ": Lesión de Caries Dental";
              //     data.diente = diente;
              //     data.dibujo = (a['partes']['distal'] ? "Distal, " : "") + (a['partes']['mesial'] ? "Mistal, " : "") + (a['partes']['oclusal'] ? "Oclusal, " : "") + (a['partes']['lingual'] ? "Lingual, " : "") + (a['partes']['vestibular'] ? "Vestibular" : "");
              //     data.especificaciones = a['diagnostico'];
              //     dataTotal=[data];
              //     break;
              //   case 'fusion':
              //     const data2 = { ...dataModelo };
              //     // console.log('ddddd', a);
              //     // console.log('KEY', key);
              //     data2.key = key + '-' + b;
              //     data2.nombre = 'Fusión';
              //     data2.diente = diente;
              //     data2.especificaciones = a['diagnostico'];
              //     dataTotal=[data2];
              //     break;
              //   default:
              //     break;
              // }
            }
          });
        }
      }
    }

    return dataTotal;

  }



  eliminarDetalle(objeto) {
    const key = objeto.key.split('-');
    switch (key[0]) {
      case 'aparatoOrtoFijo':
        this.aparatoOrtoFijo.splice(key[1], 1);
        break;

      case 'aparatoOrtoRemovible':
        this.aparatoOrtoRemovible.splice(key[1], 1);
        break;

      case 'cariesDental':
        this.cariesDental.splice(key[1], 1);
        break;

      case 'corona':
        this.corona.splice(key[1], 1);
        break;

      case 'coronaTemporal':
        this.coronaTemporal.splice(key[1], 1);
        break;

      case 'defectosDesarrolloEsmalte':
        this.defectosDesarrolloEsmalte.splice(key[1], 1);
        break;

      case 'diastema':
        this.diastema.splice(key[1], 1);
        break;

      case 'edentuloTotal':
        this.edentuloTotal.splice(key[1], 1);
        break;

      case 'espigonMunon':
        this.espigonMunon.splice(key[1], 1);
        break;

      case 'fosasFisurasProfundas':
        this.fosasFisurasProfundas.splice(key[1], 1);
        break;

      case 'fractura':
        this.fractura.splice(key[1], 1);
        break;

      case 'fusion':
        this.fusion.splice(key[1], 1);
        break;

      case 'geminasion':
        this.geminasion.splice(key[1], 1);
        break;

      case 'giroversion':
        this.giroversion.splice(key[1], 1);
        break;

      case 'impactacion':
        this.impactacion.splice(key[1], 1);
        break;

      case 'implanteDental':
        this.implanteDental.splice(key[1], 1);
        break;

      /*L-P */
      case 'macrodoncia':
        this.macrodoncia.splice(key[1], 1);
        break;
      case 'microdoncia':
        this.microdoncia.splice(key[1], 1);
        break;
      case 'movilidadPatologica':
        this.movilidadPatologica.splice(key[1], 1);
        break;
      case 'piezaDentariaAusente':
        this.piezaDentariaAusente.splice(key[1], 1);
        break;
      case 'piezaDentariaEctopica':
        this.piezaDentariaEctopica.splice(key[1], 1);
        break;
      case 'piezaDentariaClavija':
        this.piezaDentariaClavija.splice(key[1], 1);
        break;
      case 'piezaDentariaErupcion':
        this.piezaDentariaErupcion.splice(key[1], 1);
        break;
      case 'piezaDentariaExtruida':
        this.piezaDentariaExtruida.splice(key[1], 1);
        break;
      case 'piezaDentariaIntruida':
        this.piezaDentariaIntruida.splice(key[1], 1);
        break;
      case 'piezaDentariaSupernumeraria':
        this.piezaDentariaSupernumeraria.splice(key[1], 1);
        break;
      case 'posicionDentaria':
        this.posicionDentaria.splice(key[1], 1);
        break;
      case 'protesisFija':
        this.protesisFija.splice(key[1], 1);
        break;
      case 'protesisRemovible':
        this.protesisRemovible.splice(key[1], 1);
        break;
      case 'protesisTotal':
        this.protesisTotal.splice(key[1], 1);
        break;

      /* R-T */
      case 'remanenteRadicular':
        this.remanenteRadicular.splice(key[1], 1);
        break;
      case 'restauracionDefinitiva':
        this.restauracionDefinitiva.splice(key[1], 1);
        break;

      case 'restauracionTemporal':
        this.restauracionTemporal.splice(key[1], 1);
        break;

      case 'sellantes':
        this.sellantes.splice(key[1], 1);
        break;

      case 'superficieDesgastada':
        this.superficieDesgastada.splice(key[1], 1);
        break;

      case 'transposicion':
        this.transposicion.splice(key[1], 1);
        break;

      case 'tratamientoPulpar':
        this.tratamientoPulpar.splice(key[1], 1);
        break;

      default:
        break;
    }

  }

  exportar() {
    const data = {
      aparatoOrtoFijo: this.aparatoOrtoFijo,
      aparatoOrtoRemovible: this.aparatoOrtoRemovible,
      cariesDental: this.cariesDental,
      corona: this.corona,
      coronaTemporal: this.coronaTemporal,
      defectosDesarrolloEsmalte: this.defectosDesarrolloEsmalte,
      diastema: this.diastema,
      edentuloTotal: this.edentuloTotal,
      espigonMunon: this.espigonMunon,
      fosasFisurasProfundas: this.fosasFisurasProfundas,
      fractura: this.fractura,
      fusion: this.fusion,
      geminasion: this.geminasion,
      giroversion: this.giroversion,
      impactacion: this.impactacion,
      implanteDental: this.implanteDental,
      macrodoncia: this.macrodoncia,
      microdoncia: this.microdoncia,
      movilidadPatologica: this.movilidadPatologica,
      piezaDentariaAusente: this.piezaDentariaAusente,
      piezaDentariaEctopica: this.piezaDentariaEctopica,
      piezaDentariaClavija: this.piezaDentariaClavija,
      piezaDentariaErupcion: this.piezaDentariaErupcion,
      piezaDentariaExtruida: this.piezaDentariaExtruida,
      piezaDentariaIntruida: this.piezaDentariaIntruida,
      piezaDentariaSupernumeraria: this.piezaDentariaSupernumeraria,
      posicionDentaria: this.posicionDentaria,
      protesisFija: this.protesisFija,
      protesisRemovible: this.protesisRemovible,
      protesisTotal: this.protesisTotal,
      remanenteRadicular: this.remanenteRadicular,
      restauracionDefinitiva: this.restauracionDefinitiva,
      restauracionTemporal: this.restauracionTemporal,
      sellantes: this.sellantes,
      superficieDesgastada: this.superficieDesgastada,
      transposicion: this.transposicion,
      tratamientoPulpar: this.tratamientoPulpar,
      enlace: this.enlace,
      detalle: this.detalle,
    }
    return JSON.stringify(data);
  }


}


const obtenerTextoTipo = (tipo, key = '') => {
  switch (key) {
    case 'fractura':
      return 'Fractura';
    case 'giroversion':
      return 'Giroversión';
    default:
      if (existeTipo(cariesDentalTipo, tipo)) {
        return tipo + ': Lesión de Caries Dental';
      }
      if (existeTipo(coronaTipo, tipo)) {
        return tipo + ': Corona';
      }
      if (existeTipo(defectosDesarrolloEsmalteTipo, tipo)) {
        return tipo + ': Defectos de Desarrollo de Esmalte';
      }
      if (existeTipo(movilidadPatologicaTipo, tipo)) {
        return tipo + ': Movilidad Patológica';
      }
      if (existeTipo(posicionDentariaTipo, tipo)) {
        return tipo + ': Posición Dentaria';
      }
      if (existeTipo(restauracionDefinitivaTipo, tipo)) {
        return tipo + ': Restauración Definitiva';
      }
      if (existeTipo(tratamientoPulparTipo, tipo)) {
        return tipo + ': Tratamiento Pulpar';
      }
      return '';
  }
}

const obtenerCategoria = (key, tipo) => {
  switch (key) {
    case 'fractura':
      if (tipo === fracturaTipo.raizCoronal) {
        return 'Raiz y Coronal';
      } else {
        return tipo;
      }
    case 'giroversion':
      return tipo;
    default:
      return '';
  }
}

const obtenerPartes = (partes) => {
  let stringPartes = '';
  const lista = Object.keys(partes);
  lista.forEach((e) => {
    console.log('element: ', e);
    if (typeof partes[e] == 'boolean') {
      if (partes[e]) {
        stringPartes += formatText(e) + ' ';
      }
    } else {
      if (partes[e].activo) {
        stringPartes += formatText(e) + ' ';
      }
    }

  });
  return stringPartes;

}
const existeTipo = (object, tipo) => {
  return Object.values(object).includes(tipo);
}

const formatText = (texto) => {
  return texto[0].toUpperCase() + texto.substr(1);
}
const textoOpciones = (key) => {
  try {
    return opciones[key].hallazgo;
  } catch (error) {
    //TODO: CASOS ESPECIALES
    switch (key) {
      case 'espigonMunon':
        return 'Espigo Muñon';
      case 'fosasFisurasProfundas':
        return 'Fosas y Fisuras Profundas';
      default:
        return formatText(key);
    }
  }
}
export const obtenerInicioFin = (diente, fin) => {
  let indexInicioAS = indexDientesAdultoSuperior.indexOf(diente);
  let indexFinAS = indexDientesAdultoSuperior.indexOf(fin);
  let indexInicioIS = indexDientesInfanteSuperior.indexOf(diente);
  let indexFinIS = indexDientesInfanteSuperior.indexOf(fin);
  let indexInicioII = indexDientesInfanteInferior.indexOf(diente);
  let indexFinII = indexDientesInfanteInferior.indexOf(fin);
  let indexInicioAI = indexDientesAdultoInferior.indexOf(diente);
  let indexFinAI = indexDientesAdultoInferior.indexOf(fin);
  let indexInicio;
  let indexFin;
  let listaIndexPuente;
  let esInvertido;
  console.log('DIENTE: ', diente, ' FIN : ', fin);
  if (indexInicioAS !== -1 && indexFinAS !== -1) {
    indexInicio = indexInicioAS;
    indexFin = indexFinAS;
    listaIndexPuente = indexDientesAdultoSuperior;
    esInvertido = false;
  } else if (indexInicioIS !== -1 && indexFinIS !== -1) {
    indexInicio = indexInicioIS;
    indexFin = indexFinIS;
    listaIndexPuente = indexDientesInfanteSuperior;
    esInvertido = false;
  } else if (indexInicioAI !== -1 && indexFinAI !== -1) {
    indexInicio = indexInicioAI;
    indexFin = indexFinAI;
    listaIndexPuente = indexDientesAdultoInferior;
    esInvertido = true;
  } else if (indexInicioII !== -1 && indexFinII !== -1) {
    indexInicio = indexInicioII;
    indexFin = indexFinII;
    listaIndexPuente = indexDientesInfanteInferior;
    esInvertido = true;
  } else {
    console.log('NO SE ENCUENTRA EN LOS INDICES DE AS - IS', indexInicio, indexFin);
    indexInicio = 0;
    indexFin = 0;
    listaIndexPuente = [];
    esInvertido = false;
  }
  return {
    indexInicio, indexFin, listaIndexPuente, esInvertido
  };
}