CREATE TABLE productos (
	id_producto BIGINT(20) NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL UNIQUE,
	descripcion VARCHAR(255) NOT NULL,
	imagen VARCHAR(255),
	cantidad INT(10),
	unidad TINYTEXT,
	PRIMARY KEY (id_producto, nombre)
);
