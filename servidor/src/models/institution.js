const connection = require('../db/database.js');
const logger = require('../common/logger.js');
const validator = require('validator');

const institutionsTable = 'instituciones';

/**
 * Clase que interactua con la base de datos para peticiones relacionadas con
 * la tabla de instituciones
 */
class Institution {
	/**
	* Constructor cons los nombres de cada columna de la tabla de instituciones
	* @constructor
	* @param {any} institution - información de la institución
	*/
	constructor(institution) {
		this.id_institution = institution.id_institution;
		this.name = institution.name;
		this.image = institution.image;
	}

	/**
	 * Verifica que la institución sea válida
	 * @param {Institution} institution - datos de la institución
	 * @throws Error Lanza un error si contiene información no válida
	 */
	static isValid(institution) {
		const re = new RegExp('^[a-zA-Z]+.*$');
		if (institution.name === undefined || !re.test(institution.name)) {
			throw new Error(
				'Institución no válida: el nombre debe comenzar con letras');
		}
		if (institution.image !== undefined &&
			!validator.isURL(institution.image)) {
			throw new Error('Institución no válida: la imagen no es válida');
		}
	}

	/**
	* crea una nuevo institución en la base de datos
	* @param {Product} data - información a insertar
	* @param {func} callback - función de callback
	* @return {void} void
	*/
	static create(data, callback) {
		try {
			this.isValid(data);
		} catch (err) {
			logger.error({
				message: `Error al crear la institución: ${data.name}`,
				error: err.message,
			});
			return callback(err, null);
		}
		connection.get_connection((qb) => {
			qb.insert(
				institutionsTable,
				data,
				(err, res) => {
					qb.release();
					if (err) {
						logger.error({
							message: `Error al insertar la institución: ${err.sqlMessage}`,
							error: err,
						});
						return callback(err, null);
					}
					logger.info({
						message: `Institución insertada con id: ${res.insert_id} en la DB`,
						result: res,
					});
					callback(null, res);
				});
		});
	};

	/**
	 * obtiene los datos de una institución
	 * @param {int} id - id de la institución a obtener
	 * @param {func} callback - función de callback
	 */
	static getById(id, callback) {
		connection.get_connection((qb) => {
			qb.select('*');
			if (id !== 'all') {
				where({id_institution: id});
			}
			qb.get(institutionsTable, (err, res) => {
				qb.release();
				if (err) {
					logger.error({
						message: `Error al obtener la institución: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				logger.info({
					message: `Institución consultada: ${id}`,
					result: res,
				});
				callback(null, res);
			});
		});
	}

	/**
	 * actualiza los datos de una institución
	 * @param {int} id - id de la institución a actualizar
	 * @param {any} data - datos a actualizar
	 * @param {func} callback - función de callback
	 */
	static update(id, data, callback) {
		connection.get_connection((qb) => {
			qb.update(
				institutionsTable,
				data,
				{id_institution: id},
				(err, res) => {
					qb.release();
					if (err) {
						logger.error({
							message: `Error al actualizar la institución: ${id}`,
							error: err,
						});
						return callback(err, null);
					}
					logger.info({
						message: `Institución actualizada: ${id}`,
						result: res,
					});
					callback(null, res);
				});
		});
	}
}

module.exports = Institution;
