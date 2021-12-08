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
ADD FOREIGN KEY (id_institucion) REFERENCES instituciones(id_institucion);


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
