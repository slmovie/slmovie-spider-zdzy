const superagent = require('superagent');
const handleData = require('./handleData').handleData;
const constant = require('./constant');

function reqPage(url, type) {
	superagent.get(url).end((err, response) => {
		if (err) {
			console.log(err);
		} else {
			if (response.status === 200) {
				let result = JSON.parse(response.text);
				handleData(result, type);
			} else {
			}
		}
	});
}

reqPage(constant.target.onlineUrl + 1);
