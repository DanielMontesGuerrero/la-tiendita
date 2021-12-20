const connection = require('../db/database.js');
const logger = require('../common/logger.js');
const validator = require('validator');
const crypto = require('crypto');
const {Readable} = require('stream');

const dropboxV2Api = require('dropbox-v2-api');
const dropbox = dropboxV2Api.authenticate({
	token: 'NAFId7B39IMAAAAAAAAAAbQn5P5n6qpvgliJGN5JSVqkmTXMhVYxyVnkMTU_LuQO',
});

const usersTable = 'usuarios';
const storesTable = 'tiendas';
const institutionsTable = 'instituciones';
const requestsTable = 'peticiones';

function stringToStream(text) {
	const stream = Readable.from(text);
	return stream;
}
function streamToString(stream) {
	const chunks = [];
	return new Promise((resolve, reject) => {
		stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
		stream.on('error', (err) => reject(err));
		stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
	});
}

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
		this.id_institution = user.id_institution;
		this.password = user.password;
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
		if (data.userType === null ||
			data.userType === undefined ||
			data.userType === '') {
			data.userType = 'usuario';
		}
		try {
			this.isValid(data);
		} catch (err) {
			logger.error({
				message: `Error al crear el usuario: ${data.nombre}`,
				error: err.message,
			});
			return callback(err, null);
		}
		data.password = crypto.createHash('sha256')
			.update(data.password, 'utf8')
			.digest('hex');
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
		if (data.password !== undefined) {
			data.password = crypto.createHash('sha256')
				.update(data.password, 'utf8')
				.digest('hex');
		}
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

	/**
	 * Retorna información de usuario si el usuario existe
	 * y su contraseña es correcta
	 * @param {Usuario} user - datos del usuario
	 * @param {func} callback - función de callback
	 */
	static login(user, callback) {
		user.password = crypto.createHash('sha256')
			.update(user.password, 'utf8')
			.digest('hex');
		connection.get_connection((qb) => {
			const selectList = [
				`${usersTable}.id_user`,
				`${usersTable}.name`,
				`${usersTable}.email`,
				`${usersTable}.image`,
				`${usersTable}.id_institution`,
				`${usersTable}.userType`,
				`${storesTable}.id_store`,
				`${institutionsTable}.name as institutionName`,
			];
			qb.select(selectList)
				.from(usersTable)
				.join(
					storesTable,
					`${usersTable}.id_user=${storesTable}.id_user`,
					'left',
				)
				.join(
					institutionsTable,
					`${institutionsTable}.id_institution=${usersTable}.id_institution`,
					'left',
				)
				.where({
					email: user.email,
					password: user.password,
				})
				.get((err, res) => {
					qb.release();
					if (err) {
						logger.error({
							message: `Error obteniendo login de usuario: ` +
							`${user.name ? user.name : user.email}`,
							error: err,
						});
						return callback(err, null);
					}
					logger.info({
						message: `Login obtenido de usuario: ` +
						`${user.name ? user.name : user.email}`,
						result: res,
					});
					if (res.length === 1) {
						delete res[0].password;
						return callback(null, res[0]);
					}
					callback(null, {});
				});
		});
	}
	/**
	 * Crea una nueva peticion dentro de la base de datos
	 * @param {string} data - Información acerca de la petición
	 * @param {function} callback - función de callback
	 */
	static createRequest(data, callback) {
		connection.get_connection((qb) => {
			qb.insert(
				requestsTable,
				data,
				(err, res) => {
					qb.release();
					if (err) {
						logger.error({
							message: `Error al insertar la peticion: ${err.sqlMessage}`,
							error: err,
						});
						return callback(err, null);
					}
					logger.info({
						message: `Peticion insertada con id: ${res.insert_id} en la DB`,
						result: res,
					});
					callback(null, res);
				});
		});
	};

	/**
	 * Actualiza la información de una petición dentro de la base de datos
	 * @param {int} id - id de la petición que será modificada
	 * @param {string} data - Información acerca de la petición
	 * @param {function} callback - función de callback
	 */
	static updateRequest(id, data, callback) {
		connection.get_connection((qb) => {
			qb.where('id_petition', id)
				.update(
					requestsTable,
					data,
					(err, res) => {
						qb.release();
						if (err) {
							logger.error({
								message: `Error al actualizar los datos de la peticion ${id} dentro de la BD`,
								error: err,
							});
							return callback(err, null);
						}
						logger.info({
							message: `Datos de la petición ${id} actualizados correctamente dentro de la BD`,
							result: res,
						});
						callback(null, res);
					},
				);
		});
	};
	/**
	 * Devuelve la información de la petición solicitada
	 * @param {int} id - id de la petición de la que obtendremos información
	 * @param {function} callback - función de callback
	 */
	static getRequest(id, callback) {
		connection.get_connection((qb) => {
			qb.select('*').where('id_petition', id);
			qb.get(requestsTable, (err, res) => {
				qb.release();
				if (err) {
					logger.error({
						message: `Error al obtener la peticion con id ${id}`,
						error: err,
					});
				}
				logger.info({
					message: `Se obtuvo la información de la petición con id ${id} correctamente`,
					result: res,
				});
				callback(null, res[0]);
			});
		});
	};
	static getAllRequests(callback) {
		connection.get_connection((qb) => {
			qb.select('*');
			qb.get(requestsTable, (err, res) => {
				qb.release();
				if(err) {
					logger.error({
						message : `Error al obtener todas las peticiones`,
						error : err,
					});
				}
				logger.info({
					message : `Se obtuvieron todas las peticiones`,
					result : res
				});
				callback(null, res);
			});
		});
	};
}

module.exports = User;
