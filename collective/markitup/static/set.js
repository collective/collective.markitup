// ----------------------------------------------------------------------------
// markItUp!
// ----------------------------------------------------------------------------
// Copyright (C) 2008 Jay Salvat
// http://markitup.jaysalvat.com/
// ----------------------------------------------------------------------------

collective = {
	markitup = {
		/* Pseudo-example:
		function callback(kwargs) {
			var selection = kwargs.selection; // selected text
			var textarea = kwargs.textarea; // textarea object
			var caretPosition = kwargs.caretPosition; // position of the selection
			var scrollPosition = kwargs.scrollPosition; // position of the scrollbar
			var openWith = kwargs.openWith; // if this button property was clicked
			var closeWith = kwargs.closeWith; // if this button property was clicked
			var replaceWith = kwargs.replaceWith; // if this button property was clicked
			// … and so on with button properties
			var line = kwargs.line; // number of lines being processed
			var ctrlKey = kwargs.ctrlKey; // true if Control key was pressed
			var shiftKey = kwargs.shiftKey; // true if Shift key was pressed
		},
		exampleSet = {
			nameSpace: "", // string: Apply a specific className to the wrapping Div. Useful to prevent CSS conflicts between instances.
			resizeHandle: true, // boolean: Enable/Disable the handle to resize the editor.
			previewInWindow: "", // string: Display the preview in a popup window with comma-separated list of specs. If empty or false, the preview will be displayed in the built-in iFrame preview.
			previewAutoRefresh: false, // boolean: AutoRefresh the preview iFrame or windown swhen the editor is used.
			previewParserPath: "", // string > path: You can set the path of your own parser to preview markup languages other than html. If this property is set, the built-in preview will be overridden by your own preview script. Use ~/ for markItUp! root.
			previewParserVar: "data", // string: Name of the var posted with the editor content to the parser defined above.
			previewTemplatePath: "~/templates/preview.html", // string > path: Path to the Html preview template. Use ~/ for markItUp! root.
			previewPosition: "after", // string > before|after: Position of the Built-in preview before or after the main textarea.
			onEnter: {keepDefault: true}, // hash: Define what to do when Enter key is pressed.
			onCtrlEnter: {keepDefault: true}, // hash: Define what to do when Ctrl+Enter keys are pressed.
			onShiftEnter: {keepDefault: true}, // hash: Define what to do when Shift+Enter keys are pressed.
			onTab: {keepDefault: true}, // hash: Define what to do when Tab key is pressed. Warning, this key is also used to jump at the end of a new inserted markup.
			beforeInsert: function() {}, // callback: Function to be called before any markup insertion.
			afterInsert: function() {}, // callback: Function to be called after any markup insertion.
			markupSet: [{ // array of hashes: Defines buttons and their behaviors
				name: "Button", // string: Button name
				className: "", // string: Classname to be applied to this button
				key:"", // string:  Shortcut key to be applied to this button. Ctrl+key triggers the action of the button.
				openWith: "<object>", // string | function: Markup to be added before selection. Accepts functions and MagicMarkup
				closeWith: "</object>", // string | function: Markup to be added before selection. Accepts functions and MagicMarkup
				replaceWith: '<img src="myImage.png"/>', // string | function: Text to be added in place of the cursor or selection. Accepts functions.
				placeHolder: "", // string | fuction: Placeholder text to be inserted if no text is selected by the user. Allows MagicMarkups
				beforeInsert: function() {}, // callback: Function to be called before any markup insertion.
				afterInsert: function() {}, // callback: Function to be called after any markup insertion.
				beforeMultiInsert: function() {}, // callback: Function to be called before a multiline markup insertion.
				afterMultiInsert: function() {}, // callback: Function to be called after a multiline markup insertion.
				dropMenu: {}, // hash: Open a dropdown menu with another button set.
			}]
		}
		*/
		Markdown: null,
		Textile: null,
		HTML: {
			bold: {name:'Bold', key:'B', openWith:'(!(<strong>|!|<b>)!)', closeWith:'(!(</strong>|!|</b>)!)'},
			clean: {name:'Clean', className:'clean', replaceWith:function(markitup) {return markitup.selection.replace(/<(.*?)>/g, "")}},
			heading: [
				{name:'Heading 1', key:'1', placeHolder:'Your title here…', openWith:"<h1>", closeWith:"</h1>"},
				{name:'Heading 2', key:'2', placeHolder:'Your title here…', openWith:"<h2>", closeWith:"</h2>"},
				{name:'Heading 3', key:'3', placeHolder:'Your title here…', openWith:"<h3>", closeWith:"</h3>"},
				{name:'Heading 4', key:'4', placeHolder:'Your title here…', openWith:"<h4>", closeWith:"</h4>"},
				{name:'Heading 5', key:'5', placeHolder:'Your title here…', openWith:"<h5>", closeWith:"</h5>"},
				{name:'Heading 6', key:'6', placeHolder:'Your title here…', openWith:"<h6>", closeWith:"</h6>"}
			],
			image: {name:'Picture', key:'P', replaceWith:'<img src="[![Source:!:http://]!]" alt="[![...Alternative text]!]" />'},
			italic: {name:'Italic', key:'I', openWith:'(!(<em>|!|<i>)!)', closeWith:'(!(</em>|!|</i>)!)' },
			link: {name:'Link', key:'L', openWith:'<a href="[![Link:!:http://]!]"(!( title="[![Title]!]")!)>', closeWith:'</a>', placeHolder:'Your text to link...'},
			list: {
				ordered: {name:'Numbered List', openWith:'<ol>\n', closeWith:'</ol>\n' },
				unordered: {name:'Bullet List', openWith:'<ul>\n', closeWith:'</ul>\n' },
				item: {name:'List Item', openWith:'<li>', closeWith:'</li>' },
				definition_list: {name:'Definition List', openWith:'<dl>\n', closeWith:'</dl>\n'},
				term: {name:'Definition Term', openWith:'<dt>', closeWith:'</dt>'},
				definition: {name='Definition', openWith:'<dd>', closeWith:'</dd>'}
			},
			paragraph: {name:'Paragraph', openWith:'<p(!( class="[![Class]!]")!)>', closeWith:'</p>'  },
			preview: {name:'Preview', className:'preview',  call:'preview'},
			separator: {separator:'---------------'},
			strikethrough: {name:'Strikethrough', key:'S', openWith:'<del>', closeWith:'</del>'}
		},
		core = {
			onShiftEnter: {keepDefault:false, replaceWith:'<br />\n'},
			onCtrlEnter: {keepDefault:false, openWith:'\n<p>', closeWith:'</p>'},
			onTab: {keepDefault:false, replaceWith:'    '},
			markupSet: [
			]
		}
	}
};
{name:'Heading 1', key:'1', openWith:'<h1(!( class="[![Class]!]")!)>', closeWith:'</h1>', placeHolder:'Your title here...' },
        {name:'Heading 2', key:'2', openWith:'<h2(!( class="[![Class]!]")!)>', closeWith:'</h2>', placeHolder:'Your title here...' },
        {name:'Heading 3', key:'3', openWith:'<h3(!( class="[![Class]!]")!)>', closeWith:'</h3>', placeHolder:'Your title here...' },
        {name:'Heading 4', key:'4', openWith:'<h4(!( class="[![Class]!]")!)>', closeWith:'</h4>', placeHolder:'Your title here...' },
        {name:'Heading 5', key:'5', openWith:'<h5(!( class="[![Class]!]")!)>', closeWith:'</h5>', placeHolder:'Your title here...' },
        {name:'Heading 6', key:'6', openWith:'<h6(!( class="[![Class]!]")!)>', closeWith:'</h6>', placeHolder:'Your title here...' },
        {name:'Paragraph', openWith:'<p(!( class="[![Class]!]")!)>', closeWith:'</p>'  },
        {separator:'---------------' },
        {name:'Bold', key:'B', openWith:'<strong>', closeWith:'</strong>' },
        {name:'Italic', key:'I', openWith:'<em>', closeWith:'</em>'  },
        {name:'Stroke through', key:'S', openWith:'<del>', closeWith:'</del>' },
        {separator:'---------------' },
        {name:'Ul', openWith:'<ul>\n', closeWith:'</ul>\n' },
        {name:'Ol', openWith:'<ol>\n', closeWith:'</ol>\n' },
        {name:'Li', openWith:'<li>', closeWith:'</li>' },
        {separator:'---------------' },
        {name:'Picture', key:'P', replaceWith:'<img src="[![Source:!:http://]!]" alt="[![Alternative text]!]" />' },
        {name:'Link', key:'L', openWith:'<a href="[![Link:!:http://]!]"(!( title="[![Title]!]")!)>', closeWith:'</a>', placeHolder:'Your text to link...' },
        {separator:'---------------' },
        {name:'Clean', replaceWith:function(h) { return h.selection.replace(/<(.*?)>/g, "") } },
        {name:'Preview', call:'preview', className:'preview' }
