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

/*jslint browser: true, plusplus: true, maxerr: 50, indent: 4 */

// Expected Globals
var mySettings = mySettings || {},
	portal_url = portal_url || "",
	jQuery = jQuery || {};


String.prototype.format = function () {
	"use strict";
	var formatted = this,
		i = arguments.length,
		regex;
	while (i--) {
		regex = new RegExp('\\{' + i.toString() + '\\}', 'gi');
		formatted = formatted.replace(regex, arguments[i]);
	}
	return formatted;
};

// A namespace for anything to do with the MarkItUp editor.
var markitup = {

	// The URL from which to load resources
	base: portal_url + "/++resource++collective.markitup/",

	// An identifier for the currently-loaded editor's markupSet
	currentSet: "",

	// jQuery.validator formats for various things in various languages
	// If a format is a string, it will replace the selected text.
	//
	// This is here for example only. It will be overridden by stuff
	// in the plone registry.
	formatStr: {
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
	loadScript: function (url) {
		"use strict";
		if (jQuery('script[src="' + url + '"]').length > 0) {
			return;
		}
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		jQuery("head").append(script);
	},

	/**
	 * Load css into the current page by
	 * creating and attaching a style element.
	 * @param url {string} Value of the href attribute of the element to create
	 */
	loadStyle: function (url) {
		"use strict";
		if (jQuery('link[href="' + url + '"]').length > 0) {
			return;
		}
		var style = document.getElementById("markitup-style");
		if (!style) {
			style = document.createElement("link");
		}
		style.id = "markitup-style";
		style.rel = "stylesheet";
		style.type = "text/css";
		style.media = "screen";
		style.href = url;
		jQuery("head").append(style);
	},

	/**
	 * Detach the MarkItUp editor from the jQuery("#text") element.
	 */
	unloadSet: function () {
		"use strict";
		/* NOTE: Unloading the js and css directly appears to cause problems.
		         Hopefully leaving them in place won't break anything.
		*/
		jQuery("#text").markItUpRemove();
	},

	// A namespace for anything having to do with the finder/browser/picker
	finder: {
		/**
		 * Open the finder in a new window.
		 */
		open: function (buttonSet) {
			"use strict";
			var target = jQuery("." + buttonSet.className + ">a");
			if (buttonSet.name === "Picture") {
				target.attr("href", portal_url + "/@@markitup_imagefinder");
			} else {
				target.attr("href", portal_url + "/@@markitup_finder");
			}
			if (target.data("overlay") == undefined) {
				// p.a.jquerytools deletes __all__ click handlers for iframe
				// overlays when prepOverlay is called, including this one :)
				// Do not prep the overlay a second time.
				target.prepOverlay({
					subtype: "iframe",
					config: {
						closeOnClick: false
					}
				});
			}
			markitup.finder.overlay = target.data("overlay");
		},

		/**
		 * Read the value of forcecloseoninsert set by the
		 * collective.plonefinder Browser instance in the popup overlay
		 */
		forcecloseoninsert: function () {
			"use strict";
			var parent, overlay, content, fcoi;
			parent = window.parent;
			if (parent.markitup.finder.overlay != undefined) {
				overlay = parent.markitup.finder.overlay.getOverlay();
				content = overlay.find('iframe').contents();
				fcoi = parseInt(content.find('#forcecloseoninsert').val());
			} else {
				fcoi = 0;
			}
			return fcoi;
		},

		/**
		 * Override the selectImage method from collective.plonefinder so that
		 * when the user selects an image MarkItUp knows what text to generate,
		 * and then closes the iframe.
		 */
		selectImage: function (UID, title) {
			"use strict";
			var Browser = Browser || {},
				statusBar = jQuery(".statusBar > div", Browser.window),
				parent = window.parent,
				src = portal_url + "/@@markitup_redirect_uid?uid=" + UID,
				formatStr = parent.markitup.formatStr.Picture,
				altTextPrompt = "Enter alternative text describing the image::!:" + title,
				scalePrompt = "Scale (choose from 'large', 'preview', 'mini', 'thumb'):",
				alignPrompt = "Alignment (choose from 'inline', 'left', or 'right'):",
				titlePrompt = "Image Title (this will appear in the tooltip for the image)::!:" + title;
      if (parent.markitup.currentSet === 'restructured'){
        alignPrompt = "Alignment (choose from 'center', 'left', or 'right'):";
      }
			if (window.opener) {
				parent = window.opener;
			}
			statusBar.hide().filter('#msg-loading').show();
			parent.jQuery.markItUp({
				replaceWith: formatStr.format(src, altTextPrompt, titlePrompt, scalePrompt, alignPrompt)
			});
			if (parent.markitup.finder.forcecloseoninsert()) {
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
		selectItem: function (UID, title) {
			"use strict";
			var Browser = Browser || {},
				statusBar = jQuery(".statusBar > div", Browser.window),
				parent = window.parent,
				href = portal_url + "/@@markitup_redirect_uid?uid=" + UID,
				titlePrompt = "Link Title (this will appear in the tooltip for the link)::!:" + title;
			if (window.opener) {
				parent = window.opener;
			}
			statusBar.hide().filter('#msg-loading').show();
			parent.jQuery.markItUp({replaceWith: function (a) {
				var formatStr = parent.markitup.formatStr.Link;
				return formatStr.format(href, a.selection, titlePrompt);
			}});
			if (parent.markitup.finder.forcecloseoninsert()) {
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
	overrideSets: function (data) {
		"use strict";
		var set_name = "text/" + markitup.currentSet,
			newSets = data[set_name],
			ctx = window,
			key,
			i = 0,
			max = mySettings.markupSet.length,
			curSet = {},
			newSet = {},
			s = "";
		for (i = 0; i < max; i++) {
			// HACK: MarkItUp specifies that that the markupSets are in a
			//       numeric array, not a hash indexed by name. Thus: Loop.
			curSet = mySettings.markupSet[i];
			if (newSets.hasOwnProperty(curSet.name)) {
				newSet = newSets[curSet.name];
				for (key in newSet) {
					if (newSet.hasOwnProperty(key)) {
						if (newSet[key] === null) {
							// Directly delete references to null.
							delete curSet[key];
						} else {
							// HACK: Attempt to "guess" if a dotted name is intended to be a
							//       reference to a Javascript object and not merely a string.
							//       If only JSON had support for arbitrary references.
							var ctx = window;
							for (s = newSet[key].split("."); ctx && s.length;) {
								ctx = ctx[s.shift()];
							}
							curSet[key] = ctx || newSet[key];
						}
					}
				}
			}
		}
		// rewrote this part to accomodate any AT Rich Widget text field.
		jQuery("div.ArchetypesRichWidget textarea, #formfield-form-text textarea").markItUp(mySettings);
	},

	setFormats: function (data) {
		"use strict";
		markitup.formatStr = data["text/" + markitup.currentSet];
	},

	/**
	 * Change the editor based on the id of the current markup.
	 * @param text_format {string} Name of the markup to which to switch
	 */
	setEditor: function (text_format) {
		"use strict";
		if (!(text_format && typeof text_format !== "undefined")) {
			return false;
		}
		var subtype = text_format.split("/")[1];
		markitup.unloadSet();
		markitup.loadScript(markitup.base + subtype + "/set.js");
		markitup.loadStyle(markitup.base + subtype + "/style.css");
		delete mySettings.previewTemplatePath;
		mySettings.previewAutoRefresh = true;
		mySettings.previewParserVar = text_format;
		mySettings.previewParserPath = portal_url + '/@@markitup_preview';
		markitup.currentSet = subtype;
		jQuery.getJSON(portal_url + "/@@markitup_json", {"name": "formats"}, markitup.setFormats);
		jQuery.getJSON(portal_url + "/@@markitup_json", {"name": "overrides"}, markitup.overrideSets);

	}
};

// Attach MarkItUp editor to the JQuery object with an id of "#text", which
// corresponds to the body editor in a normal Plone page.
jQuery(document).ready(function () {
	"use strict";
	markitup.loadScript(markitup.base + "markitup/jquery.markitup.js");
	markitup.setEditor(jQuery("#text_text_format :selected, #formfield-form-markup select").val());
	jQuery("#text_text_format, #formfield-form-markup select").change(function () {
		var text_format = jQuery(this).find(":selected").val();
		markitup.setEditor(text_format);
	});
});
