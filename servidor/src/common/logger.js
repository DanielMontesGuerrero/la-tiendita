const winston = require('winston');

const customFormat = winston.format.printf(({level, timestamp, message}) => {
	return `[${level} at ${timestamp}] ${message}`;
});

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize({all: true}),
				customFormat,
			),
		}),
		new winston.transports.File({
			filename: './logs/logs.log',
			format: winston.format.json(),
		}),
	],
	format: winston.format.combine(
		winston.format.timestamp({format: 'DD-MM-YYYY HH:mm:ss'}),
		winston.format.errors({stack: true}),
	),
});

module.exports = logger;
