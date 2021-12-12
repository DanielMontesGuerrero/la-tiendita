const fs = require('fs');
const path = require('path');
const utils = require('../common/utils.js');
const logger = require('../common/testLogger.js');
const config = require('../common/config');

const imgFolderPath = '/data/img/';

const insertStores = async (userIds) => {
	const raw = fs.readFileSync(
		path.join(__dirname, '/data/stores.json'));
	const stores = JSON.parse(raw);

	logger.info('Insertando tiendas');

	const storeIds = await Promise.all(stores.map(async (item) => {
		let options = {
			url: `${config.host}/store`,
			json: true,
			body: item,
			method: 'POST',
		};
		item.id_user = userIds[item.id_user - 1];
		try {
			const response = await utils.promisfiedRequest(options);
			const respData = response.body;
			if (respData.result) {
				logger.info({
					message: `Tienda insertada: ${item.name}`,
					data: item,
					response: respData,
				});
				if (item.imageFile !== undefined) {
					imagePath = path.join(__dirname, imgFolderPath, item.imageFile);
					options = {
						url: `${config.host}/store/image/${respData.response.insertId}`,
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
					error: response.body,
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
	return storeIds;
};

module.exports = insertStores;

