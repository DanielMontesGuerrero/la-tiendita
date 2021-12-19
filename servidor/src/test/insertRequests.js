const fs = require('fs');
const path = require('path');
const request = require('postman-request');
const logger = require('../common/testLogger.js');
const config = require('../common/config');
// const utils = require('../comon/utils');
const fileFolderPath = '/data/file/';

const insertRequests = (userIds) => {
	let raw = fs.readFileSync(
		path.join(__dirname, '/data/requests.json'));
	const data = JSON.parse(raw);

	logger.info('Insertando requests');

	data.forEach((item) => {
		item.id_user = userIds[item.id_user];
		const filePath = path.join(__dirname, fileFolderPath, item.filename);
		let url = `${config.host}/user/request/${item.id_user}`;
		const options = {
			url: url,
			json: true,
			method : 'POST',
			formData : {
				file : fs.createReadStream(filePath),
			}
		};
		request.post(options, (error, response) => {
			if (error) {
				return logger.error({
					message: `Error creando request para usuario ${item.id_user} ${error}`,
					error: error,
				});
			}
			const respData = response.body;
			console.log(respData);
			if (respData.result) {
				logger.info({
					message: `Se inserto correctamente request para el usuario ${item.id_user}`,
					data: item,
					response: respData,
				});
			} else {
				logger.error({
					message: `Error insertando request para usario ${item.id_user}`, 
					error: respData,
				});
			}
		});
	});
};

module.exports = insertRequests;
