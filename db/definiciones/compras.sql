CREATE TABLE compras (
	id_purchase BIGINT(20) NOT NULL AUTO_INCREMENT,
	id_user BIGINT(20) NOT NULL,
	id_store BIGINT(20) NOT NULL,
	id_product BIGINT(20) NOT NULL,
	quantity SMALLINT(5) NOT NULL,
	unitary_price SMALLINT(5) NOT NULL,
	`date` BIGINT(20) NOT NULL,
	`state` ENUM('creado', 'pagado', 'completado') NOT NULL DEFAULT 'creado',
	PRIMARY KEY (id_compra, id_usuario, id_tienda, id_producto)
);
