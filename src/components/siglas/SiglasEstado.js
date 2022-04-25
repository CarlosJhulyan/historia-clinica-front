import React from 'react'

export const SiglasEstado = ({ buenEstado, siglas }) => <span className={buenEstado ? 'buen-estado-text' : 'mal-estado-text'}>{siglas}, </span>;



