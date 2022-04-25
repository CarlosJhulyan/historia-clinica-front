import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Col, Row, Spin } from "antd";
import Menu from "./MenuOdonto";
import DientesAdultoSuperior from "./adultoSuperior";
import DientesInfanteSuperior from "./infanteSuperior";
import DientesAdultoInferior from "./adultoInferior";
import DientesInfanteInferior from "./infanteInferior";
import { DienteAdulto } from "../../models/DienteAdulto";
import { httpClient } from "../../util/Api";
import './styles.css';
import { actualizar_diente } from "../../appRedux/actions";

export const PruebaOdontograma = ({ historial }) => {
  const [dienteInicial, setDienteInicial] = useState();
  //Función para disparar las acciones con las funciones del actions.
  const dispatch = useDispatch();

  //Instancia del Diente.
  const diente = new DienteAdulto();

  // Set del diente para que se pueda editar.
  let diente2 = diente;

  //Obtener el estado del diente reducer.
  const v = useSelector(state => state.dientePrueba.diente);
  diente2.importar(v);


  //Hook que se ejecuta despues de renderizar la app.
  /*useEffect(() => {

    //Se realiza una validación: Si existen datos se hace uso del dispatch, caso contrario no.
    diente2.setFusion({
      diente: 18,
      diagnostico: "Probando",
    });
    diente2.setFusion({
      diente: 17,
      diagnostico: "Probando abc",
    });
    diente2.setCariesDental({
      tipo: cariesDentalTipo.cd,
      partes: {
        vestibular: false,
        palatino: true,
        distal: false,
        mesial: false,
      },
      diente: 17,
      diagnostico: "Probando Caries"
    });
    diente2.setCariesDental({
      tipo: cariesDentalTipo.cd,
      partes: {
        vestibular: true,
        palatino: false,
        distal: false,
        mesial: false,
      },
      diente: 18,
      diagnostico: "Probando Caries 123"
    });
    diente2.setCariesDental({
      tipo: cariesDentalTipo.cdp,
      partes: {
        vestibular: true,
        palatino: true,
        distal: true,
        mesial: true,
        oclusal: true,
      },
      diente: 18,
      diagnostico: "Probando Caries 987987"
    });
    const data1 = diente2.exportar();

    dispatch(actualizar_diente(data1));

    return (() => {
      dispatch(actualizar_diente(''));
    });


  }, []);*/

  // useEffect(useCallback(async () => obtenerData(), []),[])
  useEffect(() => {
    setDienteInicial({})
    /* obtenerData().then(result => {
      console.log("Result:", result);
      if (result.success && result.data) {
        console.log('DIENTEEEEEEE', JSON.stringify(result.data));
        setDienteInicial(result.data);
        
        //
        diente2.importar(JSON.stringify(result.data));
        const data1 = diente2.exportar();
        console.log('EXPORTAR', data1);
        dispatch(actualizar_diente(data1));
      } else {
        setDienteInicial({});
        const data1 = diente2.exportar();
        console.log('EXPORTAR', data1);
        dispatch(actualizar_diente(data1));
      }

      return (() => {
        dispatch(actualizar_diente(''));
      });
    }); */
  }, []);


  const obtenerData = async () => {
    const body = {
      COD_PACIENTE: "0010260788",
      COD_GRUPO_CIA: "001",
      COD_MEDICO: "0000026144"
    };
    const { data } = await httpClient.post(`/odontograma/obtener`, body);
    return data;
  }
  const enviarData = async () => {
    // const dataExportada = diente2.exportar();
    console.log('CARGANDO API');
    const body = {
      COD_PACIENTE: "0010260788",
      COD_GRUPO_CIA: "001",
      COD_MEDICO: "0000026144",
      data: diente2,
    };

    const data = await httpClient.post(`/odontograma/registrar`, body);
    console.log('RESPUESTA API', data);
  }
  return (
    <Card title="Odontograma">
      {dienteInicial === undefined ?
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Spin tip="Cargando" />
        </div>
        : <>
          <Row className="row-odontograma">
            <Col lg={18} md={10} sm={12} xs={24} className="contenedor-odontograma">
              <div className="width-odontograma" >
                <div>
                  <DientesAdultoSuperior />
                </div>
                <div style={{ paddingTop: "50px" }}>
                  <DientesInfanteSuperior />
                </div>
                <div style={{ paddingTop: "50px" }}>
                  <DientesInfanteInferior />
                </div>
                <div style={{ paddingTop: "50px" }}>
                  <DientesAdultoInferior />
                </div>
              </div>
            </Col>
            {
              (!historial)
                ? <Col lg={6} md={6} sm={12} xs={24}>
                  <Menu></Menu>
                </Col>
                : null
            }

          </Row>
          <br />
          <Button onClick={enviarData}>Enviar</Button>
        </>
      }
    </Card>
  );
};
