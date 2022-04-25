export const ProtesisFijaInicioBuenEstado = ({ esInvertido }) => (
    <div className={esInvertido ? "protesis-fija-fin componente-invertido" : "protesis-fija-inicio"}></div>
);
export const ProtesisFijaFinalBuenEstado = ({ esInvertido }) => (
    <div className={esInvertido ? "protesis-fija-inicio componente-invertido" : "protesis-fija-fin"}></div>
);
export const ProtesisFijaPuenteBuenEstado = ({ }) => (
    <div className="orto-fijo-puente"></div>
);
export const ProtesisFijaInicioMalEstado = ({ esInvertido }) => (
    <div className={esInvertido ? "protesis-fija-fin-mal componente-invertido" : "protesis-fija-inicio-mal"}></div>
);
export const ProtesisFijaFinalMalEstado = ({ esInvertido }) => (
    <div className={esInvertido ? "protesis-fija-inicio-mal componente-invertido" : "protesis-fija-fin-mal"}></div>
);
export const ProtesisFijaPuenteMalEstado = ({ }) => (
    <div className="orto-fijo-puente-mal"></div>
);
