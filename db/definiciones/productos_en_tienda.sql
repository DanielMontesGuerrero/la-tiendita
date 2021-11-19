CREATE TABLE productos_en_tienda (
	id_tienda BIGINT(20) NOT NULL,
	id_producto BIGINT(20) NOT NULL,
	precio SMALLINT(5) NOT NULL,
	cantidad SMALLINT(5) NOT NULL,
	PRIMARY KEY (id_tienda, id_producto)
);
