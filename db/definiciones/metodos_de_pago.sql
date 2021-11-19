CREATE TABLE metodos_de_pago (
	id_metodo BIGINT(20) NOT NULL AUTO_INCREMENT,
	id_tienda BIGINT(20) NOT NULL,
	descripcion VARCHAR(255) NOT NULL,
	PRIMARY KEY (id_metodo, id_tienda)
);
