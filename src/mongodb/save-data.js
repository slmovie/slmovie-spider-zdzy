const DBAddress = require('./db-constans').DBAddress;
const mongoose = require('mongoose');
const log = require('../utils/log-utils');
const MovieSchema = require('./detail-schema').MovieSchema;

const db = mongoose.createConnection(DBAddress + '/movies', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

db.catch((error) => {
	log(error);
	process.exit(0);
});

function saveMovie(movie,type) {
	return new Promise((resolve, reject) => {
		const model = db.model('Movie', MovieSchema);
		findOneByID(model, movie.id)
			.then((data) => {
				//有数据，检查更新
			})
			.catch((error) => {
				//没有查到，直接添加
				model.create(detail, (error) => {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
				});
			});
	});
}

function findOneByID(model, id) {
	return new Promise((resolve, reject) => {
		model.findOne({ id: id }, (error, doc) => {
			if (error || doc == null) {
				reject();
			} else {
				resolve(doc);
			}
		});
	});
}
