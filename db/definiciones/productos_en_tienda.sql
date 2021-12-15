CREATE TABLE productos_en_tienda (
	id_store BIGINT(20) NOT NULL,
	id_product BIGINT(20) NOT NULL,
	price DECIMAL(10, 2) NOT NULL,
	stock SMALLINT(5) NOT NULL,
	PRIMARY KEY (id_store, id_product)
);
