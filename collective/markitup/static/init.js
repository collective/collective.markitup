markitup = {
	loadScript: function(url) {
		if ($('script[src="'+url+'"]').length > 0) return;
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		$("head").append(script);
	},
	loadStyle: function(url) {
		if ($('link[href="'+url+'"]').length > 0) return;
		var style = document.getElementById("markitup-style");
		if (!style) style = document.createElement("link");
		style.id = "markitup-style";
		style.rel = "stylesheet";
		style.type = "text/css";
		style.media = "screen";
		style.href = url;
		document.head.appendChild(style);
	},
	unload: function() {
		// Note: some bug makes it difficult to unload the js and css directly,
		//       hopefully leaving those in place won't break anything.
		$("#text").markItUpRemove();
	},
	findItUp: function(a) {
		alert("findItUp called.");
	},
	currentSet: "",
	setEditor: function(text_format) {
		markitup.unload();
		switch (text_format) {
			case "Markdown":
				// FIXME: Find a safe way to get the path.
				markitup.loadScript(
					portal_url + "/++resource++collective.markitup/markdown/set.js"
				);
				markitup.loadStyle(
					portal_url + "/++resource++collective.markitup/markdown/style.css"
				);
				mySettings.previewAutoRefresh = true;
				delete mySettings.previewTemplatePath;
				mySettings.previewParserVar = "markdown";
				mySettings.previewParserPath = portal_url + '/@@preview_transform';
				console.log("Searching for markupSets.");
				for (var i=0; i<mySettings.markupSet.length; i++) {
					// HACK: Buttons are defined in an array; Loop to override.
					var curSet = mySettings.markupSet[i];
					if (curSet.name == "Picture") {
						console.log("Found picture button.");
						curSet.beforeInsert = markitup.findItUp;
					}
				}
				$("#text").markItUp(mySettings);
				markitup.currentSet = "markdown";
				break;
			case "Textile":
				// FIXME: Find a safe way to get the path.
				markitup.loadScript(portal_url + "/++resource++collective.markitup/textile/set.js");
				markitup.loadStyle(portal_url + "/++resource++collective.markitup/textile/style.css");
				mySettings['previewAutoRefresh'] = true;
				delete mySettings['previewTemplatePath'];
				mySettings['previewParserVar'] = "textile";
				mySettings['previewParserPath'] = portal_url + '/@@preview_transform';
				$("#text").markItUp(mySettings);
				markitup.currentSet="textile";
				break;
			case "reStructured Text":
				// FIXME: Find a safe way to get the path.
				markitup.loadScript(portal_url + "/++resource++collective.markitup/rest/set.js");
				markitup.loadStyle(portal_url + "/++resource++collective.markitup/rest/style.css");
				mySettings['previewAutoRefresh'] = true;
				delete mySettings['previewTemplatePath'];
				mySettings['previewParserVar'] = "rest";
				mySettings['previewParserPath'] = portal_url + '/@@preview_transform';
				$("#text").markItUp(mySettings);
				markitup.currentSet="rest";
				break;
			case "HTML":
				// FIXME: Find a safe way to get the path.
				markitup.loadScript(portal_url + "/++resource++collective.markitup/html/set.js");
				markitup.loadStyle(portal_url + "/++resource++collective.markitup/html/style.css");
				mySettings['previewAutoRefresh'] = true;
				delete mySettings['previewParserVar'];
				mySettings['previewTemplatePath'] = '~/markitup/templates/preview.html';
				$("#text").markItUp(mySettings);
				markitup.currentSet="html";
				break;
			default: break;
		}
	}
}

$(document).ready(function() {
	// FIXME: Find a safe way to get the path.
	markitup.loadScript(portal_url + "/++resource++collective.markitup/markitup/jquery.markitup.js");
	markitup.setEditor($("#text_text_format :selected").text());
	$("#text_text_format").change(function(e) {
		markitup.setEditor($(this).find(":selected").text());
	});
});
