const mysql = require('mysql2');
const config = require('./config.js');
const logger = require('../common/logger.js');

const connection = mysql.createConnection({
	host: config.HOST,
	user: config.USER,
	password: config.PASSWORD,
	database: config.DATABASE
});

connection.connect(error => {
	if (error) {
		logger.error({
			message: 'Error conectandose a la base de datos',
			error: errorror
		});
		throw error;
	}
	else {
		logger.info({
			message: 'Conexión a la base de datos exitosa!'
		});
	}
});

module.exports = connection;
