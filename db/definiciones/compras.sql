CREATE TABLE compras (
	id_compra BIGINT(20) NOT NULL AUTO_INCREMENT,
	id_usuario BIGINT(20) NOT NULL,
	id_tienda BIGINT(20) NOT NULL,
	id_producto BIGINT(20) NOT NULL,
	cantidad SMALLINT(5) NOT NULL,
	precio_unitario SMALLINT(5) NOT NULL,
	fecha BIGINT(20) NOT NULL,
	estado ENUM('creado', 'pagado', 'completado') NOT NULL DEFAULT 'creado',
	PRIMARY KEY (id_compra, id_usuario, id_tienda, id_producto)
);
