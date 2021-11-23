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
	id_producto BIGINT(20) NOT NULL,
	id_usuario BIGINT(20) NOT NULL,
	calificacion TINYINT(1) NOT NULL,
	descripcion VARCHAR(255),
	PRIMARY KEY (id_producto, id_usuario)
);
CREATE TABLE calificaciones_tienda (
	id_tienda BIGINT(20) NOT NULL,
	id_usuario BIGINT(20) NOT NULL,
	calificacion TINYINT(1) NOT NULL,
	descripcion VARCHAR(255),
	PRIMARY KEY (id_usuario, id_tienda)
);
CREATE TABLE compras (
	id_compra BIGINT(20) NOT NULL AUTO_INCREMENT,
	id_usuario BIGINT(20) NOT NULL,
	id_tienda BIGINT(20) NOT NULL,
	id_producto BIGINT(20) NOT NULL,
	cantidad SMALLINT(5) NOT NULL,
	precio_unitario SMALLINT(5) NOT NULL,
	fecha BIGINT(20) NOT NULL,
	estado ENUM('creado', 'pagado', 'completado') NOT NULL DEFAULT 'creado',
	PRIMARY KEY (id_compra, id_usuario, id_tienda, id_producto)
);
CREATE TABLE entregas_en (
	id_entrega BIGINT(20) NOT NULL AUTO_INCREMENT,
	id_tienda BIGINT(20) NOT NULL,
	id_institucion BIGINT(20) NOT NULL,
	lugar VARCHAR(255) NOT NULL,
	PRIMARY KEY (id_entrega, id_tienda, id_institucion)
);
CREATE TABLE instituciones (
	id_institucion BIGINT(20) NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
	logo VARCHAR(255),
	PRIMARY KEY (id_institucion)
);
CREATE TABLE metodos_de_pago (
	id_metodo BIGINT(20) NOT NULL AUTO_INCREMENT,
	id_tienda BIGINT(20) NOT NULL,
	descripcion VARCHAR(255) NOT NULL,
	PRIMARY KEY (id_metodo, id_tienda)
);
CREATE TABLE peticiones (
	id_peticion BIGINT(20) NOT NULL AUTO_INCREMENT,
	id_usuario BIGINT(20) NOT NULL,
	comprobante VARCHAR(255) NOT NULL,
	estado ENUM('pendiente', 'rechazado', 'aceptado') NOT NULL DEFAULT 'pendiente',
	PRIMARY KEY (id_peticion, id_usuario)
);
CREATE TABLE productos (
	id_producto BIGINT(20) NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
	descripcion VARCHAR(255) NOT NULL,
	imagen VARCHAR(255),
	cantidad INT(10),
	unidad TINYTEXT,
	PRIMARY KEY (id_producto, nombre)
);
CREATE TABLE productos_en_tienda (
	id_tienda BIGINT(20) NOT NULL,
	id_producto BIGINT(20) NOT NULL,
	precio SMALLINT(5) NOT NULL,
	cantidad SMALLINT(5) NOT NULL,
	PRIMARY KEY (id_tienda, id_producto)
);
CREATE TABLE tiendas (
	id_tienda BIGINT(20) NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL,
	descripcion VARCHAR(255) NOT NULL,
	id_usuario BIGINT(20) NOT NULL,
	PRIMARY KEY (id_tienda, id_usuario)
);
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
ALTER TABLE peticiones
ADD FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario);


ALTER TABLE calificaciones_producto
ADD FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario);

ALTER TABLE calificaciones_producto
ADD FOREIGN KEY (id_producto) REFERENCES productos(id_producto);


ALTER TABLE calificaciones_tienda
ADD FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario);

ALTER TABLE calificaciones_tienda
ADD FOREIGN KEY (id_tienda) REFERENCES tiendas(id_tienda);


ALTER TABLE compras
ADD FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario);

ALTER TABLE compras
ADD FOREIGN KEY (id_tienda) REFERENCES tiendas(id_tienda);

ALTER TABLE compras
ADD FOREIGN KEY (id_producto) REFERENCES productos(id_producto);


ALTER TABLE entregas_en
ADD FOREIGN KEY (id_tienda) REFERENCES tiendas(id_tienda);

ALTER TABLE entregas_en
ADD FOREIGN KEY (id_institucion) REFERENCES instituciones(id_institucion);


ALTER TABLE metodos_de_pago
ADD FOREIGN KEY (id_tienda) REFERENCES tiendas(id_tienda);


ALTER TABLE peticiones
ADD FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario);


ALTER TABLE productos_en_tienda
ADD FOREIGN KEY (id_tienda) REFERENCES tiendas(id_tienda);

ALTER TABLE productos_en_tienda
ADD FOREIGN KEY (id_producto) REFERENCES productos(id_producto);


ALTER TABLE tiendas
ADD FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario);


ALTER TABLE entregas_en
ADD FOREIGN KEY (id_institucion) REFERENCES instituciones(id_institucion);
