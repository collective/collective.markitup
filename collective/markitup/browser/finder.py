from collective.plonefinder.browser.finder import Finder as FinderBase

class Finder(FinderBase):
	"""
	Custom Finder class for MarkItUp Editor
	"""

	def __init__(self, context, request):
		super(Finder, self).__init__(context, request)
		self.findername = 'markitup_finder'
		self.multiselect = False
		self.selectiontype = 'uid' # url is the other option. It's broken.
		self.jsaddons = "Browser.selectItem = markitup.finder.selectItem;"
		# HACK: !important - this is just for testing
		self.cssaddons = ".closeWindow { display: none !important; }"
		self.showbreadcrumbs = True

class ImageFinder(Finder):
	"""
	Custom Finder class for MarkItUp Editor
	for finding images.
	"""

	def __init__(self, context, request):
		super(ImageFinder, self).__init__(context, request)
		self.findername = 'markitup_imagefinder'
		self.allowupload = True
		self.allowaddfolder = True
		self.typeview = 'image'
		self.types = 'Image'
		self.jsaddons = "Browser.selectItem = markitup.finder.selectImage;"

