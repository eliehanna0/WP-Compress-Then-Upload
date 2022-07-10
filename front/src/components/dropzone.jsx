import React, { useState } from 'react';
import '../App.css';
import Resizer from 'react-image-file-resizer';
import { useDropzone } from 'react-dropzone';
import Thumbs from './thumbs.jsx';
import Api from '../services/api.jsx';
import Settings from './settings.jsx';
import { Box, Button, Typography } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

function DropZone() {
	const [files, setFiles] = useState([]);
	const [status, setStatus] = useState('idle');
	const [errorMessage, setErrorMessage] = useState('');
	const validCompressionFormats = ['JPEG', 'PNG', 'WEBP'];
	const maxFiles = 50;
	const maxSize = 100000000; // 1000000 = 1MB
	const [settings, setSettings] = useState();

	const { getRootProps, getInputProps, open, fileRejections } = useDropzone({
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
		<section className="container">
			{/*{JSON.stringify(settings)}*/}
			<Box textAlign="left">
				<Typography variant="h5" gutterBottom>
					Compress Then Upload Images
				</Typography>
			</Box>
			<div {...getRootProps({ className: 'dropzone' })}>
				<Thumbs files={files} />

				<input {...getInputProps()} />
				{!files.length && <p>Drag images to upload </p>}
			</div>
			<Typography
				variant="caption"
				display="block"
				gutterBottom
				style={{ opacity: 0.6 }}
			>
				(max {maxFiles} images at a time and max {maxSize / 1000000}MB
				per image)
			</Typography>
			<p>
				<Button variant="contained" onClick={open} color="primary">
					Upload Images
				</Button>
			</p>
			{(fileRejectionItems.length > 0 || errorMessage) && (
				<Alert style={{ textAlign: 'left' }} severity="error">
					<AlertTitle>Error</AlertTitle>
					<strong>{errorMessage}</strong>
					<ul>{fileRejectionItems}</ul>
				</Alert>
			)}

			<Settings onUpdate={updateSettings} />
		</section>
	);
}

export default DropZone;
