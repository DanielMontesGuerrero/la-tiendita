CREATE TABLE calificaciones_producto (
	id_producto BIGINT(20) NOT NULL,
	id_usuario BIGINT(20) NOT NULL,
	calificacion TINYINT(1) NOT NULL,
	descripcion VARCHAR(255),
	PRIMARY KEY (id_producto, id_usuario)
);
