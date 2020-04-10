import { DBAddress } from './constans'
import mongoose from 'mongoose'
import { log } from '../utils/log-utils'
import { MovieSchema } from './detail-schema'
import { IMovieDetail, IMovieFile } from '../typing/detail-typing'
import { Constant } from '../constant'

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

export const saveMovie = async (type: number, movie: IMovieDetail) => {
	return new Promise(async (resolve, reject) => {
		const model = db.model('Movie', MovieSchema);
		let doc: IMovieDetail | undefined = undefined
		try {
			let result = await model.findOne({ id: movie.id })
			if (result != null) {
				doc = result as unknown as IMovieDetail
			}
		} catch (error) { }
		if (doc == undefined) {
			//没有查到，直接添加
			try {
				await model.create(movie)
				resolve(movie.id + " " + movie.name + " 创建成功");
			} catch (error) {
				const status = { message: movie.id + " " + movie.name + " 创建失败", error: error };
				reject(status);
			}
		} else {
			//有数据，检查更新
			let changedMovie
			if (type == Constant.Download) {
				if (doc.downloadUrls == undefined || (movie.downloadUrls.length > 0 && doc.downloadUrls.length != movie.downloadUrls.length)) {
					changedMovie = { downloadUrls: movie.downloadUrls }
				}
			} else {
				//0 no update 1 m3u8 2 http 3 all
				let model = 0
				if (doc.m3u8Urls == undefined || (movie.m3u8Urls.length > 0 && doc.m3u8Urls.length != movie.m3u8Urls.length)) {
					model = 1
				}
				if (doc.webUrls == undefined || (movie.webUrls.length > 0 && doc.webUrls.length != movie.webUrls.length)) {
					if (model == 1) {
						model = 3
					} else {
						model = 2
					}
				}
				if (model == 1) {
					changedMovie = { m3u8Urls: movie.m3u8Urls }
				} else if (model == 2) {
					changedMovie = { webUrls: movie.webUrls }
				} else if (model == 3) {
					changedMovie = { webUrls: movie.webUrls, m3u8Urls: movie.m3u8Urls }
				} else {
				}
			}
			if (changedMovie != undefined) {
				try {
					await model.updateOne(
						{ id: movie.id },
						{ $set: changedMovie }
					);
					resolve(movie.id + " " + movie.name + " 更新成功");
				} catch (error) {
					const status = { message: movie.id + " " + movie.name + " 更新失败", error: error };
					reject(status);
				}

			}
		}
	});
}

