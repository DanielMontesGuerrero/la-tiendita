CREATE TABLE tiendas (
	id_store BIGINT(20) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL UNIQUE,
	`description` VARCHAR(255) NOT NULL,
	id_user BIGINT(20) NOT NULL,
	`image` VARCHAR(255),
	PRIMARY KEY (id_store, id_user)
);
