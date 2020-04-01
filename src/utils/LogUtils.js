const getTimeFormat = require('./DateFormat');

exports.log = (log, time) => {
	if (time) {
		console.log(getTimeFormat(Date.now()) + ' ' + log);
	} else {
		console.log(log);
	}
};
