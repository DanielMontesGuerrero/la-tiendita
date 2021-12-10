const config = require('./config.js');
const logger = require('../common/logger.js');
const QueryBuilder = require('node-querybuilder');

const settings = {
	host: config.HOST,
	user: config.USER,
	password: config.PASSWORD,
	database: config.DATABASE,
};

let pool = null;

try {
	pool = new QueryBuilder(settings, 'mysql', 'pool');
	logger.info('Conexion exitosa')
} catch (error) {
	logger.error({
		message: 'Error conectandose a la base de datos',
		error: error,
	});
	throw error;
}

module.exports = pool;
