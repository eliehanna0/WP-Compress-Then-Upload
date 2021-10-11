import React, { useState, useEffect } from 'react';
import '../App.css';
import Resizer from 'react-image-file-resizer';
import { useDropzone } from 'react-dropzone';
import Thumbs from './thumbs';
import Api from '../services/api';

function DropZone(props) {
	const [files, setFiles] = useState([]);

	const { getRootProps, getInputProps } = useDropzone({
		accept: 'image/jpeg, image/png',
		maxFiles: 6,
		onDrop: (acceptedFiles) => {
			resizeImages(acceptedFiles);
		},
	});

	const clearImages = () => {
		// Make sure to revoke the data uris to avoid memory leaks
		files.forEach((file) => URL.revokeObjectURL(file.url));
	};

	const setImageURL = (acceptedfiles, uri, name) => {
		console.log('done resizing image', uri);
		const urlCreator = window.URL || window.webkitURL;
		const imageUrl = urlCreator.createObjectURL(uri);
		console.log(imageUrl);

		//I think I need to get the index of the current file in files
		// send name too?

		return updateFileByName(acceptedfiles, name, 'url', imageUrl);
	};

	const updateFileByName = (fileList, name, key, value) => {
		const fileIndex = fileList.findIndex((file) => file.name === name);
		//need to create method to update a single file

		console.log('file index by: ', name, fileList, fileIndex);

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

	const resizeImages = (acceptedFiles) => {
		//Todo: show proper message for rejected files and test them
		//Todo: lock further upload of files
		console.log(acceptedFiles);
		clearImages();

		for (const file of acceptedFiles) {
			try {
				Resizer.imageFileResizer(
					file,
					3000,
					3000,
					'JPEG',
					100,
					90,
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

	/**
	 * Todo: Maybe I should process file by file?
	 *
	 * @param  currentFiles
	 * @param  name
	 * @param  file
	 */
	const uploadFile = (currentFiles, name, file) => {
		Api.upload(file, (event) => {
			const progress = Math.round((100 * event.loaded) / event.total);
			setFiles(
				updateFileByName(currentFiles, name, 'progress', progress)
			);
		})
			.then((response) => {
				console.log(response.data);
				setFiles(
					updateFileByName(currentFiles, name, 'status', 'done')
				);
			})
			.catch(() => {
				console.log('Could not upload the file!');
			});
	};

	return (
		<section className="container">
			<div {...getRootProps({ className: 'dropzone' })}>
				<Thumbs files={files} />
				<p>{JSON.stringify(files)}</p>

				<input {...getInputProps()} />
				{/*TODO: conditionally show this message below*/}
				<p>Drag images to upload...</p>
			</div>
			<p>
				<br />
			</p>
		</section>
	);
}

export default DropZone;
