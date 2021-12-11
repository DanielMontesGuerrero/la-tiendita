const logger = require('../common/logger.js');
const redis = require('redis');
const rejson = require('redis-rejson');

rejson(redis);

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
			callback(null, res);
		});
	}
}

module.exports = Cart;
