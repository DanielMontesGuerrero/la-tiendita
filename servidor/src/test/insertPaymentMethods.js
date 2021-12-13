const fs = require('fs');
const path = require('path');
const request = require('postman-request');
const logger = require('../common/testLogger.js');
const config = require('../common/config');

const insertPaymentMethods = (storeIds) => {
	const raw = fs.readFileSync(
		path.join(__dirname, '/data/paymentMethods.json'));
	const paymentMethods = JSON.parse(raw);

	logger.info('Insertando métodos de pago');

	paymentMethods.forEach((item) => {
		item.id_store = storeIds[item.id_store - 1];
		const options = {
			url: `${config.host}/store/payment/${item.id_store}`,
			json: true,
			body: {
				description: item.description,
			},
		};
		request.post(options, (error, response) => {
			if (error) {
				return logger.error({
					message: `Error al insertar método de pago ` +
					`de la tienda ${item.id_store}`,
					error: error,
				});
			}
			const respData = response.body;
			if (respData.result) {
				logger.info({
					message: `Método de pago de la tienda ${item.id_store} insertado`,
					data: paymentMethods,
					response: respData,
				});
			} else {
				logger.error({
					message: `Error al insertar método de pago ` +
					`de la tienda ${item.id_store}`,
					error: respData,
				});
			}
		});
	});
};

module.exports = insertPaymentMethods;
 
