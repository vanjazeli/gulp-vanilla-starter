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
};

export default helpers;
