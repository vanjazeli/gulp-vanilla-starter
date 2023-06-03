const helpers = {
	disableScroll: function () {
		const html = document.querySelector('html');
		html.style.overflow = 'hidden';
	},

	enableScroll: function () {
		const html = document.querySelector('html');
		html.style.overflow = '';
	},

	strToBool: function (string) {
		if (string === 'true') {
			return true;
		}
		if (string === 'false') {
			return false;
		}
	},

	isInView: function (element) {
		const rect = element.getBoundingClientRect();
		return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0 && rect.left <= (window.innerWidth || document.documentElement.clientWidth) && rect.right >= 0;
	},
};

export default helpers;
