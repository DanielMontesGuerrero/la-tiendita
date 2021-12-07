const express = require('express');
const logger = require('./common/logger.js');
const config = require('./common/config.js');

const app = express();

// parse application/json
app.use(express.json());

// routers
const user = require('./routers/user.js');
const product = require('./routers/product.js');
const store = require('./routers/store.js');
app.use(user);
app.use(product);
app.use(store);


app.get('/', (req, res) => {
	res.send('Hello world! :)');
});

app.listen(config.port, () => {
	logger.info({message: `Listening on port ${config.port}`});
});
