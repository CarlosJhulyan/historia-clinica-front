import React, { 
	useEffect, 
	useState 
} from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import 'assets/vendors/style';
import 'styles/wieldy.less';

import store, { history } from './appRedux/store';
import App from './containers/App/index';
import { AuthProvider } from './authentication';
import firebase from 'firebase/app';
import { tipoAnexo } from './routes/listaPaciente/datosPaciente/apis';

const NextApp = () => {
	const firebaseConfig = {
		apiKey: 'AIzaSyALYkzNUUfIwfWS-WvVnJ4ScnJAA3sDRPQ',
		authDomain: 'telemedicinacallme.firebaseapp.com',
		projectId: 'telemedicinacallme',
		storageBucket: 'telemedicinacallme.appspot.com',
		messagingSenderId: '698990305597',
		appId: '1:698990305597:web:aa496971e7f465239a2554',
	};

	const [initialFirestore, setInitialFirestore] = useState(null);
	const [estado, setEstado] = useState(null);

	const iniciar = async () => {
		const estado = await tipoAnexo();
		setEstado(estado);
	};

	// Initialize Firebase
	useEffect(() => {
		if (initialFirestore === null) {
			const abc = firebase.initializeApp(firebaseConfig);
			setInitialFirestore(abc);
		}

		iniciar();
	}, []);

	return estado === null ? (
		<div></div>
	) : (
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<AuthProvider>
					<Switch>
						<Route path="/" component={App} />
					</Switch>
				</AuthProvider>
			</ConnectedRouter>
		</Provider>
	);
};

export default NextApp;
