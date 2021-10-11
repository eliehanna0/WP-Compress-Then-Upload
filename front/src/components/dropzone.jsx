import React, { useState, useEffect } from 'react';
import '../App.css';
import Resizer from 'react-image-file-resizer';
import { useDropzone } from 'react-dropzone';
import Thumbs from './thumbs';
import Api from '../services/api';

function DropZone(props) {
	const [files, setFiles] = useState([]);
	const [status, setStatus] = useState('idle');
	const maxFiles = 8;
	const maxSize = 50000000;

	const { getRootProps, getInputProps, open, fileRejections } = useDropzone({
		accept: 'image/jpeg, image/png',
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

	const allFilesDone = (allFilesDone) => {
		console.log('checking if files are done');
		for (const file of allFilesDone) {
			if (file.status === 'uploading') {
				return false;
			}
		}
		setStatus('idle');
	};

	const resizeImages = (acceptedFiles) => {
		//Todo: lock further upload of files
		clearImages();

		for (const file of acceptedFiles) {
			try {
				console.log('processing : ', file);
				Resizer.imageFileResizer(
					file,
					1024,
					1024,
					'JPEG',
					80,
					0,
					(uri) => {
						resizeCallback(acceptedFiles, uri, file.name);
					},
					'blob'
				);
			} catch (err) {
				console.log(err);
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
				const status = response.status === 200 ? 'done' : 'error';
				setFiles(
					updateFileByName(currentFiles, name, 'status', status)
				);

				allFilesDone(currentFiles);
			})
			.catch(() => {
				updateFileByName(currentFiles, name, 'status', 'error');
			});
	};

	return (
		<section className="container">
			<div {...getRootProps({ className: 'dropzone' })}>
				<Thumbs files={files} />

				<input {...getInputProps()} />
				{/*TODO: conditionally show this message below*/}
				{!files.length && <p>Drag images to upload </p>}
			</div>
			<small>
				(max {maxFiles} images at a time and max {maxSize / 1000000}MB
				per image)
			</small>
			<p>
				<a
					className="btn btn-success"
					// disabled={!selectedFiles}
					onClick={open}
				>
					Upload
				</a>
			</p>
			{fileRejectionItems.length > 0 && (
				<div style={{ textAlign: 'left' }}>
					<h4>Error list</h4>
					<ul>{fileRejectionItems}</ul>
				</div>
			)}
		</section>
	);
}

export default DropZone;
