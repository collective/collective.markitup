from Acquisition import aq_base, aq_inner
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone.interfaces import IPloneSiteRoot
from collective.plonefinder.browser.finder import Finder

class MarkItUpFinder(Finder):
	"""
	Custom Finder class for MarkItUp Editor.
	"""

	def __init__(self, context, request):
		super(MarkItUpFinder, self).__init__(context, request)    
		self.findername = 'plone_markitupfinder'
		self.multiselect = False 
		self.allowupload = True
		self.allowaddfolder = True
		context = aq_inner(context) 
		
	def __call__(self):
		context = aq_inner(self.context)
		request = aq_inner(self.request)                                       
		session = request.get('SESSION', {})  
		self.showbreadcrumbs =  request.get('showbreadcrumbs', self.showbreadcrumbs)
		# scopeInfos must be set here because we need it in  set_session_props
		self.setScopeInfos(context, request, self.showbreadcrumbs)     
		# store MarkItUpEditor function name in session for ajax calls
		if session:
			session.set('MarkItUpEditorFuncNum', request.get('MarkItUpEditorFuncNum', ''))    
		# redefine some js methods (to select items ...)
		#self.jsaddons = self.get_jsaddons()
		# set media type
		#self.set_media_type()
		# store some properties in session (portal_type used for upload and folder creation ...)
		#self.set_session_props()
		# the next call to setScopeInfos must be empty
		self.setScopeInfos = self.empty_setScopeInfos
		return super(MarkItUpFinder, self).__call__()       
		
	def empty_setScopeInfos(self, context, request, showbreadcrumbs):
		"""
		setScopeInfos redefined (the job is done before Finder.__call__() )
		"""
		pass

	def set_media_type(self) :
		"""
		set media type used for ckeditor
		"""
		request = self.request                                       
		session = request.get('SESSION', {})
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
		if session :
				session.set('typeupload', self.typeupload)
		
		# mediaupload
		# the mediaupload force the content-type selection in fileupload
		# see quick_upload.py in collective.quickupload
		# example (*.jpg, *.gif, ...) when media='image'
		if session :
				if self.media != 'file' :
						session.set('mediaupload', self.media)
				else :
						session.set('mediaupload', '*.*')
		
		# typefolder
		self.typefolder = self.get_type_for_upload('folder')
		if session :
				session.set('typefolder', self.typefolder)        
					
			
	def get_type_for_upload(self, media) :
		"""
		return MarkItUpEditor settings for unique media_portal_type
		"""
		context = aq_inner(self.context)
		request = self.request                                       
		session = request.get('SESSION', {})
		
		pprops = getToolByName(context, 'portal_properties')
		ckprops = pprops.ckeditor_properties
		
		prop = ckprops.getProperty('%s_portal_type' %media)
		
		if prop == 'auto' :
				return ''
		elif prop != 'custom' :
				return prop
		
		scopetype = self.scopetype
		
		# custom type depending on scope
		mediatype = ''
		customprop = ckprops.getProperty('%s_portal_type_custom' %media)        
		for pair in customprop :
				listtypes = pair.split('|')
				if listtypes[0]=='*' :
						mediatype = listtypes[1]
				elif listtypes[0]== scopetype :    
						mediatype = listtypes[1]
						break        
		return mediatype        
		

	def get_jsaddons(self) :
		"""
		redefine selectItem method
		in js string
		"""    
		context = aq_inner(self.context)
		request = aq_inner(self.request)                                       
		session = request.get('SESSION', {})
		MarkItUpEditor = session.get('MarkItUpEditor', '')
		MarkItUpEditorFuncNum = session.get('MarkItUpEditorFuncNum', '')

		jsstring = """
			selectMarkItUpEditorItem = function (selector, title, image_preview) {
			image_preview = (typeof image_preview != "undefined") ? image_preview : false;
			if (image_preview) selector = selector + '/image_preview' ;
			window.opener.MARKITUPEDITOR.tools.callFunction( %s, 'resolveuid/' + selector );
			window.close();
			};
			Browser.selectItem = selectMarkItUpEditorItem;
		""" % MarkItUpEditorFuncNum

		return jsstring