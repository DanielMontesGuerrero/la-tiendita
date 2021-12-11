const connection = require('../db/database.js');
const logger = require('../common/logger.js');

const purchaseTable = 'compras';
const usersTable = 'usuarios';
const productsTable = 'productos';
const storesTable = 'tiendas';

/**
 * Clase que interactua con la base de datos para peticiones relacionadas
 * con la tabla de compras
 */
class Purchase {
	/**
	 * constructor
	 * @param {any} purchase - datos de la compra
	 */
	constructor(purchase) {
		this.id_purchase = purchase.id_purchase;
		this.id_user = purchase.id_user;
		this.id_store = purchase.id_store;
		this.id_product = purchase.id_product;
		this.quantity = this.quantity;
		this.unitary_price = this.unitary_price;
		this.date = purchase.date;
		this.state = purchase.state;
	}

	/**
	 * valida si la compra es válida
	 * @param {Purchase} purchase - datos de la compra
	 */
	static isValid(purchase) {
		if (purchase.quantity <= 0) {
			throw new Error('La cantidad debe ser > 0');
		}
		if (purchase.unitary_price < 0) {
			throw new Error('El precio debe ser >= 0');
		}
	}

	/**
	 * crea una nueva compra
	 * @param {any} data - datos de la compra
	 * @param {func} callback - función de callback
	 * @return {void} void
	 */
	static create(data, callback) {
		try {
			for (let i = 0; i < data.length; i++) {
				this.isValid(data[i]);
				data[i].state = 'creado';
				// seconds since epoch
				data[i].date = Date.now() / 1000;
			}
		} catch (err) {
			logger.info({
				message: 'Compra no válida',
				error: err,
			});
			return callback(err, null);
		}
		connection.get_connection((qb) => {
			qb.insert_batch(purchaseTable, data, (err, res) => {
				qb.release();
				if (err) {
					logger.error({
						message: 'Error insertando compra',
						error: err,
					});
					return callback(err, null);
				}
				logger.info('Compra insertada');
				callback(null, res);
			});
		});
	}

	/**
	 * obtiene las compras de un usuario o una tienda
	 * @param {any} request - id para la consulta, id_user o id_store
	 * @param {func} callback - función de callback
	 */
	static getById(request, callback) {
		connection.get_connection((qb) => {
			const selectList = [
				`${purchaseTable}.id_purchase`,
				`${purchaseTable}.id_user`,
				`${purchaseTable}.id_store`,
				`${purchaseTable}.id_product`,
				`${purchaseTable}.quantity`,
				`${purchaseTable}.unitary_price`,
				`${purchaseTable}.date`,
				`${purchaseTable}.state`,
				'stores.name as storeName',
				'users.name as userName',
				'products.name as productName',
			];
			const userTmpTable = `
				(SELECT id_user, name
				FROM ${usersTable})
				users
			`;
			const storeTmpTable = `
				(SELECT id_store, name
				FROM ${storesTable})
				stores
			`;
			const productTmpTable = `
				(SELECT id_product, name
				FROM ${productsTable})
				products
			`;
			qb.select(selectList)
				.from(purchaseTable)
				.join(
					userTmpTable,
					`users.id_user=${purchaseTable}.id_user`,
					'left')
				.join(
					storeTmpTable,
					`stores.id_store=${purchaseTable}.id_store`,
					'left')
				.join(
					productTmpTable,
					`products.id_product=${purchaseTable}.id_product`,
					'left');
			if (request.id_user !== undefined) {
				qb.where(`${purchaseTable}.id_user`, request.id_user);
			} else {
				qb.where(`${purchaseTable}.id_store`, request.id_store);
			}
			qb.order_by('date', 'DESC');
			qb.get((err, res) => {
				qb.release();
				if (err) {
					logger.error({
						message: `Error al obtener compras ` +
						request.id_user ? 'del usuario:' + request.id_user :
							'de la tienda: ' + request.id_store,
						error: err,
					});
					return callback(err, null);
				}
				logger.info({
					message: 'Datos consultados de la compra ' +
					(request.id_user ? 'del usuario: ' + request.id_user :
						'de la tienda: ' + request.id_store),
					result: res,
				});
				callback(null, res);
			});
		});
	}

	/**
	 * actualiza el estado de una compra
	 * @param {int} id - id de la compra a actualizar
	 * @param {string} state - estado a actualizar
	 * @param {func} callback - función de callback
	 * @return {void} void
	 */
	static update(id, state, callback) {
		if (state !== 'pagado' && state !== 'entregado') {
			return callback(new Error('Estado no válido'), null);
		}
		connection.get_connection((qb) => {
			qb.update(
				purchaseTable,
				{state: state},
				{id_purchase: id},
				(err, res) => {
					qb.release();
					if (err) {
						logger.error({
							message: `Error actualizando el estado de la compra: ${id}`,
							error: err,
						});
						return callback(err, null);
					}
					logger.info({
						message: `Estado actualizado de la compra: ${id}`,
						result: res,
					});
					callback(null, res);
				});
		});
	}
}

module.exports = Purchase;

