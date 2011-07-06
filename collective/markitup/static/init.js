// $Id: $

//
//  Initialize MarkItUp Editor
//
//  This script contains the settings and overrides for an implementation
//  of MarkItUp as an editor within Plone. In essence it changes the
//  <textarea id="text"/> element on Plone pages into a MarkItUp WYSIWYM
//  editor.
//
//  To add support for another markup language, download its pack from
//  http://markitup.jaysalvat.com/downloads and unzip it into
//  static/{set_name} without modification. If overrides or customization are
//  needed, add them into this file.
//
//  For information about the editor itself please see
//  http://markitup.jaysalvat.com/.
//

String.prototype.format = function() {
	var formatted = this;
	for (var i = 0; i < arguments.length; i++) {
		var regexp = new RegExp('\\{'+i+'\\}', 'gi');
		formatted = formatted.replace(regexp, arguments[i]);
	}
	return formatted;
};

// A namespace for anything to do with the MarkItUp editor.
markitup = {

	// The URL from which to load resources
	base: portal_url + "/++resource++collective.markitup/",

	// An identifier for the currently-loaded editor's markupSet
	currentSet: "",

	// jQuery.validator formats for various things in various languages
	// If a format is a string, it will replace the selected text.
	//
	// This is here for example only. It will be overridden by stuff
	// in the plone registry.
	format: {
		"text/x-web-markdown": {
		// [URL, alternative text, title]
		Picture: '![[![{1}]!]]([![Url:!:{0}]!] "[![{2}]!]")',
		// [URL, link text, title]
		Link: '[{1}]([![Url:!:{0}]!] "[![{2}]!]")'
		}
	},

	/**
	 * Load javascript into the current page
	 * by creating and attaching a script element.
	 * @param url {string} Value of the src attribute of the element to create
	 */
	loadScript: function(url) {
		if ($('script[src="'+url+'"]').length > 0) return;
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		$("head").append(script);
	},

	/**
	 * Load css into the current page by
	 * creating and attaching a style element.
	 * @param url {string} Value of the href attribute of the element to create
	 */
	loadStyle: function(url) {
		if ($('link[href="'+url+'"]').length > 0) return;
		var style = document.getElementById("markitup-style");
		if (!style) style = document.createElement("link");
		style.id = "markitup-style";
		style.rel = "stylesheet";
		style.type = "text/css";
		style.media = "screen";
		style.href = url;
		$("head").append(style);
	},

	/**
	 * Detach the MarkItUp editor from the $("#text") element.
	 */
	unloadSet: function() {
		/* NOTE: Unloading the js and css directly appears to cause problems.
		         Hopefully leaving them in place won't break anything.
		*/
		// $("#text").markItUpRemove();
		$("textarea").markItUpRemove();
	},

	// A namespace for anything having to do with the finder/browser/picker
	finder: {
		/**
		 * Open the finder in a new window.
		 */
		open: function(buttonSet) {
			var target = $("."+buttonSet.className+">a");
			if (buttonSet.name == "Picture") {
				target.attr("href", portal_url+"/@@markitup_imagefinder");
			} else {
				target.attr("href", portal_url+"/@@markitup_finder");
			}
			target.prepOverlay({
				subtype: "iframe",
				config: {
					closeOnClick: false,
				}
			});
			markitup.finder.overlay = target.data("overlay");
		},

		/**
		 * Override the selectImage method from collective.plonefinder so that
		 * when the user selects an image MarkItUp knows what text to generate,
		 * and then closes the iframe.
		 */
		selectImage: function (UID, title) {
			var statusBar = $(".statusBar > div", Browser.window);
			var parent = window.parent;
			if (window.opener) parent = window.opener;
			statusBar.hide().filter('#msg-loading').show();
			var src = portal_url+"/@@markitup_redirect_uid?uid="+UID;
//			parent.console.log(parent.markitup.format);
			var formatStr = parent.markitup.format.Picture;
			parent.$.markItUp({
				replaceWith:formatStr.format(src, "Alternative text", title)
			});
			if (Browser.forcecloseoninsert) {
				parent.markitup.finder.overlay.close();
			} else {
				statusBar.hide('10000').filter('#msg-done').show();
				jQuery('#msg-done').fadeOut(10000);
			}
		},

		/**
		 * Override the selectItem method from collective.plonefinder so that
		 * when the user selects an item MarkItUp knows what text to generate,
		 * and then closes the iframe.
		 */
		selectItem: function (UID, title, selection) {
			var statusBar = $(".statusBar > div", Browser.window);
			var parent = window.parent;
			if (window.opener) parent = window.opener;
			statusBar.hide().filter('#msg-loading').show();
			var href = portal_url+"/@@markitup_redirect_uid?uid="+UID;
			parent.$.markItUp({replaceWith:function(a) {
				var formatStr = parent.markitup.format.Link;
				return formatStr.format(href, a.selection, title)
			}});
			if (Browser.forcecloseoninsert) {
				parent.markitup.finder.overlay.close();
			} else {
				statusBar.hide('10000').filter('#msg-done').show();
				jQuery('#msg-done').fadeOut(10000);
			}
		}
	},

	/**
	 * Override the button or key markupSets in the global mySettings.
	 * Name is required. Anything else you do not explicitly unset
	 * will be left as-is.
	 * @param newSets {object} An associative array of markupSets.
	 *        http://markitup.jaysalvat.com/documentation/#markupset
	 * @example markitup.overrideSets({
	 *            Picture: {
	 *              replaceWith: null,
	 *              className: "Picture",
	 *              beforeInsert: markitup.finder.open
	 *            }
	 *          })
	 *          This example call should find the markupSet with a name of
	 *          "Picture" and replace its "replaceWith", "className", and
	 *          "beforeInsert" properties with the specified references.
	 */
	overrideSets: function(data, textStatus, jqXHR) {
		var set_name = "text/" + markitup.currentSet;
		if (set_name in data) {
			var newSets = data[set_name];
			for (var i=0; i<mySettings.markupSet.length; i++) {
				// HACK: MarkItUp specifies that that the markupSets are in a
				//       numeric array, not a hash indexed by name. Thus: Loop.
				var curSet = mySettings.markupSet[i];
				if (curSet.name in newSets) {
					var newSet = newSets[curSet.name];
					for (var key in newSet) {
						if (newSet[key] === null) {
							// Directly delete references to null.
							delete curSet[key];
						} else {
							// HACK: Attempt to "guess" if a dotted name is intended to be a
							//       reference to a Javascript object and not merely a string.
							//       If only JSON had support for arbitrary references.
							var ctx = window;
							// NOTE: Loop has no body. Do everything in the loop expression.
							for (var s=newSet[key].split("."); ctx&&s.length; ctx=ctx[s.shift()]);
							curSet[key] = ctx||newSet[key];
						}
					}
				}
			}
		}
		$("#text").markItUp(mySettings);
		$("textarea[id=form.text]").markItUp(mySettings);
	},
	
	setFormats: function(data, textStatus, jqXHR) {
		markitup.format = data["text/" + markitup.currentSet];
	},

	/**
	 * Change the editor based on the id of the current markup.
	 * @param text_format {string} Name of the markup to which to switch
	 */
	setEditor: function(text_format) {
		if (!(text_format && typeof text_format != "undefined")) return false;
		var subtype = text_format.split("/")[1];
		markitup.unloadSet();
		markitup.loadScript(markitup.base+subtype+"/set.js");
		markitup.loadStyle(markitup.base+subtype+"/style.css");
		delete mySettings.previewTemplatePath;
		mySettings.previewAutoRefresh = true;
		mySettings.previewParserVar = text_format;
		mySettings.previewParserPath = portal_url + '/@@markitup_preview';
		markitup.currentSet = subtype;
		$.getJSON(portal_url + "/@@markitup_json", {"name": "formats"}, markitup.setFormats);
		$.getJSON(portal_url + "/@@markitup_json", {"name": "overrides"}, markitup.overrideSets );
	}
}

// Attach MarkItUp editor to the main textarea on the body of a Plone edit
// form.
$(document).ready(function() {
	markitup.loadScript(markitup.base+"markitup/jquery.markitup.js");
	markitup.setEditor($("#text_text_format :selected").val());
	$("#text_text_format").change(function(e) {
		var text_format = $(this).find(":selected").val();
		markitup.setEditor(text_format);
	});
});
