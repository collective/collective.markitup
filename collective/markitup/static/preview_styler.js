window.onload = function() {
	var parentdoc_ss = window.parent.document.styleSheets;
	if (document.styleSheets.length < 1) {
		document.head.appendChild(document.createElement("style"));
	}
	var ss = document.styleSheets[document.styleSheets.length-1];
	console.log("Created stylesheet", ss);
	var rule_index = 0;
	for (var i=0; i<parentdoc_ss.length; i++) {
		console.log("From stylesheet", i, ":", parentdoc_ss[i], ":");
		// document.head.appendChild(stylesheets[i].ownerNode.cloneNode(true));
		for (var j=0; j<parentdoc_ss[i].cssRules.length; j++) {
			var r;
			r = parentdoc_ss[i].cssRules[j];
			if (r.type == CSSRule.IMPORT_RULE) {
				console.log("- From @import", r, ":")
				for (var k=0; k<r.styleSheet.cssRules.length; k++) {
					// FIXME: Assuming a max depth of 1 import for now.
					var ir = r.styleSheet.cssRules[k];
					console.log("  - Appending rule", ir);
					ss.insertRule(ir.cssText, rule_index++);
				}
			} else {
				console.log("– Appending rule", r);
				ss.insertRule(r.cssText, rule_index++);
			}
		}
	}
}
