import { Constant } from "./constant"
import { log } from "./utils/log-utils"
import { IMovieDetail, IMovieFile } from "./typing/detail-typing";
import { saveMovie } from "./mongodb/save-data";

export const handleData = (result: any, type: number) => {
	return new Promise(async (resolve, reject) => {
		let updateSize = 0
		for (let element of result.data) {
			if (element.vod_cid != 16 && element.vod_cid != 17) {
				const files = handleMovieUrls(element.vod_url)[0]
				const m3u8 = handleMovieUrls(element.vod_url)[1]
				let webUrls: IMovieFile[] = [];
				let downloadUrls: IMovieFile[] = [];
				let m3u8Urls: IMovieFile[] = [];
				if (type == Constant.Online) {
					webUrls = files;
					m3u8Urls = m3u8
				} else {
					downloadUrls = files;
				}
				let detail: IMovieDetail = {
					name: element.vod_name,
					post: element.vod_pic,
					describe: element.vod_content,
					id: element.vod_id,
					year: element.vod_year,
					location: element.vod_area,
					type: element.vod_cid,
					actor: element.vod_actor,
					director: element.vod_director,
					status: element.vod_continu,
					addTime: element.vod_addtime,
					webUrls: webUrls,
					downloadUrls: downloadUrls,
					m3u8Urls: m3u8Urls
				};
				try {
					const result = await saveMovie(type, detail)
					if (result) {
						updateSize++
						// log(type + ">>" + result)
					}
				} catch (error) {
					log(error)
				}
			} else {
				// log("过滤 " + element.vod_name)
			}
		}
		resolve(updateSize)
	})
};


const handleMovieUrls = (data: any) => {
	const files: IMovieFile[] = [];
	const m3u8: IMovieFile[] = []
	data.split('$$$').forEach((typeText: String) => {
		const movies = typeText.split('\r\n');
		movies.forEach((movie) => {
			const file = movie.split('$');
			if (movie.endsWith('m3u8')) {
				m3u8.push({ name: file[0], url: file[1] });
			} else {
				files.push({ name: file[0], url: file[1] });
			}
		});
	});
	return [files, m3u8]
}
