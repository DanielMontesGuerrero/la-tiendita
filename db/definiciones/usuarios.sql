CREATE TABLE usuarios (
	id_usuario BIGINT(20) NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(30) NOT NULL,
	email VARCHAR(30) NOT NULL,
	boleta VARCHAR(15),
	id_institucion BIGINT(20),
	tipo_usuario ENUM('admin', 'vendendor', 'usuario') NOT NULL DEFAULT 'usuario',
	verificado BOOL NOT NULL DEFAULT false,
	PRIMARY KEY (id_usuario, nombre)
);
