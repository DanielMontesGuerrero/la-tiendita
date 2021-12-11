const Cart = require('../models/cart.js');
const logger = require('../common/logger.js');

exports.update = (req, res) => {
	if (req.params.id === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita el id del usuario',
		});
	}
	logger.info({
		message: `Actualizando carrito del usuario: ${req.params.id}`,
		data: req.body,
	});
	Cart.update(req.params.id, req.body, (err, response) => {
		if (err) {
			return res.status(400).send({
				result: false,
				description: err,
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
			description: 'Se necesita el id del usuario',
		});
	}
	logger.info({
		message: `Obteniendo carrito del usuario: ${req.params.id}`,
	});
	Cart.get(req.params.id, (err, response) => {
		if (err) {
			return res.status(400).send({
				result: false,
				description: err,
			});
		}
		res.send({
			result: true,
			response: response,
		});
	});
};
