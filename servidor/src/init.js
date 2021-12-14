const insertProducts = require('./test/insertProducts.js');
const insertUsers = require('./test/insertUsers.js');
const insertStores = require('./test/insertStores.js');
const insertScores = require('./test/insertScores.js');
const insertPurchases = require('./test/insertPurchases.js');
const insertInstitutions = require('./test/insertInstitutions.js');
const insertDeliveries = require('./test/insertDeliveries.js');
<<<<<<< HEAD
// const insertPaymentMethods = require('./test/insertPaymentMethods.js');
const insertProductsInStore = require('./test/insertProductsInStore.js')
=======
const insertPaymentMethods = require('./test/insertPaymentMethods.js');
>>>>>>> d00aa777a4822f82e586346a25b5e5e885f149ce

const init = async () => {
	// insertar productos
	const productIds = await insertProducts();

	// insertar escuelas
	const institutionIds = await insertInstitutions();

	// insertar usuarios
	const userIds = await insertUsers(institutionIds);

	// insertar tiendas
	const storeIds = await insertStores(userIds);

	// insertar calificaciones
	insertScores(productIds, userIds, storeIds);

	// insertar compras
	insertPurchases(productIds, userIds, storeIds);

	// insertar puntos de entrega
	insertDeliveries(storeIds, institutionIds);

	// insertar métodos de pago
	insertPaymentMethods(storeIds);

	// insertar productos en tiendas
	insertProductsInStore(storeIds, productIds);	
};

init();
