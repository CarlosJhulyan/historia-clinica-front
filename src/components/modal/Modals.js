import React from 'react'
import { ModalCinco } from './ModalCinco';
import { ModalCuatro } from './ModalCuatro';
import { ModalDiez } from './ModalDiez';
import { ModalDos } from './ModalDos';
import { ModalLista } from './ModalLista';
import { ModalNueve } from './ModalNueve';
import { ModalOcho } from './ModalOcho';
import { ModalSeis } from './ModalSeis';
import { ModalSiete } from './ModalSiete';
import { ModalTres } from './ModalTres';
import { ModalUno } from './ModalUno';

export const Modals = (props) => {

    const { abrirModal, setAbrirModal, numero, hallazgo, tipoDiente, estado, tipo, dienteFin, modoInferior, reiniciarDientes } = props;
    // const splitHallazgo = hallazgo.split(': ',)[1]


    console.log("hallazgo:", hallazgo);
    console.log('NUMERO: ', numero);

    if (hallazgo === '') {
        return <ModalLista abrirModal={abrirModal} setAbrirModal={setAbrirModal} numero={numero} modoInferior={modoInferior} />
    }

    if (hallazgo === 'Aparato Orto Fijo' || hallazgo === 'Aparato Orto Removible' || hallazgo === 'Prótesis Fija' || hallazgo === 'Prótesis Removible' || hallazgo === 'Prótesis Total') {
        return <ModalUno abrirModal={abrirModal} setAbrirModal={setAbrirModal} hallazgo={hallazgo} numero={numero} estado={estado} dienteFin={dienteFin} modoInferior={modoInferior} reiniciarDientes={reiniciarDientes} />
    }

    if (hallazgo === 'Caries Dental') {
        return <ModalDos abrirModal={abrirModal} setAbrirModal={setAbrirModal} hallazgo={hallazgo} tipo={tipo} numero={numero} tipoDiente={tipoDiente} modoInferior={modoInferior} />
    }

    if (hallazgo === 'Corona' || hallazgo === 'Corona Temporal' || hallazgo === 'Defectos de Desarrollo del Esmalte' || hallazgo === 'Tratamiento Pulpar') {
        return <ModalTres abrirModal={abrirModal} setAbrirModal={setAbrirModal} hallazgo={hallazgo} numero={numero} estado={estado} tipo={tipo} modoInferior={modoInferior} />
    }

    if (hallazgo === 'Diastema' || hallazgo === 'Fosas y Fisuras Profundas' || hallazgo === 'Fusión' || hallazgo === 'Geminasión' || hallazgo === 'Impactación' || hallazgo === 'Macrodoncia' || hallazgo === 'Microdoncia' ||
        hallazgo === 'Pieza Dentaria Ausente' || hallazgo === 'Pieza Dentaria Ectópica' || hallazgo === 'Pieza Dentaria en Clavija' || hallazgo === 'Pieza Dentaria en Erupcion' ||
        hallazgo === 'Pieza Dentaria Extruida' || hallazgo === 'Pieza Dentaria Intruida' || hallazgo === 'Pieza Dentaria Supernumeraria' || hallazgo === 'Remanente Radicular' ||
        hallazgo === 'Superficie Desgastada' || hallazgo === 'Transposición') {
        return <ModalCuatro abrirModal={abrirModal} setAbrirModal={setAbrirModal} hallazgo={hallazgo} numero={numero} modoInferior={modoInferior} />
    }

    if (hallazgo === 'Edentulo Total') {
        return <ModalCinco abrirModal={abrirModal} setAbrirModal={setAbrirModal} hallazgo={hallazgo} numero={numero} dienteFin={dienteFin} modoInferior={modoInferior} reiniciarDientes={reiniciarDientes} />
    }

    if (hallazgo === 'Espigo Muñon' || hallazgo === 'Implante Dental') {
        return <ModalSeis abrirModal={abrirModal} setAbrirModal={setAbrirModal} hallazgo={hallazgo} numero={numero} estado={estado} modoInferior={modoInferior} />
    }

    if (hallazgo === 'Fractura' || hallazgo === 'Giroversión') {
        return <ModalSiete abrirModal={abrirModal} setAbrirModal={setAbrirModal} hallazgo={hallazgo} numero={numero} tipo={tipo} modoInferior={modoInferior} />
    }

    if (hallazgo === 'Movilidad Patológica' || hallazgo === 'Posicion Dentaria') {
        return <ModalOcho abrirModal={abrirModal} setAbrirModal={setAbrirModal} hallazgo={hallazgo} numero={numero} tipo={tipo} modoInferior={modoInferior} />
    }


    if (hallazgo === 'Restauración Definitiva') {
        return <ModalNueve abrirModal={abrirModal} setAbrirModal={setAbrirModal} hallazgo={hallazgo} numero={numero} tipo={tipo} tipoDiente={tipoDiente} modoInferior={modoInferior} />;
    }

    if (hallazgo === 'Restauración Temporal' || hallazgo === 'Sellantes') {
        console.log('MODAL DIEZZZZZ');
        return <ModalDiez abrirModal={abrirModal} setAbrirModal={setAbrirModal} hallazgo={hallazgo} numero={numero} tipoDiente={tipoDiente} mostrarEstados={hallazgo === 'Sellantes'} modoInferior={modoInferior} />;
    }
}
