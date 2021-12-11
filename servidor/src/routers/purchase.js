const express = require('express');
const Purchase = require('../controllers/purchase.js');

const router = new express.Router();

router.post('/purchase', Purchase.create);

router.get('/purchase', Purchase.get);

router.patch('/purchase/:id', Purchase.update);

module.exports = router;
