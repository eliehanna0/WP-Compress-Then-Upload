import React from 'react';
import './App.scss';
import WPCTU from './components/WPCTU.jsx';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
	palette: {
		primary: {
			main: '#1976d2',
		},
		secondary: {
			main: '#dc004e',
		},
	},
	typography: {
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
		].join(','),
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
					'&:hover': {
						boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
					},
				},
			},
		},
	},
});

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<div className="App">
				<WPCTU />
			</div>
		</ThemeProvider>
	);
};

export default App;
