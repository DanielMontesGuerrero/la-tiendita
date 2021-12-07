const fs = require('fs');
const path = require('path');
const request = require('postman-request');
const logger = require('../common/testLogger.js');
const config = require('../common/config');

const imgFolderPath = '/data/img/';

const insertStores = () => {
	const raw = fs.readFileSync(
		path.join(__dirname, '/data/stores.json'));
	const user = JSON.parse(raw);

	logger.info('Insertando tiendas');

	user.forEach((item) => {
		let options = {
			url: `${config.host}/store`,
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
					message: `Tienda insertada: ${item.name}`,
					data: item,
					response: respData,
				});
				if (item.imageFile !== undefined) {
					imagePath = path.join(__dirname, imgFolderPath, item.imageFile);
					options = {
						url: `${config.host}/store/image/${respData.response.insertId}`,
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
				console.log(response.body);
				return logger.error({
					message: `Error insertando: ${item.name}`,
					error: response.body,
				});
			}
		});
	});
};

module.exports = insertStores;

