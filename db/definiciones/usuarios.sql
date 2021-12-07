CREATE TABLE usuarios (
	id_usuario BIGINT(20) NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(30) NOT NULL UNIQUE,
	email VARCHAR(30) NOT NULL UNIQUE,
	imagen VARCHAR(255),
	id_institucion BIGINT(20),
	tipo_usuario ENUM('admin', 'vendendor', 'usuario') NOT NULL DEFAULT 'usuario',
	PRIMARY KEY (id_usuario, nombre)
);
