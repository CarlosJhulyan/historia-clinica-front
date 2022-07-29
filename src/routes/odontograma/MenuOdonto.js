import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Dropdown, Menu, Form, Col, Input, Button, Row, Badge } from "antd";
import { DeleteOutlined, DownOutlined, MenuOutlined } from '@ant-design/icons';
import AparatoOrtoFijo from '../../assets/images/menu/AparatoOrtoIcono.png';
import AparatoOrtoRemovible from '../../assets/images/menu/AparatoOrtodonticoRemovibleIcono.png';
import CariesDental from '../../assets/images/menu/imgariosa.png';
import Corona from '../../assets/images/menu/CoronaDefinitivaIcono.png';
import CoronaTemporal from '../../assets/images/menu/Coronatemp.png';
import DefectosDesarrolloEsmalte from '../../assets/images/menu/imgdde.png';
import Diastema from '../../assets/images/menu/imgdiastema.png';
import EdentuloTotal from '../../assets/images/menu/imgendtotal.png';
import EspigonMunon from '../../assets/images/menu/pernomunon.png';
import Fractura from '../../assets/images/menu/imgfractura.png';
import Fusion from '../../assets/images/menu/imgfusion.png';
import Geminasion from '../../assets/images/menu/imgeminasion.png';
import Impactacion from '../../assets/images/menu/imgimpactacion.png';
import ImplanteDental from '../../assets/images/menu/imgimplant.png';
import Macrodoncia from '../../assets/images/menu/imgmacrodoncia.png';
import Microdoncia from '../../assets/images/menu/imgmicrodoncia.png';
import MovilidadPatologica from '../../assets/images/menu/imgmovilidadpat.png';
import Clavija from '../../assets/images/menu/imgdienteclavija.png';
import Erupcion from '../../assets/images/menu/imgdienterupcion.png';
import Extruida from '../../assets/images/menu/imgdientextruido.png';
import Intruida from '../../assets/images/menu/imgdientintruido.png';
import Supernumeraria from '../../assets/images/menu/imgpupernumerario.png';
import Posicion from '../../assets/images/menu/interrogacion.png';
import Fija from '../../assets/images/menu/imgProtesisFija.png';
import Removible from '../../assets/images/menu/imgprotesisremovible.png';
import Total from '../../assets/images/menu/imgprotesistotal.png';
import Remanente from '../../assets/images/menu/imgremanenteradicular.png';
import Definitiva from '../../assets/images/menu/imgrestauraciondefinitiva.png';
import Temporal from '../../assets/images/menu/imgrestauraciontemporal.png';
import Sellantes from '../../assets/images/menu/imgsellantes.png';
import Transposicion from '../../assets/images/menu/imgtransposicion.png';
import Pulpar from '../../assets/images/menu/imgtratamientopulpal.png';
import { quitar_seleccion, seleccion_inicio_fin, seleccion_sin_estado } from "../../appRedux/actions/Menu";
import { opciones } from "../../models/opciones";
import { connectSearchBox, SortBy } from "react-instantsearch-dom";
import { ModalCaptura } from "../../components/modal/ModalCaptura";


const SubMenu = Menu.SubMenu;
const tabListNoTitle = [{
    key: 'aI',
    tab: 'A-I',
}, {
    key: 'lP',
    tab: 'L-P',
}, {
    key: 'rT',
    tab: 'R-T',
}, /* {
    key: 'detalle',
    tab: 'Detalle',
} */];


