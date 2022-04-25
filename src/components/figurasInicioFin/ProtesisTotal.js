export const ProtesisTotalBuenEstado = ({ esInvertido }) => (
    <div className={esInvertido ? "protesis-total-invertido " : "protesis-total"}></div>
);
export const ProtesisTotalMalEstado = ({ esInvertido }) => (
    <div className={esInvertido ? "protesis-total-invertido-mal " : "protesis-total-mal"}></div>
);
