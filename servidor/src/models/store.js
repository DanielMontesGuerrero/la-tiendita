const connection = require('../db/database.js');
const logger = require('../common/logger.js');
const validator = require('validator');

const storesTable = 'tiendas';
const storeScoresTable = 'calificaciones_tienda';
const deliveriesTable = 'entregas_en';
const paymentMethodsTable = 'metodos_de_pago';
const topLimit = 3;

/**
 * Clase que interactua con la base de datos para peticiones relacionadas con
 * la tabla de tiendas
 */
class Store {
	/**
	 * Constructor cons los nombres de cada columna de la tabla de tiendas
	 * @constructor
	 * @param {any} store - información de la tienda
	 */
	constructor(store) {
		this.id_store = store.id_store;
		this.id_user = store.id_user;
		this.name = store.name;
		this.description = store.description;
		this.image = store.image;
		this.score = store.score;
	}

	/**
	 * verifica que la tienda sea válida
	 * @param {Tienda} store - datos de la tienda
	 * @throws Error - error indicando el campo no válido
	 */
	static isValid(store) {
		const re = new RegExp('^[a-zA-Z]+.*$');
		if (store.name === undefined || !re.test(store.name)) {
			throw new Error('Tienda no válida: el nombre debe iniciar con una letra');
		}
		if (store.image !== undefined && !validator.isURL(store.image)) {
			throw new Error('Tienda no válida: la imagen no es válida');
		}
	}

	/**
	 * crea una nueva tienda en la base de datos
	 * @param {Store} data - información a insertar
	 * @param {func} callback - función de callback
	 * @return {void} void
	 */
	static create(data, callback) {
		try {
			this.isValid(data);
		} catch (err) {
			logger.error({
				message: `Error al crear la tienda: ${data.name}`,
				error: err.message,
			});
			return callback(err, null);
		}
		connection.get_connection((qb) => {
			qb.insert(
				storesTable,
				data,
				(err, res) => {
					qb.release();
					if (err) {
						logger.error({
							message: `Error al insertar la tienda: ${err.sqlMessage}`,
							error: err,
						});
						return callback(err, null);
					}
					logger.info({
						message: `Tienda insertada con id: ${res.insert_id} en la DB`,
						result: res,
					});
					callback(null, res);
				});
		});
	};

