# encoding: utf-8
from zope.component import getUtility
from plone.registry.interfaces import IRegistry
from zope.app.component.hooks import getSite
from Products.Five.browser import BrowserView

class getJSON(BrowserView):
	"""Get the JSON from the registry."""

	def __call__(self):
		"""Return the JSON."""
		registry = getUtility(IRegistry)
		if "name" in self.request:
			name = "collective.markitup." + self.request["name"]
			if name in registry:
				print "Retrieved %s from registry" % name
				return registry[name]
		return "{ }"
