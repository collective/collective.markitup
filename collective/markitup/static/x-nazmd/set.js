// -------------------------------------------------------------------
// markItUp!
// -------------------------------------------------------------------
// Copyright (C) 2008 Jay Salvat
// http://markitup.jaysalvat.com/
// -------------------------------------------------------------------
// MarkDown tags example
// http://en.wikipedia.org/wiki/Markdown
// http://daringfireball.net/projects/markdown/
// -------------------------------------------------------------------
// Feel free to add more tags
// -------------------------------------------------------------------
mySettings = {
	onShiftEnter:		{keepDefault:false, openWith:'\n\n'},
	markupSet: [
		{name:'First Level Heading', key:'1', placeHolder:'Your title here...', closeWith:function(markItUp) { return miu.markdownTitle(markItUp, '=') } },
		{name:'Second Level Heading', key:'2', placeHolder:'Your title here...', closeWith:function(markItUp) { return miu.markdownTitle(markItUp, '-') } },
		{name:'Heading 3', key:'3', openWith:'### ', placeHolder:'Your title here...' },
		{name:'Heading 4', key:'4', openWith:'#### ', placeHolder:'Your title here...' },
		{name:'Heading 5', key:'5', openWith:'##### ', placeHolder:'Your title here...' },
		{name:'Heading 6', key:'6', openWith:'###### ', placeHolder:'Your title here...' },
		{separator:'---------------' },		
		{name:'Bold', key:'B', openWith:'**', closeWith:'**'},
		{name:'Italic', key:'I', openWith:'_', closeWith:'_'},
		{separator:'---------------' },
		{name:'Bulleted List', openWith:'- ' },
		{name:'Numeric List', openWith:function(markItUp) {
			return markItUp.line+'. ';
		}},
		{separator:'---------------' },
		{name:'Picture', key:'P', replaceWith:'![[![Alternative text]!]]([![Url:!:http://]!] "[![Title]!]")'},
		{name:'Link', key:'L', openWith:'[', closeWith:']([![Url:!:http://]!] "[![Title]!]")', placeHolder:'Your text to link here...' },
		{separator:'---------------'},
		{name:'Table', className:"tbl", replaceWith:'\n| Column 1   | Column 2               | Column 3     |\n|------------|------------------------|--------------|\n| Things     | Milk                   | Pride        |\n| Stuff      | Eggs                   | Avarice      |\n| Junk       | Butter                 | Sloth        |\n| Crud       | Zesty Italian Dressing | Humility     |\n\n'},
		{name:'Quotes', openWith:'> '},
		{separator:'---------------'},
		{name:'Show/Hide', className:"sh", replaceWith:'~naz:showhide\n\n## Show-Hide Heading ##\n\n### First Subheading ###\n\nYour text and stuff goes here.\n\n### Another Subheading ###\n\nMore of your text. You can even add *emphasized* and **strongly emphasized** text if that makes you happy.\n\n~/naz:showhide\n'},
		{name:'Section Promo Boxes', className:"pb", replaceWith:'~naz:promoboxes\n\n* ### Promo Item 1 ####\n  Promotext line 1 Lorem ipsum dolor sit amet, consectetur adipisicing elit.\n* ### Promo Item 2 ###\n  Promotext line 2 Lorem ipsum dolor sit amet, consectetur adipisicing elit.\n\n~/naz:promoboxes\n'},
		{name:'Quick Info', className:"qi", replaceWith:'~naz:quickinfo\n\n## Quick Info ##\nMajor\n: Accounting\n\nHometown\n: Springfield, USA\n\n~/naz:quickinfo\n'},
		{name:'Tasks/Resources', className:"tr", replaceWith:'~naz:tasks\n\n## Tasks/Resources ##\n\n* Request Info\n* Explore our majors\n* Make bacon\n\n~/naz:tasks\n'},
		{separator:'---------------'},
		{name:'Callout: Purple', className:"co-purple", replaceWith:'~naz:callout-purple\n\n## Optional Heading ##\nLorem ipsum dolor sit amet, **consectetur** adipisicing elit.\n\n~/naz:callout-purple\n'},
		{name:'Callout: Orange', className:"co-orange", replaceWith:'~naz:callout-orange\n\n## Optional Heading ##\nLorem ipsum dolor sit amet, **consectetur** adipisicing elit.\n\n~/naz:callout-orange\n'},
		{name:'Callout: Blue', className:"co-blue", replaceWith:'~naz:callout-blue\n\n## Optional Heading ##\nLorem ipsum dolor sit amet, **consectetur** adipisicing elit.\n\n~/naz:callout-blue\n'},
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
