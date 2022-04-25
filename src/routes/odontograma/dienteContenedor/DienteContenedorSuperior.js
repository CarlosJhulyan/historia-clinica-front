import React from "react";
import { estado } from "../../../constants/Odontograma";

export const DienteContenedorSuperior = (props) => {
  /* OBTENER EL VALOR DEL REDUCER DIENTE  -> 
  
  stateDiente={
    numero: '',
    hallazgo: '',

  }
  */

  const {
    superiorInfante,
    numero,
    div,
    //
    figurasInicioFin = [],
    figurasInicioFinEnDiente = [],
    //
    dentariaAusente = false,
    dentariaClavija = false,
    espigonMunonMalEstado = false,
    espigonMunonBuenEstado = false,
    dentariaExtruida = false,
    dentariaIntruida = false,
    transposicion = false,
    geminasion = false,
    dentariaSupernumeraria = false,
    erupcion = false,
    diastema = false,
    fusion = false,
    giroversionMesial = false,
    giroversionDistal = false,
    fracturaRaiz = false,
    fracturaIncisal = false,
    fracturaCoronal = false,
    pulpar = false,
    modal,
    macrodoncia = false,
    microdoncia = false,
    dentariaEctopica = false,
    remanenteRadicular = false,
    fosasFisurasProfundas = false,
    impactacion = false,
    implanteDentalBuenEstado,
    implanteDentalMalEstado,
    superficieDesgastada = false,
    sellantes = false,

    // DEFECTOS ESMALTE
    /* hipoplasia,
    hipoMineralizacion,
    opacidadesEsmalte,
    decoloracionEsmalte,
    fluorosis, */

    //MOVILIDAD PATOLOGICA
    movilidadM1,
    movilidadM2,
    movilidadM3,
    movilidadM4,
    movilidadM5,

    //POSICION DENTARIA
    mesializado,
    distalizado,
    vetibularizado,
    palatinizado,
    lingualizado,

    //TRATAMIENTO PULPAR
    tratamientoConductos,
    pulpectomia,
    pulpotomia,

    //CARIES DENTALES
    tipoMB,
    tipoCE,
    tipoCD,
    tipoCDP,

    //CORONA
    /* cMetalica,
    cFenestrada,
    cMetal,
    cVeneer,
    cJacket, */

    //CORONA TEMPORAL
    /* coronaTemporal, */

    //RESTAURACION DEFINITIVA
    amalgama,
    resina,
    ionomero,
    incrutacion,
    incrustacion,
    carilla,

    //siglas
    siglas,


    /* PROPS DE REDUX */
    accionTexto,
    inicio,
    fin,

    pulpotomia1 = false,
  } = props;




  const getTratamientoPulpar = (tratamiento, sigla) => {
    if (tratamiento) {
      if (tratamiento.activo) {
        if (tratamiento.tipo !== "PP") {
          return <span className={tratamiento.estado === estado.bueno ? 'pulpar-buen-estado' : 'pulpar-mal-estado'}></span>;
        }
      }
    }

    if (sigla) {
      if (sigla.activo) {
        return <span className={sigla.estado === estado.bueno ? 'buen-estado-text' : 'mal-estado-text'}>{sigla.tipo},</span>;
      }
    }
  }

  /* const getCoronaTemporal = (temporal) => {
    if (temporal) {
      if (temporal.activo) {
        return <span className={temporal.estado === estado.bueno ? 'buen-estado-text' : 'mal-estado-text'}>CT</span>;
      }
    }
  } */

  const getRestauracionDefinitiva = (restauracionD) => {
    if (restauracionD) {
      if (restauracionD.activo) {
        return <span className={'mal-estado-text'}>{restauracionD.tipo}</span>;
      }
    }
  }

  const getPosicionDentaria = (posicion) => {
    if (posicion) {
      if (posicion.activo) {
        return <span className={'buen-estado-text'}>{posicion.tipo},</span>;
      }
    }
  }

  const getCariesDental = (caries) => {
    if (caries) {
      if (caries.activo) {
        return <span className={'mal-estado-text'}>{caries.tipo},</span>;
      }
    }
  }

  const getMovilidadPatologica = (movilidad) => {
    if (movilidad) {
      if (movilidad.activo) {
        return <span className={'mal-estado-text'}>{movilidad.tipo},</span>;
      }
    }
  }

  const getDefectoEsmalte = (defecto) => {
    if (defecto) {
      if (defecto.activo) {
        return <span className={defecto.estado === estado.bueno ? 'buen-estado-text' : 'mal-estado-text'}>{defecto.tipo},</span>;
      }
    }
  }

  const getImplanteDental = (implante) => {
    if (implante) {
      if (implante.activo) {
        return <span className={implante.estado === estado.bueno ? 'buen-estado-text' : 'mal-estado-text'}>IMP,</span>;
      }
    }
  }

  if (superiorInfante) {
    return (
      <div className={div} >
        <div className="container-border">
          {siglas.map((e, i) => <React.Fragment key={i}>{e}</React.Fragment>)}

          {macrodoncia ? <span className="buen-estado-text">MAC,</span> : ''}
          {microdoncia ? <span className="buen-estado-text">MIC,</span> : ''}
          {dentariaEctopica ? <span>E. </span> : ''}
          {remanenteRadicular ? <span className="mal-estado-text">RR,</span> : ''}
          {superficieDesgastada ? <span className="mal-estado-text">DES,</span> : ''}

          {getCariesDental(tipoMB)}
          {getCariesDental(tipoCE)}
          {getCariesDental(tipoCD)}
          {getCariesDental(tipoCDP)}

          {/*  {getCorona(cMetalica)}
          {getCorona(cFenestrada)}
          {getCorona(cMetal)}
          {getCorona(cVeneer)}
          {getCorona(cJacket)}
          {getCoronaTemporal(coronaTemporal)} */}

          {getRestauracionDefinitiva(amalgama)}
          {getRestauracionDefinitiva(resina)}
          {getRestauracionDefinitiva(ionomero)}
          {getRestauracionDefinitiva(incrutacion)}
          {getRestauracionDefinitiva(incrustacion)}
          {getRestauracionDefinitiva(carilla)}


          {/* {getDefectoEsmalte(hipoplasia)}
          {getDefectoEsmalte(hipoMineralizacion)}
          {getDefectoEsmalte(opacidadesEsmalte)}
          {getDefectoEsmalte(decoloracionEsmalte)}
          {getDefectoEsmalte(fluorosis)} */}

          {getMovilidadPatologica(movilidadM1)}
          {getMovilidadPatologica(movilidadM2)}
          {getMovilidadPatologica(movilidadM3)}
          {getMovilidadPatologica(movilidadM4)}
          {getMovilidadPatologica(movilidadM5)}

          {getPosicionDentaria(mesializado)}
          {getPosicionDentaria(distalizado)}
          {getPosicionDentaria(vetibularizado)}
          {getPosicionDentaria(palatinizado)}
          {getPosicionDentaria(lingualizado)}

          {getTratamientoPulpar(null, tratamientoConductos)}
          {getTratamientoPulpar(null, pulpectomia)}
          {getTratamientoPulpar(null, pulpotomia)}

          {fosasFisurasProfundas ? <span className="buen-estado-text">FFP,</span> : ''}
          {impactacion ? <span className="buen-estado-text">I,</span> : ''}
          {sellantes ? <span >S,</span> : ''}
          {implanteDentalMalEstado ? <span className="mal-estado-text">IMP,</span> : ''}
          {implanteDentalBuenEstado ? <span className="buen-estado-text">IMP,</span> : ''}
        </div>
        <div className="container-figuras">
          {transposicion ? <div className="transposicion"> </div> : null}
          <div className="container-figuras-inicio-fin ">
            {figurasInicioFin.map((e, i) => <React.Fragment key={i}>{e}</React.Fragment>)}
          </div>
        </div>

        <div style={{ justifyContent: "center", display: "flex" }}>
          <div className="size-diente">
            <div className="contenedor-diente"> {props.children}</div>
            {inicio ? (
              <div className="color-diente-seleccion">
                <span className="desc-seleccion" >INI</span>
              </div>
            ) : fin ? (
              <div className="color-diente-seleccion">
                <span className="desc-seleccion" >FIN</span>
              </div>
            ) : (
              <div className="color-diente" onClick={modal}>
                {" "}
                <span className="desc-action" >{accionTexto}</span>
              </div>
            )}
            {figurasInicioFinEnDiente.map((e, i) => <React.Fragment key={i}>{e}</React.Fragment>)}
            {dentariaAusente ? <div className="dentaria-ausente"></div> : null}
            {espigonMunonMalEstado ? <div className="espigon-munon mal-estado"></div> : null}
            {espigonMunonBuenEstado ? <div className="espigon-munon buen-estado"></div> : null}
            {dentariaExtruida ? (
              <div className="dentaria-extruido"></div>
            ) : null}
            {dentariaIntruida ? (
              <div className="dentaria-intruida"></div>
            ) : null}
            {giroversionMesial ? (
              <div className="giroversion-mesial"></div>
            ) : null}
            {giroversionDistal ? (
              <div className="giroversion-distal"></div>
            ) : null}
            {erupcion ? <div className="erupcion"></div> : null}
            {diastema ? <div className="diastema"></div> : null}
            {fracturaRaiz ? <div className="fractura-raiz"></div> : null}
            {fracturaIncisal ? <div className="fractura-incisal"></div> : null}
            {fracturaCoronal ? <div className="fractura-coronal"></div> : null}

            {/* {pulpar ? <div className="pulpar"></div> : null} */}
            {getTratamientoPulpar(tratamientoConductos)}
            {getTratamientoPulpar(pulpectomia)}
            {getTratamientoPulpar(pulpotomia)}
          </div>
        </div>
        <div
          style={{ marginTop: "12px", fontSize: "16px", textAlign: "center" }}
        >
          <div className="contenedor-dentaria">
            {dentariaClavija ? <div className="dentaria-clavija"></div> : null}
            {geminasion ? <div className="geminasion"></div> : null}
            {dentariaSupernumeraria ? (
              <div className="dentaria-supernumeraria"></div>
            ) : null}
            {fusion ? <div className="fusion"></div> : null}
            {numero}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={div}>
        <div className="container-border">
          {siglas.map((e, i) => <React.Fragment key={i}>{e}</React.Fragment>)}

          {macrodoncia ? <span className="buen-estado-text">MAC,</span> : ''}
          {microdoncia ? <span className="buen-estado-text">MIC,</span> : ''}
          {dentariaEctopica ? <span>E. </span> : ''}
          {remanenteRadicular ? <span className="mal-estado-text">RR,</span> : ''}
          {superficieDesgastada ? <span className="mal-estado-text">DES,</span> : ''}

          {getCariesDental(tipoMB)}
          {getCariesDental(tipoCE)}
          {getCariesDental(tipoCD)}
          {getCariesDental(tipoCDP)}

          {/*  {getCorona(cMetalica)}
          {getCorona(cFenestrada)}
          {getCorona(cMetal)}
          {getCorona(cVeneer)}
          {getCorona(cJacket)}
          {getCoronaTemporal(coronaTemporal)} */}

          {getRestauracionDefinitiva(amalgama)}
          {getRestauracionDefinitiva(resina)}
          {getRestauracionDefinitiva(ionomero)}
          {getRestauracionDefinitiva(incrutacion)}
          {getRestauracionDefinitiva(incrustacion)}
          {getRestauracionDefinitiva(carilla)}


          {/* {getDefectoEsmalte(hipoplasia)}
          {getDefectoEsmalte(hipoMineralizacion)}
          {getDefectoEsmalte(opacidadesEsmalte)}
          {getDefectoEsmalte(decoloracionEsmalte)}
          {getDefectoEsmalte(fluorosis)} */}

          {getMovilidadPatologica(movilidadM1)}
          {getMovilidadPatologica(movilidadM2)}
          {getMovilidadPatologica(movilidadM3)}
          {getMovilidadPatologica(movilidadM4)}
          {getMovilidadPatologica(movilidadM5)}

          {getPosicionDentaria(mesializado)}
          {getPosicionDentaria(distalizado)}
          {getPosicionDentaria(vetibularizado)}
          {getPosicionDentaria(palatinizado)}
          {getPosicionDentaria(lingualizado)}

          {getTratamientoPulpar(null, tratamientoConductos)}
          {getTratamientoPulpar(null, pulpectomia)}
          {getTratamientoPulpar(null, pulpotomia)}

          {fosasFisurasProfundas ? <span className="buen-estado-text">FFP,</span> : ''}
          {impactacion ? <span className="buen-estado-text">I,</span> : ''}
          {sellantes ? <span >S,</span> : ''}
          {implanteDentalMalEstado ? <span className="mal-estado-text">IMP,</span> : ''}
          {implanteDentalBuenEstado ? <span className="buen-estado-text">IMP,</span> : ''}
        </div>
        <div className="container-figuras">
          {transposicion ? <div className="transposicion"> </div> : null}
          <div className="container-figuras-inicio-fin ">
            {figurasInicioFin.map((e, i) => <React.Fragment key={i}>{e}</React.Fragment>)}
          </div>
        </div>
        <div style={{ fontSize: "16px", textAlign: "center" }}>
          <div className="contenedor-dentaria">
            {pulpotomia1 ? <div className="pulpotomia-buen-estado"></div> : null}

            {dentariaClavija ? <div className="dentaria-clavija"></div> : null}
            {geminasion ? <div className="geminasion"></div> : null}
            {dentariaSupernumeraria ? (
              <div className="dentaria-supernumeraria"></div>
            ) : null}
            {fusion ? <div className="fusion"></div> : null}

            {/* REDUX  - Usar MAPS*/}
            {/* 
              (add)
                ? (stateDiente.diente === numero)
                  ? (stateDiente.hallazgo === 'geminasion')
                    ? <div className="geminasion"></div>
                    : null
                  : null
                : null
            */}
            {/* 
              (add)
                ? (stateDiente.diente === numero)
                  ? (stateDiente.hallazgo === 'fusion')
                    ? (<div className="fusion"></div>)
                    : null
                  : null
                : null
            */}

            {numero}

          </div>
        </div>
        <div style={{ justifyContent: "center", display: "flex" }}>
          <div className="size-diente">
            <div className="contenedor-diente"> {props.children}</div>
            {/* <div className="color-diente" onClick={modal}>
              {" "}
              <span className="desc-action">{accionTexto}</span>
            </div> */}

            {inicio ? (
              <div className="color-diente-seleccion">
                <span className="desc-seleccion" >INI</span>
              </div>
            ) : fin ? (
              <div className="color-diente-seleccion">
                <span className="desc-seleccion" >FIN</span>
              </div>
            ) : (
              <div className="color-diente" onClick={modal}>
                {" "}
                <span className="desc-action" >{accionTexto}</span>
              </div>
            )}
            {figurasInicioFinEnDiente.map((e, i) => <React.Fragment key={i}>{e}</React.Fragment>)}
            {dentariaAusente ? <div className="dentaria-ausente"></div> : null}
            {espigonMunonMalEstado ? <div className="espigon-munon mal-estado"></div> : null}
            {espigonMunonBuenEstado ? <div className="espigon-munon buen-estado"></div> : null}
            {dentariaExtruida ? (
              <div className="dentaria-extruido"></div>
            ) : null}
            {dentariaIntruida ? (
              <div className="dentaria-intruida"></div>
            ) : null}
            {giroversionMesial ? (
              <div className="giroversion-mesial"></div>
            ) : null}
            {giroversionDistal ? (
              <div className="giroversion-distal"></div>
            ) : null}
            {erupcion ? <div className="erupcion"></div> : null}
            {diastema ? <div className="diastema"></div> : null}
            {fracturaRaiz ? <div className="fractura-raiz"></div> : null}
            {fracturaIncisal ? <div className="fractura-incisal"></div> : null}
            {fracturaCoronal ? <div className="fractura-coronal"></div> : null}

            {/* {pulpar ? <div className="pulpar"></div> : null} */}
            {getTratamientoPulpar(tratamientoConductos)}
            {getTratamientoPulpar(pulpectomia)}
            {getTratamientoPulpar(pulpotomia)}
          </div>
        </div>
      </div>
    );
  }
};
