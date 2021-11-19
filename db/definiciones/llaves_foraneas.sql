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
