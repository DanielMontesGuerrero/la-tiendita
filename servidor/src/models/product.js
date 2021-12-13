const connection = require('../db/database.js');
const logger = require('../common/logger.js');
const validator = require('validator');

const productsTable = 'productos';
const productScoresTable = 'calificaciones_producto';
const usersTable = 'usuarios';
const topLimit = 3;

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
		this.id_product = product.id_product;
		this.name = product.name;
		this.description = product.description;
		this.quantity = product.quantity;
		this.unity = product.unity;
		this.image = product.image;
		this.score = product.score;
	}

	/**
	 * Verifica que el producto sea valido
	 * nota: usar en objecto con los nombres de las columnas de la base de datos
	 * @param {Product} product - datos del producto
	 * @throws Error Lanza un error si contiene información no válida
	 */
	static isValid(product) {
		const re = new RegExp('^[a-zA-Z]+.*$');
		if (product.name === undefined || !re.test(product.name)) {
			throw new Error('Producto no válido: el nombre debe comenzar con letras');
		}
		if (product.quantity !== undefined && product.quantity <= 0) {
			throw new Error('Producto no válido: la cantidad debe ser > 0');
		}
		if (product.image !== undefined && !validator.isURL(product.image)) {
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
		try {
			this.isValid(data);
		} catch (err) {
			logger.error({
				message: `Error al crear producto: ${data.name}`,
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
			const selectList = [
				`${productsTable}.id_product`,
				`${productsTable}.name`,
				`${productsTable}.description`,
				`${productsTable}.image`,
				`${productsTable}.quantity`,
				`${productsTable}.unity`,
				request.includeScore ? `scores.score` : '',
			];
			qb.select(selectList).from(productsTable);
			if (id !== 'all') {
				qb.where(`${productsTable}.id_product`, id);
			}
			if (request.includeScore) {
				const scoreTmpTable = `(
					SELECT AVG(score) AS score, id_product
					FROM ${productScoresTable}
					GROUP BY id_product
				) scores`;
				qb.join(
					scoreTmpTable,
					`${productsTable}.id_product=scores.id_product`,
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
						message: `Error al obtener el producto: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				logger.info({
					message: `Producto consultado: ${id ? id : 'todos'}`,
					result: res,
				});
				const products = res.map((item) => new Product(item));
				callback(null, products);
			});
		});
	}

	/**
	 * actualiza los datos de un producto
	 * @param {Request} request - petición con el id y los datos a actualizar
	 * @param {func} callback - función de callback
	 */
	static update(request, callback) {
		const data = request.data;
		connection.get_connection((qb) => {
			qb.update(
				productsTable,
				data,
				{id_product: request.id},
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
			id_product: data.id_product,
			id_user: data.id_user,
		};
		delete data.id_user;
		delete data.id_product;
		qb.update(
			productScoresTable,
			data,
			ids,
			(err, res) => {
				if (err) {
					logger.error({
						message: `Error al insertar calificación` +
						` del producto: ${ids.id_product}`,
						error: err,
					});
					return callback(err, null);
				}
				logger.info({
					message: `Calificación actualizada ` +
					`para el producto: ${ids.id_product}`,
					result: res,
				});
				return callback(null, res);
			});
	}

	/**
	 * obtiene las calificaciones de un producto
	 * @param {int} id - id del producto
	 * @param {func} callback - función de callback
	 */
	static getScoreList(id, callback) {
		connection.get_connection((qb) => {
			const selectList = [
				`${productScoresTable}.id_product`,
				`${productScoresTable}.id_user`,
				`${productScoresTable}.score`,
				`${productScoresTable}.description`,
				`${usersTable}.name`,
			];
			qb.select(selectList)
				.join(
					usersTable,
					`${usersTable}.id_user=${productScoresTable}.id_user`,
					'left',
				)
				.where('id_product', id)
				.get(productScoresTable, (err, res) => {
					qb.release();
					if (err) {
						logger.error({
							message: `Error al obtener la lista de calificaciones` +
							` del producto: ${id}`,
							error: err,
						});
						return callback(err, null);
					}
					logger.info({
						message: `Lista de calificaciones obtenida del producto: ${id}`,
						result: res,
					});
					callback(null, res);
				});
		});
	}
}

module.exports = Product;
