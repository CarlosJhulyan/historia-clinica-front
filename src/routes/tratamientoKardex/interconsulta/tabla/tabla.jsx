import { Button, Card, Table, Input, DatePicker } from 'antd';
import { createRef, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { httpClient } from '../../../../util/Api';
import { notificaciones } from '../../../../util/util';
import Moment from 'moment';
import confirm from 'antd/lib/modal/confirm';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const TablaInterconsulta = ({ historia, editar, TraerDatos }) => {
  const dataInterconsulta = useSelector(state => state.kardexInterconsulta);

  const token = JSON.parse(localStorage.getItem('token'));

  const [data, setData] = useState([]);
  const [body, setBody] = useState();

  useEffect(() => {
    if (editar && editar.interconsultas.length > 0) {
      console.log(editar.interconsultas, dataInterconsulta);
      const aux = [];
      editar.interconsultas.forEach(e => {
        // if (e.estado !== '1') {
        aux.push(e);
        // }
      });
      dataInterconsulta.forEach(t => {
        if (!editar.interconsultas.find(e => e.codigo_producto === t.COD_PROD)) {
          aux.push(t);
        }
      });
      setData(aux);
    } else if (dataInterconsulta.length > 0) {
      setData(dataInterconsulta);
    } else {
      setData([]);
    }
  }, [editar, dataInterconsulta]);

  const onChangeHora = (value, index, tipo) => {
    if (value) {
      if (tipo === 'toma') {
        data[index].horaToma = value.target.value;
      } else if (tipo === 'entrega') {
        data[index].horaEntrega = value.target.value;
      }
    }
  };

  const onFecha = (value, index, tipo) => {
    if (value) {
      if (tipo === 'toma') {
        data[index].dateToma = value.format('DD/MM/YYYY');
      } else if (tipo === 'entrega') {
        data[index].dateEntrega = value.format('DD/MM/YYYY');
      }
    }
  };

  const setInterconsulta = async () => {
    console.log(data);
    var validator = false;
    const arreglo = [];
    data.forEach(e => {
      if ((e.horaToma && e.dateToma) || (e.horaEntrega && e.dateEntrega)) {
        validator = true;
      }
      arreglo.push({
        codProducto: e.COD_PROD || e.codigo_producto,
        producto: e.DESC_PROD || e.producto,
        nomLaboratorio: e.NOM_LAB || e.nombre_laboratorio,
        ruc: e.RUC || e.ruc,
        tipo: e.tipo,
        estado: '0',
        fechaToma: e.horaToma && e.dateToma ? Moment((e.horaToma + ' ' + e.dateToma), 'HH:mm DD/MM/YYYY').utcOffset('GMT-05:00').format() : e.fecha_toma && e.fecha_toma !== null ? Moment(e.fecha_toma, 'YYYY-MM-DD HH:mm').utcOffset('GMT-05:00').format() : 'null',
        fechaEntrega: e.horaEntrega && e.dateEntrega ? Moment((e.horaEntrega + ' ' + e.dateEntrega), 'HH:mm DD/MM/YYYY').utcOffset('GMT-05:00').format() : e.fecha_entrega && e.fecha_entrega !== null ? Moment(e.fecha_entrega, 'YYYY-MM-DD HH:mm').utcOffset('GMT-05:00').format() : 'null',
      });
    });
    const body = {
      codMedico: token.cod_medico,
      nomMedico: token.des_nom_medico + ' ' + token.des_ape_medico,
      codPaciente: historia.codPaciente,
      nomPaciente: historia.nombrePaciente,
      hc: historia.hc,
      interconsulta: arreglo,
    };
    console.warn('Cuerpo enviado', body);
    if (validator) {
      var response = {};
      response = await httpClient.post('kardex/setKardexInterconsulta', body);
      if (response.data.success) {
        notificaciones('Completado!');
        TraerDatos();
      } else {
        notificaciones(response.message, 'Alerta');
      }
    } else {
      notificaciones('Debe llenar todos los campos', 'Alerta');
      console.error('Completar datos');
    }
  }

  function showConfirm() {
    confirm({
      title: '¿Está seguro de registrar las interconsultas?',
      icon: <ExclamationCircleOutlined />,
      cancelText: 'Cancelar',
      okText: 'Grabar los cambios',
      onOk() {
        setInterconsulta();
      },
      onCancel() {
        // setAbrir(false);
      },
    });
  }

  return (
    <>
      <div style={{ width: '100%' }}>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', backgroundColor: '#FAFAFA', padding: '20px', fontSize: '14px', borderBottom: '1px solid #E8E8E8', fontWeight: '500' }}>
            <div style={{ width: '30%', textAlign: 'left' }}>Descripción</div>
            <div style={{ width: '30%', textAlign: 'left' }}>Fecha de toma</div>
            <div style={{ width: '30%', textAlign: 'left' }}>Fecha de entrega</div>
          </div>
          {data.length > 0 ?
            data.map((item, index) => {
              return (
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', backgroundColor: 'white', padding: '20px', fontSize: '14px', borderBottom: '1px solid #E8E8E8', alignItems: 'center' }}>
                  <div style={{ width: '30%', textAlign: 'left' }}>{item.DESC_PROD ? item.DESC_PROD : item.producto}</div>
                  <div style={{ width: '30%', textAlign: 'left' }}>
                    <Input
                      style={{ width: '38%', marginRight: '5px' }}
                      onChange={e => onChangeHora(e, index, 'toma')}
                      type="time"
                      defaultValue={item.fecha_toma !== null && item.fecha_toma && item.fecha_toma.split(' ')[1]}
                    />
                    <DatePicker
                      style={{ width: '58%', marginLeft: '5px' }}
                      onChange={e => onFecha(e, index, 'toma')}
                      placeholder='Seleccione la fecha'
                      defaultValue={item.fecha_toma !== null && item.fecha_toma && Moment(item.fecha_toma, 'YYYY-MM-DD HH:mm').utcOffset('GMT-05:00')}
                    />
                  </div>
                  <div style={{ width: '30%', textAlign: 'left' }}>
                    <Input
                      style={{ width: '38%', marginRight: '5px' }}
                      onChange={e => onChangeHora(e, index, 'entrega')}
                      type="time"
                      defaultValue={item.fecha_entrega !== null && item.fecha_entrega && item.fecha_entrega.split(' ')[1]}
                    />
                    <DatePicker
                      style={{ width: '58%', marginLeft: '5px' }}
                      onChange={e => onFecha(e, index, 'entrega')}
                      placeholder='Seleccione la fecha'
                      defaultValue={item.fecha_entrega !== null && item.fecha_entrega && Moment(item.fecha_entrega, 'YYYY-MM-DD HH:mm').utcOffset('GMT-05:00')}
                    />
                  </div>
                </div>
              );
            })
            :
            <div style={{ display: 'flex', flexDirection: 'row', padding: '50px', fontSize: '14px', justifyContent: 'center', alignItems: 'center' }}>No se encuentran Interconsultas</div>
          }
        </div>


        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button type='primary' onClick={showConfirm}>Guardar</Button>
        </div>
        <ToastContainer pauseOnHover={false} />
      </div>
    </>
  );
};
export default TablaInterconsulta;
