CREATE TABLE productos (
	id_product BIGINT(20) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL UNIQUE,
	`description` VARCHAR(255) NOT NULL,
	`image` VARCHAR(255),
	quantity INT(10) CHECK (cantidad > 0),
	unity TINYTEXT,
	PRIMARY KEY (id_product, name)
);
