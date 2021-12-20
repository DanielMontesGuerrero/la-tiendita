const config = require('./config.js');
const request = require('postman-request');
const logger = require('./logger.js');
const fs = require('fs');

exports.uploadImage = (buffer, callback) => {
	const url = `${config.imageServer}?key=${config.imageBBKey}`;
	const image = Buffer.from(buffer).toString('base64');
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
			return callback(error, null);
		}
		if (response.body.success) {
			logger.info({
				message: `Imangen insertada, url: ${response.body.data.url}`,
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

exports.promisfiedRequest = (options) => {
	return new Promise((resolve, reject) => {
		request(options, (error, response) => {
			if (error) {
				return reject(error);
			}
			return resolve(response);
		});
	});
};


exports.uploadFile = (file, callback) => {
	const filename = file.filename;
	const filepath = file.destination;
	const aux = fs.createReadStream(`${filepath}/${filename}`);
	const url = 'https://content.dropboxapi.com/2/files/upload';
	const headers = {
		'Authorization': 'Bearer NAFId7B39IMAAAAAAAAAAbQn5P5n6qpvgliJGN5JSVqkmTXMhVYxyVnkMTU_LuQO',
		'Dropbox-API-Arg': `{"path": "/la-tiendita/${filename}.pdf","mode": "add","autorename": true,"mute": true,"strict_conflict": false}`,
		'Content-Type': 'application/octet-stream',
	};
	logger.info({
		message: 'Subiendo archivo a dropbox',
		file: aux,
	});
	const options = {
		url: url,
		headers: headers,
		body: aux,
	};
	request.post(options, (error, response) => {
		if (error) {
			logger.error({
				message: `Error subiendo archivo a Dropbox: ${response}`,
				error: error,
			});
			return callback(error, null);
		}
		response.body = JSON.parse(response.body);
		fs.unlinkSync(`${filepath}/${filename}`);
		if (response.body.id !== undefined) {
			logger.info({
				message: `Archivo insertado, id: ${response.body.id}`,
				response: response.body,
			});
			callback(null, response.body);
		} else {
			logger.error({
				message: 'Error subiendo archivo a Dropbox',
				response: response.body,
			});
			callback(response.body, null);
		}
	});
};
exports.getUrlFile = (id, callback) => {
	const url = 'https://api.dropboxapi.com/2/files/get_temporary_link';
	const headers = {
		'Authorization': 'Bearer NAFId7B39IMAAAAAAAAAAbQn5P5n6qpvgliJGN5JSVqkmTXMhVYxyVnkMTU_LuQO',
		'Content-Type': 'application/json',
	};
	const options = {
		'url': url,
		'method': 'POST',
		'headers': headers,
		'body': JSON.stringify({
			'path': id,
		}),
	};
	request.post(options, (error, response) => {
		if (error) {
			logger.error({
				message: `Error obteniendo archivo de Dropbox: ${error}`,
				error: error,
			});
			return callback(error, null);
		}
		callback(null, response);
	});
};
