import { opciones } from "../models/opciones";


const handleHallazgo = (hallazgo, data, stateDiente) => {
  switch (hallazgo) {
    case opciones.aparatoOrtoFijo.hallazgo:
      stateDiente.setAparatoOrtoFijo(data);
      break;

    case opciones.aparatoOrtoRemovible.hallazgo:
      stateDiente.setAparatoOrtoRemovible(data);
      break;

    case opciones.cariesDental.hallazgo:
      stateDiente.setCariesDental(data);
      break;

    case opciones.corona.hallazgo:
      stateDiente.setCorona(data);
      break;

    case opciones.coronaTemporal.hallazgo:
      stateDiente.setCoronaTemporal(data);
      break;

    case opciones.esmalte.hallazgo:
      stateDiente.setDefectosDesarrolloEsmalte(data);
      break;

    case opciones.diastema.hallazgo:
      stateDiente.setDiastema(data);
      break;

    case opciones.edentuloTotal.hallazgo:
      stateDiente.setEdentuloTotal(data);
      break;

    case opciones.espigoMunon.hallazgo:
      stateDiente.setEspigoMunon(data);
      break;

    case opciones.fosasFisuras.hallazgo:
      stateDiente.setFosasFisurasProfundas(data);
      break;

    case opciones.fractura.hallazgo:
      stateDiente.setFractura(data);
      break;

    case opciones.fusion.hallazgo:
      stateDiente.setFusion(data);
      break;

    case opciones.geminasion.hallazgo:
      stateDiente.setGeminasion(data);
      break;

    case opciones.giroversion.hallazgo:
      stateDiente.setGiroversion(data);
      break;

    case opciones.impactacion.hallazgo:
      stateDiente.setImpactacion(data);
      break;

    case opciones.implanteDental.hallazgo:
      stateDiente.setImplanteDental(data);
      break;


    case opciones.macrodoncia.hallazgo:
      stateDiente.setMacrodoncia(data);
      break;

    case opciones.microdoncia.hallazgo:
      stateDiente.setMicrodoncia(data);
      break;

    case opciones.movilidadPatologica.hallazgo:
      stateDiente.setMovilidadPatologica(data);
      break;

    case opciones.piezaDentariaAusente.hallazgo:
      stateDiente.setPiezaDentariaAusente(data);
      break;

    case opciones.piezaDentariaEctopica.hallazgo:
      stateDiente.setPiezaDentariaEctopica(data);
      break;

    case opciones.piezaDentariaClavija.hallazgo:
      stateDiente.setPiezaDentariaEnClavija(data);
      break;

    case opciones.piezaDentariaErupcion.hallazgo:
      stateDiente.setPiezaDentariaEnErupcion(data);
      break;

    case opciones.piezaDentariaExtruida.hallazgo:
      stateDiente.setPiezaDentariaExtruida(data);
      break;

    case opciones.piezaDentariaIntruida.hallazgo:
      stateDiente.setPiezaDentariaIntruida(data);
      break;

    case opciones.piezaDentariaSupernumeraria.hallazgo:
      stateDiente.setPiezaDentariaSupernumeraria(data);
      break;

    case opciones.posicionDentaria.hallazgo:
      stateDiente.setPosicionDentaria(data);
      break;

    case opciones.protesisFija.hallazgo:
      stateDiente.setProtesisFija(data);
      break;

    case opciones.protesisRemovible.hallazgo:
      stateDiente.setProtesisRemovible(data);
      break;

    case opciones.protesisTotal.hallazgo:
      stateDiente.setProtesisTotal(data);
      break;

    case opciones.remanenteRadicular.hallazgo:
      stateDiente.setRemanenteRadicular(data);
      break;

    case opciones.restauracionDefinitiva.hallazgo:
      stateDiente.setRestauracionDefinitiva(data);
      break;

    case opciones.restauracionTemporal.hallazgo:
      stateDiente.setRestauracionTemporal(data);
      break;

    case opciones.sellantes.hallazgo:
      stateDiente.setSellantes(data);
      break;

    case opciones.superficieDesgastada.hallazgo:
      stateDiente.setSuperficieDesgastada(data);
      break;

    case opciones.transposicion.hallazgo:
      stateDiente.setTransposicion(data);
      break;

    case opciones.tratamientoPulpar.hallazgo:
      stateDiente.setTratamientoPulpar(data);
      break;

    default:
      break;
  }
  return stateDiente;

}

