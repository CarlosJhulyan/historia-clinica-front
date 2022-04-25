import React, { useCallback, useEffect, useState } from 'react';
import { Select, Tabs } from 'antd';
import Antecedentes from './antecedentes';
import Generales from '../antecedentes/generales';
import Fisiologicos from './fisiologicos';
import Ginecologicos from './ginecologicos';
import Patologicos from './patologicos';
import PatologicosFamiliares from './patologicosFamiliares';
import { useDispatch, useSelector } from 'react-redux';
import { setFisiologicosInmunizaciones, setFisiologicosOtrosInmunizaciones, setFisiologicosOtrosPrenatales, setFisiologicosParto, setFisiologicosPrenatales, setHabitosNocivos } from '../../../../appRedux/actions/menu/antecedentes';

const AntecedentesModal = () => {
	const dispatch = useDispatch();
	const prenatales = useSelector((state) => state.combosReducer.prenatales);
	const parto = useSelector((state) => state.combosReducer.parto);
	const inmunizaciones = useSelector((state) => state.combosReducer.inmunizaciones);
	const filtroFisiologicos = useSelector((state) => state.fisiologicosReducer);
	const habitosNocivos = useSelector(state => state.combosReducer.habitosNocivos);
	const TabPane = Tabs.TabPane;

	if (filtroFisiologicos.length > 0 && prenatales.length > 0 && parto.length > 0 && inmunizaciones.length > 0) {
		const fisioPrenatales = filtroFisiologicos.filter(
			f => prenatales.find(c => c.CODIGO === f.COD_TIPO_FISIO)
		);

		const fisioParto = filtroFisiologicos.filter(
			f => parto.find(c => c.CODIGO === f.COD_TIPO_FISIO)
		);
		const fisioInmunizaciones = filtroFisiologicos.filter(
			f => inmunizaciones.find(c => c.CODIGO === f.COD_TIPO_FISIO)
		);

		dispatch(setFisiologicosPrenatales(fisioPrenatales.map(f => {
			if (f.COD_TIPO_FISIO === '214') {
				dispatch(setFisiologicosOtrosPrenatales(f.DESC_FISIO));
			}
			return f.COD_TIPO_FISIO;
		})));


		dispatch(setFisiologicosInmunizaciones(fisioInmunizaciones.map(f => {
			if (f.COD_TIPO_FISIO === '341') {
				dispatch(setFisiologicosOtrosInmunizaciones(f.DESC_FISIO));
			}
			return f.COD_TIPO_FISIO;
		})));

		if (fisioParto.length > 0) {
			dispatch(setFisiologicosParto(fisioParto[0].COD_TIPO_FISIO));
		}
	}

	if (filtroFisiologicos.length > 0 && habitosNocivos.length > 0) {
		const fisioHabitosNocivos = filtroFisiologicos.filter(
			f => habitosNocivos.find(c => c.CODIGO === f.COD_TIPO_FISIO)
		);
		dispatch(setHabitosNocivos(fisioHabitosNocivos.map(f => f.COD_TIPO_FISIO)));
	}


	return (
		<Tabs type="card" style={{ marginTop: 8 }}>
			<TabPane tab="Generales" key="1">
				<Generales habitosNocivos={habitosNocivos} />
			</TabPane>
			<TabPane tab="Fisiológicos" key="2">
				<Fisiologicos parto={parto} prenatales={prenatales} inmunizaciones={inmunizaciones} />
			</TabPane>
			<TabPane tab="Ginegológicos" key="3">
				<Ginecologicos />
			</TabPane>
			<TabPane tab="Patológicos" key="4">
				<Patologicos />
				<PatologicosFamiliares />
			</TabPane>
			<TabPane tab="Otros" key="5">
				<Antecedentes />
			</TabPane>
		</Tabs>
	);
};
export default AntecedentesModal;
