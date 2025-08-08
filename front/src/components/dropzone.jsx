import React, { useState } from 'react';
import '../App.scss';
import Resizer from 'react-image-file-resizer';
import { useDropzone } from 'react-dropzone';
import Thumbs from './thumbs.jsx';
import Api from '../services/api.jsx';
import Settings from './settings.jsx';
import {
	Box,
	Button,
	Typography,
	Alert,
	AlertTitle,
	Paper,
	Container,
	Stack,
	Divider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function DropZone() {
	const [files, setFiles] = useState([]);
	const [status, setStatus] = useState('idle');
	const [errorMessage, setErrorMessage] = useState('');
	const validCompressionFormats = ['JPEG', 'PNG', 'WEBP'];
	const maxFiles = 50;
	const maxSize = 100000000; // 1000000 = 1MB
	const [settings, setSettings] = useState();

	const { getRootProps, getInputProps, open, fileRejections, isDragActive } = useDropzone({
		accept: 'image/jpeg, image/png, image/webp',
		maxFiles,
		maxSize, //50mb limit,

		onDrop: (acceptedFiles) => {
			if (status === 'uploading') {
				alert('Wait until your current images upload');
				return false;
			}
			setFiles(acceptedFiles);
			setStatus('uploading');

			resizeImages(acceptedFiles);
		},
	});

	const fileRejectionItems = fileRejections.map(({ file, errors }) => (
		<li key={file.path}>
			{file.path} - {(file.size / 1000000).toFixed(2)} MB
			<ul>
				{errors.map((e) => (
					<li key={e.code}>{e.message}</li>
				))}
			</ul>
		</li>
	));
	const clearImages = () => {
		// Make sure to revoke the data uris to avoid memory leaks
		files.forEach((file) => URL.revokeObjectURL(file.url));
	};

	const setImageURL = (acceptedfiles, uri, name) => {
		const urlCreator = window.URL || window.webkitURL;
		const imageUrl = urlCreator.createObjectURL(uri);
		return updateFileByName(acceptedfiles, name, 'url', imageUrl);
	};

	const updateFileByName = (fileList, name, key, value) => {
		const fileIndex = fileList.findIndex((file) => file.name === name);

		const newFiles = [...fileList];
		newFiles[fileIndex][key] = value;

		return newFiles;
	};

	const resizeCallback = (currentFiles, uri, name) => {
		/**
		 * I'm pretty sure there must be a cleaner way to do this
		 */

		setErrorMessage('');
		currentFiles = setImageURL(currentFiles, uri, name);
		currentFiles = updateFileByName(
			currentFiles,
			name,
			'status',
			'uploading'
		);
		setFiles(currentFiles);

		uploadFile(currentFiles, name, uri);
	};

	const allFilesDone = (filesDone) => {
		for (const file of filesDone) {
			if (file.status === 'uploading') {
				return false;
			}
		}
		setStatus('idle');
	};

	const getFileFormat = (file) => {
		const fileFormat = file.type.split('/')[1].toUpperCase();

		return validCompressionFormats.includes(fileFormat)
			? fileFormat
			: 'JPEG';
	};

	const resizeImages = (acceptedFiles) => {
		//Todo: lock further upload of files
		clearImages();
		for (const file of acceptedFiles) {
			try {
				Resizer.imageFileResizer(
					file,
					settings.max_width,
					settings.max_height,
					getFileFormat(file),
					settings.quality,
					0,
					(uri) => {
						resizeCallback(acceptedFiles, uri, file.name);
					},
					'blob'
				);
			} catch (err) {
				setErrorMessage(err);
			}
		}
	};

	const uploadFile = (currentFiles, name, file) => {
		Api.upload({ file, name }, (event) => {
			const progress = Math.round((100 * event.loaded) / event.total);
			setFiles(
				updateFileByName(currentFiles, name, 'progress', progress)
			);
		})
			.then((response) => {
				const responseStatus =
					response.status === 200 ? 'done' : 'error';
				setFiles(
					updateFileByName(
						currentFiles,
						name,
						'status',
						responseStatus
					)
				);

				allFilesDone(currentFiles);
			})
			.catch(() => {
				updateFileByName(currentFiles, name, 'status', 'error');
			});
	};

	const updateSettings = (newSettings) => {
		setSettings(newSettings);
	};



	


	return (
		<Container maxWidth="md" sx={{ py: 3 }}>
			<Stack spacing={3}>
				<Box>
					<Typography variant="h4" component="h1" gutterBottom>
						Compress & Upload Images
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Upload and compress your images before they&apos;re saved to your WordPress media library
					</Typography>
				</Box>

				<Paper
					{...getRootProps()}
					sx={{
						border: '2px dashed',
						borderColor: isDragActive ? 'primary.main' : 'grey.300',
						bgcolor: isDragActive ? 'primary.50' : 'grey.50',
						p: 4,
						textAlign: 'center',
						cursor: 'pointer',
						transition: 'all 0.2s ease-in-out',
						'&:hover': {
							borderColor: 'primary.main',
							bgcolor: 'primary.50',
						}
					}}
				>
					<input {...getInputProps()} />
					<Stack spacing={2} alignItems="center">
						<CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
						{!files.length && (
							<Box>
								<Typography variant="h6" gutterBottom>
									{isDragActive ? 'Drop images here' : 'Drag & drop images here'}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									or click to browse files
								</Typography>
							</Box>
						)}
					</Stack>
				</Paper>

				{files.length > 0 && (
					<Box>
						<Thumbs files={files} />
					</Box>
				)}

				<Box textAlign="center">
					<Button
						variant="contained"
						onClick={open}
						size="large"
						startIcon={<CloudUploadIcon />}
						disabled={status === 'uploading'}
					>
						{status === 'uploading' ? 'Uploading...' : 'Select Images'}
					</Button>
					<Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.7 }}>
						Max {maxFiles} images at a time • Max {(maxSize / 1000000)}MB per image
					</Typography>
				</Box>

				{(fileRejectionItems.length > 0 || errorMessage) && (
					<Alert severity="error">
						<AlertTitle>Upload Error</AlertTitle>
						{errorMessage && <Box mb={1}>{errorMessage}</Box>}
						{fileRejectionItems.length > 0 && (
							<Box component="ul" sx={{ m: 0, pl: 2 }}>
								{fileRejectionItems}
							</Box>
						)}
					</Alert>
				)}

				<Divider />
				<Settings onUpdate={updateSettings} />
			</Stack>
		</Container>
	);
}

export default DropZone;
