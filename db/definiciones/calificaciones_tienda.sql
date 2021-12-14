CREATE TABLE calificaciones_tienda (
	id_store BIGINT(20) NOT NULL,
	id_user BIGINT(20) NOT NULL,
	score DECIMAL(2,1) NOT NULL,
	`description` VARCHAR(255),
	PRIMARY KEY (id_user, id_store)
);
