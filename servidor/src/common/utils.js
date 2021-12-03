const config = require('./config.js');
const request = require('postman-request');
const logger = require('./logger.js');

exports.uploadImage = (buffer, callback) => {
	const url = `${config.imageServer}?key=${config.imageBBKey}`;
	const binstr = Array.prototype.map.call(buffer, (ch) => {
		return String.fromCharCode(ch);
	}).join('');
	const image = btoa(binstr);
	logger.info({
		message: 'Subiendo imagen a imgBB',
		image: image,
	});
	const options = {
		url: url,
		json: true,
		formData: {
			image: image,
		},
	};
	request.post(options, (error, response) => {
		if (error) {
			logger.error({
				message: `Error insertando imagen: ${error}`,
				error: error,
			});
			return call(error, null);
		}
		if (response.body.success) {
			logger.info({
				message: `Imangen insertada, url: ${response.body.data.url_viewer}`,
				response: response.body,
			});
			callback(null, response.body);
		} else {
			logger.error({
				message: 'Error insertando imagen',
				response: response.body,
			});
			callback(response.body, null);
		}
	});
};
