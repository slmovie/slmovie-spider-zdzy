import { log } from './utils/log-utils'
import { constant } from "./constant"
import superagent from 'superagent'
import { handleData } from './data-handle'

function reqPage(url: string) {
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

function reqPageSize(url: string) {
	return new Promise((resolve, reject) => {
		reqPage(url).then((result: any) => {
			resolve(result.page)
		}).catch((error) => {
			reject(error)
		})
	})
}

function spiderPage(url: string, page: number, type: number, end: number, finish: Function) {
	reqPage(url + page).then((result) => {
		handleData(result, type, () => {
			if (page === end) {
				finishSpider()
			} else {
				spiderPage(url, page - 1, type, end, finish)
			}
		})
	}).catch(error => {
		log("page = " + page)
		log(error)
	})
}

function finishSpider() {
	log("Spider Finish")
	process.exit(0);
}

function spiderAll(url: string, type: number, end: number) {
	reqPageSize(url).then((page: any) => {
		spiderPage(url, page.pagecount, type, end, finishSpider)
	}).catch(error => {
		log(error)
		process.exit(0);
	})
}

spiderAll(constant.target.downloadUrl, constant.type.Download, 1211)