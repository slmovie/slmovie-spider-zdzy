import { DBAddress } from './db-constans'
import mongoose from 'mongoose'
import { log } from '../utils/log-utils'
import { MovieSchema } from './detail-schema'
import { constant } from "../constant"

const db = mongoose.createConnection(DBAddress + '/movies', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

db.catch((error) => {
	log(error);
	process.exit(0);
});

function saveMovie(movie: any, type: number) {
	return new Promise((resolve, reject) => {
		const model = db.model('Movie', MovieSchema);
		findOneByID(model, movie.id)
			.then((data) => {
				//有数据，检查更新
				if (type == constant.type.Online) {

				} else {

				}
			})
			.catch((error) => {
				//没有查到，直接添加
				model.create(movie, (error: any) => {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
				});
			});
	});
}

function findOneByID(model: any, id: string) {
	return new Promise((resolve, reject) => {
		model.findOne({ id: id }, (error: any, doc: any) => {
			if (error || doc == null) {
				reject();
			} else {
				resolve(doc);
			}
		});
	});
}
