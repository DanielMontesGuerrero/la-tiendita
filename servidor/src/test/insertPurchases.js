const fs = require('fs');
const path = require('path');
const request = require('postman-request');
const logger = require('../common/testLogger.js');
const config = require('../common/config');

const insertPurchases = (productIds, userIds, storeIds) => {
	const raw = fs.readFileSync(
		path.join(__dirname, '/data/purchases.json'));
	const purchases = JSON.parse(raw);

	logger.info('Insertando compras');

	purchases.forEach((item, index, arr) => {
		arr[index].id_user = userIds[item.id_user - 1];
		arr[index].id_store = storeIds[item.id_store - 1];
		arr[index].id_product = productIds[item.id_product - 1];
	});
	const options = {
		url: `${config.host}/purchase`,
		json: true,
		body: {
			purchases: purchases,
		},
	};
	request.post(options, (error, response) => {
		if (error) {
			return logger.error({
				message: 'Error insertando las compras',
				error: error,
			});
		}
		const respData = response.body;
		if (respData.result) {
			logger.info({
				message: 'Compras insertadas',
				data: purchases,
				response: respData,
			});
		} else {
			logger.error({
				message: 'Error insertando las compras',
				error: respData,
			});
		}
	});
};

module.exports = insertPurchases;
