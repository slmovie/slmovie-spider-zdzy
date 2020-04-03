
const getTimeFormat = (time: number): string => {
	let date = new Date(time);
	let Y = date.getFullYear() + '-';
	let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	let D = date.getDate() + ' ';
	let h = date.getHours() + ':';
	let m = date.getMinutes() + ':';
	let s = date.getSeconds();
	return Y + M + D + h + m + s;
};

export const log = (log: any, time: boolean = false) => {
	if (time) {
		console.log(getTimeFormat(Date.now()) + " " + log);
	} else {
		console.log(log);
	}
};