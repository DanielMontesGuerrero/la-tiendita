const connection = require('../db/database.js');
const logger = require('../common/logger.js');
const validator = require('validator');

const productsTable = 'productos';

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
	 * @param {func} callback - función de callback
	 */
	static getById(id, callback) {
		connection.get_connection((qb) => {
			qb.select('*').where('id_product', id);
			qb.get(productsTable, (err, res) => {
				qb.release();
				if (err) {
					logger.error({
						message: `Error al obtener el producto: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				logger.info({
					message: `Producto consultado: ${id}`,
					result: res,
				});
				callback(null, new Product(res));
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
}

module.exports = Product;
