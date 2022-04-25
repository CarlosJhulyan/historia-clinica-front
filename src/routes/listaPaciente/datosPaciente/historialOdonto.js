import React, { useState } from 'react'
import { Odontograma } from '../../odontograma/odontograma';

const Historial = ({ datosModal, valorScala, setValorScala, estadosOdontograma, setEstadosOdontograma }) => {

    const [estado, setEstado] = useState({ especificaciones: '', observaciones: '' });


    return (
        <>
            <Odontograma
                estadosOdontograma={estadosOdontograma}
                // setEstadosOdontograma={setEstadosOdontograma}
                valorScala={valorScala}
                estado={estado}
                setEstado={setEstado}
                setValorScala={setValorScala}
                historial={true}
                datosModal={datosModal} />
        </>
    )
}
export default Historial;