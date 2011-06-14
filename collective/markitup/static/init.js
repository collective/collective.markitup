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

// A namespace for anything to do with the MarkItUp editor.
markitup = {

	// The URL from which to load resources
	base: portal_url + "/++resource++collective.markitup/",

	// An identifier for the currently-loaded editor's markupSet
	currentSet: "",

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
		document.head.appendChild(style);
	},

	/**
	 * Detach the MarkItUp editor from the $("#text") element.
	 */
	unloadSet: function() {
		/* NOTE: Unloading the js and css directly appears to cause problems.
		         Hopefully leaving them in place won't break anything.
		*/
		$("#text").markItUpRemove();
	},

	// A namespace for anything having to do with the finder/browser/picker
	finder: {
		/**
		 * Open the finder in a new window.
		 */
		open: function(buttonSet) {
			var target = $("."+buttonSet.className+">a");
			target.attr("href", portal_url+"/@@markitup_finder");
			target.prepOverlay({
				subtype: "iframe",
				config: {
					closeOnClick: false,
				}
			});
			markitup.finder.overlay = target.data("overlay");
		},
		
		/**
		 * Override the selectItem method from collective.plonefinder so that
		 * when the user selects an item MarkItUp knows what text to generate,
		 * and then closes the iframe.
		 */
		selectItem: function (UID, title, image_preview) {
			console.log(arguments);
			var parent = window.parent;
			if (window.opener) parent = window.opener;
			$('.statusBar>div',Browser.window).hide().filter('#msg-loading').show();
			var fieldid = getBrowserData(Browser.formData, 'fieldid');
			if (typeof parent.finderSelectItem !='undefined') {
				parent.finderSelectItem(UID, title, image_preview, fieldid);
			} else {
				if (typeof image_preview == "undefined" || !image_preview) {
					console.log("Selected: " + UID + " for fieldid " + fieldid);
				} else {
					console.log("Selected a middle size image with this UID: " + UID + " for fieldid " + fieldid);
				}
			}
			parent.markitup.finder.overlay.close();
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
	overrideSets: function(newSets) {
		for (var i=0; i<mySettings.markupSet.length; i++) {
			// HACK: MarkItUp specifies that that the markupSets are in a
			//       numeric array, not a hash indexed by name. Thus: Loop.
			var curSet = mySettings.markupSet[i];
			if (curSet.name in newSets) {
				var newSet = newSets[curSet.name];
				for (var key in newSet) {
					// Directly delete references to null.
					if (newSet[key] === null) {
						delete curSet[key];
					} else {
						curSet[key] = newSet[key];
					}
				}
			}
		}
	},

	/**
	 * Change the editor based on the id of the current format.
	 * @param text_format {string} Name of the format to which to switch
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
		markitup.overrideSets({
			Picture: {
				replaceWith: null,
				className: "Picture",
				beforeInsert: markitup.finder.open
			}
		});
		$("#text").markItUp(mySettings);
		markitup.currentSet = subtype;
	}
}

// Attach MarkItUp editor to the JQuery object with an id of "#text", which
// corresponds to the body editor in a normal Plone page.
$(document).ready(function() {
	markitup.loadScript(markitup.base+"markitup/jquery.markitup.js");
	markitup.setEditor($("#text_text_format :selected").val());
	$("#text_text_format").change(function(e) {
		var text_format = $(this).find(":selected").val();
		markitup.setEditor(text_format);
	});
});
