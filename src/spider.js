const superagent = require('superagent');
const dataHandle = require('./data-handle');
const constant = require('./constant');
const log = require('./utils/log-utils').log

function reqPage(url) {
	return new Promise((resolve, reject) => {
		superagent.get(url).end((err, response) => {
			if (err) {
				reject(err)
			} else {
				if (response.status === 200) {
					let result = JSON.parse(response.text);
					resolve(result)
				} else {
					reject(response.status)
				}
			}
		});
	})
}

function reqPageSize(url) {
	return new Promise((resolve, reject) => {
		reqPage(url).then((result) => {
			resolve(result.page)
		}).catch((error) => {
			reject(error)
		})
	})
}

function spiderPage(url, page, type, finish) {
	reqPage(url + page).then((result) => {
		dataHandle.handleData(result, type).then(() => {
			if (page === 1) {
				finishSpider()
			} else {
				spiderPage(url, page - 1, type)
			}
		}).catch(error => {
			log("page = " + page)
			log(error)
		})
	}).catch(error => {
		log("page = " + page)
		log(error)
	})
}

function reqOnline(page) {
	reqPage(constant.target.onlineUrl + page, dataHandle.Online);
}

function reqDownload(page) {
	reqPage(constant.target.downloadUrl + page, dataHandle.Download);
}

function finishSpider() {
	log("Spider Finish")
	process.exit(0);
}

function spiderAll(url, type) {
	reqPageSize(url).then(page => {
		spiderPage(url, page.pagecount, type, finishSpider)
	}).catch(error => {
		log(error)
		process.exit(0);
	})
}

spiderAll(constant.target.onlineUrl, dataHandle.Online)