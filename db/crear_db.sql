DROP DATABASE IF EXISTS la_tiendita;
CREATE DATABASE la_tiendita;

USE la_tiendita;

DROP TABLE IF EXISTS calificaciones_producto;
DROP TABLE IF EXISTS calificaciones_tienda;
DROP TABLE IF EXISTS compra;
DROP TABLE IF EXISTS entregas_en;
DROP TABLE IF EXISTS instituciones;
DROP TABLE IF EXISTS metodos_de_pago;
DROP TABLE IF EXISTS peticiones;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS productos_en_tienda;
DROP TABLE IF EXISTS tiendas;
DROP TABLE IF EXISTS usuarios;
CREATE TABLE calificaciones_producto (
	id_product BIGINT(20) NOT NULL,
	id_user BIGINT(20) NOT NULL,
	score TINYINT(1) NOT NULL,
	`description` VARCHAR(255),
	PRIMARY KEY (id_product, id_user)
);
CREATE TABLE calificaciones_tienda (
	id_store BIGINT(20) NOT NULL,
	id_user BIGINT(20) NOT NULL,
	score TINYINT(1) NOT NULL,
	`description` VARCHAR(255),
	PRIMARY KEY (id_user, id_store)
);
CREATE TABLE compras (
	id_purchase BIGINT(20) NOT NULL AUTO_INCREMENT,
	id_user BIGINT(20) NOT NULL,
	id_store BIGINT(20) NOT NULL,
	id_product BIGINT(20) NOT NULL,
	quantity SMALLINT(5) NOT NULL,
	unitary_price SMALLINT(5) NOT NULL,
	`date` BIGINT(20) NOT NULL,
	`state` ENUM('creado', 'pagado', 'completado') NOT NULL DEFAULT 'creado',
	PRIMARY KEY (id_purchase, id_user, id_store, id_product)
);
CREATE TABLE entregas_en (
	id_delivery BIGINT(20) NOT NULL AUTO_INCREMENT,
	id_store BIGINT(20) NOT NULL,
	id_institution BIGINT(20) NOT NULL,
	lugar VARCHAR(255) NOT NULL,
	PRIMARY KEY (id_delivery, id_store, id_institution)
);
CREATE TABLE instituciones (
	id_institution BIGINT(20) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL,
	logo VARCHAR(255),
	PRIMARY KEY (id_institution)
);
CREATE TABLE metodos_de_pago (
	id_method BIGINT(20) NOT NULL AUTO_INCREMENT,
	id_store BIGINT(20) NOT NULL,
	`description` VARCHAR(255) NOT NULL,
	PRIMARY KEY (id_method, id_store)
);
CREATE TABLE peticiones (
	id_petition BIGINT(20) NOT NULL AUTO_INCREMENT,
	id_user BIGINT(20) NOT NULL,
	voucher VARCHAR(255) NOT NULL,
	`state` ENUM('pendiente', 'rechazado', 'aceptado') NOT NULL DEFAULT 'pendiente',
	PRIMARY KEY (id_petition, id_user)
);
CREATE TABLE productos (
	id_product BIGINT(20) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL UNIQUE,
	`description` VARCHAR(255) NOT NULL,
	`image` VARCHAR(255),
	quantity INT(10) CHECK (cantidad > 0),
	unity TINYTEXT,
	PRIMARY KEY (id_product, name)
);
CREATE TABLE productos_en_tienda (
	id_store BIGINT(20) NOT NULL,
	id_product BIGINT(20) NOT NULL,
	price SMALLINT(5) NOT NULL,
	quantity SMALLINT(5) NOT NULL,
	PRIMARY KEY (id_store, id_product)
);
CREATE TABLE tiendas (
	id_store BIGINT(20) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL UNIQUE,
	`description` VARCHAR(255) NOT NULL,
	id_user BIGINT(20) NOT NULL,
	`image` VARCHAR(255),
	PRIMARY KEY (id_store, id_user)
);
CREATE TABLE usuarios (
	id_user BIGINT(20) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(30) NOT NULL UNIQUE,
	email VARCHAR(30) NOT NULL UNIQUE,
	`image` VARCHAR(255),
	id_school BIGINT(20),
	userType ENUM('admin', 'vendendor', 'usuario') NOT NULL DEFAULT 'usuario',
	PRIMARY KEY (id_user, name)
);
ALTER TABLE peticiones
ADD FOREIGN KEY (id_user) REFERENCES usuarios(id_user);


ALTER TABLE calificaciones_producto
ADD FOREIGN KEY (id_user) REFERENCES usuarios(id_user);

ALTER TABLE calificaciones_producto
ADD FOREIGN KEY (id_product) REFERENCES productos(id_product);


ALTER TABLE calificaciones_tienda
ADD FOREIGN KEY (id_user) REFERENCES usuarios(id_user);

ALTER TABLE calificaciones_tienda
ADD FOREIGN KEY (id_store) REFERENCES tiendas(id_store);


ALTER TABLE compras
ADD FOREIGN KEY (id_user) REFERENCES usuarios(id_user);

ALTER TABLE compras
ADD FOREIGN KEY (id_store) REFERENCES tiendas(id_store);

ALTER TABLE compras
ADD FOREIGN KEY (id_product) REFERENCES productos(id_product);


ALTER TABLE entregas_en
ADD FOREIGN KEY (id_store) REFERENCES tiendas(id_store);

ALTER TABLE entregas_en
ADD FOREIGN KEY (id_institution) REFERENCES instituciones(id_institution);


ALTER TABLE metodos_de_pago
ADD FOREIGN KEY (id_store) REFERENCES tiendas(id_store);


ALTER TABLE peticiones
ADD FOREIGN KEY (id_user) REFERENCES usuarios(id_user);


ALTER TABLE productos_en_tienda
ADD FOREIGN KEY (id_store) REFERENCES tiendas(id_store);

ALTER TABLE productos_en_tienda
ADD FOREIGN KEY (id_product) REFERENCES productos(id_product);


ALTER TABLE tiendas
ADD FOREIGN KEY (id_user) REFERENCES usuarios(id_user);


ALTER TABLE entregas_en
ADD FOREIGN KEY (id_institution) REFERENCES instituciones(id_institution);
