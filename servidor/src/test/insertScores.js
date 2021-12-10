const fs = require('fs');
const path = require('path');
const request = require('postman-request');
const logger = require('../common/testLogger.js');
const config = require('../common/config');

const insertScores = (productIds, userIds, storeIds) => {
	let raw = fs.readFileSync(
		path.join(__dirname, '/data/storeScores.json'));
	const storeScores = JSON.parse(raw);
	raw = fs.readFileSync(
		path.join(__dirname, '/data/productScores.json'));
	const productScores = JSON.parse(raw);
	const data = storeScores.concat(productScores);

	logger.info('Insertando calificaciones de productos y tiendas');

	data.forEach((item) => {
		item.id_user = userIds[item.id_user];
		let url = `${config.host}/product/score/${item.id_product}`;
		let scoreType = 'producto';
		let id = -1;
		if (item.id_store !== undefined) {
			item.id_store = storeIds[item.id_store];
			id = item.id_store;
			url = `${config.host}/store/score/${item.id_store}`;
			scoreType = 'tienda';
		} else {
			item.id_product = productIds[item.id_product];
			id = item.id_product;
		}
		const options = {
			url: url,
			json: true,
			body: item,
		};
		request.post(options, (error, response) => {
			if (error) {
				return logger.error({
					message: `Error insertando calificacion de ${scoreType} ` +
					`con id: ${id} ` +
					`del usuario: ${item.id_user}`,
					error: error,
				});
			}
			const respData = response.body;
			if (respData.result) {
				logger.info({
					message: `Calificación de ${scoreType} con id: ${id} ` +
					`del usuario: ${item.id_user} insertada`,
					data: item,
					response: respData,
				});
			} else {
				logger.error({
					message: `Error insertando calificacion de ${scoreType} ` +
					`con id: ${id} ` +
					`del usuario: ${item.id_user}`,
					error: respData,
				});
			}
		});
	});
};

module.exports = insertScores;
