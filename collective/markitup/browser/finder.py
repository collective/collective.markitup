from Acquisition import aq_inner
from zope.app.component.hooks import getSite
from collective.plonefinder.browser.finder import Finder as FinderBase

class Finder(FinderBase):
	"""
	Custom Finder class for MarkItUp Editor
	"""

	findername = 'markitup_finder'
	multiselect = False
	allowupload = True
	allowaddfolder = True

	def __call__(self):
		context = aq_inner(self.context)
		request = aq_inner(self.request)
		session = request.get('SESSION', {})
		self.showbreadcrumbs = request.get(
			'showbreadcrumbs',
			self.showbreadcrumbs,
		)
		# scopeInfos must be set here because we need it in  set_session_props
		self.setScopeInfos(context, request, self.showbreadcrumbs)
		# store MarkItUpEditor function name in session for ajax calls
		if session:
			session.set(
				'MarkItUpEditorFuncNum', 
				request.get('MarkItUpEditorFuncNum', ''),
			)
		# redefine some js methods (to select items ...)
		# self.jsaddons = self.get_jsaddons()
		# set media type
		# self.set_media_type()
		# store some properties in session
		# (portal_type used for upload and folder creation ...)
		# self.set_session_props()
		# the next call to setScopeInfos must be empty
		self.setScopeInfos = self.empty_setScopeInfos
		return super(Finder, self).__call__()

	def empty_setScopeInfos(self, context, request, showbreadcrumbs):
		"""
		setScopeInfos redefined (the job is done before Finder.__call__() )
		"""
		pass

	def set_media_type(self):
		"""
		set media type used for ckeditor
		"""
		request = self.request
		self.media = request.get('media', 'file')

	def set_session_props(self):
		"""
		Take some properties from ckeditor to store in session
		"""
		request = self.request
		session = request.get('SESSION', {})

		session.set('media', self.media)

		# typeupload (portal_type used for upload)
		self.typeupload = self.get_type_for_upload(self.media)
		if session:
				session.set('typeupload', self.typeupload)

		# mediaupload
		# the mediaupload force the content-type selection in fileupload
		# see quick_upload.py in collective.quickupload
		# example (*.jpg, *.gif, ...) when media='image'
		if session:
				if self.media != 'file':
						session.set('mediaupload', self.media)
				else:
						session.set('mediaupload', '*.*')

		# typefolder
		self.typefolder = self.get_type_for_upload('folder')
		if session:
				session.set('typefolder', self.typefolder)


	def get_type_for_upload(self, media):
		"""
		return MarkItUpEditor settings for unique media_portal_type
		"""
		ckprops = getSite().portal_properties.ckeditor_properties
		prop = ckprops.getProperty(media+'_portal_type')
		if prop == 'auto':
			return ''
		elif prop != 'custom':
			return prop

		scopetype = self.scopetype

		# custom type depending on scope
		mediatype = ''
		customprop = ckprops.getProperty(media+'_portal_type_custom')
		for pair in customprop:
			listtypes = pair.split('|')
			if listtypes[0]=='*':
				mediatype = listtypes[1]
			elif listtypes[0]== scopetype:
				mediatype = listtypes[1]
				break
		return mediatype

	def get_jsaddons(self):
		"""
		redefine selectItem method
		in js string
		"""
		request = aq_inner(self.request)
		session = request.get('SESSION', {})
		MarkItUpEditorFuncNum = session.get('MarkItUpEditorFuncNum', '')

		jsstring = """
			selectMarkItUpEditorItem = function (selector, title, image_preview) {
				if (typeof image_preview == "undefined") image_preview = false;
				if (image_preview) selector = selector + '/image_preview';
				window.opener.MARKITUPEDITOR.tools.callFunction(
					%s, 'resolveuid/' + selector
				);
				window.close();
			};
			Browser.selectItem = selectMarkItUpEditorItem;
		""" % MarkItUpEditorFuncNum

		return jsstring