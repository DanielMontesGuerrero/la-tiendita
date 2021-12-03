const express = require('express');
const logger = require('./src/common/logger.js');

const app = express();

// parse application/json
app.use(express.json());

// routers
const user = require('./src/routers/user.js');
const product = require('./src/routers/product.js');
app.use(user);
app.use(product);


app.get('/', (req, res) => {
	res.send('Hello world! :)');
});

app.listen(8080, () => {
	logger.info({message: 'Listening on port 8080'});
});
