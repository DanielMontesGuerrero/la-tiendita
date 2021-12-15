const express = require('express');
const cors = require('cors');
const logger = require('./common/logger.js');
const config = require('./common/config.js');

const app = express();

// parse application/json
app.use(express.json());

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', config.client);
	res.header('Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

const options = {
	origin: '*',
	methods: 'GET,PATCH,POST',
	preflightContinue: false,
	optionsSuccessStatus: 204,
};

app.use(cors(options));

// routers
const user = require('./routers/user.js');
const product = require('./routers/product.js');
const store = require('./routers/store.js');
const cart = require('./routers/cart.js');
const purchase = require('./routers/purchase.js');
const institution = require('./routers/institution.js');
const cart = require('./routers/cart.js');
app.use(user);
app.use(product);
app.use(store);
app.use(cart);
app.use(purchase);
app.use(institution);
app.use(cart);

app.get('/', (req, res) => {
	res.send('Hello world! :)');
});

app.listen(config.port, () => {
	logger.info({message: `Listening on port ${config.port}`});
});
