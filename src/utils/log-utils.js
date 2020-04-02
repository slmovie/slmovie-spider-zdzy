const getTimeFormat = require('./date-format').getTimeFormat;

exports.log = (log, time) => {
	if (time) {
		console.log(getTimeFormat(Date.now()) + ' ' + log);
	} else {
		console.log(log);
	}
};
