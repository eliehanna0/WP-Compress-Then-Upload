/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Api from '../services/api.jsx';
import {
	Box,
	Button,
	Grid,

	Slider,
	TextField,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Stack,
	Alert,
	CircularProgress,
	Snackbar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';




const Settings = (props) => {
	const [settings, setSettings] = useState(window.wpctu_ajax.settings);
	const [expanded, setExpanded] = useState(false);
	const [loading, setLoading] = useState(false);
	const [modified, setModified] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const resetStates = () => {
		setSuccess(false);
		setModified(true);
		setError(false);
	};

	const handleChange = (event) => {
		const newSettings = {
			...settings,
			[event.target.name]: event.target.value,
		};
		setSettings(newSettings);
		resetStates();
	};


	const handleSliderChange = (event, newValue) => {
		const newSettings = {
			...settings,
			quality: newValue,
		};
		setSettings(newSettings);
		resetStates();
	};

	const updateSettings = () => {
		setLoading(true);
		setModified(false);
		Api.updateSettings(settings)
			.then(() => {
				props.onUpdate(settings);
				setSuccess(true);
				setModified(false);
			})
			.catch((responseError) => {
				setError(responseError.response.data.message);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleAccordionChange = (event, isExpanded) => {
		setExpanded(isExpanded);
	};

	useEffect(() => {
		props.onUpdate(settings);
	}, []);

	return (
		<Box>
			<Accordion
				expanded={expanded}
				onChange={handleAccordionChange}
				sx={{
					'&:before': { display: 'none' },
					boxShadow: 'none',
					border: '1px solid',
					borderColor: 'divider'
				}}
			>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					sx={{
						'&:hover': { bgcolor: 'action.hover' },
						cursor: 'pointer'
					}}
				>
					<Stack direction="row" spacing={1} alignItems="center">
						<SettingsIcon color="primary" />
						<Typography variant="h6">Compression Settings</Typography>
					</Stack>
				</AccordionSummary>
				<AccordionDetails>
					<Stack >


						<Grid container sx={{ gap: 2, flexWrap: 'nowrap' }}>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									variant="outlined"
									label="Max Width (px)"
									type="number"
									value={settings.max_width}
									name="max_width"
									onChange={handleChange}
									helperText="Maximum image width"
									InputProps={{
										inputProps: { min: 0 }
									}}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									variant="outlined"
									label="Max Height (px)"
									type="number"
									value={settings.max_height}
									name="max_height"
									onChange={handleChange}
									helperText="Maximum image height"
									InputProps={{
										inputProps: { min: 0 }
									}}
								/>
							</Grid>
						</Grid>

						<Box sx={{ pt: 2 }}>
							<Typography variant="subtitle1" gutterBottom>
								Quality: {settings.quality}%
							</Typography>
							<Slider
								value={settings.quality}
								onChange={handleSliderChange}
								valueLabelDisplay="auto"
								min={1}
								max={100}
								marks={[
									{ value: 1, label: '1%' },
									{ value: 50, label: '50%' },
									{ value: 100, label: '100%' }
								]}
								sx={{
									'& .MuiSlider-markLabel': {
										color: 'text.secondary'
									}
								}}
							/>
							<Typography variant="caption" color="text.secondary">
								Lower values = smaller file size, lower quality
							</Typography>
						</Box>

						<Box sx={{ pt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
							{(modified || loading) && (
								<Button
									color="primary"
									variant="contained"
									onClick={updateSettings}
									startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
									disabled={loading || !modified}
								>
									{loading ? 'Saving...' : 'Save Settings'}
								</Button>
							)}
							{success && (
								<Button
									variant="outlined"
									color="success"
									startIcon={<CheckIcon />}
									disabled
								>
									Saved
								</Button>
							)}
						</Box>

					</Stack>
				</AccordionDetails>
			</Accordion>

			<Snackbar
				open={!!error}
				autoHideDuration={6000}
				onClose={() => setError('')}
			>
				<Alert severity="error" onClose={() => setError('')}>
					Settings could not be updated — {error}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default Settings;
