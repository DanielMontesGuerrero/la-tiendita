const Purchase = require('../models/purchase.js');
const logger = require('../common/logger.js');

exports.create = (req, res) => {
	const purchases = req.body.purchases;
	for (let i = 0; i < purchases.length; i++) {
		const data = purchases[i];
		if (data.id_user === undefined ||
			data.id_store === undefined ||
			data.id_product === undefined) {
			return res.status(400).send({
				result: false,
				description: 'Se necesita id del usario, tienda y producto',
			});
		}
		if (data.quantity === undefined) {
			return res.status(400).send({
				result: false,
				description: 'Se necesita la cantidad de productos comprados',
			});
		}
		if (data.unitary_price === undefined) {
			return res.status(400).send({
				result: false,
				description: 'Se necesita el precio unitario del producto',
			});
		}
	}
	logger.info({
		message: 'Registrando compra',
		data: purchases,
	});
	Purchase.create(purchases, (err, response) => {
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
	if (req.query.id_user === undefined && req.query.id_store === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita id del usuario o de la tienda',
		});
	}
	logger.info({
		message: 'Consultando compras ' + (req.query.id_user ?
			' del usuario: ' + req.query.id_user :
			' de la tienda: ' + req.query.id_store),
	});
	Purchase.getById(req.query, (err, response) => {
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
			description: 'Se necesita id de la compra',
		});
	}
	if (req.body.state === undefined) {
		return res.status(400).send({
			result: false,
			description: 'Se necesita el estado',
		});
	}
	logger.info({
		message: `Actualizando estado de la compra: ${req.params.id}`,
		data: {
			id: req.params.id,
			state: req.body.state,
		},
	});
	Purchase.update(req.params.id, req.body.state, (err, response) => {
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
