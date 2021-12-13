const fs = require('fs');
const path = require('path');
const request = require('postman-request');
const logger = require('../common/testLogger.js');
const config = require('../common/config');

const insertDeliveries = (storeIds, institutionIds) => {
	const raw = fs.readFileSync(
		path.join(__dirname, '/data/deliveries.json'));
	const purchases = JSON.parse(raw);

	logger.info('Insertando puntos de entrega');

	purchases.forEach((item) => {
		item.id_institution = institutionIds[item.id_institution - 1];
		item.id_store = storeIds[item.id_store - 1];
		console.log(item);
		const options = {
			url: `${config.host}/store/delivery/${item.id_store}`,
			json: true,
			body: {
				id_institution: item.id_institution,
				description: item.description,
			},
		};
		request.post(options, (error, response) => {
			if (error) {
				return logger.error({
					message: `Error al insertar punto de entrega ` +
					`de la tienda ${item.id_store}`,
					error: error,
				});
			}
			const respData = response.body;
			if (respData.result) {
				logger.info({
					message: `Punto de entrega de la tienda ${item.id_store} insertado`,
					data: purchases,
					response: respData,
				});
			} else {
				logger.error({
					message: `Error al insertar punto de entrega ` +
					`de la tienda ${item.id_store}`,
					error: respData,
				});
			}
		});
	});
};

module.exports = insertDeliveries;
