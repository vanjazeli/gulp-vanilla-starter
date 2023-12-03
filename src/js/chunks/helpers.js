const helpers = {
	html: document.querySelector('html'),
	scrollable: true,

	// disables scroll
	disableScroll: function () {
		if (this.scrollable) {
			this.html.style.overflow = 'hidden';
			this.scrollable = false;
		}
	},

	// enables scroll
	enableScroll: function () {
		if (!this.scrollable) {
			this.html.style.overflow = '';
			this.scrollable = true;
		}
	},

	// returns ture or false depending on whether an element is in viewport or not
	isInView: function (element) {
		const rect = element.getBoundingClientRect();
		return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0 && rect.left <= (window.innerWidth || document.documentElement.clientWidth) && rect.right >= 0;
	},

	// returns the position of an element on the page
	getPosition: function (element) {
		let xPosition = 0;
		let yPosition = 0;
		while (element) {
			xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft;
			yPosition += element.offsetTop - element.scrollTop + element.clientTop;
			element = element.offsetParent;
		}
		return { x: xPosition, y: yPosition };
	},
};

export default helpers;
