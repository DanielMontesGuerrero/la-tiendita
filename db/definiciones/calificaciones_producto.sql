CREATE TABLE calificaciones_producto (
	id_product BIGINT(20) NOT NULL,
	id_user BIGINT(20) NOT NULL,
	score TINYINT(1) NOT NULL,
	`description` VARCHAR(255),
	PRIMARY KEY (id_product, id_user)
);
