const express = require('express');
const mysql = require('mysql2');

const app = express();


app.get('/', (req, res) => {
	res.send('Hello world! :)');
});

app.get('/conectar_db', (req, res) => {
	// si estan corriendo la base de datos con docker-compose
	// host: 'db'
	// si estan corriendo la base de datos en su maquina
	// host: 'localhost'
	var conexion = mysql.createConnection({
		host: 'db',
		database: 'la_tiendita',
		user: 'root',
		password: 'admin'
	})

	conexion.connect((error) => {
		if (error) {
			throw error;
		}
		else {
			console.log('[CONEXION EXITOSA]');
		}
	});

	// query de prueba
	conexion.query("INSERT INTO usuarios(nombre, email) VALUES('daniel', 'daniel@mail.com')", (error, results, fields) => {
		if (error) {
			throw error;
		}
		console.log(results);
	});
});

app.listen(8080, () => {
	console.log('Listening on port 8080');
});
