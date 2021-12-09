const connection = require('../db/database.js');
const logger = require('../common/logger.js');
const validator = require('validator');

const storesTable = 'tiendas';
const storeScoresTable = 'calificaciones_tienda';

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
		if (store.id_store !== undefined) {
			this.id_store = store.id_store;
		}
		if (store.id_user !== undefined) {
			this.id_user = store.id_user;
		}
		if (store.name !== undefined) {
			this.name = store.name;
		}
		if (store.description !== undefined) {
			this.description = store.description;
		}
		if (store.image !== undefined) {
			this.image = store.image;
		}
		if (store.id_tienda !== undefined) {
			this.id_store = store.id_tienda;
		}
		if (store.id_usuario !== undefined) {
			this.id_user = store.id_usuario;
		}
		if (store.nombre !== undefined) {
			this.name = store.nombre;
		}
		if (store.descripcion !== undefined) {
			this.description = store.descripcion;
		}
		if (store.imagen !== undefined) {
			this.image = store.imagen;
		}
	}

	/**
	 * convierte la tienda a un objecto donde los nombres de cada campo coinciden
	 * con los de la DB
	 * @param {Store} store - tienda a convertir
	 * @return {any} - objecto con los mismos datos
	 */
	static parseToColumnNamesObject(store) {
		const columnNameObject = {};
		if (store.id_store !== undefined) {
			columnNameObject.id_tienda = store.id_store;
		}
		if (store.id_user !== undefined) {
			columnNameObject.id_usuario = store.id_user;
		}
		if (store.name !== undefined) {
			columnNameObject.nombre = store.name;
		}
		if (store.description !== undefined) {
			columnNameObject.descripcion = store.description;
		}
		if (store.image !== undefined) {
			columnNameObject.imagen = store.image;
		}
		if (store.score !== undefined) {
			columnNameObject.calificacion = store.score;
		}
		return columnNameObject;
	}

	/**
	 * verifica que la tienda sea válida
	 * @param {Tienda} store - datos de la tienda
	 * @throws Error - error indicando el campo no válido
	 */
	static isValid(store) {
		const re = new RegExp('^[a-zA-Z]+.*$');
		if (store.nombre === undefined || !re.test(store.nombre)) {
			throw new Error('Tienda no válida: el nombre debe iniciar con una letra');
		}
		if (store.imagen !== undefined && !validator.isURL(store.imagen)) {
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
		data = this.parseToColumnNamesObject(data);
		try {
			this.isValid(data);
		} catch (err) {
			logger.error({
				message: `Error al crear la tienda: ${data.nombre}`,
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
			qb.select('*').where('id_tienda', id);
			qb.get(storesTable, (err, res) => {
				if (err) {
					logger.error({
						message: `Error al obtener la tienda: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				if (request.includeScore) {
					return this.getScore(qb, id, request, new Store(res[0]), callback);
				}
				qb.release();
				logger.info({
					message: `Tienda consultada: ${id}`,
					result: res,
				});
				callback(null, new Store(res[0]));
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
		const data = this.parseToColumnNamesObject(request.data);
		connection.get_connection((qb) => {
			qb.update(
				storesTable,
				data,
				{id_tienda: request.id},
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
		data = this.parseToColumnNamesObject(data);
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
			id_tienda: data.id_tienda,
			id_usuario: data.id_usuario,
		};
		delete data.id_usuario;
		delete data.id_tienda;
		qb.update(
			storeScoresTable,
			data,
			ids,
			(err, res) => {
				if (err) {
					logger.error({
						message: `Error al insertar calificación` +
						` de tienda: ${data.id_tienda}`,
						error: err,
					});
					return callback(err, null);
				}
				logger.info({
					message: `Calificación actualizada para la tienda: ${data.id_tienda}`,
					result: res,
				});
				return callback(null, res);
			});
	}
}

module.exports = Store;
