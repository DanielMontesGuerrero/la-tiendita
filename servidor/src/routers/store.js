const express = require('express');
const multer = require('multer');
const Store = require('../controllers/store.js');

const router = new express.Router();

router.post('/store/image/:id',
	multer().single('image'),
	Store.uploadImage,
);

router.post('/store/score/:id', Store.score);

router.post('/store', Store.create);

router.get('/store/:id', Store.get);

router.patch('/store/:id', Store.update);

module.exports = router;
