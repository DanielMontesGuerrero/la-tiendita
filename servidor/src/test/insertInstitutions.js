const fs = require('fs');
const path = require('path');
const logger = require('../common/testLogger.js');
const config = require('../common/config');
const utils = require('../common/utils');

const imgFolderPath = '/data/img/';

const insertInstitutions = async () => {
	const raw = fs.readFileSync(
		path.join(__dirname, '/data/institutions.json'));
	const institutions = JSON.parse(raw);

	logger.info('Insertando instituciones');

	const institutionIds = await Promise.all(institutions.map(async (item) => {
		let options = {
			url: `${config.host}/institution`,
			json: true,
			body: item,
			method: 'POST',
		};
		try {
			const response = await utils.promisfiedRequest(options);
			const respData = response.body;
			if (respData.result) {
				logger.info({
					message: `Institución insertada: ${item.name}`,
					data: item,
					response: respData,
				});
				if (item.imageFile !== undefined) {
					imagePath = path.join(__dirname, imgFolderPath, item.imageFile);
					options = {
						url: `${config.host}/institution/` +
							`image/${respData.response.insertId}`,
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
							response: responseImg.body,
						});
					} else {
						logger.info({
							message: `Imagen enviada de la institución: ${item.name}`,
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
			console.log(error);
			return -1;
		}
	}));
	return institutionIds;
};

module.exports = insertInstitutions;
