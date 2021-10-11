import axios from 'axios';

export default axios.create({
	baseURL: 'http://localhost:10004/wp-json/wpctu-api/v1',
	headers: {
		'Content-type': 'application/json',
	},
});
