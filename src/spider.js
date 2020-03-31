const superagent = require('superagent');
const Constant = require('./constant').Constant;

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

reqPage(Constant.onlineUrl + 1);
