const express = require('express');
const multer = require('multer');
const User = require('../controllers/user.js');

const router = new express.Router();

router.post('/user/image/:id',
	multer().single('image'),
	User.uploadImage,
);

router.post('/user/request/:id',
	multer({dest: 'uploads/'}).single('file'),
	User.createRequest,
);

router.get('/user/get_all_requests', User.getAllRequests);

router.get('/user/request/:id', User.getRequest);

router.patch('/user/request/:id', User.updateRequest);

router.post('/user/login', User.login);

router.post('/user', User.create);

router.get('/user/:id', User.get);

router.patch('/user/:id', User.update);

module.exports = router;
