CREATE TABLE instituciones (
	id_institution BIGINT(20) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL UNIQUE,
	image VARCHAR(255),
	PRIMARY KEY (id_institution)
);
