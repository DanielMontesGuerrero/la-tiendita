const express = require('express');
const multer = require('multer');
const Store = require('../controllers/store.js');

const router = new express.Router();

router.post('/store/image/:id',
	multer().single('image'),
	Store.uploadImage,
);

router.post('/store/score/:id', Store.score);

router.post('/store/delivery/:id', Store.createDeliveryPoint);

router.get('/store/delivery/:id', Store.getDeliveryPoints);

router.patch('/store/delivery/:id', Store.updateDeliveryPoint);

router.post('/store', Store.create);

router.get('/store/:id', Store.get);

router.patch('/store/:id', Store.update);

module.exports = router;
