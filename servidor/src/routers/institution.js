const express = require('express');
const Institution = require('../controllers/institution');
const multer = require('multer');

const router = new express.Router();

router.post('/institution/image/:id',
	multer().single('image'),
	Institution.uploadImage,
);

router.post('/institution', Institution.create);

router.get('/institution/get/:id', Institution.get);

router.patch('/institution/:id', Institution.update);

module.exports = router;
