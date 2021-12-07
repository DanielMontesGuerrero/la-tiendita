const fs = require('fs');
const path = require('path');
const request = require('postman-request');
const logger = require('../common/testLogger.js');
const config = require('../common/config');

const imgFolderPath = '/data/img/';

const insertProducts = () => {
	const raw = fs.readFileSync(
		path.join(__dirname, '/data/products.json'));
	const products = JSON.parse(raw);

	logger.info('Insertando productos');

	products.forEach((item) => {
		let options = {
			url: `${config.host}/product`,
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
			const respData = response.body;
			if (respData.result) {
				logger.info({
					message: `Producto insertado: ${item.name}`,
					data: item,
					response: respData,
				});
				if (item.imageFile !== undefined) {
					imagePath = path.join(__dirname, imgFolderPath, item.imageFile);
					options = {
						url: `${config.host}/product/image/${respData.response.insertId}`,
						json: true,
						formData: {
							image: fs.createReadStream(imagePath),
						},
					};
					request.post(options, (error, responseImg) => {
						if (error || !responseImg.body.result) {
							return logger.error({
								message: `Error enviando imagen de: ${item.name}`,
								error: error,
							});
						} else {
							return logger.info({
								message: `Imagen enviada del producto: ${item.name}`,
								response: responseImg.body,
							});
						}
					});
				}
			} else {
				return logger.error({
					message: `Error insertando: ${item.name}`,
					error: response.description,
				});
			}
		});
	});
};

module.exports = insertProducts;
