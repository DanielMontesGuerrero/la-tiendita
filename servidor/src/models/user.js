const connection = require('../db/database.js');
const logger = require('../common/logger.js');
const validator = require('validator');

const usersTable = 'usuarios';

/**
 * Clase que interactua con la base de datos para peticiones relacionadas con
 * la tabla de usuarios
 */
class User {
	/**
	* Constructor cons los nombres de cada columna de la tabla de usuarios
	* @constructor
	* @param {any} user - información del usuario
	*/
	constructor(user) {
		this.id_user = user.id_user;
		this.name = user.name;
		this.email = user.email;
		this.image = user.image;
		this.userType = user.userType;
		this.id_school = user.id_school;
	}

	/**
	 * verifica que el usuario sea válido
	 * @param {Tienda} user - datos del usuario
	 * @throws Error - error indicando el campo no válido
	 */
	static isValid(user) {
		const re = new RegExp('^[a-zA-Z]+.*$');
		if (user.name === undefined || !re.test(user.name)) {
			throw new Error(
				'Usuario no válido: el nombre debe iniciar con una letra');
		}
		if (user.image !== undefined && !validator.isURL(user.image)) {
			throw new Error('Usuario no válido: la imagen no es válida');
		}
		if (!validator.isEmail(user.email)) {
			throw new Error('Usuario no válido: el email no es válido');
		}
	}

	/**
	* crea un nuevo usuario en la base de datos
	* @param {User} data - información a insertar
	* @param {func} callback - función de callback
	* @return {void} void
	*/
	static create(data, callback) {
		try {
			this.isValid(data);
		} catch (err) {
			logger.error({
				message: `Error al crear el usuario: ${data.nombre}`,
				error: err.message,
			});
			return callback(err, null);
		}
		connection.get_connection((qb) => {
			qb.insert(
				usersTable,
				data,
				(err, res) => {
					qb.release();
					if (err) {
						logger.error({
							message: `Error al insertar el usuario: ${err.sqlMessage}`,
							error: err,
						});
						return callback(err, null);
					}
					logger.info({
						message: `Usuario insertado con id: ${res.insert_id} en la DB`,
						result: res,
					});
					callback(null, res);
				});
		});
	};

	/**
	 * obtiene los datos de un usuario
	 * @param {int} id - id del usuario a obtener
	 * @param {func} callback - función de callback
	*/
	static getById(id, callback) {
		connection.get_connection((qb) => {
			qb.select('*').where('id_user', id);
			qb.get(usersTable, (err, res) => {
				qb.release();
				if (err) {
					logger.error({
						message: `Error al obtener el usuario: ${id}`,
						error: err,
					});
					return callback(err, null);
				}
				logger.info({
					message: `Usuario consultado: ${id}`,
					result: res,
				});
				callback(null, new User(res[0]));
			});
		});
	}

	/**
	 * actualiza los datos de un usuario
	 * @param {Request} request - petición con el id y los datos a actualizar
	 * @param {func} callback - función de callback
	*/
	static update(request, callback) {
		const data = request.data;
		connection.get_connection((qb) => {
			qb.update(
				usersTable,
				data,
				{id_user: request.id},
				(err, res) => {
					qb.release();
					if (err) {
						logger.error({
							message: `Error al actualizar el usuario: ${request.id}`,
							error: err,
						});
						return callback(err, null);
					}
					logger.info({
						message: `Usuario actualizado: ${request.id}`,
						result: res,
					});
					callback(null, res);
				});
		});
	}
}

module.exports = User;
