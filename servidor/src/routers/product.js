const express = require('express');
const multer = require('multer');
const Product = require('../controllers/product.js');

const router = new express.Router();

router.post('/product/image/:id',
	multer().single('image'),
	Product.uploadImage,
);

router.post('/product/score/:id', Product.score);

router.post('/product', Product.create);

router.get('/product/:id', Product.get);

router.patch('/product/:id', Product.update);

module.exports = router;
