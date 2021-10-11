import http from './http';

class Api {
	upload(file, onUploadProgress) {
		const formData = new FormData();

		formData.append('file', file);

		return http.post('/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			onUploadProgress,
		});
	}
}

export default new Api();
