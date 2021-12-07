const Store = require('../models/store.js');
const logger = require('../common/logger.js');
const utils = require('../common/utils.js');

const insertStoreToDB = (store, res) => {
	Store.create(store, (err, result) => {
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
	if (data.description === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita una descripción',
		});
	}
	if (data.id_user === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita el id del usuario',
		});
	}
	logger.info({
		message: `Creando tienda: ${data.name}`,
		data: data,
	});
	const store = new Store({
		name: data.name,
		description: data.description,
		image: data.imageURL || undefined,
		quantity: data.quantity || '',
		unity: data.unity || '',
		id_user: data.id_user,
	});
	insertStoreToDB(store, res);
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
		const store = new Store({
			image: imageResponse.data.url,
		});
		Store.update({id: id, data: store}, (err, result) => {
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
		message: `Obteniendo tienda: ${id}`,
	});
	Store.getById(id, (err, result) => {
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

exports.update = (req, res) => {
	const data = req.body;
	const id = req.params.id;
	if (id === undefined) {
		res.status(400).send({
			result: false,
			message: 'Se necesita un id',
		});
	}
	const store = new Store(data);
	logger.info({
		message: `Modificando tienda con id: ${id}`,
		data: data,
	});
	Store.update({id: id, data: store}, (err, result) => {
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
