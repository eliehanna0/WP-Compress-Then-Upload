import http from './http.jsx';

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

	updateSettings(data) {
		return http.put('/settings', data, {
			headers: {
				'X-WP-Nonce': window.wpctu_ajax.nonce,
			},
		});
	}
}

export default new Api();
