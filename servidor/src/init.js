const insertProducts = require('./test/insertProducts.js');
const insertUsers = require('./test/insertUsers.js');
const insertStores = require('./test/insertStores.js');

const init = async () => {
	// insertar productos
	await insertProducts();

	// insertar usuarios
	const userIds = await insertUsers();

	// insertar tiendas
	await insertStores(userIds);
};

init();
