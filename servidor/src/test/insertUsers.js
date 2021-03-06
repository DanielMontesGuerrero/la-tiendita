const fs = require('fs');
const path = require('path');
const logger = require('../common/testLogger.js');
const config = require('../common/config');
const utils = require('../common/utils');

const imgFolderPath = '/data/img/';

const insertUsers = async (institutionIds) => {
	const raw = fs.readFileSync(
		path.join(__dirname, '/data/users.json'));
	const user = JSON.parse(raw);

	logger.info('Insertando usuarios');

	const userIds = await Promise.all(user.map(async (item) => {
		item.id_institution = institutionIds[item.id_institution - 1];
		let options = {
			url: `${config.host}/user`,
			json: true,
			body: item,
			method: 'POST',
		};
		try {
			const response = await utils.promisfiedRequest(options);
			const respData = response.body;
			if (respData.result) {
				logger.info({
					message: `Producto insertado: ${item.name}`,
					data: item,
					response: respData,
				});
				if (item.imageFile !== undefined) {
					imagePath = path.join(__dirname, imgFolderPath, item.imageFile);
					options = {
						url: `${config.host}/user/image/${respData.response.insertId}`,
						json: true,
						formData: {
							image: fs.createReadStream(imagePath),
						},
						method: 'POST',
					};
					const responseImg = await utils.promisfiedRequest(options);
					if (!responseImg.body.result) {
						logger.error({
							message: `Error enviando imagen de: ${item.name}`,
							error: error,
						});
					} else {
						logger.info({
							message: `Imagen enviada del producto: ${item.name}`,
							response: responseImg.body,
						});
					}
				}
				return respData.response.insertId;
			} else {
				logger.error({
					message: `Error insertando: ${item.name}`,
					error: response.description,
				});
				return -1;
			}
		} catch (error) {
			logger.error({
				message: `Error insertando: ${item.name}`,
				error: error,
			});
			return -1;
		}
	}));
	return userIds;
};

module.exports = insertUsers;
