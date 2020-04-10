import { log } from './utils/log-utils'
import { Constant } from "./constant"
import superagent from 'superagent'
import { handleData } from './data-handle'

function reqPage(url: string) {
	return new Promise((resolve, reject) => {
		superagent
			.get(url)
			.timeout({
				response: 5000,
				deadline: 60000,
			})
			.end((err, response) => {
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

async function spiderPage(type: number, page: number, end: number, finish: Function) {
	log("page = " + page)
	const url = Constant.getUrl(type)
	try {
		const result = await reqPage(url + page)
		handleData(result, type)
		if (page == end) {
			finish()
		} else {
			spiderPage(type, page - 1, end, finish)
		}
	} catch (error) {
		log("error>>" + error)
		throw (error)
	}
}

export async function spiderToTarget(type: number, end: number) {
	return new Promise(async (resolve, reject) => {
		try {
			const result: any = await reqPage(Constant.getUrl(type))
			spiderPage(type, result.page.pagecount, end, function finishSpider() {
				resolve()
			})
		} catch (error) {
			reject(error)
		}
	})
}

// reqPage(Constant.getUrl(Constant.Download)).then(result => log(result)).catch(error => log(error))
// spiderPage(Constant.Online, 7, 1, function finishSpider() {
// 	log("Online spider finish")
// 	process.exit(0)
// })
// spiderToTarget(Constant.Online, 1223).then(() => process.exit(0))