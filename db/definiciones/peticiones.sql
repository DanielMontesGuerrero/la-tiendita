CREATE TABLE peticiones (
	id_petition BIGINT(20) NOT NULL AUTO_INCREMENT,
	id_user BIGINT(20) NOT NULL,
	voucher VARCHAR(255) NOT NULL,
	`state` ENUM('pendiente', 'rechazado', 'aceptado') NOT NULL DEFAULT 'pendiente',
	PRIMARY KEY (id_petition, id_user)
);
