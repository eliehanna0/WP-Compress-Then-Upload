import http from './http';

class Api {
	upload(file, onUploadProgress) {
		const formData = new FormData();

		formData.append('file', file.file, file.name);

		return http.post('/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'X-WP-Nonce': window.wpctu_ajax.nonce,
			},
			onUploadProgress,
		});
	}
}

export default new Api();