markdown = {
	onShiftEnter:		{keepDefault:false, openWith:'\n\n'},
	markupSet: [
		{name:'First Level Heading', key:'1', placeHolder:'Your title here...', closeWith:function(markItUp) { return miu.markdownTitle(markItUp, '=')}},
		{name:'Second Level Heading', key:'2', placeHolder:'Your title here...', closeWith:function(markItUp) { return miu.markdownTitle(markItUp, '-')}},
		{name:'Heading 3', key:'3', openWith:'### ', placeHolder:'Your title here...'},
		{name:'Heading 4', key:'4', openWith:'#### ', placeHolder:'Your title here...'},
		{name:'Heading 5', key:'5', openWith:'##### ', placeHolder:'Your title here...'},
		{name:'Heading 6', key:'6', openWith:'###### ', placeHolder:'Your title here...'},
		{separator:'---------------'},
		{name:'Bold', key:'B', openWith:'**', closeWith:'**'},
		{name:'Italic', key:'I', openWith:'_', closeWith:'_'},
		{separator:'---------------'},
		{name:'Bulleted List', openWith:'- '},
		{name:'Numeric List', openWith:function(markItUp) {
			return markItUp.line+'. ';
		}},
		{separator:'---------------'},
		{name:'Picture', key:'P', replaceWith:'![[![Alternative text]!] {class=image-[![Alignment]!]]}([![Url:!:http://]!]/image_[![Scale]!] "[![Title]!]")'},
		{name:'Link', key:'L', openWith:'[', closeWith:']([![Url:!:http://]!] "[![Title]!]")', placeHolder:'Your text to link here...'},
		{separator:'---------------'},
		{name:'Quotes', openWith:'> '},
		{name:'Code Block / Code', openWith:'(!(\t|!|`)!)', closeWith:'(!(`)!)'},
		{separator:'---------------'},
		{name:'Preview', call:'preview', className:"preview"}
	]
}

// mIu nameSpace to avoid conflict.
miu = {
	markdownTitle: function(markItUp, char) {
		heading = '';
		n = $.trim(markItUp.selection||markItUp.placeHolder).length;
		for(i = 0; i < n; i++) {
			heading += char;
		}
		return '\n'+heading;
	}
}
