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
			if (movie.addTime != doc.addTime) {
				if (type == Constant.Download) {
					changedMovie = { downloadUrls: movie.downloadUrls, addTime: movie.addTime }
				} else {
					changedMovie = { webUrls: movie.webUrls, m3u8Urls: movie.m3u8Urls, addTime: movie.addTime }
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
			} else {
				resolve()
			}
		}
	});
}

