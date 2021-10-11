import axios from 'axios';

export default axios.create({
	baseURL: window.wpctu_ajax.urls.baseURL,
	headers: {
		'Content-type': 'application/json',
	},
});
