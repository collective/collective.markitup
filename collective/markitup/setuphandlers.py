from collective.markitup import LOG

def uninstallSteps(context):
	site = context.getSite()
	uninstallSiteProperties(context)
	LOG.info('MarkItDown for Plone uninstalled')

def uninstallSiteProperties(site) :
	"""
	Remove MarkItDown from available editors
	(necessary until this can be done with GS).
	Hat Tip: collective.ckeditor
	"""
	ptool = site.portal_properties
	stp = ptool.site_properties
	ae = list(stp.getProperty('available_editors'))
	if 'MarkItDown' in ae :
		ae.remove('MarkItDown')
		stp.manage_changeProperties(REQUEST=None, available_editors=ae)
