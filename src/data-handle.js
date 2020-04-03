const constant = require('./constant')

exports.handleData = function (result, type) {
	return new Promise((resolve, reject) => {
		result.data.forEach((element) => {
			handleMovies(element.vod_url)
				.then((files) => {
					let onlineUrls = [];
					let downloadUrls = [];
					if (type == constant.type.Online) {
						onlineUrls = files;
					} else {
						downloadUrls = files;
					}
					let detail = {
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
						downloadUrls: downloadUrls
					};
					console.log(detail.name)
				})
				.catch((err) => {
					reject(err)
				});
			resolve()
		});
	})
};

function handleMovies(data) {
	return new Promise((resolve, reject) => {
		try {
			const files = [];
			data.split('$$$').forEach((typeText) => {
				const movies = typeText.split(/\s+/);
				if (movies[0].endsWith('m3u8')) {
					return;
				}
				movies.forEach((movie) => {
					const file = movie.split('$');
					files.push({ name: file[0], url: file[1] });
				});
			});
			if (files.size == 0) {
				reject();
			} else {
				resolve(files);
			}
		} catch (err) {
			reject(err);
		}
	});
}
