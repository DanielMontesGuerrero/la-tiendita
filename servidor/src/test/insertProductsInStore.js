const fs = require('fs');
const path = require('path');
const request = require('postman-request');
const logger = require('../common/testLogger.js');
const config = require('../common/config');
const utils = require('../common/utils.js');

const updateUserCart = async (data) => {
	const options = {
		url: `${config.host}/cart/${data.id_user}`,
		json: true,
	};
	request.get(options, async (error, response) => {
		if (error) {
			return logger.error({
				message: `Error obteniendo el carrito del usuario: ${data.id_user}`,
				error: error,
			});
		}
		if (response.body.result) {
			const productsResp = response.body.response;
			const products = productsResp.map((item) => {
				return {
					id_product: item.id_product,
					id_store: item.id_store,
					numProducts: item.numProducts,
				};
			});
			products.push({
				id_product: data.id_product,
				id_store: data.id_store,
				numProducts: data.numProducts,
			});
			options.body = products;
			options.method = 'patch';
			try {
				const res = await utils.promisfiedRequest(options);
				if (res.body.result) {
					logger.info({
						message: `Carrito actualizado del usuario: ${data.id_user}`,
						response: res.body,
					});
				} else {
					return logger.error({
						message: `Error actualizando carrito del usuario: ${data.id_user}`,
						error: res.body.description,
					});
				}
			} catch (err) {
				return logger.error({
					message: `Error actualizando carrito del usuario: ${data.id_user}`,
					error: err,
				});
			}
		} else {
			return logger.error({
				message: `Error obteniendo el carrito del usuario: ${data.id_user}`,
				error: response.body.description,
			});
		}
	});
};

const insertProduct = async (item, productsIds, storeIds, userIds) => {
	item.id_product = productsIds[item.id_product - 1];
	item.id_store = storeIds[item.id_store - 1];
	const options = {
		url: `${config.host}/store/productInStore/${item.id_store}`,
		json: true,
		method: 'post',
		body: {
			id_product: item.id_product,
			price: item.price,
			stock: item.stock,
		},
	};
	try {
		const response = await utils.promisfiedRequest(options);
		const respData = response.body;
		if (respData.result) {
			logger.info({
				message: 'Productos insertados en tienda',
				data: item,
				response: respData,
			});
			await Promise.all(item.inCart.map(async (itemCart) => {
				const data = {
					id_user: userIds[itemCart.id_user - 1],
					id_product: item.id_product,
					id_store: item.id_store,
					numProducts: itemCart.numProducts,
				};
				return await updateUserCart(data);
			}));
		} else {
			logger.error({
				message: 'Error insertando los productos en tienda',
				error: respData,
			});
		}
	} catch (error) {
		return logger.error({
			message: 'Error insertando los productos en tienda',
			error: error,
		});
	}
};

const insertProductsInStore = async (productsIds, storeIds, userIds) => {
	const raw = fs.readFileSync(
		path.join(__dirname, '/data/productsInStore.json'));
	const productsInStore = JSON.parse(raw);

	logger.info('Insertando productos en tiendas');
	for (let i = 0; i < productsInStore.length; i++) {
		await insertProduct(productsInStore[i], productsIds, storeIds, userIds);
	}
};

module.exports = insertProductsInStore;
