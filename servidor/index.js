const express = require('express');
const mysql = require('mysql2');

const app = express();


app.get('/', (req, res) => {
	res.send('Hello world! :)');
});

app.listen(8080, () => {
	console.log('Listening on port 8080');
});
