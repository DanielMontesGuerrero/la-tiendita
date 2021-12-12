CREATE TABLE usuarios (
	id_user BIGINT(20) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(30) NOT NULL UNIQUE,
	email VARCHAR(30) NOT NULL UNIQUE,
	`image` VARCHAR(255),
	id_institution BIGINT(20),
	userType ENUM('admin', 'vendendor', 'usuario') NOT NULL DEFAULT 'usuario',
	password VARCHAR(256) NOT NULL,
	PRIMARY KEY (id_user, name)
);
