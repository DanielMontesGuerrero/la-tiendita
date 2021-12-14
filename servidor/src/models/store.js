const connection = require('../db/database.js');
const logger = require('../common/logger.js');
const validator = require('validator');

const storesTable = 'tiendas';
const storeScoresTable = 'calificaciones_tienda';
const deliveriesTable = 'entregas_en';
const productsInStoreTable = 'productos_en_tienda';
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
	 * obtiene la calificación de una tienda
	 * @param {QueryBuilder} qb - objeto de querybuilder
	 * @param {int} id - id de la tienda
	 * @param {Request} request - opciones de la petición
	 * @param {Product} store - datos de la tienda
	 * @param {func} callback - función de callback
	 */
	static getScore(qb, id, request, store, callback) {
		qb.select_avg('calificacion')
			.where('id_tienda', id)
			.get('calificaciones_tienda', (err, res) => {
				if (err) {
					logger.error({
						message: `Error al obtener calificación de la tienda: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				store.score = res[0].calificacion;
				if (request.includeScoreList) {
					return this.getScoreList(qb, id, store, callback);
				}
				qb.release();
				callback(null, product);
			});
	}

	/**
	 * obtiene todas las calificaciones de una tienda
	 * @param {QueryBuilder} qb - objeto de querybuilder
	 * @param {int} id - id de la tienda
	 * @param {Product} store - datos de la tienda
	 * @param {func} callback - función de callback
	 */
	static getScoreList(qb, id, store, callback) {
		qb.select('*')
			.where('id_tienda', id)
			.get('calificaciones_tienda', (err, res) => {
				qb.release();
				if (err) {
					logger.error({
						message: `Error al obtener calificaciones de la tienda: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				store.scoreList = res;
				callback(null, store);
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
	* Inserta dentro de la tabla 'productos en tienda' el producto que se pasa como párametro
	* dentro de la tienda que se pasa como parametro
	* @param {int} id - Id dentro de la base de datos de la tienda en donde se insertará
	* @param {string} data - Información del producto en tienda
	* @param {func} callback - Función de callback
	*/
	static createProductInStore(id, data, callback) {
		data.id_store = id;
		connection.get_connection((qb) => {
			qb.insert(productsInStoreTable, data, (err, res) => {
				qb.release();
				if (err) {
					logger.error({
						message: 'Error creando producto ' +
						`en la tienda: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				logger.info({
					message: `Producto creado en la tienda: ${id}`,
					result: res,
				});
				callback(null, res);
			});
		});
	}

	/**
	 * Retorna todos los productos que existen dentro de una tienda con un id dado
	 * @param {int} id - Id dentro de la base de datos de la tienda
	 * @param {func} callback - Función de callback
	 */
	static getProductsInStore(id, callback) {
		connection.get_connection((qb)=> {
			qb.select('*')
				.where('id_store', id);
			qb.get(productsInStoreTable, (err, res) => {
				qb.release();
				if (err) {
					logger.error({
						message: 'Error obteniendo los productos ' +
						`de la tienda: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				logger.info({
					message: `Productos obtenidos de la tienda: ${id}`,
					result: res,
				});
				callback(null, res);
			});
		});
	} 

	/**
	 * Actualiza un producto que haya sido insertado en una tienda con el id dado
	 * @param {int} id - Id dentro de la base de datos dentro de la tienda en donde se insertará
	 * @param {string} data - Información que será actualizada
	 * @param {func} callback - Función de callback
	 */ 
	static updateProductInStore(id, data, callback) {
		id = data.id_product;
		connection.get_connection((qb) => {
			qb.where({'id_store': id , 'id_product': data.id_product})
				.update(
					productsInStoreTable,
					data,
					(err, res) => {
						qb.release();
						if (err) {
							logger.error({
								message: 'Error actualizando el producto ' +
								` de la tienda: ${id}`,
								error: err,
							});
							return callback(err, null);
						}
						logger.info({
							message: `Producto actualizado de la tienda: ${id}`,
							result: res,
						});
						callback(null, res);
				});
		});
	}
}

module.exports = Store;