const MenuOdonto = (props) => {

    const { fff, imagen, setImagen } = props;

    /* FUNCIONES DE REDUX */
    const estado = useSelector(state => state.menu);
    const dispatch = useDispatch();
    const { themeSettingsGlobal } = useSelector(({ settings }) => settings);
    //ESTADO MODAL CAPTURAR
    const [modalCapturar, setModalCapturar] = useState(false);


    /*  console.log(estado); */

    const [state, setState] = useState({
        key: 'aI',
        noTitleKey: 'aI',
    })
    const onTabChange = (key, type) => {
        setState({ [type]: key });
    };

    /* ACCION AL SELECCIONAR */
    const menuSeleccionado = (value) => {
        console.log(value);
        // console.log("mapa: ", value);
        console.log(`${value.hallazgo} seleccionado`);
        dispatch(seleccion_sin_estado(value));

        //Dispatch al stateDiente -> hallazgo
    }
    const menuInicioFinSeleccionado = (value) => {
        console.log(value);
        // console.log("mapa: ", value);
        console.log(`${value.hallazgo} seleccionado`);
        dispatch(seleccion_inicio_fin(value));

        //Dispatch al stateDiente -> hallazgo
    }

    /* INITSTATE ACTUALIZADO */
    const { seleccion, opcion } = estado;
    /* console.log(seleccion);
    console.log(opcion); */



    /*TERRIBLE CODIGO */
    const contentListNoTitle = {
        aI:
            <div>
                {/* --- Aparato Orto Fijo --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <Menu.Item onClick={() => menuInicioFinSeleccionado({ hallazgo: opciones.aparatoOrtoFijo.hallazgo, estado: opciones.aparatoOrtoFijo.estado.bueno })} key="AparatoOrtoFijo.BuenEstado"><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                <Menu.Item onClick={() => menuInicioFinSeleccionado({ hallazgo: opciones.aparatoOrtoFijo.hallazgo, estado: opciones.aparatoOrtoFijo.estado.malo })} key="AparatoOrtoFijo.MalEstado"><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={AparatoOrtoFijo} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Aparato Orto.Fijo <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {/* --- Aparato Orto Fijo --- */}
                {/* --- Aparato Orto Removible --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <Menu.Item onClick={() => menuInicioFinSeleccionado({ hallazgo: opciones.aparatoOrtoRemovible.hallazgo, estado: opciones.aparatoOrtoRemovible.estado.bueno })} key="AparatoOrtoRemovible.BuenEstado"><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                <Menu.Item onClick={() => menuInicioFinSeleccionado({ hallazgo: opciones.aparatoOrtoRemovible.hallazgo, estado: opciones.aparatoOrtoRemovible.estado.malo })} key="AparatoOrtoRemovible.MalEstado"><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={AparatoOrtoRemovible} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Aparato Orto.Removible <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {/* --- Aparato Orto Removible --- */}
                {/* --- Caries Dental --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <Menu.Item key="Caries.MB" onClick={() => menuSeleccionado({ hallazgo: opciones.cariesDental.hallazgo, tipo: opciones.cariesDental.tipo.MB })}>MB</Menu.Item>
                                <Menu.Item key="Caries.CE" onClick={() => menuSeleccionado({ hallazgo: opciones.cariesDental.hallazgo, tipo: opciones.cariesDental.tipo.CE })}>CE</Menu.Item>
                                <Menu.Item key="Caries.CD" onClick={() => menuSeleccionado({ hallazgo: opciones.cariesDental.hallazgo, tipo: opciones.cariesDental.tipo.CD })}>CD</Menu.Item>
                                <Menu.Item key="Caries.CDP" onClick={() => menuSeleccionado({ hallazgo: opciones.cariesDental.hallazgo, tipo: opciones.cariesDental.tipo.CDP })}>CDP</Menu.Item>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={CariesDental} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Caries Dental <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {/* --- Caries Dental --- */}
                {/* --- Corona --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <SubMenu key="Corona.Metalica" title={<span><b>CM:</b> Corona Metálica</span>}>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.corona.hallazgo, tipo: opciones.corona.tipo.CM, estado: opciones.corona.estado.bueno })} key="Corona.Metalica.BuenEstado"><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.corona.hallazgo, tipo: opciones.corona.tipo.CM, estado: opciones.corona.estado.malo })} key="Corona.Metalica.MalEstado"><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                                </SubMenu>
                                <SubMenu key="Corona.Fenestrada" title={<span><b>CF:</b> Corona Fenestrada</span>}>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.corona.hallazgo, tipo: opciones.corona.tipo.CF, estado: opciones.corona.estado.bueno })} key="Corona.Fenestrada.BuenEstado"><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.corona.hallazgo, tipo: opciones.corona.tipo.CF, estado: opciones.corona.estado.malo })} key="Corona.Fenestrada.MalEstado"><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                                </SubMenu>
                                <SubMenu key="Corona.Ceramica" title={<span><b>CMC:</b> Corona Metal Cerámica</span>}>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.corona.hallazgo, tipo: opciones.corona.tipo.CMC, estado: opciones.corona.estado.bueno })} key="Corona.Ceramica.BuenEstado"><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.corona.hallazgo, tipo: opciones.corona.tipo.CMC, estado: opciones.corona.estado.malo })} key="Corona.Ceramica.MalEstado"><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                                </SubMenu>
                                <SubMenu key="Corona.Veneer" title={<span><b>CV:</b> Corona Veneer</span>}>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.corona.hallazgo, tipo: opciones.corona.tipo.CV, estado: opciones.corona.estado.bueno })} key="Corona.Veneer.BuenEstado"><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.corona.hallazgo, tipo: opciones.corona.tipo.CV, estado: opciones.corona.estado.malo })} key="Corona.Veneer.MalEstado"><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                                </SubMenu>
                                <SubMenu key="Corona.Jacket" title={<span><b>CJ:</b> Corona Jacket</span>}>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.corona.hallazgo, tipo: opciones.corona.tipo.CJ, estado: opciones.corona.estado.bueno })} key="Corona.Jacket.BuenEstado"><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.corona.hallazgo, tipo: opciones.corona.tipo.CJ, estado: opciones.corona.estado.malo })} key="Corona.Jacket.MalEstado"><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                                </SubMenu>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={Corona} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Corona <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {/* --- Corona --- */}
                {/* --- Corona Temporal --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.coronaTemporal.hallazgo, tipo: opciones.coronaTemporal.tipo.CT, estado: opciones.coronaTemporal.estado.bueno })} key="CoronaTemporal.BuenEstado"><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.coronaTemporal.hallazgo, tipo: opciones.coronaTemporal.tipo.CT, estado: opciones.coronaTemporal.estado.malo })} key="CoronaTemporal.MalEstado"><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={CoronaTemporal} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Corona Temporal <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {/* --- Corona Temporal --- */}
                {/* --- Defectos de Desarrollo del Esmalte --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <SubMenu key="Defectos.Hipoplasia" title={<span><b>HP:</b> Hipoplasia</span>}>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.esmalte.hallazgo, tipo: opciones.esmalte.tipo.HP, estado: opciones.esmalte.estado.bueno })} key="Defectos.Hipoplasia.BuenEstado"><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.esmalte.hallazgo, tipo: opciones.esmalte.tipo.HP, estado: opciones.esmalte.estado.malo })} key="Defectos.Hipoplasia.MalEstado"><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                                </SubMenu>
                                <SubMenu key="Defectos.Mineralizacion" title={<span><b>HM:</b> Hipo Mineralización</span>}>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.esmalte.hallazgo, tipo: opciones.esmalte.tipo.HM, estado: opciones.esmalte.estado.bueno })} key="Defectos.Mineralizacion.BuenEstado"><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.esmalte.hallazgo, tipo: opciones.esmalte.tipo.HM, estado: opciones.esmalte.estado.malo })} key="Defectos.Mineralizacion.MalEstado"><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                                </SubMenu>
                                <SubMenu key="Defectos.Opacidades" title={<span><b>O:</b> Opacidades del Esmalte</span>}>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.esmalte.hallazgo, tipo: opciones.esmalte.tipo.O, estado: opciones.esmalte.estado.bueno })} key="Defectos.Opacidades.BuenEstado"><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.esmalte.hallazgo, tipo: opciones.esmalte.tipo.O, estado: opciones.esmalte.estado.malo })} key="Defectos.Opacidades.MalEstado"><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                                </SubMenu>
                                <SubMenu key="Defectos.Decoloracion" title={<span><b>D:</b> Decoloracion del Esmalte</span>}>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.esmalte.hallazgo, tipo: opciones.esmalte.tipo.D, estado: opciones.esmalte.estado.bueno })} key="Defectos.Decoloracion.BuenEstado"><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.esmalte.hallazgo, tipo: opciones.esmalte.tipo.D, estado: opciones.esmalte.estado.malo })} key="Defectos.Decoloracion.MalEstado"><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                                </SubMenu>
                                <SubMenu key="Defectos.Fluorosis" title={<span><b>Fluorosis:</b> Fluorosis</span>}>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.esmalte.hallazgo, tipo: opciones.esmalte.tipo.Fluorosis, estado: opciones.esmalte.estado.bueno })} key="Defectos.Fluorosis.BuenEstado"><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.esmalte.hallazgo, tipo: opciones.esmalte.tipo.Fluorosis, estado: opciones.esmalte.estado.malo })} key="Defectos.Fluorosis.MalEstado"><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                                </SubMenu>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={DefectosDesarrolloEsmalte} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Defectos de desarrollo del esmalte <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {/* --- Defectos de Desarrollo del Esmalte --- */}
                {/* --- Diastema --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.diastema.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={Diastema} alt="i" />
                    <span className="gx-link">
                        &nbsp; Diastema
                    </span>
                </div>
                {/* --- Diastema --- */}
                {/* --- Endetulo Total --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuInicioFinSeleccionado({ hallazgo: opciones.edentuloTotal.hallazgo })}>
                    <img className="gx-size-15" src={EdentuloTotal} alt="i" />
                    <span className="gx-link">
                        &nbsp; Edentulo Total
                    </span>
                </div>
                {/* --- Endetulo Total --- */}
                {/* --- Espigon Muñon --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <Menu.Item key="Espigon.BuenEstado" onClick={() => menuSeleccionado({ hallazgo: opciones.espigoMunon.hallazgo, tipo: '', estado: opciones.espigoMunon.estado.bueno })} ><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                <Menu.Item key="Espigon.MalEstado" onClick={() => menuSeleccionado({ hallazgo: opciones.espigoMunon.hallazgo, tipo: '', estado: opciones.espigoMunon.estado.malo })} ><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={EspigonMunon} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Espigon Muñon <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {/* --- Espigon Muñon --- */}
                {/* --- Fosas y Fisuras Profundas --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.fosasFisuras.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={'a'} alt="i" />
                    <span className="gx-link">
                        &nbsp; Fosas y Fisuras Profundas
                    </span>
                </div>
                {/* --- Fosas y Fisuras Profundas --- */}
                {/* --- Fractura --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <Menu.Item key="Fractura.Coronal" onClick={() => menuSeleccionado({ hallazgo: opciones.fractura.hallazgo, tipo: opciones.fractura.tipo.Coronal })}><img className="gx-size-15" src={'a'} alt="i" />Fractura Coronal</Menu.Item>
                                <Menu.Item key="Fractura.Incisal" onClick={() => menuSeleccionado({ hallazgo: opciones.fractura.hallazgo, tipo: opciones.fractura.tipo.Incisal })}><img className="gx-size-15" src={'a'} alt="i" />Fractura Incisal</Menu.Item>
                                <Menu.Item key="Fractura.Raiz" onClick={() => menuSeleccionado({ hallazgo: opciones.fractura.hallazgo, tipo: opciones.fractura.tipo.Raiz })}><img className="gx-size-15" src={'a'} alt="i" />Fractura Raiz y Coronal</Menu.Item>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={Fractura} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Fractura <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {/* --- Fractura --- */}
                {/* --- Fusion --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.fusion.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={Fusion} alt="i" />
                    <span className="gx-link">
                        &nbsp; Fusion
                    </span>
                </div>
                {/* --- Fusion --- */}
                {/* --- Geminasion --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.geminasion.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={Geminasion} alt="i" />
                    <span className="gx-link">
                        &nbsp; Geminasión
                    </span>
                </div>
                {/* --- Geminasion --- */}
                {/* --- Giroversion --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <Menu.Item key="Giroversion.Distal" onClick={() => menuSeleccionado({ hallazgo: opciones.giroversion.hallazgo, tipo: opciones.giroversion.tipo.Distal })}>Giroversión Distal</Menu.Item>
                                <Menu.Item key="Giroversion.Mesial" onClick={() => menuSeleccionado({ hallazgo: opciones.giroversion.hallazgo, tipo: opciones.giroversion.tipo.Mesial })}>Giroversión Mesial</Menu.Item>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={'a'} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Giroversión <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {/* --- Giroversion --- */}
                {/* --- Impactacion --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.impactacion.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={Impactacion} alt="i" />
                    <span className="gx-link">
                        &nbsp; Impactación
                    </span>
                </div>
                {/* --- Impactacion --- */}
                {/* --- Implante Dental --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <Menu.Item key="Implante.BuenEstado" onClick={() => menuSeleccionado({ hallazgo: opciones.implanteDental.hallazgo, estado: opciones.implanteDental.estado.bueno })}><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                <Menu.Item key="Implante.MalEstado" onClick={() => menuSeleccionado({ hallazgo: opciones.implanteDental.hallazgo, estado: opciones.implanteDental.estado.malo })}><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={ImplanteDental} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Implante Dental <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div >
                {/* --- Implante Dental --- */}
            </div >,
        lP:
            <div>
                {/* --- Macrodoncia --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.macrodoncia.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={Macrodoncia} alt="i" />
                    <span className="gx-link">
                        &nbsp; Macrodoncia
                    </span>
                </div>
                {/* --- Macrodoncia --- */}
                {/* --- Microdoncia --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.microdoncia.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={Microdoncia} alt="i" />
                    <span className="gx-link">
                        &nbsp; Microdoncia
                    </span>
                </div>
                {/* --- Microdoncia --- */}
                {/* --- Movilidad Patológica --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <Menu.Item key="Movilidad.1" onClick={() => menuSeleccionado({ hallazgo: opciones.movilidadPatologica.hallazgo, tipo: opciones.movilidadPatologica.tipo.M1 })}>M1</Menu.Item>
                                <Menu.Item key="Movilidad.2" onClick={() => menuSeleccionado({ hallazgo: opciones.movilidadPatologica.hallazgo, tipo: opciones.movilidadPatologica.tipo.M2 })}>M2</Menu.Item>
                                <Menu.Item key="Movilidad.3" onClick={() => menuSeleccionado({ hallazgo: opciones.movilidadPatologica.hallazgo, tipo: opciones.movilidadPatologica.tipo.M3 })}>M3</Menu.Item>
                                <Menu.Item key="Movilidad.4" onClick={() => menuSeleccionado({ hallazgo: opciones.movilidadPatologica.hallazgo, tipo: opciones.movilidadPatologica.tipo.M4 })}>M4</Menu.Item>
                                <Menu.Item key="Movilidad.5" onClick={() => menuSeleccionado({ hallazgo: opciones.movilidadPatologica.hallazgo, tipo: opciones.movilidadPatologica.tipo.M5 })}>M5</Menu.Item>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={MovilidadPatologica} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Movilidad Patológica <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {/* --- Movilidad Patológica --- */}
                {/* --- Pieza Dentaria Ausente --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.piezaDentariaAusente.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={'a'} alt="i" />
                    <span className="gx-link">
                        &nbsp; Pieza Dentaria Ausente
                    </span>
                </div>
                {/* --- Pieza Dentaria Ausente --- */}
                {/* --- Pieza Dentaria Ectópica --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.piezaDentariaEctopica.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={'a'} alt="i" />
                    <span className="gx-link">
                        &nbsp; Pieza Dentaria Ectópica
                    </span>
                </div>
                {/* --- Pieza Dentaria Ectópica --- */}
                {/* --- Pieza Dentaria en Clavija --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.piezaDentariaClavija.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={Clavija} alt="i" />
                    <span className="gx-link">
                        &nbsp; Pieza Dentaria en Clavija
                    </span>
                </div>
                {/* --- Pieza Dentaria en Clavija --- */}
                {/* --- Pieza Dentaria en Erupcion --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.piezaDentariaErupcion.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={Erupcion} alt="i" />
                    <span className="gx-link">
                        &nbsp; Pieza Dentaria en Erupción
                    </span>
                </div>
                {/* --- Pieza Dentaria en Erupcion --- */}
                {/* --- Pieza Dentaria Extruida --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.piezaDentariaExtruida.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={Extruida} alt="i" />
                    <span className="gx-link">
                        &nbsp; Pieza Dentaria Extruida
                    </span>
                </div>
                {/* --- Pieza Dentaria Extruida --- */}
                {/* --- Pieza Dentaria Intruida --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.piezaDentariaIntruida.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={Intruida} alt="i" />
                    <span className="gx-link">
                        &nbsp; Pieza Dentaria Intruida
                    </span>
                </div>
                {/* --- Pieza Dentaria Intruida --- */}
                {/* --- Pieza Dentaria Supernumeraria --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.piezaDentariaSupernumeraria.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={Supernumeraria} alt="i" />
                    <span className="gx-link">
                        &nbsp; Pieza Dentaria Supernumeraria
                    </span>
                </div>
                {/* --- Pieza Dentaria Supernumeraria --- */}
                {/* --- Posicion Dentaria --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <Menu.Item key="Posicion.Mesializado" onClick={() => menuSeleccionado({ hallazgo: opciones.posicionDentaria.hallazgo, tipo: opciones.posicionDentaria.tipo.M })}><b>M:</b> Mesializado</Menu.Item>
                                <Menu.Item key="Posicion.Distalizado" onClick={() => menuSeleccionado({ hallazgo: opciones.posicionDentaria.hallazgo, tipo: opciones.posicionDentaria.tipo.D })}><b>D:</b> Distalizado</Menu.Item>
                                <Menu.Item key="Posicion.Vetibularizado" onClick={() => menuSeleccionado({ hallazgo: opciones.posicionDentaria.hallazgo, tipo: opciones.posicionDentaria.tipo.V })}><b>V:</b> Vetibularizado</Menu.Item>
                                <Menu.Item key="Posicion.Palantinizado" onClick={() => menuSeleccionado({ hallazgo: opciones.posicionDentaria.hallazgo, tipo: opciones.posicionDentaria.tipo.P })}><b>P:</b> Palantinizado</Menu.Item>
                                <Menu.Item key="Posicion.Lingualizado" onClick={() => menuSeleccionado({ hallazgo: opciones.posicionDentaria.hallazgo, tipo: opciones.posicionDentaria.tipo.L })}><b>L:</b> Lingualizado</Menu.Item>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={Posicion} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Posicion Dentaria <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {/* --- Posicion Dentaria --- */}
                {/* --- Protesis Fija --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <Menu.Item key="ProtesisFija.BuenEstado" onClick={() => menuInicioFinSeleccionado({ hallazgo: opciones.protesisFija.hallazgo, estado: opciones.protesisFija.estado.bueno })}><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                <Menu.Item key="ProtesisFija.MalEstado" onClick={() => menuInicioFinSeleccionado({ hallazgo: opciones.protesisFija.hallazgo, estado: opciones.protesisFija.estado.malo })}><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={Fija} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Protesis Fija <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {/* --- Protesis Fija --- */}
                {/* --- Protesis Removible --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <Menu.Item key="ProtesisRemovible.BuenEstado" onClick={() => menuInicioFinSeleccionado({ hallazgo: opciones.protesisRemovible.hallazgo, estado: opciones.protesisRemovible.estado.bueno })}><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                <Menu.Item key="ProtesisRemovible.MalEstado" onClick={() => menuInicioFinSeleccionado({ hallazgo: opciones.protesisRemovible.hallazgo, estado: opciones.protesisRemovible.estado.malo })}><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={Removible} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Protesis Removible <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {/* --- Protesis Removible --- */}
                {/* --- Protesis Total --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <Menu.Item key="ProtesisTotal.BuenEstado" onClick={() => menuInicioFinSeleccionado({ hallazgo: opciones.protesisTotal.hallazgo, estado: opciones.protesisTotal.estado.bueno })}><i className="icon icon-thumb-up" /> Buen Estado</Menu.Item>
                                <Menu.Item key="ProtesisTotal.MalEstado" onClick={() => menuInicioFinSeleccionado({ hallazgo: opciones.protesisTotal.hallazgo, estado: opciones.protesisTotal.estado.malo })}><i className="icon icon-thumbs-down" /> Mal Estado</Menu.Item>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={Total} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Protesis Total <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {/* --- Protesis Total --- */}
            </div>,
        rT:
            <div>
                {/* --- Remanente Radicular --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.remanenteRadicular.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={Remanente} alt="i" />
                    <span className="gx-link">
                        &nbsp; Remanente Radicular
                    </span>
                </div>
                {/* --- Remanente Radicular --- */}
                {/* --- Restauración Definitiva --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <Menu.Item key="RestauracionDefinitiva.AM" onClick={() => menuSeleccionado({ hallazgo: opciones.restauracionDefinitiva.hallazgo, tipo: opciones.restauracionDefinitiva.tipo.AM })}><b>AM:</b> Amalgama Dental</Menu.Item>
                                <Menu.Item key="RestauracionDefinitiva.R" onClick={() => menuSeleccionado({ hallazgo: opciones.restauracionDefinitiva.hallazgo, tipo: opciones.restauracionDefinitiva.tipo.R })}><b>R:</b> Resina</Menu.Item>
                                <Menu.Item key="RestauracionDefinitiva.IV" onClick={() => menuSeleccionado({ hallazgo: opciones.restauracionDefinitiva.hallazgo, tipo: opciones.restauracionDefinitiva.tipo.IV })}><b>IV:</b> Ionómero de Vidrio</Menu.Item>
                                <Menu.Item key="RestauracionDefinitiva.IM" onClick={() => menuSeleccionado({ hallazgo: opciones.restauracionDefinitiva.hallazgo, tipo: opciones.restauracionDefinitiva.tipo.IM })}><b>IM:</b> Incrustación Metálica</Menu.Item>
                                <Menu.Item key="RestauracionDefinitiva.IE" onClick={() => menuSeleccionado({ hallazgo: opciones.restauracionDefinitiva.hallazgo, tipo: opciones.restauracionDefinitiva.tipo.IE })}><b>IE:</b> Incrustación Estética</Menu.Item>
                                <Menu.Item key="RestauracionDefinitiva.C" onClick={() => menuSeleccionado({ hallazgo: opciones.restauracionDefinitiva.hallazgo, tipo: opciones.restauracionDefinitiva.tipo.C })}><b>C:</b> Carilla Estética</Menu.Item>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={Definitiva} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Restauración Definitiva <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {/* --- Restauración Definitiva --- */}
                {/* --- Restauración Temporal --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.restauracionTemporal.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={Temporal} alt="i" />
                    <span className="gx-link">
                        &nbsp; Restauración Temporal
                    </span>
                </div>
                {/* --- Restauración Temporal --- */}
                {/* --- Sellantes --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.sellantes.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={Sellantes} alt="i" />
                    <span className="gx-link">
                        &nbsp; Sellantes
                    </span>
                </div>
                {/* --- Sellantes --- */}
                {/* --- Superficie Desgastada --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.superficieDesgastada.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={Posicion} alt="i" />
                    <span className="gx-link">
                        &nbsp; Superficie Desgastada
                    </span>
                </div>
                {/* --- Superficie Desgastada --- */}
                {/* --- Transposicion --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }} onClick={() => menuSeleccionado({ hallazgo: opciones.transposicion.hallazgo, tipo: '' })}>
                    <img className="gx-size-15" src={Transposicion} alt="i" />
                    <span className="gx-link">
                        &nbsp; Transposición
                    </span>
                </div>
                {/* --- Transposicion --- */}
                {/* --- Tratamiendo Pulpar --- */}
                <div style={{ display: 'block', paddingBottom: '15px' }}>
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <Menu>
                                <SubMenu key="TratamiendoPulpar.Conductos" title={<span><b>TC:</b> Tratamiendo de conductos</span>}>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.tratamientoPulpar.hallazgo, tipo: opciones.tratamientoPulpar.tipo.TC, estado: opciones.tratamientoPulpar.estado.bueno })} key="TratamiendoPulpar.Conductos.BuenEstado" ><i className="icon icon-thumb-up" />Buen Estado</Menu.Item>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.tratamientoPulpar.hallazgo, tipo: opciones.tratamientoPulpar.tipo.TC, estado: opciones.tratamientoPulpar.estado.malo })} key="TratamiendoPulpar.Conductos.MalEstado" ><i className="icon icon-thumbs-down" />Mal Estado</Menu.Item>
                                </SubMenu>
                                <SubMenu key="TratamiendoPulpar.Pulpectomia" title={<span><b>PC:</b> Pulpectomía</span>}>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.tratamientoPulpar.hallazgo, tipo: opciones.tratamientoPulpar.tipo.PC, estado: opciones.tratamientoPulpar.estado.bueno })} key="TratamiendoPulpar.Pulpectomia.BuenEstado" ><i className="icon icon-thumb-up" />Buen Estado</Menu.Item>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.tratamientoPulpar.hallazgo, tipo: opciones.tratamientoPulpar.tipo.PC, estado: opciones.tratamientoPulpar.estado.malo })} key="TratamiendoPulpar.Pulpectomia.MalEstado" ><i className="icon icon-thumbs-down" />Mal Estado</Menu.Item>
                                </SubMenu>
                                <SubMenu key="TratamiendoPulpar.Pulpotomia" title={<span><b>PP:</b> Pulpotomía</span>}>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.tratamientoPulpar.hallazgo, tipo: opciones.tratamientoPulpar.tipo.PP, estado: opciones.tratamientoPulpar.estado.bueno })} key="TratamiendoPulpar.Pulpotomia.BuenEstado" ><i className="icon icon-thumb-up" />Buen Estado</Menu.Item>
                                    <Menu.Item onClick={() => menuSeleccionado({ hallazgo: opciones.tratamientoPulpar.hallazgo, tipo: opciones.tratamientoPulpar.tipo.PP, estado: opciones.tratamientoPulpar.estado.malo })} key="TratamiendoPulpar.Pulpotomia.MalEstado" ><i className="icon icon-thumbs-down" />Mal Estado</Menu.Item>
                                </SubMenu>
                            </Menu>
                        }>
                        <div>
                            <img className="gx-size-15" src={Pulpar} alt="i" />
                            <span className="gx-link ant-dropdown-link">
                                &nbsp; Tratamiendo Pulpar <DownOutlined />
                            </span>
                        </div>
                    </Dropdown>
                </div>
                {/* --- Tratamiendo Pulpar --- */}
            </div >,
        detalle:
            <div style={{ margin: '0 24px 0 24px' }}>
                <h4 style={{ marginLeft: '-20px' }}>Detalle</h4>
                <Form.Item
                    name='detalle'
                >
                    <Input.TextArea
                        rows={4}
                        placeholder='Ingrese los detalle'
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        className="gx-btn-success"
                        style={{
                          background: themeSettingsGlobal.COD_COLOR_1,
                          color: '#fff'
                        }}
                    >
                        Guardar Detalle
                    </Button>
                </Form.Item>
            </div>,
    };

    return (

        <div>
            <div>
                <Col lg={24} md={24} sm={24} xs={24} >
                    <Form.Item style={{ display: 'block', marginTop: '30px' }}>
                        <Button
                            onClick={async () => {
                                fff();
                            }}
                            className="gx-btn-success"
                            style={{
                              background: themeSettingsGlobal.COD_COLOR_1,
                              color: '#fff'
                            }}
                            size="large"
                            block
                        >
                            Capturar Odont.
                        </Button>
                    </Form.Item>
                    {/* Boton Objeto seleccionado */}
                    <div style={{ marginTop: '-10px' }}>
                        {
                            opcion.hallazgo
                                ? <Row style={{ justifyContent: 'space-between' }}>
                                    <Col lg={19} md={19} sm={19} xs={19} >
                                        <Form.Item style={{ display: 'block' }}>
                                            {/* <div style={{ textAlign: 'center' }}>
                                                <Badge
                                                    style={{ fontSize: '13px' }}
                                                    count={opcion ? `${opcion.hallazgo} Seleccionado` : ''} />
                                            </div> */}
                                            <Button block>
                                                <span>{opcion ? `${opcion.hallazgo} ` : ''}</span>
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                    <Col lg={4} md={4} sm={4} xs={4}>
                                        <Form.Item style={{ display: 'block' }}>
                                            <Button
                                                icon={<DeleteOutlined />}
                                                className="gx-btn-danger"
                                                style={{
                                                  background: themeSettingsGlobal.COD_COLOR_1,
                                                  color: '#fff'
                                                }}
                                                block
                                                onClick={() => dispatch(quitar_seleccion())}
                                            >
                                            </Button>

                                        </Form.Item>

                                    </Col>
                                </Row>


                                : <div></div>
                        }
                    </div>


                    <Card
                        tabProps={{
                            tabBarStyle: {/*
                                backgroundColor: 'blue', */
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            },

                        }}
                        headStyle={{/*
                            backgroundColor: 'red', */
                            width: '100%'
                        }}

                        tabList={tabListNoTitle}
                        onTabChange={(key) => {
                            onTabChange(key, 'noTitleKey');
                        }}
                    >
                        {contentListNoTitle[state.noTitleKey]}
                    </Card>
                    {
                        // (!seleccion)
                        //     ? <Form.Item style={{ display: 'block' }}>
                        //         <Button
                        //             //className="gx-mb-0"
                        //             //type="link"
                        //             block
                        //         /*  onClick={() => setSeleccionado(!seleccionado)} */
                        //         >
                        //             Seleccione
                        //         </Button>
                        //     </Form.Item>
                        //     : <Form.Item style={{ display: 'block' }}>
                        //         <Button
                        //             className="gx-mb-0"
                        //             type="primary"
                        //             block
                        //             onClick={() => dispatch(quitar_seleccion())}
                        //         >
                        //             Quitar Selección
                        //         </Button>
                        //     </Form.Item>
                    }

                </Col>
                {

                    <ModalCaptura setImagen={setImagen} imagen={imagen} modalCapturar={imagen !== null ? true : false} setModalCapturar={setModalCapturar} />

                }
            </div>
        </div>

    );
}

export default MenuOdonto;