	/**
	 * obtiene los datos de una tienda
	 * @param {int} id - id de la tienda a obtener
	 * @param {Request} request - opci de la petición
	 * @param {func} callback - función de callback
	 */
	static getById(id, request, callback) {
		connection.get_connection((qb) => {
			const selectList = [
				`${storesTable}.id_store`,
				`${storesTable}.name`,
				`${storesTable}.description`,
				`${storesTable}.id_user`,
				`${storesTable}.image`,
				request.includeScore ? `scores.score` : '',
			];
			qb.select(selectList).from(storesTable);
			if (id !== 'all') {
				qb.where(`${storesTable}.id_store`, id);
			}
			if (request.includeScore) {
				const scoreTmpTable = `(
					SELECT AVG(score) as score, id_store
					FROM ${storeScoresTable}
					GROUP BY id_store
				) scores`;
				qb.join(
					scoreTmpTable,
					`${storesTable}.id_store=scores.id_store`,
					'left',
				);
			}
			if (request.onlyTop) {
				qb.order_by('scores.score', 'DESC')
					.limit(topLimit);
			}
			qb.get((err, res) => {
				qb.release();
				if (err) {
					logger.error({
						message: `Error al obtener la tienda: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				logger.info({
					message: `Tienda consultada: ${id}`,
					result: res,
				});
				const stores = res.map((item) => new Store(item));
				callback(null, stores);
			});
		});
	}

	/**
	 * obtiene las calificaciones de una tienda
	 * @param {int} id - id de la tienda
	 * @param {func} callback - función de callback
	 */
	static getScoreList(id, callback) {
		connection.get_connection((qb) => {
			qb.select('*')
				.where('id_store', id)
				.get(storeScoresTable, (err, res) => {
					qb.release();
					if (err) {
						logger.error({
							message: `Error al obtener la lista de calificaciones` +
							` de la tienda: ${id}`,
							error: err,
						});
						return callback(err, null);
					}
					logger.info({
						message: `Lista de calificaciones obtenida de la tienda: ${id}`,
						result: res,
					});
					callback(null, res);
				});
		});
	}

	/**
	 * actualiza los datos de una tienda
	 * @param {Request} request - petición con el id y los datos a actualizar
	 * @param {func} callback - función de callback
	 */
	static update(request, callback) {
		const data = request.data;
		connection.get_connection((qb) => {
			qb.update(
				storesTable,
				data,
				{id_store: request.id},
				(err, res) => {
					qb.release();
					if (err) {
						logger.error({
							message: `Error al actualizar la tienda: ${request.id}`,
							error: err,
						});
						return callback(err, null);
					}
					logger.info({
						message: `Tienda actualizado: ${request.id}`,
						result: res,
					});
					callback(null, res);
				});
		});
	}

	/**
	 * Añade calificación a la tienda
	 * @param {int} id - id de la tienda
	 * @param {data} data - información de la calificación
	 * @param {func} callback - función de callback
	 * @return {void} void
	 */
	static addScore(id, data, callback) {
		data.id_store = id;
		try {
			this.isValidScore(data);
		} catch (error) {
			return callback(error, null);
		}
		connection.get_connection((qb) => {
			qb.insert(
				storeScoresTable,
				data,
				(err, res) => {
					if (err) {
						if (err.code === 'ER_DUP_ENTRY') {
							return this.updateScore(qb, data, callback);
						}
						logger.error({
							message: `Error al insertar calificación de tienda: ${id}`,
							error: err,
						});
						return callback(err, null);
					}
					logger.info({
						message: `Calificación insertada de la tienda: ${id}`,
						result: res,
					});
					qb.release();
					return callback(null, res);
				},
			);
		});
	}

	/**
	 * valida la calificación de una tienda
	 * @param {Score} score - datos de la calificación
	 * @throws Error - errores de la calificación
	 */
	static isValidScore(score) {
		if (score.score < 0 || score.score > 5) {
			throw new Error('La calificación debe estar en el rango 0-5');
		}
	}

	/**
	 * @param {QueryBuilder} qb - objeto de querybuilder
	 * @param {Score} data - datos a actualizar
	 * @param {func} callback - función de callback
	 */
	static updateScore(qb, data, callback) {
		qb.release();
		const ids = {
			id_store: data.id_store,
			id_user: data.id_user,
		};
		delete data.id_user;
		delete data.id_store;
		qb.update(
			storeScoresTable,
			data,
			ids,
			(err, res) => {
				if (err) {
					logger.error({
						message: `Error al insertar calificación` +
						` de tienda: ${ids.id_store}`,
						error: err,
					});
					return callback(err, null);
				}
				logger.info({
					message: `Calificación actualizada para la tienda: ${ids.id_store}`,
					result: res,
				});
				return callback(null, res);
			});
	}

	/**
	 * crea un nuevo punto de entrega
	 * @param {int} id - id de la tienda
	 * @param {any} data - datos del punto de entrega
	 * @param {func} callback - función de callback
	 */
	static createDeliveryPoint(id, data, callback) {
		data.id_store = id;
		connection.get_connection((qb) => {
			qb.insert(deliveriesTable, data, (err, res) => {
				qb.release();
				if (err) {
					logger.error({
						message: 'Error creando punto de ' +
						`entrega de la tienda: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				logger.info({
					message: `Punto de entrega creado de la tienda: ${id}`,
					result: res,
				});
				callback(null, res);
			});
		});
	}

	/**
	 * obtiene los puntos de entrega de una tienda
	 * @param {int} id - id de la tienda
	 * @param {func} callback - función de callback
	 */
	static getDeliveryPoints(id, callback) {
		connection.get_connection((qb) => {
			qb.select('*')
				.where('id_store', id);
			qb.get(deliveriesTable, (err, res) => {
				qb.release();
				if (err) {
					logger.error({
						message: 'Error obteniendo puntos de ' +
						`entrega de la tienda: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				logger.info({
					message: `Puntos de entrega obtenidos de la tienda: ${id}`,
					result: res,
				});
				callback(null, res);
			});
		});
	}

	/**
	 * actualiza un punto de entrega
	 * @param {int} id - id del punto de entrega
	 * @param {string} data - descripción del punto de entrega
	 * @param {func} callback - función de callback
	 */
	static updateDeliveryPoint(id, data, callback) {
		connection.get_connection((qb) => {
			qb.where('id_delivery', id)
				.update(
					deliveriesTable,
					data,
					(err, res) => {
						qb.release();
						if (err) {
							logger.error({
								message: 'Error actualizando punto de ' +
								`entrega de la tienda: ${id}`,
								error: err,
							});
							return callback(err, null);
						}
						logger.info({
							message: `Puntos de entrega actualizado de la tienda: ${id}`,
							result: res,
						});
						callback(null, res);
					});
		});
	}

	/**
	 * crea un nuevo método de pago
	 * @param {int} id - id de la tienda
	 * @param {any} description - descripción del método de pago
	 * @param {func} callback - función de callback
	 */
	static createPaymentMethod(id, description, callback) {
		const data = {
			id_store: id,
			description: description,
		};
		connection.get_connection((qb) => {
			qb.insert(paymentMethodsTable, data, (err, res) => {
				qb.release();
				if (err) {
					logger.error({
						message: 'Error creando método de ' +
						`pago de la tienda: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				logger.info({
					message: `Método de pago creado de la tienda: ${id}`,
					result: res,
				});
				callback(null, res);
			});
		});
	}

	/**
	 * obtiene los métodos de pago de una tienda
	 * @param {int} id - id de la tienda
	 * @param {func} callback - función de callback
	 */
	static getPaymentMethods(id, callback) {
		connection.get_connection((qb) => {
			qb.select('*')
				.where('id_store', id);
			qb.get(paymentMethodsTable, (err, res) => {
				qb.release();
				if (err) {
					logger.error({
						message: 'Error obteniendo métodos de ' +
						`pago de la tienda: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				logger.info({
					message: `Métodos de pago obtenidos de la tienda: ${id}`,
					result: res,
				});
				callback(null, res);
			});
		});
	}

	/**
	 * actualiza un método de pago
	 * @param {int} id - id del método de pago
	 * @param {string} data - descripción del método de pago
	 * @param {func} callback - función de callback
	 */
	static updatePaymentMethod(id, data, callback) {
		connection.get_connection((qb) => {
			qb.where('id_method', id)
				.update(
					paymentMethodsTable,
					data,
					(err, res) => {
						qb.release();
						if (err) {
							logger.error({
								message: 'Error actualizando método de ' +
								`pago de la tienda: ${id}`,
								error: err,
							});
							return callback(err, null);
						}
						logger.info({
							message: `Método de pago actualizado de la tienda: ${id}`,
							result: res,
						});
						callback(null, res);
					});
		});
	}
}

module.exports = Store;
