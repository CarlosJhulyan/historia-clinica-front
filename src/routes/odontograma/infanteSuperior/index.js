import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modals } from "../../../components/modal/Modals";
import { DIENTES_INFANTE_SUPERIOR } from "../../../constants/Dientes";
import { DienteAdulto } from "../../../models/DienteAdulto";
import { dibujarDientes } from "../dibujarDientes";
import { DienteContenedorSuperior } from "../dienteContenedor/DienteContenedorSuperior";
import { ModalError } from "../../../components/modal/ModalError";
import { obtenerInicioFin } from "../../../models/Diente";

const DientesInfanteSuperior = () => {

  //Ver el estado inicial del menu reducers.
  const stateMenu = useSelector(state => state.menu);
  console.log("Estado Menú Reducer:", stateMenu);

  //Estado para abrir o cerrar el modal.
  const [abrirModal, setAbrirModal] = useState(false);

  //Estado para indicar el numero de diente.
  const [numero, setNumero] = useState(0);
  const [dienteInicio, setDienteInicio] = useState(0);

  //Estado para indicar el numero de diente final.
  const [dienteFin, setDienteFin] = useState(0);

  //Estado para el tipo del diente
  const [tipoDiente, setTipoDiente] = useState();

  const [accionTexto, setAccionTexto] = useState('DET');

  const [mostrarErrorModal, setMostrarErrorModal] = useState(false);

  const dispatch = useDispatch();
  //Función para abrir o cerrar el modal
  const mostrarModal = (value, tipo) => {
    console.log("Estado Menú Reducer:", stateMenu);
    if (stateMenu.hallazgo === '') {
      setNumero(value);
      setDienteInicio(value);
    } else if (stateMenu.inicioFin) {
      if (dienteInicio === 0) {
        setNumero(value);
        setDienteInicio(value);
      } else if (dienteFin === 0) {
        setAbrirModal(true);
        setDienteFin(value);
        //Validar si el inicio es mayor que el fin
        const { indexInicio, indexFin } = obtenerInicioFin(dienteInicio, value);
        if (indexInicio > indexFin) {
          setAbrirModal(false);
          setMostrarErrorModal(true);
        }
      } else {
        setDienteFin(0);
      }
    } else {
      setAbrirModal(true);
      setNumero(value);
      setDienteInicio(value);
      setTipoDiente(tipo);
    }
  };

  const validarAcciones = () => {
    if (stateMenu.seleccion) {
      if (stateMenu.inicioFin) {
        console.log(accionTexto, dienteInicio);
        if (dienteInicio === 0 && accionTexto !== 'INI') {
          setAccionTexto('INI');
        } else if (dienteFin === 0 && dienteInicio !== 0 && accionTexto !== 'FIN') {
          setAccionTexto('FIN');
        }
      } else {
        if (accionTexto !== 'SEL') {
          setAccionTexto('SEL');
          setDienteInicio(0);
        }
      }
    } else {
      if (dienteInicio !== 0) {
        // setNumero(0);
        setDienteInicio(0);
        setDienteFin(0);
        setAccionTexto('DET');
      }
    }
  }

  const reiniciarDatos = () => {
    if (!abrirModal) {
      if (stateMenu.inicioFin && dienteFin !== 0) {
        console.log('SETEAR DIENTE FINAL A VACIO');
        setDienteFin(0);
      } else if (dienteInicio !== 0 && !stateMenu.inicioFin) {
        setNumero(0);
        setDienteInicio(0);
      }
    }
  }
  const reiniciarDientes = () => {
    setDienteFin(0);
    setNumero(0);
    setDienteInicio(0);
    // dispatch(quitar_seleccion());
  }

  const stateDiente = new DienteAdulto();
  const v = useSelector(state => state.dientePrueba.diente);
  stateDiente.importar(v);

  const mapaDiente = dibujarDientes(stateDiente, "superior");

  //Retorno del componente
  const marcarInicio = (diente) => dienteInicio === diente && stateMenu.inicioFin;
  validarAcciones();
  reiniciarDatos();
  return (
    <div className="parent">
      {
        DIENTES_INFANTE_SUPERIOR.map((dienteInfante, index) => 
          <DienteContenedorSuperior
            key={index}
            accionTexto={accionTexto}
            modal={() => mostrarModal(dienteInfante.index, dienteInfante.tipoDiente)}
            numero={dienteInfante.index}
            div={`div${index + 4}`}
            inicio={marcarInicio(dienteInfante.index)}
            superiorInfante={true}

            //CARIES DENTALES
            tipoMB={mapaDiente[dienteInfante.index].tipoMB}
            tipoCE={mapaDiente[dienteInfante.index].tipoCE}
            tipoCD={mapaDiente[dienteInfante.index].tipoCD}
            tipoCDP={mapaDiente[dienteInfante.index].tipoCDP}

            //CORONA
            /* cMetalica={mapaDiente[dienteInfante.index].cMetalica}
            cFenestrada={mapaDiente[dienteInfante.index].cFenestrada}
            cMetal={mapaDiente[dienteInfante.index].cMetal}
            cVeneer={mapaDiente[dienteInfante.index].cVeneer}
            cJacket={mapaDiente[dienteInfante.index].cJacket} */


            //CORONA TEMPORAL
            /* coronaTemporal={mapaDiente[dienteInfante.index].coronaTemporal} */


            //  <DEFECTOS
            /* hipoplasia={mapaDiente[dienteInfante.index].hipoplasia}
            hipoMineralizacion={mapaDiente[dienteInfante.index].hipoMineralizacion}
            opacidadesEsmalte={mapaDiente[dienteInfante.index].opacidadesEsmalte}
            decoloracionEsmalte={mapaDiente[dienteInfante.index].decoloracionEsmalte}
            fluorosis={mapaDiente[dienteInfante.index].fluorosis} */
            siglas={mapaDiente[dienteInfante.index].siglas}

            //<I-A

            diastema={mapaDiente[dienteInfante.index].diastema}
            espigonMunonBuenEstado={mapaDiente[dienteInfante.index].espigonMunonBuenEstado}
            espigonMunonMalEstado={mapaDiente[dienteInfante.index].espigonMunonMalEstado}
            fosasFisurasProfundas={mapaDiente[dienteInfante.index].fosasFisurasProfundas}
            fracturaIncisal={mapaDiente[dienteInfante.index].fracturaIncisal}
            fracturaCoronal={mapaDiente[dienteInfante.index].fracturaCoronal}
            fracturaRaiz={mapaDiente[dienteInfante.index].fracturaRaiz}
            fusion={mapaDiente[dienteInfante.index].fusion}
            geminasion={mapaDiente[dienteInfante.index].geminasion}
            giroversionDistal={mapaDiente[dienteInfante.index].giroversionDistal}
            giroversionMesial={mapaDiente[dienteInfante.index].giroversionMesial}
            impactacion={mapaDiente[dienteInfante.index].impactacion}
            implanteDentalBuenEstado={mapaDiente[dienteInfante.index].implanteDentalBuenEstado}
            implanteDentalMalEstado={mapaDiente[dienteInfante.index].implanteDentalMalEstado}
            // I-A />

            dentariaAusente={mapaDiente[dienteInfante.index].dentariaAusente}
            dentariaClavija={mapaDiente[dienteInfante.index].dentariaClavija}
            erupcion={mapaDiente[dienteInfante.index].erupcion}
            dentariaExtruida={mapaDiente[dienteInfante.index].dentariaExtruida}
            dentariaIntruida={mapaDiente[dienteInfante.index].dentariaIntruida}
            dentariaSupernumeraria={mapaDiente[dienteInfante.index].dentariaSupernumeraria}
            macrodoncia={mapaDiente[dienteInfante.index].macrodoncia}
            microdoncia={mapaDiente[dienteInfante.index].microdoncia}
            dentariaEctopica={mapaDiente[dienteInfante.index].dentariaEctopica}

            //  <MOVILIDAD PATOLOGICA     
            movilidadM1={mapaDiente[dienteInfante.index].movilidadM1}
            movilidadM2={mapaDiente[dienteInfante.index].movilidadM2}
            movilidadM3={mapaDiente[dienteInfante.index].movilidadM3}
            movilidadM4={mapaDiente[dienteInfante.index].movilidadM4}
            movilidadM5={mapaDiente[dienteInfante.index].movilidadM5}

            //<POSICION DENTARIA
            mesializado={mapaDiente[dienteInfante.index].mesializado}
            distalizado={mapaDiente[dienteInfante.index].distalizado}
            vetibularizado={mapaDiente[dienteInfante.index].vetibularizado}
            palatinizado={mapaDiente[dienteInfante.index].palatinizado}
            lingualizado={mapaDiente[dienteInfante.index].lingualizado}

            //<R-T>
            remanenteRadicular={mapaDiente[dienteInfante.index].remanenteRadicular}
            transposicion={mapaDiente[dienteInfante.index].transposicion}
            superficieDesgastada={mapaDiente[dienteInfante.index].superficieDesgastada}
            //<TRATAMIENTO PULPAR
            tratamientoConductos={mapaDiente[dienteInfante.index].tratamientoConductos}
            pulpectomia={mapaDiente[dienteInfante.index].pulpectomia}
            pulpotomia={mapaDiente[dienteInfante.index].pulpotomia}

            //RESTAURACION DEFINITIVA
            amalgama={mapaDiente[dienteInfante.index].amalgama}
            resina={mapaDiente[dienteInfante.index].resina}
            ionomero={mapaDiente[dienteInfante.index].ionomero}
            incrutacion={mapaDiente[dienteInfante.index].incrutacion}
            incrustacion={mapaDiente[dienteInfante.index].incrustacion}
            carilla={mapaDiente[dienteInfante.index].carilla}

            sellantes={mapaDiente[dienteInfante.index].sellantes}


            figurasInicioFin={mapaDiente[dienteInfante.index].figurasInicioFin}
            figurasInicioFinEnDiente={mapaDiente[dienteInfante.index].figurasInicioFinEnDiente}
          //pulpar={true}

          //</R-T>
          >
            <div>
              {dienteInfante.dibujoDiente}
              {
                mapaDiente[dienteInfante.index]['imagenes'].map((src, a) => (
                  <div key={a}>
                    <img src={src} alt="img" className="absolute" />
                  </div>
                ))
              }
            </div>
          </DienteContenedorSuperior>
        )
      }
      <div>
        {abrirModal ? (
          <Modals
            tipoDiente={tipoDiente}
            hallazgo={stateMenu.opcion.hallazgo}
            tipo={stateMenu.opcion.tipo}
            estado={stateMenu.opcion.estado}
            numero={numero}
            abrirModal={abrirModal}
            setAbrirModal={setAbrirModal}
            dienteFin={dienteFin}
            reiniciarDientes={reiniciarDientes}
          />) : null}
      </div>
      <div>
        {mostrarErrorModal ? (
          <ModalError
            mostrarErrorModal={mostrarErrorModal}
            setMostrarErrorModal={setMostrarErrorModal}
          />) : null}
      </div>
    </div>

  );
};

export default DientesInfanteSuperior;
