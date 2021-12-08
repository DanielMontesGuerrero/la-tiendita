CREATE TABLE productos_en_tienda (
	id_store BIGINT(20) NOT NULL,
	id_product BIGINT(20) NOT NULL,
	price SMALLINT(5) NOT NULL,
	quantity SMALLINT(5) NOT NULL,
	PRIMARY KEY (id_store, id_product)
);
