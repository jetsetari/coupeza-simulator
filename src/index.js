import React from 'react';
import ReactDOM from 'react-dom/client';

import { store } from './data/redux/store';
import { Provider } from 'react-redux';

import './assets/css/reset.scss';
import Home from './pages/Home';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<Home />
		</Provider>
	</React.StrictMode>
);