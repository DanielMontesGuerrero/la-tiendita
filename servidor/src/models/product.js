const connection = require('../db/database.js');
const logger = require('../common/logger.js');
const validator = require('validator');
const QueryBuilder = require('node-querybuilder');

const productsTable = 'productos';
const productScoresTable = 'calificaciones_producto';

/**
 * Clase que interactua con la base de datos para peticiones relacionadas con
 * la tabla de productos
 */
class Product {
	/**
	* Constructor cons los nombres de cada columna de la tabla de productos
	* @constructor
	* @param {any} product - información del producto
	*/
	constructor(product) {
		if (product.id_product !== undefined) {
			this.id_product = product.id_product;
		}
		if (product.name !== undefined) {
			this.name = product.name;
		}
		if (product.description !== undefined) {
			this.description = product.description;
		}
		if (product.image !== undefined) {
			this.image = product.image;
		}
		if (product.quantity !== undefined) {
			this.quantity = product.quantity;
		}
		if (product.unity !== undefined) {
			this.unity = product.unity;
		}
		if (product.score !== undefined) {
			this.score = product.score;
		}
		if (product.id_producto !== undefined) {
			this.id_product = product.id_producto;
		}
		if (product.nombre !== undefined) {
			this.name = product.nombre;
		}
		if (product.descripcion !== undefined) {
			this.description = product.descripcion;
		}
		if (product.imagen !== undefined) {
			this.image = product.imagen;
		}
		if (product.cantidad !== undefined) {
			this.quantity = product.cantidad;
		}
		if (product.unidad !== undefined) {
			this.unity = product.unidad;
		}
	}

	/**
	 * convierte el producto a un objecto donde los nombres de cada campo
	 *  coinciden con los de la DB
	 * @param {Product} product - producto a convertir
	 * @return {any} - objecto con los mismos datos
	 */
	static parseToColumnNamesObject(product) {
		const columnNameObject = {};
		if (product.id_product !== undefined) {
			columnNameObject.id_producto = product.id_product;
		}
		if (product.name !== undefined) {
			columnNameObject.nombre = product.name;
		}
		if (product.description !== undefined) {
			columnNameObject.descripcion = product.description;
		}
		if (product.image !== undefined) {
			columnNameObject.imagen = product.image;
		}
		if (product.quantity !== undefined) {
			columnNameObject.cantidad = product.quantity;
		}
		if (product.unity !== undefined) {
			columnNameObject.unidad = product.unity;
		}
		if (product.score !== undefined) {
			columnNameObject.calificacion = product.score;
		}
		if (product.score !== undefined) {
			columnNameObject.calificacion = product.score;
		}
		if (product.id_user !== undefined) {
			columnNameObject.id_usuario = product.id_user;
		}
		return columnNameObject;
	}

	/**
	 * Verifica que el producto sea valido
	 * nota: usar en objecto con los nombres de las columnas de la base de datos
	 * @param {Producto} product - datos del producto
	 * @throws Error Lanza un error si contiene información no válida
	 */
	static isValid(product) {
		const re = new RegExp('^[a-zA-Z]+.*$');
		if (product.nombre === undefined || !re.test(product.nombre)) {
			throw new Error('Producto no válido: el nombre debe comenzar con letras');
		}
		if (product.cantidad !== undefined && product.cantidad <= 0) {
			throw new Error('Producto no válido: la cantidad debe ser > 0');
		}
		if (product.imagen !== undefined && !validator.isURL(product.imagen)) {
			throw new Error('Producto no válido: la imagen no es válida');
		}
	}

	/**
	* crea un nuevo producto en la base de datos
	* @param {Product} data - información a insertar
	* @param {func} callback - función de callback
	* @return {void} void
	*/
	static create(data, callback) {
		data = this.parseToColumnNamesObject(data);
		try {
			this.isValid(data);
		} catch (err) {
			logger.error({
				message: `Error al crear producto: ${data.nombre}`,
				error: err.message,
			});
			return callback(err, null);
		}
		connection.get_connection((qb) => {
			qb.insert(
				productsTable,
				data,
				(err, res) => {
					qb.release();
					if (err) {
						logger.error({
							message: `Error al insertar producto: ${err.sqlMessage}`,
							error: err,
						});
						return callback(err, null);
					}
					logger.info({
						message: `Producto insertado con id: ${res.insert_id} en la DB`,
						result: res,
					});
					callback(null, res);
				});
		});
	};

