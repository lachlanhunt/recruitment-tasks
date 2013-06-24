function Tabs(container) {
	var self = this;
	var paneElements = container.querySelectorAll(".tab-pane");
	this.panes = [];
	var activeIndex = 0;

	var tabBarUL = document.createElement("ul");
	tabBarUL.className = "tabs";

	for (var i = 0; i < paneElements.length; i++) {
		var tabLI = document.createElement("li");
		tabLI.tabIndex = 0;
		tabLI.onclick = (function(index) {
			return function() {
				self.panes[activeIndex].hide();
				activeIndex = index;
				self.panes[activeIndex].show();
			}
		})(i);

		tabBarUL.appendChild(tabLI);

		this.panes[i] = new TabPane(paneElements[i], tabLI);
	}

	container.insertBefore(tabBarUL, container.childNodes[0]);

	this.panes[0].show();
}

function TabPane(paneElement, tabElement) {
	this.paneElement = paneElement;
	this.tabElement = tabElement;
	this.label = paneElement.querySelector("h2").innerHTML;
	tabElement.innerHTML = this.label;
}

TabPane.prototype.show = function showTabPane() {
	this.paneElement.className = "tab-pane active";
	this.tabElement.className = "active";
}

TabPane.prototype.hide = function hideTabPane() {
	this.paneElement.className = "tab-pane";
	this.tabElement.className = "";
}