import React, { useState, useEffect } from 'react';
import '../App.css';
import Resizer from 'react-image-file-resizer';
import { useDropzone } from 'react-dropzone';
import Thumbs from './thumbs';

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
		const url = { url: imageUrl };

		setFiles(
			acceptedfiles.map((file) =>
				file.name === name ? Object.assign(file, url) : file
			)
		);
	};

	const resizeImages = (acceptedFiles) => {
		//Todo: show proper message for rejected files and test them
		console.log(acceptedFiles);
		clearImages();

		for (const file of acceptedFiles) {
			try {
				Resizer.imageFileResizer(
					file,
					300,
					300,
					'JPEG',
					100,
					0,
					(uri) => {
						setImageURL(acceptedFiles, uri, file.name);
					},
					'blob'
				);
			} catch (err) {
				console.log(err);
			}
		}
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
		</section>
	);
}

export default DropZone;
