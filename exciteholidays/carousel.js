function Carousel(container) {
	this.figures = container.querySelectorAll("figure");
	this.activeIndex = 0;

	this.nextButton = document.createElement("span");
	this.prevButton = document.createElement("span");

	this.nextButton.className = "button next";
	this.prevButton.className = "button prev disabled";

	this.nextButton.innerHTML = "Next";
	this.prevButton.innerHTML = "Previous";

	var self = this;
	this.nextButton.onclick = function() {
		self.next();
	};
	this.prevButton.onclick = function() {
		self.prev();
	};

	container.appendChild(this.nextButton);
	container.appendChild(this.prevButton);

	if (this.figures.length > 0) {
		this.figures[this.activeIndex].className = "active";
	}
}

Carousel.prototype.next = function() {
	if (this.activeIndex < this.figures.length - 1) {
		this.figures[this.activeIndex].className = "prev";
		this.figures[++this.activeIndex].className = "active";
		this.prevButton.className = "button prev";

		if (this.activeIndex === this.figures.length - 1) {
			this.nextButton.className += " disabled";
		}
	}
};

Carousel.prototype.prev = function() {
	if (this.activeIndex > 0) {
		this.figures[this.activeIndex].className = "";
		this.figures[--this.activeIndex].className = "active";
		this.nextButton.className = "button next";

		if (this.activeIndex === 0) {
			this.prevButton.className += " disabled";
		}
	}
};
