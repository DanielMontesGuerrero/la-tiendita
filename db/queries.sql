/* Obtener producto y calificación */
SELECT *
FROM productos 
LEFT JOIN (
	SELECT AVG(calificacion) AS calificacion, id_product
	FROM calificaciones_producto 
	GROUP BY id_producto
) 
calificaciones 
ON productos.id_producto=calificaciones.id_producto
