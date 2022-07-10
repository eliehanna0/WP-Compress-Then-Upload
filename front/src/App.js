import React from 'react';
import './App.css';
import WPCTU from './components/WPCTU.jsx';
import { CssBaseline } from '@material-ui/core/';

const App = () => {
	return (
		<React.Fragment>
			<CssBaseline />
			<div className="App">
				<WPCTU />
			</div>
		</React.Fragment>
	);
};

export default App;
