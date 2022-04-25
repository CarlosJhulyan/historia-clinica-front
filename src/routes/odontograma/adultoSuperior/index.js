import React, { useState } from "react";
import { DienteContenedorSuperior } from "../dienteContenedor/DienteContenedorSuperior";
import { useDispatch, useSelector } from "react-redux";
import { dibujarDientes } from "../dibujarDientes";
import { DienteAdulto } from "../../../models/DienteAdulto";
import { Modals } from "../../../components/modal/Modals";
import { DIENTES_ADULTO_SUPERIOR } from "../../../constants/Dientes";
import { ModalError } from "../../../components/modal/ModalError";
import { obtenerInicioFin } from "../../../models/Diente";


const DientesAdultoSuperior = () => {

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
        DIENTES_ADULTO_SUPERIOR.map((dienteAdulto, index) => 
          <DienteContenedorSuperior
            key={index}
            accionTexto={accionTexto}
            modal={() => mostrarModal(dienteAdulto.index, dienteAdulto.tipoDiente)}
            numero={dienteAdulto.index}
            div={`div${index + 1}`}
            inicio={marcarInicio(dienteAdulto.index)}

            //CARIES DENTALES
            tipoMB={mapaDiente[dienteAdulto.index].tipoMB}
            tipoCE={mapaDiente[dienteAdulto.index].tipoCE}
            tipoCD={mapaDiente[dienteAdulto.index].tipoCD}
            tipoCDP={mapaDiente[dienteAdulto.index].tipoCDP}

            //CORONA
            /* cMetalica={mapaDiente[dienteAdulto.index].cMetalica}
            cFenestrada={mapaDiente[dienteAdulto.index].cFenestrada}
            cMetal={mapaDiente[dienteAdulto.index].cMetal}
            cVeneer={mapaDiente[dienteAdulto.index].cVeneer}
            cJacket={mapaDiente[dienteAdulto.index].cJacket} */

            //CORONA TEMPORAL
            /* coronaTemporal={mapaDiente[dienteAdulto.index].coronaTemporal} */

            //  <DEFECTOS
            /* hipoplasia={mapaDiente[dienteAdulto.index].hipoplasia}
            hipoMineralizacion={mapaDiente[dienteAdulto.index].hipoMineralizacion}
            opacidadesEsmalte={mapaDiente[dienteAdulto.index].opacidadesEsmalte}
            decoloracionEsmalte={mapaDiente[dienteAdulto.index].decoloracionEsmalte}
            fluorosis={mapaDiente[dienteAdulto.index].fluorosis} */

            //REEMPLAZO DE CORONA - CORONA TEMPORAL - ESMAALTE
            siglas={mapaDiente[dienteAdulto.index].siglas}



            //<I-A

            diastema={mapaDiente[dienteAdulto.index].diastema}
            espigonMunonBuenEstado={mapaDiente[dienteAdulto.index].espigonMunonBuenEstado}
            espigonMunonMalEstado={mapaDiente[dienteAdulto.index].espigonMunonMalEstado}
            fosasFisurasProfundas={mapaDiente[dienteAdulto.index].fosasFisurasProfundas}
            fracturaIncisal={mapaDiente[dienteAdulto.index].fracturaIncisal}
            fracturaCoronal={mapaDiente[dienteAdulto.index].fracturaCoronal}
            fracturaRaiz={mapaDiente[dienteAdulto.index].fracturaRaiz}
            fusion={mapaDiente[dienteAdulto.index].fusion}
            geminasion={mapaDiente[dienteAdulto.index].geminasion}
            giroversionDistal={mapaDiente[dienteAdulto.index].giroversionDistal}
            giroversionMesial={mapaDiente[dienteAdulto.index].giroversionMesial}
            impactacion={mapaDiente[dienteAdulto.index].impactacion}
            implanteDentalBuenEstado={mapaDiente[dienteAdulto.index].implanteDentalBuenEstado}
            implanteDentalMalEstado={mapaDiente[dienteAdulto.index].implanteDentalMalEstado}
            // I-A />

            dentariaAusente={mapaDiente[dienteAdulto.index].dentariaAusente}
            dentariaClavija={mapaDiente[dienteAdulto.index].dentariaClavija}
            erupcion={mapaDiente[dienteAdulto.index].erupcion}
            dentariaExtruida={mapaDiente[dienteAdulto.index].dentariaExtruida}
            dentariaIntruida={mapaDiente[dienteAdulto.index].dentariaIntruida}
            dentariaSupernumeraria={mapaDiente[dienteAdulto.index].dentariaSupernumeraria}
            macrodoncia={mapaDiente[dienteAdulto.index].macrodoncia}
            microdoncia={mapaDiente[dienteAdulto.index].microdoncia}
            dentariaEctopica={mapaDiente[dienteAdulto.index].dentariaEctopica}

            //  <MOVILIDAD PATOLOGICA     
            movilidadM1={mapaDiente[dienteAdulto.index].movilidadM1}
            movilidadM2={mapaDiente[dienteAdulto.index].movilidadM2}
            movilidadM3={mapaDiente[dienteAdulto.index].movilidadM3}
            movilidadM4={mapaDiente[dienteAdulto.index].movilidadM4}
            movilidadM5={mapaDiente[dienteAdulto.index].movilidadM5}

            //<POSICION DENTARIA
            mesializado={mapaDiente[dienteAdulto.index].mesializado}
            distalizado={mapaDiente[dienteAdulto.index].distalizado}
            vetibularizado={mapaDiente[dienteAdulto.index].vetibularizado}
            palatinizado={mapaDiente[dienteAdulto.index].palatinizado}
            lingualizado={mapaDiente[dienteAdulto.index].lingualizado}

            //<R-T>
            remanenteRadicular={mapaDiente[dienteAdulto.index].remanenteRadicular}
            transposicion={mapaDiente[dienteAdulto.index].transposicion}
            superficieDesgastada={mapaDiente[dienteAdulto.index].superficieDesgastada}

            //<TRATAMIENTO PULPAR
            tratamientoConductos={mapaDiente[dienteAdulto.index].tratamientoConductos}
            pulpectomia={mapaDiente[dienteAdulto.index].pulpectomia}
            pulpotomia={mapaDiente[dienteAdulto.index].pulpotomia}

            //RESTAURACION DEFINITIVA
            amalgama={mapaDiente[dienteAdulto.index].amalgama}
            resina={mapaDiente[dienteAdulto.index].resina}
            ionomero={mapaDiente[dienteAdulto.index].ionomero}
            incrutacion={mapaDiente[dienteAdulto.index].incrutacion}
            incrustacion={mapaDiente[dienteAdulto.index].incrustacion}
            carilla={mapaDiente[dienteAdulto.index].carilla}

            sellantes={mapaDiente[dienteAdulto.index].sellantes}

            figurasInicioFin={mapaDiente[dienteAdulto.index].figurasInicioFin}
            figurasInicioFinEnDiente={mapaDiente[dienteAdulto.index].figurasInicioFinEnDiente}

          //pulpar={true}

          //</R-T>
          >
            <div>
              {dienteAdulto.dibujoDiente}
              {
                mapaDiente[dienteAdulto.index]['imagenes'].map((src, a) => 
                  <div key={a}>
                    <img src={src} alt="img" className="absolute" />
                  </div>
                )
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


    </div >

  );
};

export default DientesAdultoSuperior;
