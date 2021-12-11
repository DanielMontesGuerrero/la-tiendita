const express = require('express');
const Cart = require('../controllers/cart.js');

const router = new express.Router();

router.post('/cart/:id', Cart.update);

router.get('/cart/:id', Cart.get);

module.exports = router;
