markitup = {
	loadScript: function(url) {
		if ($('script[src="'+url+'"]').length > 0) return;
		var script=document.createElement('script');
		script.type='text/javascript';
		script.src=url;
		$("head").append(script);
	},
	loadStyle: function(url) {
		if ($('link[href="'+url+'"]').length > 0) return;
		var style=document.createElement("link");
		style.rel="stylesheet";
		style.type="text/css";
		style.media="screen";
		style.href=url;
		$("head").append(style);
	},
	unload: function() {
		// Note: some bug makes it difficult to unload the js and css directly,
		//       hopefully leaving those in place won't break anything.
		$("#markItUpText").replaceWith($("#text"));
	},
	doPreviewStyles: function() {
		console.log("doPreviewStyles called.")
		var frame_head = $(".markItUpPreviewFrame").contents()[0].head;
		for (var j=0; j<document.styleSheets.length; j++) {
			var ss = document.styleSheets.item(j).ownerNode.cloneNode(true);
			console.log("Appending ", ss, "to", frame_head);
			frame_head.appendChild(ss);
		}
	},
	currentSet: "",
	setEditor: function(text_format) {
		markitup.unload();
		switch (text_format) {
			case "Markdown":
				// FIXME: Find a safe way to get the path.
				markitup.loadScript(portal_url + "/++resource++collective.markitup/markdown/set.js");
				markitup.loadStyle(portal_url + "/++resource++collective.markitup/markdown/style.css");
				mySettings['previewAutoRefresh'] = true;
				delete mySettings['previewTemplatePath'];
				mySettings['previewParserVar'] = "markdown";
				mySettings['previewParserPath'] = portal_url + '/@@preview_transform';
				console.log("right before the thing");
				for (var i=0; i<mySettings.markupSet.length; i++) {
					console.log("Searching for preview");
					if (mySettings.markupSet[i].name == "Preview") {
						console.log("Found preview");
						mySettings.markupSet[i].afterInsert = function() {
							window.setTimeout(markitup.doPreviewStyles, 100);
						}
					}
				}
				$("#text").markItUp(mySettings);
				markitup.currentSet="markdown";
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
