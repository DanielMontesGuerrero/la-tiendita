CREATE TABLE tiendas (
	id_tienda BIGINT(20) NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL UNIQUE,
	descripcion VARCHAR(255) NOT NULL,
	id_usuario BIGINT(20) NOT NULL,
	imagen VARCHAR(255),
	PRIMARY KEY (id_tienda, id_usuario)
);