	/**
	 * obtiene los datos de un producto
	 * @param {int} id - id del producto a obtener
	 * @param {Request} request - opciones de la petición
	 * @param {func} callback - función de callback
	 */
	static getById(id, request, callback) {
		connection.get_connection((qb) => {
			qb.select('*').where('id_producto', id);
			qb.get(productsTable, (err, res) => {
				if (err) {
					logger.error({
						message: `Error al obtener el producto: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				if (request.includeScore) {
					return this.getScore(qb, id, request, new Product(res[0]), callback);
				}
				qb.release();
				logger.info({
					message: `Producto consultado: ${id}`,
					result: res,
				});
				callback(null, new Product(res[0]));
			});
		});
	}

	/**
	 * obtiene la calificación de un producto
	 * @param {QueryBuilder} qb - objeto de querybuilder
	 * @param {int} id - id del producto
	 * @param {Request} request - opciones de la petición
	 * @param {Product} product - datos del producto
	 * @param {func} callback - función de callback
	 */
	static getScore(qb, id, request, product, callback) {
		qb.select_avg('calificacion')
			.where('id_producto', id)
			.get('calificaciones_producto', (err, res) => {
				if (err) {
					logger.error({
						message: `Error al obtener calificación del producto: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				product.score = res[0].calificacion;
				if (request.includeScoreList) {
					return this.getScoreList(qb, id, product, callback);
				}
				qb.release();
				callback(null, product);
			});
	}

	/**
	 * obtiene todas las calificaciones de un producto
	 * @param {QueryBuilder} qb - objeto de querybuilder
	 * @param {int} id - id del producto
	 * @param {Product} product - datos del producto
	 * @param {func} callback - función de callback
	 */
	static getScoreList(qb, id, product, callback) {
		qb.select('*')
			.where('id_producto', id)
			.get('calificaciones_producto', (err, res) => {
				qb.release();
				if (err) {
					logger.error({
						message: `Error al obtener calificaciones del producto: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				product.scoreList = res;
				callback(null, product);
			});
	}

	/**
	 * actualiza los datos de un producto
	 * @param {Request} request - petición con el id y los datos a actualizar
	 * @param {func} callback - función de callback
	 */
	static update(request, callback) {
		const data = this.parseToColumnNamesObject(request.data);
		connection.get_connection((qb) => {
			qb.update(
				productsTable,
				data,
				{id_producto: request.id},
				(err, res) => {
					qb.release();
					if (err) {
						logger.error({
							message: `Error al actualizar el producto: ${request.id}`,
							error: err,
						});
						return callback(err, null);
					}
					logger.info({
						message: `Producto actualizado: ${request.id}`,
						result: res,
					});
					callback(null, res);
				});
		});
	}

	/**
	 * Añade calificación al producto
	 * @param {int} id - id del producto
	 * @param {data} data - información de la calificación
	 * @param {func} callback - función de callback
	 * @return {void} void
	 */
	static addScore(id, data, callback) {
		data.id_product = id;
		try {
			this.isValidScore(data);
		} catch (error) {
			return callback(error, null);
		}
		data = this.parseToColumnNamesObject(data);
		connection.get_connection((qb) => {
			qb.insert(
				productScoresTable,
				data,
				(err, res) => {
					if (err) {
						if (err.code === 'ER_DUP_ENTRY') {
							return this.updateScore(qb, data, callback);
						}
						logger.error({
							message: `Error al insertar calificación del producto: ${id}`,
							error: err,
						});
						return callback(err, null);
					}
					logger.info({
						message: `Calificación insertada del producto: ${id}`,
						result: res,
					});
					qb.release();
					return callback(null, res);
				},
			);
		});
	}

	/**
	 * valida la calificación de un producto
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
			id_producto: data.id_producto,
			id_usuario: data.id_usuario,
		};
		delete data.id_usuario;
		delete data.id_producto;
		qb.update(
			productScoresTable,
			data,
			ids,
			(err, res) => {
				if (err) {
					logger.error({
						message: `Error al insertar calificación` +
						` del producto: ${data.id_tienda}`,
						error: err,
					});
					return callback(err, null);
				}
				logger.info({
					message: `Calificación actualizada ` +
					`para el producto: ${data.id_tienda}`,
					result: res,
				});
				return callback(null, res);
			});
	}
}

module.exports = Product;
