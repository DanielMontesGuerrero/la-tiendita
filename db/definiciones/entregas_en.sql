CREATE TABLE entregas_en (
	id_entrega BIGINT(20) NOT NULL AUTO_INCREMENT,
	id_tienda BIGINT(20) NOT NULL,
	id_institucion BIGINT(20) NOT NULL,
	lugar VARCHAR(255) NOT NULL,
	PRIMARY KEY (id_entrega, id_tienda, id_institucion)
);
