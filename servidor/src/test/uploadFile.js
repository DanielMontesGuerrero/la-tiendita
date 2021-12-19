const fs = require('fs');
const request = require('postman-request');
const logger = require('../common/testLogger.js');
const config = require('../common/config.js');

const filePath = './data/file/nuevoEjemplo.pdf'

logger.info('Subiendo archivo a Dropbox');

const url = 'https://content.dropboxapi.com/2/files/upload';

const headers = {
	'Authorization' : 'Bearer NAFId7B39IMAAAAAAAAAAbQn5P5n6qpvgliJGN5JSVqkmTXMhVYxyVnkMTU_LuQO',
	'Dropbox-API-Arg': '{"path": "/la-tiendita/ejemploNuevo2.pdf","mode": "add","autorename": true,"mute": false,"strict_conflict": false}',
	'Content-Type': 'application/octet-stream'
};

const options = {
	url : url,
	headers : headers,
	body : fs.createReadStream(filePath),
};
console.log(options.body);
request.post(options, (error, response) => {
	if(error) {
		return logger.error({
			message : `Error subiendo el archivo a Dropbox hay error ${error}`,
			error : error,
		});
	}
	response.body = JSON.parse(response.body);
	if(response.body.id !== undefined) {
		logger.info({
			message : `Archivo subido con exito id: ${response.body.id}`,
			response : response.body,
		});
	}
	else {
		return logger.error({
			message : `Error subiendo el archivo a Dropbox ${response.body}`,
			error : response.body,
		});
	}
});