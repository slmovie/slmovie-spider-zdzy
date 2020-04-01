const superagent = require('superagent');
const DataHandle = require('./DataHandle');
const Constant = require('./Constant');

function reqPage(url, type) {
	superagent.get(url).end((err, response) => {
		if (err) {
			console.log(err);
		} else {
			if (response.status === 200) {
				let result = JSON.parse(response.text);
				DataHandle.handleData(result, type);
			} else {
			}
		}
	});
}

function reqOnline(page) {
	reqPage(Constant.target.onlineUrl + page, DataHandle.Online);
}

function reqDownload(page) {
	reqPage(Constant.target.downloadUrl + page, DataHandle.Download);
}

reqOnline(1);
