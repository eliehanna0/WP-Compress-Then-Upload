import React, { Component } from 'react';
import DropZone from './dropzone';

class ImageUploader extends Component {
	render() {
		return (
			<div className="App">
				<DropZone />
			</div>
		);
	}
}

export default ImageUploader;
