const superagent = require('superagent');
const constant = require('./constant');

function reqPage(url) {
	superagent.get(url).end((err, response) => {
		if (err) {
			console.log(err);
		} else {
			if (response.status === 200) {
				let result = JSON.parse(response.text);
				console.log(result);
			} else {
			}
		}
	});
}

reqPage(constant.target.onlineUrl + 1);