export default handleHallazgo;


// const handleHallazgo = (hallazgo, numero, diagnostico, stateDiente) => {
//   let data;
//   switch (hallazgo) {

//     case opciones.aparatoOrtoFijo.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setAparatoOrtoFijo(data);
//       break;

//     case opciones.aparatoOrtoRemovible.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setAparatoOrtoRemovible(data);
//       break;

//     case opciones.cariesDental.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setCariesDental(data);
//       break;

//     case opciones.corona.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setCorona(data);
//       break;

//     case opciones.coronaTemporal.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setCoronaTemporal(data);
//       break;

//     case opciones.esmalte.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setDefectosDesarrolloEsmalte(data);
//       break;

//     case opciones.diastema.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setDiastema(data);
//       break;

//     case opciones.edentuloTotal.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setEdentuloTotal(data);
//       break;

//     case opciones.espigoMunon.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setEspigoMunon(data);
//       break;

//     case opciones.fosasFisuras.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setFosasFisurasProfundas(data);
//       break;

//     case opciones.fractura.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setFractura(data);
//       break;

//     case opciones.fusion.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setFusion(data);
//       break;

//     case opciones.geminasion.hallazgo:
//       data = {
//         dienete: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setGeminasion(data);
//       break;

//     case opciones.giroversion.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setGiroversion(data);
//       break;

//     case opciones.impactacion.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setImpactacion(data);
//       break;

//     case opciones.implanteDental.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setImplanteDental(data);
//       break;


//     case opciones.macrodoncia.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setMacrodoncia(data);
//       break;

//     case opciones.microdoncia.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setMicrodoncia(data);
//       break;

//     case opciones.movilidadPatologica.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setMovilidadPatologica(data);
//       break;

//     case opciones.piezaDentariaAusente.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setPiezaDentariaAusente(data);
//       break;

//     case opciones.piezaDentariaEctopica.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setPiezaDentariaEctopica(data);
//       break;

//     case opciones.piezaDentariaClavija.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setPiezaDentariaEnClavija(data);
//       break;

//     case opciones.piezaDentariaErupcion.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setPiezaDentariaEnErupcion(data);
//       break;

//     case opciones.piezaDentariaExtruida.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setPiezaDentariaExtruida(data);
//       break;

//     case opciones.piezaDentariaIntruida.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setPiezaDentariaIntruida(data);
//       break;

//     case opciones.piezaDentariaSupernumeraria.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setPiezaDentariaSupernumeraria(data);
//       break;

//     case opciones.posicionDentaria.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setPosicionDentaria(data);
//       break;

//     case opciones.protesisFija.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setProtesisFija(data);
//       break;

//     case opciones.protesisRemovible.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setProtesisRemovible(data);
//       break;

//     case opciones.protesisTotal.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setProtesisTotal(data);
//       break;

//     case opciones.remanenteRadicular.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setRemanenteRadicular(data);
//       break;

//     case opciones.restauracionDefinitiva.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setRestauracionDefinitiva(data);
//       break;

//     case opciones.restauracionTemporal.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setRestauracionTemporal(data);
//       break;

//     case opciones.sellantes.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setSellantes(data);
//       break;

//     case opciones.superficieDesgastada.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setSuperficieDesgastada(data);
//       break;

//     case opciones.transposicion.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setTransposicion(data);
//       break;

//     case opciones.tratamientoPulpar.hallazgo:
//       data = {
//         diente: numero,
//         diagnostico: diagnostico
//       }
//       stateDiente.setTratamientoPulpar(data);
//       break;

//     default:
//       break;
//   }
//   return stateDiente;

// }
