import React from 'react';
import Cabecera from './Cabecera';
import PlanDeTrabajo from './PlanDeTrabajo';
import ExamenesAuxiliares from './ExamenesAuxiliares';
import ImpresionDiagnostica from './ImpresionDiagnostica';
import PlanDeTratamiento from './PlanDeTratamiento';
import EvolucionTratamiento from './EvolucionTratamiento';
import Medicacion from './Medicacion';
import Filiacion from './Filiacion';
import MotivoConsulta from './MotivoConsulta';
import Riesgos from './Riesgos';
import Antecedentes from './Antecedentes';
import FuncionesVitales from './FuncionesVitales';
import ExamenClinico from './ExamenClinico';
import DatosDelProfesional from './DatosDelProfesional';
import { Card } from 'antd';
import { DienteAdulto } from '../../models/DienteAdulto';
import { estado } from '../../constants/Odontograma';

const Prueba = (props) => {
  const { datosModal,filaActual } = props;
  const diente = new DienteAdulto();

  return (
    <Card className="gx-card">
      <Cabecera />
      <Filiacion datosModal={datosModal} filaActual={filaActual}/>
      <br />
      <MotivoConsulta />
      <br />
      <Riesgos />
      <br />
      <Antecedentes />
      <br />
      <FuncionesVitales />
      <br />
      <ExamenClinico />
      <br />
      <PlanDeTrabajo />
      <br />
      <ExamenesAuxiliares />
      <br />
      <ImpresionDiagnostica />
      <br />
      <PlanDeTratamiento />
      <br />
      <EvolucionTratamiento />
      <br />
      <Medicacion />
      <br />
      <DatosDelProfesional />
    </Card>
  );
}

export default Prueba;
