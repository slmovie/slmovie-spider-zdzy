const superagent = require('superagent');
const dataHandle = require('./data-handle');
const constant = require('./constant');

function reqPage(url, type) {
	superagent.get(url).end((err, response) => {
		if (err) {
			console.log(err);
		} else {
			if (response.status === 200) {
				let result = JSON.parse(response.text);
				dataHandle.handleData(result, type);
			} else {
			}
		}
	});
}

function reqOnline(page) {
	reqPage(constant.target.onlineUrl + page, dataHandle.Online);
}

function reqDownload(page) {
	reqPage(constant.target.downloadUrl + page, dataHandle.Download);
}

reqOnline(1);
