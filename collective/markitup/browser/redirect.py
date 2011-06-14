# encoding: utf-8
from zope.app.component.hooks import getSite
from Products.Five.browser import BrowserView

class RedirectUID(BrowserView):
	"""
	Hack to allow us to use UIDs to show images.
	This shouldn't need to exist.
	"""
		
	def __call__(self):
		root = getSite().portal_url.getPortalPath()
		parts = self.request.form.get("uid", "").split("/", 1)
		if len(parts) == 2:
			uid, remainder = parts
		else:
			uid = parts[0]
			remainder = ""
		obj = getSite().reference_catalog.lookupObject(uid)
		if obj:
			result = "/".join(obj.getPhysicalPath())
		else:
			result = root + "/" + uid # Expecting a 404 at this point.

		return self.request.response.redirect(result + "/" + remainder)
