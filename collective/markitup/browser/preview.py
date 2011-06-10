# encoding: utf-8
from zope.app.component.hooks import getSite
from Products.Five.browser import BrowserView

from Products.PortalTransforms.data import datastream
from Products.PortalTransforms.transforms.markdown_to_html import markdown
from Products.PortalTransforms.transforms.textile_to_html import textile
from Products.PortalTransforms.transforms.rest import rest

class Transform(BrowserView):
	"""Preview the transform of Markup to HTML."""

	pseudo_template = """
		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
		"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html>
			<head>
				<title>Preview</title>
				<script type="text/javascript" src="%s"></script>
			</head>
			<body>%s</body>
		</html>
	"""

	def __init__(self, context, request):
		super(Transform, self).__init__(context, request)
		root = getSite().portal_url.getPortalPath()
		script = root + "/++resource++collective.markitup/preview_styler.js"
		self.pseudo_template = self.pseudo_template % (script, "%s")

	def __call__(self):
		"""Return the preview as a stringified HTML document."""
		if "markdown" in self.request.form:
			return self.pseudo_template % self.preview_markdown()
		if "textile" in self.request.form:
			return self.pseudo_template % self.preview_textile()
		if "rest" in self.request.form:
			return self.pseudo_template % self.preview_rest()
		return ""

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

