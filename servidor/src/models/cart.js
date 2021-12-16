const logger = require('../common/logger.js');
const redis = require('redis');
const rejson = require('redis-rejson');
const connection = require('../db/database.js');
const dbSchema = require('../db/schema.js');

/**
 * Clase que interactua con el servidor redis para manejar los productos en
 * el carrito de compras de los usuarios
 */
class Cart {
	/**
	 * actualiza el carrito de compras de un usuario
	 * @param {int} id - id del usuario
	 * @param {Cart} cart - carrito de compras
	 * @param {func} callback - función de callback
	 */
	static update(id, cart, callback) {
		rejson(redis);
		const client = redis.createClient();
		client.json_del(id, (err) => {
			if (err) {
				logger.error({
					message: `Error eliminando carrito antiguo del usuario: ${id}`,
					error: err,
				});
				return callback(err, null);
			}
			client.json_set(id, '.', JSON.stringify(cart), (errSet) => {
				if (errSet) {
					logger.error({
						message: `Error actualizando carrito del usuario: ${id}`,
						error: errSet,
					});
					return callback(errSet, null);
				}
				client.quit();
				callback(null, 'Carrito actualizado');
			});
		});
	}

	/**
	 * Obtiene el carrito de compras de un usuario
	 * @param {int} id - id del usuario
	 * @param {func} callback - función de callback
	 */
	static get(id, callback) {
		rejson(redis);
		const client = redis.createClient();
		client.json_get(id, (err, res) => {
			if (err) {
				logger.error({
					message: `Error obteniendo carrito del usuario: ${id}`,
					error: err,
				});
				return callback(err, null);
			}
			client.quit();
			const data = JSON.parse(res);
			if (data === null) {
				return callback(null, []);
			}
			if (data.length === 0) {
				return callback(null, []);
			}
			connection.get_connection((qb) => {
				const numProductsMap = new Map();
				const selectList = [
					`${dbSchema.products}.id_product`,
					`${dbSchema.products}.name`,
					`${dbSchema.products}.description`,
					`${dbSchema.products}.image`,
					`${dbSchema.products}.quantity`,
					`${dbSchema.products}.unity`,
					`${dbSchema.productsInStore}.id_store`,
					`${dbSchema.productsInStore}.price`,
					`${dbSchema.productsInStore}.stock`,
					`${dbSchema.stores}.name as storeName`,
					`${dbSchema.stores}.image as storeImage`,
				];
				qb.select(selectList)
					.from(dbSchema.products)
					.join(
						dbSchema.productsInStore,
						`${dbSchema.productsInStore}.id_product=` +
						`${dbSchema.products}.id_product`,
						'left',
					)
					.join(
						dbSchema.stores,
						`${dbSchema.stores}.id_store=${dbSchema.productsInStore}.id_store`,
						'left',
					);
				data.forEach((item) => {
					if (!numProductsMap.has(item.id_product)) {
						numProductsMap.set(item.id_product, new Map());
					}
					const itemMap = numProductsMap.get(item.id_product);
					itemMap.set(item.id_store, item.numProducts);
					qb.or_where(`(
						${dbSchema.productsInStore}.id_product=${item.id_product} AND
						${dbSchema.productsInStore}.id_store=${item.id_store}
					)`);
				});
				qb.get((errQuery, resQuery) => {
					qb.release();
					if (errQuery) {
						logger.error({
							message: `Error obteniendo datos de carrito del usuario_ ${id}`,
							error: errQuery,
						});
						return callback(errQuery, null);
					}
					logger.info({
						message: `Datos de carrito obtenidos del usario: ${id}`,
						res: resQuery,
					});
					resQuery.forEach((item) => {
						const itemMap = numProductsMap.get(item.id_product);
						item.numProducts = itemMap.get(item.id_store);
					});
					return callback(null, resQuery);
				});
			});
		});
	}
}

module.exports = Cart;
