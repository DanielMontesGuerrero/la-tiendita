const express = require('express');
const multer = require('multer');
const logger = require('../common/logger.js');
const User = require('../controllers/user.js');
const router = new express.Router();

router.post('/user/image/:id',
	multer().single('image'),
	User.uploadImage,
);

router.post('/user/request', (req, res) => {
	const data = req.body;
	logger.info({
		message: `Creando petición para usuario con id: ${data.id_usuario}`,
		data: data,
	});
	res.send({
		result: true,
	});
});

router.get('/user/request', (req, res) => {
	const data = req.body;
	logger.info({
		message: 'Obteniendo las peticiones',
		data: data,
	});
	res.send({
		result: true,
		data: {
			peticiones: [
				{
					id_peticion: 1,
					id_usuario: 2,
					estado: 'pendiente',
				},
			],
		},
	});
});

router.patch('/user/request/:id', (req, res) => {
	const data = req.body;
	logger.info({
		message: `Modificando petición con id: ${req.params.id}`,
		data: data,
	});
	res.send({
		result: true,
	});
});

router.post('/user/login', User.login);

router.post('/user', User.create);

router.get('/user/:id', User.get);

router.patch('/user/:id', User.update);

module.exports = router;
