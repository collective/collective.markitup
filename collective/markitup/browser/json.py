# encoding: utf-8
from zope.site.hooks import getSite
from Products.Five.browser import BrowserView

class getJSON(BrowserView):
	"""Get the JSON from the registry."""

	def __call__(self):
		"""Return the JSON."""
		registry = getSite().portal_registry
		if "name" in self.request:
			name = "collective.markitup." + self.request["name"]
			if name in registry:
				return registry[name]
		return "{ }"
