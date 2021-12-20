const User = require('../models/user.js');
const logger = require('../common/logger.js');
const utils = require('../common/utils.js');

const insertUserToDB = (user, res) => {
	User.create(user, (err, result) => {
		if (err) {
			const errorDescription = err.sqlMessage || err.message;
			return res.status(400).send({
				result: false,
				description: errorDescription,
			});
		}
		res.send({
			result: true,
			response: result,
		});
	});
};

exports.create = (req, res) => {
	const data = req.body;
	if (data.name === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita un nombre',
		});
	}
	if (data.email === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita una email',
		});
	}
	if (data.password === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita una contraseña',
		});
	}
	logger.info({
		message: `Creando usuario: ${data.name}`,
		data: data,
	});
	const user = new User({
		name: data.name,
		email: data.email,
		image: data.imageURL || undefined,
		id_institution: data.id_institution || null,
		userType: data.userType || 'usuario',
		password: data.password,
	});
	insertUserToDB(user, res);
};

exports.uploadImage = (req, res) => {
	if (!req.file) {
		logger.info({
			message: 'No se encontró el archivo en la petición',
			request: req,
		});
		return res.send({
			result: false,
			description: 'No se envió el archivo',
		});
	}
	const id = req.params.id;
	const image = req.file.buffer;
	utils.uploadImage(image, (error, imageResponse) => {
		if (error) {
			logger.info({
				message: `No se pudo subir la imagen al servidor`,
				response: imageResponse,
			});
			return res.send({result: false, response: imageResponse});
		}
		const user = new User({
			image: imageResponse.data.url,
		});
		User.update({id: id, data: user}, (err, result) => {
			if (err) {
				return res.status(400).send({
					result: false,
					description: err.sqlMessage,
				});
			}
			res.send({
				result: true,
				response: result,
			});
		});
	});
};

exports.get = (req, res) => {
	const id = req.params.id;
	if (id === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita un id',
		});
	}
	logger.info({
		message: `Obteniendo usuario: ${id}`,
	});
	User.getById(id, (err, result) => {
		if (err) {
			return res.status(400).send({
				result: false,
				description: err.sqlMessage,
			});
		}
		console.log(result);
		res.send({
			result: true,
			response: result,
		});
	});
};

exports.update = (req, res) => {
	const data = req.body;
	const id = req.params.id;
	if (id === undefined) {
		res.status(400).send({
			result: false,
			message: 'Se necesita un id',
		});
	}
	const user = new User(data);
	logger.info({
		message: `Modificando usuario con id: ${id}`,
		data: data,
	});
	User.update({id: id, data: user}, (err, result) => {
		if (err) {
			return res.status(400).send({
				result: false,
				description: err.sqlMessage,
			});
		}
		res.send({
			result: true,
			response: result,
		});
	});
};

exports.login = (req, res) => {
	const data = req.body;
	if (data.email === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita un emial',
		});
	}
	if (data.password === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita una contraseña',
		});
	}
	User.login(data, (err, result) => {
		if (err) {
			res.status(400).send({
				result: false,
				description: err.sqlMessage,
			});
		}
		res.send({
			result: true,
			response: result,
		});
	});
};

exports.createRequest = (req, res) => {
	if (req.params.id === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita el id del usuario',
		});
	}
	if (req.file === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita que la peticion tenga un comprobante',
		});
	}
	utils.uploadFile(req.file, (err, result) => {
		if (err) {
			return res.status(400).send({
				result: false,
				description: 'Hubo un error al tratar de subir el archivo a dropbox ',
			});
		}
		const newData = {
			'voucher': result.id,
			'id_user': req.params.id,
		};
		User.createRequest(newData, (err, result) => {
			if (err) {
				return res.status(400).send({
					result: false,
					description: err.sqlMessage,
				});
			}
			res.send({
				result: true,
				response: result,
			});
		});
	});
};

exports.updateRequest = (req, res) => {
	const id = req.params.id;
	const data = req.body;
	if (id === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita el id de la petición que se quiere modificar',
		});
	}
	User.updateRequest(id, data, (err, result) => {
		if (err) {
			return res.status(400).send({
				result: false,
				description: err.sqlMessage,
			});
		}
		res.send({
			result: true,
			response: result,
		});
	});
};

exports.getRequest = (req, res) => {
	const id = req.params.id;
	if (id === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita el id de la petición ' +
			'para obtener la informacion',
		});
	}
	User.getRequest(id, (err, result) => {
		if (err) {
			return res.status(400).send({
				result: false,
				description: err.sqlMessage,
			});
		}
		utils.getUrlFile(result.voucher, (err, resultU) => {
			if (err) {
				return res.status(400).send({
					result: false,
					description: err,
				});
			}
			resultU.body = JSON.parse(resultU.body);
			res.send({
				result: true,
				response: resultU.body.link,
			});
		});
	});
};

exports.getAllRequests = (req, res) => {
	User.getAllRequests((err, result) => {
		if (err) {
			res.status(400).send({
				result: false,
				description: err.sqlMessage,
			});
		}
		res.send({
			result: true,
			response: result,
		});
	});
};
