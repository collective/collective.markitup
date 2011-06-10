window.onload = function() {
	var stylesheets = window.parent.document.styleSheets;
	for (var i=0; i<stylesheets.length; i++) {
		document.head.appendChild(stylesheets[i].ownerNode.cloneNode(true));
	}
}
