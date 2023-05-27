const documentLoaded = {
	init: function () {
		this.loadDetection();
	},

	loadDetection: function () {
		window.addEventListener('load', () => {
			const html = document.querySelector('html');
			html.classList.add('loaded');
		});
	},
};

export default documentLoaded;
