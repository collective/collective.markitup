markitup = {
	base: portal_url + "/++resource++collective.markitup/",
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
	unloadSet: function() {
		// Note: some bug makes it difficult to unload the js and css directly,
		//       hopefully leaving those in place won't break anything.
		$("#text").markItUpRemove();
	},
	findItUp: function(a) {
		console.log("findItUp called.");
		
	},
	currentSet: "",
	setEditor: function(text_format) {
		if (text_format == "reStructured Text") text_format = "rest";
		markitup.unload();
		markitup.loadScript(markitup.base+text_format+"/set.js");
		markitup.loadStyle(markitup.base+text_format+"/style.css");
		delete mySettings.previewTemplatePath;
		mySettings.previewAutoRefresh = true;
		mySettings.previewParserVar = text_format;
		mySettings.previewParserPath = portal_url + '/@@markitup_preview';
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
		markitup.currentSet = text_format;
	}
}

$(document).ready(function() {
	markitup.loadScript(markitup.base+"markitup/jquery.markitup.js");
	markitup.setEditor($("#text_text_format :selected").text());
	$("#text_text_format").change(function(e) {
		markitup.setEditor($(this).find(":selected").text());
	});
});
