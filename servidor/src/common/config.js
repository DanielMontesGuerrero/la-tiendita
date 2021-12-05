const port = process.env.PORT || 8080;

const config = {
	imageServer: 'https://api.imgbb.com/1/upload',
	imageBBKey: '000509dbffe1b2f326b40a42c28a0ceb',
	port: port,
	host: `http://localhost:${port}`,
};

module.exports = config;
