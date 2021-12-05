const express = require('express');
const logger = require('./common/logger.js');
const config = require('./common/config.js');

const app = express();

// parse application/json
app.use(express.json());

// routers
const user = require('./routers/user.js');
const product = require('./routers/product.js');
app.use(user);
app.use(product);


app.get('/', (req, res) => {
	res.send('Hello world! :)');
});

app.listen(config.port, () => {
	logger.info({message: `Listening on port ${config.port}`});
});
