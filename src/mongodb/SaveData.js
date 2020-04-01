const DBAddress = require('./DBConstans').DBAddress;
const mongoose = require('mongoose');
const log = require('../utils/LogUtils');

const db = mongoose.createConnection(DBAddress + '/movies', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

db.catch((error) => {
	log(error);
	process.exit(0);
});
