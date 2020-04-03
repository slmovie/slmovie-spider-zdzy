import { constant } from "./constant"
import { log } from "./utils/log-utils"
import { IMovieDetail, IMovieFile } from "./typing/detail-typing";

export const handleData = (result: any, type: number, finish: Function) => {
	result.data.forEach((element: any) => {
		const files = handleMovies(element.vod_url)[0]
		const m3u8 = handleMovies(element.vod_url)[1]
		let onlineUrls: IMovieFile[] = [];
		let downloadUrls: IMovieFile[] = [];
		let m3u8Urls: IMovieFile[] = [];
		if (type == constant.type.Online) {
			onlineUrls = files;
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
			onlineUrls: onlineUrls,
			downloadUrls: downloadUrls,
			m3u8Urls: m3u8
		};
		log(detail.name)
	});
	finish()
};

const handleMovies = (data: any) => {
	const files: IMovieFile[] = [];
	const m3u8: IMovieFile[] = []
	data.split('$$$').forEach((typeText: String) => {
		const movies = typeText.split(/\s+/);
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
