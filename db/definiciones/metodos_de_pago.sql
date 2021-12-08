CREATE TABLE metodos_de_pago (
	id_method BIGINT(20) NOT NULL AUTO_INCREMENT,
	id_store BIGINT(20) NOT NULL,
	`description` VARCHAR(255) NOT NULL,
	PRIMARY KEY (id_method, id_store)
);
