const express = require('express');
const logger = require('./src/common/logger.js');

const app = express();

// parse application/json
app.use(express.json());

// routers
const usuario = require('./src/routers/usuario.js');
app.use(usuario);


app.get('/', (req, res) => {
	res.send('Hello world! :)');
});

app.listen(8080, () => {
	logger.info({message: 'Listening on port 8080'});
});
