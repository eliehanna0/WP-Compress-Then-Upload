import React, { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Grid,
	IconButton,
	Slider,
	TextField,
	Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const Settings = (props) => {
	const [settings, setSettings] = useState(window.wpctu_ajax.settings);
	const [showSettings, setShowSettings] = useState(false);

	const handleChange = (event) => {
		const newSettings = {
			...settings,
			[event.target.name]: event.target.value,
		};
		setSettings(newSettings);
	};

	const updateSettings = () => {
		props.onUpdate(settings);
	};

	const handleSliderChange = (event, newValue) => {
		const newSettings = {
			...settings,
			quality: newValue,
		};
		setSettings(newSettings);
	};

	const toggleSettings = () => {
		setShowSettings(!showSettings);
	};

	useEffect(() => {
		updateSettings(settings);
	}, []);

	return (
		<section className="container">
			<Grid container>
				<Typography onClick={toggleSettings} variant="h6" gutterBottom>
					Settings
					<IconButton
						style={{ marginLeft: '.5em' }}
						color="primary"
						variant="contained"
						size="small"
					>
						{!showSettings && <AddIcon fontSize="large" />}
						{showSettings && <RemoveIcon fontSize="large" />}
					</IconButton>
				</Typography>
			</Grid>
			{showSettings && (
				<form
					xs={12}
					className="wpctu_settings_form"
					noValidate
					autoComplete="off"
				>
					<Grid container justifyContent="flex-start" spacing={3}>
						<Grid item xs={3}>
							<TextField
								fullWidth
								label="Max Width"
								type="number"
								InputLabelProps={{
									shrink: true,
								}}
								value={settings.max_width}
								name="max_width"
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={3}>
							<TextField
								fullWidth
								label="Max Height"
								type="number"
								InputLabelProps={{
									shrink: true,
								}}
								value={settings.max_height}
								name="max_height"
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={4}>
							<Box textAlign="left">
								<Typography
									gutterBottom
									style={{ marginBottom: '0.55em' }}
								>
									Quality
								</Typography>
							</Box>
							<Grid container spacing={2} alignItems="center">
								<Grid item xs>
									<Slider
										value={settings.quality}
										onChange={handleSliderChange}
										valueLabelDisplay="auto"
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={2}>
							<Button
								color="primary"
								variant="contained"
								onClick={updateSettings}
							>
								Apply
							</Button>
						</Grid>
					</Grid>
				</form>
			)}
			{/*{JSON.stringify(settings)}*/}
			{showSettings && (
				<Grid container>
					<Typography gutterBottom></Typography>
				</Grid>
			)}
		</section>
	);
};

export default Settings;
