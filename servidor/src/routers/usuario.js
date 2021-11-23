const express = require('express');
const logger = require('../common/logger.js');
const router = new express.Router();

router.post('/usuario/peticion', (req, res) => {
	const data = req.body;
	logger.info({
		message: `Creando petición para usuario con id: ${data.id_usuario}`,
		data: data,
	});
	res.send({
		result: true,
	});
});

router.get('/usuario/peticion', (req, res) => {
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

router.patch('/usuario/peticion/:id', (req, res) => {
	const data = req.body;
	logger.info({
		message: `Modificando petición con id: ${req.params.id}`,
		data: data,
	});
	res.send({
		result: true,
	});
});


router.get('/usuario/:identificador', (req, res) => {
	// TODO: buscar usuario ya sea por id o por nombre
	logger.info(`Getting usuario: ${req.params.identificador}`);
	res.send({
		result: true,
		data: {
			id_usuario: 123,
			nombre: 'Fulano',
			email: 'fulano@gmail.com',
			boleta: 2019630000,
			id_institucion: 1,
			tipo_usuario: 'usuario',
			verificado: false,
		},
	});
});

router.post('/usuario', (req, res) => {
	// TODO: registrar usuario
	const usuario = req.body;
	logger.info({
		message: `Registrando usuario ${usuario.nombre}`,
		usuario: usuario,
	});
	res.send({
		result: true,
	});
});

router.patch('/usuario/:identificador', (req, res) => {
	const usuario = req.body;
	logger.info({
		message: `Actualizandon usuario con id: ${usuario.id}`,
		data: usuario,
	});
	res.send({
		result: true,
	});
});


// TODO:
// Implementar funcionalidad

module.exports = router;

