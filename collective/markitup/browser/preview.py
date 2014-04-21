# encoding: utf-8
from zope.site.hooks import getSite
from Products.Five.browser import BrowserView

class Transform(BrowserView):
	"""Preview the transform of Markup to HTML."""

	def __init__(self, context, request):
		super(Transform, self).__init__(context, request)
		root = getSite().portal_url.getPortalPath()
		self.js = root + "/++resource++collective.markitup/preview_styler.js"

	def content(self):
		"""Return the preview as a stringified HTML document."""
		convertTo = getSite().portal_transforms.convertTo
		mimetype, data = self.request.form.items()[0]
		return convertTo("text/x-html-safe", data, mimetype=mimetype).getData()
