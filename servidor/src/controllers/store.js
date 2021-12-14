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
	if (req.query.includeScore) {
		req.query.includeScore = req.query.includeScore === 'true';
	}
	if (req.query.onlyTop) {
		req.query.onlyTop = req.query.onlyTop === 'true';
		req.query.includeScore = true;
	}
	logger.info({
		message: `Obteniendo tienda: ${id}`,
	});
	Store.getById(id, req.query, (err, result) => {
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

exports.score = (req, res) => {
	const data = req.body;
	const id = req.params.id;
	if (id === undefined && data.id_store === undefined) {
		logger.error({
			message: 'Error al registrar calificación de la tienda, ' +
			'no se encontró id de la tienda',
			data: data,
			id: id,
		});
		return res.status(400).send({
			result: false,
			description: 'se necesita el id de la tienda',
		});
	}
	if (data.id_user === undefined) {
		logger.error({
			message: 'Error al registrar calificación de la tienda, ' +
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
			message: 'Error al registrar calificación de la tienda, ' +
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
		message: `Añadiendo calificación de ${data.score} a tienda con id: ${id}`,
		data: data,
	});
	Store.addScore(id, data, (err, result) => {
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

exports.createDeliveryPoint = (req, res) => {
	const data = req.body;
	const id = req.params.id;
	if (data.id_institution === undefined ||
		id === undefined) {
		res.status(400).send({
			result: false,
			description: 'Se necesita id de la institucion y la tienda',
		});
	}
	if (data.description === undefined) {
		res.status(400).send({
			result: false,
			description: 'Se necesita la descripción del punto de entrega',
		});
	}
	logger.info({
		message: `Creando punto de entrega de la tienda: ${id}`,
		data: data,
	});
	Store.createDeliveryPoint(id, data, (err, response) => {
		if (err) {
			return res.status(400).send({
				result: false,
				description: err.sqlMessage,
			});
		}
		res.send({
			result: true,
			response: response,
		});
	});
};

exports.getDeliveryPoints = (req, res) => {
	const id = req.params.id;
	if (id === undefined) {
		res.status(400).send({
			result: false,
			description: 'Se necesita id de la tienda',
		});
	}
	logger.info({
		message: `Obteniendo puntos de entrega de la tienda: ${id}`,
		id_store: id,
	});
	Store.getDeliveryPoints(id, (err, response) => {
		if (err) {
			return res.status(400).send({
				result: false,
				description: err.sqlMessage,
			});
		}
		res.send({
			result: true,
			response: response,
		});
	});
};

exports.updateDeliveryPoint = (req, res) => {
	const data = req.body;
	const id = req.params.id;
	if (data.description === undefined ||
		id === undefined) {
		res.status(400).send({
			result: false,
			description: 'Se necesita id de la institucion y la tienda',
		});
	}
	if (data.description === undefined) {
		res.status(400).send({
			result: false,
			description: 'Se necesita la descripción del punto de entrega',
		});
	}
	logger.info({
		message: `Actualizando punto de entrega de la tienda: ${id}`,
		data: data,
	});
	Store.updateDeliveryPoint(id, data, (err, response) => {
		if (err) {
			return res.status(400).send({
				result: false,
				description: err.sqlMessage,
			});
		}
		res.send({
			result: true,
			response: response,
		});
	});
};

exports.createProductInStore = (req, res) => {
	const data = req.body;
	const id = req.params.id;
	if (data.id_product === undefined ||
		id === undefined) {
		res.status(400).send({
			result: false,
			description: 'Se necesita el id del producto que se quiere insertar',
		});
	}
	if (data.quantity === undefined) {
		res.status(400).send({
			result: false,
			description: 'Se necesita la cantidad de productos en stock',
		});
	}
	if (data.price === undefined) {
		res.status(400).send({
			result: false,
			description: 'Se necesita el precio del producto',
		});
	}
	logger.info({
		message: `Creando producto dentro de la  tienda: ${id}`,
		data: data,
	});
	Store.createProductInStore(id, data, (err, response) => {
		if (err) {
			return res.status(400).send({
				result: false,
				description: err.sqlMessage,
			});
		}
		res.send({
			result: true,
			response: response,
		});
	});
};

exports.getProductsInStore = (req, res) => {
	const id = req.params.id;
	if (id === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita id de la tienda',
		});
	}
	logger.info({
		message: `Obteniendo los productos de la tienda: ${id}`,
		id_store: id,
	});
	Store.getProductsInStore(id, (err, response) => {
		if (err) {
			return res.status(400).send({
				result: false,
				description: err.sqlMessage,
			});
		}
		res.send({
			result: true,
			response: response,
		});
	});
};

exports.updateProductInStore = (req, res) => {
	const data = req.body;
	const id = req.params.id;
	if(id === undefined) {
		return res.status(400).send({
			result : false,
			description : 'Se necesita el id de la tienda',
		});
	}
	logger.info({
		message: `Actualizando producto en la tienda: ${id}`,
		id_store : id,
	});
	Store.updateProductInStore(id, data, (err,response) => {
		if(err) {
			return res.status(400).send({
				result : false,
				description : err.sqlMessage,
			});
		}
		res.send({
			result : true,
			response : response,
		});
	});
};