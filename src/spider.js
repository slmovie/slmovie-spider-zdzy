const superagent = require('superagent');
const TargetUrl = require('./constant').TargetUrl;

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

reqPage(TargetUrl.onlineUrl + 1);
