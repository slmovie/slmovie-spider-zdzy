import { DBAddress } from './constans'
import mongoose from 'mongoose'
import { log } from '../utils/log-utils'
import { MovieSchema } from './detail-schema'
import { IMovieDetail, IMovieFile } from '../typing/detail-typing'

const db = mongoose.createConnection(DBAddress + '/movies', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

db.catch((error) => {
	log("error" + error);
	process.exit(0);
});

interface ChangedMovie {
	m3u8Urls: IMovieFile[],
	onlineUrls: IMovieFile[],
	downloadUrls: IMovieFile[]
}

export const saveMovie = (movie: IMovieDetail) => {
	return new Promise((resolve, reject) => {
		const model = db.model('Movie', MovieSchema);
		model.findOne({ id: movie.id }, (error: any, doc: IMovieDetail) => {
			if (error || doc == null) {
				//没有查到，直接添加
				model.create(movie, (error: any) => {
					if (error) {
						const status = { message: movie.id + " " + movie.name + " 创建失败", error: error };
						reject(status);
					} else {
						const status = movie.id + " " + movie.name + " 创建成功";
						resolve(status);
					}
				});
			} else {
				//有数据，检查更新
				let update = false
				let changedMovie: ChangedMovie = {
					m3u8Urls: [],
					onlineUrls: [],
					downloadUrls: []
				}
				if (doc.m3u8Urls == undefined || (movie.m3u8Urls.length > 0 && doc.m3u8Urls.length != movie.m3u8Urls.length)) {
					changedMovie.m3u8Urls = movie.m3u8Urls
					update = true
				} else {
					changedMovie.m3u8Urls = doc.m3u8Urls
				}
				if (doc.onlineUrls == undefined || (movie.onlineUrls.length > 0 && doc.onlineUrls.length != movie.onlineUrls.length)) {
					update = true
					changedMovie.onlineUrls = movie.onlineUrls
				} else {
					changedMovie.onlineUrls = doc.onlineUrls
				}
				if (doc.downloadUrls == undefined || (movie.downloadUrls.length > 0 && doc.downloadUrls.length != movie.downloadUrls.length)) {
					update = true
					changedMovie.downloadUrls = movie.downloadUrls
				} else {
					changedMovie.downloadUrls = doc.downloadUrls
				}

				if (update) {
					model.updateOne(
						{ id: movie.id },
						{ $set: changedMovie },
						(err: any) => {
							if (err) {
								const status = { message: movie.id + " " + movie.name + " 更新失败", error: error };
								reject(status);
							} else {
								const status = movie.id + " " + movie.name + " 更新成功";
								resolve(status);
							}
						}
					);
				}
			}
		});
	});
}

