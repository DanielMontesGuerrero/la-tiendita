const Institution = require('../models/institution');
const logger = require('../common/logger.js');
const utils = require('../common/utils.js');

exports.create = (req, res) => {
	const data = req.body;
	if (data.name === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita un nombre',
		});
	}
	logger.info({
		message: 'Registrando institución',
		data: data,
	});
	Institution.create(data, (err, response) => {
		if (err) {
			const errorDescription = err.sqlMessage || err.message;
			return res.status(400).send({
				result: false,
				description: errorDescription,
			});
		}
		res.send({
			result: true,
			response: response,
		});
	});
};

exports.get = (req, res) => {
	if (req.params.id === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita id de la institución',
		});
	}
	logger.info({
		message: `Consultando institución: ${req.params.id}`,
		data: {
			id: req.params.id,
			data: req.body,
		},
	});
	Institution.getById(req.params.id, (err, response) => {
		if (err) {
			const errorDescription = err.sqlMessage || err.message;
			return res.status(400).send({
				result: false,
				description: errorDescription,
			});
		}
		res.send({
			result: true,
			response: response,
		});
	});
};

exports.update = (req, res) => {
	if (req.params.id === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita id de la institución',
		});
	}
	logger.info({
		message: `Actualizando datos de la institución: ${req.params.id}`,
		data: {
			id: req.params.id,
			data: req.body,
		},
	});
	Institution.update(req.params.id, req.body, (err, response) => {
		if (err) {
			const errorDescription = err.sqlMessage || err.message;
			return res.status(400).send({
				result: false,
				description: errorDescription,
			});
		}
		res.send({
			result: true,
			response: response,
		});
	});
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
		const institution = new Institution({
			image: imageResponse.data.url,
		});
		Institution.update(id, institution, (err, result) => {
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
	});
};
