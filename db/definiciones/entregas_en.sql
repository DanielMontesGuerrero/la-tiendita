CREATE TABLE entregas_en (
	id_delivery BIGINT(20) NOT NULL AUTO_INCREMENT,
	id_store BIGINT(20) NOT NULL,
	id_institution BIGINT(20) NOT NULL,
	description VARCHAR(255) NOT NULL,
	PRIMARY KEY (id_delivery, id_store, id_institution)
);
