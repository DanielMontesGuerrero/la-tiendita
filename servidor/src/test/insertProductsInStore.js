const fs = require('fs');
const path = require('path');
const request = require('postman-request');
const logger = require('../common/testLogger.js');
const config = require('../common/config');

const insertProductsInStore = (productsIds, storeIds, productIds) => {
	const raw = fs.readFileSync(
		path.join(__dirname, '/data/productsInStore.json'));
	const productsInStore = JSON.parse(raw);

	logger.info('Insertando productos en tiendas');
	productsInStore.forEach((item, index) => {
		item.id_product = productsIds[item.id_product - 1];
		item.id_store = productsIds[item.id_store - 1];
		console.log(item);
		const options = {
			url: `${config.host}/store/productInStore/${item.id_store}`,
			json: true,
			body: {
				id_product : item.id_product,
				price : item.price,
				quantity : item.quantity,
			},
		};
		request.post(options, (error, response) => {
			if (error) {
				return logger.error({
					message: 'Error insertando los productos en tienda',
					error: error,
				});
			}
			const respData = response.body;
			if (respData.result) {
				logger.info({
					message: 'Productos insertados en tienda',
					data: productsInStore,
					response: respData,
				});
			} else {
				logger.error({
					message: 'Error insertando los productos en tienda',
					error: respData,
				});
			}
			});
	});
}

module.exports = insertProductsInStore;