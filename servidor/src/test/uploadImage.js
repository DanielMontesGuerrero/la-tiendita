const fs = require('fs');
const request = require('postman-request');
const logger = require('../common/testLogger.js');
const config = require('../common/config.js');

const imagePath = './data/img/cocada.jpg';

logger.info('Insertando imagenes en imgBB');

const url = `${config.imageServer}?key=${config.imageBBKey}`;

logger.info(`url: ${url}`);

const options = {
	url: url,
	json: true,
	formData: {
		image: fs.createReadStream(imagePath),
	},
};
request.post(options, (error, response) => {
	if (error) {
		return logger.error({
			message: `Error insertando imagen: ${error}`,
			error: error,
		});
	}
	if (response.body.success) {
		logger.info({
			message: `Imangen insertada, url: ${response.body.data.url_viewer}`,
			response: response.body,
		});
	} else {
		return logger.error({
			message: 'Error insertando imagen',
			response: response.body,
		});
	}
});
