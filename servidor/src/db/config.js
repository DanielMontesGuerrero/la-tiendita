const dbHost = process.env.DATABASE_HOST || 'localhost';

module.exports = {
	HOST: dbHost,
	USER: 'root',
	PASSWORD: 'admin',
	DATABASE: 'la_tiendita'
};
