const fs = require('fs');
const request = require('postman-request');
const logger = require('../common/testLogger.js');

const raw = fs.readFileSync('./data/products.json');
const products = JSON.parse(raw);

logger.info('Insertando productos');

products.forEach((item) => {
	const options = {
		url: 'http://localhost:8080/product',
		json: true,
		body: item,
	};
	request.post(options, (error, response) => {
		if (error) {
			return logger.error({
				message: `Error insertando: ${item.name}`,
				error: error,
			});
		}
		if (response.result) {
			logger.info({
				message: `Producto insertado: ${item.name}`,
				data: item,
				response: response,
			});
		} else {
			return logger.error({
				message: `Error insertando: ${item.name}`,
				error: response.description,
			});
		}
	});
});
