const DBAddress = require('./db-constans').DBAddress;
const mongoose = require('mongoose');
const log = require('../utils/log-utils');

const db = mongoose.createConnection(DBAddress + '/movies', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

db.catch((error) => {
	log(error);
	process.exit(0);
});
