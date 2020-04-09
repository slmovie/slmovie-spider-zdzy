export class Constant {
	static Online = 0
	static Download = 1

	static getUrl = (type: number): string => {
		if (type == Constant.Online) {
			return 'http://www.zdziyuan.com/inc/feifei3.4/?p='
		} else {
			return 'http://www.zdziyuan.com/inc/feifeidown/?p='
		}
	}
}
