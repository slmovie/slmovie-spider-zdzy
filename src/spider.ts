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

export async function spiderPage(type: number, finish: Function, page?: number, end?: number) {
	if (!page) {
		page = 1
	}

	const url = Constant.getUrl(type)
	try {
		const result: any = await reqPage(url + page)
		const updateSize = await handleData(result, type)
		log("page = " + page + " type = " + type + " update size " + updateSize, true)
		let endPage
		if (end) {
			endPage = end
		} else {
			end = result.page.pagecount
		}
		if (page == end) {
			finish()
		} else {
			spiderPage(type, finish, page + 1, end)
		}
	} catch (error) {
		log(error)
		setTimeout(() => {
			spiderPage(type, finish, page, end)
		}, 5000)
	}
}

export async function spiderAll(type: number) {
	return new Promise(async (resolve, reject) => {
		spiderPage(type, () => {
			resolve()
		})
	})
}

export async function spiderDay() {
	return new Promise(async (resolve, reject) => {
		try {
			spiderPage(Constant.Online, () => {
				log("Online finish")
				spiderPage(Constant.Download, () => {
					log("Download finish")
					resolve()
				}, 1, 20)
			}, 1, 20)
		} catch (error) {
			reject(error)
		}
	})
}

// reqPage(Constant.getUrl(Constant.Download)).then(result => log(result)).catch(error => log(error))
// spiderPage(Constant.Download, () => {
// 	log("Online spider finish")
// 	process.exit(0)
// }, 1, 45)
// spiderToTarget(Constant.Online, 1223).then(() => process.exit(0))