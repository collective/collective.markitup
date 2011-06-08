# encoding: utf-8
from Products.Five.browser import BrowserView

from Products.PortalTransforms.data import datastream
from Products.PortalTransforms.transforms.markdown_to_html import markdown
from Products.PortalTransforms.transforms.textile_to_html import textile
from Products.PortalTransforms.transforms.rest import rest

class Transform(BrowserView):
	"""Preview the transform of Markup to HTML."""
	
	def __init__(self, context, request):
		self.context = context
		self.request = request

	def __call__(self):
		t = "<html><head><title>Preview</title></head><body>%s</body></html>"
		if "markdown" in self.request.form: return t % self.preview_markdown()
		if "textile" in self.request.form: return t % self.preview_textile()
		if "rest" in self.request.form: return t % self.preview_rest()
		return t % ""

	def preview_markdown(self):
		"""Return the transformed HTML."""
		converter = markdown()
		data = datastream("markdown")
		orig = self.request.form.get("markdown", "")
		return markdown().convert(orig, data)

	def preview_textile(self):
		"""Return the transformed HTML."""
		converter = textile()
		data = datastream("textile")
		orig = self.request.form.get("textile", "")
		return converter.convert(orig, data)

	def preview_rest(self):
		"""Return the transformed HTML."""
		converter = rest()
		data = datastream("rest")
		orig = self.request.form.get("rest", "")
		return converter.convert(orig, data)

