const express = require('express');
const logger = require('./src/common/logger.js');

const app = express();


app.get('/', (req, res) => {
	res.send('Hello world! :)');
});

app.listen(8080, () => {
	logger.info({message: 'Listening on port 8080'});
});
