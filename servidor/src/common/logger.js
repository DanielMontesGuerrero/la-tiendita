const winston = require('winston');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: '../../logs/logs.log' })
	],
	format: winston.format.combine(
		winston.format.colorize({ all: true}),
		winston.format.simple(),
		winston.format.timestamp({ format: 'DD-MM-YYY HH:mm:ss'}),
		winston.format.errors({ stack: true}),
	)
});

module.exports = logger;
