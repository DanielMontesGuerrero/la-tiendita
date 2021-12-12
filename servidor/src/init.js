const insertProducts = require('./test/insertProducts.js');
const insertUsers = require('./test/insertUsers.js');
const insertStores = require('./test/insertStores.js');
const insertScores = require('./test/insertScores.js');
const insertPurchases = require('./test/insertPurchases.js');

const init = async () => {
	// insertar productos
	const productIds = await insertProducts();

	// insertar usuarios
	const userIds = await insertUsers();

	// insertar tiendas
	const storeIds = await insertStores(userIds);

	// insertar calificaciones
	insertScores(productIds, userIds, storeIds);

	// insertar compras
	insertPurchases(productIds, userIds, storeIds);
};

init();
