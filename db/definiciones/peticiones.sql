CREATE TABLE peticiones (
	id_peticion BIGINT(20) NOT NULL AUTO_INCREMENT,
	id_usuario BIGINT(20) NOT NULL,
	estado ENUM('pendiente', 'rechazado', 'aceptado') NOT NULL DEFAULT 'pendiente',
	PRIMARY KEY (id_peticion, id_usuario)
);
