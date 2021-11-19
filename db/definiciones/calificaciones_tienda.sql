CREATE TABLE calificaciones_tienda (
	id_tienda BIGINT(20) NOT NULL,
	id_usuario BIGINT(20) NOT NULL,
	calificacion TINYINT(1) NOT NULL,
	descripcion VARCHAR(255),
	PRIMARY KEY (id_usuario, id_tienda)
);
