const Product = require('../models/product.js');
const logger = require('../common/logger.js');
const utils = require('../common/utils.js');

const insertProductToDB = (product, res) => {
	Product.create(product, (err, result) => {
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
	logger.info({
		message: `Creando producto: ${data.name}`,
		data: data,
	});
	const product = new Product({
		name: data.name,
		description: data.description,
		image: data.imageURL || undefined,
		quantity: data.quantity || undefined,
		unity: data.unity || '',
	});
	insertProductToDB(product, res);
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
		const product = new Product({
			image: imageResponse.data.url,
		});
		Product.update({id: id, data: product}, (err, result) => {
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
	if (req.query.includeScore) {
		req.query.includeScore = req.query.includeScore === 'true';
	}
	logger.info({
		message: `Obteniendo producto: ${id}`,
	});
	Product.getById(id, req.query, (err, result) => {
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
	const product = new Product(data);
	logger.info({
		message: `Modificando producto con id: ${id}`,
		data: data,
	});
	Product.update({id: id, data: product}, (err, result) => {
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

exports.score = (req, res) => {
	const data = req.body;
	const id = req.params.id;
	if (id === undefined && data.id_product === undefined) {
		logger.error({
			message: 'Error al registrar calificación del producto, ' +
			'no se encontró id del producto',
			data: data,
			id: id,
		});
		return res.status(400).send({
			result: false,
			description: 'se necesita el id del producto',
		});
	}
	if (data.id_user === undefined) {
		logger.error({
			message: 'Error al registrar calificación del producto, ' +
			'no se encontró id del usuario',
			data: data,
			id: id,
		});
		return res.status(400).send({
			result: false,
			description: 'se necesita el id del usuario',
		});
	}
	if (data.score === undefined) {
		logger.error({
			message: 'Error al registrar calificación del producto, ' +
			'se encontró la calificación',
			data: data,
			id: id,
		});
		return res.status(400).send({
			result: false,
			description: 'se necesita una calificación entre 0-5',
		});
	}
	logger.info({
		message: `Añadiendo calificación de ${data.score} a producto con id: ${id}`,
		data: data,
	});
	Product.addScore(id, data, (err, result) => {
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
